import {action, computed, observable} from 'mobx';
import RequestGem_DEPRECATED from '../../Bridge/jewelerClient/RequestGem_DEPRECATED';
import thyme from '../../Bridge/thyme';
import {Router} from '../../stores/RootStore';

export default class oDash {
	
	gems = {
		settings: new RequestGem_DEPRECATED({}),
		fillVelocity: new RequestGem_DEPRECATED({}),
		nowTerp: new RequestGem_DEPRECATED({}),
		stats: new RequestGem_DEPRECATED({}),
	};
	
	@action OnEnter = () => {
		Router().routes.SetHiddenMenu(true);
		return this.Refresh();
	};
	
	@action OnExit = () => {
		Router().routes.SetHiddenMenu(false);
	};
	
	@observable isRefreshing = false;
	
	@action Refresh = async () => {
		if (this.isRefreshing) return;
		LOG(`refreshing`);
		this.isRefreshing = true;
		
		const settings =
			await this.gems.settings.Request();
		
		await Promise.all([
			this.gems.fillVelocity.Request(),
			this.gems.nowTerp.Request(),
			this.gems.stats.Request(),
		]);
		
		this.AfterRefresh(settings);
	};
	
	@observable settings = {};
	
	@action AfterRefresh = (settings) => {
		this.isRefreshing = false;
		this.settings = settings;
		LOG(`done refreshing, loaded settings: ${Object.keys(this.settings).length}`);
		
		if (!this.settings.general) return;
		
		const interval = parseInt(this.settings.general.interval);
		
		setTimeout(this.Refresh, interval * 1000);
		LOG(`setting interval: ${interval * 1000}`);
	};
	
	
	@computed get fillVelocity() {
		if (!this.settings.fillVelocity) return {};
		// LOGO(`fillVelocity settings`, this.settings.fillVelocity);
		// LOGO(`fillVelocity value`, this.gems.fillVelocity.value);
		
		return {
			max: this.settings.fillVelocity.max,
			current: this.gems.fillVelocity.value.current,
		};
	}
	
	@computed get nowTerp() {
		const today = thyme.today();
		const tomorrow = today.plus({day: 1});
		LOGO(`nowTerp value`, this.gems.nowTerp.value);
		
		return {
			today: this.gems.nowTerp.array
				.filter(s => thyme.isSameDay(s.start, today))
				.sort(thyme.sorter('start')),
			tomorrow: this.gems.nowTerp.array
				.filter(s => thyme.isSameDay(s.start, tomorrow))
				.sort(thyme.sorter('start')),
		};
	}
	
	@computed get stats() {
		return {
			...this.gems.stats.value,
		};
	}
}


const LOG = (str) => console.log('📺  ' + str);
const LOGO = (str, obj) => console.log('📺  ' + str, obj);