import {vow} from '../Bridge/misc/$j';
import {WiseGem} from '../Bridge/jewelerClient/WiseGem';
import {BaseJewel} from './BaseJewel';
import type {JobId} from '../datum/stache/JobDat';
import type {TerpId} from '../datum/stache/TerpDat';
import type {StaffId} from '../datum/stache/StaffDat';
import type {SeekerId} from '../datum/stache/JobSeekDat';
import {NoticeGem} from '../Bridge/jewelerClient/NoticeGem';
import {Root, RootStore} from '../stores/RootStore';

export type T_PostSeekers_Params = {
	jobId: JobId,
	terpIds: TerpId[],
	description: string,
	isRequested: boolean,
	notification: boolean,
	subject: string,
	doLegacy: boolean,
}

export type T_RemoveSeekers_Params = {
	jobId: JobId,
	seekerIds?: number[],
	all?: boolean,
}

export type T_BidAck_Params = {
	jobId: JobId,
	seekerId: SeekerId,
	staffId: StaffId|null,
};

export type T_BidNotification = {
	message: string,
};

export type T_BidReject_Params = {
	jobId: JobId,
	seekerId: SeekerId,
};

export class oJobSeek extends BaseJewel {
	gems = {
		postSeekers: new WiseGem('description'),
		removeSeekers: new WiseGem('seekerIds'),
		bidAck: new WiseGem('jobId'),
		bidNotify: new NoticeGem(p => this.HandleBidNotify(p)),
		bidReject: new WiseGem('jobId'),
	};
	
	
	PostSeekers = async (params: T_PostSeekers_Params) => {
		const promise = this.gems.postSeekers.Post(params);
		const [_, error] = await vow(promise);
		if (error) throw new Error(error);
	};
	
	RemoveSeekers = async (params: T_RemoveSeekers_Params) => {
		const promise = this.gems.removeSeekers.Post(params);
		const [_, error] = await vow(promise);
		if (error) throw new Error(error);
	};
	
	BidAck = async (params: T_BidAck_Params) => {
		const promise = this.gems.bidAck.Post(params);
		const [_, error] = await vow(promise);
		if (error) throw new Error(error);
	}
	
	HandleBidNotify = (notification: T_BidNotification) => {
		const {
			message,
		} = notification;
		
		console.log(`Try bid notification: ${message}`);
		
		const root: RootStore = Root();
		if (!root.prefs.bids.notify) {
			console.log(`Bid notification silenced by pref`);
			return;
		}
		// root.Notification(`${terpName} bid on ${jobId}`);
		root.Notification(message);
	};
	
	BidReject = async (params: T_BidReject_Params) => {
		const promise = this.gems.bidReject.Post(params);
		const [_, error] = await vow(promise);
		if (error) throw new Error(error);
	};
}