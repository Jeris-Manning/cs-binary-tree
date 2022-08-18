import GetGem_DEPRECATED from '../Bridge/jewelerClient/GetGem_DEPRECATED';
import {action, observable, runInAction} from 'mobx';
import {BaseJewel} from './BaseJewel';

export class oBilling extends BaseJewel {
	gems = {
		getBillTypes: new GetGem_DEPRECATED(),
	};
	
	@observable billTypes;
	
	@action LoadBillTypes = async () => {
		const billTypes =
			await this.gems.getBillTypes.Request();
		
		runInAction(() => {
			this.billTypes = billTypes;
		});
		
		return this.billTypes;
	};
	
	GetBillTypeEntry = (billTypeId) => {
		if (!billTypeId) return '';
		if (!this.billTypes) {
			console.warn(`BillTypes not loaded!`);
			return null;
		}
		const entry = this.billTypes[billTypeId];
		if (!entry) {
			console.warn(`Unknown BillTypeId: ${billTypeId}`);
		}
		return entry;
	};
	
	GetBillTypeLabel = (billTypeId) => {
		const entry = this.GetBillTypeEntry(billTypeId);
		return entry ? entry.qbName : '???';
	};
	
	GetBillTypeId = (qbName) => {
		if (!qbName) return 0;
		if (!this.billTypes) {
			console.warn(`BillTypes not loaded!`);
			return qbName;
		}
		const result = Object.values(this.billTypes).find(b => b.qbName === qbName);
		return result ? result.billTypeId : 0;
	};
	
	GetEntryFromLabel = (label) => this.GetBillTypeEntry(this.GetBillTypeId(label));
	
	IsLabelCancelled = (label, ifCantFind = false) => {
		const entry = this.GetEntryFromLabel(label);
		if (!entry) return ifCantFind;
		return entry.cancelled;
	}
	
	IsBillTypeIdCancelled = (billTypeId) => {
		return this.billTypes[billTypeId].cancelled;
	}
}

/*

	billTypeId: {
		billTypeId: 'id',
		qbName: 'qb_name',
		filled: 'filled',
		billed: 'billed',
		cancelled: 'cancelled',
		vri: 'vri',
	}

*/