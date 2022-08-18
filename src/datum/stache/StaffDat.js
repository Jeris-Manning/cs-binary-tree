import {action, observable} from 'mobx';
import type {DatKey} from '../../Bridge/DockClient/Stache';
import thyme from '../../Bridge/thyme';

export type StaffKey = string; // ID string
export type StaffId = number;
export type StaffEmail = string;

/** used for:
 *  cStaffByEmail,
 *  cStaffById,
 *  cStaffByName
 */
export class StaffDat {
	
	@observable key: DatKey; // staffId|email|internalName (depending on stache) // TODO
	@observable staffId: StaffId;
	@observable email: StaffEmail;
	@observable fullName: string;
	@observable internalName: string;
	@observable externalName: string;
	@observable color: string;
	@observable photo: string;
	@observable label: string; // = '⏳';
	
	
	@action ApplyDatRaw = (datRaw) => {
		Object.assign(
			this,
			thyme.fast.obj.unpack(datRaw)
		);
	};
	
	constructor(key: DatKey) {this.key = key;}
	
	static Stub = (key: DatKey): StaffDat => new StaffDat(key);
}