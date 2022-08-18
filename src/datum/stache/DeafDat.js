import {action, observable} from 'mobx';
import thyme from '../../Bridge/thyme';
import type {ThymeDt} from '../../Bridge/thyme';
import type {IdKey} from '../../Bridge/misc/UpType';
import $j from '../../Bridge/misc/$j';
import {Clutch} from '../../Bridge/DockClient/Stache';

export type DeafKey = string;
export type DeafId = number;
export type C_DeafClutch = {
	deafClutch: Clutch<DeafDat>,
};
export const DEAF_CATEGORIES = {
	0: 'DB',
	1: 'ASL',
	2: 'PSE',
	3: 'MLS',
	4: 'Oral',
	5: 'LV',
};

export class DeafDat {
	
	@observable key: DeafKey;
	@observable deafId: IdKey;
	@observable active: boolean;
	@observable firstName: string;
	@observable lastName: string;
	@observable label: string = '⏳';
	@observable dob: string;
	
	@observable email: string;
	@observable phone: string;
	@observable videoPhone: string;
	@observable tty: string;
	@observable pager: string;
	
	@observable address: string;
	@observable address2: string;
	@observable city: string;
	@observable state: string;
	@observable zip: string;
	
	@observable notesForTerp: string;
	@observable notesDeafProfile: string;
	@observable notesForStaff: string;
	@observable pronoun: string;
	@observable createdOn: ThymeDt;
	@observable updatedOn: ThymeDt;
	@observable lastUser: string;
	
	@observable categoryIds: number[] = [];
	@observable hashtags: string[] = [];
	
	
	@action ApplyDatRaw = (datRaw) => {
		Object.assign(
			this,
			thyme.fast.obj.unpack(datRaw)
		);
		
		this.hashtags = $j.findHashTags(this.notesForStaff);
	};
	
	constructor(key: DeafKey) {this.key = key;}
	
	static Stub = (key: DeafKey): DeafDat => new DeafDat(key);
}