import {action, runInAction} from 'mobx';
import {JobRef} from '../../pages/Job/JobUpdate/JobRef';
import {BaseJewel} from '../BaseJewel';
import {Jewels} from '../../stores/RootStore';
import {vow} from '../../Bridge/misc/$j';
import {MakeConfirmEmail} from '../../datum/DynamicEmail';
import type {
	T_ClearConfirm_Params,
	T_CompanyConfirm_Params,
	T_CompanyConfirmPrinted_Params, T_InternConfirm_Params,
	T_TerpConfirm_Params
} from '../oJobConfirm';
import thyme from '../../Bridge/thyme';

export class vJobConfirm extends BaseJewel {
	
	ToLog = (msg) => `vJobConfirm |  ${msg}`;
	
	_CompanyConfirm = (params: T_CompanyConfirm_Params) => Jewels().oJobConfirm.CompanyConfirm(params);
	_TerpConfirm = (params: T_TerpConfirm_Params) => Jewels().oJobConfirm.TerpConfirm(params);
	_InternConfirm = (params: T_InternConfirm_Params) => Jewels().oJobConfirm.InternConfirm(params);
	_ClearConfirm = (params: T_ClearConfirm_Params) => Jewels().oJobConfirm.ClearConfirm(params);
	_CompanyConfirmPrinted = (params: T_CompanyConfirmPrinted_Params) => Jewels().oJobConfirm.CompanyConfirmPrinted(params);
	
	
	@action SendCompanyConfirmation = async (jobRef: JobRef, emails, sendEmail = true) => {
		let params: T_CompanyConfirm_Params = {};
		params.jobId = jobRef.jobId;
		
		if (sendEmail) {
			params.sendEmail = true;
			params.dynamicEmail = MakeConfirmEmail(jobRef, emails, true, false);
		}
		
		const [_, error] = await vow(
			this._CompanyConfirm(params)
		);
		
		if (error) {
			console.error(error);
			runInAction(() => {
				jobRef.saveError = String(error);
			});
		}
	};
	
	@action SendTerpConfirmation = async (jobRef: JobRef, emails, sendEmail = true) => {
		let params: T_TerpConfirm_Params = {};
		params.jobId = jobRef.jobId;
		params.terpId = jobRef.terp.terpId;
		params.notification = {
			jobId: jobRef.jobId,
			dateString: thyme.nice.date.input(jobRef.start),
			label: `Job confirmed: ${jobRef.jobId} ${thyme.nice.date.brief(jobRef.start)}`
		};
		
		if (sendEmail) {
			params.sendEmail = true;
			params.dynamicEmail = MakeConfirmEmail(jobRef, emails, false, true);
		}
		
		const [_, error] = await vow(
			this._TerpConfirm(params)
		);
		
		if (error) {
			console.error(error);
			runInAction(() => {
				jobRef.saveError = String(error);
			});
		}
		
	};
	
	@action SendInternConfirmation = async (jobRef: JobRef, emails, sendEmail = true) => {
		let params: T_InternConfirm_Params = {};
		params.jobId = jobRef.jobId;
		
		if (sendEmail) {
			params.sendEmail = true;
			params.dynamicEmail = MakeConfirmEmail(jobRef, emails, false, true, true);
		}
		
		const [_, error] = await vow(
			this._InternConfirm(params)
		);
		
		if (error) {
			console.error(error);
			runInAction(() => {
				jobRef.saveError = String(error);
			});
		}
		
	};
	
	@action CompanyConfirmPrinted = async (jobRef: JobRef) => {
		const params = {
			jobId: jobRef.jobId,
		};
		
		const [_, error] = await vow(
			this._CompanyConfirmPrinted(params)
		);
		
		if (error) {
			console.error(error);
			runInAction(() => {
				jobRef.saveError = String(error);
			});
		}
	};
	
	@action ClearCompanyConfirmation = async (jobRef: JobRef) => {
		return this._ClearConfirm({
			jobId: jobRef.jobId,
			clearCompany: true,
			clearTerp: false,
			clearIntern: false,
		});
	};
	
	@action ClearTerpConfirmation = async (jobRef: JobRef) => {
		return this._ClearConfirm({
			jobId: jobRef.jobId,
			clearCompany: false,
			clearTerp: true,
			clearIntern: false,
		});
	};
	
	@action ClearInternConfirmation = async (jobRef: JobRef) => {
		return this._ClearConfirm({
			jobId: jobRef.jobId,
			clearCompany: false,
			clearTerp: false,
			clearIntern: true,
		});
	};
}