import {action, observable} from 'mobx';
import thyme from '../../Bridge/thyme';
import type {TerpKey} from './TerpDat';
import type {DemandKey} from './DemandDat';
import {DemandEntry} from './DemandDat';

export type TerpDemandsLup = { [DemandKey]: boolean };

export class TerpDemandsDat {
	@observable key: TerpKey;
	@observable terpDemandsLup: TerpDemandsLup = {};
	
	@action ApplyDatRaw = (datRaw) => {
		Object.assign(
			this,
			thyme.fast.obj.unpack(datRaw)
		);
	};
	
	constructor(key: TerpKey) {this.key = key;}
	static Stub = (key: TerpKey): TerpDemandsDat => new TerpDemandsDat(key);
	
	
	
	/* sugar */
	
	Has = (demandEntry: DemandEntry) => this.terpDemandsLup[demandEntry.key];
	HasKey = (demandKey: DemandKey) => this.terpDemandsLup[demandKey];
	
	Missing = (demandEntry: DemandEntry) => !this.terpDemandsLup[demandEntry.key];
}