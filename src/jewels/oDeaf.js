import {WiseGem} from '../Bridge/jewelerClient/WiseGem';
import {vow} from '../Bridge/misc/$j';
import thyme from '../Bridge/thyme';
import {BaseJewel} from './BaseJewel';

export class oDeaf extends BaseJewel {
	gems = {
		getDeaf: new WiseGem('deafId'),
		saveDeaf: new WiseGem('deafId'),
		addDeafToCompany: new WiseGem('deafId'),
		getMrnByCompanyRecordId: new WiseGem('companyRecordId'),
		getRecentTerps: new WiseGem('deafId'),
	};
	
	GetDeaf = async (deafId) => {
		const [deaf, error] = await vow(
			this.gems.getDeaf.Get({deafId: deafId})
		);
		
		if (error) throw new Error(error);
		if (!deaf) throw new Error(`Deaf ${deafId} doesn't exist`);
		
		return thyme.fast.obj.unpack(deaf);
	};
	
	SaveDeaf = async (deafId, changes) => {
		console.log(`oDeaf.SaveDeaf ${deafId}`, changes);
		
		const [_, error] = await vow(
			this.gems.saveDeaf.Post({
				deafId: deafId,
				changes: changes,
			})
		);
		
		if (error) throw new Error(error);
	};
	
	GetMrnByCompanyRecordId = async (companyRecordId) => {
		const [result, error] = await vow(
			this.gems.getMrnByCompanyRecordId.Get({companyRecordId: companyRecordId})
		);
		if (error) throw new Error(error);
		return result;
	};
	
	GetRecentTerps = async (deafId) => {
		const [result, error] = await vow(
			this.gems.getRecentTerps.Get({deafId: deafId})
		);
		if (error) throw new Error(error);
		return result;
	};
	
	
	SaveDeafEdit = async (deafId, changes, addToCompanyId) => {
		const [resultDeafId, error] = await vow(
			this.gems.saveDeaf.Post({
				deafId: deafId,
				changes: changes,
				addToCompanyId: addToCompanyId,
			})
		);
		
		if (error) throw new Error(error);
		return resultDeafId; // same or new ID (if created)
	}
}

/** NOTE: patrick has the labels for General/Medical swapped in the database T_T */
// export const PREF_TYPE = {
// 	1: 'general',
// 	2: 'business',
// 	3: 'medical',
// 	4: 'educational',
// 	5: 'no',
// };