import {action, observable} from 'mobx';
import thyme from '../../Bridge/thyme';
import type {ThymeDt} from '../../Bridge/thyme';
import type {IdKey} from '../../Bridge/misc/UpType';
import {TerpTagEntry} from './TerpTagDat';
import {TerpSpecialtyEntry} from './TerpSpecialtyDat';
import type {TerpTagKey} from './TerpTagDat';
import type {RegionKey} from './RegionDat';
import type {SpecialtyKey} from './TerpSpecialtyDat';
import $j from '../../Bridge/misc/$j';
import {RegionEntry} from './RegionDat';
import {SeekTerpInfo} from '../SeekTerpInfo';
import {JobRef} from '../../pages/Job/JobUpdate/JobRef';

export type TerpKey = string;
export type TerpId = number;
export type C_TerpDat = {
	terpDat: TerpDat,
};
export type C_SeekTerpInfo = {
	jobRef: JobRef,
	seekTerpInfo: SeekTerpInfo,
};

export class TerpDat {
	
	@observable key: TerpKey;
	@observable terpId: number;
	@observable active: boolean;
	@observable firstName: string = '';
	@observable lastName: string = '';
	@observable phone: string;
	@observable region: string;
	@observable specialty: string;
	
	@observable address: string;
	@observable city: string;
	@observable state: string;
	@observable zip: string;
	@observable lat: number;
	@observable lng: number;
	
	@observable birthday: string;
	@observable email: string;
	@observable pagerEmail: string;
	@observable temp: boolean;
	@observable memo: string;
	
	@observable rateDay: string;
	@observable rateEw: string;
	@observable rateDb: string;
	@observable rateLegal: string;
	@observable rateEr: string;
	@observable rateMhc: string;
	@observable rateVri: string;
	@observable rateSummary: string[];
	
	@observable medicaId: string;
	@observable fairviewId: string;
	@observable teammates: string;
	
	@observable fullName: string; // TODO: remove
	@observable terpName: string; // TODO: remove
	
	@observable label: string = '⏳';
	
	@observable note: string;
	@observable tags: TerpTagKey[];
	@observable regions: RegionKey[];
	@observable specialties: SpecialtyKey[];
	@observable appLoginAt: ThymeDt;
	@observable appVersion: string;
	@observable appInfo: string;
	@observable privacyPhoto: string;
	@observable privacyName: string;
	@observable privacyTeam: string;
	@observable appPrefs: string;
	@observable isIntern: boolean;
	@observable isStaff: boolean;
	@observable isFake: boolean;
	
	// @observable gMapLatLng;
	
	@observable noteWithBreaks: string;
	@observable noteArray: string[];
	@observable tagLup: {[TerpTagKey]: boolean} = {};
	@observable regionLup: {[RegionKey]: boolean} = {};
	@observable specialtyLup: {[SpecialtyKey]: boolean} = {};
	
	@action ApplyDatRaw = (datRaw) => {
		Object.assign(
			this,
			thyme.fast.obj.unpack(datRaw)
		);
		
		this.rateSummary = [
			`Rates`,
			`Day: ${this.rateDay}`,
			`EW: ${this.rateEw}`,
			`DB: ${this.rateDb}`,
			`Legal: ${this.rateLegal}`,
			`ER: ${this.rateEr}`,
			`MHC: ${this.rateMhc}`,
			`VRI: ${this.rateVri}`,
		];
		
		// if (this.lat && this.lng) {
		// 	this.gMapLatLng = new window.google.maps.LatLng(this.lat, this.lng);
		// }
		
		this.noteWithBreaks = (this.note || '').replace(/(?:\r\n|\r|\n)/g, '<br>');
		this.noteArray = this.noteWithBreaks.split('<br>');
		this.tagLup = $j.mapToHasLup(this.tags || []);
		this.regionLup = $j.mapToHasLup(this.regions || []);
		this.specialtyLup = $j.mapToHasLup(this.specialties || []);
	};
	
	constructor(key: TerpKey) {this.key = key;}
	
	static Stub = (key: TerpKey): TerpDat => new TerpDat(key);
	
	
	
	
	
	
	
	/* sugar */
	
	HasTag = (tagEntry: TerpTagEntry) => this.tagLup[tagEntry.key];
	MissingTag = (tagEntry: TerpTagEntry) => !this.tagLup[tagEntry.key];
	
	HasRegion = (regionEntry: RegionEntry) => this.regionLup[regionEntry.key];
	MissingRegion = (regionEntry: RegionEntry) => !this.regionLup[regionEntry.key];
	
	HasSpecialty = (specialtyEntry: TerpSpecialtyEntry) => this.specialtyLup[specialtyEntry.key];
	MissingSpecialty = (specialtyEntry: TerpSpecialtyEntry) => !this.specialtyLup[specialtyEntry.key];
}