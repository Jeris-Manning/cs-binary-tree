import $j from '../../../Bridge/misc/$j';
import thyme from '../../../Bridge/thyme';
import {JOB_STATUS_ID_LABEL, QB_STATUS_ID_LABEL} from '../JobUpdate/JobBasics';
import type {ThymeDt} from '../../../Bridge/thyme';
import {Staches} from '../../../stores/RootStore';
import type {BillTypeId, BillTypeName} from '../../../datum/stache/BillTypeDat';
import {JobRef} from '../JobUpdate/JobRef';
import {toJS} from 'mobx';

export type SeriesFieldKey = string;
export type SelectedSeriesFieldMap = Map<SeriesFieldKey, boolean>;

export type T_SeriesField = {
	key: SeriesFieldKey,
	label: string,
	selectByDefault?: boolean,
	fnFormat?: (val: any, jobDat: JobDat) => string,
	fnIsEqual?: (valA: any, valB: any) => boolean,
	fnPack?: (val: any, sourceJobDat: JobDat, targetJobDat: JobDat, changesObj: {}) => any,
}

const ThymeProps = {
	fnFormat: (dt) => thyme.nice.time.short(dt) || 'none',
	fnIsEqual: thyme.isSameTime,
	fnPack: thyme.fast.pack,
}

/** jobDat[key] */
export const SERIES_FIELDS = {
	// needs to be its own thing (lots of side effects)
	// terpId: {
	// 	key: 'terpId',
	// 	label: 'Interpreter',
	// 	fnFormat: (terpId) => {
	// 		if (!terpId) return `no terp`;
	// 		return Staches().cTerp.GetOrStub(terpId).dat.label;
	// 	}
	// },
	start: {
		key: 'start',
		label: 'Start',
		selectByDefault: true,
		...ThymeProps,
		fnPack: (val: ThymeDt, sourceJobDat: JobDat, targetJobDat: JobDat) => {
			return val;
			// const previousStart = targetJobDat.start;
			// const newStart = thyme.combine(
			// 	targetJobDat.start, // target's date (same as before)
			// 	sourceJobDat.start, // source's time (new)
			// );
			// return [thyme.fast.pack(previousStart), thyme.fast.pack(newStart)];
		},
	},
	end: {
		key: 'end',
		label: 'End',
		selectByDefault: true,
		...ThymeProps,
		fnPack: (val: ThymeDt, sourceJobDat: JobDat, targetJobDat: JobDat) => {
			return val;
			// const previousEnd = targetJobDat.end;
			// const newEnd = thyme.combine(
			// 	targetJobDat.end, // target's date (same as before)
			// 	sourceJobDat.end, // source's time (new)
			// );
			// return [thyme.fast.pack(previousEnd), thyme.fast.pack(newEnd)];
		},
	},
	status: {
		key: 'status',
		label: 'Status',
		fnFormat: (statusId) => JOB_STATUS_ID_LABEL[statusId],
	},
	billType: {
		key: 'billType',
		label: 'Bill Type',
		selectByDefault: true,
		// fnFormat: (v, t) => t.billType,
		fnPack: (val: BillTypeName, source, target, changes, jobRef: JobRef) => {
			const entry = jobRef.billTypeDat.entryByName[val];
			changes.isCancelled = entry.cancelled;
			return val;
		}
	},
	situation: {
		key: 'situation',
		label: 'Situation',
		selectByDefault: true,
		fnFormat: (v) => $j.trunc(v, 200, '...'),
	},
	rate: {
		key: 'rate',
		label: 'Rate',
		selectByDefault: true,
	},
	cap: {
		key: 'cap',
		label: 'Cap',
		selectByDefault: true,
	},
	specialNotes: {
		key: 'specialNotes',
		label: 'Special Notes',
		selectByDefault: true,
		fnFormat: (v) => $j.trunc(v, 200, '...'),
	},
	hourMin: {
		key: 'hourMin',
		label: 'Hour Min',
		selectByDefault: true,
	},
	flatRate: {
		key: 'flatRate',
		label: 'Flat Rate',
		selectByDefault: true,
	},
	overrideRate: {
		key: 'overrideRate',
		label: 'Override Rate',
		selectByDefault: true,
	},
	contactUponArrival: {
		key: 'contactUponArrival',
		label: 'Contact Arrival',
		selectByDefault: true,
	},
	requestedBy: {
		key: 'requestedBy',
		label: 'Requested By',
		selectByDefault: true,
	},
	deafIds: {
		key: 'deafIds',
		label: 'Deaf Names',
		selectByDefault: true,
		fnFormat: (deafIds) => (deafIds || [])
			.map(deafId => Staches().cDeaf.GetOrStub(deafId, true, 'SERIES_FIELDS')
				.label)
			.join(', '), // this should be loaded... hopefully?
		fnIsEqual: $j.compare.array,
		fnPack: v => toJS(v),
	},
	confirmationInfo: {
		key: 'confirmationInfo',
		label: 'Confirm Info',
		selectByDefault: true,
	},
	locationId: {
		key: 'locationId',
		label: 'Location',
		selectByDefault: true,
		fnFormat: (locId) => $j.trunc(
			Staches().cLocation.GetOrStub(locId, true, 'SERIES_FIELDS').label,
			200
		),
	},
	// need to change server side if these are wanted:
	// p2pDispatch: {
	// 	key: 'p2pDispatch',
	// 	label: 'P2P Dispatch',
	// 	selectByDefault: true,
	// 	...ThymeProps,
	// },
	// p2pHome: {
	// 	key: 'p2pHome',
	// 	label: 'P2P Home',
	// 	selectByDefault: true,
	// 	...ThymeProps,
	// },
	qbStatus: {
		key: 'qbStatus',
		label: 'QB Status',
		fnFormat: (qbStatus) => QB_STATUS_ID_LABEL[qbStatus],
	},
	vri: {
		key: 'vri',
		label: 'VRI',
		selectByDefault: true,
		fnFormat: (v) => v ? 'true' : 'false',
	},
	followUp: {
		key: 'followUp',
		label: 'Follow Up',
		selectByDefault: true,
		fnFormat: (v) => v ? 'true' : 'false',
	},
	warning: {
		key: 'warning',
		label: 'Warning',
		selectByDefault: true,
	},
	// isCancelled: {
	// 	label: 'Cancelled',
	// 	selectByDefault: true,
	//
	// 	fnFormat: (v) => v ? 'true' : 'false',
	// },
	companyConfirmed: {
		key: 'companyConfirmed',
		label: 'Confirmed Company',
		...ThymeProps,
	},
	terpConfirmed: {
		key: 'terpConfirmed',
		label: 'Confirmed Interpreter',
		...ThymeProps,
	},
	terpTravel: {
		key: 'terpTravel',
		label: 'Terp Travel',
		selectByDefault: true,
	},
	terpTravelRate: {
		key: 'terpTravelRate',
		label: 'Terp Travel Rate',
		selectByDefault: true,
	},
	companyTravel: {
		key: 'companyTravel',
		label: 'Company Travel',
		selectByDefault: true,
	},
	companyTravelRate: {
		key: 'companyTravelRate',
		label: 'Company Travel Rate',
		selectByDefault: true,
	},
	vriLink: {
		key: 'vriLink',
		label: 'VRI Link',
	},
	vriPassword: {
		key: 'vriPassword',
		label: 'VRI Password',
	},
	vriOther: {
		key: 'vriOther',
		label: 'VRI Misc',
	},
	wantedTerps: {
		key: 'wantedTerps',
		label: `Wanted Terps`,
		fnFormat: (v) => (v || []).map(terpDat => terpDat.label).join(', '),
		fnIsEqual: $j.compare.with.array('key'),
		fnPack: (v) => (v || []).map(terpDat => terpDat.key),
	},
	interns: {
		key: 'interns',
		label: `Interns`,
		fnFormat: (v) => (v || []).map(terpDat => terpDat.label).join(', '),
		fnIsEqual: $j.compare.with.array('key'),
		fnPack: (v) => (v || []).map(terpDat => terpDat.key),
	},
	createdBy: {
		key: 'createdBy',
		label: 'Created By',
	},
};

export const SERIES_FIELDS_ARRAY: T_SeriesField[] = Object.values(SERIES_FIELDS);

export const GetDefaultSeriesFieldKeyMap = (): SelectedSeriesFieldMap => {
	const map = new Map();
	for (let field of SERIES_FIELDS_ARRAY) {
		if (!field.selectByDefault) continue;
		
		map.set(field.key, true);
	}
	return map;
};