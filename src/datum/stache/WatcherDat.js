import {action, observable} from 'mobx';
import type {DatKey} from '../../Bridge/DockClient/Stache';
import {StaffEmail} from './StaffDat';
import {LocalStaff, Root} from '../../stores/RootStore';

/* 'job_88888', 'terp_1273', etc. */
export type WatcherTargetKey = string;

type PortId = number;
type Status = string;
type TargetEntry = { [EmailKey]: TargetEntryStaff };
type TargetEntryStaff = { [PortId]: Status };
type EmailKey = string;
export type WatcherStaff = {
	staffEmail: StaffEmail;
	clientPortId: PortId;
	status: Status;
	isLocal: boolean;
}

export class WatcherDat {
	
	@observable key: WatcherTargetKey;
	@observable watchers: WatcherStaff = [];
	
	@action ApplyDatRaw = (datRaw) => {
		if (!datRaw) {
			console.warn(`WatcherDat tried to apply null data. ${this.key}`);
			return;
		}
		const localKey = `${LocalStaff().email}_${Root().clientPortId}`;
		const targetEntry: TargetEntry = datRaw.targetEntry;
		
		let watchers = [];
		
		for (let [staffEmail: EmailKey, entry: TargetEntryStaff] of Object.entries(targetEntry)) {
			for (let [portId: PortId, status: Status] of Object.entries(entry)) {
				const key = `${staffEmail}_${portId}`;
				
				watchers.push({
					key: key,
					staffEmail: staffEmail,
					clientPortId: portId,
					status: status,
					isLocal: key === localKey,
				});
			}
		}
		
		this.watchers = watchers;
	};
	
	constructor(key: DatKey) {this.key = key;}
	
	static Stub = (key: DatKey): WatcherDat => new WatcherDat(key);
}