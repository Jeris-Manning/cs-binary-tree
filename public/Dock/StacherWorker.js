importScripts('Dock/localforage.js');

const NOTICE_HEADER = {channel: 'stacher', scheme: 'notice'};
const REQUEST_HEADER = {channel: 'stacher', scheme: 'request'};
const INFO_STORAGE_KEY = 'ASLIS_STACHER_INFO';
const STACHE_TOKEN_KEY = '__TOKEN';


class API_EXAMPLE_STACHE_WORKER__CONTENT {
	ReceiveServerNotice = {
		welcome: {commencement, info},
		sync: {stacheKey, datKey, datRaw, error},
		invalidate: {stacheKey, datKey, token},
		invalidateAll: {stacheKey, token},
	};
	
	SendServerNotice = {
		sync: {stacheKey, datKey},
	};
	
	ReceivePortNotice = {
		initialize: {stacheKeys},
		sync: {stacheKey, datKey},
	};
	
	SendPortsNotice = {
		sync: {stacheKey, datKey},
		invalidate: {stacheKey, datKey},
		invalidateAll: {stacheKey},
	};
}

/**
 *
 * Init ordering:
 *      1. Initialize from client
 *      2. Welcome from server
 *      3. Check Sync Tokens
 */
class StacherWorker {
	
	ToLog = (msg) => `∐ StacherWorker ${msg}`;
	
	infoStorage; // LocalForage
	commencement;
	staches = {}; // key: WorkerStache
	allStaches = [];
	
	isInitialized = false;
	finishInit;
	awaitingInit = new Promise(resolve => this.finishInit = resolve);
	
	isWelcomed = false;
	finishWelcome;
	awaitingWelcome = new Promise(resolve => this.finishWelcome = resolve);
	
	/* DockWorker API */
	SendServerRequest = (portToClient, header, content) => {};
	SendServerNotice = (portToClient, header, content) => {};
	SendPortsNotice = (header, content) => {};
	ReceiveServerNotice = async (header, content) => this.FromServer_Notice(header, content);
	ReceivePortRequest = async (portToClient, header, content) => {}; // unused
	ReceivePortNotice = (portToClient, header, content) => this.FromClient_Notice(portToClient, header, content);
	PortClosing = (port) => {}; // unused
	isConnectedToServer = false;
	
	constructor(config) {
		this.SendServerRequest = config.SendServerRequest;
		this.SendServerNotice = config.SendServerNotice;
		this.SendPortsNotice = config.SendPortsNotice;
		
		this.infoStorage = localforage.createInstance({
			name: INFO_STORAGE_KEY,
			driver: localforage.INDEXEDDB,
		});
	}
	
	EnsureIsInitialized = async () => {
		if (!this.isInitialized) {
			await this.awaitingInit;
		}
	};
	
	EnsureIsWelcomed = async () => {
		if (!this.isWelcomed) {
			await this.awaitingWelcome;
		}
	}
	
	
	/*
		From CLIENT
	*/
	
	FromClient_Notice = async (portToClient, header, content) => {
		// console.log(this.ToLog(`FromClient_Notice`), content);
		
		if (content.initialize)
			return this.FromClient_InitializeStaches(content.initialize);
		
		await this.EnsureIsInitialized();
		await this.EnsureIsWelcomed();
		
		if (content.sync) {
			await this.FromClient_NeedSync(portToClient, content.sync);
			return;
		}
	};
	
	FromClient_InitializeStaches = async (initialize) => {
		if (this.isInitialized) return; // already initialized
		
		const stacheKeys = initialize.stacheKeys;
		
		for (const key of stacheKeys) {
			const stache = new WorkerStache();
			
			stache.key = key;
			stache.storage = localforage.createInstance({
				name: key,
				driver: localforage.INDEXEDDB,
			});
			
			this.staches[key] = stache;
			this.allStaches.push(stache);
		}
		
		await Promise.all(
			this.allStaches.map(s => s.LoadToken())
		);
		
		console.log(this.ToLog(`Initialized staches: ${stacheKeys.join()}`));
		this.isInitialized = true;
		this.finishInit();
	};
	
	/**
	 
	 */
	// TODO: batch requests (list of keys) with debounce (even if it's tiny)
	FromClient_NeedSync = async (portToClient, sync) => {
		// console.log(this.ToLog(`FromClient_NeedSync (start, request): ${sync.stacheKey}.${sync.datKey}`), sync);
		
		const stacheKey = sync.stacheKey;
		const datKey = sync.datKey;
		const stache = this.GetStache(stacheKey);
		
		const existingRequest = stache.pendingRequests[datKey];
		if (existingRequest) return existingRequest;
		
		const request = this.SendServerRequest(portToClient, REQUEST_HEADER, {sync: sync});
		stache.pendingRequests[datKey] = request;
		
		const answer = await request;
		
		const {
			datRaw,
			error,
			token,
		} = answer.content;
		
		
		if (error) {
			console.warn(this.ToLog(`Sync error ${stacheKey}.${datKey}: ${error}`));
		} else {
			// save to storage
			await Promise.all([
				stache.AddDatToStorage(datKey, datRaw),
				stache.SetToken(token)
			]);
		}
		
		const syncResult = {
			stacheKey: stacheKey,
			datKey: datKey,
			error: error,
			token: token,
		};
		
		// console.log(this.ToLog(`FromClient_NeedSync (end, send notice): ${sync.stacheKey}.${sync.datKey}`), syncResult);
		this.SendPortsNotice(NOTICE_HEADER, {sync: syncResult});
		delete stache.pendingRequests[datKey];
	};
	
	
	/*
		From SERVER
	*/
	
	FromServer_Notice = async (header, content) => {
		// console.log(this.ToLog(`ReceiveServerNotice`), content);
		
		/* waits for 1st time initialization message from client */
		await this.EnsureIsInitialized();
		
		if (content.welcome)
			return this.FromServer_Welcome(content.welcome);
		
		await this.EnsureIsWelcomed();
		
		if (content.invalidate)
			return this.FromServer_Invalidate(content.invalidate);
		
		if (content.invalidateAll)
			return this.FromServer_InvalidateAll(content.invalidateAll);
		
		
		console.error(this.ToLog(`FromServer_Notice: unknown content`), content);
	};
	
	FromServer_Welcome = async (welcome) => {
		const {
			commencement,
			info,
		} = welcome;
		
		console.log(this.ToLog(`Welcome ${commencement}, initializing with tokens`), info);
		
		if (this.isWelcomed) {
			// already was connected (server restarted?)
			this.isWelcomed = false;
			this.awaitingWelcome = new Promise(resolve => this.finishWelcome = resolve);
		}
		
		this.commencement = commencement;
		
		const promises = [];
		
		for (const [stacheKey, stacheInfo] of Object.entries(info)) {
			const stache = this.GetStache(stacheKey);
			
			stache.mode = stacheInfo.mode;
			
			const serverToken = stacheInfo.token;
			const currentToken = stache.token;
			if (currentToken === serverToken) continue; // still good
			
			console.log(this.ToLog(`${stacheKey} token out of date (${currentToken} -> ${serverToken})`));
			promises.push(this.FromServer_InvalidateAll({
				stacheKey: stacheKey,
				token: serverToken,
			}));
		}
		
		await Promise.all(promises);
		
		console.log(this.ToLog(`welcome complete`), info);
		
		this.isWelcomed = true;
		this.finishWelcome();
		
		// TODO: share some welcome info with clients? (e.g. mode)
	};
	
	FromServer_Invalidate = async (invalidate) => {
		const {
			stacheKey,
			datKey,
			token,
		} = invalidate;
		
		console.log(this.ToLog(`FromServer_Invalidate ${stacheKey}.${datKey}`));
		
		const stache = this.GetStache(stacheKey);
		
		if (token === stache.token) {
			return; // already received this update?
		}
		
		await stache.SetToken(token);
		
		if (stache.pendingRequests[datKey]) {
			console.log(this.ToLog(`FromServer_Invalidate SKIPPING ${stacheKey}.${datKey} (already waiting)`));
			return; // already waiting, should receive new version
		}
		
		await stache.RemoveDatFromStorage(datKey);
		
		this.SendPortsNotice(NOTICE_HEADER, {invalidate: invalidate});
	};
	
	
	FromServer_InvalidateAll = async (invalidateAll) => {
		const {
			stacheKey,
			token,
		} = invalidateAll;
		
		console.log(this.ToLog(`FromServer_InvalidateAll ${stacheKey}`));
		
		const stache = this.GetStache(stacheKey);
		await stache.ClearStorage();
		await stache.SetToken(token);
		this.SendPortsNotice(NOTICE_HEADER, {invalidateAll: invalidateAll});
	};
	
	GetStache = (stacheKey) => {
		const stache = this.staches[stacheKey];
		if (!stache) throw new Error(`Missing stache: ${stacheKey}`);
		return stache;
	};
	
	
	GetInfo = async (key) => this.infoStorage.getItem(key);
	SetInfo = async (key, val) => this.infoStorage.setItem(key, val);
	RemoveInfo = async (key) => this.infoStorage.removeItem(key);
}

class WorkerStache {
	key = '';
	mode; // full, onDemand, enum
	storage; // localforage instance
	pendingRequests = {}; // key: promise
	token;
	
	AddDatToStorage = async (datKey, datVal) => this.storage.setItem(datKey, datVal);
	RemoveDatFromStorage = async (datKey) => this.storage.removeItem(datKey);
	ClearStorage = async () => this.storage.clear();
	SetToken = async (token) => this.storage.setItem(STACHE_TOKEN_KEY, token);
	LoadToken = async () => this.token = await this.storage.getItem(STACHE_TOKEN_KEY);
}


class Pending {
	promise;
	resolve;
	reject;
	
	constructor() {
		this.promise = new Promise((resolve, reject) => {
			this.resolve = resolve;
			this.reject = reject;
		});
	}
}