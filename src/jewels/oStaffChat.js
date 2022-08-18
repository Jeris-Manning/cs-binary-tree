import type {OutgoingChatMessage} from '../datum/ChatMessage';
import {OutgoingChatAck} from '../datum/ChatMessage';
import {WiseGem} from '../Bridge/jewelerClient/WiseGem';
import {BaseJewel} from './BaseJewel';

export class oStaffChat extends BaseJewel {
	gems = {
		postMessage: new WiseGem('terpId'),
		postAck: new WiseGem('terpId'),
	};
	
	PostMessage = (outgoing: OutgoingChatMessage) => this.gems.postMessage.Post(outgoing);
	PostAck = (outgoing: OutgoingChatAck) => this.gems.postAck.Post(outgoing);
}