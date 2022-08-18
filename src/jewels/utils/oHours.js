import {action, observable, runInAction} from 'mobx';
import PostGem_DEPRECATED from '../../Bridge/jewelerClient/PostGem_DEPRECATED';
import RequestGem_DEPRECATED from '../../Bridge/jewelerClient/RequestGem_DEPRECATED';
import thyme from '../../Bridge/thyme';
import {BaseJewel} from '../BaseJewel';
import {vow} from '../../Bridge/misc/$j';
import {WiseGem} from '../../Bridge/jewelerClient/WiseGem';

export default class oHours extends BaseJewel {
	
	gems = {
		getHours: new WiseGem(),
		getSpecial: new WiseGem(),
		setSpecial: new PostGem_DEPRECATED({}),
	};
	
	@observable status = '?';
	@observable start = {};
	@observable end = {};
	@observable reason = '';
	@observable special = {};
	
	@action LoadHours = async () => {
		// const override = thyme.toFastJson(thyme.fromIso(
		// 	'2019-05-20T19:00'
		// ));
		
		const params = {
			// override: override,
		};
		
		const [[hoursResult, specialResult], error] = await vow([
			this.gems.getHours.Get(params),
			this.gems.getSpecial.Get(),
		]);
		
		if (error) throw new Error(error);
		
		runInAction(() => {
			this.status = hoursResult.open ? 'open' : 'closed';
			this.start = thyme.fromIso(hoursResult.start);
			this.end = thyme.fromIso(hoursResult.end);
			this.reason = hoursResult.reason;
			
			this.special = specialResult;
		});
	};
	
	@action SetSpecial = async (params) => {
		console.log(`set special`, params);
		await this.gems.setSpecial.Post(params);
		return this.LoadHours();
	};
	
}