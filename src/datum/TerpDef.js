import $j, {is} from '../Bridge/misc/$j';
import {DefLup} from '../misc/DefinitionClasses';
import type {TerpTagKey} from './TerpTagDef';
import {TerpTagDef} from './TerpTagDef';
import {SpecialtyDef} from './SpecialtyDef';
import type {TerpKey} from './stache/TerpDat';

export type SpecialtyKey = string;

export class TerpDef {
	
	key: TerpKey;
	terpId: number;
	enabled: boolean = true;
	
	firstName: string;
	lastName: string;
	email: string;
	phone: string;
	
	searchString: string;
	tags: DefLup<TerpTagKey, TerpTagDef> = new DefLup();
	specs: DefLup<SpecialtyKey, SpecialtyDef> = new DefLup();
	
	
	rateDay: number; // 'DRate'
	rateEw: number; // 'EWRate'
	rateDb: number; // 'DBRate'
	rateLegal: number; // 'LegalRate'
	rateEr: number; // 'ER'
	rateMhc: number; // 'MHCRate'
	rateVri: number; // 'VRIRate'
	
	
	static MakeKey = (key: any): TerpKey => `terp_${key}`;
	static MakeDef = (rawRow): TerpDef => new TerpDef(rawRow)
	
	constructor(raw) {
		Object.assign(this, raw);
		
		this.key = TerpDef.MakeKey(raw.terpId);
		this.terpId = Number(raw.terpId);
		
		this.searchString = $j.generateSearchString(
			this.firstName,
			this.lastName,
		);
	}
	
	
	AddTag = (tagDef: TerpTagDef) => this.tags.Add(tagDef);
	AddSpec = (specDef: SpecialtyDef) => this.specs.Add(specDef);
}