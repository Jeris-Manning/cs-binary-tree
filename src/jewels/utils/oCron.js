import RequestGem_DEPRECATED from '../../Bridge/jewelerClient/RequestGem_DEPRECATED';
import PostGem_DEPRECATED from '../../Bridge/jewelerClient/PostGem_DEPRECATED';
import {action, observable, runInAction} from 'mobx';
import thyme from '../../Bridge/thyme';
import $j from '../../Bridge/misc/$j';
import {BaseJewel} from '../BaseJewel';

export default class oCron extends BaseJewel {
	
	gems = {
		getCrons: new RequestGem_DEPRECATED({}),
		reload: new PostGem_DEPRECATED(),
		run: new PostGem_DEPRECATED(),
	};
	
	@observable loadedAt = '';
	@observable crons = [];
	
	@action Load = async () => {
		const result =
			await this.gems.getCrons.Request();
		
		runInAction(() => {
			this.loadedAt = thyme.fromJson(result.loadedAt);
			this.crons = result.crons.sort($j.sort.default('id'));
			this.crons.forEach(cron => {
				cron.lastRanAt = thyme.fromJson(cron.lastRanAt);
				cron.ForceRun = () => this.ForceRun(cron.id);
			});
		});
	};
	
	@action ForceReload = async () => {
		await this.gems.reload.Post();
		return this.Load();
	};
	
	@action ForceRun = async (cronId) => {
		await this.gems.run.Post({
			cronId: cronId,
		});
		return this.Load();
	};
}