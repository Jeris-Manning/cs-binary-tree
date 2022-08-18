import {action, observable} from 'mobx';
import $j from '../../Bridge/misc/$j';

export type SpecialtyKey = string;
export type SpecialtyId = number;

export class TerpSpecialtyDat {
	static UseEnumMode = true;
	
	@observable key: SpecialtyKey; // disregarded
	@observable entries: TerpSpecialtyEntry[] = [];
	@observable entryLup: {[SpecialtyKey]: TerpSpecialtyEntry};
	
	@action ApplyDatRaw = (datRaw) => {
		this.entries = datRaw
			.map(entryRaw => new TerpSpecialtyEntry(entryRaw));
		
		this.entryLup = $j.arrayToLup(this.entries);
	};
	
	constructor(key: SpecialtyKey) {this.key = key;}
	static Stub = (key: SpecialtyKey): TerpSpecialtyDat => new TerpSpecialtyDat(key);
}

export class TerpSpecialtyEntry {
	key: SpecialtyKey;
	specialtyId: SpecialtyId;
	specialty: string;
	label: string;
	
	constructor(entryRaw) {
		Object.assign(this, entryRaw);
		// console.log(`TerpSpecialtyEntry key: ${this.key}`);
	}
}