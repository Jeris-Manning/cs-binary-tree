import {action, computed, observable} from 'mobx';
import thyme from '../../Bridge/thyme';
import type {DatKey} from '../../Bridge/DockClient/Stache';
import type {ThymeDt} from '../../Bridge/thyme';
import type {RegionId, RegionKey} from './RegionDat';
import {RegionEntry} from './RegionDat';
import {Staches} from '../../stores/RootStore';

export type LocationKey = string;
export type LocationId = number;

export class LocationDat {
	
	@observable key: DatKey;
	
	@observable locationId: string;
	@observable locationName: string;
	@observable address: string;
	@observable directions: string;
	@observable companyId: string;
	@observable city: string;
	@observable lat: string;
	@observable lng: string;
	@observable mapped: string;
	@observable streetNumber: string;
	@observable street: string;
	@observable locality: string;
	@observable state: string;
	@observable zip: string;
	@observable formatted: string;
	@observable placeId: string;
	@observable shortName: string;
	@observable lastUpdate: ThymeDt;
	@observable timeZone: string;
	@observable label: string = '⏳';
	
	@observable statRegion: number; // db.Regions.ID
	@observable terpRegion: RegionKey; // _db.region.id
	@observable terpRegionId: RegionId; // _db.region.id
	
	// @observable gMapLatLng;
	
	@action ApplyDatRaw = (datRaw) => {
		Object.assign(
			this,
			thyme.fast.obj.unpack(datRaw)
		);
		
		// if (this.lat) this.lat = Number(this.lat);
		// if (this.lng) this.lng = Number(this.lng);
		// if (this.lat && this.lng) {
		// 	this.gMapLatLng = new window.google.maps.LatLng(this.lat, this.lng);
		// }
		
		this.terpRegion = String(datRaw.terpRegion);
		this.terpRegionId = Number(datRaw.terpRegion);
	};
	
	constructor(key: DatKey) {this.key = key;}
	
	static Stub = (key: DatKey): LocationDat => new LocationDat(key);
	
	
	
	
	@computed get region(): RegionEntry {
		const cRegion = Staches().cRegion;
		const regionDat = cRegion.GetEnumClutch().dat;
		return regionDat.entryLup[this.terpRegion] || {};
	}
}