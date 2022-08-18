import {WiseGem} from '../Bridge/jewelerClient/WiseGem';
import {LocalStaff, Root} from '../stores/RootStore';
import type {WatcherTargetKey} from '../datum/stache/WatcherDat';
import {StaffEmail} from '../datum/stache/StaffDat';
import {BaseJewel} from './BaseJewel';

export type WatcherStatus = {
	targetKey: WatcherTargetKey, // 'job_88888', 'terp_1273'
	staffEmail: StaffEmail,
	clientPortId: number, // clientPortId (users can have multiple client ports)
	status: string, // 'onPage', 'editing'
};

const REMOVE_STATUS_KEY = 'REMOVE';

export class oWatcher extends BaseJewel {
	gems = {
		setWatcherStatus: new WiseGem('targetKey'),
	};
	
	
	SetWatcherStatus = (targetKey: WatcherTargetKey, status: string) => {
		const watcherStatus: WatcherStatus = {
			targetKey: targetKey,
			staffEmail: LocalStaff().email,
			clientPortId: Root().clientPortId,
			status: status,
		};
		
		return this.gems.setWatcherStatus.Post(watcherStatus);
	};
	
	RemoveWatcher = (targetKey: WatcherTargetKey) => {
		this.SetWatcherStatus(targetKey, REMOVE_STATUS_KEY);
	};
}