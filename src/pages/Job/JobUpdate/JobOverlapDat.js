import {action, observable} from 'mobx';
import type {JobKey} from '../../../datum/stache/JobDat';
import type {JobStatusId} from './JobBasics';
import {JOB_STATUS} from './JobBasics';
import thyme from '../../../Bridge/thyme';
import type {ThymeDt} from '../../../Bridge/thyme';
import type {DeafKey} from '../../../datum/stache/DeafDat';
import type {CompanyKey} from '../../../datum/stache/CompanyDat';
import type {LocationKey} from '../../../datum/stache/LocationDat';
import type {TerpKey} from '../../../datum/stache/TerpDat';

export class JobOverlapDat {
	
	@observable key: JobKey;
	@observable jobs: OverlapEntry[] = [];
	
	@action ApplyDatRaw = (datRaw) => {
		this.jobs = datRaw.jobs.map(j => new OverlapEntry(j));
	};
	
	constructor(key: JobKey) {this.key = key;}
	static Stub = (key: JobKey): JobOverlapDat => new JobOverlapDat(key);
}

export class OverlapEntry {
	@observable key: JobKey;
	@observable status: JobStatusId;
	@observable start: ThymeDt;
	@observable end: ThymeDt;
	@observable jobKey: JobKey;
	@observable companyKey: CompanyKey;
	@observable locationKey: LocationKey;
	@observable terpKey: TerpKey;
	@observable deafKeys: DeafKey[] = [];
	
	@observable isCancelled: boolean;
	
	constructor(entryRaw) {
		this.key = entryRaw.key;
		this.status = entryRaw.status;
		this.isCancelled = entryRaw.status === JOB_STATUS.Cancelled;
		this.start = thyme.fast.unpack(entryRaw.start);
		this.end = thyme.fast.unpack(entryRaw.end);
		this.jobKey = String(entryRaw.jobId);
		this.companyKey = entryRaw.companyId && String(entryRaw.companyId);
		this.locationKey = entryRaw.locationId && String(entryRaw.locationId);
		this.terpKey = entryRaw.terpId && String(entryRaw.terpId);
		this.deafKeys = (entryRaw.deafIds || []).map(d => String(d));
		
		// console.log(`JobOverlapDat.OverlapEntry.${this.key}`, this);
	}
}