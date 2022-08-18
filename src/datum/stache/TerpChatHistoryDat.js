import {action, computed, observable} from 'mobx';
import {ChatMessage} from '../ChatMessage';
import type {TerpKey} from './TerpDat';

export type C_TerpChatHistoryDat = {
	chatDat: TerpChatHistoryDat,
}

export class TerpChatHistoryDat {
	
	@observable key: TerpKey;
	@observable messages: ChatMessage[] = [];
	
	@action ApplyDatRaw = (datRaw) => {
		this.messages = datRaw.map(entryRaw => (
			new ChatMessage(entryRaw)
		));
	};
	
	constructor(key: TerpKey) {this.key = key;}
	static Stub = (key: TerpKey): TerpChatHistoryDat => new TerpChatHistoryDat(key);
}