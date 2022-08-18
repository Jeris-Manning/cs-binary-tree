import {
	action, computed,
	observable,
	onBecomeObserved,
	onBecomeUnobserved, runInAction,
} from 'mobx';
import {IS_DEBUG} from '../../stores/RootStore';
import {DiffMs, NowMs} from '../thyme';

export type StacheKey = string; // ASLIS_CTHING
export type DatKey = string;
export type DatSyncError = string;
export type DatRaw = {
	key: DatKey,
	...any,
}
export type StacheToken = string;
export type StacheModeType = string;
const FULL: StacheModeType = 'full';
const ON_DEMAND: StacheModeType = 'onDemand';
const ENUM: StacheModeType = 'enum';
export const STACHE_MODE = {
	full: FULL,
	onDemand: ON_DEMAND,
	enum: ENUM,
}

export const STACHE_TOKEN_KEY = '__TOKEN';

/* CLUTCH */
export class Clutch<TDat> {
	@observable key: DatKey = '';
	
	@observable isPending: boolean = false; // waiting for sync result
	@observable isSynced: boolean = false; // invalidation also sets this to false
	@observable isInvalid: boolean = false; // clutch is invalid and will never be valid
	@observable syncError: DatSyncError = '';
	
	@observable dat: TDat = {};
	
	@computed get label(): string {
		return this.dat.label;
	}
	
	__isObserved: boolean = false;
	
	constructor(key: DatKey, dat: TDat, onStartObserve, onStopObserve) {
		this.key = key;
		this.dat = dat;
		onBecomeObserved(this, 'dat', () => onStartObserve(this));
		onBecomeUnobserved(this, 'dat', () => onStopObserve(this));
	}
}
const slog = `color: #8a8a8a`;

const DEBUG_SKIP_PRELOAD: boolean = false;

/* STACHE */
export class Stache<TDat> {
	
	ToLog = (msg) => `%c∐ ${this.name} ${msg}`;
	
	/* CONFIG */
	makeStub: (key: DatKey) => TDat; // make dat stub
	mode: StacheModeType;
	useEnumMode; // todo: remove
	
	/* injected */
	key: StacheKey; // ASLIS_CTHING
	name: string; // cThing
	storage: LocalForage;
	markToSync: (DatKey) => void;
	
	localCache: Map<DatKey, Clutch<TDat>> = new Map();
	@observable token: StacheToken;
	finishPreload;
	awaitingPreload: Promise<void> = new Promise(resolve => this.finishPreload = resolve);
	@observable isPreloaded: boolean = false;
	
	observedKeys: Map<DatKey, boolean> = new Map();
	pendingKeys: Map<DatKey, boolean> = new Map();
	@observable observedCount: number = 0;
	@observable pendingCount: number = 0;
	
	constructor(datClass, mode: StacheModeType) {
		this.makeStub = datClass.Stub;
		this.useEnumMode = datClass.UseEnumMode;
		this.mode = mode;
		
		if (!datClass.Stub)
			throw new Error(`${datClass.constructor.name} Stache Dat needs Stub(key) function`);
	}
	
	@action _Preload = async () => {
		if (this.mode === ON_DEMAND) {
			if (IS_DEBUG()) console.log(this.ToLog(`Stache._Preload skipped ${this.mode}`), slog);
			this.isPreloaded = true;
			this.finishPreload();
			return;
		}
		
		if (IS_DEBUG() && DEBUG_SKIP_PRELOAD) {
			console.log(this.ToLog(`Stache._Preload skipped DEBUG`), slog);
			this.isPreloaded = true;
			this.finishPreload();
			return;
		}
		
		if (IS_DEBUG()) console.log(this.ToLog(`Stache._Preload start`), slog);
		const start = NowMs();
		
		await this.storage.iterate((datRaw, datKey: DatKey) => {
			if (datKey !== STACHE_TOKEN_KEY) {
				const stub = this._GetLocalOrStub(datKey);
				this._ApplySync(stub, datRaw);
				// if (!this.localCache.has(datKey)) { // skip anything already requested
				// 	const stub = this._Stub(datKey);
				// 	this._ApplySync(stub, datRaw);
				// }
			}
		});
		
		if (IS_DEBUG()) console.log(this.ToLog(`Stache._Preload end ${DiffMs(start)}ms`), slog);
		
		runInAction(() => {
			this.isPreloaded = true;
			this.finishPreload();
		});
	};
	
	@action _Stub = (key: DatKey): Clutch<TDat> => {
		// console.log(this.ToLog(`_Stub: ${key}`), slog);
		
		const clutch = new Clutch(
			key,
			this.makeStub(key),
			this._OnClutchStartObserve,
			this._OnClutchStopObserve
		);
		
		this.localCache.set(key, clutch);
		
		if (this.useEnumMode) this._OnClutchStartObserve(clutch);
		
		return clutch;
	};
	
	@action _OnClutchStartObserve = (clutch: Clutch<TDat>): void => {
		// console.log(this.ToLog(`👀 ++OBSERVE: ${clutch.key}`), slog);
		clutch.__isObserved = true;
		this.observedKeys.set(clutch.key, true);
		
		if (clutch.isSynced) return;
		
		this._MarkClutchNeedsSync(clutch);
	}
	
	@action _OnClutchStopObserve = (clutch: Clutch<TDat>): void => {
		// console.log(this.ToLog(`💤 --observe: ${clutch.key}`), slog);
		if (this.useEnumMode) return;
		
		clutch.__isObserved = false;
		this.observedKeys.delete(clutch.key);
	}
	
	@action _MarkClutchNeedsSync = async (clutch: Clutch<TDat>): Promise<void> => {
		if (!this.isPreloaded) await this.awaitingPreload;
		
		// if (clutch.isPending) { return; } // already sent request
		if (clutch.isSynced) return;
		
		// console.log(this.ToLog(`_MarkClutchNeedsSync: ${clutch.key}`), slog);
		
		runInAction(() => {
			clutch.isPending = true;
			this.pendingKeys.set(clutch.key, true);
			clutch.isSynced = false;
			clutch.syncError = '';
		});
		
		/* first check if it's in storage */
		const datRawInStorage =
			await this._GetFromStorage(clutch.key);
		
		if (datRawInStorage) {
			if (IS_DEBUG()) console.log(this.ToLog(`_CheckStorageOrMarkToSync: ${clutch.key}, was in storage`), slog);
			await this._ApplySync(clutch, datRawInStorage);
			return;
		}
		
		/* tell worker we need this dat */
		this.markToSync(clutch.key);
	};
	
	@action _ReceivedSync = async (key: DatKey, error: DatSyncError, token: StacheToken): Promise<void> => {
		if (IS_DEBUG()) console.log(this.ToLog(`ReceivedSync: ${key} (t${token} ${error || ''})`), slog);
		
		this.token = token;
		const clutch = this.localCache.get(key);
		
		if (!clutch) {
			// console.log(this.ToLog(`_ReceivedSync: ${key}, but irrelevant`), slog);
			return; // not relevant
		}
		
		if (error) {
			this._ApplyError(clutch, error);
			return;
		}
		
		const notRelevant = !clutch.isPending && !clutch.__isObserved;
		if (notRelevant) {
			clutch.isSynced = false;
			clutch.syncError = '';
			return;
		}
		
		const datRaw =
			await this._GetFromStorage(clutch.key);
		// console.log(this.ToLog(`GetFromStorage(${key})`), datRaw, slog);
		
		if (!datRaw) {
			// console.warn(this.ToLog(`ReceivedSync but missing from storage ${clutch.key}`), slog);
			// was probably just invalidated, so markToSync again
			this.markToSync(clutch.key);
			return;
		}
		
		this._ApplySync(clutch, datRaw);
		
		// console.log(this.ToLog(`ReceivedSync and applied (${key})`), slog, datRaw);
	};
	
	@action _Invalidate = (key: DatKey, token: StacheToken): void => {
		if (IS_DEBUG()) console.log(this.ToLog(`_Invalidate: ${key} (t${token})`), slog);
		
		this.token = token;
		const clutch = this.localCache.get(key);
		if (!clutch) {
			// console.log(this.ToLog(`_Invalidate: ${key} SKIPPING (not relevant)`), slog);
			return; // not relevant
		}
		
		this._InvalidateClutch(clutch);
	};
	
	@action _InvalidateAll = (token: StacheToken): void => {
		if (IS_DEBUG()) console.log(this.ToLog(`_InvalidateAll (t${token})`), slog);
		
		this.token = token;
		this.localCache.forEach(this._InvalidateClutch);
	};
	
	@action _InvalidateClutch = (clutch: Clutch<TDat>): void => {
		clutch.isSynced = false;
		clutch.syncError = '';
		
		if (clutch.__isObserved) {
			this._MarkClutchNeedsSync(clutch);
		}
	};
	
	@action _ApplySync = (clutch: Clutch<TDat>, datRaw: DatRaw): void => {
		clutch.dat.ApplyDatRaw(datRaw);
		clutch.isPending = false;
		this.pendingKeys.delete(clutch.key);
		clutch.isSynced = true;
		clutch.syncError = '';
		// console.log(this.ToLog(`_ApplySync: ${clutch.key} applied to dat`), datRaw, slog);
	};
	
	@action _ApplyError = (clutch: Clutch<TDat>, syncError = ''): void => {
		clutch.isPending = false;
		this.pendingKeys.delete(clutch.key);
		clutch.isSynced = true;
		clutch.syncError = syncError;
		console.warn(this.ToLog(`_ApplyError: ${clutch.key} ${syncError}`));
	}
	
	@action _GetFromStorage = async (key: DatKey): Promise<DatRaw> => {
		const start = NowMs();
		
		const datRaw =
			await this.storage.getItem(key);
		
		if (IS_DEBUG()) {
			console.log(this.ToLog(`_GetFromStorage(${key}) took ${DiffMs(start)}ms, success: ${!!datRaw}`), slog);
		}
		
		return datRaw;
	}
	
	/** gets what we have or creates stub */
	@action _GetLocalOrStub = (key: DatKey): Clutch<TDat> => {
		const local = this.localCache.get(key);
		if (local) {
			// console.log(this.ToLog(`_GetLocalOrStub: ${key} found local`), slog);
			return local;
		}
		
		return this._Stub(key);
	};
	
	@action _MakeClutchFacade = (error: DatSyncError = 'FACADE') => {
		// console.log(this.ToLog(`_MakeClutchFacade: ${error}`), slog);
		
		const facade = new Clutch(
			'INVALID',
			this.makeStub(),
			(_) => ({}),
			(_) => ({}),
		);
		facade.syncError = error;
		facade.isInvalid = true;
		return facade;
	}
	
	@action UpdateCounts = () => {
		this.observedCount = this.observedKeys.size;
		this.pendingCount = this.pendingKeys.size;
	}
	
	
	/*  public API */
	
	/**
	 * return local version
	 * OR stub (cues sync)
	 * OR if !key, then null || facade
    */
	GetOrStub = (key: DatKey, facadeIfInvalid: boolean = false, log: string = ''): Clutch<TDat> => {
		// console.log(this.ToLog(`GetOrStub${log ? ` [${log}]` : ''}: ${key}`), slog);
		
		if (this.useEnumMode) {
			throw new Error(this.ToLog(`useEnumMode is enabled, use GetEnumClutch instead `));
		}
		
		if (!key) {
			return facadeIfInvalid
				? this._MakeClutchFacade('INVALID_KEY')
				: null;
		}
		
		return this._GetLocalOrStub(String(key));
	};
	
	/**
	 * keys.map: GetOrStub
	 * OR null if !keys || 0 length
	 */
	GetMulti = (keys: DatKey[], facadeIfInvalid: string = false, log: string = ''): Clutch<TDat>[] => {
		if (!keys || !keys.length) return null;
		return keys.map(key => this.GetOrStub(key, facadeIfInvalid, log));
	};
	
	/**
	 * Gets dat (or stub) with full entries. Will always be 'observed'. Requires: useEnumMode
     */
	GetEnumClutch = (): Clutch<TDat> => {
		if (!this.useEnumMode) throw new Error(this.ToLog(`GetEnumClutch requires 'useEnumMode'`));
		return this._GetLocalOrStub('ENUM');
	};
	
	GetFacade = (): Clutch<TDat> => {
		return this._MakeClutchFacade('INVALID_KEY');
	}
	
	// Note to future:
	// I deliberately did not add an async Get (e.g. await Get)
	// Use stubs! Be more reactive!
	// If data is required (for calculations, etc.), then add it as a query
}



// datAsyncThing = promisedComputed(0, async () => {
// 	// if we used computed-async-mobx
// 	// hmm TODO
// 	const thing = await request();
// 	return thing;
// });