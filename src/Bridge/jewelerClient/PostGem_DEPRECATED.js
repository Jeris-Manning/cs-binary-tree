import {action, computed, observable} from 'mobx';
import thyme from '../thyme';

/**
 *  CLIENT
 */
export default class PostGem_DEPRECATED {
	
	/* INJECTED */
	@observable jewelKey = '';
	@observable gemKey = '';
	Send = {
		Request: params => ({}),
		Notice: payload => ({}),
	};
	
	
	Receive = {
		Notice: payload => {
			throw new Error('PostGem_DEPRECATED does not support Notice');
		}
	};
	
	
	/* STATE */
	@observable isWaiting = false;
	@observable result = {};
	@observable error = '';
	@observable requestedAt = null;
	@observable answeredAt = null;
	
	
	@action Post = async (params) => {
		// if (this.isWaiting) return console.log(`already waiting for ${this.logPrefix}`);
		
		this.error = '';
		this.requestedAt = thyme.now();
		
		console.log(`💍  ${this.jewelKey}.${this.gemKey}.Post request: `, params);
		const startMs = thyme.nowMs();
		
		this.isWaiting = true;
		
		try {
			
			const {header, content} =
				await this.Send.Request(params);
			
			const result = content;
			
			const lagGem = thyme.nowMs() - startMs;
			const lagReport = `${header.lagServer}@server, ${header.lagWorker}@worker, ${lagGem}@gem`;
			
			// console.log(`💍  ${this.jewelKey}.${this.gemKey}.Post received, lag: ${lagReport}`, result);
			console.log(`💍  ${this.jewelKey}.${this.gemKey}.Post received, lag: ${lagReport}`);
			
			if (result.error) {
				this.HandleError(result.error);
			} else {
				this.HandleSuccess(result);
			}
			return result;
			
		} catch (error) {
			this.HandleError(error);
			
			return {
				error: error,
			};
		}
	};
	
	@action HandleSuccess = result => {
		this.result = result;
		this.isWaiting = false;
		this.answeredAt = thyme.now();
	};
	
	@action HandleError = error => {
		// TODO
		console.error(error);
		this.isWaiting = false;
		this.error = error;
		this.answeredAt = thyme.now();
	};
	
	
	@computed get logPrefix() {
		return `💍  ${this.jewelKey}.${this.gemKey}`;
	}
}