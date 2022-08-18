import {action, computed, observable} from 'mobx';
import type {TerpId, TerpKey} from '../../datum/stache/TerpDat';
import {CHAT_SPECIAL_TYPES, TerpChatDat} from '../../datum/stache/TerpChatDat';
import {Jewels, LocalStaff, Root, Staches} from '../../stores/RootStore';
import {CHAT_LIST_KEY, ChatSummaryDat} from '../../datum/stache/ChatSummaryDat';
import {BaseJewel} from '../BaseJewel';
import type {OutgoingChatAck, OutgoingChatMessage} from '../../datum/ChatMessage';
import {ChatMessage} from '../../datum/ChatMessage';

export class vChat extends BaseJewel {
	
	_SendMessage = (outgoing: OutgoingChatMessage) => this.jewels.oStaffChat.PostMessage(outgoing);
	_SendAck = (outgoing: OutgoingChatAck) => this.jewels.oStaffChat.PostAck(outgoing);
	
	
	@observable openTerpMap: Map<TerpKey, boolean> = new Map();
	
	@computed get openTerpKeys(): TerpKey[] {
		return [...this.openTerpMap.keys()];
	}
	
	@action OpenChat = (terpKey: TerpKey | TerpId) => {
		terpKey = String(terpKey);
		this.openTerpMap.set(terpKey, true);
		// TODO: horizontal limit?
	};
	
	@action CloseChat = (terpKey: TerpKey) => {
		console.log(`CloseChat: ${terpKey}`);
		this.openTerpMap.delete(terpKey);
	};
	
	
	@computed get unreadDat(): ChatSummaryDat {
		return Staches().cChatSummary.GetOrStub(CHAT_LIST_KEY.unread, true).dat;
	}
	
	@computed get unreadChatCount(): number {
		return this.unreadDat.terpKeys.length;
	}
	
	
	@action SendMessage = async (chatDat: TerpChatDat, message: string) => {
		const vJobUpdate = Jewels().vJobUpdate;
		const shouldRefJob = Root().prefs.chat.shouldRefJob;
		const staff = LocalStaff();
		
		let refId = undefined;
		let special = undefined;
		
		if (shouldRefJob && vJobUpdate.isOnPage) {
			refId = vJobUpdate.jobRef.jobId;
		}
		
		if (chatDat.needAck) {
			special = CHAT_SPECIAL_TYPES.needTerpAck;
		}
		
		if (!chatDat.key) { // not sure why this can happen
			console.error(`Chat SendMessage invalid key`, chatDat);
			throw new Error(`Chat SendMessage invalid key`);
		}
		
		const outgoing: OutgoingChatMessage = {
			terpId: chatDat.key,
			message: message,
			refId: refId,
			special: special,
			staffId: staff.staffId,
			staffName: staff.externalName,
			staffColor: staff.color,
			staffPhoto: staff.photo,
		};
		
		await this._SendMessage(outgoing);
		
		chatDat.SetNeedAck(false);
	};
	
	@action SendAck = (chatMessage: ChatMessage) => {
		this._SendAck({
			staffId: LocalStaff().staffId,
			terpId: chatMessage.terpId,
			chatId: chatMessage.chatId,
		});
	};
}