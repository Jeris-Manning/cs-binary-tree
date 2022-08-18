import RequestGem_DEPRECATED from '../../Bridge/jewelerClient/RequestGem_DEPRECATED';
import {action, computed} from 'mobx';
import thyme from '../../Bridge/thyme';

export default class oCompanyJobs {
	
	gems = {
		count: new RequestGem_DEPRECATED({})
	};
	
	@action Load = async () => {
		return await this.gems.count.Request();
	};
	
	@computed get count() {
		return this.gems.count.value || [];
	}
	
	@computed get range() {
		if (this.gems.count.meta.start && this.gems.count.meta.end) {
			return {
				start: thyme.fromFastJson(this.gems.count.meta.start),
				end: thyme.fromFastJson(this.gems.count.meta.end),
			}
		}
		return null;
	}
}