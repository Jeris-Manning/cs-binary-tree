import {action, observable} from 'mobx';
import type {DatKey} from '../../Bridge/DockClient/Stache';
import type {TerpKey} from './TerpDat';

export const CHAT_LIST_KEY = {
	unread: 'unread',
	// waiting: 'waiting', // TODO ack is broken or is forgotten
	recentAll: 'recentAll',
};

export class ChatSummaryDat {
	
	@observable key: DatKey; // listKey OR staffIdKey
	@observable terpKeys: TerpKey[] = [];
	
	
	@action ApplyDatRaw = (datRaw) => {
		Object.assign(this, datRaw);
	};
	
	constructor(key: DatKey) {this.key = key;}
	
	static Stub = (key: DatKey): ChatSummaryDat => new ChatSummaryDat(key);
}