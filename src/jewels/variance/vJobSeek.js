import {action, runInAction} from 'mobx';
import {Jewels, LocalStaff} from 'stores/RootStore';
import $j, {vow} from '../../Bridge/misc/$j';
import {JobRef} from '../../pages/Job/JobUpdate/JobRef';
import type {TerpKey} from '../../datum/stache/TerpDat';
import {TerpDat} from '../../datum/stache/TerpDat';
import {SeekerEntry} from '../../datum/stache/JobSeekDat';
import {BaseJewel} from '../BaseJewel';
import type {T_AssignTerp_Params, T_UnassignTerp_Params} from '../oJobEdit';
import type {
	T_BidAck_Params, T_BidReject_Params,
	T_PostSeekers_Params,
	T_RemoveSeekers_Params,
} from '../oJobSeek';
import thyme from '../../Bridge/thyme';

export class vJobSeek extends BaseJewel {
	
	_PostSeekers = (params: T_PostSeekers_Params) => Jewels().oJobSeek.PostSeekers(params);
	_RemoveSeekers = (params: T_RemoveSeekers_Params) => Jewels().oJobSeek.RemoveSeekers(params);
	_AssignTerp = (params: T_AssignTerp_Params) => Jewels().oJobEdit.AssignTerp(params);
	_UnassignTerp = (params: T_UnassignTerp_Params) => Jewels().oJobEdit.UnassignTerp(params);
	_BidAck = (params: T_BidAck_Params) => Jewels().oJobSeek.BidAck(params);
	_BidReject = (params: T_BidReject_Params) => Jewels().oJobSeek.BidReject(params);
	
	// TODO: change these to use SeekTerpInfo probably?
	
	@action SelectTerp = (jobRef: JobRef, terpDat: TerpDat) => {
		const selectedTerps = jobRef.seekUp.selectedTerps;
		selectedTerps.Add(terpDat);
	};
	
	@action DeselectTerp = (jobRef: JobRef, terpDat: TerpDat) => {
		const selectedTerps = jobRef.seekUp.selectedTerps;
		selectedTerps.Remove(terpDat);
	};
	
	@action ToggleSelectTerp = (jobRef: JobRef, terpDat: TerpDat) => {
		const selectedTerps = jobRef.seekUp.selectedTerps;
		selectedTerps.Cycle(terpDat);
		
	};
	
	@action SelectTerpKeyIfPossible = (jobRef: JobRef, terpKey: TerpKey) => {
		const info = jobRef.seekInfo.get(terpKey);
		if (!info) return;
		if (!info.canPick) return;
		this.SelectTerp(jobRef, info.terpDat);
	};
	
	
	@action SelectAll = (jobRef: JobRef) => {
		jobRef.seekUp.selectedTerps.AddAllOrClear(jobRef.terpsFiltered);
	};
	
	@action ClearSelectedTerps = (jobRef: JobRef) => {
		jobRef.seekUp.selectedTerps.Clear();
	};
	
	@action SelectAllPreferred = (jobRef: JobRef) => {
		const prefs = jobRef.deafPrefs;
		
		for (const pref of prefs) {
			for (const terpKey of pref.dat.allGood) {
				this.SelectTerpKeyIfPossible(jobRef, terpKey);
			}
		}
	};
	
	@action ResetFilters = (jobRef: JobRef) => {
		jobRef.seekUp.Revert();
	};
	
	@action ResetFiltersAndSelected = (jobRef: JobRef) => {
		this.ResetFilters(jobRef);
		this.ClearSelectedTerps(jobRef);
	};
	
	MakeSubject = (jobRef: JobRef, prefix, description) => {
		const dateStr = thyme.nice.date.pithy(jobRef.start);
		const city = $j.trunc(jobRef.city, 11, '.');
		return `${prefix} ${city} ${dateStr}: ${description}`;
	};
	
	@action MakeSeekers = async (jobRef: JobRef, params: T_PostSeekers_Params) => {
		const terps = jobRef.selectedTerpsArray;
		
		const postObj: T_PostSeekers_Params = {
			...params,
			jobId: jobRef.jobId,
			terpIds: terps.map(t => t.key),
		};
		
		if (!postObj.terpIds.length || !postObj.terpIds[0]) {
			throw new Error(`MakeSeekers had invalid terpIds`, postObj);
		}
		
		console.log(`MakeSeekers for ${terps.length} terps: `, postObj);
		
		const [_, error] = await vow(
			this._PostSeekers(postObj)
		);
		
		if (error) {
			console.error(error);
			runInAction(() => {
				jobRef.saveError = String(error);
			});
			return;
		}
		
		this.ClearSelectedTerps(jobRef);
	};
	
	MakeOpenSeekers = async (jobRef: JobRef, silent = false, doLegacy = false) => {
		const description = jobRef.seekUp.openDescription.value;
		
		const params: T_PostSeekers_Params = {
			description: description,
			isRequested: false,
			notification: !silent,
			subject: this.MakeSubject(jobRef, '🆕', description),
			doLegacy: doLegacy,
		};
		
		return this.MakeSeekers(jobRef, params);
	};
	
	MakeRequestSeekers = async (jobRef: JobRef, silent = false) => {
		const description = jobRef.seekUp.requestMessage.value || jobRef.seekUp.openDescription.value;
		
		const params: T_PostSeekers_Params = {
			description: description,
			isRequested: true,
			notification: !silent,
			subject: this.MakeSubject(jobRef, 'Request - ', description),
			doLegacy: false,
		};
		
		return this.MakeSeekers(jobRef, params);
	};
	
	@action RemoveSeeker = (jobRef: JobRef, seeker: SeekerEntry) =>
		this.RemoveSeekers(jobRef, [seeker]);
	
	@action RemoveSeekers = (jobRef: JobRef, seekers: SeekerEntry[]) => {
		return this._RemoveSeekers({
			jobId: jobRef.jobId,
			seekerIds: seekers.map(s => s.seekerId)
		});
	};
	
	@action RemoveAllSeekers = (jobRef: JobRef) => {
		return this._RemoveSeekers({
			jobId: jobRef.jobId,
			all: true,
		});
	};
	
	@action ForceAssignTerp = async (jobRef: JobRef, terpDat: TerpDat) => {
		const promise = this._AssignTerp({
			jobId: jobRef.jobId,
			terpId: terpDat.terpId,
		});
		const [_, error] = await vow(promise);
		if (error) throw new Error(error);
		this.ClearSelectedTerps(jobRef);
	};
	
	@action AcceptBid = async (jobRef: JobRef, seekerBid: SeekerEntry) => {
		const promise = this._AssignTerp({
			jobId: jobRef.jobId,
			terpId: seekerBid.terpId,
			bidId: seekerBid.seekerId,
			keepBids: true,
		});
		const [_, error] = await vow(promise);
		if (error) throw new Error(error);
	};
	
	@action RejectBid = async (jobRef: JobRef, seekerBid: SeekerEntry) => {
		const promise = this._BidReject({
			jobId: jobRef.jobId,
			seekerId: seekerBid.seekerId,
		});
		const [_, error] = await vow(promise);
		if (error) throw new Error(error);
	};
	
	@action AckBid = (bid: SeekerEntry) => this._BidAck({
		jobId: bid.jobId,
		seekerId: bid.seekerId,
		staffId: LocalStaff().staffId,
	});
	
	@action UnackBid = (bid: SeekerEntry) => this._BidAck({
		jobId: bid.jobId,
		seekerId: bid.seekerId,
		staffId: null,
	});
	
	
	@action UnassignTerp = async (jobRef: JobRef) => {
		const promise = this._UnassignTerp({
			jobId: jobRef.jobId,
		});
		const [_, error] = await vow(promise);
		if (error) throw new Error(error);
	};
	
	
	// TODO: maybe make 'whyTerpFails' be computed per terp (like in a different map/dat)
	
	
	CheckWhyTerpFails = (terp: TerpDat) => {
		// TODO
		// maybe move?
		// {
		// 	prefs: [],
		// 	demands: [],
		// 	tags: [],
		// 	regions: [],
		// 	specialties: [],
		// 	misc: [],
		// }
	};
	
}

