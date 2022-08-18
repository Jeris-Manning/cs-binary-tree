import {action, observable} from 'mobx';
import type {DatKey} from '../../Bridge/DockClient/Stache';
import $j from '../../Bridge/misc/$j';

export type CredentialKey = string;
export type CredentialId = number;

export class CredentialDat {
	static UseEnumMode = true;
	
	@observable key: DatKey; // disregarded
	@observable entries: CredentialEntry[] = [];
	@observable entryLup: {[CredentialKey]: CredentialEntry};
	
	@action ApplyDatRaw = (datRaw) => {
		this.entries = datRaw
			.map(entryRaw => new CredentialEntry(entryRaw));
		
		this.entryLup = $j.arrayToLup(this.entries);
	};
	
	constructor(key: DatKey) {this.key = key;}
	static Stub = (key: DatKey): CredentialDat => new CredentialDat(key);
	
}


export class CredentialEntry {
	@observable key: CredentialKey;
	@observable credentialId: CredentialId;
	@observable name: string;
	@observable description: string;
	@observable requires: string;
	@observable requiresVerify: boolean;
	@observable expires: boolean;
	@observable form: string;
	@observable category: string;
	@observable prefix: string;
	@observable defaultExpiration: string;
	@observable hidden: boolean;
	@observable canRemove: boolean;
	@observable tooltip: string;
	@observable importantInfo: string;
	@observable isPublic: boolean;
	@observable enabled: boolean;
	@observable label: string = '⏳';
	
	constructor(entryRaw) {
		Object.assign(this, entryRaw);
	}
}