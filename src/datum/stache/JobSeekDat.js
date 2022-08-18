import {action, observable} from 'mobx';
import type {JobId, JobKey} from './JobDat';
import thyme from '../../Bridge/thyme';
import type {ThymeDt} from '../../Bridge/thyme';
import type {TerpId, TerpKey} from './TerpDat';

export type SeekerId = number;

export class JobSeekDat {
	@observable key: JobKey;
	@observable activeSeekerCount: number = 0;
	@observable newBids: SeekerEntry[] = [];
	@observable ackBids: SeekerEntry[] = [];
	@observable hidden: SeekerEntry[] = [];
	@observable declined: SeekerEntry[] = [];
	@observable seen: SeekerEntry[] = [];
	@observable pending: SeekerEntry[] = []; // active seekers with no status change
	
	@observable active: SeekerEntry[] = [];
	@observable bids: SeekerEntry[] = [];
	@observable terpSeekers: Map<TerpKey, SeekerEntry> = new Map();
	
	@observable lastDescription: string;
	
	@action ApplyDatRaw = (datRaw) => {
		this.activeSeekerCount = datRaw.activeSeekerCount;
		this.newBids = thyme.fast.array.unpack(datRaw.newBids || []);
		this.ackBids = thyme.fast.array.unpack(datRaw.ackBids || []);
		this.hidden = thyme.fast.array.unpack(datRaw.hidden || []);
		this.declined = thyme.fast.array.unpack(datRaw.declined || []);
		this.seen = thyme.fast.array.unpack(datRaw.seen || []);
		this.pending = thyme.fast.array.unpack(datRaw.pending || []);
		
		this.active = [
			...this.newBids,
			...this.ackBids,
			...this.hidden,
			...this.declined,
			...this.seen,
			...this.pending,
		];
		
		this.bids = [
			...this.newBids,
			...this.ackBids,
		];
		
		for (let seeker of this.active) {
			this.terpSeekers.set(seeker.terpKey, seeker);
		}
		
		this.lastDescription = datRaw.lastDescription;
		console.log(`lastDescription: ${this.lastDescription}`);
	};
	
	constructor(key: JobKey) {this.key = key;}
	static Stub = (key: JobKey): JobSeekDat => new JobSeekDat(key);
}

export class SeekerEntry {
	seekerId: SeekerId;
	active: boolean;
	jobId: JobId;
	terpId: TerpId;
	terpKey: TerpKey;
	sentAt: ThymeDt;
	description: string;
	seenAt: ThymeDt;
	declinedAt: ThymeDt;
	hiddenAt: ThymeDt;
	bidAt: ThymeDt;
	bidNote: string;
	isRequested: boolean;
	acceptedAt: ThymeDt;
	bidAckBy: number; // staffId
}