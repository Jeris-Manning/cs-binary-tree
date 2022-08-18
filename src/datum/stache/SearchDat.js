import {action, observable} from 'mobx';
import type {DatKey} from '../../Bridge/DockClient/Stache';
import type {IdKey} from '../../Bridge/misc/UpType';


export class SearchDat {
	
	@observable key: DatKey; // category
	@observable entries: SearchEntry[] = [];
	@observable activeEntries: SearchEntry[] = [];
	
	@action ApplyDatRaw = (datRaw) => {
		const {
			catKey,
			entries,
		} = datRaw;
		
		let all = [];
		let active = [];
		
		for (const entryRaw of entries) {
			const entry = new SearchEntry(catKey, entryRaw);
			all.push(entry);
			if (entry.active) active.push(entry);
		}
		
		this.entries = all;
		this.activeEntries = active;
	};
	
	constructor(key: DatKey) {this.key = key;}
	
	static Stub = (key: DatKey): SearchDat => new SearchDat(key);
}


export class SearchEntry {
	
	key: DatKey;
	id: IdKey;
	active: boolean;
	label: string;
	phone: string;
	email: string;
	
	catKey: DatKey;
	searchString: string;
	
	constructor(catKey, entryRaw) {
		Object.assign(this, entryRaw);
		this.catKey = catKey;
		// this.searchString = Object.values(entryRaw).join(' ').toLowerCase();
		this.searchString = `${this.id} ${this.label} ${this.phone} ${this.email}`.toLowerCase();
	}
}