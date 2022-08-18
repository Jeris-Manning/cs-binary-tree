import thyme from '../thyme';
import {computed, observable, runInAction} from 'mobx';

/**
 *  CLIENT
 */
export default class GetGem_DEPRECATED {
	
	/* INJECTED */
	jewelKey = '';
	gemKey = '';
	Send = {
		Request: params => ({}),
		Notice: payload => ({}),
	};
	
	Receive = {
		Notice: payload => {
			throw new Error('RequestGem_DEPRECATED does not support Notice');
		}
	};
	
	/* CONFIG */
	processItem = (item) => item;
	
	constructor(config = {}) {
		this.processItem = (IsFunc(config.processItem)) ? config.processItem : null;
	}
	
	/* COMPUTED */
	
	@observable currentRequests = 0;
	
	@computed get isRefreshing() {
		return !!this.currentRequests;
	}
	
	/* FUNCS */
	
	Request = async (params) => {
		this.currentRequests++;
		
		// const requestedAt = thyme.now();
		
		console.log(`💍  ${this.jewelKey}.${this.gemKey}.Get request: `, params);
		const startMs = thyme.nowMs();
		
		const {header, content} =
			await this.Send.Request(params);
		
		const payload = content;
		
		runInAction(() => {
			this.currentRequests--;
		});
		
		if (payload.error) {
			throw new Error(JSON.stringify(payload.error));
		}
		
		// console.log(`${this.logPrefix}: answer took ${thyme.timeSinceString(requestedAt)}`, payload);
		// const answeredAt = thyme.now();
		
		let result;
		
		switch (payload.meta.resultType) {
			
			default:
			case 'single':
				result = await this.ProcessRow(payload.meta, payload.value);
				break;
				
			case 'map':
				throw new Error(`unimplemented GetGem_DEPRECATED.map`);
			
			case 'array':
				result = await Promise.all(payload.value.map(async row => await this.ProcessRow(payload.meta, row)));
				break;
		}
		
		// console.log(`${this.logPrefix}: done processing took ${thyme.timeSinceString(answeredAt)}`);
		
		const lagGem = thyme.nowMs() - startMs;
		const lagReport = `${header.lagServer}@server, ${header.lagWorker}@worker, ${lagGem}@gem`;
		
		// console.log(`💍  ${this.jewelKey}.${this.gemKey}.Get received, lag: ${lagReport}`, result);
		console.log(`💍  ${this.jewelKey}.${this.gemKey}.Get received, lag: ${lagReport}`);
		
		return result;
	};
	
	ProcessRow = async (meta, row) => {
		let processedRow = row;
		
		if (IsFunc(this.processItem)) {
			processedRow = await this.processItem(processedRow);
		}
		
		if (meta.thymes && meta.thymes.length) {
			meta.thymes.forEach(thymeKey => {
				processedRow[thymeKey] = thyme.fromFastJson(processedRow[thymeKey]);
			});
		}
		
		return processedRow;
	};
	
	@computed get logPrefix() {
		return `💍  ${this.jewelKey}.${this.gemKey}`;
	}
}


/*

3 result types:
	single obj/value
	map
	array

Set by server, included in metadata

*/


const IsFunc = f => typeof f === 'function';

const LOG = str => console.log('💍  ' + str);
const LOGO = (str, obj) => console.log('💍  ' + str, obj);