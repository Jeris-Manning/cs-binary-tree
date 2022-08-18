import {WiseGem} from '../../Bridge/jewelerClient/WiseGem';
import {BaseJewel} from '../BaseJewel';

export default class oSqlMaint extends BaseJewel {
	
	gems = {
		run1: new WiseGem(),
		run2: new WiseGem(),
	};
}