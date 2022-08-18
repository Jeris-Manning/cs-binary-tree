import {WiseGem} from '../Bridge/jewelerClient/WiseGem';
import {action, observable, runInAction} from 'mobx';
import $j, {vow} from '../Bridge/misc/$j';
import {Loader} from '../Bridge/misc/Loader';
import {CredDatum} from '../datum/Credentialing/CredDatum';
import {MdHourglassEmpty} from 'react-icons/md';
import {TiCancel} from 'react-icons/ti';
import {FaCheck} from 'react-icons/fa';
import {Jewels} from '../stores/RootStore';
import {BaseJewel} from './BaseJewel';


export class oTerpChecklist extends BaseJewel {
	gems = {
		getFull: new WiseGem(),
		getChecklist: new WiseGem(),
		saveChecklist: new WiseGem(),
	};
	
	
	@observable loader = new Loader();
	@observable terpId = 0;
	@observable demands = {};
	@observable demandsArray = [];
	@observable demandCategories = [];
	@observable credData = {};
	@observable canSave = false;
	
	@action LoadChecklist = async (terpId) => {
		this.loader.Start();
		
		this.terpId = terpId;
		
		const [full, error] = await vow(
			this.gems.getFull.Get({terpId: terpId})
		);
		
		if (error) return; // TODO
		
		await this.FinishLoad(terpId, full);
		
		this.loader.Stop();
	};
	
	@action FinishLoad = async (terpId, full) => {
		const credData = CredDatum.MakeCredDataForTerp(
			full.credentials,
			full.terpCreds
		);
		
		const demands = {};
		const demandsArray = full.demands
			.filter(d => d.category !== 'HIDDEN')
			.sort($j.sort.alphabetic('name'))
			.map(d => new ChecklistDemand(d));
		
		demandsArray.forEach(demand => {
			demand.status = CalculateDemandStatus(demand, credData);
			demand.checklisted = full.checklist.includes(demand.demandId);
			
			demands[demand.demandId] = demand;
		});
		
		this.demands = demands;
		this.demandsArray = demandsArray;
		this.credData = credData;
		this.ComputeCategories();
	};
	
	@action ComputeCategories = () => {
		const cats = {};
		
		this.demandsArray.forEach(demand => {
			if (!cats.hasOwnProperty(demand.category)) {
				cats[demand.category] = {
					name: demand.category,
					demands: [demand],
				};
			} else {
				cats[demand.category].demands.push(demand);
			}
		});
		
		this.demandCategories = Object.values(cats).sort($j.sort.alphabetic('name'));
	};
	
	@action SetDemand = (demandId, checklisted) => {
		if (!this.demands.hasOwnProperty(demandId)) return;
		
		this.demands[demandId].SetChecklisted(checklisted);
		console.log(`SetDemand ${demandId} ${checklisted}, result: ${this.demands[demandId].checklisted}`);
		this.canSave = true;
	};
	
	@action ToggleDemand = (demand) => {
		demand.SetChecklisted(!demand.checklisted);
		this.canSave = true;
	};
	
	@action SetDemandsTo = (demandIds) => {
		this.ClearDemands();
		(demandIds || []).forEach(demandId => this.SetDemand(demandId, true));
	};
	
	@action ClearDemands = () => {
		this.demandsArray.forEach(d => d.SetChecklisted(false));
		this.canSave = true;
	};
	
	@action SaveChecklist = async () => {
		const checklist = this.demandsArray
			.filter(d => d.checklisted)
			.map(d => d.demandId);
		
		await this.gems.saveChecklist.Post({
			terpId: this.terpId,
			checklist: checklist,
		});
		
		runInAction(() => {
			this.canSave = false;
		})
	};
	
	@action CopyFromCompanyDemands = async (companyId) => {
		if (!companyId) return;
		
		const [demandIds, error] = await vow(
			Jewels().demands.GetCompanyDemands(companyId)
		);
		
		if (error) throw new Error(error);
		
		console.log(`CopyFromCompanyDemands ${companyId} `, demandIds);
		this.SetDemandsTo(demandIds);
	};
	
	@action CopyFromTerpChecklist = async (terpId) => {
		if (!terpId) return;
		
		const [checklist, error] = await vow(
			this.gems.getChecklist.Get({terpId: terpId})
		);
		
		if (error) throw new Error(error);
		
		console.log(`CopyFromTerpChecklist ${terpId} `, checklist);
		this.SetDemandsTo(checklist);
	};
	
}

export class ChecklistDemand {
	@observable demandId = 0;
	@observable name = '';
	@observable category = '';
	@observable notes = '';
	@observable credsRequired = [];
	
	@observable status = '';
	@observable checklisted = false;
	
	constructor(demand) {
		this.Construct(demand);
	}
	
	@action Construct = (demand) => {
		this.demandId = demand.demandId;
		this.name = demand.name;
		this.category = demand.category;
		this.notes = demand.notes;
		this.credsRequired = demand.credsRequired;
	}
	
	@action SetChecklisted = (checklisted) => this.checklisted = checklisted;
}

const CalculateDemandStatus = (demand, credData) => {
	if (DemandIsMet(demand, credData)) return demandStatus.VERIFIED;
	if (DemandIsPending(demand, credData)) return demandStatus.PENDING;
	if (DemandIsExpired(demand, credData)) return demandStatus.EXPIRED;
	return demandStatus.NONE;
};

const DemandIsMet = (demand, credData) => (demand.credsRequired || [])
	.some(inner => inner.every(credId => CredIsMet(credId, credData[credId])));

const DemandIsPending = (demand, credData) => (demand.credsRequired || [])
	.some(inner => inner.every(credId => CredIsMetOrPending(credId, credData[credId])));

const DemandIsExpired = (demand, credData) => (demand.credsRequired || [])
	.some(inner => inner.every(credId => CredIsMetOrExpired(credId, credData[credId])));

const CredIsMet = (credId, credDatum = {}) => credId === 0 || credDatum.hasValid;
const CredIsMetOrPending = (credId, credDatum = {}) => credId === 0 || credDatum.hasValid || credDatum.pending;
const CredIsMetOrExpired = (credId, credDatum = {}) => credId === 0 || credDatum.hasValid || credDatum.expired;

export const demandStatus = {
	NONE: 'NONE',
	PENDING: 'PENDING',
	EXPIRED: 'EXPIRED',
	VERIFIED: 'VERIFIED',
};

export const demandStatusDef = {
	NONE: {
		label: 'None',
		icon: undefined,
		hueBg: undefined,
		tooltip: ``,
	},
	PENDING: {
		label: 'Pending',
		icon: MdHourglassEmpty,
		hueBg: '#e8aef8',
		tooltip: `Has credentials that need verification`,
	},
	EXPIRED: {
		label: 'Expired',
		icon: TiCancel,
		hueBg: '#fd5464',
		tooltip: `Has expired credentials`,
	},
	VERIFIED: {
		label: 'Verified',
		icon: FaCheck,
		hueBg: '#87ad00',
		tooltip: `This demand is met!`,
	},
};

export function GetDemandStatusDef(status) {
	if (!status) return demandStatusDef.NONE;
	return demandStatusDef[status];
}