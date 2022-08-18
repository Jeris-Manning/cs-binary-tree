/**
 *  CLIENT
 */
import thyme from '../thyme';
import {IS_DEBUG} from '../../stores/RootStore';

export class WiseGem {
	
	/* INJECTED */
	jewelKey = '';
	gemKey = '';
	Send = {
		Request: params => ({}),
		Notice: payload => ({}),
	};
	
	Receive = {
		Notice: payload => {
			throw new Error('WiseGem does not yet support Notice');
		}
	};
	
	paramToLog;
	
	constructor(paramToLog) {
		this.paramToLog = paramToLog;
	}
	
	_Request = async (params) => {
		console.log(`💍  ${this.jewelKey}.${this.gemKey}.Wise request: ${this.paramToLog ? params[this.paramToLog] : ''}`);
		if (IS_DEBUG()) console.log(`💍  ${this.jewelKey}.${this.gemKey}.Wise request: `, params);
		
		const startMs = thyme.nowMs();
		
		const {header, content} =
			await this.Send.Request(params);
		
		const {value, error} = content;
		
		if (error) {
			console.error(`${this.jewelKey}.${this.gemKey} server: ${error}`, error);
			throw new Error(`${this.jewelKey}.${this.gemKey} server: ${error}`);
		}
		if (!value) return null;
		
		if (Array.isArray(value)) {
			thyme.fast.array.unpack(value);
		} else {
			thyme.fast.obj.unpack(value);
		}
		
		const lagGem = thyme.nowMs() - startMs;
		
		const lagReport = `serverWaited: ${header.lagServer}, workerWaited: ${header.lagWorker}, gemWaited: ${lagGem}`;
		
		console.log(`💍  ${this.jewelKey}.${this.gemKey}.Wise received ${this.paramToLog ? params[this.paramToLog] : ''} | lag: ${lagReport}`);
		if (IS_DEBUG()) console.log(`💍  ${this.jewelKey}.${this.gemKey}.Wise received, data:`, value);
		
		return value;
	};
	
	Get = params => this._Request(params);
	Post = params => this._Request(params);
}