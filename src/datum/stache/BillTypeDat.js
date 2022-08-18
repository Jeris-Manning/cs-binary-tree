import {action, observable} from 'mobx';
import type {DatKey} from '../../Bridge/DockClient/Stache';
import type {IdKey} from '../../Bridge/misc/UpType';

export type BillTypeName = string;
export type BillTypeId = number;

export class BillTypeDat {
	static UseEnumMode = true;
	
	@observable key: DatKey; // disregarded
	@observable entries: BillTypeEntry[] = [];
	@observable entryById: {[BillTypeId]: BillTypeEntry} = {};
	@observable entryByName: {[BillTypeName]: BillTypeEntry} = {};
	
	@action ApplyDatRaw = (datRaw) => {
		let entries = [];
		let entryById = {};
		let entryByName = {};
		
		for (const entryRaw of datRaw) {
			const entry = new BillTypeEntry(entryRaw);
			entries.push(entry);
			entryById[entry.billTypeId] = entry;
			entryByName[entry.qbName] = entry;
		}
		
		this.entries = entries;
		this.entryById = entryById;
		this.entryByName = entryByName;
	};
	
	constructor(key: DatKey) {this.key = key;}
	static Stub = (key: DatKey): BillTypeDat => new BillTypeDat(key);
}

export class BillTypeEntry {
	key: IdKey; // id
	billTypeId: BillTypeId;
	qbName: BillTypeName; // this is what's stored in DB (I know, I know)
	filled: boolean;
	billed: boolean;
	cancelled: boolean;
	vri: boolean;
	enabled: boolean;
	rush: boolean;
	unable: boolean;
	
	label: string;
	
	constructor(entryRaw) {
		Object.assign(this, entryRaw);
		this.key = String(this.key);
		this.label = entryRaw.qbName;
	}
}