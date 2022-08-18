import {action, observable} from 'mobx';
import type {JobId} from './JobDat';
import type {ThymeDt} from '../../Bridge/thyme';
import type {DeafKey} from './DeafDat';
import type {TerpKey} from './TerpDat';
import type {LocationKey} from './LocationDat';


export type JobListKey = string;
export type JobListKeyer = (any) => JobListKey;

const toDateKey = (dt: ThymeDt) => dt.startOf('day').toFormat('yyyy-MM-dd');

export const JOB_LISTS = {
	byDate: (dt: ThymeDt) => `byDate_${toDateKey(dt)}`,
	followUp: (dt: ThymeDt) => `followUp_${toDateKey(dt)}`,
	// byDeaf: (deafKey: DeafKey, dt: ThymeDt) => `byDeaf_${deafKey}_${toDateKey(dt)}`,
	// byLoc: (locKey: LocationKey, dt: ThymeDt) => `byLoc_${locKey}_${toDateKey(dt)}`,
	// byTerp: (terpKey: TerpKey, dt: ThymeDt) => `byTerp_${terpKey}_${toDateKey(dt)}`,
};


export class JobListDat {
	
	@observable key: JobListKey;
	@observable jobIds: JobId[] = [];
	
	
	@action ApplyDatRaw = (datRaw) => {
		console.log(`JobListDat ${this.key} ApplyDatRaw: ${datRaw.jobIds.length}`, datRaw.jobIds);
		Object.assign(this, datRaw);
	};
	
	constructor(key: JobListKey) {this.key = key;}
	
	static Stub = (key: JobListKey): JobListDat => new JobListDat(key);
}