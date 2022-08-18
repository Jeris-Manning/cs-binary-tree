import {action, observable} from 'mobx';
import thyme from '../../Bridge/thyme';
import type {JobId, JobKey} from './JobDat';

export type SeriesKey = string;
export type SeriesId = number;

export class JobSeriesDat {
	
	@observable key: SeriesKey;
	@observable seriesId: SeriesId;
	@observable jobIds: JobId[] = [];
	@observable jobKeys: JobKey[] = [];
	@observable note: string;
	
	@action ApplyDatRaw = (datRaw) => {
		console.log(`JobSeriesDat.ApplyDatRaw`, datRaw);
		
		Object.assign(
			this,
			thyme.fast.obj.unpack(datRaw)
		);
		
		this.jobKeys = this.jobIds.map(j => String(j));
	};
	
	constructor(key: SeriesKey) {this.key = key;}
	
	static Stub = (key: SeriesKey): JobSeriesDat => new JobSeriesDat(key);
}