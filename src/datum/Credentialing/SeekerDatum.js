import {observable} from 'mobx';
import thyme from '../../Bridge/thyme';
import type {ThymeDt} from '../../Bridge/thyme';

export type SeekerKey = string;

export class SeekerDatum {
	
	@observable key: SeekerKey;
	@observable seekerId: number;
	@observable jobId: number;
	@observable terpId: number;
	@observable description: string;
	@observable bidAt: ThymeDt;
	@observable bidNote: string;
	@observable requested: boolean;
	@observable bidAckBy: number; // staffId
	
	@observable start: ThymeDt;
	@observable end: ThymeDt;
	@observable companyName: string;
	@observable status: number;
	
	
	constructor(raw) {
		Object.assign(this, raw);
		
		this.key = `seeker_${raw.seekerId}`;
		this.seekerId = Number(raw.seekerId);
		this.jobId = Number(raw.jobId);
		this.terpId = Number(raw.terpId);
		this.description = raw.description;
		this.bidAt = thyme.fast.unpack(raw.bidAt);
		this.bidNote = raw.bidNote;
		this.requested = !!raw.requested;
		this.bidAckBy = raw.bidAckBy;
		
		// job stuff
		this.start = thyme.fast.unpack(raw.start);
		this.end = thyme.fast.unpack(raw.end);
		this.companyName = raw.companyName;
		this.status = raw.status;
		
	}
	
}

export type WarningJobKey = string;

export class WarningJobDatum {
	
	
	@observable key: WarningJobKey;
	@observable jobId: number;
	@observable start: ThymeDt;
	@observable end: ThymeDt;
	@observable companyName: string;
	@observable status: number;
	
	
	constructor(raw) {
		Object.assign(this, raw);
		
		this.key = `job_${raw.jobId}`;
		this.jobId = Number(raw.jobId);
		
		// job stuff
		this.start = thyme.fast.unpack(raw.start);
		this.end = thyme.fast.unpack(raw.end);
		this.companyName = raw.companyName;
		this.status = raw.status;
		
	}
}