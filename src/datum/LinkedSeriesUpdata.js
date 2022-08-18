import {action, autorun, computed, observable} from 'mobx';
import {JobRef} from '../pages/Job/JobUpdate/JobRef';
import $j from '../Bridge/misc/$j';
import type {EnumChoice, IdKey} from '../Bridge/misc/UpType';
import {UpType} from '../Bridge/misc/UpType';
import type {T_SeriesField} from '../pages/Job/JobLinked/LinkedSeriesFields';
import {
	GetDefaultSeriesFieldKeyMap,
	SelectedSeriesFieldMap,
	SERIES_FIELDS,
	SERIES_FIELDS_ARRAY
} from '../pages/Job/JobLinked/LinkedSeriesFields';
import {Upstate} from '../Bridge/misc/Upstate';
import type {JobKey} from './stache/JobDat';
import {JobDat} from './stache/JobDat';
import {Clutch} from '../Bridge/DockClient/Stache';
import {Staches} from '../stores/RootStore';
import {JobSeriesDat} from './stache/JobSeriesDat';
import type {ThymeDateKey, ThymeDt, ThymeTimeKey} from '../Bridge/thyme';
import thyme from '../Bridge/thyme';
import {Updata} from '../Bridge/misc/Updata';
import {JobDiffInfo} from '../pages/Job/JobLinked/JobDiffInfo';
import type {SeriesId} from './stache/JobSeriesDat';

export class LinkedSeriesUpdata {
	
	@observable currentJobKey: JobKey;
	@observable jobRef: JobRef;
	
	@computed get seriesId(): SeriesId { return this.jobRef.jobDat.seriesId; }
	
	@computed get hasSeries(): boolean { return !!this.jobRef.jobDat.seriesId; }
	
	
	@observable pushFields: Upstate<SelectedSeriesFieldMap> = UpType.BoolMapSimple();
	@observable selectedJobs: Upstate<Map<JobKey, boolean>> = UpType.BoolMapSimple();
	
	@observable occurrences = UpType.Int(DEFAULTS.occurrences);
	@observable weekdays = UpType.Array(DEFAULTS.weekdays);
	@observable reoccurringEnum = UpType.Enum(REOCCUR_ENUM, DEFAULTS.reoccurringEnum);
	
	@observable seriesNote = UpType.String();
	@observable jobIdsToAdd = UpType.String();
	
	/* TERP assigning */
	@observable terpPushClearSeekers = UpType.Bool(true);
	// @observable terpPushSetStatus = UpType.Bool(true);
	// @observable terpPushNotification = UpType.Bool(true);
	// @observable terpPushConfirmation = UpType.Bool(false);
	
	
	constructor(jobRef: JobRef) {this.Construct(jobRef);}
	
	@action Construct = (jobRef: JobRef) => {
		this.jobRef = jobRef;
		this.currentJobKey = jobRef.jobKey;
		Updata.Init(this, {});
		
		this.pushFields.SetInitialValue(GetDefaultSeriesFieldKeyMap());
		this.seriesNote.SetUseInitialValueObj(this, 'initialSeriesNote');
	};
	
	@computed get seriesClutch(): Clutch<JobSeriesDat> {
		return Staches().cJobSeries.GetOrStub(this.jobRef.jobDat.seriesId, true);
	}
	
	@computed get initialSeriesNote(): string {
		return this.seriesClutch.dat.note;
	}
	
	@computed get linkedJobs(): Clutch<JobDat>[] {
		const jobIds = this.seriesClutch.dat.jobIds;
		return Staches().cJob.GetMulti(jobIds) || [];
	}
	
	@computed get otherLinkedJobKeys(): JobKey[] {
		return $j.mapIf(this.linkedJobs,
			j => j.key !== this.currentJobKey,
			j => j.key,
		);
	}
	
	
	@computed get seriesJobCount(): number {return this.seriesClutch.dat.jobIds.length;}
	
	@computed get jobsSelectedCount(): number {return this.selectedJobs.value.size;}
	
	@computed get selectedJobKeys(): JobKey[] {return [...this.selectedJobs.value.keys()];}
	
	@computed get selectedJobDats(): JobDat[] {
		return $j.mapIf(this.linkedJobs,
			c => this.selectedJobs.value.get(c.key),
			c => c.dat
		);
	}
	
	@computed get hasAllJobsSelected(): boolean {
		return this.jobsSelectedCount === this.seriesJobCount;
	}
	
	@computed get fieldsSelectedCount(): number {return this.pushFields.value.size;}
	
	@computed get selectedFieldArray(): T_SeriesField[] {
		return [...this.pushFields.value.entries()]
			.filter(([k, v]) => v)
			.map(([k, v]) => SERIES_FIELDS[k]);
	}
	
	@computed get hasAllFieldsSelected(): boolean {
		return this.fieldsSelectedCount === SERIES_FIELDS_ARRAY.length;
	}
	
	@computed get jobKeysAfterToday(): JobKey[] {
		const endOfToday = thyme.today().endOf('day');
		return $j.mapIf(this.linkedJobs,
			j => j.key !== this.currentJobKey && j.dat.start > endOfToday,
			j => j.key,
		);
	}
	
	
	/* Job date sections & rows */
	
	@observable previews: SeriesJobPreview[] = [];
	@observable dateSections: Map<ThymeDateKey, T_SeriesDateSection> = new Map();
	@observable dateSectionArray: T_SeriesDateSection[] = [];
	
	@computed get jobsAndPreviews(): SeriesJobEntry[] {
		return [
			...this.linkedJobs,
			...this.previews,
		].sort(JobEntryStartSorter);
	}
	
	makeDateSections = autorun(() => {
		let dateSections: Map<ThymeDateKey, T_SeriesDateSection> = new Map();
		
		for (let jobEntry of this.jobsAndPreviews) {
			
			const startDt = jobEntry.dat.start;
			if (!startDt) continue; // not loaded yet
			
			const dateKey = thyme.toDateKey(startDt);
			const timeKey = thyme.toMinuteKey(startDt);
			
			let dateSection: T_SeriesDateSection = dateSections.get(dateKey);
			if (!dateSection) {
				dateSection = {
					key: dateKey,
					date: startDt,
					times: new Map(),
					jobs: [],
				};
				dateSections.set(dateKey, dateSection);
			}
			
			let timeRow: T_SeriesTimeRow = dateSection.times.get(timeKey);
			if (!timeRow) {
				timeRow = {
					key: timeKey,
					time: startDt,
					jobs: [],
				};
				dateSection.times.set(timeKey, timeRow);
			}
			
			dateSection.jobs.push(jobEntry);
			timeRow.jobs.push(jobEntry);
			
		}
		
		// .sort(thyme.sorter('date'));
		
		this.dateSections.replace(dateSections); // mobx
		this.dateSectionArray.replace([...dateSections.values()]); // mobx
		
	}, {delay: 100});
	
	
	/* DIFFS */
	
	@observable diffs: Map<JobKey, JobDiffInfo> = new Map();
	
	makeDiffs = autorun(() => {
		let diffs: Map<JobKey, JobDiffInfo> = new Map();
		
		const originJobClutch = this.jobRef.jobClutch;
		const originJobKey: JobKey = originJobClutch.key;
		
		for (let targetJobClutch of this.linkedJobs) {
			const targetJobKey: JobKey = targetJobClutch.key;
			if (targetJobKey === originJobKey) continue; // same job
			
			diffs.set(targetJobKey, new JobDiffInfo(
				originJobClutch,
				targetJobClutch
			));
		}
		
		console.log(`Series diffs autorun:
		 ${this.linkedJobs.length} total,
		 ${this.diffs.size} -> ${diffs.size}
		`, diffs);
		this.diffs.replace(diffs); // mobx
		
	}, {delay: 100});
	
	@computed get jobKeysWithNoDiffs(): JobKey[] {
		const fields = this.pushFields.value;
		
		return $j.getKeysFromMapIf(
			this.diffs,
			(diff: JobDiffInfo) => (
				!diff.differentFieldKeys
					.some(
						fieldKey => fields.get(fieldKey)
					)
			)
		);
	}
	
	@computed get jobKeysWithDiffs(): JobKey[] {
		const fields = this.pushFields.value;
		
		return $j.getKeysFromMapIf(
			this.diffs,
			(diff: JobDiffInfo) => (
				diff.differentFieldKeys
					.some(
						fieldKey => fields.get(fieldKey)
					)
			)
		);
	}
}

const DEFAULTS = {
	occurrences: 1,
	weekdays: [
		false,
		false, // monday 0
		false, // 1
		false, // 2
		false, // 3
		false, // 4
		false, // 5
		false, // sunday 6
	],
	reoccurringEnum: 1,
};


export type ReoccurEnum = {
	key: IdKey,
	label: string,
	repeatType: 'day' | 'week' | 'month',
	repeatCount: number,
};
export const REOCCUR_ENUM: ReoccurEnum[] = [
	{
		key: 'daily',
		label: 'Repeat Daily',
		repeatType: 'day',
		repeatCount: 1,
	},
	{
		key: 'weekly',
		label: 'Repeat Weekly',
		repeatType: 'week',
		repeatCount: 1,
	},
	{
		key: 'every 2 weeks',
		label: 'every 2 Weeks',
		repeatType: 'week',
		repeatCount: 2,
	},
	{
		key: 'every 3 weeks',
		label: 'every 3 Weeks',
		repeatType: 'week',
		repeatCount: 3,
	},
	{
		key: 'monthly',
		label: 'Repeat Monthly',
		repeatType: 'month',
		repeatCount: 1,
	},
];

export type SeriesJobPreviewKey = string;
export type SeriesJobPreview = {
	key: SeriesJobPreviewKey,
	isPreview: boolean,
	dat: JobDat, // fake
}

export type SeriesJobEntry = Clutch<JobDat> | SeriesJobPreview;

export type T_SeriesDateSection = {
	key: ThymeDateKey;
	date: ThymeDt;
	times: Map<ThymeTimeKey, T_SeriesTimeRow>;
	jobs: SeriesJobEntry[];
}

export type T_SeriesTimeRow = {
	key: ThymeTimeKey;
	time: ThymeDt;
	jobs: SeriesJobEntry[];
}

function JobEntryStartSorter(a: SeriesJobEntry, b: SeriesJobEntry): number {
	const aStart = a.dat.start;
	const bStart = b.dat.start;
	
	if (!aStart) {
		if (!bStart) return JobEntryKeySorter(a, b);
		return +1;
	}
	
	if (!bStart) return -1;
	
	return aStart - bStart;
}

function JobEntryKeySorter(a: SeriesJobEntry, b: SeriesJobEntry): number {
	if (a.key < b.key) return -1;
	if (a.key > b.key) return +1;
	return 0;
}