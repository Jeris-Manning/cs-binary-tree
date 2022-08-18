import {action, computed, observable} from 'mobx';
import {Updata} from '../Bridge/misc/Updata';
import {UpType} from '../Bridge/misc/UpType';

// TODO: update this

export class LocUpstate {
	
	@observable locationId = UpType.Int();
	@observable locationName = UpType.String();
	@observable address = UpType.String();
	@observable directions = UpType.String();
	@observable companyId = UpType.String();
	@observable city = UpType.String();
	@observable lat = UpType.String();
	@observable lng = UpType.String();
	@observable mapped = UpType.String();
	@observable streetNumber = UpType.String();
	@observable street = UpType.String();
	@observable locality = UpType.String();
	@observable state = UpType.String();
	@observable zip = UpType.String();
	@observable formatted = UpType.String();
	@observable placeId = UpType.String();
	@observable shortName = UpType.String();
	@observable lastUpdate = UpType.Thyme();
	@observable timeZone = UpType.String();
	
	@observable statRegion = UpType.Int(); // TODO properly
	@observable terpRegion = UpType.Int(); // TODO properly
	
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
	
	constructor(loc) {
		this.Construct(loc);
	}
	
	@action Construct = (loc) => {
		Updata.Init(this, loc);
		
		this.shortName.SetInitialValue(this.locationName.value);
		if (!this.timeZone.value) this.timeZone.SetInitialValue('America/Chicago');
		if (!this.formatted.value) this.formatted.SetInitialValue(loc.address);
	};
	
	@action Apply = () => this.allStates.forEach(f => f.Apply());
	@action Revert = () => this.allStates.forEach(f => f.Revert());
	
	
	GetChanges = () => {
		let changes = Updata.GetChanges(this);
		
		changes.locationName = this.shortName.value;
		changes.city = this.locality.value;
		changes.address = this.GetLegacyAddress();
		
		return changes;
	};
	
	GetLegacyAddress = () => {
		const locationName = this.locationName.value;
		const formatted = this.formatted.value;
		const locality = this.locality.value;
		
		if (locationName) return `${locationName} ${formatted || ''}`;
		
		return formatted || locality || 'blank';
	}
	
	@action Select = (raw) => {
		console.log(`Select Location Raw: `, raw);
		
		const location = ConvertToLocation(raw);
		
		Object.keys(location).forEach(key => {
			// this[key].Init(location[key]);
			this[key].Change(location[key]);
		});
		
		console.log(`Converted: `, location);
	};
}

function ConvertToLocation(raw) {
	const parts = raw.address_components;
	return {
		lat: raw.geometry.location.lat(),
		lng: raw.geometry.location.lng(),
		streetNumber: GetPart(parts, 'street_number'),
		street: GetPart(parts, 'route'),
		locality: GetPart(parts, 'locality'),
		state: GetPart(parts, 'administrative_area_level_1'),
		zip: GetPart(parts, 'postal_code'),
		formatted: raw.formatted_address,
		placeId: raw.place_id,
		locationName: GetLocationName(parts, raw.formatted_address),
		mapped: GetMapped(parts, raw.geometry.location_type),
	};
}

// if (!Number.isInteger(data.Zip)) data.Zip = '';

function GetPart(parts, type) {
	const result = parts.find(c => c.types[0] === type);
	return result ? result.long_name : '';
}


function GetLocationName(parts, formatted) {
	const streetNumber = GetPart(parts, 'street_number');
	
	if (streetNumber) {
		const indexOfStreet = formatted.indexOf(streetNumber);
		
		return (indexOfStreet > 0 ? formatted.substring(0, indexOfStreet) : formatted)
			.replace('\r', '')
			.replace('\n', '');
	}
	
	const indexOfFirstComma = formatted.indexOf(',');
	
	if (indexOfFirstComma > 0) {
		return formatted.substring(0, indexOfFirstComma);
	}
	
	return '';
}

function GetMapped(parts, locType) {
	if (GetPart(parts, 'country') !== 'United States') return 'international';
	if (locType === 'APPROXIMATE') return 'approximate';
	if (locType === 'RANGE_INTERPOLATED') return 'intersection';
	if (locType === 'GEOMETRIC_CENTER') return 'geocenter';
	return 'done';
}

// locationId: 'Location.LocationID',
// address: 'Location.Address',
// directions: 'Location.Directions',
// companyID: 'Location.CompanyID',
// city: 'Location.City',
// latitude: 'Location.Latitude',
// longitude: 'Location.Longitude',
// mapped: 'Location.Mapped',
// streetNumber: 'Location.StreetNumber',
// street: 'Location.Street',
// locality: 'Location.Locality',
// state: 'Location.State',
// zip: 'Location.Zip',
// formatted: 'Location.Formatted',
// placeId: 'Location.PlaceID',
// locationName: 'Location.LocationName',