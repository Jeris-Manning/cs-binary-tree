import {action, observable} from 'mobx';
import type {DatKey} from '../../Bridge/DockClient/Stache';
import thyme from '../../Bridge/thyme';
import type {TerpCredEntry} from './TerpCredsDat';

export const TERP_CRED_LISTS = {
	needVerify: 'needVerify',
	expiringSoon: 'expiringSoon',
	expiredRecently: 'expiredRecently',
}

// used in Cred Queue
export class TerpCredListDat {
	
	@observable key: DatKey;
	@observable terpCreds: TerpCredEntry[] = [];
	
	@action ApplyDatRaw = (datRaw) => {
		this.terpCreds = thyme.fast.array.unpack(datRaw.terpCreds || []);
	};
	
	constructor(key: DatKey) {this.key = key;}
	static Stub = (key: DatKey): TerpCredListDat => new TerpCredListDat(key);
}