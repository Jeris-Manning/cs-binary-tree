import {action, observable} from 'mobx';
import type {JobId} from './JobDat';
import type {ThymeDt} from '../../Bridge/thyme';
import {badDt} from '../../Bridge/thyme';


// yyyy-MM-dd
export type JobsByDateKey = string;

export const MakeJobsByDateKey = (dt: ThymeDt): JobsByDateKey | null => {
	if (badDt(dt)) return null;
	return dt.toFormat('yyyy-MM-dd');
}

export type JobsByDateEntry = {
	key: JobKey,
	jobId: JobId,
	status: JobStatusId,
	followUp: boolean,
	vri: boolean,
	start: ThymeDt,
	companyConfirmed: ThymeDt,
	terpConfirmed: ThymeDt,
}


export class JobsByDateDat {
	
	@observable key: JobsByDateKey;
	@observable jobs: Map<JobsByDateKey, JobsByDateEntry> = new Map();
	
	
	@action ApplyDatRaw = (datRaw) => {
		// console.log(`JobsByDateDat ${this.key} ApplyDatRaw: `, datRaw.jobs);
		
		for (const [key, entry] of Object.entries(datRaw.jobs)) {
			// console.log(`JobsByDateDat ${this.key} set job: ${key}`, entry);
			this.jobs.set(key, entry);
		}
	};
	
	constructor(key: JobsByDateKey) {this.key = key;}
	static Stub = (key: JobsByDateKey): JobsByDateDat => new JobsByDateDat(key);
}