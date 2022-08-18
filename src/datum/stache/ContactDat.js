import {action, observable} from 'mobx';
import type {DatKey} from '../../Bridge/DockClient/Stache';
import thyme from '../../Bridge/thyme';


export class ContactDat {
	
	@observable key: DatKey;
	@observable contactId: string;
	@observable active: boolean;
	@observable companyId: string;
	@observable firstName: string;
	@observable lastName: string;
	@observable workPhone: string;
	@observable homePhone: string;
	@observable mobilePhone: string;
	@observable email: string;
	@observable note: string;
	@observable billCompany: string;
	@observable internNote: string;
	@observable label: string = '⏳';
	
	
	@action ApplyDatRaw = (datRaw) => {
		Object.assign(
			this,
			thyme.fast.obj.unpack(datRaw)
		);
	};
	
	constructor(key: DatKey) {this.key = key;}
	
	static Stub = (key: DatKey): ContactDat => new ContactDat(key);
}