import {action, observable} from 'mobx';
import type {DatKey} from '../../Bridge/DockClient/Stache';

export const TERP_LISTS = {
	all: 'all',
	active: 'active',
	intern: 'intern',
	real: 'real',
}

export class TerpListDat {
	
	@observable key: DatKey;
	@observable datKeys: DatKey[] = [];
	
	@action ApplyDatRaw = (datRaw) => {
		this.datKeys = datRaw.datKeys;
	};
	
	constructor(key: DatKey) {this.key = key;}
	static Stub = (key: DatKey): TerpListDat => new TerpListDat(key);
}