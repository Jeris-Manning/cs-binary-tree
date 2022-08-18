import {observer} from 'mobx-react';
import React from 'react';
import {Jewels} from '../../../stores/RootStore';
import {JobRef} from './JobRef';
import {Col, Row, Txt} from '../../../Bridge/Bricks/bricksShaper';
import {Tip} from '../../../Bridge/misc/Tooltip';
import AvatarPlaceholder from '../../../components/chat/AvatarPlaceholder';
import $j from '../../../Bridge/misc/$j';
import MediaQuery from 'react-responsive';
import {TIME_ZONES} from './LocationEditor';
import thyme from '../../../Bridge/thyme';
import {Ico} from '../../../Bridge/Bricks/Ico';
import {GiTimeBomb} from 'react-icons/gi';
import {Blink} from '../../../Bridge/misc/Iconic';
import {TiWarning} from 'react-icons/ti';
import styled from 'styled-components';
import {computed} from 'mobx';


const StyAvatar = styled.img`
  width: ${p => `${p.size}px`};
  height: ${p => `${p.size}px`};
  border-radius: 360px;
  border: ${p => p.border};
`;

@observer
export class TerpSummary extends React.Component<C_JobView> {
	render() {
		const jobRef: JobRef = this.props.jobRef;
		
		const w = 60;
		const h = 60;
		
		if (!jobRef.hasTerp) return (
			<Col
				circle
				// hue={'#acacac'}
				border={`3px solid #acacac`}
				w={w}
				h={h}
				childC
			>
				<Txt size={12} noSelect>No</Txt>
				<Txt size={12} noSelect>Terp</Txt>
			</Col>
		);
		
		const terp = jobRef.terp;
		const photoUrl = jobRef.terpPhotoUrl;
		
		if (photoUrl) return (
			<Tip text={`Assigned: ${terp.label}`}>
				<Col>
					<StyAvatar
						size={60}
						src={photoUrl}
						onClick={() => Jewels().vChat.OpenChat(terp.terpId)}
					/>
				</Col>
			</Tip>
		);
		
		return (
			<Tip text={`Assigned: ${terp.label}`}>
				<Col
					circle
					hue={'#acacac'}
					w={w}
					h={h}
					childC
					onClick={() => Jewels().vChat.OpenChat(terp.terpId)}
				>
					<Txt
						size={20}>{AvatarPlaceholder.GetInitials(terp.firstName, terp.lastName)}</Txt>
				</Col>
			</Tip>
		);
	}
	
}


@observer
export class CompanySummary extends React.Component<C_JobView> {
	render() {
		const jobRef: JobRef = this.props.jobRef;
		
		const company = jobRef.company.label || 'No Company';
		const contact = jobRef.contact.label || '';
		
		return (
			<Tip text={[company, contact]}>
				<Col
					maxWidth={100}
				>
					<Txt
						size={14}
						b
						marB={2}
					>
						{$j.trunc(company, 26)}
					</Txt>
					
					<Txt
						size={12}
					>
						{$j.trunc(contact, 20)}
					</Txt>
				</Col>
			</Tip>
		);
	}
}


@observer
export class DeafSummary extends React.Component<C_JobView> {
	render() {
		const jobRef: JobRef = this.props.jobRef;
		
		// console.log(`DeafSummary: `, jobRef.deafs);
		
		return (
			<MediaQuery
				minWidth={1}
			>
				<Tip text={jobRef.deafNames}>
					<Col>
						<Txt b size={12} marB={2}>Deaf Names:</Txt>
						
						{jobRef.deafs.slice(0, 4).map(deafClutch => (
							<Txt
								key={deafClutch.key}
								size={12}
								marB={1}
								noHoliday
							>{deafClutch.label}</Txt>
						))}
					</Col>
				</Tip>
			</MediaQuery>
		);
	}
}


@observer
export class LocationSummary extends React.Component<C_JobView> {
	render() {
		const jobRef: JobRef = this.props.jobRef;
		
		if (!jobRef.hasLocation) return <></>;
		
		const label = jobRef.location.label;
		const address = jobRef.location.address;
		
		return (
			<MediaQuery
				minWidth={1}
			>
				<Tip text={[label, address]}>
					<Row
						maxWidth={100}
						shrink
						wrap
					>
						<Txt
							size={12}
							b
							marR={6}
						>
							{$j.trunc(label, 26)}
						</Txt>
						
						{/*<Txt*/}
						{/*	size={12}*/}
						{/*>*/}
						{/*	{$j.trunc(address, 50)}*/}
						{/*</Txt>*/}
					</Row>
				</Tip>
			</MediaQuery>
		);
	}
}


@observer
export class TimeZoneSummary extends React.Component<C_JobView> {
	render() {
		const jobRef: JobRef = this.props.jobRef;
		const timeZone = jobRef.location.timeZone;
		
		if (!timeZone) return <></>;
		if (timeZone === 'America/Chicago') return <></>;
		
		const timeZoneLabel = TIME_ZONES[timeZone];
		
		let tooltip = [`Location is in the ${timeZoneLabel} time zone!`];
		
		const start = jobRef.start;
		const end = jobRef.end;
		
		if (start && end) {
			const shiftedStart = start.setZone(timeZone);
			const shiftedEnd = end.setZone(timeZone);
			
			tooltip.push(`${timeZoneLabel} time:`);
			tooltip.push(thyme.nice.time.short(shiftedStart) + ' to');
			tooltip.push(thyme.nice.time.short(shiftedEnd));
		}
		
		
		return (
			<Ico
				icon={GiTimeBomb}
				hue={'#8807c1'}
				size={50}
				tooltip={tooltip}
				marH={6}
			/>
		);
	}
}

@observer
export class ConflictsSummary extends React.Component<C_JobView> {
	
	@computed get tooltip(): string[] {
		const jobRef: JobRef = this.props.jobRef;
		let tooltip = [];
		
		if (jobRef.deafConflicts.length) tooltip.push('deaf');
		if (jobRef.locationConflicts.length) tooltip.push('location');
		if (jobRef.terpConflicts.length) tooltip.push('terp');
		
		return tooltip.length === 0 ? [] : ['Overlapping jobs detected for:', ...tooltip];
	}
	
	render() {
		if (!this.tooltip.length) return <></>;
		
		return (
			<Blink>
				<Ico
					icon={TiWarning}
					hue={'#d20022'}
					marR={4}
					size={26}
					tooltip={this.tooltip}
				/>
			</Blink>
		);
	}
}