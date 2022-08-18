import {action, observable} from 'mobx';
import $j from '../../Bridge/misc/$j';

export type RegionKey = string;
export type RegionId = number;

export class RegionDat {
	static UseEnumMode = true;
	
	@observable key: RegionKey;
	@observable entries: RegionEntry[] = [];
	@observable entryLup: {[RegionKey]: RegionEntry} = {};
	
	@action ApplyDatRaw = (datRaw) => {
		this.entries = datRaw
			.map(entryRaw => new RegionEntry(entryRaw))
			.sort($j.sort.default('region'));
		
		this.entryLup = $j.arrayToLup(this.entries);
	};
	
	constructor(key: RegionKey) {this.key = key;}
	static Stub = (key: RegionKey): RegionDat => new RegionDat(key);
}


export class RegionEntry {
	key: RegionKey;
	regionId: RegionId;
	region: string;
	abbreviation: string;
	description: string;
	label: string;
	
	constructor(entryRaw) {
		Object.assign(this, entryRaw);
		console.log(`RegionEntry key: ${this.key}`);
	}
}

/** temp, should be replaced */
export const REGION_IDS = {
	metro: 1,
	central: 2,
	northEast: 3,
	northWest: 4,
	southern: 5,
	wyoming: 6,
	vriPrimary: 7,
	wisconsin: 8,
	unknown: 404,
}

/** temp, should be replaced */
export const REGION_KEYS = {
	metro: '1',
	central: '2',
	northEast: '3',
	northWest: '4',
	southern: '5',
	wyoming: '6',
	vriPrimary: '7',
	wisconsin: '8',
	unknown: '404',
}