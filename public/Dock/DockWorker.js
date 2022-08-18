importScripts('Dock/DockPortToClient.js');
importScripts('Dock/StacherWorker.js');
importScripts('Dock/JewelerWorker.js');

// how often to ping pong clients to check if they're still active (the browser tab closed, etc.)
const STALE_CHECK_MS = 30 * 1000;
const PRE = '⚓  ';


const USER_KEY = 'user';
const AUTH_TOKENS_KEY = 'tokens';
const REQUEST_KEY = 'request';
const NOTICE_KEY = 'notice';
const PORT_STATUS_KEY = 'port_status';
const PORT_OPENED = 'port_opened';
const PORT_CLOSED = 'port_closed';

// TODO: write docs
class DockWorker {
	
	jeweler; // JewelerWorker
	stacher; // StacheWorker
	socket; // websocket to Server
	pendingConnection = new Deferred();
	isConnectedToServer = false;
	isAuthed = false;
	needsUserPw = false;
	startedAt = Date.now();
	
	portIds = 0; // incrementer
	ports = []; // client ports (DockPortToClient)
	primePort = null; // the primary client port (used for notifications, etc.)
	
	serverAddress; // see ServerAddress.js
	serverSimLag = 0;
	
	
	constructor(io, serverAddress) {
		console.log(PRE + `self: `, self);
		
		this.serverAddress = serverAddress;
		
		this.socket = io(this.serverAddress + '/dock', {
			transports: ['websocket']
		});
		
		this.socket.on('connect', this.ServerSocketConnected);
		this.socket.on('disconnect', this.ServerSocketDisconnected);
		this.socket.on('dock', data => this.ReceivedFromServerSocket(data.header, data.content));
		
		const workerConfigs = {
			SendServerRequest: this.SendServerRequest,
			SendServerNotice: this.SendServerNotice,
			SendPortsNotice: this.SendPortsNotice,
		};
		
		this.jeweler = new JewelerWorker(workerConfigs);
		this.stacher = new StacherWorker(workerConfigs);
		
		
		setInterval(this.CheckStalePort, STALE_CHECK_MS);
	}
	
	// web worker onconnect event (new port to client)
	WwClientPortConnected = msgEvt => {
		const portToClient = new DockPortToClient({
			portId: ++this.portIds,
			// this is always an array with 1 element (it reuses MessageEvent interface)
			wwPortToClient: msgEvt.ports[0],
			onReceiveFromClient: this.ReceivedFromClientPort,
		});
		
		this.ports.push(portToClient);
		
		console.log(PRE + `port ${portToClient.portId} connected, total: ${this.ports.length}`);
		
		if (!this.primePort) this.SetPrime(portToClient);
		
		if (this.isConnectedToServer) this.SendPortDockStatus(portToClient, 'connected', {serverAddress: this.serverAddress});
		if (this.needsUserPw) this.SendPortDockStatus(portToClient, 'authEvent', 'needsAuth');
		if (this.isAuthed) this.SendPortDockStatus(portToClient, 'authEvent', 'isAuthed');
		
		this.SendServerPortStatus(portToClient, PORT_OPENED);
	};
	
	DockPortClosed = (portToClient, reason) => {
		portToClient.Close(reason);
		this.jeweler.PortClosing(portToClient);
		this.stacher.PortClosing(portToClient);
		this.SendServerPortStatus(portToClient, PORT_CLOSED);
		
		if (portToClient === this.primePort) {
			this.primePort = null;
			
			if (this.ports.length > 0) {
				this.SetPrime(this.ports[0]);
			}
		}
	};
	
	
	ServerSocketConnected = () => {
		console.log(PRE + `connected to server`);
		this.pendingConnection.resolve();
		this.isConnectedToServer = true;
		this.jeweler.isConnectedToServer = true;
		this.stacher.isConnectedToServer = true;
		this.SendPortsDockStatus('connected', {serverAddress: this.serverAddress});
		this.TryAuthRenew().then();
	};
	
	
	ServerSocketDisconnected = () => {
		console.log(PRE + `disconnected from server`);
		this.pendingConnection = new Deferred();
		this.isConnectedToServer = false;
		this.jeweler.isConnectedToServer = false;
		this.stacher.isConnectedToServer = false;
		this.SendPortsDockStatus('disconnected');
	};
	
	
	requestNumber = 0;
	requests = {};
	
	
	SendServerRequest = async (portToClient, header, content) => {
		const reqNum = ++this.requestNumber;
		const deferred = new Deferred();
		this.requests[reqNum] = deferred;
		
		this.ToServer({
			scheme: REQUEST_KEY,
			channel: header.channel,
			requestNumber: reqNum,
			clientPortId: portToClient.portId,
		}, content);
		
		return deferred.promise;
	};
	
	SendServerNotice = (portToClient, header, content) => {
		this.ToServer({
			...header,
			clientPortId: portToClient.portId,
		}, content);
	};
	
	SendServerPortStatus = (portToClient, status) => {
		this.ToServer({
			scheme: PORT_STATUS_KEY,
			clientPortId: portToClient.portId,
		}, status);
	};
	
	SendPortsNotice = (header, content) => {
		this.ports.forEach(port => port.Send(header, content));
	};
	
	SendPortsDockStatus = (scheme, content) => {
		this.ports.forEach(portToClient => portToClient.Send({
			channel: 'dock',
			scheme: scheme,
			serverAddress: this.serverAddress,
			serverSimLag: this.serverSimLag,
			clientPortId: portToClient.portId,
		}, content));
	};
	
	SendPortDockStatus = (portToClient, scheme, content) => {
		// TODO ??
		portToClient.Send({
			channel: 'dock',
			scheme: scheme,
			clientPortId: portToClient.portId,
		}, content);
	};
	
	
	ReceivedFromClientPort = async (portToClient, header, content) => {
		// console.log(PRE + `from portToClient ${portToClient.portId}`, {header: header, content: content});
		// console.log(`⚓ ${header.channel} ${header.scheme}`, content);
		// console.log(`⚓ ${header.channel} ${header.scheme}`);
		
		if (header.channel === 'auth')
			return this.TryAuthUserPw(portToClient, header, content);
		
		switch (header.scheme) {
			
			case REQUEST_KEY:
				return this[header.channel].ReceivePortRequest(portToClient, header, content);
			
			case NOTICE_KEY:
				return this[header.channel].ReceivePortNotice(portToClient, header, content);
			
		}
		
	};
	
	ReceivedFromServerSocket = async (header, content) => {
		// console.log(`⚓ ${header.channel} ${header.scheme}`, content);
		// console.log(PRE + `from server`, {header: header, content: content});
		
		switch (header.scheme) {
			
			case 'answer':
				return this.ResolveRequest(header, content);
			
			case NOTICE_KEY:
				// console.log(`⚓ ${header.channel} ${header.scheme}`, content);
				// console.log(`⚓ ${header.channel} ${header.scheme}`);
				return this[header.channel].ReceiveServerNotice(header, content);
			
		}
	};
	
	
	ToServer = (header, content) => {
		this.socket.emit('dock', {
			header: header,
			content: content,
		});
	};
	
	
	ResolveRequest = (header, content) => {
		// console.logPRE + resolving request ${header.requestNumber}`);
		
		const request = this.requests[header.requestNumber];
		if (!request) throw new Error(`got answer for unknown request`);
		
		request.resolve({
			header: header,
			content: content,
		});
		
		// console.logPRE + resolved request ${header.requestNumber} ${new Date().getTime()}`);
		
		delete this.requests[header.requestNumber];
	};
	
	
	TryAuthRenew = async () => {
		const tokens =
			await this.stacher.GetInfo(AUTH_TOKENS_KEY);
		
		console.log(PRE + `trying renew with tokens`, tokens);
		
		if (!tokens) {
			this.needsUserPw = true;
			this.SendPortsDockStatus('authEvent', 'needsAuth');
			return;
		}
		
		const answer =
			await this.SendServerRequest(
				{portId: -1}, // worker request
				{
					channel: 'auth',
				},
				{
					renew: tokens,
					service: 'starfish',
					versionInfo: {
						origin: 'starfish',
						startedAt: this.startedAt,
					},
				});
		
		const result = answer.content;
		this.serverSimLag = answer.header.serverSimLag;
		
		if (result.error) {
			console.log(PRE + `can't auth renew ${result.error}`);
			
			this.needsUserPw = true;
			this.SendPortsDockStatus('authEvent', 'needsAuth');
			return;
		}
		console.log(PRE + `auth renewed`);
		
		await this.stacher.SetInfo(USER_KEY, {
			label: result.label,
		});
		
		await this.stacher.SetInfo(AUTH_TOKENS_KEY, {
			idToken: result.idToken,
			refreshToken: result.refreshToken,
		});
		
		this.isAuthed = true;
		this.SendPortsDockStatus('authEvent', 'isAuthed');
		
	};
	
	TryAuthUserPw = async (port, header, content) => {
		if (!this.isConnectedToServer) {
			// TODO: handle
			console.error(`DockWorker.TryAuthUserPw without server connection`, header, content);
			return;
		}
		
		const answer =
			await this.SendServerRequest(
				{portId: -1}, // worker request
				{
					channel: 'auth',
				},
				{
					userPw: content.userPw,
					service: 'starfish',
					versionInfo: {
						origin: 'starfish',
						startedAt: this.startedAt,
					},
				});
		
		
		const result = answer.content;
		this.serverSimLag = answer.header.serverSimLag;
		
		if (result.error) {
			console.log(PRE + `auth userPw error: ${result.error}`);
			port.Send({
				scheme: 'answer',
				channel: header.channel,
				requestNumber: header.requestNumber,
			}, result);
			return;
		}
		
		console.log(PRE + `is authed`);
		
		await this.stacher.SetInfo(USER_KEY, {
			label: result.label,
		});
		
		await this.stacher.SetInfo(AUTH_TOKENS_KEY, {
			idToken: result.idToken,
			refreshToken: result.refreshToken,
		});
		
		this.isAuthed = true;
		
		port.Send({
			scheme: 'answer',
			channel: header.channel,
			requestNumber: header.requestNumber,
		}, result);
		
		this.SendPortsDockStatus('authEvent', 'isAuthed');
	};
	
	
	CheckStalePort = () => {
		console.log(PRE + `Checking stale on ${this.ports.length} ports`);
		
		this.ports.forEach(port => {
			if (port.stale) {
				this.DockPortClosed(port, 'stale');
			}
		});
		
		this.ports = this.ports.filter(p => !p.stale);
		
		this.ports.forEach(p => p.CheckStale());
	};
	
	SetPrime = (port) => {
		this.primePort = port;
		this.SendPortDockStatus(this.primePort, 'setPrime', true);
	};
	
}

class Deferred {
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