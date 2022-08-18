import React from 'react';
import {observer} from 'mobx-react';
import {Row, Txt} from '../../Bridge/Bricks/bricksShaper';
import type {C_JobCard} from './JobUpdate/JobBasics';
import {JobCard} from './JobUpdate/JobBasics';
import type {C_TerpDat, TerpKey} from '../../datum/stache/TerpDat';
import {SimHeader} from '../../Bridge/misc/Card';
import {Jewels, Staches} from '../../stores/RootStore';
import {ChatMessage} from '../../datum/ChatMessage';
import {JobChatDat} from '../../datum/stache/JobChatDat';


@observer
export class ChatCard extends React.Component<C_JobCard> {
	render() {
		const jobRef: JobRef = this.props.jobRef;
		const chatDat: JobChatDat = jobRef.chatDat;
		const chats = chatDat.chats;
		
		return (
			<JobCard>
				<SimHeader header={'Chats'}/>
				
				{chats.size === 0 ? (
					<Txt>no chats reference this job</Txt>
				) : (
					[...chats.entries()].map(([terpKey, messages]) => (
						<ChatCardRow
							key={terpKey}
							terpKey={terpKey}
							messages={messages}
						/>
					))
				)}
			</JobCard>
		);
	}
}

@observer
export class ChatCardRow extends React.Component {
	
	render() {
		const terpKey: TerpKey = this.props.terpKey;
		const messages: ChatMessage[] = this.props.messages;
		const terpDat: TerpDat = Staches().cTerp.GetOrStub(terpKey, true, 'Job ChatCardRow');
		
		return (
			<Row
				onClick={() => Jewels().vChat.OpenChat(terpKey)}
			>
				<Txt>{terpDat.label}: {messages.length} messages</Txt>
			</Row>
		);
	}
}