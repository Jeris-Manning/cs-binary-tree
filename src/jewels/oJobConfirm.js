import {vow} from '../Bridge/misc/$j';
import {WiseGem} from '../Bridge/jewelerClient/WiseGem';
import {BaseJewel} from './BaseJewel';
import type {JobId} from '../datum/stache/JobDat';
import {DynamicEmail} from '../datum/DynamicEmail';

export type T_CompanyConfirm_Params = {
	jobId: JobId,
	sendEmail: boolean,
	dynamicEmail: DynamicEmail,
}

export type T_TerpConfirm_Params = {
	jobId: JobId,
	sendEmail: boolean,
	dynamicEmail: DynamicEmail,
	notification: {},
	terpId: TerpId,
}

export type T_InternConfirm_Params = {
	jobId: JobId,
	sendEmail: boolean,
	dynamicEmail: DynamicEmail,
}

export type T_ClearConfirm_Params = {
	jobId: JobId,
	clearCompany: boolean,
	clearTerp: boolean,
	clearIntern: boolean,
}

export type T_CompanyConfirmPrinted_Params = {
	jobId: JobId,
}

export class oJobConfirm extends BaseJewel {
	gems = {
		companyConfirm: new WiseGem('jobId'),
		terpConfirm: new WiseGem('jobId'),
		internConfirm: new WiseGem('jobId'),
		clearConfirm: new WiseGem('jobId'),
		companyConfirmPrinted: new WiseGem('jobId'),
	};
	
	CompanyConfirm = async (params: T_CompanyConfirm_Params) => {
		const promise = this.gems.companyConfirm.Post(params);
		const [_, error] = await vow(promise);
		if (error) throw new Error(error);
	}
	
	TerpConfirm = async (params: T_TerpConfirm_Params) => {
		const promise = this.gems.terpConfirm.Post(params);
		const [_, error] = await vow(promise);
		if (error) throw new Error(error);
	}
	
	InternConfirm = async (params: T_InternConfirm_Params) => {
		const promise = this.gems.internConfirm.Post(params);
		const [_, error] = await vow(promise);
		if (error) throw new Error(error);
	}
	
	ClearConfirm = async (params: T_ClearConfirm_Params) => {
		const promise = this.gems.clearConfirm.Post(params);
		const [_, error] = await vow(promise);
		if (error) throw new Error(error);
	}
	
	CompanyConfirmPrinted = async (params: T_CompanyConfirmPrinted_Params) => {
		const promise = this.gems.companyConfirmPrinted.Post(params);
		const [_, error] = await vow(promise);
		if (error) throw new Error(error);
	}
}