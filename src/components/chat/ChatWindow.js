import {observer} from 'mobx-react';
import {Jewels, Staches} from 'stores/RootStore';
import React from 'react';
import {Col, Row, Txt} from '../../Bridge/Bricks/bricksShaper';
import styled from 'styled-components';
import {action, computed, observable, runInAction} from 'mobx';
import thyme from '../../Bridge/thyme';
import Formula from '../../Bridge/Bricks/Formula/Formula';
import Fieldula from '../../Bridge/Bricks/Formula/Fieldula';
import MiniField from '../MiniField';
import Butt from '../../Bridge/Bricks/Butt';
import {MdCheck, MdDoneAll, MdHistory, MdHourglassEmpty} from 'react-icons/md';
import {FaUserCheck} from 'react-icons/fa';
import {IoMdCheckmarkCircleOutline} from 'react-icons/io';
import {LinkFragile} from '../../Bridge/Nav/Linker';
import {Tip} from '../../Bridge/misc/Tooltip';
import {StaffAvatar} from '../Avatar';
import AvatarPlaceholder from './AvatarPlaceholder';
import {Ico} from '../../Bridge/Bricks/Ico';
import $j, {vow} from '../../Bridge/misc/$j';
import ButtLink from '../ButtLink';
import type {C_TerpChatDat} from '../../datum/stache/TerpChatDat';
import {TerpChatDat} from '../../datum/stache/TerpChatDat';
import {ChatHeader} from './ChatHeader';
import {HUE} from '../../Bridge/HUE';
import type {TerpKey} from '../../datum/stache/TerpDat';
import {TerpDat} from '../../datum/stache/TerpDat';
import {ChatConfigJobRef, ChatConfigNeedAck} from './ChatConfigs';
import {ChatMessage} from '../../datum/ChatMessage';
import {StaffDat} from '../../datum/stache/StaffDat';
import {JobDat} from '../../datum/stache/JobDat';
import type {JobTabKey} from '../../pages/Job/JobUpdate/JobBasics';

@observer
export class ChatWindow extends React.Component<C_TerpChatDat> {
	
	@observable isMinimized = false;
	@action ToggleMinimize = () => this.isMinimized = !this.isMinimized;
	
	render() {
		const chatDat: TerpChatDat = this.props.chatDat;
		const terpKey: TerpKey = chatDat.key;
		
		const vChat = Jewels().vChat;
		
		return (
			<Col
				h={this.isMinimized ? undefined : 400}
				w={this.isMinimized ? undefined : 300}
				hue={chatDat.hasUnread ? HUE.chat.headerBgUnread : HUE.chat.headerBg}
				marH={8}
				pointerEvents
				shadowPage
				borderRadius={'8px 8px 0 0'}
			>
				<ChatHeader
					chatDat={chatDat}
					isMinimized={this.isMinimized}
					minimizeFn={this.ToggleMinimize}
					closeFn={() => vChat.CloseChat(terpKey)}
				/>
				
				{!this.isMinimized && (
					<WindowInner
						chatDat={chatDat}
					/>
				)}
			
			</Col>
		);
	}
}

@observer
class WindowInner extends React.Component<C_TerpChatDat> {
	
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
	
	@action SendMessage = (message: string) => {
		const chatDat: TerpChatDat = this.props.chatDat;
		const vChat = Jewels().vChat;
		return vChat.SendMessage(chatDat, message)
	}
	
	render() {
		const chatDat: TerpChatDat = this.props.chatDat;
		const terpKey: TerpKey = chatDat.key;
		
		const vChat = Jewels().vChat;
		
		return (
			<>
				<Col scrollV shrink hue={HUE.chat.scrollBg}>
					
					<Row
						childH
						padV={8}
					>
						<ButtLink
							toKey={'chat'}
							params={{terpId: terpKey}}
							icon={MdHistory}
							label={'See Full History'}
							subtle
							primary
						/>
					</Row>
					
					<ChatRows
						chatDat={chatDat}
						JumpToEnd={this.JumpToEnd}
					/>
					
					<Row h={4}/>
					
					<div ref={this.endOfMessages}/>
				
				</Col>
				
				<Col grow hue={'#fff'}/>
				
				<ChatWarning
					chatDat={chatDat}
				/>
				
				
				<TextEntry on={this.SendMessage}/>
				
				<Row
					padT={4}
					padB={8}
					padL={12}
					hue={HUE.chat.configBg}
				>
					<ChatConfigJobRef chatDat={chatDat}/>
					<Col grow/>
					<ChatConfigNeedAck chatDat={chatDat}/>
					<Col w={24}/>
				</Row>
			</>
		);
	}
}

@observer
export class ChatRows extends React.Component<C_TerpChatDat> {
	
	componentDidMount() {
		this.props.JumpToEnd();
	}
	
	componentDidUpdate(prevProps: Readonly<P>, prevState: Readonly<S>, snapshot: SS) {
		this.props.JumpToEnd();
	}
	
	@computed get terpDat(): TerpDat {
		const chatDat: TerpChatDat = this.props.chatDat;
		const terpKey: TerpKey = chatDat.key;
		return Staches().cTerp.GetOrStub(terpKey, true, 'ChatRows').dat;
	}
	
	render() {
		const chatDat: TerpChatDat = this.props.chatDat;
		
		const vChat = Jewels().vChat;
		
		const {
			// chat,
			bubbleWidth, // TODO: used?
			shade, // TODO: used?
		} = this.props;
		
		return (
			<>
				{chatDat.messages.map((msg, dex) => msg.staffId ? (
					<StaffRow
						key={msg.chatId}
						message={msg}
						terpDat={this.terpDat}
						bubbleWidth={bubbleWidth}
						shade={shade && dex % 2 === 0}
					/>
				) : (
					<TerpRow
						key={msg.chatId}
						message={msg}
						terpDat={this.terpDat}
						bubbleWidth={bubbleWidth}
						shade={shade && dex % 2 === 0}
					/>
				))}
			</>
		);
	}
}

@observer
class ChatWarning extends React.Component<C_TerpChatDat> {
	render() {
		const chatDat: TerpChatDat = this.props.chatDat;
		
		if (!chatDat.messages.length) {
			return (
				<Row
					childC
					marT={20}
					marB={100}
					grow
				>
					<Txt>No chat messages yet!</Txt>
				</Row>
			);
		}
		
		return <></>;
	}
}


const StyTerpAvatar = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 360px;
`;

const StyTerpAvatarBig = styled.img`
  width: 200px;
  height: 200px;
  //border-radius: 360px;
`;

@observer
export class TerpAvatar extends React.Component {
	render() {
		const {
			terp,
			photo,
		} = this.props;
		
		if (!photo) {
			return (
				<LinkFragile toKey={'terp'} params={{terpId: terp.terpId}}>
					<Col
						circle
						hue={'#acacac'}
						w={40}
						h={40}
						childC
					>
						<Txt
							size={20}>{AvatarPlaceholder.GetInitials(terp.firstName, terp.lastName)}</Txt>
					</Col>
				</LinkFragile>
			);
		}
		
		return (
			<Tip text={<StyTerpAvatarBig src={photo}/>} placement={'top-start'} delay={500}>
				<LinkFragile toKey={'terp'} params={{terpId: terp.terpId}}>
					<StyTerpAvatar src={photo}/>
				</LinkFragile>
			</Tip>
		);
	}
}

@observer
class TerpRow extends React.Component {
	render() {
		const message: ChatMessage = this.props.message;
		const terpDat: TerpDat = this.props.terpDat;
		
		const {
			// message,
			// terp,
			bubbleWidth,
			shade,
		} = this.props;
		
		return (
			<Row marV={4} childW childCenterV hue={shade ? '#fbfbfb' : undefined}>
				<Col marL={6} marR={4} childCenterH>
					<Timestamp message={message}/>
				</Col>
				
				{message.isReceipt ? (
					<Receipt
						message={message}
						// maxWidth={bubbleWidth}
						terpDat={terpDat}
					/>
				) : (
					<Bubble
						message={message}
						hue={'#dce5ec'}
						maxWidth={bubbleWidth}
					/>
				)}
				
				<Col marL={4}>
					<AckBy message={message}/>
				</Col>
			</Row>
		);
	}
}

@observer
class StaffRow extends React.Component {
	render() {
		const message: ChatMessage = this.props.message;
		const terpDat: TerpDat = this.props.terpDat;
		
		const {
			// message,
			// terp,
			bubbleWidth,
			shade,
		} = this.props;
		
		const staffColor = message.staffDat.color || '#000';
		
		return (
			<Row marV={4} childCenterV hue={shade ? '#fbfbfb' : undefined}>
				<Col marL={6} marR={4} childCenterH>
					<Timestamp message={message}/>
				</Col>
				
				<Col grow/>
				
				{message.waitingForTerpAck && (
					<Ico
						icon={MdHourglassEmpty}
						hue={staffColor}
						size={12}
						tooltip={`Waiting for terp to acknowledge`}
						marR={4}
					/>
				)}
				
				{message.hasTerpAck && (
					<Ico
						icon={FaUserCheck}
						hue={staffColor}
						size={12}
						tooltip={[
							`${terpDat.firstName} acknowledged`,
							thyme.nice.dateTime.short(message.readAt)
					]}
						marR={4}
					/>
				)}
				
				{message.readAt && (
					<Ico
						icon={MdCheck}
						hue={staffColor}
						size={12}
						tooltip={[
							`${terpDat.firstName} saw this`,
							thyme.nice.dateTime.short(message.readAt)
						]}
						marR={4}
					/>
				)}
				
				<Bubble
					message={message}
					hue={'#f1f0f0'}
					border={`2px solid ${staffColor}`}
					maxWidth={bubbleWidth}
				/>
				
				<Col marH={4}>
					<StaffAvatar
						staff={message.staffDat}
					/>
				</Col>
			</Row>
		);
	}
}

const Bubb = styled.div`
  box-sizing: border-box;
  padding: 6px 10px 6px 10px;
  max-width: 150px;
  border-radius: 20px;
  background-color: ${p => p.hue};
  border: ${p => p.border};
`;

const Msg = styled.p`
  font-size: ${p => $j.withPx(p.size)};
  color: ${p => p.hue};
`;

@observer
class Bubble extends React.Component {
	render() {
		const {
			message,
			hue,
			hueMessage,
			border,
			maxWidth,
		} = this.props;
		
		const doBig = message && message.message && message.message.length <= 2;
		
		return (
			<Bubb
				hue={hue}
				border={border}
			>
				{!!message.refId && <RefId message={message}/>}
				<Msg
					size={doBig ? 40 : 13}
					hue={hueMessage || '#000'}
				>{message.message}</Msg>
			</Bubb>
		);
	}
}

@observer
class Receipt extends React.Component {
	render() {
		const terpDat: TerpDat = this.props.terpDat;
		
		const {
			message,
			// terp,
			maxWidth,
		} = this.props;
		
		return (
			<Col
				padV={6}
				padH={10}
				maxWidth={maxWidth || 150}
				borderRadius={20}
			>
				{!!message.refId && <RefId message={message}/>}
				
				<Tip
					text={`${terpDat.firstName} acknowledged ${message.message} (see above)`}>
					<Row
						childV
					>
						<Ico
							icon={IoMdCheckmarkCircleOutline}
							hue={'#9d9d9d'}
							size={12}
						/>
						
						<Txt
							size={11}
							hue={'#9d9d9d'}
							i
							marL={4}
						>{message.message}</Txt>
					
					</Row>
				</Tip>
			</Col>
		);
	}
}

@observer
class RefId extends React.Component {
	
	@computed get jobDat(): JobDat {
		const jobId = this.props.message.refId;
		return Staches().cJob.GetOrStub(jobId, true).dat;
	}
	
	@computed get linkToTab(): JobTabKey {
		if (this.jobDat.terpId) return 'details'; // probably not seeking anymore
		return 'seek';
	}
	
	render() {
		const message: ChatMessage = this.props.message;
		
		return (
			<LinkFragile toKey={'job'} params={{jobId: message.refId, tab: this.linkToTab}}>
				<Txt
					b
					size={12}
					hue={'#3a3a3a'}
					marB={2}
				>#{$j.stringInsert(`${message.refId}`, 3, ' ')}</Txt>
			</LinkFragile>
		);
	}
}

@observer
class Timestamp extends React.Component {
	render() {
		const {
			sentAt,
		} = this.props.message;
		
		return (
			<Tip text={`Sent at: ${thyme.nice.dateTime.short(sentAt)}`}>
				<Txt size={'.7rem'} hue={'#aeaeae'}>{thyme.nice.dateTime.minimal(sentAt)}</Txt>
			</Tip>
		);
	}
}

@observer
class AckBy extends React.Component {
	
	@computed get staffDat(): StaffDat {
		const message: ChatMessage = this.props.message;
		return Staches().cStaffById.GetOrStub(message.ackBy, true).dat;
	}
	
	render() {
		const vChat = Jewels().vChat;
		const message: ChatMessage = this.props.message;
		
		if (!message.ackBy) return (
			<Butt
				on={() => vChat.SendAck(message)}
				icon={MdDoneAll}
				iconHue={'#313131'}
				tooltip={'Acknowledge'}
				subtle
				mini
				secondary
			/>
		);
		
		const tip = [
			`${this.staffDat.internalName} acknowledged`,
			`${thyme.nice.dateTime.short(message.readAt)}`,
		];
		
		return (
			<Tip
				text={tip}
			>
				<MdCheck color={this.staffDat.color} size={12}/>
			</Tip>
		);
	}
}

@observer
class TextEntry extends React.Component {
	@observable form = new Formula({
		fields: {
			input: new Fieldula({}),
		}
	});
	
	OnEnterKey = async (value) => {
		const field = this.form.fields.input;
		
		if (!field.value) return;
		
		field.error = '';
		
		const [result, error] = await vow(
			this.props.on(value)
		);
		
		if (error) {
			console.error(error);
			runInAction(() => field.error = String(error));
			return;
		}
		
		this.form.fields.input.Clear();
	};
	
	render() {
		return (
			<MiniField
				$={this.form.fields.input}
				onEnterKey={this.OnEnterKey}
				grow
				noAutoComplete
				multiline
				size={13}
				marB
				h={'100%'}
				resize={'none'}
				minHeight={60}
				maxHeight={120}
				focus
			/>
		);
	}
}