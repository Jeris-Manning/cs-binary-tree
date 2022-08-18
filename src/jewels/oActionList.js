import {action, observable} from 'mobx';
import {WiseGem} from '../Bridge/jewelerClient/WiseGem';
import thyme from '../Bridge/thyme';
import {Jewels, Staches} from '../stores/RootStore';
import {BaseJewel} from './BaseJewel';

/*

new Stache friendly version: ReEntabler

	- handle loading elsewhere (vActionList)
	- pass source a Map of keys
	- may need a smaller JobDat with only minimal data
	- have JobListDat with variety of lists
		- by status
		- region
		- see: CanLoad, CanShow
		- date?

	- can combine multiple lists to get base set of jobs
	- then filters only apply to is visible

*/










// const DANGER_JOBS_SHOW_UP_TO_DAYS = 60;
// const DANGER_DEAF_CATEGORIES = [0, 3,];
// const DANGER_SITUATION_HASHTAGS = ['#danger'];
// const DANGER_JOB_SOON_DAYS = 5;
// const DANGER_JOB_ENTERED_DAYS = 14;
// const DANGER_HIDE_COMPANIES = [4707, 366, 5835, 4773, 4897, 6027,];
//
// const TEST_COMPANIES = [366, 5835];
// const STIPEND_COMPANIES = [4707, 4773, 4897, 6027, 6547,];
//
// /**
// What should show up?
//
//  unfilled
//  some statuses (sub, etc.)
//  follow up
//  bids
//  need confirmations
//  time since last action
//  seeking failed/rejected
//  haven't done Seek in awhile
//  "stale"
//
//
//  */
//
// export class oActionList extends BaseJewel {
// 	gems = {
// 		getAllJobs: new WiseGem(),
// 	};
//
//
// 	// GetJobFromRow = (row) => Jewels().jobs.GetJob(row.jobId);
// 	GetJobFromRow = (row) => Staches().cJob.GetOrStub(row.jobId, true);
//
// 	@observable jobCount = 0;
// 	@observable lastRefreshed = thyme.now();
//
//
// 	@action Refresh = async () => {
// 		this.source.Clear();
//
// 		this.jobCount = 0;
//
// 		this.lastRefreshed = thyme.now();
//
// 		let start = this.startInput.startOf('day');
// 		const end = this.endInput.endOf('day');
//
// 		const allJobs =
// 			await this.gems.getAllJobs.Get({
// 				start: thyme.fast.pack(start),
// 				end: thyme.fast.pack(end),
// 			});
//
// 		await this.source.Add(allJobs);
// 	};
//
// 	@observable isNoteModal = false;
// 	@observable noteRow = {};
// 	@action OpenNoteModal = (row) => {
// 		this.noteRow = row;
// 		this.isNoteModal = true;
// 	};
// 	@action CloseNoteModal = () => this.isNoteModal = false;
//
// 	@action SubmitNote = async (row, note) => {
// 		console.log(`Submitting Note ${row.jobId}: ${note}`);
// 		await Jewels().jobHistory.AddNote(row.jobId, note);
// 		await Jewels().oActionList.source.Reload(row.jobId);
// 		this.CloseNoteModal();
// 	};
//
//
// 	CheckFilter = (filter, job) => {
// 		if (filter.status === 'unset') return true;
// 		return filter.checker(job)
// 			? filter.status === 'required'
// 			: filter.status === 'banned';
// 	};
//
// 	CanLoad = (job) => {
// 		if (!thyme.isBetween(job.start, this.startInput, this.endInput)) return false;
//
// 		if (job.status !== 2 && job.status !== 9) return true;
// 		if (job.status === 2 && !job.terpId) return true;
//
// 		if (job.followUp && this.CheckFilter(this.filters.followUp, job)) return true;
//
// 		if (!this.CheckFilter(this.filters.showStipends, job)) return false;
//
// 		if (job.status === 9) return false;
//
// 		if (job.isCancelled
// 			&& Jewels().billing.IsLabelCancelled(job.billType)
// 		) return false;
//
// 		if (!job.companyConfirmed || !job.terpConfirmed) return true;
// 		if (job.status === 2) return false;
// 		return true;
// 	};
//
// 	CanShow = (job) => {
// 		// return false;
// 		if (!this.CheckFilter(this.filters.showStipends, job)) return false;
// 		if (!this.CheckFilter(this.filters.followUp, job)) return false;
// 		if (!this.CheckFilter(this.filters.vri, job)) return false;
// 		if (!this.CheckFilter(this.filters.metro, job)) return false;
// 		if (!this.CheckFilter(this.filters.northDakota, job)) return false;
// 		if (!this.CheckFilter(this.filters.northWest, job)) return false;
// 		if (!this.CheckFilter(this.filters.central, job)) return false;
// 		if (!this.CheckFilter(this.filters.south, job)) return false;
// 		if (!this.CheckFilter(this.filters.wisconsin, job)) return false;
//
// 		return true;
// 	};
//
// 	@action SetFilter = (key, status) => {
// 		// TODO
// 		this.filters[key].status = status;
// 		this.source.RecheckLoad();
// 		// this.source.SetCheckers(this.CanLoad, this.CanShow);
// 	};
//
// 	@observable startInput = thyme.todayMinus({days: 10});
// 	@observable endInput = thyme.endOfTodayPlus({days: 4});
// 	// @observable startInput = thyme.fromIso('2020-06-26');
// 	// @observable endInput = thyme.fromIso('2020-07-04');
//
// 	@action SetStart = (value) => this.startInput = value;
// 	@action SetEnd = (value) => this.endInput = value;
//
// 	@action PreviousDataRange = () => {
// 		this.endInput = this.startInput;
// 		this.startInput = this.startInput.minus({days: 4});
// 		return this.Refresh();
// 	};
//
// 	@action NextDataRange = () => {
// 		this.startInput = this.endInput;
// 		this.endInput = this.endInput.plus({days: 4});
// 		return this.Refresh();
// 	};
// }