import {computed, observable} from 'mobx';
import {Clutch} from '../../../Bridge/DockClient/Stache';
import {JobDat} from '../../../datum/stache/JobDat';
import {SERIES_FIELDS, SERIES_FIELDS_ARRAY, SeriesFieldKey} from './LinkedSeriesFields';

/** `originJobKey_targetJobKey` */
export type JobDiffKey = string;
export type JobDiffMap = Map<SeriesFieldKey, string>;

export class JobDiffInfo {
	@observable key: JobDiffKey;
	@observable originJobClutch: Clutch<JobDat>;
	@observable targetJobClutch: Clutch<JobDat>;
	
	constructor(originJobClutch: Clutch<JobDat>, targetJobClutch: Clutch<JobDat>) {
		this.key = `${originJobClutch.key}_${targetJobClutch.key}`;
		this.originJobClutch = originJobClutch;
		this.targetJobClutch = targetJobClutch;
	}
	
	
	// @computed get originJobDat(): JobDat { return this.originJobClutch.dat; }
	// @computed get targetJobDat(): JobDat { return this.targetJobClutch.dat; }
	
	@computed get diffs(): JobDiffMap {
		let diffMap: JobDiffMap = new Map();
		
		const origin: JobDat = this.originJobClutch.dat;
		const target: JobDat = this.targetJobClutch.dat;
		
		for (let field of SERIES_FIELDS_ARRAY) {
			const valA = origin[field.key];
			const valB = target[field.key];
			
			const isEqual = field.fnIsEqual
				? field.fnIsEqual(valA, valB)
				: valA === valB;
			
			if (isEqual) continue; // no difference
			
			const formattedValB = field.fnFormat
				? field.fnFormat(valB)
				: valB;
			
			diffMap.set(
				field.key,
				`${field.label}: ${formattedValB}`
			);
		}
		
		return diffMap;
	}
	
	@computed get isSame(): boolean {
		return this.diffs.size === 0;
	}
	
	@computed get differentFieldKeys(): SeriesFieldKey[] {
		return [...this.diffs.keys()];
	}
}