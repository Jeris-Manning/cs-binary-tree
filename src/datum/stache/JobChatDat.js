import {action, observable} from 'mobx';
import {ChatMessage} from '../ChatMessage';
import type {JobKey} from './JobDat';
import type {TerpKey} from './TerpDat';

export class JobChatDat {
	
	@observable key: JobKey;
	@observable chats: Map<TerpKey, ChatMessage[]> = new Map();
	
	@action ApplyDatRaw = (datRaw) => {
		for (const messageRaw of datRaw) {
			const message: ChatMessage = new ChatMessage(messageRaw);
			
			const messages = this.chats.get(message.terpKey) || [];
			messages.push(message);
			this.chats.set(message.terpKey, messages);
		}
	};
	
	constructor(key: JobKey) {this.key = key;}
	static Stub = (key: JobKey): JobChatDat => new JobChatDat(key);
}