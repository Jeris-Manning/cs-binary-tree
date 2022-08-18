import {observer} from 'mobx-react';
import React from 'react';
import {action, computed} from 'mobx';
import type {JobKey} from '../../datum/stache/JobDat';
import {MiniConfig} from '../ToggleRow';
import {Jewels, Root, USER_PREFS} from '../../stores/RootStore';
import type {C_TerpChatDat} from '../../datum/stache/TerpChatDat';
import {TerpChatDat} from '../../datum/stache/TerpChatDat';


@observer
export class ChatConfigJobRef extends React.Component<C_TerpChatDat> {
	
	@computed get currentJobKey(): JobKey | undefined {
		const vJobUpdate = Jewels().vJobUpdate;
		return (vJobUpdate.jobRef || {}).jobKey;
	}
	
	@computed get shouldRefJob(): boolean {
		return Root().prefs.chat.shouldRefJob;
	}
	
	@action Toggle = () => Root().TogglePref(USER_PREFS.chat, USER_PREFS.chat.shouldRefJob);
	
	render() {
		if (!this.currentJobKey) return <></>;
		
		return (
			<MiniConfig
				onToggle={this.Toggle}
				isChecked={this.shouldRefJob}
				label={`ref: #${this.currentJobKey}`}
				tooltip={[
					`Reference this job number inside the chat message.`,
					`If the job is currently assigned to the terp, they can tap the ID to view the job details.`,
					`If the job is posted to their request/open job board, they can tap the ID to view the info/bid screen.`,
					`If neither of those are true, tapping the ID will do nothing (they don't have permission to view the job).`
				]}
			/>
		);
		
	}
}

@observer
export class ChatConfigNeedAck extends React.Component<C_TerpChatDat> {
	render() {
		const chatDat: TerpChatDat = this.props.chatDat;
		
		return (
			<MiniConfig
				onToggle={() => chatDat.SetNeedAck(!chatDat.needAck)}
				isChecked={chatDat.needAck}
				label={`Must Acknowledge`}
				tooltip={`Require terp to acknowledge they've read this.`}
			/>
		);
		
	}
}