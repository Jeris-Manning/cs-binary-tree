import {action, observable} from 'mobx';
import type {DatKey} from '../../Bridge/DockClient/Stache';
import thyme from '../../Bridge/thyme';
import type {TerpKey} from './TerpDat';
import type {ThymeDt} from '../../Bridge/thyme';


export class TerpNextJobDat {
	
	@observable key: TerpKey;
	@observable terpId: number;
	@observable jobId: number;
	@observable start: ThymeDt;
	@observable end: ThymeDt;
	
	
	@action ApplyDatRaw = (datRaw) => {
		Object.assign(
			this,
			thyme.fast.obj.unpack(datRaw)
		);
	};
	
	constructor(key: DatKey) {this.key = key;}
	
	static Stub = (key: DatKey): TerpNextJobDat => new TerpNextJobDat(key);
}