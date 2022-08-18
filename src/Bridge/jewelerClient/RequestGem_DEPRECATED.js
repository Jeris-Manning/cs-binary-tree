import {action, computed, observable, runInAction} from 'mobx';
import thyme from '../thyme';

/**
	 *  CLIENT
	 */
	export default class RequestGem_DEPRECATED {
	
	/* INJECTED */
	@observable jewelKey = '';
	@observable gemKey = '';
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
	
	
	/* STATE */
	@observable isWaiting = false;
	@observable resultType = '';
	@observable thymes = [];
	@observable meta = {};
	
	@observable single = {};
	@observable map = new Map();
	@observable array = [];
	@observable error = '';
	@observable count = 0;
	
	@observable requestedAt = null;
	@observable answeredAt = null;
	@observable processedAt = null;
	
	constructor(config = {}) {
		this.processItem = (IsFunc(config.processItem)) ? config.processItem : null;
	}
	
	
	@action Request = async (params) => {
		if (this.isWaiting) return console.log(`already waiting for ${this.logPrefix}`);
		
		this.error = '';
		this.requestedAt = thyme.now();
		
		console.log(`💍  ${this.jewelKey}.${this.gemKey}.Request request: `, params);
		const startMs = thyme.nowMs();
		
		this.isWaiting = true;
		
		try {
			
			const {header, content} =
				await this.Send.Request(params);
			
			const lagGem = thyme.nowMs() - startMs;
			const lagReport = `${header.lagServer}@server, ${header.lagWorker}@worker, ${lagGem}@gem`;
			
			// console.log(`💍  ${this.jewelKey}.${this.gemKey}.Request received, lag: ${lagReport}`, content);
			console.log(`💍  ${this.jewelKey}.${this.gemKey}.Request received, lag: ${lagReport}`);
			await this.ApplyPayload(content);
			return this.value;
		} catch (error) {
			this.HandleError(error);
		}
	};
	
	@action ApplyPayload = async (payload) => {
		this.answeredAt = thyme.now();
		this.resultType = payload.meta.resultType;
		this.thymes = payload.meta.thymes;
		this.meta = payload.meta;
		
		switch (this.resultType) {
			
			default:
			case 'single':
				await this.ApplyPayload_Single(payload);
				break;
			
			case 'map':
				await this.ApplyPayload_Map(payload);
				break;
			
			case 'array':
				await this.ApplyPayload_Array(payload);
				break;
		}
		
		runInAction(() => {
			this.processedAt = thyme.now();
			this.isWaiting = false;
			this.requestedAt = thyme.now();
			console.log(`${this.logPrefix}: done processing took ${thyme.timeSinceString(this.answeredAt)}`);
		});
	};
	
	@action ApplyPayload_Single = async (payload) => {
		this.single = await this.ProcessRow(payload.value);
		this.count = 1;
	};
	
	@action ApplyPayload_Map = async (payload) => {
		let map = new Map();
		
		await Promise.all(Object.keys(payload.value).map(async key => {
			return map.set(key, await this.ProcessRow(payload.value[key]));
		}));
		
		runInAction(() => {
			this.map = map;
			this.count = map.size;
		});
	};
	
	@action ApplyPayload_Array = async (payload) => {
		const array = await Promise.all(payload.value.map(async row => await this.ProcessRow(row)));
		
		runInAction(() => {
			this.array = array;
			this.count = array.length;
		});
	};
	
	
	@action ProcessRow = async (row) => {
		let processedRow = row;
		
		if (IsFunc(this.processItem)) {
			processedRow = await this.processItem(processedRow);
		}
		
		if (this.thymes && this.thymes.length) {
			this.thymes.forEach(thymeKey => {
				processedRow[thymeKey] = thyme.fromFastJson(processedRow[thymeKey]);
			});
			// processed = await this.ConvertThymes(processed);
		}
		
		return processedRow;
	};
	
	@action ConvertThymes = async (item) => {
		this.thymes.forEach(thymeKey => {
			item[thymeKey] = thyme.fromFastJson(item[thymeKey]);
		});
		return item;
	};
	
	@action HandleError = error => {
		// TODO
		console.error(error);
		this.isWaiting = false;
		this.error = error;
		this.answeredAt = thyme.now();
	};
	
	
	@action Gem_ReceiveRequest = async (payload) => ({});
	@action Gem_ReceiveNotice = (payload) => ({});
	
	
	@computed get logPrefix() {
		return `💍  ${this.jewelKey}.${this.gemKey}`;
	}
	
	@computed get value() {
		switch (this.resultType) {
			default:
			case 'single':
				return this.single || {};
			
			case 'map':
				return this.map || new Map();
			
			case 'array':
				return this.array || [];
		}
	}
	
	@computed get asArray() {
		switch (this.resultType) {
			default:
			case 'single':
				return this.single ? [this.single] : [];
			
			case 'map':
				LOGO(`map asArray`, this.map);
				return (this.map && this.map.size) ? [...this.map.values()] : [];
			
			case 'array':
				return this.array || [];
		}
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