import {action} from 'mobx';
import GetGem_DEPRECATED from '../../Bridge/jewelerClient/GetGem_DEPRECATED';
import thyme from '../../Bridge/thyme';

// TODO: remove/update this
export class oJobLists {
	gems = {
		getAllJobs: new GetGem_DEPRECATED(),
	};
	
	@action GetAllJobs = async (startDt, endDt) => {
		console.log(`GetAllJobs: ${startDt}, ${endDt}`);
		return this.gems.getAllJobs.Request({
			rangeStart: thyme.toFastJson(startDt),
			rangeEnd: thyme.toFastJson(endDt),
		});
	};
}