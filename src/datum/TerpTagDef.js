import {GetTagIcon} from '../pages/Job/Seeking/SeekTerpTags';

export type TerpTagKey = string;

// TODO: remove this in favor of TerpTagDat
export class TerpTagDef {
	
	key: TerpTagKey;
	tagId: number;
	label: string;
	description: string;
	showSeek: boolean;
	defaultStatus: 'unset'|'banned'|'required';
	order: number;
	icon: any;
	
	static MakeKey = (key: any): TerpTagKey => `terpTag_${key}`;
	static MakeDef = (rawRow): TerpTagDef => new TerpTagDef(rawRow)
	
	constructor(raw) {
		this.key = TerpTagDef.MakeKey(raw.tagId);
		this.tagId = raw.tagId;
		this.label = raw.tag;
		this.description = raw.description;
		this.showSeek = raw.showSeek;
		this.defaultStatus = raw.defaultStatus || 'unset';
		this.order = raw.order;
		this.icon = GetTagIcon(raw.tagId);
	}
}