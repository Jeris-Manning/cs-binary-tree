import {computed, observable} from 'mobx';
import {TerpDat, TerpKey} from './stache/TerpDat';
import {TerpDemandsDat} from './stache/TerpDemandsDat';
import {SeekerEntry} from './stache/JobSeekDat';
import {Staches} from '../stores/RootStore';
import {JobRef} from '../pages/Job/JobUpdate/JobRef';
import type {DeafKey} from './stache/DeafDat';
import type {DemandKey} from './stache/DemandDat';
import type {TerpTagKey} from './stache/TerpTagDat';
import type {SeekerFilterKey} from './SeekerFiltersDef';
import {NowTerpEntry} from './stache/NowTerpDat';
import {$m} from '../Bridge/misc/$m';

const DEFAULT_DISTANCE = 999999;

export class SeekTerpInfo {
	
	@observable key: TerpKey;
	@observable jobRef: JobRef;
	
	constructor(key: TerpKey, jobRef: JobRef) {
		this.key = String(key);
		this.jobRef = jobRef;
	}
	
	@computed get terpDat(): TerpDat {
		return Staches().cTerp.GetOrStub(this.key, true, 'SeekTerpInfo').dat;
	}
	
	@computed get terpDemandsDat(): TerpDemandsDat {
		return Staches().cTerpDemands.GetOrStub(this.key, true, 'SeekTerpInfo').dat;
	}
	
	@computed get isStaff(): boolean {
		return this.terpDat.isStaff;
	}
	
	@computed get distance(): number | undefined {
		if (!this.jobRef) return;
		
		const loc = this.jobRef.location;
		if (!loc.lat || !loc.lng) return;
		
		const terp = this.terpDat;
		if (!terp.lat || !terp.lng) return DEFAULT_DISTANCE;
		
		const meters = $m.DistanceBetween(
			Number(loc.lat),
			Number(loc.lng),
			Number(terp.lat),
			Number(terp.lng)
		);
		return $m.MetersToMiles(meters);
	}
	
	@computed get seeker(): SeekerEntry | undefined {
		if (!this.jobRef) return;
		return this.jobRef.seekDat.terpSeekers.get(this.key);
	}
	
	@computed get nowTerp(): NowTerpEntry {
		if (!this.jobRef) return;
		return this.jobRef.terpNowTerpEntries.get(this.key);
	}
	
	/*
		FILTERS  ---------------------------------------
		
		return failures
		
		if empty array, pass
	
	 */
	
	
	@computed get prefFails(): DeafKey[] {
		if (!this.jobRef) return [];
		
		const deafPrefs = this.jobRef.deafPrefs;
		
		return mapLabelsIf(
			deafPrefs,
			prefClutch => prefClutch.dat.noTerps.includes(this.key),
		);
	}
	
	@computed get demandFails(): DemandKey[] {
		if (!this.jobRef) return [];
		
		const demandsNeeded = this.jobRef.demandsNeeded;
		const terp = this.terpDemandsDat;
		
		return mapLabelsIf(
			demandsNeeded,
			terp.Missing,
		);
	}
	
	@computed get requiredTagFails(): TerpTagKey[] {
		if (!this.jobRef) return [];
		
		const tags = this.jobRef.tagsRequired;
		const terp = this.terpDat;
		
		return mapLabelsIf(
			tags,
			terp.MissingTag,
		);
	}
	
	@computed get bannedTagFails(): TerpTagKey[] {
		if (!this.jobRef) return [];
		
		const tags = this.jobRef.tagsBanned;
		const terp = this.terpDat;
		
		return mapLabelsIf(
			tags,
			terp.HasTag,
		);
	}
	
	@computed get regionFails(): any[] {
		if (!this.jobRef) return [];
		
		const regions = this.jobRef.regionsRequired;
		const terp = this.terpDat;
		
		return mapLabelsIfAll(
			regions,
			terp.MissingRegion,
		);
	}
	
	@computed get specialtyFails(): any[] {
		if (!this.jobRef) return [];
		
		const specialties = this.jobRef.specialtiesRequired;
		const terp = this.terpDat;
		
		return mapKeysIf(
			specialties,
			terp.MissingSpecialty,
		);
	}
	
	
	@computed get requiredSeekerCriteriaFails(): SeekerFilterKey[] {
		if (!this.jobRef) return [];
		
		const seekerCriteria = this.jobRef.seekerCriteriaRequired;
		const seeker = this.seeker;
		
		return mapLabelsIf(
			seekerCriteria,
			filter => !filter.hasCriteria(seeker), // fail if missing
		);
	}
	
	@computed get bannedSeekerCriteriaFails(): SeekerFilterKey[] {
		if (!this.jobRef) return [];
		
		const seekerCriteria = this.jobRef.seekerCriteriaBanned;
		const seeker = this.seeker;
		
		return mapLabelsIf(
			seekerCriteria,
			filter => filter.hasCriteria(seeker), // fail if has
		);
	}
	
	@computed get nowTerpFails(): string[] {
		if (!this.jobRef) return [];
		
		const hasNowTerpEntry = !!this.nowTerp;
		const nowTerpCriteria = this.jobRef.nowTerpCriteria;
		
		switch (nowTerpCriteria) {
			case 'unset':
				return [];
			case 'required':
				return hasNowTerpEntry ? [] : ['no NowTerp shift'];
			case 'banned':
				return hasNowTerpEntry ? ['has NowTerp shift'] : [];
			default:
				return [];
		}
	}
	
	// TODO: nowTerp filter
	
	@computed get canPick(): boolean {
		return this.jobRef
			&& this.prefFails.length === 0
			&& this.demandFails.length === 0
			&& this.requiredTagFails.length === 0
			&& this.bannedTagFails.length === 0
			&& this.regionFails.length === 0
			&& this.specialtyFails.length === 0
			&& this.requiredSeekerCriteriaFails.length === 0
			&& this.bannedSeekerCriteriaFails.length === 0
			&& this.nowTerpFails.length === 0;
	}
}


function mapKeysIf<TObj, TKey>(objArr: TObj[], if_: (TObj) => boolean) {
	const keys = [];
	for (const obj of objArr) {
		if (if_(obj)) keys.push(obj.key);
	}
	return keys;
}

function mapLabelsIf<TObj, TKey>(objArr: TObj[], if_: (TObj) => boolean) {
	const labels = [];
	for (const obj of objArr) {
		// if (if_(obj)) labels.push(obj.label);
		if (if_(obj)) labels.push(obj.label || '❌');
	}
	return labels;
}

function mapLabelsIfAll<TObj, TKey>(objArr: TObj[], if_: (TObj) => boolean) {
	const labels = [];
	for (const obj of objArr) {
		// if (if_(obj)) labels.push(obj.label);
		if (if_(obj)) {
			labels.push(obj.label || '❌');
		} else {
			return [];
		}
	}
	return labels;
}