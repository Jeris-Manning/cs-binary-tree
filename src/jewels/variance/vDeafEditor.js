import {action, computed, observable, runInAction} from 'mobx';
import {DeafDat} from '../../datum/stache/DeafDat';
import {Jewels, Staches} from '../../stores/RootStore';
import {DeafUpdata} from '../../datum/DeafUpdata';
import type {DeafListName} from '../../datum/stache/DeafListDat';
import {UpType} from '../../Bridge/misc/UpType';
import type {DeafKey} from '../../datum/stache/DeafDat';
import {Clutch} from '../../Bridge/DockClient/Stache';
import type {SelectorChoice} from '../../Bridge/misc/SelectorField';
import {vow} from '../../Bridge/misc/$j';
import {BaseJewel} from '../BaseJewel';


export class vDeafEditor extends BaseJewel {
	_SaveDeaf = (deafId, changes, addToCompanyId) => Jewels().oDeaf.SaveDeafEdit(deafId, changes, addToCompanyId);
	
	@observable isVisible: boolean = false;
	@observable selectedDeaf = UpType.Enum({key: 'selectedDeaf'});
	@observable deafClutch: Clutch<DeafDat>;
	@computed get deafDat() {return this.deafClutch.dat;}
	@observable deafUp: DeafUpdata;
	@observable companyId;
	afterSave: (deafKey: DeafKey) => {};
	
	@computed get isNew() { return !this.selectedDeaf.value;}
	
	@action StartEdit = (deafKey: DeafKey, companyId, afterSave) => {
		this.companyId = companyId;
		this.afterSave = afterSave;
		this.selectedDeaf.Change(deafKey);
		this.deafClutch = Staches().cDeaf.GetOrStub(deafKey, true);
		this.deafUp = new DeafUpdata(this.deafDat, this.deafClutch);
		this.isVisible = true;
	};
	
	// @action StartNew = (companyId, afterSave) => {
	// 	this.companyId = companyId;
	// 	this.afterSave = afterSave;
	// 	this.selectedDeaf.Change(null);
	// 	this.deafClutch = Staches().cDeaf.GetOrStub(null, true);
	// 	this.deafUp = new DeafUpdata();
	// 	this.isVisible = true;
	// };
	
	@action ChangeDeafEditExisting = (choice: SelectorChoice|null) => this.StartEdit(
		choice.key,
		this.companyId,
		this.afterSave
	);
	
	@action ChangeDeafEditNew = () => this.StartEdit(
		null,
		this.companyId,
		this.afterSave
	);
	
	
	@action HideEditor = () => this.isVisible = false;
	
	
	@action SaveDeafEditor = async (): DeafKey => {
		const changes = this.deafUp.GetChanges();
		
		const [deafKey, error] = await vow(
			this._SaveDeaf(this.selectedDeaf.value, changes, this.companyId)
		);
		
		if (this.afterSave) await this.afterSave(deafKey);
		
		runInAction(() => {
			this.isVisible = false;
		});
		
		return deafKey;
	};
}