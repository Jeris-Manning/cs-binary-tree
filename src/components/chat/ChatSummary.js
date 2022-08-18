import {Col, Row, Txt} from '../../Bridge/Bricks/bricksShaper';
import React from 'react';
import {observer} from 'mobx-react';
import {Jewels, LocalStaff, Staches} from 'stores/RootStore';
import {computed} from 'mobx';
import {CHAT_LIST_KEY, ChatSummaryDat} from '../../datum/stache/ChatSummaryDat';
import {TerpChatDat} from '../../datum/stache/TerpChatDat';
import type {TerpKey} from '../../datum/stache/TerpDat';
import {TerpDat} from '../../datum/stache/TerpDat';
import {ChatTerpAvatar} from './ChatTerpAvatar';
import {HUE} from '../../Bridge/HUE';

@observer
export class ChatSummary extends React.Component {
	render() {
		console.log(`ChatSummary render`);
		
		return (
			<>
				<SummarySection
					label={'Unread Chats'}
					summaryKey={CHAT_LIST_KEY.unread}
					reverse
					limit={8}
				/>
				
				<SummarySection
					label={'My Recent'}
					summaryKey={LocalStaff().staffId}
					limit={5}
				/>
				
				<SummarySection
					label={'All Recent'}
					summaryKey={CHAT_LIST_KEY.recentAll}
					limit={5}
				/>
			</>
		);
	}
}

@observer
class SummarySection extends React.Component {
	
	@computed get summaryDat(): ChatSummaryDat {
		const summaryKey = this.props.summaryKey;
		return Staches().cChatSummary.GetOrStub(summaryKey, true).dat;
	}
	
	@computed get terpKeys(): TerpKey[] {
		const terpKeys = this.summaryDat.terpKeys || [];
		return this.props.reverse
			? terpKeys.slice().reverse()
			: terpKeys;
	}
	
	render() {
		const summaryKey = this.props.summaryKey;
		const label = this.props.label;
		const limit = this.props.limit || 6;
		
		return (
			<Col
				minH={160}
				// padH={8}
				wFill
				marB={8}
			>
				<Txt
					center
					hue={HUE.chat.previewSectionLabel}
					size={12}
					marB={4}
				>
					{label}
				</Txt>
				
				{this.terpKeys.slice(0, limit).map(terpKey => (
					<TerpChatPreviewRow
						key={terpKey}
						terpKey={terpKey}
					/>
				))}
			</Col>
		);
	}
}

@observer
class TerpChatPreviewRow extends React.Component {
	
	@computed get terpDat(): TerpDat {
		const terpKey: TerpKey = this.props.terpKey;
		return Staches().cTerp.GetOrStub(terpKey, true, 'TerpChatPreviewRow').dat;
	}
	
	@computed get chatDat(): TerpChatDat {
		const terpKey: TerpKey = this.props.terpKey;
		return Staches().cTerpChat.GetOrStub(terpKey).dat;
	}
	
	@computed get message(): string {
		if (!this.chatDat.messages || !this.chatDat.messages.length)
			return '...';
		const lastDex = this.chatDat.messages.length - 1;
		return this.chatDat.messages[lastDex].message;
	}
	
	render() {
		const terpKey: TerpKey = this.props.terpKey;
		const vChat: vChat = Jewels().vChat;
		
		return (
			<Row
				onClick={() => vChat.OpenChat(terpKey)}
				hue={HUE.chat.previewBg}
				// h={20}
				childCenterV
				marB={4}
				padV={2}
				padL={6}
				padR={6}
			>
				<ChatTerpAvatar
					terpKey={terpKey}
					firstName={this.terpDat.firstName}
					lastName={this.terpDat.lastName}
					isPreview
				/>
				
				<Col
					marL={6}
					shrink
				>
					<Txt
						hue={HUE.chat.previewLabel}
						size={11}
						b
						noHoliday
						ellipsis
						marT={2}
					>
						{this.terpDat.label}
					</Txt>
					
					<Txt
						hue={HUE.chat.previewMessage}
						size={11}
						// i
						noHoliday
						ellipsis
						// marT={4}
					>
						{this.message}
					</Txt>
				</Col>
			</Row>
		);
	}
}