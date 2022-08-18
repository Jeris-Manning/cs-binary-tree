export class NoticeGem {
	
	/* INJECTED */
	jewelKey = '';
	gemKey = '';
	Send = {
		Request: params => ({}),
		Notice: payload => ({}),
	};
	
	Receive = {
		Notice: payload => this.Notice(payload),
	};
	
	/* CONFIG */
	onNotice = (payload) => ({})
	
	constructor(onNotice) {
		this.onNotice = onNotice;
	}
	
	Notice = (payload) => {
		console.log(`'💍  notice ${this.jewelKey}.${this.gemKey}`, payload);
		this.onNotice(payload);
	};
}