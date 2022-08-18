import {FilterStatus} from '../Bridge/misc/UpType';
import {IconType} from 'react-icons';
import {GiWoodenSign} from 'react-icons/gi';
import {MdAccessTime, MdFavorite} from 'react-icons/md';
import {FaEyeSlash} from 'react-icons/fa';
import {SeekerEntry} from './stache/JobSeekDat';


export type SeekerFilterKey = string;
export type SeekerFilterEntry = {
	key: SeekerFilterKey,
	label: string,
	defaultStatus: FilterStatus,
	icon?: IconType,
	tip?: string,
	description?: string,
	iconColors?: [string, string, string], // [unset, required, banned]
	labelColors?: [string, string, string], // [unset, required, banned]
	hasCriteria: (seeker: SeekerEntry) => boolean,
};
export type SeekerFilterSet = {
	req: SeekerFilterKey[],
	ban: SeekerFilterKey[],
}

export const SeekerFilterDefaults: SeekerFilterSet = {
	req: [],
	ban: ['hidden'],
};


export class SeekerFiltersDef {
	// for parity with dats
	
	open: SeekerFilterEntry = {
		key: 'open',
		label: 'Open',
		defaultStatus: 'unset',
		icon: GiWoodenSign,
		description: 'Can ALREADY see on job board',
		iconColors: ['#c5c5c5', '#314b39', '#af848a'],
		hasCriteria: (seeker) => seeker && !seeker.isRequested,
	};
	
	requested: SeekerFilterEntry = {
		key: 'requested',
		label: 'Requested',
		defaultStatus: 'unset',
		icon: MdFavorite,
		iconColors: ['#c5c5c5', '#314b39', '#af848a'],
		description: 'Has ALREADY been requested',
		hasCriteria: (seeker) => seeker && seeker.isRequested,
	};
	
	hidden: SeekerFilterEntry = {
		key: 'hidden',
		label: 'Hidden',
		defaultStatus: 'banned',
		icon: FaEyeSlash,
		iconColors: ['#c5c5c5', '#314b39', '#af848a'],
		description: 'Has hidden or declined the job',
		hasCriteria: (seeker) => seeker && (seeker.hiddenAt || seeker.declinedAt),
	};
	
	entries: SeekerFilterEntry[] = [this.open, this.requested, this.hidden];
	
	static MapToEntries(filterKeys: SeekerFilterKey[], filterObj: SeekerFiltersDef): SeekerFilterEntry[] {
		return filterKeys.map(key => filterObj[key]);
	}
	
}



export const NowTerpFilterEntry = {
	key: 'nowTerp',
	label: 'NowTerp',
	defaultStatus: 'unset',
	icon: MdAccessTime,
	description: 'Has NowTerp shift during this time',
	iconColors: ['#c5c5c5', '#86ad00', '#af848a'],
	// hasCriteria: (terp: TerpDat) => terp && terp.nowTerp,
};