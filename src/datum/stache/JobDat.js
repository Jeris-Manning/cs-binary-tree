import {action, computed, observable} from 'mobx';
import thyme from '../../Bridge/thyme';
import type {ThymeDt} from '../../Bridge/thyme';
import type {JobStatusId} from '../../pages/Job/JobUpdate/JobBasics';
import type {IdKey} from '../../Bridge/misc/UpType';
import {Staches} from '../../stores/RootStore';
import {TerpDat} from './TerpDat';
import type {SeriesId} from './JobSeriesDat';
import $j from '../../Bridge/misc/$j';
import type {RegionId} from './RegionDat';
import {LocationDat} from './LocationDat';

export type JobKey = string;
export type JobId = number;

export type C_JobDat = {
	jobDat: JobDat,
}

export class JobDat {
	
	@observable key: JobKey;
	@observable jobId: string;
	@observable status: JobStatusId;
	@observable start: ThymeDt;
	@observable end: ThymeDt;
	
	@observable companyId: IdKey;
	@observable contactId: IdKey;
	@observable deafIds: IdKey[] = [];
	@observable locationId: IdKey;
	@observable terpId: IdKey;
	
	@observable createdAt: ThymeDt;
	@observable createdBy: string;
	
	@observable isCancelled: boolean;
	@observable billType: string;
	@observable situation: string;
	@observable specialNotes: string;
	@observable contactUponArrival: string;
	@observable requestedBy: string;
	@observable p2pDispatch: ThymeDt;
	@observable p2pHome: ThymeDt;
	@observable qbStatus: string;
	
	@observable rate: string;
	@observable cap: string;
	@observable hourMin: string;
	@observable flatRate: string;
	@observable overrideRate: string;
	@observable terpTravel: string;
	@observable terpTravelRate: string;
	@observable companyTravel: string;
	@observable companyTravelRate: string;
	
	@observable hasCompanyInvoiced: string;
	@observable companyInvoice: string;
	@observable terpInvoice: string;
	@observable terpInvoicedOn: ThymeDt;
	@observable terpVendorBillCreated: string;
	@observable terpInvoicedTotal: string;
	
	@observable confirmationInfo: string; // company confirmation
	@observable companyConfirmed: ThymeDt;
	@observable terpConfirmed: ThymeDt;
	@observable internConfirmed: ThymeDt;
	
	@observable vri: boolean;
	@observable vriLink: string;
	@observable vriPassword: string;
	@observable vriOther: string;
	
	@observable receivedFrom: string;
	@observable followUp: boolean;
	@observable warning: string;
	
	@observable seriesId: SeriesId;
	
	@observable wantedTerps: TerpDat[] = [];
	@observable interns: TerpDat[] = [];
	
	@observable hashtags: string[] = [];
	
	@action ApplyDatRaw = (datRaw) => {
		Object.assign(
			this,
			thyme.fast.obj.unpack(datRaw)
		);
		
		this.deafIds = (datRaw.deafIds || []).map(d => String(d));
		
		// const cDeaf = Staches().cDeaf;
		// this.deafs = (datRaw.deafs || [])
		// 	.map(d => cDeaf.GetOrStub(d));
		// console.log(`________ deafs: `, datRaw.deafs, this.deafs)
		
		const cTerp = Staches().cTerp;
		
		this.wantedTerps = (datRaw.wantedTerps || [])
			.map(key => cTerp.GetOrStub(key, true, 'JobDat').dat);
		
		this.interns = (datRaw.interns || [])
			.map(key => cTerp.GetOrStub(key, true, 'JobDat').dat);
		
		
		this.hashtags = [...$j.findHashTags(this.situation), $j.findHashTags(this.specialNotes)];
	};
	
	constructor(key: JobKey) {this.key = key;}

	static Stub = (key: JobKey): JobDat => new JobDat(key);
	
	
	
	/* compute wrappers (for JobUpdata) */
	
	@computed get startTime(): ThymeDt {
		return this.start;
	}
	
	@computed get endTime(): ThymeDt {
		return this.end;
	}
	
	@computed get date(): ThymeDt {
		return thyme.toDateStart(this.start);
	}
	
	
	@computed get locationDat(): LocationDat {
		return Staches().cLocation.GetOrStub(this.locationId, true, 'JobDat').dat;
	}
	
	@computed get terpRegion(): RegionId {
		return this.locationDat.terpRegionId;
	}
}