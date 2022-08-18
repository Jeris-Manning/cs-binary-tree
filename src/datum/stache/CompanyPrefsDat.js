import {action, observable} from 'mobx';
import type {DatKey} from '../../Bridge/DockClient/Stache';
import thyme from '../../Bridge/thyme';
import {CompanyKey} from './CompanyDat';
import type {DemandKey} from './DemandDat';


export class CompanyPrefsDat {
	
	@observable key: CompanyKey;
	@observable companyId: number;
	@observable demandIds: DemandKey[] = ['2']; // default 2 (Contract)
	
	@action ApplyDatRaw = (datRaw) => {
		Object.assign(
			this,
			thyme.fast.obj.unpack(datRaw)
		);
	};
	
	constructor(key: DatKey) {this.key = key;}
	
	static Stub = (key: DatKey): CompanyPrefsDat => new CompanyPrefsDat(key);
}