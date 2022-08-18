import {computed} from 'mobx';
import {DeafDat} from '../../datum/stache/DeafDat';
import {Staches} from '../../stores/RootStore';
import {DEAF_LISTS} from '../../datum/stache/DeafListDat';
import type {DeafListName} from '../../datum/stache/DeafListDat';
import {BaseJewel} from '../BaseJewel';

export class vDeafLists extends BaseJewel {
	
	// @computed get allDeafDats(): DeafDat[] {
	// 	const listClutch = Staches().cDeafList.GetOrStub(DEAF_LISTS.all);
	// 	const datKeys = listClutch.dat.datKeys;
	// 	const terpClutches = Staches().cDeaf.GetMulti(datKeys) || [];
	// 	return terpClutches.map(c => c.dat);
	// }
	//
	// @computed get activeDeafDats(): DeafDat[] {
	// 	const listClutch = Staches().cDeafList.GetOrStub(DEAF_LISTS.active);
	// 	const datKeys = listClutch.dat.datKeys;
	// 	const terpClutches = Staches().cDeaf.GetMulti(datKeys) || [];
	// 	return terpClutches.map(c => c.dat);
	// }
	
	@computed get activeDeafNames(): DeafListName[] {
		const listClutch = Staches().cDeafList.GetOrStub(DEAF_LISTS.activeNames);
		return listClutch.dat.datVals;
	}
	
}