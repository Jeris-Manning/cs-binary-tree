import {action, computed, observable} from 'mobx';
import {Updata} from '../Bridge/misc/Updata';
import {UpType} from '../Bridge/misc/UpType';


export class ContactUpdata {
	
	@observable contactId = UpType.String();
	@observable active = UpType.Bool();
	@observable prefix = UpType.String({charLimit: 3});
	@observable firstName = UpType.String({charLimit: 20});
	@observable lastName = UpType.String({charLimit: 30});
	@observable workPhone = UpType.String();
	@observable workExt = UpType.String({charLimit: 10});
	@observable homePhone = UpType.String();
	@observable mobilePhone = UpType.String();
	@observable fax = UpType.String();
	@observable email = UpType.String();
	@observable referredBy = UpType.String();
	@observable note = UpType.String();
	@observable companyId = UpType.Int();
	@observable createdAt = UpType.Thyme();
	@observable updatedAt = UpType.Thyme();
	@observable updatedBy = UpType.String();
	@observable internNote = UpType.String({charLimit: 200});
	
	@observable allKeys = [];
	@observable allStates = [];
	
	@computed get hasChanged() {
		return this.allStates.some(f => f.hasChanged);
	}
	
	@computed get errors() {
		return this.allStates.filter(f => f.error);
	}
	
	@computed get isValid() {
		return this.errors.length === 0;
	}
	
	constructor(contact) {
		this.Construct(contact);
	}
	
	@action Construct = (contact) => {
		Updata.Init(this, contact);
	};
	
	@action Apply = () => this.allStates.forEach(f => f.Apply());
	@action Revert = () => this.allStates.forEach(f => f.Revert());
	
	GetChanges = () => {
		return Updata.GetChanges(this);
	};
}
