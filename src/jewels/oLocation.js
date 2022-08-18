import {action, observable, runInAction} from 'mobx';
import {LocUpstate} from '../datum/LocUpstate';
import {WiseGem} from '../Bridge/jewelerClient/WiseGem';
import {vow} from '../Bridge/misc/$j';
import {BaseJewel} from './BaseJewel';

function addLabelToLocation(loc) {
	loc.label = `${loc.locationName ? `${loc.locationName} ` : ''}${loc.formatted || loc.address || `? ${loc.city}`}`;
	return loc;
}

export class oLocation extends BaseJewel {
	gems = {
		getLocationsForJob: new WiseGem(),
		getLocationsForCompany: new WiseGem(),
		removeLocation: new WiseGem(),
		getLocation: new WiseGem(),
		addLocation: new WiseGem(),
		postChanges: new WiseGem(),
		// copyLocationToCompany: new WiseGem(),
	};
	
	@action GetLocationsForJob = (jobId) => {
		if (!jobId) return [];
		
		return this.gems.getLocationsForJob.Get({jobId: jobId});
	};
	
	@action GetLocationsForCompany = (companyId, showInactive = false) => {
		if (!companyId) return [];
		
		return this.gems.getLocationsForCompany.Get({
			companyId: companyId,
			showInactive: showInactive,
		});
	};
	
	@action RemoveLocation = (locationId, companyId) => {
		return this.gems.removeLocation.Post({locationId: locationId, companyId: companyId});
	};
	
	/* LOC EDITOR */
	
	@observable locUpstate = new LocUpstate({});
	@observable locEditorOpen = false;
	@observable isSaving = false;
	afterLocSave;
	
	@action OpenLocEditor = (loc, companyId, afterSave) => {
		const location = {
			...loc,
			companyId: companyId,
		};
		
		console.log(`OpenLocEditor`, location);
		
		this.locUpstate = new LocUpstate(location);
		this.locEditorOpen = true;
		this.afterLocSave = afterSave;
	};
	@action CloseLocEditor = () => this.locEditorOpen = false;
	
	@action SaveLocEditor = async () => {
		this.isSaving = true;
		
		const changes = this.locUpstate.GetChanges();
		
		let locationId = this.locUpstate.locationId.value;
		
		if (locationId) {
			await this.PostChanges(locationId, changes, this.locUpstate.companyId.value);
		} else {
			locationId = await this.AddLocation(this.locUpstate.companyId.value, changes);
		}
		
		if (this.afterLocSave) {
			await this.afterLocSave(locationId);
		}
		
		runInAction(() => {
			this.isSaving = false;
		});
		
		this.CloseLocEditor();
	};
	
	AddLocation = async (companyId, location) => {
		const [locationId, error] = await vow(
			this.gems.addLocation.Post({
				companyId: companyId,
				location: location,
			})
		);
		
		if (error) throw new Error(error);
		
		return locationId;
	}
	
	PostChanges = async (locationId, changes, companyId) => {
		const [_, error] = await vow(
			this.gems.postChanges.Post({
				locationId: locationId,
				changes: changes,
				companyId: companyId,
			})
		);
		
		if (error) throw new Error(error);
		
		return locationId;
	}
	
	GetLocation = async (locationId) => {
		return this.gems.getLocation.Get({locationId: locationId});
	};
	
	// @action CopyLocationToCompany = async (companyId, locationId) => {
	// 	return this.gems.copyLocationToCompany.Post({
	// 		companyId: companyId,
	// 		locationId: locationId,
	// 	});
	// }
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
// placeID: 'Location.PlaceID',
// locationName: 'Location.LocationName',