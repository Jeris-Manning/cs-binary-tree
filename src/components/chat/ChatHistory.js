import {observer} from 'mobx-react';
import React from 'react';
import {Col, Row, Txt} from '../../Bridge/Bricks/bricksShaper';
import thyme from '../../Bridge/thyme';
import $j from '../../Bridge/misc/$j';
import {action, computed} from 'mobx';
import {Staches} from '../../stores/RootStore';
import {Clutch} from '../../Bridge/DockClient/Stache';
import {TerpChatHistoryDat} from '../../datum/stache/TerpChatHistoryDat';
import type {TerpKey} from '../../datum/stache/TerpDat';
import {TerpDat} from '../../datum/stache/TerpDat';
import {ChatHeader} from './ChatHeader';
import {ChatMessage} from '../../datum/ChatMessage';
import {HUE} from '../../Bridge/HUE';

@observer
export class FullHistory extends React.Component {
	
	@computed get terpDat(): TerpDat {
		const chatClutch: Clutch<TerpChatHistoryDat> = this.props.chatClutch;
		const terpKey: TerpKey = chatClutch.key;
		return Staches().cTerp.GetOrStub(terpKey, true, 'FullHistory').dat;
	}
	
	render() {
		const chatClutch: Clutch<TerpChatHistoryDat> = this.props.chatClutch;
		const containerHeight: number = this.props.containerHeight;
		
		return (
			<>
				<ChatHeader
					chatDat={chatClutch.dat}
					terpDat={this.terpDat}
				/>
				
				<ChatHistoryInner
					chatDat={chatClutch.dat}
					terpDat={this.terpDat}
					containerHeight={containerHeight}
				/>
			</>
		);
	}
}

@observer
class ChatHistoryInner extends React.Component {
	
	componentDidMount() {
		this.JumpToEnd();
	}
	
	componentDidUpdate(prevProps: Readonly<P>, prevState: Readonly<S>, snapshot: SS) {
		this.JumpToEnd();
	}
	
	endOfMessages = React.createRef();
	
	@action JumpToEnd = () => {
		if (this.endOfMessages && this.endOfMessages.current) {
			this.endOfMessages.current.scrollIntoView({behavior: 'auto'});
		}
	};
	
	render() {
		const chatDat: TerpChatHistoryDat = this.props.chatDat;
		const terpDat: TerpDat = this.props.terpDat;
		const containerHeight: number = this.props.containerHeight;
		
		const atLimit = chatDat.messages.length >= 1000;
		
		return (
			<>
				<Col scrollV h={containerHeight || 900} shrink hue={'#fff'}>
					
					{atLimit && (
						<Row bgDanger pad={20}>
							<Txt b>Warning: only supports the last 1000 messages (ask Trenton for
								more). 😅</Txt>
						</Row>
					)}
					
					<HistoryRows
						chatDat={chatDat}
						terpDat={terpDat}
						bubbleWidth={400}
						shade
					/>
					
					<div ref={this.endOfMessages}/>
				</Col>
				
				<Col grow hue={'#fff'}/>
				
				{chatDat.messages.length === 0 && (
					<Row
						childC
						marT={20}
						marB={100}
						grow
					>
						<Txt>No chat messages yet!</Txt>
					</Row>
				)}
			</>
		);
	}
}

@observer
export class HistoryRows extends React.Component {
	render() {
		const chatDat: TerpChatHistoryDat = this.props.chatDat;
		const terpDat: TerpDat = this.props.terpDat;
		
		return (
			<>
				{chatDat.messages.map((message, dex) => (
					<HistoryChatRow
						key={message.chatId}
						message={message}
						terpDat={terpDat}
						shade={dex % 2 === 0}
					/>
				))}
			</>
		);
	}
}

@observer
class HistoryChatRow extends React.Component {
	render() {
		const terpDat: TerpDat = this.props.terpDat;
		const message: ChatMessage = this.props.message;
		const shade: boolean = this.props.shade;
		
		
		const isStaff = !!message.staffId;
		
		const name = isStaff ? message.staffDat.label : terpDat.label;
		
		let extra = '';
		if (message.refId) extra += ` #${message.refId}`;
		if (isStaff && message.needAck) extra += !!message.ackBy ? '  ✔✔' : '  ⏳';
		
		return (
			<Row
				hue={shade ? '#fbfbfb' : undefined}
				padV={3}
				// marB={2}
			>
				<HistoryChatMessage
					time={thyme.nice.dateTime.stamp(message.sentAt)}
					name={$j.truncPadEnd(name, 7)}
					message={message.message}
					extra={extra}
					isStaff={isStaff}
				/>
			</Row>
		);
	}
}

@observer
class HistoryChatMessage extends React.Component {
	render() {
		const {
			time,
			name,
			message,
			extra,
			isStaff,
		} = this.props;
		
		const hue = isStaff ? HUE.chat.historyStaff : HUE.chat.historyTerp;
		
		return (
			<>
				
				<Txt
					mono
					size={14}
					hue={hue}
					b={!isStaff}
					preWrap
					minWidth={240}
					marR={8}
				>{time} {name}</Txt>
				
				<Txt
					mono
					size={14}
					hue={hue}
					b={!isStaff}
					preWrap
					shrink
				>{message} {extra}</Txt>
			</>
		);
	}
}