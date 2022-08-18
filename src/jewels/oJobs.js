import {action, observable, toJS} from 'mobx';
import thyme from '../Bridge/thyme';
import {vow} from '../Bridge/misc/$j';
import {WiseGem} from '../Bridge/jewelerClient/WiseGem';
import {Router} from '../stores/RootStore';
import Formula from '../Bridge/Bricks/Formula/Formula';
import Fieldula from '../Bridge/Bricks/Formula/Fieldula';
import {BaseJewel} from './BaseJewel';

export default class oJobs extends BaseJewel {
	gems = {
		/*
			
			# move to oJobEdit
				
				getJob
				saveJob
				createJob
				
				assignTerp:  ? needed ?
				unassignTerp:  ? needed ?
				
				
			# move to oJobSeek
			
				x   getAllTerps
					getSeekers
					postSeekers
					removeSeekers
				?	removeSeekersForJob
				
					rejectBid
					postLegacyPaging
					getAllJobsWithActiveSeekers
					
				
			# move to oConfirmation
			
				sendCompanyConfirmation
				sendTerpConfirmation
				clearCompanyConfirmation
				clearTerpConfirmation
				printedConfirmation
			
				
			# move elsewhere
				
				getJobsBy
				getJobConflicts
				
				
				
		*/
		
		getJobsBy: new WiseGem('by'), // TODO: move
	};
	
	
	GetJobsBy = (params) => {
		return this.gems.getJobsBy.Get(params);
	};
	
	GetJobsByIds = (jobIds) => {
		if (!jobIds || !jobIds.length) return;
		return this.GetJobsBy({
			by: 'jobIds',
			jobIds: toJS(jobIds),
		});
	};
	
	
	@observable gotoJobForm = new Formula({
		fields: {
			input: new Fieldula({
				label: '',
				name: 'Job ID',
				placeholder: `🔍 Job ID`,
			}),
		}
	});
	
	@action SubmitGotoJobForm = (forceListPage, clearForm) => {
		const entry = this.gotoJobForm.fields.input.value;
		
		if (!entry) return;
		
		if (clearForm) this.gotoJobForm.fields.input.Clear();
		
		const router = Router();
		const jobIds = entry.match(splitToNumbers);
		
		if (!jobIds || jobIds.length === 0) return;
		
		if (!forceListPage && jobIds.length === 1) {
			return router.Navigate(
				router.routes.job,
				{
					jobId: jobIds[0],
					tab: (router.currentRoute || {}).key === 'job' ? router.params.tab : 'details',
				},
			);
		}
		
		return router.Navigate(router.routes.jobList, {jobIds: jobIds.join('-')});
	};
	
	@action SetIsWritingNote = (val) => this.isWritingNote = val;
	
	
	@action MarkJobsBillingComplete = async (jobIds) => {
		console.log(`Marking these jobs as billing complete: ${jobIds.join(', ')}`);
		
		/*
		 RESUME fix
		 
		 
		*/
		
		const [_, error] = await vow(
			jobIds.map(jobId => (
				this.gems.changeFields.Post({
					jobId: jobId,
					changes: {
						hasCompanyInvoiced: true,
						qbStatus: 2, // 2 = Complete
						companyInvoicedOn: thyme.nowSdt(), // TODO: move to server
					},
				})
			))
		);
		
		if (error) throw new Error(error);
	};
	
	
}
	// GetJobsByConflict = (params) => {
	// 	return this.gems.getJobsByConflict.Get(params);
	// };
	
	// @action OnEnterPage = async (params) => {
	// 	let {
	// 		jobId,
	// 		tab,
	// 	} = params;
	//
	// 	console.log(`ENTER JOB PAGE ${jobId} (was ${this.job.jobId})`);
	//
	// 	if (!jobId) return;
	// 	this.isOnPage = true;
	//
	// 	jobId = `${jobId}`;
	//
	// 	if (jobId === 'new')
	// 		return this.StartNewJob(params);
	//
	// 	// if (jobId !== this.job.jobId || this.outOfDate)
	// 	await this.Load(jobId);
	//
	// 	if (tab === 'linked')
	// 		await Jewels().linked.LoadJob();
	// };
	//
	// @action OnExitPage = (params) => {
	// 	this.isOnPage = false;
	// 	this.isInitialized = false;
	// 	Jewels().gazer.UnwatchJob();
	// };
	//
	// @action OnParamsChange = (params) => {
	// 	return this.OnEnterPage(params);
	// };
	
	// @observable job = {};
	// @observable jobId = '';
	// @observable version = -1;
	// @observable isInitialized = false;
	// @observable loader = new Loader();
	// @observable allLoader = new ParallelLoader();
	// @observable error = '';
	// @observable saveError = '';
	// @observable jobUpstate = new JobUpdata({});
	// @observable isOnPage = false;
	// @observable outOfDate = null;
	// @observable updateToken = ''; // used to ignore change notifications from this client
	// @observable isWritingNote = false;
	// @observable showCalendar = false;
	// @observable gettingJob = false;
	
	// GetJob = async (jobId, getHistory = true, skipCache = false) => {
	// 	const [jobRaw, error] = await vow(
	// 		this.gems.getJob.Get({
	// 			jobId: jobId,
	// 			getHistory: getHistory,
	// 			skipCache: skipCache,
	// 		})
	// 	);
	//
	// 	if (error || jobRaw.error) throw new Error(error);
	// 	if (!jobRaw) throw new Error('error: bad job');
	//
	// 	if (getHistory && jobRaw.history) thyme.fast.obj.unpack(jobRaw.history);
	//
	// 	const job = new Job(jobRaw);
	//
	// 	if (!Jewels().billing.billTypes) await Jewels().billing.LoadBillTypes();
	// 	job.SetBillTypeId(Jewels().billing.GetBillTypeId(job.billType));
	//
	// 	return job;
	// };
	
	// @action Load = async (jobId) => {
	// 	console.log(`LOAD job ${jobId}`);
	// 	this.jobId = `${jobId}`;
	// 	this.loader.Start();
	// 	this.error = '';
	// 	this.saveError = '';
	// 	this.outOfDate = null;
	// 	this.updateToken = nanoid(12);
	// 	this.isWritingNote = false;
	// 	this.gettingJob = true;
	//
	// 	const [job, error] = await vow(
	// 		this.GetJob(jobId, false, true)
	// 	);
	//
	// 	this.gettingJob = false;
	//
	// 	if (error) {
	// 		runInAction(() => {
	// 			this.error = `can't find job ${jobId}`;
	// 			this.loader.Error(error);
	// 			this.isInitialized = true;
	// 		});
	// 		return;
	// 	}
	//
	//
	// 	const jewels = Jewels();
	//
	// 	const [all, allError] = await this.allLoader.Load({
	// 		history: jewels.jobHistory.GetHistory(jobId),
	// 		chats: jewels.staffChat.GetChatsByRefId(jobId),
	// 		locations: jewels.location.GetLocationsForJob(jobId),
	// 		deafs: jewels.deaf.GetDeafsForJob(jobId),
	// 		__gazer: jewels.gazer.WatchJob(jobId),
	// 		__linked: jewels.linked.LoadSummary(jobId),
	// 	});
	//
	// 	console.log(`loaded ${jobId}`, job);
	//
	// 	runInAction(() => {
	// 		this.job = job;
	//
	// 		this.job.history = all.history;
	// 		this.SetJobVersion(all.history.version);
	//
	// 		console.log(`setting version: ${this.version}`);
	//
	// 		this.job.companyLocations = all.locations;
	// 		this.job.companyDeafs = $j.convertToLookup(all.deafs, 'deafId');
	// 		this.job.chats = thyme.mutate.fromEpoch(all.chats, ['sentAt']);
	//
	//
	// 		console.log(`chats ${jobId}`, all.chats, this.job.chats);
	// 		// this.job.billTypeId = Jewels().billing.GetBillTypeId(this.job.billType);
	//
	// 		this.jobUpstate = new JobUpdata(this.job);
	// 	});
	//
	//
	// 	this.LoadConflicts().then();
	// 	this.LoadLocation(this.jobUpstate.locationId.value).then();
	//
	// 	// TODO: don't load all of Seek on the details page
	// 	await Jewels().seek.LoadSeeking(this.job, this.jobUpstate);
	//
	// 	runInAction(() => {
	// 		this.loader.Done();
	// 		this.isInitialized = true;
	// 	});
	// };
	
	// @action Reload = async () => this.Load(this.jobId);
	
	// @computed get canSave() {
	// 	// TODO: validation
	// 	if (!this.jobUpstate.companyId.value) return false;
	//
	// 	return this.jobUpstate.hasChanged;
	// }
	
	// updateGazer = autorun(() => {
	// 	if (this.jobUpstate.hasChanged) {
	// 		if (this.job.jobId !== 'NEW') {
	// 			Jewels().gazer.StartEditJob(this.job.jobId).then();
	// 		}
	// 	}
	// });
	
	// @computed get saveTooltip() {
	// 	if (this.canSave) return 'Save (Ctrl+S)';
	// 	if (!this.jobUpstate.companyId.value) return 'Must have a Company';
	// 	return 'No changes';
	// }
	
	// @observable isSaving = false;
	
	// @action Save = async () => {
	// 	if (this.job.jobId === 'new') return this.CreateJob();
	//
	// 	console.log(`trying Save`);
	//
	// 	if (!this.canSave) return;
	//
	// 	this.isSaving = true;
	// 	this.saveError = '';
	//
	// 	let jobId = this.job.jobId;
	// 	const changes = this.jobUpstate.GetChanges();
	//
	// 	if (changes.hasOwnProperty('billTypeId')) {
	// 		changes.isCancelled = Jewels().billing.IsBillTypeIdCancelled(changes.billTypeId);
	// 		this.jobUpstate.isCancelled.Change(changes.isCancelled);
	// 	}
	//
	// 	console.log(`posting job changes`, changes);
	//
	// 	const result =
	// 		await this.gems.changeFields.Post({
	// 			jobId: jobId,
	// 			changes: changes,
	// 			updateToken: this.updateToken,
	// 		});
	//
	// 	await vow([
	// 		this.ReloadHistory(),
	// 		Jewels().gazer.StopEditJob(this.job.jobId),
	// 	]);
	//
	// 	runInAction(() => {
	// 		this.jobUpstate.Apply();
	// 		this.job.start = this.jobUpstate.start;
	// 		this.job.end = this.jobUpstate.end;
	// 		this.isSaving = false;
	// 		if (result.error) this.saveError = $j.forceString(result.error);
	// 	});
	//
	// 	await this.LoadConflicts();
	// };
	//
	// @action Revert = async () => {
	// 	this.jobUpstate.Revert();
	// 	await Jewels().gazer.StopEditJob(this.job.jobId);
	// };
	//
	// @action ReloadHistory = async () => {
	// 	if (!this.job || !this.job.jobId) return;
	// 	const history =
	// 		await Jewels().jobHistory.GetHistory(this.job.jobId);
	//
	// 	runInAction(() => {
	// 		this.job.history = history;
	// 		this.SetJobVersion(history.version);
	// 	});
	// };
	
	// @action SetJobVersion = (version) => {
	// 	console.log(`Set job version: ${this.version} -> ${version}`);
	// 	this.version = version;
	// };
	//
	// @action OnNotifyNewVersion = ({id, version, updatedAt, updatedBy, updateToken}) => {
	// 	if (updateToken === this.updateToken) {
	// 		console.log(`New job version alert from self (ignoring)`);
	// 		return;
	// 	}
	//
	// 	if (this.job.jobId !== id) return;
	//
	// 	console.log(`New job version alert from ${updatedBy}: ${this.version} -> ${version}`);
	//
	// 	this.outOfDate = {
	// 		version: version,
	// 		at: updatedAt,
	// 		by: updatedBy,
	// 	};
	// };
	
	
	// @action AssignTerp = async (params) => {
	// 	// jobId
	// 	// terpId
	// 	// seekerId
	// 	// sendTerpConfirm
	// 	// sendCompanyConfirm
	// 	// setStatus
	//
	// 	await this.gems.assignTerp.Post({
	// 		...params,
	// 		updateToken: this.updateToken,
	// 	});
	//
	// 	await this.Reload();
	// };
	
	// @action UnassignTerp = async () => {
	// 	const jobId = this.job.jobId;
	//
	// 	await this.gems.unassignTerp.Post({
	// 		jobId: jobId,
	// 		terpId: this.job.terpId,
	// 		updateToken: this.updateToken,
	// 	});
	//
	// 	await this.gems.clearCompanyConfirmation.Post({
	// 		jobId: jobId,
	// 		updateToken: this.updateToken,
	// 	});
	//
	// 	await this.gems.clearTerpConfirmation.Post({
	// 		jobId: jobId,
	// 		updateToken: this.updateToken,
	// 	});
	//
	// 	await this.gems.changeFields.Post({
	// 		jobId: jobId,
	// 		changes: {status: 3},
	// 		updateToken: this.updateToken,
	// 	});
	//
	// 	this.jobUpstate.status.Change(3);
	// 	this.jobUpstate.status.Apply();
	//
	// 	await this.Reload();
	// };
	
	// @action ClearCompany = () => {
	// 	this.jobUpstate.companyId.Change(0);
	// 	this.jobUpstate.contactId.Change(0);
	// 	return this.CompanyHasChanged();
	// };
	
	// @action ClearContact = () => {
	// 	this.jobUpstate.contactId.Change(0);
	// };
	
	// @action CompanyHasChanged = async () => {
	// 	await Promise.all([
	// 		// this.ReloadContacts(),
	// 		this.ReloadLocations(this.jobUpstate.locationId.value),
	// 		this.ReloadDeafs(this.jobUpstate.deafIds.value),
	// 		this.LoadCompanyDefaults(this.jobUpstate.companyId.value),
	// 	]);
	// };
	
	// @action SelectCompanyForChosenContact = async () => {
	// 	const contactId = this.jobUpstate.contactId.value;
	// 	if (!contactId) return;
	// 	const contact = Staches().contacts.Get(contactId);
	// 	if (!contact.companyId) return;
	//
	// 	if (contact.companyId === this.jobUpstate.companyId.value) return;
	//
	// 	this.jobUpstate.companyId.Change(contact.companyId);
	// 	return this.CompanyHasChanged();
	// };
	
	// @action ReloadLocations = async (newValue = 0) => {
	// 	const [locations, error] = await vow(
	// 		Jewels().location.GetLocationsForCompany(this.jobUpstate.companyId.value)
	// 	);
	//
	// 	runInAction(() => {
	// 		this.job.companyLocations = locations;
	// 		this.jobUpstate.locationId.Change(newValue);
	// 	});
	// };
	
	// @action ReloadDeafs = async (newValue = []) => {
	// 	const deafs =
	// 		await Jewels().oDeaf.GetDeafsForCompany(this.jobUpstate.companyId.value);
	//
	// 	runInAction(() => {
	// 		this.job.companyDeafs = $j.convertToLookup(deafs, 'deafId');
	// 		this.jobUpstate.deafIds.Change(newValue);
	// 	});
	// };
	
	// @action LoadCompanyDefaults = (companyId) => {
	// 	if (!companyId) return;
	//
	// 	const company = Staches().companies.Get(companyId);
	// 	this.jobUpstate.rate.Change(company.rate);
	// 	// this.jobUpstate.cap.Change(company.cap);
	// 	this.ComputeCap();
	// };
	
	// @action ComputeCap = () => {
	// 	const companyId = this.jobUpstate.companyId.value;
	// 	const companyCap = Staches().companies.Get(companyId).cap;
	//
	// 	if (this.jobUpstate.vri.value) {
	// 		this.jobUpstate.cap.Change((companyCap > 0 && companyCap < 50) ? companyCap : 50);
	// 	} else {
	// 		this.jobUpstate.cap.Change(companyCap);
	// 	}
	// };
	
	
	// @action StartNewJob = async (params) => {
	// 	// TODO: use params (like companyId etc.)
	//
	// 	this.jobId = `new`;
	// 	this.error = '';
	// 	this.saveError = '';
	// 	this.outOfDate = null;
	// 	this.updateToken = nanoid(12);
	// 	this.isWritingNote = false;
	//
	// 	await this.Preload();
	//
	// 	runInAction(() => {
	// 		const start = thyme.withHour(thyme.today().plus({days: 1}), 9);
	// 		const end = start.plus({hours: 2});
	//
	// 		this.job = new Job({
	// 			jobId: 'new',
	// 			// start: start,
	// 			// end: end,
	// 			status: 3,
	// 			billType: 1,
	// 			flatRate: 0,
	// 			overrideRate: 0,
	// 		});
	// 		this.jobUpstate = new JobUpdata(this.job);
	// 		this.isInitialized = true;
	// 	});
	// };
	
	// @action CreateJob = async () => {
	// 	this.isSaving = true;
	// 	this.saveError = '';
	//
	// 	const dateTime = this.jobUpstate.GetDateTimeChanges();
	// 	if (!dateTime) {
	// 		throw new Error(`Something went wrong with getting Date + Time combination, tell Trenton!
	// 		| date: ${this.jobUpstate.date.value}
	// 		| start: ${this.jobUpstate.startTime.value}
	// 		| end: ${this.jobUpstate.endTime.value}`);
	// 	}
	//
	// 	const {start, end} = dateTime;
	// 	const changes = this.jobUpstate.GetChanges();
	//
	// 	const result =
	// 		await this.gems.createJob.Post({
	// 			job: {
	// 				start: thyme.toFastJson(start),
	// 				end: thyme.toFastJson(end),
	// 				createdBy: LocalStaff().internalName,
	// 				...changes,
	// 			},
	// 			updateToken: this.updateToken,
	// 		});
	//
	// 	const jobId = result.jobId;
	//
	// 	runInAction(() => {
	// 		this.isSaving = false;
	// 		if (result.error) this.saveError = $j.forceString(result.error);
	// 	});
	//
	// 	if (!jobId) return;
	//
	// 	this.jobUpstate.Apply();
	//
	// 	return this.router.Navigate(this.router.routes.job, {jobId: jobId, tab: 'details'});
	// };
	
	// @action SendCompanyConfirmation = async (emails, sendEmail = true) => {
	// 	await this.Save();
	//
	//
	// 	const result =
	// 		await this.gems.sendCompanyConfirmation.Post({
	// 			jobId: this.job.jobId,
	// 			emails: emails,
	// 			sendEmail: sendEmail,
	// 			updateToken: this.updateToken,
	// 		});
	//
	// 	runInAction(() => {
	// 		this.job.companyConfirmed = thyme.fromFastJson(result.companyConfirmed);
	// 	});
	//
	// 	await this.ReloadHistory();
	// };
	
	// @action SendTerpConfirmation = async (emailAddress, sendEmail = true) => {
	// 	await this.Save();
	//
	//
	// 	const result =
	// 		await this.gems.sendTerpConfirmation.Post({
	// 			jobId: this.job.jobId,
	// 			emailAddress: emailAddress.trim(),
	// 			sendEmail: sendEmail,
	// 			notification: {
	// 				jobId: this.job.jobId,
	// 				dateString: thyme.nice.date.input(this.job.start),
	// 				label: `Job confirmed: ${this.job.jobId} ${thyme.nice.date.brief(this.job.start)}`
	// 			},
	// 			updateToken: this.updateToken,
	// 		});
	//
	// 	runInAction(() => {
	// 		this.job.terpConfirmed = thyme.fromFastJson(result.terpConfirmed);
	// 	});
	//
	// 	await this.ReloadHistory();
	// };
	
	// @action PrintedConfirmation = async () => {
	// 	await this.gems.printedConfirmation.Post({
	// 		jobId: this.job.jobId,
	// 		updateToken: this.updateToken,
	// 	});
	//
	// 	runInAction(() => {
	// 		this.job.companyConfirmed = thyme.now();
	// 	});
	//
	// 	await this.ReloadHistory();
	// };
	
	// @action ClearTerpConfirmation = async () => {
	//
	// 	await this.gems.clearTerpConfirmation.Post({
	// 		jobId: this.job.jobId,
	// 		updateToken: this.updateToken,
	// 	});
	//
	// 	runInAction(() => {
	// 		this.job.terpConfirmed = '';
	// 	});
	//
	// 	await this.ReloadHistory();
	// };
	
	// @action ClearCompanyConfirmation = async () => {
	//
	// 	await this.gems.clearCompanyConfirmation.Post({
	// 		jobId: this.job.jobId,
	// 		updateToken: this.updateToken,
	// 	});
	//
	// 	runInAction(() => {
	// 		this.job.companyConfirmed = '';
	// 	});
	//
	// 	await this.ReloadHistory();
	// };
	
	// @computed get jobLocationChoices() {
	// 	if (!this.job || !this.job.jobId) return {};
	//
	// 	let choices = {};
	//
	// 	this.job.companyLocations.forEach(loc => {
	// 		choices[loc.locationId] = {
	// 			...loc,
	// 			label: `${loc.label} #${loc.locationId}`,
	// 			timeZone: loc.timeZone || 'America/Chicago',
	// 		};
	// 	});
	//
	// 	return choices;
	// }
	
	// @observable loadedLocation = {};
	//
	// @action LoadLocation = async (locationId) => {
	// 	if (!locationId) {
	// 		this.loadedLocation = null;
	// 		return;
	// 	}
	//
	// 	const [location, error] = await vow(
	// 		Jewels().location.GetLocation(locationId)
	// 	);
	//
	// 	if (error) throw new Error(error);
	// 	if (!location) throw new Error(`Can't find location: ${locationId}`);
	//
	// 	runInAction(() => {
	// 		this.loadedLocation = {
	// 			...location,
	// 			label: `${location.label} #${location.locationId}`,
	// 			timeZone: location.timeZone || 'America/Chicago',
	// 		};
	// 	});
	// };
	
	// @computed get jobLocation() {
	// 	if (!this.jobUpstate.locationId.value) return null;
	// 	return this.jobLocationChoices[this.jobUpstate.locationId.value] || this.loadedLocation;
	// }
	
	
	// @action LoadConflicts = async () => {
	// 	this.job.companyConflicts = [];
	// 	this.job.locationConflicts = [];
	// 	this.job.deafConflicts = {};
	// 	this.job.terpConflicts = [];
	//
	// 	if (!this.job.start) return;
	// 	if (!this.job.end) return;
	//
	// 	const startMs = thyme.nowMs();
	//
	// 	const start = thyme.fast.pack(this.job.start.minus({minutes: 15}));
	// 	const end = thyme.fast.pack(this.job.end.plus({minutes: 15}));
	//
	// 	const [_, error] = await vow([
	// 		this.LoadLocationConflicts(start, end),
	// 		this.LoadDeafConflicts(start, end),
	// 		this.LoadTerpConflicts(start, end),
	// 	]);
	//
	// 	if (error) throw error;
	//
	// 	const conflictsTime = thyme.nowMs() - startMs;
	// 	console.log(`LoadConflicts took: ${conflictsTime}ms`);
	// };
	
	// CanShowConflict = (job) => {
	// 	if (job.jobId == this.job.jobId) return false; // yes
	// 	if (job.billStatus.cancelled) return false;
	// 	if (Jewels().linked.CheckIfInSummary(job.jobId)) return false;
	//
	// 	return true;
	// };
	
	// CanShowConflictIgnoreLinked = (job) => {
	// 	if (job.jobId == this.job.jobId) return false; // yes
	// 	if (job.billStatus.cancelled) return false;
	// 	// if (Jewels().linked.CheckIfInSummary(job.jobId)) return false;
	//
	// 	return true;
	// };
	
	// @action LoadCompanyConflicts = async (start, end) => {
	// 	if (!this.job.companyId) return;
	//
	// 	const [conflicts, error] = await vow(
	// 		Jewels().jobs.GetJobsByConflict({
	// 			by: 'company',
	// 			companyId: this.job.companyId,
	// 			start: start,
	// 			end: end,
	// 		})
	// 	);
	//
	// 	runInAction(() => {
	// 		this.job.companyConflicts = conflicts.filter(this.CanShowConflict);
	// 	});
	// };
	
	// @action LoadLocationConflicts = async (start, end) => {
	// 	if (!this.job.locationId) return;
	// 	if (this.job.vri) return;
	//
	// 	const [conflicts, error] = await vow(
	// 		Jewels().jobs.GetJobsByConflict({
	// 			by: 'location',
	// 			locationId: this.job.locationId,
	// 			start: start,
	// 			end: end,
	// 		})
	// 	);
	//
	// 	runInAction(() => {
	// 		this.job.locationConflicts = conflicts.filter(this.CanShowConflict);
	// 	});
	// };
	
	// @action LoadDeafConflicts = async (start, end) => {
	// 	if (!this.job.deafIds || !this.job.deafIds.length) return;
	//
	// 	await vow(
	// 		this.job.deafIds.map(async (deafId) => {
	// 			const [conflicts, error] = await vow(
	// 				Jewels().jobs.GetJobsByConflict({
	// 					by: 'deaf',
	// 					deafId: deafId,
	// 					start: start,
	// 					end: end,
	// 				})
	// 			);
	//
	// 			runInAction(() => {
	// 				this.job.deafConflicts[deafId] = conflicts.filter(this.CanShowConflict);
	// 			});
	// 		})
	// 	);
	// };
	
	// @action LoadTerpConflicts = async (start, end) => {
	// 	if (!this.job.terpId) return;
	//
	// 	const [conflicts, error] = await vow(
	// 		Jewels().jobs.GetJobsByConflict({
	// 			by: 'terp',
	// 			terpId: this.job.terpId,
	// 			start: start,
	// 			end: end,
	// 		})
	// 	);
	//
	// 	runInAction(() => {
	// 		this.job.terpConflicts = conflicts.filter(this.CanShowConflictIgnoreLinked);
	// 	});
	// };
	
	// @observable currentDeafs = [];
	//
	// onCurrentDeafs = autorun(() => {
	// 	this.currentDeafs = this.jobUpstate.deafIds.value.map(deafId => (
	// 		this.job.companyDeafs[deafId]
	// 		|| {
	// 			deafId: deafId,
	// 			error: `Company missing deafId #${deafId}`,
	// 		}
	// 	));
	// });
	
	
	// @action GotoJobId = (entry) => {
	// 	if (!entry) return;
	//
	// 	const router = Router();
	//
	// 	const jobIds = entry.match(splitToNumbers);
	//
	// 	if (jobIds.length === 0) return;
	//
	// 	if (jobIds.length === 1) {
	// 		return router.Navigate(
	// 			router.routes.job,
	// 			{
	// 				jobId: jobIds[0],
	// 				tab: (router.currentRoute || {}).key === 'job' ? router.params.tab : 'details',
	// 			},
	// 		);
	// 	}
	//
	// 	return router.Navigate(router.routes.jobList, null, {jobIds: jobIds});
	// };
	
	
	// @action NavShiftJobId = (shift) => {
	// 	const router = Router();
	//
	// 	const current = parseInt(router.params.jobId);
	// 	if (!current) return;
	//
	// 	return router.Navigate(
	// 		router.routes.job,
	// 		{
	// 			jobId: current + shift,
	// 			tab: router.params.tab,
	// 		}
	// 	);
	// };
	
	
	// @action ToggleShowCalendar = () => this.showCalendar = !this.showCalendar;
	// @action SetDateFromCalendar = (value) => this.jobUpstate.date.Change(thyme.fromSdt(value));
// }

const splitToNumbers = /\d+/g;
//
// const STATUS_CHOICES_DEPRECATED_OLD = {
// 	1: {value: 1, label: 'Pending'},
// 	2: {value: 2, label: 'Filled'},
// 	3: {value: 3, label: 'SEARCHING'},
// 	4: {value: 4, label: 'Paid'},
// 	5: {value: 5, label: 'BIDDING'},
// 	6: {value: 6, label: 'FOLLOW UP'},
// 	7: {value: 7, label: 'Created by Company'},
// 	8: {value: 8, label: 'Updated by Contact'},
// 	9: {value: 9, label: 'Cancelled'},
// 	10: {value: 10, label: 'SUBSTITUTE'},
// };
