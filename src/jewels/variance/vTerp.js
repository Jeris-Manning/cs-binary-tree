import {action, computed, observable, runInAction} from 'mobx';
import {Jewels, Staches} from 'stores/RootStore';
import {Loader} from '../../Bridge/misc/Loader';
import {vow} from '../../Bridge/misc/$j';
import {TerpUpdata} from '../../datum/TerpUpdata';
import {BaseJewel} from '../BaseJewel';

export class vTerp extends BaseJewel {
	
	_GetTerp = (terpId) => Jewels().oTerp.GetTerp(terpId);
	_SaveTerp = (terpId, changes) => Jewels().oTerp.SaveTerp(terpId, changes);
	_GetSchedule = (terpId) => Jewels().oTerpSched.GetTerpSchedule(terpId);
	_GetScheduleNotes = (terpId) => Jewels().oTerpSched.GetBusyTimeFor(terpId);
	
	@observable terpId = 0;
	@observable terpLoader = new Loader();
	@observable error = '';
	@observable updata = new TerpUpdata({});
	@observable photo = {}; // TODO refactor
	
	
	@action Load = async (terpId) => {
		if (terpId === 'overview') return;
		
		this.terpLoader.Start();
		this.terpId = terpId;
		this.error = '';
		
		console.log(`vTerp: loading ${terpId}`);
		
		const [[terp], error] = await vow([
			this._GetTerp(terpId),
			// TODO make better:
			Jewels().credentials.LoadTerp(terpId),
			Jewels().terpChecklist.LoadChecklist(terpId),
		]);
		
		console.log(`vTerp: result ${terpId}`, terp);
		
		runInAction(() => {
			if (error) {
				this.error = JSON.stringify(error);
				this.terpLoader.Error(error);
				return;
			}
			
			this.updata = new TerpUpdata(terp);
			this.photo = terp.photo;
			
			this.terpLoader.Done();
		});
		
		this.LoadSchedule(terpId).then();
	};
	
	@computed get canSave() {
		if (!this.updata.terpId.value) return false;
		if (this.terpLoader.isLoading) return false;
		return this.updata.hasChanged;
	}
	
	@action Save = async () => {
		if (!this.canSave) return;
		
		// this.terpLoader.Start();
		this.error = '';
		
		const changes = this.updata.GetChanges();
		
		const [_, error] = await vow(
			this._SaveTerp(this.terpId, changes),
		);
		
		if (error) {
			this.error = JSON.stringify(error);
			this.terpLoader.Error(error);
			return;
		}
		
		this.updata.Apply();
		// this.terpLoader.Done();
	};
	
	@action Revert = () => this.updata.Revert();
	
	@computed get saveTooltip() {
		return ''; // TODO
	}
	
	
	/* SCHEDULE */
	// TODO remake
	
	@observable schedule = {};
	@observable scheduleNotes = [];
	
	@action LoadSchedule = async (terpId) => {
		this.schedule = {};
		this.scheduleNotes = [];
		
		const [[schedule, scheduleNotes], error] = await vow([
			this._GetSchedule(terpId),
			this._GetScheduleNotes(terpId),
		]);
		
		for (const entry of scheduleNotes) {
			entry.situation = `#${entry.comment}`;
		}
		
		
		runInAction(() => {
			this.schedule = schedule;
			this.scheduleNotes = scheduleNotes;
		});
	};
}