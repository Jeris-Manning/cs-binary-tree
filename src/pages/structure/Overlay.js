import React from 'react';
import {observer} from 'mobx-react';
import {Jewels, Staches} from 'stores/RootStore';
import {Col, Row} from '../../Bridge/Bricks/bricksShaper';
import {ChatWindow} from '../../components/chat/ChatWindow';
import {computed} from 'mobx';
import {TerpChatDat} from '../../datum/stache/TerpChatDat';
import {Clutch} from '../../Bridge/DockClient/Stache';

@observer
export class Overlay extends React.Component {
	render() {
		return (
			<Row fixed fillView z={300} noPointerEvents>
				
				<Col w={200}/>
				
				<Col grow>
					<Col grow/>
					
					<Row childS>
						<Chats/>
					</Row>
				
				</Col>
				
				<Col w={100}/>
			
			</Row>
		);
	}
}

@observer
class Chats extends React.Component {
	
	@computed get chats(): Clutch<TerpChatDat>[] {
		const vChat = Jewels().vChat;
		if (!vChat.openTerpKeys.length) return [];
		return Staches().cTerpChat.GetMulti(vChat.openTerpKeys);
	}
	
	render() {
		return (
			<>
				{this.chats.map(chatClutch => (
					<ChatWindow
						key={chatClutch.key}
						chatDat={chatClutch.dat}
					/>
				))}
			</>
		);
	}
}