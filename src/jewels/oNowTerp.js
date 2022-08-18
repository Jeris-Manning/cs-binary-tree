import {action, computed} from 'mobx';
import RequestGem_DEPRECATED from '../Bridge/jewelerClient/RequestGem_DEPRECATED';
import $j from '../Bridge/misc/$j';
import thyme from '../Bridge/thyme';
import {WiseGem} from '../Bridge/jewelerClient/WiseGem';
import {BaseJewel} from './BaseJewel';

export default class oNowTerp extends BaseJewel {
	
	gems = {
		shifts: new RequestGem_DEPRECATED({
			processItem: shift => {
				shift.terpName = `${shift.firstName} ${shift.lastName}`;
				return shift;
			}
		}),
		
		getShiftsAt: new WiseGem(),
		
	};
	
	@action Enter = async () => {
		console.log(`get bids`);
		return this.gems.shifts.Request();
	};
	
	@computed get isWaiting() {
		$j.any(this.gems, g => g.isWaiting);
	}
	
	@computed get shifts() {
		return this.gems.shifts.array.filter(s => !s.isDeleted).sort(thyme.sorter('start'));
	}
	
	GetShifts = async (start, end) => {
		return this.gems.getShiftsAt.Get({
			start: thyme.fast.pack(start),
			end: thyme.fast.pack(end),
		});
	}
}