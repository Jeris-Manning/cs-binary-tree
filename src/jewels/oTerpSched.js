import {action, computed, observable, runInAction} from 'mobx';
import Formula from '../Bridge/Bricks/Formula/Formula';
import Fieldula from '../Bridge/Bricks/Formula/Fieldula';
import PostGem_DEPRECATED from '../Bridge/jewelerClient/PostGem_DEPRECATED';
import GetGem_DEPRECATED from '../Bridge/jewelerClient/GetGem_DEPRECATED';
import $j, {vow} from '../Bridge/misc/$j';
import {Jewels, Staches} from '../stores/RootStore';
import {WiseGem} from '../Bridge/jewelerClient/WiseGem';
import thyme from '../Bridge/thyme';
import {BaseJewel} from './BaseJewel';

export class oTerpSched extends BaseJewel {
	gems = {
		// this is used for 1 terp:
		//      qTerp.GetBasics         use stache instead
		//      qTerp.GetPhotoUrl       use stache instead
		//
		//      GetGigs
		//          maybe there should be a stache for terp jobIds? based on date or what? seems too much
		//      at least use
		// getOverview: new GetGem_DEPRECATED(),
		
		
		getTerpLists: new WiseGem(),
		saveTerpList: new WiseGem(),
		getTerpSchedule: new WiseGem('terpId'),
		addBusyTime: new WiseGem(),
		removeBusyTime: new WiseGem(),
		getAllBusyTimes: new WiseGem(),
		getBusyTimeFor: new WiseGem('terpId'),
	};
	
	GetTerpLists = async () => {
		const [result, error] = await vow(
			this.gems.getTerpLists.Get()
		);
		
		if (error) throw new Error(error);
		return result;
	};
	
	SaveTerpList = async (regionKey, terpIds = []) => {
		const [result, error] = await vow(
			this.gems.saveTerpList.Post({
				regionKey: regionKey,
				terpIds: terpIds,
			})
		);
		
		if (error) throw new Error(error);
		return result;
	};
	
	GetTerpSchedule = async (terpId) => {
		const [result, error] = await vow(
			this.gems.getTerpSchedule.Get({
				terpId: terpId,
			})
		);
		
		if (error) throw new Error(error);
		return result;
	};
	
	AddBusyTime = async (busyTimeObj) => {
		const [result, error] = await vow(
			this.gems.addBusyTime.Post(busyTimeObj)
		);
		
		if (error) throw new Error(error);
		return result;
	};
	
	RemoveBusyTime = async (terpBusyId) => {
		const [result, error] = await vow(
			this.gems.removeBusyTime.Post({
				terpBusyId: terpBusyId
			})
		);
		
		if (error) throw new Error(error);
		return result;
	};
	
	GetAllBusyTimes = async () => {
		const [result, error] = await vow(
			this.gems.getAllBusyTimes.Get()
		);
		
		if (error) throw new Error(error);
		Object.values(result).forEach(thyme.fast.obj.unpack);
		return result;
	};
	
	GetBusyTimeFor = async (terpId) => {
		const [result, error] = await vow(
			this.gems.getBusyTimeFor.Get({
				terpId: terpId,
			})
		);
		
		if (error) throw new Error(error);
		return result;
	};
	
}