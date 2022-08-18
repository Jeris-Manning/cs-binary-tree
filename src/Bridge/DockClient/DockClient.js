
const REQUEST_KEY = 'request';
const NOTICE_KEY = 'notice';

export class DockClient {
	
	// TODO: cleanup
	
	static serverAddress = '';
	
	/* CONFIG */
	channels = {};
	onConnected;
	onDisconnected;
	onError;
	onForceCommand;
	
	/* STATE */
	dock;
	requestNumber = 0;
	requests = {};
	
	/**
	 * ## Required in Config:
	 *      channels = {};
	 *      onConnected;
	 *      onDisconnected;
	 *      onError;
	 *      onForceCommand;
	 *
	 * ## Channels must have:
	 *      channel.ReceiveWorkerNotice(content)
	 *
	 * ## Channels injected with:
	 *      channel.SendWorkerRequest
	 *      channel.SendWorkerNotice
	 *
	 * @param config
	 * @constructor
	 */
	Initialize = (config) => {
		console.log(`DockClient.Initialize: starting shared worker`)
		this.dock = new SharedWorker('PublicDockInitializer.js', 'STARFISH DOCK WORKER');
		this.dock.port.onmessage = this.OnMessage;
		
		this.onConnected = config.onConnected;
		this.onDisconnected = config.onDisconnected;
		this.onAuthEvent = config.onAuthEvent;
		this.onError = config.onError;
		this.onForceCommand = config.onForceCommand;
		this.onSetPrime = config.onSetPrime;
		
		Object.keys(config.channels).forEach(channelKey => {
			const channel = config.channels[channelKey];
			this.channels[channelKey] = channel;
			channel.channelKey = channelKey;
			channel.SendWorkerRequest = content => this.SendWorkerRequest(channelKey, content);
			channel.SendWorkerNotice = content => this.SendWorkerNotice(channelKey, content);
		});
	};
	
	/* OUTGOING */
	
	ToWorker = (header, content) => {
		this.dock.port.postMessage({
			header: header,
			content: content,
		});
	};
	
	
	SendWorkerRequest = async (channel, contentOfRequest) => {
		const reqNum = ++this.requestNumber;
		// LOGO(`to worker: request ${channel} ${reqNum}`, contentOfRequest);
		
		const requestPromise = new Deferred();
		this.requests[reqNum] = requestPromise;
		
		this.ToWorker({
			channel: channel,
			scheme: REQUEST_KEY,
			requestNumber: reqNum,
		}, contentOfRequest);
		
		return requestPromise.promise;
	};
	
	SendWorkerNotice = (channel, contentOfNotice) => {
		this.ToWorker({
			channel: channel,
			scheme: NOTICE_KEY,
		}, contentOfNotice);
	};
	
	
	/* INCOMING */
	
	OnMessage = (msg) => {
		// console.log(`OnMessage start ${new Date().getTime()}`);
		this.FromWorker(msg.data);
		// console.log(`OnMessage end ${new Date().getTime()}`);
	}
	
	FromWorker = ({header, content}) => {
		// 	LOGO(`from worker: ${header.scheme} ${header.channel} ${header.requestNumber}`, {header: header, content: content});
		
		switch (header.scheme) {
			
			case 'answer':
				return this.Receive_Answer(header, content);
			
			case NOTICE_KEY:
				return this.Receive_Notice(header, content);
			
			case 'connected':
				DockClient.serverAddress = header.serverAddress;
				return this.onConnected(header, content);
			
			case 'disconnected':
				return this.onDisconnected(header, content);
			
			case 'authEvent':
				return this.onAuthEvent(header, content);
			
			case 'error':
				return this.onError(header, content);
			
			case 'forceCommand':
				return this.Receive_ForceCommand(header, content);
			
			case 'ping':
				return this.ToWorker({scheme: 'pong'});
				
			case 'setPrime':
				return this.onSetPrime(content);
		}
	};
	
	Receive_Answer = (header, content) => {
		const request = this.requests[header.requestNumber];
		if (!request) {
			console.warn(PRE + `error: got answer for unknown request ${header.requestNumber}`);
			return;
		}
		
		// console.log(`resolved ${header.requestNumber} ${header.lagWorker}ms`);
		
		request.resolve({
			header: header,
			content: content,
		});
		
		delete this.requests[header.requestNumber];
	};
	
	Receive_Notice = (header, content) => {
		return this.channels[header.channel].ReceiveWorkerNotice(content);
	};
	
	Receive_ForceCommand = (header, content) => {
		// TODO
		this.onForceCommand(content);
	};
	
	
}

const PRE = '⚓  ';

class Deferred {
	constructor() {
		this.promise = new Promise((resolve, reject) => {
			this.reject = reject;
			this.resolve = resolve;
		});
	}
}