import {action, computed, observable} from 'mobx';
import {REGION_KEYS, RegionEntry} from './stache/RegionDat';
import {TerpSpecialtyEntry} from './stache/TerpSpecialtyDat';
import {DemandEntry} from './stache/DemandDat';
import {TerpTagFilterSet} from './stache/TerpTagDat';
import {Staches} from '../stores/RootStore';
import {Updata} from '../Bridge/misc/Updata';
import {UpType} from '../Bridge/misc/UpType';
import {FaMapMarkedAlt, FaSortAlphaDown} from 'react-icons/fa';
import {Upstate} from '../Bridge/misc/Upstate';
import type {SeekerFilterSet} from './SeekerFiltersDef';
import {SeekerFilterDefaults} from './SeekerFiltersDef';
import {JobRef} from '../pages/Job/JobUpdate/JobRef';

export class SeekUpdata {
	
	@observable demands: Upstate<DemandEntry[]> = UpType.EnumArray();
	@observable regionFilters: Upstate<RegionEntry[]> = UpType.EnumArray();
	@observable specialtyFilters: Upstate<TerpSpecialtyEntry[]> = UpType.EnumArray();
	@observable tagFilters: Upstate<TerpTagFilterSet> = UpType.Filter();
	@observable seekerFilters: Upstate<SeekerFilterSet> = UpType.Filter(SeekerFilterDefaults);
	@observable nowTerpFilter = UpType.FilterSingle(); // NowTerpFilter
	// @observable miscFilters: Upstate<MiscFilterSet> = UpType.Filter(MISC_FILTER_DEFAULTS);
	
	@observable terpSorting = UpType.Enum(TERP_SORTING);
	@observable showAllDemands = UpType.Bool();
	@observable selectedTerps = UpType.EnumMap(); // TerpDats
	@observable whyNotTerp = UpType.Enum();
	
	@observable openDescription = UpType.String();
	@observable requestMessage = UpType.String();
	
	@observable jobRef: JobRef;
	
	
	@observable allKeys = [];
	@observable allStates = [];
	
	@computed get hasChanged() {
		return this.allStates.some(f => f.hasChanged);
	}
	
	
	constructor(jobRef: JobRef) { this.Construct(jobRef); }
	
	@action Construct = (jobRef: JobRef) => {
		Updata.Init(this, {}, {});
		
		this.jobRef = jobRef;
		
		this.demands.SetUseInitialValueObj(this, 'defaultDemands');
		this.regionFilters.SetUseInitialValueObj(this, 'defaultRegions');
		
		// TODO: use seekClutch after saving filter/etc. state is implemented
		
		this.tagFilters.SetUseClutch(
			Staches().cTerpTag.GetEnumClutch(),
			'seekDefaultTags'
		);
		
		this.terpSorting.SetInitialValue(TERP_SORTING[0]);
		
		this.openDescription.SetFallbackComputedObj(this, 'lastDescription');
	};
	
	@computed get defaultDemands(): DemandEntry[] {
		const companyPrefs = this.jobRef.companyPrefs;
		let demandIds = [...companyPrefs.demandIds];
		if (!demandIds || demandIds.length === 0) demandIds = ['2']; // contract
		
		if (this.jobRef.isVri) {
			if (!demandIds.includes('52')) {
				// VRI from Home
				demandIds.push('52');
			}
		}
		
		const demandDat = this.jobRef.demandDat;
		
		if (!demandDat.entryLup) return []; // not loaded yet
		
		const entries = demandIds.map(key => demandDat.entryLup[key]);
		return entries.filter(e => e.enabled);
	}
	
	@computed get defaultRegions(): RegionEntry {
		const cRegion = Staches().cRegion;
		const regionDat = cRegion.GetEnumClutch().dat;
		
		if (this.jobRef.isVri) {
			const vriEntry = regionDat.entryLup[REGION_KEYS.vriPrimary];
			return vriEntry ? [vriEntry] : [];
		}
		
		const regionEntry = this.jobRef.location.region;
		return regionEntry ? [regionEntry] : [];
	}
	
	@computed get lastDescription(): string {
		return this.jobRef.seekDat.lastDescription;
	}
	
	
	@action Revert = () => {
		this.demands.Revert();
		this.regionFilters.Revert();
		this.specialtyFilters.Revert();
		this.tagFilters.Revert();
		this.seekerFilters.Revert();
		this.nowTerpFilter.Revert();
		this.selectedTerps.Revert();
	};
	
}



// TODO: delete

// export type MiscFilterKey = string;
// export type MiscFilterEntry = {
// 	...FilterEntry,
// 	required: (TerpDat, SeekerEntry) => boolean,
// 	banned: (TerpDat, SeekerEntry) => boolean,
// }

// export type MiscFilterSet = {
// 	req: MiscFilterKey[],
// 	ban: MiscFilterKey[],
// }

// const MISC_FILTER_DEFAULTS: MiscFilterSet = {
// 	req: [],
// 	ban: ['hidden'],
// };

// export function MiscFilterMapToEntries(filterKeys: MiscFilterKey[]): MiscFilterEntry[] {
// 	filterKeys.map(key => MISC_FILTER_CHOICE_LUP[key]);
// }


// const MISC_FILTER_CHOICE_LUP: { [MiscFilterKey]: MiscFilterEntry } = {
// 	open: {
// 		key: 'open',
// 		label: 'Open',
// 		defaultStatus: 'unset',
// 		icon: GiWoodenSign,
// 		description: 'Can ALREADY see on job board',
// 		has: (terp, seeker) => seeker && !seeker.isRequested,
// 		required: (terp, seeker) => seeker && !seeker.isRequested,
// 		banned: (t, s) => !s || s.isRequested,
// 		iconColors: ['#c5c5c5', '#314b39', '#af848a'],
// 	},
// 	requested: {
// 		key: 'requested',
// 		label: 'Requested',
// 		defaultStatus: 'unset',
// 		icon: MdFavorite,
// 		description: 'Has ALREADY been requested',
// 		required: (terp, seeker) => seeker && seeker.isRequested,
// 		banned: (terp, seeker) => !seeker || !seeker.isRequested,
// 		iconColors: ['#c5c5c5', '#314b39', '#af848a'],
// 	},
// 	hidden: {
// 		key: 'hidden',
// 		label: 'Hidden',
// 		defaultStatus: 'banned',
// 		icon: FaEyeSlash,
// 		description: 'Has hidden or declined the job',
// 		required: (terp, seeker) => seeker && (seeker.hiddenAt || seeker.declinedAt),
// 		banned: (terp, seeker) => !seeker || (!seeker.hiddenAt && !seeker.declinedAt),
// 		iconColors: ['#c5c5c5', '#314b39', '#af848a'],
// 	},
// 	nowTerp: {
// 		// TODO
// 		// TODO: update
// 		// TODO
// 		key: 'nowTerp',
// 		label: 'NowTerp',
// 		defaultStatus: 'unset',
// 		icon: MdAccessTime,
// 		description: 'Has NowTerp shift during this time',
// 		required: (terp, seeker) => terp && terp.nowTerp,
// 		banned: (terp, seeker) => !terp || !terp.nowTerp,
// 		iconColors: ['#c5c5c5', '#86ad00', '#af848a'],
// 	},
//
// 	// onlyPreferred // TODO
// };

// export const SEEK_MISC_FILTERS = Object.values(MISC_FILTER_CHOICE_LUP);


const TERP_SORTING = [
	{
		key: 'lastName',
		label: 'Last Name',
		icon: FaSortAlphaDown,
		tooltip: ['Sorting by last name (click to change)', '[staff terps at top]'],
		sort: GetTerpSortFunc('lastName', '', true),
	},
	{
		key: 'distance',
		label: 'Distance',
		icon: FaMapMarkedAlt,
		tooltip: ['Sorting by distance (click to change)', '[staff terps at top]'],
		sort: GetTerpSortFunc('distance', 999999, false),
	},
];

function GetTerpSortFunc(innerKey, valIfNull, isString, putStaffOnTop = true) {
	return (terpA, terpB) => {
		if (putStaffOnTop) {
			if (terpA.isStaff && !terpB.isStaff) return -1;
			if (!terpA.isStaff && terpB.isStaff) return +1;
		}
		
		let _a = terpA[innerKey] || valIfNull;
		let _b = terpB[innerKey] || valIfNull;
		
		if (isString) {
			_a = _a.toLowerCase();
			_b = _b.toLowerCase();
		}
		
		if (_a < _b) return -1;
		if (_a > _b) return +1;
		return 0;
	};
}

// export type SeekTagFilters = {
// 	req: TerpTagId[],
// 	ban: TerpTagId[],
// };

// export type SeekMiscFilterKey = string;
// export const SEEK_MISC_FILTER_KEYS: {[SeekMiscFilterKey]: string} = {
// 	open: 'open',
// 	requested: 'requested',
// 	hidden: 'hidden',
// 	nowTerp: 'nowTerp',
//
// 	// TODO: implement
// 	onlyPreferred: 'onlyPreferred',
// }

// export type SeekMiscFilters = {
// 	req: SeekMiscFilterKey[],
// 	ban: SeekMiscFilterKey[],
// };


/*

Seek History
	filters
		- tag
			- req: [...tagId]
			- ban: [...tagId]
		- region: [...regionId]
		- specialty: [...specialtyId]
		- misc: {req: [...key], ban: [...key]}
			- open
			- requested
			- hidden
			- nowTerp
		- max distance: number  (not implemented)
	demands: [...demandId]
	preferred?

 */