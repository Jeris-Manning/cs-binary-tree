import type {CredKey} from './CredDef';
import $j from '../../Bridge/misc/$j';
import {action, observable} from 'mobx';
import {MdHourglassEmpty, MdStarBorder} from 'react-icons/md';
import {TiCancel} from 'react-icons/ti';
import {FaCheck} from 'react-icons/fa';
import {CredData} from './CredDatum';
import {CredDef} from './CredDef';
import type {DemandKey} from '../stache/DemandDat';


export class DemandDef {
	
	key: DemandKeyey;
	demandId: number;
	enabled: boolean = true;
	
	label: string = '';
	category: string = '';
	notes: string = '';
	usesRid: boolean = false;
	
	credKeysRequired: CredKey[][];
	
	static MakeKey = (key: any): DemandKey => `demand_${key}`;
	static MakeDef = (rawRow): DemandDef => new DemandDef(rawRow);
	
	constructor(raw) {
		this.key = DemandDef.MakeKey(raw.demandId);
		this.demandId = Number(raw.demandId);
		this.enabled = raw.enabled;
		
		this.label = raw.label || raw.name || '';
		this.category = raw.category || '';
		this.notes = raw.notes || '';
		this.usesRid = raw.usesRid || false;
		
		this.credKeysRequired = raw.credsRequired.map(group =>
			group.filter(c => c !== 0).map(credId => CredDef.MakeKey(credId))
		);
	}
	
	
	CalculateDemandStatus = (credData: CredData): DemandStatus => {
		if (this.DemandIsVerified(credData)) return DEMAND_STATUS.VERIFIED;
		if (this.DemandIsPending(credData)) return DEMAND_STATUS.PENDING;
		if (this.DemandIsExpired(credData)) return DEMAND_STATUS.EXPIRED;
		if (this.DemandIsChecklisted(credData)) return DEMAND_STATUS.CHECKLISTED;
		return DEMAND_STATUS.NONE;
	};
	
	
	DemandIsVerified = (data: CredData) => this.CheckReqGroup(data.CheckCredVerified);
	DemandIsPending = (data: CredData) => this.CheckReqGroup(data.CheckCredPending);
	DemandIsExpired = (data: CredData) => this.CheckReqGroup(data.CheckCredExpired);
	DemandIsChecklisted = (data: CredData) => data.CheckIsChecklisted(this.key);
	CheckReqGroup = (func) => this.credKeysRequired.some(group => group.every(func));
	
	
}

export type DemandStatus = {
	key: string,
	label: string,
	icon: any,
	hueBg: string,
};


export const DEMAND_STATUS = $j.injectKeys({
	VERIFIED: {
		label: 'Verified',
		icon: FaCheck,
		// hueBg: '#87ad00',
		abbreviation: 'V',
	},
	PENDING: {
		label: 'Pending',
		icon: MdHourglassEmpty,
		// hueBg: '#9225c1',
		abbreviation: 'P',
	},
	EXPIRED: {
		label: 'Expired',
		icon: TiCancel,
		// hueBg: '#ff1b2f',
		abbreviation: 'E',
	},
	CHECKLISTED: {
		label: 'Checklisted',
		icon: MdStarBorder,
		// hueBg: '#66def7',
		abbreviation: 'C',
	},
	NONE: {
		label: 'None',
		icon: undefined,
		// hueBg: undefined,
		abbreviation: '-',
	},
});