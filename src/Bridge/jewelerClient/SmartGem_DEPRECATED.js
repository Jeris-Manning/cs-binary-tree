import thyme from '../thyme';

/**
 *  CLIENT
 */
export default class SmartGem_DEPRECATED {
	
	/* INJECTED */
	jewelKey = '';
	gemKey = '';
	Send = {
		Request: params => ({}),
		Notice: payload => ({}),
	};
	
	Receive = {
		Notice: payload => {
			throw new Error('SmartGem_DEPRECATED does not yet support Notice');
		}
	};
	
	/* CONFIG */
	processors = [];
	
	constructor(config = {}) {
		this.processors = config.processors || [];
	}
	
	_Request = async (requestType, params) => {
		console.log(`💍  ${this.jewelKey}.${this.gemKey}.Smart request: `, params);
		const startMs = thyme.nowMs();
		
		const {header, content} =
			await this.Send.Request({
				_requestType: requestType,
				...params,
			});
		
		if (content.error) {
			console.warn(`SmartGem_DEPRECATED error, ${this.jewelKey}.${this.gemKey}: ${content.error}`);
			return {
				error: content.error
			};
		}
		
		this.processors.forEach(proc => proc(content.value));
		
		const lagGem = thyme.nowMs() - startMs;
		const lagReport = `${header.lagServer}@server, ${header.lagWorker}@worker, ${lagGem}@gem`;
		
		// console.log(`💍  ${this.jewelKey}.${this.gemKey}.Smart received, lag: ${lagReport}`, content);
		console.log(`💍  ${this.jewelKey}.${this.gemKey}.Smart received, lag: ${lagReport}`);
		
		return content.value;
	};
	
	Get = params => this._Request('get', params);
	Post = params => this._Request('post', params);
}