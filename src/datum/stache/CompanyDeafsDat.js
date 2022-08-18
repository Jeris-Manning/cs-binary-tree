import {action, observable} from 'mobx';
import type {DatKey} from '../../Bridge/DockClient/Stache';
import type {IdKey} from '../../Bridge/misc/UpType';

export class CompanyDeafsDat {
	
	@observable key: DatKey;
	@observable entries: DeafEntry[] = [];
	@observable activeEntries: DeafEntry[] = [];
	
	@action ApplyDatRaw = (datRaw) => {
		let all = [];
		let active = [];
		
		for (const entryRaw of datRaw) {
			const entry = new DeafEntry(entryRaw);
			all.push(entry);
			if (entry.active) active.push(entry);
		}
		
		this.entries = all;
		this.activeEntries = active;
	};
	
	constructor(key: DatKey) {this.key = key;}
	
	static Stub = (key: DatKey): CompanyDeafsDat => new CompanyDeafsDat(key);
}


export class DeafEntry {
	key: DatKey;
	deafId: IdKey;
	active: boolean;
	firstName: string;
	lastName: string;
	label: string;
	
	constructor(entryRaw) {
		Object.assign(this, entryRaw);
	}
}