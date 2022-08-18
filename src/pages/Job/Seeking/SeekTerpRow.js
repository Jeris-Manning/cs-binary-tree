import styled from 'styled-components';
import {observer} from 'mobx-react';
import React from 'react';
import {computed} from 'mobx';
import {SeekTerpInfo} from '../../../datum/SeekTerpInfo';
import type {C_SeekTerpInfo, C_TerpDat} from '../../../datum/stache/TerpDat';
import {TerpDat} from '../../../datum/stache/TerpDat';
import {Jewels} from '../../../stores/RootStore';
import {MdChat, MdCheck, MdCheckBoxOutlineBlank, MdNote, MdPhone, MdSearch} from 'react-icons/md';
import {Ico} from '../../../Bridge/Bricks/Ico';
import {Tip} from '../../../Bridge/misc/Tooltip';
import $j from '../../../Bridge/misc/$j';
import thyme from '../../../Bridge/thyme';
import {Txt} from '../../../Bridge/Bricks/bricksShaper';
import {TerpDistance} from './TerpDistance';
import {TerpSeekerStatus} from './TerpSeekerStatus';
import {TerpScheduleConflict} from './TerpScheduleConflict';
import {TerpNowTerp} from './TerpNowTerp';


const RowContainer = styled.div`
  display: flex;
  background: ${p => p.isSelected ? '#d1d5ff' : '#ffffff'};

  &:hover {
    background: #eee4c1; // #eaeaea;
  }
`;

@observer
export class SeekTerpRow extends React.Component<C_SeekTerpInfo> {
	
	@computed get isSelected(): boolean {
		if (!this.props.isSelectable) return false;
		
		const jobRef: JobRef = this.props.jobRef;
		const info: SeekTerpInfo = this.props.seekTerpInfo;
		
		return jobRef.selectedTerpsMap.has(info.key);
	}
	
	render() {
		const isSelectable = !!this.props.isSelectable;
		const jobRef: JobRef = this.props.jobRef;
		const info: SeekTerpInfo = this.props.seekTerpInfo;
		const terpDat: TerpDat = info.terpDat;
		
		return (
			<RowContainer
				isSelected={this.isSelected}
			>
				{isSelectable ? (
					<SelectableTerpName
						isSelected={this.isSelected}
						jobRef={jobRef}
						seekTerpInfo={info}
					/>
				) : (
					<TerpName
						terpDat={terpDat}
						w={125}
					/>
				)}
				
				<SeekTerpRowInnerInfo
					jobRef={jobRef}
					seekTerpInfo={info}
				/>
			
			</RowContainer>
		);
	}
}

@observer
export class SeekTerpRowInnerInfo extends React.Component<C_SeekTerpInfo> {
	render() {
		const jobRef: JobRef = this.props.jobRef;
		const info: SeekTerpInfo = this.props.seekTerpInfo;
		const terpDat: TerpDat = info.terpDat;
		
		return (
			<>
				
				<TerpScheduleConflict
					jobRef={jobRef}
					seekTerpInfo={info}
				/>
				
				<TerpNowTerp
					jobRef={jobRef}
					seekTerpInfo={info}
				/>
				
				<TerpNote
					terpDat={terpDat}
				/>
				
				<TerpDistance
					jobRef={jobRef}
					seekTerpInfo={info}
				/>
				
				<TerpLink
					terpId={terpDat.terpId}
					tooltip={terpDat.rateSummary}
				/>
				
				<TerpPhone
					phone={terpDat.phone}
				/>
				
				<TerpChat
					terpId={terpDat.terpId}
				/>
				
				<TerpSeekerStatus
					jobRef={jobRef}
					seekTerpInfo={info}
				/>
			
			</>
		);
	}
}

@observer
class TerpNote extends React.Component {
	render() {
		const terpDat: TerpDat = this.props.terpDat;
		const noteArray = terpDat.noteArray || [];
		const teammates = terpDat.teammates
			? ['', 'Preferred Team:', terpDat.teammates]
			: [];
		
		
		const tip = [
			...noteArray,
			...teammates,
		];
		
		// console.log(`TerpNote: ${terpDat.label}`, noteArray, teammates);
		
		if (!tip.length) return <></>;
		
		if (tip.length === 1 && !tip[0]) return <></>;
		
		return (
			<Ico
				icon={MdNote}
				tooltip={tip}
				hue={'#4b4b4b'}
			/>
		);
	}
}

const InnerSelectableRow = styled.div`
  display: flex;
  flex: 1 1 auto;
  align-items: center;
  cursor: pointer;
`;

@observer
class SelectableTerpName extends React.Component<C_SeekTerpInfo> {
	render() {
		const jobRef: JobRef = this.props.jobRef;
		const info: SeekTerpInfo = this.props.seekTerpInfo;
		
		const isSelected = this.props.isSelected;
		const vJobSeek: vJobSeek = Jewels().vJobSeek;
		
		const Icon = isSelected ? MdCheck : MdCheckBoxOutlineBlank;
		
		return (
			<InnerSelectableRow
				onClick={() => vJobSeek.ToggleSelectTerp(jobRef, info.terpDat)}
			>
				<Icon size={'0.7rem'}/>
				
				<TerpName terpDat={info.terpDat}/>
			</InnerSelectableRow>
		);
	}
}

@observer
class TerpName extends React.Component<C_TerpDat> {
	render() {
		const terpDat: TerpDat = this.props.terpDat;
		const w = this.props.w;
		
		let hue = 'rgba(255,11,36,0.25)';
		let b: false;
		let i: true;
		
		if (terpDat.appLoginAt) {
			const moreThan2Weeks = terpDat.appLoginAt < thyme.nowMinus({weeks: 2});
			hue = moreThan2Weeks ? '#9a9a9a' : '#000';
			i = false;
		}
		
		if (terpDat.isStaff) {
			hue = '#000';
			b = true;
		}
		
		return (
			<Txt
				hue={hue}
				i={i}
				b={b}
				marL={4}
				w={w}
			>{terpDat.label}</Txt>
		);
	}
}

export const TerpLinkStyled = styled.a`
  text-decoration: none;
  color: #000;
  margin-left: 3px;
  margin-right: 3px;
  padding-left: 2px;
  padding-right: 2px;

  &:hover {
    background: #0195ab;
  }
`;

@observer
export class TerpLink extends React.Component {
	render() {
		const terpId = this.props.terpId;
		const tooltip = this.props.tooltip;
		const size = this.props.size || 12;
		
		return (
			<Tip text={tooltip}>
				<TerpLinkStyled href={`#/terp/${terpId}`}>
					<MdSearch color={'#7c7c7c'} size={size}/>
				</TerpLinkStyled>
			</Tip>
		);
	}
}

const PhoneLink = styled.a`
  text-decoration: none;
  color: #000;
  margin-left: 3px;
  margin-right: 3px;
  padding-left: 2px;
  padding-right: 2px;

  &:hover {
    background: #6a8c00;
  }
`;

@observer
export class TerpPhone extends React.Component {
	render() {
		const phone = this.props.phone || '';
		const size = this.props.size || 12;
		
		return (
			<Tip text={$j.format.phone(phone)}>
				<PhoneLink href={`tel:${phone}`} target={'_blank'}>
					<MdPhone color={'#6d6d6d'} size={size}/>
				</PhoneLink>
			</Tip>
		);
	}
}

const ChatButt = styled.button`
  border: none;
  background: none;
  cursor: pointer;
  margin-left: 3px;
  margin-right: 3px;
  padding-left: 2px;
  padding-right: 2px;

  &:hover {
    background: #6a8c00;
  }
`;

@observer
class TerpChat extends React.Component {
	render() {
		const terpId = this.props.terpId;
		
		return (
			<ChatButt
				onClick={() => Jewels().vChat.OpenChat(terpId)}
			>
				<MdChat color={'#6d6d6d'} size={12}/>
			</ChatButt>
		);
	}
}