import {action, observable} from 'mobx';
import type {DatKey} from '../../Bridge/DockClient/Stache';
import type {IdKey} from '../../Bridge/misc/UpType';
import $j from '../../Bridge/misc/$j';

export type DemandKey = string;
export type DemandId = number;
type DemandGroup = IdKey[];

export class DemandDat {
	static UseEnumMode = true;
	
	@observable key: DatKey; // disregarded
	@observable entries: DemandEntry[] = [];
	@observable entryLup: {[DemandKey]: DemandEntry};
	
	@action ApplyDatRaw = (datRaw) => {
		this.entries = datRaw
			.map(entryRaw => new DemandEntry(entryRaw));
		
		this.entryLup = $j.arrayToLup(this.entries);
	};
	
	constructor(key: DatKey) {this.key = key;}
	static Stub = (key: DatKey): DemandDat => new DemandDat(key);
}


export class DemandEntry {
	key: DemandKey;
	demandId: DemandId;
	name: string;
	category: string;
	notes: string;
	credsRequired: DemandGroup[];
	usesRid: boolean;
	enabled: boolean;
	label: string;
	
	constructor(entryRaw) {
		Object.assign(this, entryRaw);
	}
}