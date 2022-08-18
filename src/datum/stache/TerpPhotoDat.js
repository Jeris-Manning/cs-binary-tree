import {action, observable} from 'mobx';
import type {DatKey} from '../../Bridge/DockClient/Stache';
import thyme from '../../Bridge/thyme';


export class TerpPhotoDat {
	
	@observable key: DatKey;
	@observable terpCredId: string;
	@observable terpId: string;
	@observable url: string;
	
	
	@action ApplyDatRaw = (datRaw) => {
		Object.assign(
			this,
			thyme.fast.obj.unpack(datRaw)
		);
	};
	
	constructor(key: DatKey) {this.key = key;}
	
	static Stub = (key: DatKey): TerpPhotoDat => new TerpPhotoDat(key);
}