import {action, computed, observable} from 'mobx';
import type {DatKey} from '../../Bridge/DockClient/Stache';
import $j from '../../Bridge/misc/$j';
import {IconType} from 'react-icons';
import {GetTagIcon} from '../../pages/Job/Seeking/SeekTerpTags';
import type {FilterSet, FilterStatus, IdKey} from '../../Bridge/misc/UpType';

export type TerpTagKey = string;
export type TerpTagId = number;

export class TerpTagDat {
	static UseEnumMode = true;
	
	@observable key: DatKey; // disregarded
	@observable entries: TerpTagEntry[] = [];
	@observable entryLup: {[TerpTagKey]: TerpTagEntry};
	
	@action ApplyDatRaw = (datRaw) => {
		this.entries = datRaw
			.map(entryRaw => new TerpTagEntry(entryRaw));
		
		this.entryLup = $j.arrayToLup(this.entries);
	};
	
	constructor(key: DatKey) {this.key = key;}
	static Stub = (key: DatKey): TerpTagDat => new TerpTagDat(key);
	
	
	@computed get seekDefaultTags(): FilterSet {
		let filterSet: FilterSet = {req: [], ban: []};
		
		for (let tagEntry of this.entries) {
			if (!tagEntry.showSeek) continue;
			
			const status: FilterStatus = tagEntry.defaultStatus;
			if (status === 'required') filterSet.req.push(tagEntry.key);
			else if (status === 'banned') filterSet.ban.push(tagEntry.key);
		}
		
		// console.log(`seekDefaultTags:`, filterSet);
		
		return filterSet;
	}
	
	
	static MapToEntries(tagKeys: TerpTagKey[], tagDat: TerpTagDat) : TerpTagEntry[] {
		return tagKeys.map(key => tagDat.entryLup[key]);
	}
}

export class TerpTagEntry {
	key: TerpTagKey;
	tagId: TerpTagId;
	tag: string;
	description: string;
	showSeek: boolean;
	defaultStatus: string;
	order: number;
	label: string;
	
	icon: IconType;
	
	constructor(entryRaw) {
		Object.assign(this, entryRaw);
		this.icon = GetTagIcon(entryRaw.tagId);
	}
	
	toString() {
		return this.label;
	}
}

export type TerpTagFilterSet = {
	req: TerpTagKey[],
	ban: TerpTagKey[],
}