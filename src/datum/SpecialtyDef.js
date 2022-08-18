export type SpecialtyKey = string;

export class SpecialtyDef {
	
	key: SpecialtyKey;
	specId: number;
	label: string;
	
	
	static MakeKey = (key: any): SpecialtyKey => `specialty_${key}`;
	static MakeDef = (rawRow): SpecialtyDef => new SpecialtyDef(rawRow)
	
	constructor(raw) {
		this.key = SpecialtyDef.MakeKey(raw.specId);
		this.specId = raw.specId;
		this.label = raw.label;
	}
}