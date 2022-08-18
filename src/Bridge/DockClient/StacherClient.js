import localforage from 'localforage';
import {action, computed, observable, runInAction} from 'mobx';
import type {DatKey, StacheKey, StacheToken} from './Stache';
import {vow} from '../misc/$j';
import {Stache} from './Stache';
import {DiffMs, NowMs} from '../thyme';

const STACHE_KEY_PREFIX = 'ASLIS_';
const INFO_STORAGE_KEY = 'ASLIS_STACHER_INFO';


export type StacheClientConfig = {
	staches: {},
}

/* outgoing to worker */

type T_ToWorker_Initialize = {
	stacheKeys: StacheKey[];
}

type T_ToWorker_Sync = {
	stacheKey: StacheKey,
	datKey: DatKey,
}

type T_ToWorker_Notice = {
	initialize: T_ToWorker_Initialize,
	sync: T_ToWorker_Sync,
}

/* incoming from worker */

type T_FromWorker_Sync = {
	stacheKey: StacheKey,
	datKey: DatKey,
	error: string,
	token: StacheToken,
}

type T_FromWorker_Invalidate = {
	stacheKey: StacheKey,
	datKey: DatKey,
	token: StacheToken,
}

type T_FromWorker_InvalidateAll = {
	stacheKey: StacheKey,
	token: StacheToken,
}

type T_FromWorker_Notice = {
	sync: T_FromWorker_Sync,
	invalidate: T_FromWorker_Invalidate,
	invalidateAll: T_FromWorker_InvalidateAll,
}

const TOTAL_COUNT_INTERVAL: number = 100;

export class StacherClient {
	
	ToLog = (msg) => `∐ StacherClient ${msg}`;
	
	/* DockClient API */
	SendWorkerRequest = async (content) => {}; // (UNUSED) injected by DockClient
	SendWorkerNotice = (content: T_ToWorker_Notice) => {}; // injected by DockClient
	ReceiveWorkerNotice = (content: T_FromWorker_Notice) => this._FromWorker_Notice(content);
	
	
	@observable staches = {};
	@observable stacheKeys = [];
	@observable allStaches = [];
	@observable infoStorage: LocalForage;
	finishAllPreload;
	awaitingAllPreload: Promise<void> = new Promise(resolve => this.finishAllPreload = resolve);
	@observable isAllPreloaded: boolean = false;
	
	@action Initialize = (config: StacheClientConfig) => {
		this.infoStorage = localforage.createInstance({
			name: INFO_STORAGE_KEY,
			driver: localforage.INDEXEDDB,
		});
		
		const stacheKeys = [];
		const allStaches = [];
		
		for (const objKey of Object.keys(config.staches)) {
			
			const stache = config.staches[objKey];
			const stacheKey = STACHE_KEY_PREFIX + objKey.toUpperCase();
			
			stache.key = stacheKey;
			stache.name = objKey;
			stache.storage = localforage.createInstance({
				name: stacheKey,
				driver: localforage.INDEXEDDB,
			});
			stache.markToSync = (datKey) => this._MarkToSync(stacheKey, datKey);
			
			this.staches[stacheKey] = stache;
			stacheKeys.push(stacheKey);
			allStaches.push(stache);
		}
		
		this.stacheKeys = stacheKeys;
		this.allStaches = allStaches;
		
		console.log(this.ToLog(`INITIALIZED, sending worker initialize: ${stacheKeys.join()}`));
		const workerInitialize: T_ToWorker_Initialize = {
			stacheKeys: stacheKeys,
		};
		
		this.SendWorkerNotice({initialize: workerInitialize});
		
		setInterval(this.UpdateCounts, TOTAL_COUNT_INTERVAL);
	};
	
	PreloadAll = async () => {
		console.log(this.ToLog('PRELOAD ALL START -----'));
		const start = NowMs();
		
		// await vow(
		// 	this.allStaches.map(stache => stache._Preload())
		// );
		
		for (const stache of this.allStaches) {
			await stache._Preload();
		}
		
		console.log(this.ToLog(`PRELOAD ALL END ---- ${DiffMs(start)}ms`));
		
		runInAction(() => {
			this.isAllPreloaded = true;
			this.finishAllPreload();
		});
	};
	
	_MarkToSync = (stacheKey: StacheKey, datKey: DatKey) => {
		// console.log(this.ToLog(`_MarkToSync ${stacheKey}.${datKey}`));
		// TODO: batch/debounce here or on worker or both?
		const sync: T_ToWorker_Sync = {
			stacheKey: stacheKey,
			datKey: datKey,
		};
		
		this.SendWorkerNotice({sync: sync});
	};
	
	
	_FromWorker_Notice = async (content: T_FromWorker_Notice) => {
		// console.log(this.ToLog('_FromWorker_Notice'), content);
		
		if (content.sync) {
			await this._FromWorker_ReceivedSync(content.sync);
			return;
		}
		
		if (content.invalidate) {
			await this._FromWorker_Invalidate(content.invalidate);
			return;
		}
		
		if (content.invalidateAll) {
			await this._FromWorker_InvalidateAll(content.invalidateAll);
			return;
		}
		
		if (content.error) {
			throw new Error(`TODO: handle stacher sync error`, content);
		}
		
		throw new Error(`Unknown _FromWorker_Notice content`, content);
	};
	
	
	_FromWorker_ReceivedSync = async (sync: T_FromWorker_Sync) => {
		// console.log(this.ToLog(`_FromWorker_ReceivedSync: ${sync.stacheKey}`), sync);
		const stache = this.GetStache(sync.stacheKey);
		await stache._ReceivedSync(sync.datKey, sync.error, sync.token);
	};
	
	_FromWorker_Invalidate = async (invalidate: T_FromWorker_Invalidate) => {
		// console.log(this.ToLog(`_FromWorker_Invalidate: ${invalidate.stacheKey}`), invalidate);
		const stache = this.GetStache(invalidate.stacheKey);
		await stache._Invalidate(invalidate.datKey, invalidate.token);
	};
	
	_FromWorker_InvalidateAll = async (invalidateAll: T_FromWorker_InvalidateAll) => {
		// console.log(this.ToLog(`_FromWorker_InvalidateAll: ${invalidateAll.stacheKey}`), invalidateAll);
		const stache = this.GetStache(invalidateAll.stacheKey);
		await stache._InvalidateAll(invalidateAll.token);
	};
	
	
	GetInfo = async (key) => this.infoStorage.getItem(key);
	SetInfo = async (key, val) => this.infoStorage.setItem(key, val);
	RemoveInfo = async (key) => this.infoStorage.removeItem(key);
	
	GetStache = (stacheKey): Stache => {
		const stache = this.staches[stacheKey];
		if (!stache) throw new Error(`Missing stache: ${stacheKey}`);
		return stache;
	};
	
	
	
	@observable totalObservedCount: number = 0;
	@observable totalPendingCount: number = 0;
	
	@action UpdateCounts = () => {
		let observed = 0;
		let pending = 0;
		
		for (const stache: Stache of this.allStaches) {
			stache.UpdateCounts();
			observed += stache.observedCount;
			pending += stache.pendingCount;
		}
		
		this.totalObservedCount = observed;
		this.totalPendingCount = pending;
	}
	
}