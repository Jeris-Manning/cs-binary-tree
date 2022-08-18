import {action, autorun, computed, observable} from 'mobx';
import {JobUpdata} from '../../../datum/JobUpdata';
import {CompanyDat} from '../../../datum/stache/CompanyDat';
import {Jewels, Root, Staches} from '../../../stores/RootStore';
import {ContactDat} from '../../../datum/stache/ContactDat';
import {DeafDat} from '../../../datum/stache/DeafDat';
import {JobHistoryDat} from '../../../datum/stache/JobHistoryDat';
import type {TerpKey} from '../../../datum/stache/TerpDat';
import {TerpDat} from '../../../datum/stache/TerpDat';
import type {ThymeDt} from '../../../Bridge/thyme';
import thyme from '../../../Bridge/thyme';
import {JOB_STATUS, JobStatusEnum} from './JobBasics';
import {CompanyLocationsDat} from '../../../datum/stache/CompanyLocationsDat';
import type {JobId, JobKey} from '../../../datum/stache/JobDat';
import {JobDat} from '../../../datum/stache/JobDat';
import {Clutch} from '../../../Bridge/DockClient/Stache';
import {CompanyDeafsDat} from '../../../datum/stache/CompanyDeafsDat';
import {StaffDat} from '../../../datum/stache/StaffDat';
import {CompanyContactsDat} from '../../../datum/stache/CompanyContactsDat';
import {JobSeekDat} from '../../../datum/stache/JobSeekDat';
import {SeekUpdata} from '../../../datum/SeekUpdata';
import type {EnumChoiceMap, FilterStatus, IdKey} from '../../../Bridge/misc/UpType';
import {DemandDat, DemandEntry} from '../../../datum/stache/DemandDat';
import {RegionEntry} from '../../../datum/stache/RegionDat';
import {TerpSpecialtyEntry} from '../../../datum/stache/TerpSpecialtyDat';
import {TerpTagDat, TerpTagEntry} from '../../../datum/stache/TerpTagDat';
import {NowTerpDat, NowTerpEntry} from '../../../datum/stache/NowTerpDat';
import {DeafPrefsDat} from '../../../datum/stache/DeafPrefsDat';
import {TERP_LISTS} from '../../../datum/stache/TerpListDat';
import {SeekTerpInfo} from '../../../datum/SeekTerpInfo';
import type {SeekerFilterEntry} from '../../../datum/SeekerFiltersDef';
import {SeekerFiltersDef} from '../../../datum/SeekerFiltersDef';
import {CompanyPrefsDat} from '../../../datum/stache/CompanyPrefsDat';
import type {WatcherTargetKey} from '../../../datum/stache/WatcherDat';
import {WatcherDat} from '../../../datum/stache/WatcherDat';
import {JobSeriesDat} from '../../../datum/stache/JobSeriesDat';
import {LinkedSeriesUpdata} from '../../../datum/LinkedSeriesUpdata';
import {HUE} from '../../../Bridge/HUE';
import {JobOverlapDat, OverlapEntry} from './JobOverlapDat';
import {JobChatDat} from '../../../datum/stache/JobChatDat';
import {BillTypeDat, BillTypeEntry} from '../../../datum/stache/BillTypeDat';


/**
 * Merges JobDat (stache record) and JobUpdata (state holder)
 */
export class JobRef {
	
	@observable jobId: JobId;
	@observable jobKey: JobKey;
	@observable isNew: boolean = false;
	
	@observable jobClutch: Clutch<JobDat>;
	
	@computed get jobDat(): JobDat {return this.jobClutch.dat;}
	
	@observable jobUp: JobUpdata;
	
	@observable seekClutch: Clutch<JobSeekDat>;
	
	@computed get seekDat(): JobSeekDat {return this.seekClutch.dat;}
	
	@observable seekUp: SeekUpdata;
	
	@observable seriesUp: LinkedSeriesUpdata;
	@observable billTypeDat: BillTypeDat; // enum will stay observed
	
	@observable saveError: string = '';
	
	constructor(jobId: JobId) {
		this.ConstructExistingJob(jobId);
	}
	
	@action ConstructExistingJob = (jobId: IdKey) => {
		this.jobId = jobId;
		this.jobKey = String(jobId);
		if (!jobId) this.isNew = true;
		
		this.jobClutch = Staches().cJob.GetOrStub(jobId, true, 'JobRef');
		this.jobUp = new JobUpdata(this);
		
		this.seekClutch = Staches().cJobSeek.GetOrStub(jobId, true, 'JobRef');
		this.seekUp = new SeekUpdata(this);
		
		this.seriesUp = new LinkedSeriesUpdata(this);
		this.billTypeDat = Staches().cBillType.GetEnumClutch().dat;
	};
	
	
	/* Secondary computes */
	
	@computed get company(): CompanyDat {
		return Staches().cCompany.GetOrStub(this.jobUp.companyId.value, true).dat;
	};
	
	@computed get contact(): ContactDat {
		return Staches().cContact.GetOrStub(this.jobUp.contactId.value, true).dat;
	};
	
	@computed get history(): JobHistoryDat {
		return Staches().cJobHistory.GetOrStub(this.jobId, true).dat;
	}
	
	@computed get location(): LocationDat {
		return Staches().cLocation.GetOrStub(this.jobUp.locationId.value, true).dat;
	};
	
	@computed get terp(): TerpDat {
		return Staches().cTerp.GetOrStub(this.jobUp.terpId.value, true, 'JobRef').dat;
	};
	
	@computed get terpPhotoUrl(): string {
		return Staches().cTerpPhoto.GetOrStub(this.jobUp.terpId.value, true).dat.url;
	};
	
	@computed get deafs(): Clutch<DeafDat>[] {
		return Staches().cDeaf.GetMulti(this.jobUp.deafIds.value, true, 'jobRef')
			|| [];
	};
	
	
	@computed get companyContacts(): CompanyContactsDat {
		return Staches().cCompanyContacts.GetOrStub(this.jobUp.companyId.value, true).dat;
	}
	
	@computed get companyDeafs(): CompanyDeafsDat {
		return Staches().cCompanyDeafs.GetOrStub(this.jobUp.companyId.value, true).dat;
	}
	
	@computed get companyLocations(): CompanyLocationsDat {
		return Staches().cCompanyLocations.GetOrStub(this.jobUp.companyId.value, true).dat;
	};
	
	@computed get companyPrefs(): CompanyPrefsDat {
		return Staches().cCompanyPrefs.GetOrStub(this.jobUp.companyId.value, true).dat;
	}
	
	@computed get nowTerpEntries(): NowTerpEntry[] {
		if (!this.start || !this.end) return [];
		return Staches().cNowTerp.GetOrStub(NowTerpDat.MakeKey(this.start), true)
			.dat.entries.filter(entry => (
				entry.start <= this.end
				&& entry.end >= this.start
			));
	}
	
	@computed get holidays(): string[] {
		return Root().GetHolidays(this.start);
	};
	
	@computed get rateFallback(): string {
		return this.company.rate;
	}
	
	@computed get capFallback(): string {
		if (!this.hasCompany) return '';
		return String(this.isVri ? this.company.capVri : this.company.cap);
	}
	
	
	@computed get chatDat(): JobChatDat {
		return Staches().cJobChat.GetOrStub(this.jobId, true, 'JobRef').dat;
	};
	
	@computed get seriesDat(): JobSeriesDat {
		return Staches().cJobSeries.GetOrStub(this.jobDat.seriesId, true, 'JobRef').dat;
	}
	
	@computed get seriesJobKeys(): JobKey[] {
		return this.seriesDat.jobKeys || [];
	}
	
	@computed get watcherDat(): WatcherDat {
		const targetKey: WatcherTargetKey = `job_${this.jobId}`;
		return Staches().cWatcher.GetOrStub(targetKey, true).dat;
	}
	
	@computed get jobOverlapDat(): JobOverlapDat {
		return Staches().cJobOverlap.GetOrStub(this.jobId, true, 'JobRef').dat;
	}
	
	@computed get deafConflicts(): OverlapEntry[] {
		const deafKeys = this.jobUp.deafIds.value;
		const seriesJobKeys = this.seriesJobKeys;
		
		return this.jobOverlapDat.jobs.filter(entry => (
			!entry.isCancelled
			&& !seriesJobKeys.includes(entry.jobKey)
			&& entry.deafKeys.some(d => deafKeys.includes(d))
		));
	}
	
	@computed get locationConflicts(): OverlapEntry[] {
		const locationKey = this.location.key;
		if (!locationKey) return [];
		
		const seriesJobKeys = this.seriesJobKeys;
		
		return this.jobOverlapDat.jobs.filter(entry => (
			locationKey === entry.locationKey
			&& !entry.isCancelled
			&& !seriesJobKeys.includes(entry.jobKey)
		));
	}
	
	@computed get terpConflicts(): OverlapEntry[] {
		const terpKey = this.terp.key;
		if (!terpKey) return [];
		
		return this.jobOverlapDat.jobs.filter(entry => (
			terpKey === entry.terpKey
			&& !entry.isCancelled
		));
	}
	
	@computed get anyOverlapByTerpKey(): Map<TerpKey, OverlapEntry> {
		let map = new Map();
		for (let job of this.jobOverlapDat.jobs) {
			map.set(job.terpKey, job); // it's okay to overwrite
		}
		return map;
	}
	
	@computed get companyLocationMismatch() {
		// TODO: where's this used?
		if (!this.hasLocation) return '';
		if (this.location.companyId == this.company.companyId) return ''; // TODO: check
		return `This location belongs to company ${this.location.companyId}`;
	}
	
	@computed get errorsAll(): string[] {
		let errors = [];
		
		if (this.jobUp.keysWithErrors.length > 0) {
			errors.push(...this.jobUp.keysWithErrors);
		}
		
		if (!this.hasCompany) {
			errors.push('Must have company');
			// TODO: needed? isn't this required already?
		}
		
		return errors;
	}
	
	@computed get errorsJoined(): string { return this.errorsAll.join(`\n`); }
	
	// TODO: move some to JobLogic
	// valid data (not an error) but still has a problem
	@computed get problems(): string[] {
		// TODO
		// TODO
		// has terp/status but job still has active seekers (see: AlreadyAssigned)
		// time duration is very long
		let problems = [];
		
		const status = this.jobStatus;
		
		switch (status.key) {
			case JOB_STATUS.Pending:
				break; // 1
			case JOB_STATUS.Filled:
				// 2
				if (!this.jobUp.terpId.value) {
					problems.push(`Job is FILLED with no interpreter!`);
				}
				
				break;
			case JOB_STATUS.Searching:
				break; // 3
			case JOB_STATUS.Paid:
				break; // 4
			case JOB_STATUS.Bidding:
				break; // 5
			case JOB_STATUS.FollowUp:
				break; // 6
			case JOB_STATUS.CreatedByCompany:
				break; // 7
			case JOB_STATUS.UpdatedByContact:
				break; // 8
			case JOB_STATUS.Cancelled:
				break; // 9
			case JOB_STATUS.Substitute:
				break; // 10
		}
		
		return problems;
	}
	
	@computed get seekWarning(): string {
		const status = this.jobStatus;
		
		switch (status.key) {
			case JOB_STATUS.Pending: // 1
				break;
			case JOB_STATUS.Filled: // 2
				break;
			case JOB_STATUS.Searching: // 3
				return `${status.label} status will not appear on the job board!`;
			case JOB_STATUS.Paid: // 4
				break;
			case JOB_STATUS.Bidding: // 5
				return `${status.label} status will not appear on the job board!`;
			case JOB_STATUS.FollowUp: // 6
				break;
			case JOB_STATUS.CreatedByCompany: // 7
				break;
			case JOB_STATUS.UpdatedByContact: // 8
				break;
			case JOB_STATUS.Cancelled: // 9
				break;
			case JOB_STATUS.Substitute: // 10
				return `${status.label} status will not appear on the job board!`;
		}
	}
	
	@computed get jobPageBorder(): string {
		if (this.jobUp.status.value === JOB_STATUS.Cancelled) return `${HUE.job.cancelled} solid 5px`;
		if (this.jobUp.vri.value) return `${HUE.job.vri} solid 5px`;
		if (this.jobUp.followUp.value) return `${HUE.job.followUp} solid 5px`;
		// TODO
	}
	
	/* enums */
	
	@computed get demandDat(): DemandDat {
		return Staches().cDemand.GetEnumClutch().dat;
	}
	
	@computed get demandChoices(): DemandEntry[] {
		const dat = Staches().cDemand.GetEnumClutch().dat;
		return dat.entries;
	}
	
	@computed get regionChoices(): RegionEntry[] {
		const dat = Staches().cRegion.GetEnumClutch().dat;
		return dat.entries;
	}
	
	@computed get specialtyChoices(): TerpSpecialtyEntry[] {
		const dat = Staches().cTerpSpecialty.GetEnumClutch().dat;
		return dat.entries;
	}
	
	@computed get tagClutch(): Clutch<TerpTagDat> {
		return Staches().cTerpTag.GetEnumClutch();
	}
	
	@computed get tagEntries(): TerpTagEntry[] {
		return this.tagClutch.dat.entries;
	}
	
	seekerFiltersDef: SeekerFiltersDef = new SeekerFiltersDef(); // for parity with dats
	
	
	/* more */
	
	@computed get combinedDateStartEnd() {
		return thyme.combineDateStartEnd(
			this.jobUp.date.value,
			this.jobUp.startTime.value,
			this.jobUp.endTime.value
		) || {};
	}
	
	@computed get start(): ThymeDt { return this.combinedDateStartEnd.start; }
	
	@computed get end(): ThymeDt { return this.combinedDateStartEnd.end; }
	
	@computed get duration(): ThymeDt { return thyme.durationHoursMins(this.start, this.end); }
	
	@computed get jobStatus(): JobStatusEnum { return this.jobUp.status.value || {}; }
	
	@computed get hasCompany(): boolean { return !!this.jobUp.companyId.value; }
	
	@computed get hasContact(): boolean { return !!this.jobUp.contactId.value; }
	
	@computed get hasDeaf(): boolean { return !!(this.jobUp.deafIds.value || []).length; }
	
	@computed get hasLocation(): boolean { return !!this.jobUp.locationId.value; }
	
	@computed get hasTerp(): boolean { return !!this.jobUp.terpId.value; }
	
	@computed get isVri(): boolean { return !!this.jobUp.vri.value; }
	
	@computed get city(): string {
		if (this.isVri) return 'VRI';
		return this.location.locality || this.location.city || '';
	}
	
	@computed get deafNames(): string[] { return this.deafs.map(d => d.label); }
	
	@computed get deafPrefs(): Clutch<DeafPrefsDat>[] {
		return Staches().cDeafPrefs
			.GetMulti(this.jobUp.deafIds.value, true, 'jobRef.deafPrefs') || [];
	}
	
	@computed get createdBy(): StaffDat {
		return Staches().cStaffByName.GetOrStub(this.jobDat.createdBy, true, 'jobRef.createdBy').dat;
	}
	
	@computed get updatedBy(): StaffDat {
		return Staches().cStaffByEmail.GetOrStub(this.history.updatedBy, true, 'JobUpdate').dat;
	}
	
	@computed get billTypeEntry(): BillTypeEntry {
		const name = this.jobUp.billType.value;
		return this.billTypeDat.entryByName[name];
	}
	
	@computed get demandsNeeded(): DemandEntry[] {
		return this.seekUp.demands.value || [];
	}
	
	@computed get tagsRequired(): TerpTagEntry[] {
		return TerpTagDat.MapToEntries(this.seekUp.tagFilters.value.req || [], this.tagClutch.dat);
	}
	
	@computed get tagsBanned(): TerpTagEntry[] {
		return TerpTagDat.MapToEntries(this.seekUp.tagFilters.value.ban || [], this.tagClutch.dat);
	}
	
	@computed get regionsRequired(): RegionEntry[] {
		return this.seekUp.regionFilters.value || [];
	}
	
	@computed get specialtiesRequired(): TerpSpecialtyEntry[] {
		return this.seekUp.specialtyFilters.value || [];
	}
	
	@computed get seekerFilters(): SeekerFilterEntry[] {
		return this.seekerFiltersDef.entries || [];
	}
	
	@computed get seekerCriteriaRequired(): SeekerFilterEntry[] {
		return SeekerFiltersDef.MapToEntries(this.seekUp.seekerFilters.value.req || [], this.seekerFiltersDef);
	}
	
	@computed get seekerCriteriaBanned(): SeekerFilterEntry[] {
		return SeekerFiltersDef.MapToEntries(this.seekUp.seekerFilters.value.ban || [], this.seekerFiltersDef);
	}
	
	@computed get nowTerpCriteria(): FilterStatus {
		return this.seekUp.nowTerpFilter.value;
	}
	
	@computed get allTerps(): TerpDat[] { return Jewels().vTerpLists.allTerpDats; }
	
	@computed get validTerpKeys(): TerpKey[] {
		const listClutch = Staches().cTerpList.GetOrStub(TERP_LISTS.real);
		return listClutch.dat.datKeys;
	}
	
	
	@observable seekInfo: Map<TerpKey, SeekTerpInfo> = new Map();
	@observable seekInfoArray: SeekTerpInfo[] = [];
	
	makeInitialSeekTerps = autorun(() => {
		let map = new Map();
		
		for (let terpKey of this.validTerpKeys) {
			map.set(terpKey, new SeekTerpInfo(terpKey, this));
		}
		
		this.seekInfo = map;
		this.seekInfoArray = [...map.values()];
		
	}, {delay: 50});
	
	
	@observable terpsFiltered: SeekTerpInfo[] = [];
	
	runTerpsFiltered = autorun(() => {
		
		this.terpsFiltered = this.seekInfoArray.filter(terpInfo => terpInfo.canPick);
		
	}, {delay: 100})
	
	// @computed get terpsFiltered(): SeekTerpInfo[] {
	// 	return this.seekInfoArray.filter(terpInfo => terpInfo.canPick);
	// }
	
	@computed get terpsFilteredAndSorted(): SeekTerpInfo[] {
		const sorter = this.seekUp.terpSorting.value.sort;
		return this.terpsFiltered
			.slice().sort(sorter);
	}
	
	@computed get terpsFilteredCount(): number {
		return this.terpsFiltered.length;
	}
	
	// @computed get terpDistances(): Map<TerpKey, number> {
	// 	let map: Map<TerpKey, number> = new Map();
	//
	// 	const locLatLng = this.location.gMapLatLng;
	// 	if (!locLatLng) return map; // no loc, return empty
	//
	// 	const compute = window.google.maps.geometry.spherical.computeDistanceBetween;
	//
	// 	for (let terp of this.allTerps) {
	// 		if (!terp.gMapLatLng) continue;
	//
	// 		const distance =
	// 			compute(locLatLng, terp.gMapLatLng)
	// 			* 0.00062137; // meters to miles
	//
	// 		map.set(terp.key, distance);
	// 	}
	//
	// 	return map;
	// }
	
	@computed get selectedTerpsMap(): EnumChoiceMap {
		// console.log(`selectedTerpsMap: ${[...this.seekUp.selectedTerps.value.map.values()].map(t => String(t.key)).join()}`, this.seekUp.selectedTerps.value);
		return this.seekUp.selectedTerps.value.map; }
	
	@computed get selectedTerpsArray(): TerpDat[] { return [...this.selectedTerpsMap.values()]; }
	
	@computed get hasAllTerpsSelected(): boolean {
		return this.selectedTerpsMap.size >= this.terpsFiltered.length;
	}
	
	@computed get selectedTerpsCount(): number { return this.selectedTerpsMap.size; }
	
	@computed get terpNowTerpEntries(): Map<TerpKey, NowTerpEntry> {
		let map: Map<TerpKey, NowTerpEntry> = new Map();
		
		for (let entry of this.nowTerpEntries) {
			map.set(String(entry.terpId), entry);
		}
		
		return map;
	}
	
}