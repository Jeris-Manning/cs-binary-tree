import {action, computed, observable} from 'mobx';
import thyme from '../Bridge/thyme';
import type {ThymeDt} from '../Bridge/thyme';
import {CHAT_SPECIAL_TYPES} from './stache/TerpChatDat';
import {StaffDat} from './stache/StaffDat';
import {Staches} from '../stores/RootStore';
import type {TerpId, TerpKey} from './stache/TerpDat';
import type {StaffId} from './stache/StaffDat';

export type OutgoingChatMessage = {
	terpId: TerpId,
	message: string,
	refId: string,
	special: string,
	staffId: number,
	staffName: string,
	staffColor: string,
	staffPhoto: string,
}

export type OutgoingChatAck = {
	staffId: StaffId,
	terpId: TerpId,
	chatId: ChatMessageId,
}

export type ChatMessageId = number;

export class ChatMessage {
	
	@observable chatId: ChatMessageId;
	@observable terpId: TerpId;
	@observable terpKey: TerpKey;
	@observable staffId: string;
	@observable message: string;
	@observable sentAt: ThymeDt;
	@observable readAt: ThymeDt;
	@observable refId: string;
	@observable special: string[];
	@observable ackBy: string;
	
	/* calculated */
	@observable needTerpAck: boolean; // terp must acknowledge, will then set ackBy
	@observable isReceipt: boolean;
	
	
	constructor(entryRaw) { this.Construct(entryRaw);}
	
	@action Construct = (entryRaw) => {
		Object.assign(
			this,
			thyme.fast.obj.unpack(entryRaw)
		);
		
		this.special = (entryRaw.special || '').split(' ');
		
		for (let spec of this.special) {
			switch (spec) {
				case CHAT_SPECIAL_TYPES.needTerpAck:
					this.needTerpAck = true;
					break;
				
				case CHAT_SPECIAL_TYPES.receipt:
					this.isReceipt = true;
					break;
			}
		}
		
		this.terpKey = String(this.terpId);
	};
	
	@computed get isUnread(): boolean {
		return !this.staffId && !this.ackBy;
	}
	
	@computed get sentByStaff(): boolean {
		return !!this.staffId;
	}
	
	@computed get sentByTerp(): boolean {
		return !this.staffId;
	}
	
	@computed get waitingForTerpAck(): boolean {
		return this.needTerpAck && !this.ackBy;
	}
	
	@computed get hasTerpAck(): boolean {
		return this.needTerpAck && !!this.ackBy;
	}
	
	
	@computed get staffDat(): StaffDat {
		return Staches().cStaffById.GetOrStub(this.staffId, true).dat;
	}
}