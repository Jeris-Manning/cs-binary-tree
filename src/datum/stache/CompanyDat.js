import {action, observable} from 'mobx';
import type {DatKey} from '../../Bridge/DockClient/Stache';
import thyme from '../../Bridge/thyme';
import type {ThymeDt} from '../../Bridge/thyme';
import {SelectorField} from '../../Bridge/misc/SelectorField';

export type CompanyKey = string;
export type CompanyId = number;

export class CompanyDat {
	
	@observable key: CompanyKey;
	
	@observable companyId: string;
	@observable active: boolean;
	@observable name: string;
	@observable address: string;
	@observable address2: string;
	@observable city: string;
	@observable state: string;
	@observable zip: string;
	@observable phone: string;
	@observable fax: string;
	@observable note: string;
	@observable updatedOn: ThymeDt;
	@observable lastUser: string;
	@observable defaultLoc: string;
	@observable rate: string;
	@observable cap: number;
	@observable capVri: number;
	@observable class: string;
	@observable medicalRecordId: string;
	@observable label: string = '⏳';
	
	@observable notesForTerp: string;
	
	@observable contactIds: number[];
	@observable locationIds: number[];
	@observable deafIds: number[];
	
	// @observable contractType: string;
	// @observable contractExpire: string;
	@observable files: string[] = [];
	
	@action ApplyDatRaw = (datRaw) => {
		console.log(`CompanyDat ${datRaw.companyId}`, datRaw);
		
		Object.assign(
			this,
			thyme.fast.obj.unpack(datRaw)
		);
	};
	
	constructor(key: DatKey) {this.key = key;}
	
	static Stub = (key: DatKey): CompanyDat => new CompanyDat(key);
}

// TODO: make this data driven
export const COMPANY_CONTRACT_TYPE = [
	'AA',
	'Church',
	'General',
	'Greater MN Business',
	'Greater MN Medical',
	'K12',
	'Medical',
	'North Dakota',
	'Platform',
	'Post Secondary',
	'Reduced',
	'VRI',
	'Wisconsin',
	'Agreement with edits',
	'Master Contract',
	`Jason's Renegade Deals`,
]

export const COMPANY_CONTRACT_CHOICES = SelectorField.LabelArrayToChoices(COMPANY_CONTRACT_TYPE.sort());