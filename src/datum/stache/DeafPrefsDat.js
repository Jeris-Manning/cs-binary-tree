import {action, observable} from 'mobx';
import {DeafKey} from './DeafDat';
import type {IdKey} from '../../Bridge/misc/UpType';
import {
	MdBusiness,
	MdDoNotDisturb,
	MdFavoriteBorder,
	MdLocalHospital,
	MdSchool
} from 'react-icons/md';
import {IconType} from 'react-icons';

export type DeafPrefKey = string;
export type DeafPrefsLup = { [DeafPrefKey]: TerpKey[] }
export type DeafPref = {
	key: DeafPrefKey,
	label: string,
	icon: IconType,
};
export type DeafPrefsByTerp = {
	terpKey: TerpKey,
	prefs: DeafPref
}


export class DeafPrefsDat {
	
	@observable key: DeafKey;
	@observable deafId: IdKey;
	@observable noTerps: TerpKey[] = [];
	@observable prefs: DeafPrefsLup = {};
	@observable allGood: TerpKey[] = [];
	
	@action ApplyDatRaw = (datRaw) => {
		Object.assign(this, datRaw);
		// console.log(`DeafPrefsDat apply: `, datRaw);
		
		const allGood = [];
		for (const keys of Object.values(this.prefs)) {
			for (const terpKey of keys) {
				allGood.push(terpKey); // will have dupes but whatevs
			}
		}
		this.allGood = allGood;
	};
	
	constructor(key: DeafKey) {this.key = key;}
	static Stub = (key: DeafKey): DeafPrefsDat => new DeafPrefsDat(key);
	
}


const PREF_TYPES = [
	'general',
	'business',
	'medical',
	'educational',
	'no',
];

export const PREF_TYPES_GOOD = [
	'general',
	'business',
	'medical',
	'educational',
];

const PREF_ICON = {
	general: MdFavoriteBorder,
	business: MdBusiness,
	medical: MdLocalHospital,
	educational: MdSchool,
	no: MdDoNotDisturb,
};

export const DEAF_PREFS: { [DeafPrefKey]: DeafPref } = {
	general: {
		key: 'general',
		label: 'General',
		icon: MdFavoriteBorder,
	},
	business: {
		key: 'business',
		label: 'Business',
		icon: MdBusiness,
	},
	medical: {
		key: 'medical',
		label: 'Medical',
		icon: MdLocalHospital,
	},
	edu: {
		key: 'edu',
		label: 'Educational',
		icon: MdSchool,
	},
	
	no: {
		key: 'no',
		label: 'No Thanks',
		icon: MdDoNotDisturb,
	},
};