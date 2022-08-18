import {Jewels, LocalStaff, Staches} from '../../stores/RootStore';
import {action, computed} from 'mobx';
import {BaseJewel} from '../BaseJewel';
import type {JobId} from '../../datum/stache/JobDat';
import {SEEK_SUMMARIES, SeekSummaryDat} from '../../datum/stache/SeekSummaryDat';
import {SeekerEntry} from '../../datum/stache/JobSeekDat';
import type {T_BidAck_Params} from '../oJobSeek';

export const SEEKING_ISSUES = {
	noSeekers: `Abandoned: all seekers have been hidden or declined.`,
	badSeekers: `Abnormal Status/Seekers: job is not SEARCHING but has active seekers.`,
};

export class vBids extends BaseJewel {
	
	_BidAck = (params: T_BidAck_Params) => Jewels().oJobSeek.BidAck(params);
	
	
	/* BIDS */
	
	@computed get bidsDat(): SeekSummaryDat {
		return Staches().cSeekSummary.GetOrStub(SEEK_SUMMARIES.bids).dat;
	}
	
	@computed get bidSeekersNew(): SeekerEntry[] {
		return (this.bidsDat.bids || []).filter(b => !b.bidAckBy);
	}
	
	@computed get bidSeekersAcked(): SeekerEntry[] {
		return (this.bidsDat.bids || []).filter(b => b.bidAckBy);
	}
	
	@computed get bidsNewCount(): number {
		return this.bidSeekersNew.length || 0;
	}
	
	@computed get bidsAckedCount(): number {
		return this.bidSeekersAcked.length || 0;
	}
	
	
	/* ISSUES */
	
	@computed get noSeekersDat(): SeekSummaryDat {
		return Staches().cSeekSummary.GetOrStub(SEEK_SUMMARIES.noSeekers).dat;
	}
	
	@computed get noSeekersJobIds(): JobId[] {
		return this.noSeekersDat.jobIds || [];
	}
	
	@computed get badSeekersDat(): SeekSummaryDat {
		return Staches().cSeekSummary.GetOrStub(SEEK_SUMMARIES.badSeekers).dat;
	}
	
	@computed get badSeekersJobIds(): JobId[] {
		return this.badSeekersDat.jobIds || [];
	}
	
	@computed get issuesCount(): number {
		return this.noSeekersJobIds.length
			+ this.badSeekersJobIds.length;
	}
	
	
	/* SEEKER COUNTS */
	
	@computed get searchingCountDat(): SeekSummaryDat {
		return Staches().cSeekSummary.GetOrStub(SEEK_SUMMARIES.searchingCount).dat;
	}
	
	@computed get searchingCount(): number {
		return this.searchingCountDat.count || 0;
	}
	
	
	@computed get seekerCountDat(): SeekSummaryDat {
		return Staches().cSeekSummary.GetOrStub(SEEK_SUMMARIES.seekerCount).dat;
	}
	
	@computed get seekerCount(): number {
		return this.seekerCountDat.count || 0;
	}
	
}
