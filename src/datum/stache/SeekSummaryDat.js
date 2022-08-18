import {action, observable} from 'mobx';
import type {JobId} from './JobDat';
import {SeekerEntry} from './JobSeekDat';
import thyme from '../../Bridge/thyme';

export type T_SeekSummaryKey = string;
export const SEEK_SUMMARIES = {
	bids: 'bids',
	noSeekers: 'noSeekers',
	badSeekers: 'badSeekers',
	searchingCount: 'searchingCount',
	seekerCount: 'seekerCount',
};




export class SeekSummaryDat {
	
	@observable key: T_SeekSummaryKey;
	@observable count: number;
	@observable jobIds: JobId[]; // can be null
	@observable bids: SeekerEntry[]; // can be null
	
	@action ApplyDatRaw = (datRaw) => {
		// console.log(`SeekSummaryDat ${this.key} ApplyDatRaw: `, datRaw);
		
		switch (this.key) {
			case SEEK_SUMMARIES.bids: return this.SetBids(datRaw);
			case SEEK_SUMMARIES.noSeekers: return this.SetJobIds(datRaw);
			case SEEK_SUMMARIES.badSeekers: return this.SetJobIds(datRaw);
			case SEEK_SUMMARIES.searchingCount: return this.SetCount(datRaw);
			case SEEK_SUMMARIES.seekerCount: return this.SetCount(datRaw);
		}
	};
	
	@action SetBids = (bids: SeekerEntry[]) => {
		this.bids = thyme.fast.array.unpack(bids || []);
		this.count = this.bids.length;
	}
	
	@action SetCount = (count: number) => {
		this.count = count || 0;
	}
	
	@action SetJobIds = (jobIds: JobId[]) => {
		this.jobIds = jobIds || [];
		this.count = this.jobIds.length;
	}
	
	constructor(key: T_SeekSummaryKey) {this.key = key;}
	static Stub = (key: T_SeekSummaryKey): SeekSummaryDat => new SeekSummaryDat(key);
}