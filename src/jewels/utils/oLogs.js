import RequestGem_DEPRECATED from '../../Bridge/jewelerClient/RequestGem_DEPRECATED';
import {action} from 'mobx';
import {BaseJewel} from '../BaseJewel';

export default class oLogs extends BaseJewel {
	
	gems = {
		byDate: new RequestGem_DEPRECATED({}),
		// byKey: new RequestGem_DEPRECATED({}),
	};
	
	@action RequestLogsByDate = async (date) => {
		const result =
			await this.gems.byDate.Request(date);
		
		return result.jsonArray
			.map(j => `${j.timestamp ? j.timestamp.replace('+00:00', '____') : ''} ${j.text}`)
			.join('\n');
	}
}