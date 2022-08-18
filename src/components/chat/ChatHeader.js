import {observer} from 'mobx-react';
import React from 'react';
import {Col, Row, Txt} from '../../Bridge/Bricks/bricksShaper';
import Butt from '../../Bridge/Bricks/Butt';
import {MdClose, MdPhone, MdSearch} from 'react-icons/md';
import $j from '../../Bridge/misc/$j';
import {TerpAvatar} from './ChatWindow';
import type {C_TerpChatDat} from '../../datum/stache/TerpChatDat';
import {TerpChatDat} from '../../datum/stache/TerpChatDat';
import {ChatTerpAvatar} from './ChatTerpAvatar';
import {computed} from 'mobx';
import {TerpDat} from '../../datum/stache/TerpDat';
import type {TerpKey} from '../../datum/stache/TerpDat';
import {Staches} from '../../stores/RootStore';
import {HUE} from '../../Bridge/HUE';
import {Tip} from '../../Bridge/misc/Tooltip';
import styled from 'styled-components';
import {TerpNextJobDat} from '../../datum/stache/TerpNextJobDat';
import {NextJob} from './NextJob';

@observer
export class ChatHeader extends React.Component<C_TerpChatDat> {
	
	@computed get terpDat(): TerpDat {
		const chatDat: TerpChatDat = this.props.chatDat;
		const terpKey: TerpKey = chatDat.key;
		return Staches().cTerp.GetOrStub(terpKey, true, 'ChatHeader').dat;
	}
	
	render() {
		const chatDat: TerpChatDat = this.props.chatDat;
		const terpKey: TerpKey = chatDat.key;
		
		const isMinimized = this.props.isMinimized;
		const minimizeFn = this.props.minimizeFn;
		const closeFn = this.props.closeFn;
		
		return (
			<Row
				// hue={chatDat.hasUnread ? HUE.chat.headerBgUnread : HUE.chat.headerBg}
				childCenterV
				padH={4}
				padT={2}
				boxShadow={'0 2px 1px rgba(0, 0, 0, .1)'}
			>
				
				<Col
					onClick={minimizeFn}
					cursor={isMinimized ? 'zoom-in' : 'zoom-out'}
				>
					<ChatTerpAvatar
						terpKey={terpKey}
						firstName={this.terpDat.firstName}
						lastName={this.terpDat.lastName}
						tooltip={isMinimized ? this.terpDat.label : undefined}
					/>
				</Col>
				
				{!isMinimized && (
					<>
						<Col grow shrink marL={8}>
							<Row
								onClick={minimizeFn}
								cursor={isMinimized ? 'zoom-in' : 'zoom-out'}
							>
								<Txt
									size={16}
								>{this.terpDat.label}</Txt>
							</Row>
							
							<NextJob terpKey={terpKey}/>
						</Col>
						
						<TerpLink terpDat={this.terpDat}/>
						<TerpPhone terpDat={this.terpDat}/>
						
						<Butt
							on={closeFn}
							icon={MdClose}
							mini
							subtle
						/>
					</>
				)}
			</Row>
		);
	}
}

const TerpLinkStyled = styled.a`
  text-decoration: none;
  color: #000;
  padding-left: 2px;
  padding-right: 2px;
  margin-left: 2px;
  margin-right: 2px;

  &:hover {
    background: #0195ab;
  }
`;

@observer
class TerpLink extends React.Component {
	render() {
		const terpDat: TerpDat = this.props.terpDat;
		
		return (
			<TerpLinkStyled	href={`#/terp/${terpDat.terpId}`}>
				<MdSearch color={'#7c7c7c'} size={16}/>
			</TerpLinkStyled>
		);
	}
}

const PhoneLink = styled.a`
  text-decoration: none;
  color: #000;
  padding-left: 2px;
  padding-right: 2px;
  margin-left: 2px;
  margin-right: 2px;

  &:hover {
    background: #6a8c00;
  }
`;

@observer
class TerpPhone extends React.Component {
	render() {
		const terpDat: TerpDat = this.props.terpDat;
		
		return (
			<Tip text={$j.format.phone(terpDat.phone)}>
				<PhoneLink href={`tel:${terpDat.phone}`} target={'_blank'}>
					<MdPhone color={'#6d6d6d'} size={16}/>
				</PhoneLink>
			</Tip>
		);
	}
}

@observer
class GotoTerpButton extends React.Component {
	render() {
		const terpKey = this.props.terpKey;
		
		return (
			<TerpLinkStyled
				href={`#/terp/${terpKey}`}
			>
				<MdSearch color={'#7c7c7c'} size={26}/>
			</TerpLinkStyled>
		)
	}
}

@observer
class PhoneButton extends React.Component {
	render() {
		const phone = this.props.phone;
		
		return (
			<a href={`tel:${phone}`} target="_blank">
				<Butt
					// on
					icon={MdPhone}
					tooltip={$j.format.phone(phone)}
					secondary
					mini
					marR={2}
				/>
			</a>
		)
	}
}