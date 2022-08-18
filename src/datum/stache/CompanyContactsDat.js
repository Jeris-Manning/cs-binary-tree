import {action, observable} from 'mobx';
import type {DatKey} from '../../Bridge/DockClient/Stache';
import type {IdKey} from '../../Bridge/misc/UpType';

export class CompanyContactsDat {
	
	@observable key: DatKey;
	@observable entries: ContactEntry[] = [];
	@observable activeEntries: ContactEntry[] = [];
	
	@action ApplyDatRaw = (datRaw) => {
		let all = [];
		let active = [];
		
		for (const entryRaw of datRaw) {
			const entry = new ContactEntry(entryRaw);
			all.push(entry);
			if (entry.active) active.push(entry);
		}
		
		this.entries = all;
		this.activeEntries = active;
	};
	
	
	constructor(key: DatKey) {this.key = key;}
	
	static Stub = (key: DatKey): CompanyContactsDat => new CompanyContactsDat(key);
}


export class ContactEntry {
	key: DatKey;
	contactId: IdKey;
	active: boolean;
	firstName: string;
	lastName: string;
	label: string;
	
	constructor(entryRaw) {
		Object.assign(this, entryRaw);
	}
}