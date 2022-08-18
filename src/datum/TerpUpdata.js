import {action, computed, observable} from 'mobx';
import {Upstate} from '../Bridge/misc/Upstate';
import {Updata} from '../Bridge/misc/Updata';
import {UpType} from '../Bridge/misc/UpType';

export class TerpUpdata {
	
	@observable terpId = UpType.String();
	@observable firstName = UpType.String();
	@observable middleName = UpType.String();
	@observable lastName = UpType.String();
	@observable email = UpType.String();
	@observable pagerEmail = UpType.String();
	@observable birthday = UpType.String({
		initializer: v => !v ? ''
			: v.includes('1900') ? ''
			: v.split('T')[0]
	});
	@observable phone = UpType.String();
	@observable address = UpType.String();
	@observable address2 = UpType.String();
	@observable city = UpType.String();
	@observable state = UpType.String();
	@observable zip = UpType.String();
	@observable lat = UpType.String();
	@observable lng = UpType.String();
	@observable salary = UpType.String();
	@observable memo = UpType.String();
	@observable temp = UpType.Bool();
	@observable active = UpType.Bool();
	@observable companyName = UpType.String();
	@observable intern = UpType.String();
	@observable rid = UpType.String();
	@observable medica = UpType.String();
	@observable fairview = UpType.String();
	@observable vacationStart = UpType.Thyme();
	@observable vacationEnd = UpType.Thyme();
	@observable rateDay = UpType.Float();
	@observable rateEw = UpType.Float();
	@observable rateDb = UpType.Float();
	@observable rateLegal = UpType.Float();
	@observable rateEr = UpType.Float();
	@observable rateMhc = UpType.Float();
	@observable rateVri = UpType.Float();
	@observable teammates = UpType.String();
	@observable ssn = UpType.String();
	@observable note = UpType.String();
	@observable isFake = UpType.Bool();
	
	@observable tags = UpType.Array();
	@observable regions = UpType.Array();
	
	@observable createdOn = UpType.Thyme();
	@observable updatedOn = UpType.Thyme();
	@observable lastUser = UpType.String();
	
	@observable appLoginAt = UpType.String();
	@observable appVersion = UpType.String();
	@observable appInfo = UpType.String();
	
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
	
	constructor(terp) {
		this.Construct(terp);
	}
	
	@action Construct = (terp) => {
		Updata.Init(this, terp);
	};
	
	@action Apply = () => this.allStates.forEach(f => f.Apply());
	@action Revert = () => this.allStates.forEach(f => f.Revert());
	
	GetChanges = () => {
		return Updata.GetChanges(this);
	};
	
	
	@action SelectAddress = (raw) => {
		console.log(`Select Location Raw: `, raw);
		
		const location = ConvertToLocation(raw);
		
		Object.keys(location).forEach(key => {
			this[key].Change(location[key]);
		});
		
		console.log(`Converted: `, location);
	};
}

function ConvertToLocation(raw) {
	const parts = raw.address_components;
	return {
		address: `${GetPart(parts, 'street_number')} ${GetPart(parts, 'route')}`,
		city: GetPart(parts, 'locality'),
		state: GetPart(parts, 'administrative_area_level_1'),
		zip: GetPart(parts, 'postal_code'),
		lat: raw.geometry.location.lat(),
		lng: raw.geometry.location.lng(),
	};
}

function GetPart(parts, type) {
	const result = parts.find(c => c.types[0] === type);
	return result ? result.long_name : '';
}

