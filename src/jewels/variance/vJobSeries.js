import type {SeriesJobPreview} from '../../datum/LinkedSeriesUpdata';
import {LinkedSeriesUpdata, ReoccurEnum} from '../../datum/LinkedSeriesUpdata';
import {action, runInAction} from 'mobx';
import {BaseJewel} from '../BaseJewel';
import type {JobId} from '../../datum/stache/JobDat';
import {JobDat} from '../../datum/stache/JobDat';
import {Jewels, LocalStaff} from '../../stores/RootStore';
import {vow} from '../../Bridge/misc/$j';
import nanoid from 'nanoid';
import type {ThymeDt} from '../../Bridge/thyme';
import thyme from '../../Bridge/thyme';
import {JobRef} from '../../pages/Job/JobUpdate/JobRef';
import type {
	T_ChangeJobsInSeries,
	T_ChangeSeriesNote,
	T_CreateSeries,
	T_PushChanges,
	T_PushTerp
} from '../oJobSeries';
import type {T_AssignTerp_Params, T_UnassignTerp_Params} from '../oJobEdit';
import type {SeriesId} from '../../datum/stache/JobSeriesDat';
import type {JobChanges} from '../../pages/Job/JobUpdate/JobBasics';
import {T_CreateSeriesJobs} from '../oJobSeries';
import {T_JobUp_Changes} from '../oJobEdit';
import {SERIES_FIELDS} from '../../pages/Job/JobLinked/LinkedSeriesFields';
import {JOB_STATUS} from '../../pages/Job/JobUpdate/JobBasics';


export class vJobSeries extends BaseJewel {
	
	_CreateSeries = (params: T_CreateSeries) => Jewels().oJobSeries.CreateSeries(params);
	_AddJobs = (params: T_ChangeJobsInSeries) => Jewels().oJobSeries.AddJobsToSeries(params);
	_RemoveJobs = (params: T_ChangeJobsInSeries) => Jewels().oJobSeries.RemoveJobsFromSeries(params);
	_PushChanges = (params: T_PushChanges) => Jewels().oJobSeries.PushChanges(params);
	_PushTerp = (params: T_PushTerp) => Jewels().oJobSeries.PushTerp(params);
	_ChangeNote = (params: T_ChangeSeriesNote) => Jewels().oJobSeries.ChangeSeriesNote(params);
	_CreateJobs = (params: T_CreateSeriesJobs) => Jewels().oJobSeries.CreateSeriesJobs(params);
	
	
	@action CreateSeries = async (jobId: JobId) => {
		return this._CreateSeries({
			jobId: jobId,
		});
	};
	
	@action AddJobsToSeries = async (seriesId: SeriesId, jobIds: JobId[]) => {
		return this._AddJobs({
			seriesId: seriesId,
			jobIds: jobIds,
		});
	};
	
	@action RemoveJobsFromSeries = async (seriesId: SeriesId, jobIds: JobId[]) => {
		return this._RemoveJobs({
			seriesId: seriesId,
			jobIds: jobIds,
		});
	};
	
	@action ChangeSeriesNote = async (seriesId: SeriesId, note: string) => {
		return this._ChangeNote({
			seriesId: seriesId,
			note: note,
		});
	};
	
	@action ToggleSelectAllJobs = (seriesUp: LinkedSeriesUpdata) => {
		if (seriesUp.hasAllJobsSelected) {
			seriesUp.selectedJobs.Clear();
		} else {
			seriesUp.selectedJobs.SetAll(seriesUp.otherLinkedJobKeys, true);
		}
	};
	
	@action ClearJobSelection = (seriesUp: LinkedSeriesUpdata) => seriesUp.selectedJobs.Clear();
	
	@action SelectJobsAfterToday = (seriesUp: LinkedSeriesUpdata) => {
		seriesUp.selectedJobs.Clear();
		seriesUp.selectedJobs.SetAll(seriesUp.jobKeysAfterToday, true);
	};
	
	@action SelectSameJobs = (seriesUp: LinkedSeriesUpdata) => {
		seriesUp.selectedJobs.Clear();
		seriesUp.selectedJobs.SetAll(seriesUp.jobKeysWithNoDiffs, true);
	};
	
	@action SelectDifferentJobs = (seriesUp: LinkedSeriesUpdata) => {
		seriesUp.selectedJobs.Clear();
		seriesUp.selectedJobs.SetAll(seriesUp.jobKeysWithDiffs, true);
	};
	
	@action InvertSelection = (seriesUp: LinkedSeriesUpdata) => {
		const toggleFn = seriesUp.selectedJobs.Toggle;
		seriesUp.otherLinkedJobKeys.forEach(toggleFn);
	};
	
	GeneratePushChanges = (seriesUp: LinkedSeriesUpdata): T_PushChanges => {
		const jobRef = seriesUp.jobRef;
		const sourceJobDat = jobRef.jobDat;
		
		let pushChanges: T_PushChanges = {
			sourceJobId: sourceJobDat.jobId,
			changesByJobId: {},
		};
		
		const selectedFields = seriesUp.selectedFieldArray;
		const fnPack = v => v;
		
		for (let selectedJobDat of seriesUp.selectedJobDats) {
			const jobKey = selectedJobDat.key;
			const diffInfo = seriesUp.diffs.get(jobKey);
			if (diffInfo.isSame) continue;
			
			let changes: JobChanges = {};
			
			for (let field of selectedFields) {
				const isDiff = diffInfo.diffs.has(field.key);
				if (!isDiff) continue;
				
				const packer = (field.fnPack || fnPack);
				changes[field.key] = packer(
					sourceJobDat[field.key],
					sourceJobDat,
					selectedJobDat,
					changes,
					jobRef,
				);
			}
			
			if (changes.start || changes.end) {
				
				const combined = thyme.combineDateStartEnd(
					selectedJobDat.start, // same date
					changes.start || selectedJobDat.start, // new start time (or original)
					changes.end || selectedJobDat.end // new end time (or original)
				);
				
				changes.start = [
					thyme.fast.pack(selectedJobDat.start),
					thyme.fast.pack(combined.start)
				];
				
				changes.end = [
					thyme.fast.pack(selectedJobDat.end),
					thyme.fast.pack(combined.end)
				];
			}
			
			pushChanges.changesByJobId[jobKey] = changes;
		}
		
		return pushChanges;
	};
	
	@action PushChanges = async (seriesUp: LinkedSeriesUpdata) => {
		const pushChanges = this.GeneratePushChanges(seriesUp);
		
		const [_, pushError] = await vow(
			this._PushChanges(pushChanges)
		);
		
		if (pushError) {
			console.error(pushError);
			runInAction(() => {
				jobRef.saveError = String(pushError);
			});
			return;
		}
		
		this.ClearJobSelection(seriesUp);
	};
	
	GeneratePushTerp_Assign = (seriesUp: LinkedSeriesUpdata): T_PushTerp => {
		const jobRef = seriesUp.jobRef;
		const sourceJobDat = jobRef.jobDat;
		
		let assignTerpParams: T_AssignTerp_Params = {
			terpId: sourceJobDat.terpId,
			seekerId: '',
			// keepStatus: !seriesUp.terpPushSetStatus.value,
			keepBids: !seriesUp.terpPushClearSeekers.value,
			keepSeekers: !seriesUp.terpPushClearSeekers.value,
			source: jobRef.jobId,
		};
		
		let pushTerp: T_PushTerp = {
			sourceJobId: sourceJobDat.jobId,
			targetJobIds: seriesUp.selectedJobDats.map(d => d.jobId),
			assignTerpParams: assignTerpParams,
		};
		
		return pushTerp;
	};
	
	GeneratePushTerp_Unassign = (seriesUp: LinkedSeriesUpdata): T_PushTerp => {
		const jobRef = seriesUp.jobRef;
		const sourceJobDat = jobRef.jobDat;
		
		let unassignTerpParams: T_UnassignTerp_Params = {
			terpId: sourceJobDat.terpId,
			// keepStatus: !seriesUp.terpPushSetStatus.value,
			source: jobRef.jobId,
		};
		
		let pushTerp: T_PushTerp = {
			sourceJobId: sourceJobDat.jobId,
			targetJobIds: seriesUp.selectedJobDats.map(d => d.jobId),
			unassignTerpParams: unassignTerpParams,
		};
		
		return pushTerp;
	};
	
	@action PushTerp = async (seriesUp: LinkedSeriesUpdata) => {
		const jobRef = seriesUp.jobRef;
		
		const pushTerp = jobRef.hasTerp
			? this.GeneratePushTerp_Assign(seriesUp)
			: this.GeneratePushTerp_Unassign(seriesUp);
		
		const [_, pushError] = await vow(
			this._PushTerp(pushTerp)
		);
		
		if (pushError) {
			console.error(pushError);
			runInAction(() => {
				jobRef.saveError = String(pushError);
			});
			return;
		}
	};
	
	@action AddPreview = (jobRef: JobRef, date: ThymeDt) => {
		const seriesUp: LinkedSeriesUpdata = jobRef.seriesUp;
		const sourceJobDat = jobRef.jobDat;
		const start: ThymeDt = thyme.combine(date, sourceJobDat.start);
		const end: ThymeDt = thyme.combine(date, sourceJobDat.end);
		
		const preview: SeriesJobPreview = {
			key: nanoid(),
			isPreview: true,
			dat: {
				start: start,
				end: end,
			},
		};
		
		seriesUp.previews.push(preview);
	};
	
	@action AddPreviewRepeating = (jobRef: JobRef) => {
		const seriesUp: LinkedSeriesUpdata = jobRef.seriesUp;
		const sourceJobDat: JobDat = jobRef.jobDat;
		
		const numOfPreviews = parseInt(seriesUp.occurrences.value);
		const reoccurEnum: ReoccurEnum = seriesUp.reoccurringEnum.value;
		const repeatType = reoccurEnum.repeatType;
		const repeatCount = reoccurEnum.repeatCount;
		const sourceStart: ThymeDt = sourceJobDat.start;
		
		let weekdays = [];
		
		seriesUp.weekdays.value.forEach((isChecked, dex) => {
			if (isChecked) weekdays.push(dex);
		});
		
		if (weekdays.length === 0) {
			weekdays = repeatType === 'week'
				? [sourceStart.weekday]
				: [1, 2, 3, 4, 5, 6, 7];
		}
		
		const dates = thyme.reoccur.getDates(
			sourceStart,
			numOfPreviews,
			repeatType,
			repeatCount,
			weekdays,
		);
		
		for (let date of dates) {
			this.AddPreview(jobRef, date);
		}
	};
	
	@action RemovePreview = (jobRef: JobRef, preview: SeriesJobPreview) => {
		const seriesUp: LinkedSeriesUpdata = jobRef.seriesUp;
		seriesUp.previews = seriesUp.previews.filter(p => p.key !== preview.key);
	};
	
	
	@action ClearPreviews = (jobRef: JobRef) => {
		const seriesUp: LinkedSeriesUpdata = jobRef.seriesUp;
		seriesUp.previews = [];
	};
	
	@action CreateJobsFromPreviews = async (jobRef: JobRef) => {
		const seriesUp: LinkedSeriesUpdata = jobRef.seriesUp;
		const sourceJobDat = jobRef.jobDat;
		
		const selectedFields = seriesUp.selectedFieldArray;
		const fnPack = v => v;
		let changes: T_JobUp_Changes = {};
		
		for (let field of selectedFields) {
			if (field.key === SERIES_FIELDS.start.key) continue; // set later
			if (field.key === SERIES_FIELDS.end.key) continue; // set later
			
			const packer = (field.fnPack || fnPack);
			changes[field.key] = packer(
				sourceJobDat[field.key],
				sourceJobDat,
				{},
				changes,
				jobRef,
			);
		}
		
		const jobs: T_JobUp_Changes[] = seriesUp.previews
			.map(preview => ({
				status: JOB_STATUS.Searching, // can be overridden with field data
				
				...changes,
				
				start: [null, thyme.fast.pack(preview.dat.start)],
				end: [null, thyme.fast.pack(preview.dat.end)],
				rate: sourceJobDat.rate,
				cap: sourceJobDat.cap,
				createdBy: LocalStaff().internalName,
				flatRate: sourceJobDat.flatRate,
				overrideRate: sourceJobDat.overrideRate,
				companyId: sourceJobDat.companyId,
				contactId: sourceJobDat.contactId,
				requestedBy: sourceJobDat.requestedBy,
				receivedFrom: sourceJobDat.receivedFrom,
			}));
		
		const params: T_CreateSeriesJobs = {
			seriesId: seriesUp.seriesId,
			sourceJobId: sourceJobDat.jobId,
			jobs: jobs,
		};
		
		
		const [_, error] = await vow(
			this._CreateJobs(params)
		);
		
		
		if (error) {
			console.error(error);
			runInAction(() => {
				jobRef.saveError = String(error);
			});
			return;
		}
		
		this.ClearPreviews(jobRef);
	};
}