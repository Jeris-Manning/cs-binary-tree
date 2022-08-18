class DockPortToClient {
	
	/* CONFIG (from Dock) */
	portId;
	wwPortToClient; // web worker port to client (MessagePort)
	onReceiveFromClient = (port, header, content) => ({});
	
	/* state */
	stale = false;
	wasClosed = false;
	
	constructor(config) {
		this.portId = config.portId;
		this.onReceiveFromClient = config.onReceiveFromClient;
		
		this.wwPortToClient = config.wwPortToClient;
		this.wwPortToClient.onmessage = msgEvt => this.ReceiveFromClient(msgEvt.data);
	}
	
	
	Send = (header, content) => {
		this.wwPortToClient.postMessage({
			header: header,
			content: content,
		});
	};
	
	ReceiveFromClient = ({header, content}) => {
		if (this.wasClosed) {
			console.error(`${this.portId} was closed but received a message.`);
			this.SendError(`This port was already closed or timed out, please Refresh`);
			return;
		}
		
		this.stale = false;
		if (header.scheme === 'pong') return;
		// console.log(`port ${this.portId} receive ${header.channel} ${header.scheme}`);
		
		this.onReceiveFromClient(this, header, content);
	};
	
	
	Close = (reason) => {
		this.wasClosed = true;
		console.log(`port ${this.portId} closing: ${reason}`);
	};
	
	
	CheckStale = () => {
		this.stale = true;
		this.Send({scheme: 'ping'});
	};
	
	SendError = (errorMsg) => {
		this.Send({
			scheme: 'error'
		}, {
			error: errorMsg
		});
	}
}