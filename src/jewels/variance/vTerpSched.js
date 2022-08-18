import {action, computed, observable, runInAction} from 'mobx';
import $j from '../../Bridge/misc/$j';
import Formula from '../../Bridge/Bricks/Formula/Formula';
import Fieldula from '../../Bridge/Bricks/Formula/Fieldula';
import thyme from '../../Bridge/thyme';
import {Jewels} from '../../stores/RootStore';
import {BaseJewel} from '../BaseJewel';


export class vTerpSched extends BaseJewel {
	
	_GetTerpLists = () => Jewels().oTerpSched.GetTerpLists();
	_SaveTerpList = (regionKey, terpIds) => Jewels().oTerpSched.SaveTerpList(regionKey, terpIds);
	_GetTerpSchedule = (terpId) => Jewels().oTerpSched.GetTerpSchedule(terpId);
	_AddBusyTime = (busyTimeObj) => Jewels().oTerpSched.AddBusyTime(busyTimeObj);
	_RemoveBusyTime = (terpBusyId) => Jewels().oTerpSched.RemoveBusyTime(terpBusyId);
	_GetAllBusyTimes = () => Jewels().oTerpSched.GetAllBusyTimes();
	_GetBusyTimeFor = (terpId) => Jewels().oTerpSched.GetBusyTimeFor(terpId);
	
	
	@observable isLoadingLists = false;
	@observable isLoadingListTerps = false;
	@observable selectedRegion = '';
	@observable regionListLup = {};
	@observable terpScheduleLup = {};
	@observable busyTimesLup = {};
	
	
	@action EnterTerpSchedPage = async (region) => {
		this.selectedRegion = region;
		
		await Promise.all([
			this.LoadLists(),
			this.LoadBusyTimes(),
		]);
		
		await this.LoadListTerps(region);
	};
	
	@action ParamsChangeTerpSchedPage = async (region) => {
		await this.LoadListTerps(region);
	}
	
	@action LoadLists = async () => {
		this.isLoadingLists = true;
		
		const results =
			await this._GetTerpLists();
		
		runInAction(() => {
			this.regionListLup = $j.convertToLookup(results, 'label', r => r.terpIds);
			this.isLoadingLists = false;
		});
	};
	
	@action LoadBusyTimes = async () => {
		const busyTimeRows =
			await this._GetAllBusyTimes();
		
		let busyTimesLup = {};
		
		for (const row of busyTimeRows) {
			const terpKey = String(row.terpId);
			
			let times = busyTimesLup[terpKey];
			if (!times) {
				times = [];
				busyTimesLup[terpKey] = times;
			}
			row.situation = `#${row.comment}`;
			times.push(row);
		}
		
		runInAction(() => {
			this.busyTimesLup = busyTimesLup;
			console.log(`LoadBusyTimes = `, busyTimeRows);
		});
	};
	
	@action LoadListTerp = async (terpId) => {
		const result =
			await this._GetTerpSchedule(terpId);
		
		runInAction(() => {
			this.terpScheduleLup[terpId] = result;
		});
	};
	
	@action LoadListTerps = async (region) => {
		this.isLoadingListTerps = true;
		
		const terpIds = this.regionListLup[region] || [];
		this.terpListForm.fields.terpIds.value = terpIds.join(', ');
		
		await Promise.all(
			terpIds.map(this.LoadListTerp)
		);
		
		runInAction(() => this.isLoadingListTerps = false);
	};
	
	@observable terpListForm = new Formula({
		fields: {
			terpIds: new Fieldula({
				label: 'Terp IDs',
				description: 'Must be separated by a comma, for example: <br/>3, 55, 103, 200',
			})
		}
	});
	
	@action PostListChange = async () => {
		const str = this.terpListForm.fields.terpIds.value;
		const mapped = str.split(',').map(s => parseInt(s));
		
		await this._SaveTerpList({
			key: this.selectedRegion,
			terpIds: mapped,
		});
		
		return this.EnterTerpSchedPage(this.selectedRegion);
	};
	
	
	
	/* BUSY MODAL */
	
	@observable busyForm = new Formula({
		fields: {
			date: new Fieldula({
				label: 'Date',
				required: true,
				type: 'date',
			}),
			start: new Fieldula({
				label: 'Time Start',
				required: true,
				type: 'time',
			}),
			duration: new Fieldula({
				label: 'Duration (hours)',
				required: true,
			}),
			comment: new Fieldula({
				label: 'Comment',
				required: true,
			}),
		}
	});
	
	
	@observable formTerpId = '';
	@observable formTerpName = '';
	@observable busyModalActive = false;
	
	@action OpenBusyModal = (terpId, terpName) => {
		this.formTerpId = terpId;
		this.formTerpName = terpName;
		this.busyModalActive = true;
	};
	@action CloseBusyModal = () => this.busyModalActive = false;
	
	@computed get canSubmit() {
		return this.busyForm.fields.date.value
			&& this.busyForm.fields.start.value
			&& this.busyForm.fields.duration.value
			&& this.busyForm.fields.comment.value;
	}
	
	@action SubmitBusy = async () => {
		if (!this.canSubmit) return;
		
		const start = thyme.fromInputs(this.busyForm.fields.date.value, this.busyForm.fields.start.value);
		const end = start.plus({hours: parseFloat(this.busyForm.fields.duration.value)});
		
		// console.log(`Submitting terp busy: ${start} +${this.busyForm.duration.value} = ${end}`);
		
		await this._AddBusyTime({
			terpId: this.formTerpId,
			start: thyme.toFastJson(start),
			end: thyme.toFastJson(end),
			comment: this.busyForm.fields.comment.value,
		});
		
		this.CloseBusyModal();
		
		await this.LoadBusyTimes();
		
	};
	
	@action RemoveBusy = async (terpBusyId) => {
		await this._RemoveBusyTime(terpBusyId);
		
		await this.LoadBusyTimes();
	};
}