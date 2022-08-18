import {action, observable} from 'mobx';
import type {DatKey} from '../../Bridge/DockClient/Stache';
import type {LocationId, LocationKey} from './LocationDat';


export class CompanyLocationsDat {
	
	@observable key: DatKey;
	@observable entries: LocationEntry[] = [];
	@observable activeEntries: LocationEntry[] = [];
	
	@action ApplyDatRaw = (datRaw) => {
		let all = [];
		let active = [];
		
		for (const entryRaw of datRaw) {
			const entry = new LocationEntry(entryRaw);
			all.push(entry);
			if (entry.active) active.push(entry);
		}
		
		this.entries = all;
		this.activeEntries = active;
	};
	
	constructor(key: DatKey) {this.key = key;}
	
	static Stub = (key: DatKey): CompanyLocationsDat => new CompanyLocationsDat(key);
}


export class LocationEntry {
	key: LocationKey;
	locationId: LocationId;
	active: boolean;
	label: string;
	mapped: boolean;
	color: string;
	
	constructor(entryRaw) {
		this.color = entryRaw.mapped ? '#000000' : '#bb0007';
		Object.assign(this, entryRaw);
	}
}