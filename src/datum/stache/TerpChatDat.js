import {action, computed, observable} from 'mobx';
import {ChatMessage} from '../ChatMessage';
import type {TerpId, TerpKey} from './TerpDat';

export const CHAT_SPECIAL_TYPES = {
	needTerpAck: 'NEED_ACK',
	receipt: 'RECEIPT',
};

export type C_TerpChatDat = {
	chatDat: TerpChatDat,
}

export class TerpChatDat {
	
	@observable key: TerpKey;
	@observable messages: ChatMessage[] = [];
	
	@action ApplyDatRaw = (datRaw) => {
		this.messages = datRaw.map(entryRaw => (
			new ChatMessage(entryRaw)
		));
	};
	
	constructor(key: TerpKey) {this.key = key;}
	static Stub = (key: TerpKey): TerpChatDat => new TerpChatDat(key);
	
	
	@computed get hasUnread(): boolean {
		return this.messages.some(m => m.isUnread);
	}
	
	
	// TODO: move
	// need 1 per chat window
	@observable needAck: boolean = false;
	@action SetNeedAck = (needAck) => this.needAck = needAck;
}