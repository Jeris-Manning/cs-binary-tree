import {computed} from 'mobx';
import type {TerpKey} from '../../datum/stache/TerpDat';
import {TerpDat} from '../../datum/stache/TerpDat';
import {Staches} from '../../stores/RootStore';
import {TERP_LISTS} from '../../datum/stache/TerpListDat';
import {TerpDemandsDat} from '../../datum/stache/TerpDemandsDat';
import {BaseJewel} from '../BaseJewel';

export class vTerpLists extends BaseJewel {
	
	@computed get allTerpDats(): TerpDat[] {
		const listClutch = Staches().cTerpList.GetOrStub(TERP_LISTS.all);
		const datKeys = listClutch.dat.datKeys;
		const terpClutches = Staches().cTerp.GetMulti(datKeys, true, 'vTerpLists.allTerpDats') || [];
		return terpClutches.map(c => c.dat);
	}
	
	@computed get activeTerpKeys(): TerpKey[] {
		const listClutch = Staches().cTerpList.GetOrStub(TERP_LISTS.active, true, 'vTerpLists.activeTerpKeys');
		return listClutch.dat.datKeys;
	}
	
	@computed get activeTerpDats(): TerpDat[] {
		const terpKeys = this.activeTerpKeys;
		const terpClutches = Staches().cTerp.GetMulti(terpKeys, true, 'vTerpLists.activeTerpDats') || [];
		return terpClutches.map(c => c.dat);
	}
	
	
	@computed get internTerpDats(): TerpDat[] {
		const listClutch = Staches().cTerpList.GetOrStub(TERP_LISTS.intern);
		const datKeys = listClutch.dat.datKeys;
		const terpClutches = Staches().cTerp.GetMulti(datKeys, true, 'vTerpLists.internTerpDats') || [];
		return terpClutches.map(c => c.dat);
	}
}