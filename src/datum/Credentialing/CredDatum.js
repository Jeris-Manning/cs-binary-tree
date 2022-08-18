import {action, observable} from 'mobx';
import {MdHourglassEmpty, MdStarBorder} from 'react-icons/md';
import {TiCancel} from 'react-icons/ti';
import {FaCheck} from 'react-icons/fa';
import thyme from '../../Bridge/thyme';
import $j from '../../Bridge/misc/$j';
import type {DemandStatus} from './DemandDef';
import {DEMAND_STATUS, DemandDef, DemandKey} from './DemandDef';
import type {CredKey} from './CredDef';
import {DefLup} from '../../misc/DefinitionClasses';
import {TerpDef} from '../TerpDef';
import {CredDef} from './CredDef';

export class CredDatum {
	static expiringSoonCutoff = thyme.today().plus({months: 1});
	
	@observable credId = 0;
	@observable valid = [];
	@observable past = [];
	@observable current = null;
	@observable status = credStatus.NONE;
	@observable hasValid = false;
	@observable expired = false;
	@observable pending = false;
	
	constructor(credId) {
		this.Construct(credId);
	}
	
	@action Construct = (credId) => {
		this.credId = credId;
	};
	
	
	@action AddTerpCred = (tCred) => {
		tCred.pending = (
			!tCred.verified &&
			!tCred.expired &&
			!tCred.removed
		);
		
		tCred.valid = (
			tCred.verified &&
			!tCred.expired &&
			!tCred.removed
		);
		
		tCred.wasValid = (
			!tCred.valid &&
			tCred.verified
		);
		
		tCred.expiringSoon = (
			tCred.valid &&
			tCred.expires &&
			tCred.expiresOn < CredDatum.expiringSoonCutoff
		);
		
		if (tCred.valid) {
			this.valid.push(tCred);
		} else {
			this.past.push(tCred);
		}
	};
	
	@action Finalize = () => {
		this.current = CredDatum.GetCurrent(this);
		
		if (this.current) {
			this.hasValid = this.current.valid;
			this.expired = this.current.expired;
			this.pending = this.current.pending;
		}
		
		this.status = CredDatum.GetStatus(this);
	};
	
	
	static GetCurrent(datum) {
		if (datum.valid.length > 0) {
			datum.valid = datum.valid.slice().sort(thyme.sorter('verifiedAt'));
			return datum.valid.slice(-1)[0];
		}
		
		let current = null;
		
		datum.past.forEach(other => {
			current = CredDatum.GetTerpCredMoreRelevant(current, other);
		});
		
		return current;
	}
	
	static GetTerpCredMoreRelevant(a, b) {
		if (!a) return b;
		if (!b) return a;
		if (a.pending) return a;
		if (b.pending) return b;
		return a.submittedAt > b.submittedAt ? a : b;
	}
	
	static GetStatus(datum) {
		if (datum.current) {
			if (datum.current.expiringSoon) return credStatus.EXPIRING;
			if (datum.current.valid) return credStatus.VERIFIED;
			if (datum.current.pending) return credStatus.PENDING;
			if (datum.current.expired) return credStatus.EXPIRED;
		}
		return credStatus.NONE;
	}
	
	static MakeCredDataForTerp(allCreds, terpCreds, finalize = true) {
		const data = {};
		
		allCreds.forEach(cred => {
			data[cred.credId] = new CredDatum(cred.credId);
		});
		
		terpCreds.forEach(tCred => {
			const datum = data[tCred.credId];
			if (datum) {
				datum.AddTerpCred(tCred);
				// datum.SetChecklist(checklist.includes(tCred.credId))
			}
		});
		
		if (finalize) CredDatum.FinalizeAll(data);
		
		return data;
	}
	
	static FinalizeAll(data) {
		Object.values(data).forEach(datum => datum.Finalize());
	}
}

export class CredData {
	@observable key: TerpKey;
	@observable terpId: number;
	@observable terp: TerpDef;
	// @observable firstName: string;
	// @observable lastName: string;
	// @observable email: string;
	
	@observable datums: Map<CredKey, CredDatum> = new Map();
	@observable demands: Map<DemandKey, DemandStatus> = new Map();
	@observable checklist: DemandKey[] = [];
	
	constructor(terpId) {
		this.key = TerpDef.MakeKey(terpId);
		this.terpId = Number(terpId);
	}
	
	// ???? : DefLup<CredKey, CredDef>
	@action StubCreds = (credLup) => {
		for (const credDef of credLup.all) {
			this.datums.set(credDef.key, new CredDatum(credDef.key));
		}
	};
	
	@action AddTerpCred = (tCred) => {
		const datum = this.datums.get(CredDef.MakeKey(tCred.credId));
		if (!datum) return;
		datum.AddTerpCred(tCred);
	};
	
	@action FinalizeDatums = () => this.datums.forEach(d => d.Finalize());
	
	
	@action ApplyDemands = (defs: DemandDef[]) => {
		this.demands.clear();
		
		for (const def of defs) {
			const status = def.CalculateDemandStatus(this);
			this.demands.set(def.key, status);
		}
	};
	
	@action ApplyChecklist = (checklist: number[]) => {
		for (const demandId of checklist) {
			const demandKey = DemandDef.MakeKey(demandId);
			
			const status = this.demands.get(demandKey);
			if (!status) continue;
			if (status.key !== DEMAND_STATUS.NONE.key) continue;
			
			this.demands.set(demandKey, DEMAND_STATUS.CHECKLISTED);
			this.checklist.push(demandKey);
		}
	};
	
	GetDemandStatus = (key: DemandKey): DemandStatus => this.demands.get(key);
	GetDemandStatusAbbrev = (key: DemandKey): DemandStatus => this.demands.get(key).abbreviation;
	
	CheckCredVerified = (credKey: CredKey): boolean => {
		const datum = this.datums.get(credKey) || {};
		return datum.hasValid;
	};
	
	CheckCredPending = (credKey: CredKey, orMet: boolean = true): boolean => {
		const datum = this.datums.get(credKey) || {};
		return datum.pending || (orMet && datum.hasValid);
	};
	
	CheckCredExpired = (credKey: CredKey, orMet: boolean = true): boolean => {
		const datum = this.datums.get(credKey) || {};
		return datum.expired || (orMet && datum.hasValid);
	};
	
	CheckIsChecklisted = (demandKey: DemandKey): boolean => this.checklist.includes(demandKey);
	
	IsDemand = (demandDef: DemandDef, status): boolean => {
		const current = this.demands.get(demandDef.key);
		return current.key === status.key;
	}
	
	IsDemandVerified = (demandDef: DemandDef): boolean => this.IsDemand(demandDef, DEMAND_STATUS.VERIFIED);
}

export class CredDataLup {
	
	@observable lup: Map<TerpKey, CredData>;
	@observable all: CredData[];
	
	constructor(lup) {
		this.lup = lup;
		this.all = [...lup.values()].sort($j.sort.alphabetic('lastName'));
	}
	
	// ???? : DefLup<DemandKey, DemandDef>
	@action ApplyDemandLup = (demandLup) => {
		this.all.forEach(credData => credData.ApplyDemands(demandLup.all));
	};
	
	static Make(terpLup: DefLup<TerpKey, TerpDef>, credLup: DefLup<CredKey, CredDef>, terpCreds: {}[]): CredDataLup {
		let dataFull: Map<TerpKey, CredData> = new Map();
		
		for (const terp of terpLup.all) {
			const credData = new CredData(terp.terpId);
			credData.terp = terp;
			credData.StubCreds(credLup);
			
			dataFull.set(credData.key, credData);
		}
		
		for (const tCred of terpCreds) {
			const terp = dataFull.get(TerpDef.MakeKey(tCred.terpId));
			if (!terp) continue;
			
			terp.AddTerpCred(tCred);
		}
		
		dataFull.forEach(credData => credData.FinalizeDatums());
		
		return new CredDataLup(dataFull);
	}
}


export const demandStatus = {
	NONE: 'NONE',
	PENDING: 'PENDING',
	EXPIRED: 'EXPIRED',
	VERIFIED: 'VERIFIED',
};

export const credStatus = {
	NONE: 'NONE',
	CHECKLISTED: 'CHECKLISTED',
	PENDING: 'PENDING',
	EXPIRED: 'EXPIRED',
	EXPIRING: 'EXPIRING',
	VERIFIED: 'VERIFIED',
};


// TODO: remove
export const credStatusDef = {
	NONE: {
		label: 'None',
		icon: undefined,
		hueBg: undefined,
		tooltip: datum => ``,
	},
	CHECKLISTED: {
		label: 'Checklisted',
		icon: MdStarBorder,
		hueBg: '#66def7',
		tooltip: datum => ``,
	},
	PENDING: {
		label: 'Pending',
		icon: MdHourglassEmpty,
		hueBg: '#9225c1',
		tooltip: datum => ``,
	},
	EXPIRED: {
		label: 'Expired',
		icon: TiCancel,
		hueBg: '#ff1b2f',
		tooltip: datum => ``,
	},
	EXPIRING: {
		label: 'Expiring',
		icon: FaCheck,
		hueBg: '#c9b60b',
		tooltip: datum => ``,
	},
	VERIFIED: {
		label: 'Verified',
		icon: FaCheck,
		hueBg: '#87ad00',
		tooltip: datum => ``,
	},
};

export function GetCredStatusDef(datum) {
	if (!datum || !datum.status) return credStatusDef.NONE;
	return credStatusDef[datum.status];
}