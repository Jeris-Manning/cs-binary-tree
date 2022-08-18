import {action, observable} from 'mobx';
import type {DatKey} from '../../Bridge/DockClient/Stache';
import type {DeafKey} from './DeafDat';
import {DeafDat} from './DeafDat';

export const DEAF_LISTS = {
	all: 'all',
	active: 'active',
	activeNames: 'activeNames',
}

export class DeafListDat {
	
	@observable key: DatKey; // list key
	@observable datVals: DeafDat[] | DeafListName[] = [];
	
	@action ApplyDatRaw = (datRaw) => {
		this.datVals = datRaw.datVals;
	};
	
	constructor(key: DatKey) {this.key = key;}
	static Stub = (key: DatKey): DeafListDat => new DeafListDat(key);
}

export type DeafListName = {
	key: DeafKey,
	firstName: string,
	lastName: string,
	label: string,
}