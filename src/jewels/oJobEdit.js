import {vow} from '../Bridge/misc/$j';
import {WiseGem} from '../Bridge/jewelerClient/WiseGem';
import {JobUpdata} from '../datum/JobUpdata';
import {BaseJewel} from './BaseJewel';
import type {JobChanges} from '../pages/Job/JobUpdate/JobBasics';
import type {JobId} from '../datum/stache/JobDat';
import {Router} from '../stores/RootStore';

export type T_JobUp_ChangeKey = string;
export type T_JobUp_ChangeVal = any;
export type T_JobUp_Changes = { [T_JobUp_ChangeKey]: T_JobUp_ChangeVal };
export type T_JobUp_Params = {
	jobId: number,
	changes: T_JobUp_Changes,
	source?: string,
};

export type T_AssignTerp_Params = {
	jobId: number,
	terpId: number | null,
	seekerId?: number,
	keepStatus?: boolean,
	keepBids?: boolean,
	keepSeekers?: boolean,
	notification?: {
		label?: string,
		// ???
	},
	source?: string,
}

export type T_UnassignTerp_Params = {
	jobId: number,
	keepStatus?: boolean,
	keepConfirmations?: boolean,
	source?: string,
}

export type T_AddNote_Params = {
	jobId: number,
	note: string,
}

export type T_MarkJobsBillingComplete_Params = {
	jobIds: JobId[],
}

export class oJobEdit extends BaseJewel {
	gems = {
		updateJob: new WiseGem('jobId'),
		assignTerp: new WiseGem('terpId'),
		unassignTerp: new WiseGem('jobId'),
		createJob: new WiseGem(),
		addNote: new WiseGem('note'),
		markJobsBillingComplete: new WiseGem('jobIds'),
	};
	
	UpdateJob = async (params: T_JobUp_Params) => {
		const promise = this.gems.updateJob.Post(params);
		const [_, error] = await vow(promise);
		if (error) throw new Error(error);
	};
	
	AssignTerp = async (params: T_AssignTerp_Params) => {
		const promise = this.gems.assignTerp.Post(params);
		const [_, error] = await vow(promise);
		if (error) throw new Error(error);
	};
	
	UnassignTerp = async (params: T_UnassignTerp_Params) => {
		const promise = this.gems.unassignTerp.Post(params);
		const [_, error] = await vow(promise);
		if (error) throw new Error(error);
	};
	
	CreateJob = async (params: T_JobUp_Params) => {
		const promise = this.gems.createJob.Post(params);
		const [jobId, error] = await vow(promise);
		if (error) throw new Error(error);
		return jobId;
	};
	
	// T_AddNote_Params
	AddNote = (jobId: JobId, note: string) => this.gems.addNote.Post({
		jobId: jobId,
		note: note
	});
	
	MarkJobsBillingComplete = async (params: T_MarkJobsBillingComplete_Params) => {
		const promise = this.gems.markJobsBillingComplete.Post(params);
		const [_, error] = await vow(promise);
		if (error) throw new Error(error);
	};
}