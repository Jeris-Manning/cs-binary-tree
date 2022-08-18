import type {VersionInfo} from '../VERSION';
import type {StaffId, StaffKey} from './stache/StaffDat';
import {StaffEmail} from './stache/StaffDat';

export class StaffAccount {
	key: StaffKey;
	staffId: StaffId;
	email: StaffEmail;
	label: string;
	fullName: string;
	internalName: string;
	externalName: string;
	color: string;
	photo: string;
	newestVersion: VersionInfo;
	
	constructor(raw) {
		Object.assign(this, raw);
		this.key = String(raw.staffId);
	}
}