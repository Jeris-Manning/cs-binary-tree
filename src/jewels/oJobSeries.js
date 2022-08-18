import {vow} from '../Bridge/misc/$j';
import {WiseGem} from '../Bridge/jewelerClient/WiseGem';
import React from 'react';
import {BaseJewel} from './BaseJewel';
import type {JobId} from '../datum/stache/JobDat';
import type {JobChanges} from '../pages/Job/JobUpdate/JobBasics';
import type {SeriesId} from '../datum/stache/JobSeriesDat';
import {T_UnassignTerp_Params} from './oJobEdit';

export type T_CreateSeries = {
	jobId: JobId,
}
export type T_PushChanges = {
	sourceJobId: JobId,
	changesByJobId: {[JobId]: JobChanges},
}
export type T_PushTerp = {
	sourceJobId: JobId,
	targetJobIds: JobId[],
	assignTerpParams?: T_AssignTerp_Params,
	unassignTerpParams?: T_UnassignTerp_Params,
}
export type T_ChangeJobsInSeries = {
	jobIds: JobId[],
	seriesId: SeriesId,
}
export type T_ChangeSeriesNote = {
	seriesId: SeriesId,
	note: string,
}

export type T_CreateSeriesJobs = {
	seriesId: SeriesId,
	sourceJobId: JobId,
	jobs: T_JobUp_Changes[],
}

export class oJobSeries extends BaseJewel {
	gems = {
		createSeries: new WiseGem('jobId'),
		addJobsToSeries: new WiseGem('seriesId'),
		removeJobsFromSeries: new WiseGem('jobId'),
		pushChanges: new WiseGem('jobId'),
		pushTerp: new WiseGem('terpId'),
		changeSeriesNote: new WiseGem('seriesId'),
		createSeriesJobs: new WiseGem('seriesId'),
	};
	
	CreateSeries = async (params: T_CreateSeries) => {
		const promise = this.gems.createSeries.Post(params);
		const [_, error] = await vow(promise);
		if (error) throw new Error(error);
	};
	
	AddJobsToSeries = async (params: T_ChangeJobsInSeries) => {
		const promise = this.gems.addJobsToSeries.Post(params);
		const [_, error] = await vow(promise);
		if (error) throw new Error(error);
	}
	
	RemoveJobsFromSeries = async (params: T_ChangeJobsInSeries) => {
		const promise = this.gems.removeJobsFromSeries.Post(params);
		const [_, error] = await vow(promise);
		if (error) throw new Error(error);
	}
	
	PushChanges = async (params: T_PushChanges) => {
		const promise = this.gems.pushChanges.Post(params);
		const [_, error] = await vow(promise);
		if (error) throw new Error(error);
	};
	
	PushTerp = async (params: T_PushTerp) => {
		const promise = this.gems.pushTerp.Post(params);
		const [_, error] = await vow(promise);
		if (error) throw new Error(error);
	};
	
	ChangeSeriesNote = async (params: T_ChangeSeriesNote) => {
		const promise = this.gems.changeSeriesNote.Post(params);
		const [_, error] = await vow(promise);
		if (error) throw new Error(error);
	}
	
	CreateSeriesJobs = async (params: T_CreateSeriesJobs) => {
		const promise = this.gems.createSeriesJobs.Post(params);
		const [_, error] = await vow(promise);
		if (error) throw new Error(error);
	}
}
