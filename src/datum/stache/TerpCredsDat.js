import {action, observable} from 'mobx';
import thyme from '../../Bridge/thyme';
import type {TerpKey} from './TerpDat';
import type {CredentialKey} from './CredentialDat';

export type TerpCredKey = string;
export type TerpCredStateLup = { [CredentialKey]: TerpCredentialState };

export class TerpCredsDat {
	@observable key: TerpKey; // terp key
	@observable terpCredsLup: TerpCredStateLup = {};
	
	@action ApplyDatRaw = (datRaw) => {
		Object.assign(
			this,
			thyme.fast.obj.unpack(datRaw)
		);
	};
	
	constructor(key: TerpKey) {this.key = key;}
	static Stub = (key: TerpKey): TerpCredsDat => new TerpCredsDat(key);
}

export type TerpCredentialState = {
	// TODO
	key: CredentialKey,
	allEntries: TerpCredEntry[],
	bestEntry: TerpCredEntry,
	status: any,
}

export type TerpCredEntry = {
	key: TerpCredKey,
	terpCredId: string,
	submittedAt: ThymeDt,
	expiresOn: ThymeDt,
	isPending: boolean,
	isVerified: boolean,
	isRemoved: boolean,
	willExpireSoon: boolean,
	isExpired: boolean,
	isValid: boolean,
	wasValid: boolean,
	credentialId: string,
	terpId: string,
	verifiedAt: ThymeDt,
	verifiedBy: string, // staff email
	submission: string,
	parentCredId: string,
}