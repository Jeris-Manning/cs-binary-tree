import {action, computed, observable} from 'mobx';
import {Upstate} from '../Bridge/misc/Upstate';
import {Updata} from '../Bridge/misc/Updata';
import {UpType} from '../Bridge/misc/UpType';
import {COMPANY_CONTRACT_CHOICES} from './stache/CompanyDat';


export class CompanyUpdata {
	
	@observable companyId = UpType.String();
	@observable active = UpType.Bool();
	@observable name = UpType.String();
	@observable address = UpType.String();
	@observable address2 = UpType.String();
	@observable city = UpType.String();
	@observable state = UpType.String();
	@observable zip = UpType.String();
	@observable phone = UpType.String();
	@observable fax = UpType.String();
	@observable updatedOn = UpType.Thyme();
	@observable lastUser = UpType.String();
	@observable defaultLoc = UpType.String();
	// @observable rate = UpType.String({
	// 	isRequired: true
	// });
	@observable rate = UpType.String().Required();
	@observable cap = UpType.String();
	@observable capVri = UpType.String();
	@observable class = UpType.String();
	@observable note = UpType.String();
	@observable demandIds = UpType.Array();
	@observable sheetFields = UpType.ExoticJson();
	@observable medicalRecordId = UpType.Int();
	@observable hasAttachment = UpType.Bool();
	@observable notesForTerp = UpType.String();
	
	@observable contractType = UpType.Enum(COMPANY_CONTRACT_CHOICES);
	@observable contractExpire = UpType.String();
	@observable files = UpType.Array();
	
	
	@observable allKeys = [];
	@observable allStates = [];
	
	@computed get hasChanged() {
		return this.allStates.some(u => u.hasChanged);
	}
	
	@computed get errors() {
		return this.allStates.filter(u => u.error);
	}
	
	@computed get isValid() {
		return this.errors.length === 0;
	}
	
	constructor(company) {
		this.Construct(company);
	}
	
	@action Construct = (company) => Updata.Init(this, company);
	
	@action Apply = () => this.allStates.forEach(f => f.Apply());
	@action Revert = () => this.allStates.forEach(f => f.Revert());
	
	GetChanges = () => Updata.GetChanges(this);
}
