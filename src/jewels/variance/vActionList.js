import {action, autorun, computed, observable, trace} from 'mobx';
import {BaseJewel} from '../BaseJewel';
import {Jewels, Staches} from '../../stores/RootStore';
import type {JobId, JobKey} from '../../datum/stache/JobDat';
import {JobDat} from '../../datum/stache/JobDat';
import {ReTable} from '../../Bridge/ReTable/ReTable';
import {FaCheckDouble, FaHistory, FaMoneyCheck, FaRegBuilding} from 'react-icons/fa';
import {HUE} from '../../Bridge/HUE';
import {MdAccessibility, MdWarning} from 'react-icons/md';
import {FiVideo} from 'react-icons/fi';
import type {ThymeDt} from '../../Bridge/thyme';
import thyme from '../../Bridge/thyme';
import {JOB_LISTS, JobListDat} from '../../datum/stache/JobListDat';
import {Clutch} from '../../Bridge/DockClient/Stache';
import {RC_IconBool} from '../../components/ReCells/RC_BoolIcon';
import {ReColumn} from '../../Bridge/ReTable/ReColumn';
import {RC_Text} from '../../components/ReCells/RC_Text';
import {RC_Date} from '../../components/ReCells/RC_Date';
import {RC_TimeRange} from '../../components/ReCells/RC_TimeRange';
import {RC_DeafArray} from '../../components/ReCells/RC_DeafArray';
import {RC_Company} from '../../components/ReCells/RC_Company';
import {RC_Location} from '../../components/ReCells/RC_Location';
import {RC_Timestamp} from '../../components/ReCells/RC_Timestamp';
import {RC_Confirmation} from '../../components/ReCells/RC_Confirmation';
import {RC_JobStatus} from '../../components/ReCells/RC_JobStatus';
import {RC_JobNotes} from '../../components/ReCells/RC_JobNotes';
import {RC_LastUpdated} from '../../components/ReCells/RC_LastUpdated';
import {RC_Terp} from '../../components/ReCells/RC_Terp';
import {ReFilter, Required} from '../../Bridge/ReTable/ReFilter';
import {RC_Situation} from '../../components/ReCells/RC_Situation';
import {REGION_IDS} from '../../datum/stache/RegionDat';
import {JobsByDateDat, MakeJobsByDateKey} from '../../datum/stache/JobsByDateDat';
import type {JobsByDateEntry} from '../../datum/stache/JobsByDateDat';
import $j from '../../Bridge/misc/$j';

const STIPEND_COMPANIES = ['4707', '4773', '4897', '6027', '6547'];
const STATUS_FILLED = 2;
const STATUS_CANCELLED = 9;

export class vActionList extends BaseJewel {
	
	ToLog = (msg) => `ACTION ${msg}`;
	
	_AddNote = (jobId: JobId, note: string) => Jewels().oJobEdit.AddNote(jobId, note);
	
	
	@observable isOnPage = false;
	@observable startInput = thyme.todayMinus({days: 10});
	@observable endInput = thyme.endOfTodayPlus({days: 7});
	
	@action SetIsOnPage = (isOnPage) => this.isOnPage = isOnPage;
	
	@action SetStart = (value) => {
		console.log(this.ToLog(`SetStart: ${this.startInput} -> ${value}`));
		this.startInput = value;
	};
	
	@action SetEnd = (value) => {
		console.log(this.ToLog(`SetEnd: ${this.endInput} -> ${value}`));
		this.endInput = value;
	};
	
	@action PreviousDataRange = () => {
		this.SetEnd(this.startInput);
		this.SetStart(this.startInput.minus({days: 7}));
	};
	
	@action NextDataRange = () => {
		this.SetStart(this.endInput);
		this.SetEnd(this.endInput.plus({days: 7}));
	};
	
	
	@computed get dates(): ThymeDt[] {
		if (!this.isOnPage) return []; // for initial (re)render
		
		const dates = thyme.getRangeDates(this.startInput, this.endInput);
		// console.log(this.ToLog(`dates: ${dates.length}`), dates);
		return dates;
	}
	
	@computed get datesCount(): number {return this.dates.length;}
	
	@computed get byDateClutches(): Clutch<JobsByDateDat>[] {
		// console.log(this.ToLog(`byDateClutches ${this.dates.length}`));
		return this.dates.map(
			dt => Staches().cJobsByDate.GetOrStub(MakeJobsByDateKey(dt))
		);
	}
	
	// @computed get followUpClutches(): Clutch<JobListDat>[] {
	// 	console.log(this.ToLog(`followUpClutches ${this.dates.length}`));
	// 	return this.dates.map(dt => Staches().cJobList.GetOrStub(JOB_LISTS.followUp(dt)));
	// }
	
	@computed get dateDats(): JobsByDateDat[] {
		const dats = this.byDateClutches
			.map(c => c.dat);
		// console.log(this.ToLog(`dateDats ${dats.length}`), dats);
		return dats;
	}
	
	@computed get jobEntries(): JobsByDateEntry[] {
		return this.dateDats.flatMap(d => [...d.jobs.values()]);
	}
	
	@computed get listJobIds(): JobId[] {
		let jobIds = [];
		
		for (let jobEntry of this.jobEntries) {
			if (this.vri_F.Forbidden(jobEntry)) continue; /* filter fail */
			if (this.followUp_F.Forbidden(jobEntry)) continue; /* filter fail */
			if (this.isConfirmed_F.Forbidden(jobEntry)) continue; /* filter fail */
			
			if (jobEntry.followUp) {
				/* needs follow up regardless of other data */
				jobIds.push(jobEntry.jobId);
				continue;
			}
			
			const isCancelled = jobEntry.status === STATUS_CANCELLED;
			if (isCancelled) continue; /* skip cancelled */
			
			
			const isFilled = jobEntry.status === STATUS_FILLED;
			
			const needsConfirm =
				!jobEntry.companyConfirmed
				|| !jobEntry.terpConfirmed
			
			if (isFilled && !needsConfirm) continue;  /* no action needed */
			
			
			/* needs action */
			jobIds.push(jobEntry.jobId);
		}
		
		// console.log(this.ToLog(`listJobIds ${jobIds.length}`), jobIds);
		return jobIds;
	}
	
	@computed get listJobIdsCount(): number {
		return this.listJobIds.length;
	}
	
	@computed get byDateCount(): number {
		let count = 0;
		for (let clutch of this.byDateClutches) {
			count += clutch.dat.jobIds.length;
		}
		return count;
	}
	
	// @computed get followUpCount(): number {
	// 	let count = 0;
	// 	for (let clutch of this.followUpClutches) {
	// 		count += clutch.dat.jobIds.length;
	// 	}
	// 	return count;
	// }
	
	@computed get jobIdsCount(): number {
		return this.byDateCount;
	}
	
	@computed get createdByNames(): string[] {
		let names = new Map();
		for (let [key, clutch] of this.rowMap) {
			names.set(clutch.dat.createdBy || 'unknown', true);
		}
		return [...names.keys()].sort();
	}
	
	
	// @computed get jobIdsCount(): number {return this.listJobIds.length;}
	
	
	@observable rowMap: Map<JobKey, Clutch<JobDat>> = new Map();
	
	runRowMap = autorun(() => {
		// trace();
		// console.log(this.ToLog(`runRowMap START, current size: ${this.rowMap.size}`));
		
		const GetOrStub = Staches().cJob.GetOrStub;
		
		const newMap = new Map();
		
		for (let jobId of this.listJobIds) {
			const clutch = GetOrStub(jobId);
			newMap.set(clutch.key, clutch);
		}
		
		this.rowMap.replace(newMap); // mobx
		
		// console.log(this.ToLog(`runRowMap COMPLETE, new size: ${this.rowMap.size}`));
	}, {delay: 100});
	
	
	/* COLUMNS */
	
	@observable followUp_RC = RC_IconBool.COLUMN({
		key: 'followUp',
		labelIcon: FaHistory,
		cell: {
			icon: FaHistory,
			iconHue: HUE.job.followUp,
			iconSize: 20,
			tooltip: 'Need to follow up',
		}
	});
	
	@observable warning_RC = RC_IconBool.COLUMN({
		key: 'warning',
		labelIcon: MdWarning,
		cell: {
			icon: MdWarning,
			iconHue: HUE.job.warning,
			iconSize: 20,
			tooltip: v => v,
		}
	});
	
	@observable jobId_RC = RC_Text.COLUMN({
		key: 'jobId',
		label: 'Job ID',
		w: 'max-content',
		cell: {
			linker: {
				toKey: 'job',
				params: (v) => ({jobId: v, tab: 'details'}) // TODO: based on status
			},
			showClipButton: true,
		}
	});
	
	@observable date_RC = RC_Date.COLUMN({
		key: 'date',
		accessor: 'start',
		label: 'Date',
		w: 55,
		center: true,
	});
	
	@observable time_RC = RC_TimeRange.COLUMN({
		key: 'time',
		label: 'Time',
		noSort: true,
		center: true,
		cell: {
			startKey: 'start',
			endKey: 'end',
			warningMinutes: 241,
			warningHue: '#f1f1bf',
			warningTooltip: 'Important: long job!',
		}
	});
	
	@observable companyId_RC = RC_Company.COLUMN({
		key: 'companyId',
		label: 'Company',
		w: 100,
		// center: true,
	});
	
	@observable situation_RC = RC_Situation.COLUMN({
		key: 'situation',
		label: 'Situation',
		fr: 1.5,
		cell: {
			tooltip: v => v,
			trunc: 80,
			style: {
				size: 12,
			},
		}
	});
	
	@observable deafIds_RC = RC_DeafArray.COLUMN({
		key: 'deafIds',
		label: 'Deaf',
		w: 120,
		noSort: true,
	});
	
	@observable location_RC = RC_Location.COLUMN({
		key: 'locationId',
		label: 'Location',
		fr: 1.5,
		cell: {
			showRegion: true,
			trunc: 80,
		}
	});
	
	@observable createdAt_RC = RC_Timestamp.COLUMN({
		key: 'createdAt',
		label: 'Created',
		w: 62,
		center: true,
	});
	
	
	@observable status_RC = RC_JobStatus.COLUMN({
		key: 'status',
		label: 'Status',
		w: 60,
	});
	
	@observable notes_RC = RC_JobNotes.COLUMN({
		key: 'notes',
		accessor: 'jobId',
		cell: {
			openModal: (jobId) => this.OpenNoteModal(jobId),
		},
	});
	
	@observable companyConfirmed_RC = RC_Confirmation.COLUMN({
		key: 'companyConfirmed',
		labelIcon: FaRegBuilding,
		cell: {
			icon: FaRegBuilding,
			confirmType: 'Company',
		}
	});
	
	@observable terpConfirmed_RC = RC_Confirmation.COLUMN({
		key: 'terpConfirmed',
		labelIcon: MdAccessibility,
		cell: {
			icon: MdAccessibility,
			confirmType: 'Interpreter',
		}
	});
	
	@observable terpId_RC = RC_Terp.COLUMN({
		key: 'terpId',
		label: 'Terp',
		w: 100,
	});
	
	@observable lastUpdated_RC = RC_LastUpdated.COLUMN({
		key: 'lastUpdated',
		label: 'Updated',
		accessor: 'jobId',
		center: true,
	});
	
	@observable columnList: ReColumn[] = [
		this.followUp_RC,
		this.warning_RC,
		this.jobId_RC,
		this.date_RC,
		this.time_RC,
		this.companyId_RC,
		this.situation_RC,
		this.deafIds_RC,
		this.location_RC,
		this.createdAt_RC,
		this.notes_RC,
		this.status_RC,
		this.companyConfirmed_RC,
		this.terpConfirmed_RC,
		this.terpId_RC,
		this.lastUpdated_RC,
	];
	
	@observable retable = new ReTable({
		label: 'Action List',
		rowMap: this.rowMap,
		columnList: this.columnList,
	});
	
	
	/* PRE-LOAD FILTERS */
	
	@observable followUp_F = new ReFilter({
		key: 'followUp',
		label: 'Follow Up',
		icon: FaHistory,
	});
	
	@observable vri_F = new ReFilter({
		key: 'vri',
		label: 'VRI',
		icon: FiVideo,
	});
	
	@observable isConfirmed_F = new ReFilter({
		key: 'isConfirmed',
		label: 'Confirmed',
		icon: FaCheckDouble,
		fnCheck: (_, entry: JobsByDateEntry) => entry.companyConfirmed && entry.terpConfirmed,
	});
	
	/* POST-LOAD FILTERS */
	
	@observable stipends_F = new ReFilter({
		key: 'stipends',
		accessor: 'companyId',
		label: 'Stipends',
		icon: FaMoneyCheck,
		fnCheck: (companyId) => STIPEND_COMPANIES.includes(String(companyId)),
	});
	
	@observable mainFilters: ReFilter[] = [
		this.stipends_F,
		this.followUp_F,
		this.vri_F,
		this.isConfirmed_F,
	];
	
	
	@observable metro_F = new ReFilter({
		key: 'metro',
		accessor: 'terpRegion',
		compareWith: REGION_IDS.metro,
		label: 'Metro',
	});
	
	@observable northWest_F = new ReFilter({
		key: 'northWest',
		accessor: 'terpRegion',
		compareWith: REGION_IDS.northWest,
		label: 'North West',
	});
	
	@observable northEast_F = new ReFilter({
		key: 'northEast',
		accessor: 'terpRegion',
		compareWith: REGION_IDS.northEast,
		label: 'North East',
	});
	
	@observable central_F = new ReFilter({
		key: 'central',
		accessor: 'terpRegion',
		compareWith: REGION_IDS.central,
		label: 'Central',
	});
	
	@observable south_F = new ReFilter({
		key: 'south',
		accessor: 'terpRegion',
		compareWith: REGION_IDS.southern,
		label: 'South',
	});
	
	@observable wisconsin_F = new ReFilter({
		key: 'wisconsin',
		accessor: 'terpRegion',
		compareWith: REGION_IDS.wisconsin,
		label: 'Wisconsin',
	});
	
	
	@observable regionFilters: ReFilter[] = [
		this.metro_F,
		this.northWest_F,
		this.northEast_F,
		this.central_F,
		this.south_F,
		this.wisconsin_F,
	];
	
	
	@observable createdByFilter = new ReFilter({
		key: 'createdBy',
		compareWith: [],
		status: Required,
		fnCheck: (value, dat, f: ReFilter) => f.compareWith.length === 0 || f.compareWith.includes(value)
	});
	
	
	/* HISTORY NOTES  TODO: break out into its own thing */
	@observable showNoteModalForJobId: JobId;
	
	@action OpenNoteModal = (jobId: JobId) => this.showNoteModalForJobId = jobId;
	@action CloseNoteModal = () => this.showNoteModalForJobId = null;
	
	@action SubmitNote = async (note: string) => {
		const jobId = this.showNoteModalForJobId;
		
		if (jobId && note) {
			console.log(`Submitting Note ${jobId}: ${note}`);
			await this._AddNote(jobId, note);
		}
		
		this.CloseNoteModal();
	};
	
}