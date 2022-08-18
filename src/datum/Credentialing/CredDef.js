
export type CredKey = string;

export class CredDef {
	key: CredKey;
	credId: number;
	enabled: boolean = true;
	
	name: string = '';
	description: string = '';
	expires: string = '';
	category: string = '';
	tooltip: string = '';
	importantInfo: string = '';
	
	static MakeKey = (key: any) : CredKey => `cred_${key}`;
	static MakeDef = (rawRow) : CredDef => new CredDef(rawRow);
	
	constructor(raw) {
		Object.assign(this, raw);
		
		this.key = CredDef.MakeKey(raw.credId);
		this.credId = Number(raw.credId);
	}
}