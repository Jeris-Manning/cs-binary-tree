class JewelerWorker {
	
	SendServerRequest = async (portToClient, header, content) => ({});
	SendServerNotice = (portToClient, header, content) => ({});
	SendPortsNotice = (header, content) => ({});
	isConnectedToServer = false;
	
	constructor(config) {
		this.SendServerRequest = config.SendServerRequest;
		this.SendServerNotice = config.SendServerNotice;
		this.SendPortsNotice = config.SendPortsNotice;
	}
	
	ReceiveServerNotice = async (header, content) => {
		return this.SendPortsNotice(header, content);
	};
	
	ReceivePortRequest = async (portToClient, header, content) => {
		if (!this.isConnectedToServer) {
			// TODO: handle
			console.error(`JewelerWorker.ReceivePortRequest without server connection`, header, content);
			return;
		}
		
		const start = new Date();
		
		const answer =
			await this.SendServerRequest(portToClient, header, content);
		
		const lagWorker = new Date() - start;
		
		console.log(`💎 jeweler request ${header.requestNumber} response took ${lagWorker}ms`);
		
		portToClient.Send({
			...answer.header,
			scheme: 'answer',
			channel: header.channel,
			requestNumber: header.requestNumber, // original (client-side)
			lagWorker: lagWorker,
		}, answer.content);
	};
	
	ReceivePortNotice = (portToClient, header, content) => {
		if (!this.isConnectedToServer) {
			// TODO: handle
			console.error(`JewelerWorker.ReceivePortNotice without server connection`, header, content);
			return;
		}
		
		this.SendServerNotice(portToClient, header, content);
	}
	
	PortClosing = port => ({});
}