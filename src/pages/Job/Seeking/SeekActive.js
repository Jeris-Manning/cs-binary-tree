import React from 'react';
import {observer} from 'mobx-react';
import {Jewels, Staches} from 'stores/RootStore';
import Butt from '../../../Bridge/Bricks/Butt';
import {Col, Row, Txt} from '../../../Bridge/Bricks/bricksShaper';
import {computed} from 'mobx';
import thyme from '../../../Bridge/thyme';
import {MdAssignmentTurnedIn, MdClose, MdRemoveCircleOutline} from 'react-icons/md';
import {HUE} from '../../../Bridge/HUE';
import type {C_JobView} from '../JobUpdate/JobBasics';
import {JobCard} from '../JobUpdate/JobBasics';
import {SeekerEntry} from '../../../datum/stache/JobSeekDat';
import {TerpDat} from '../../../datum/stache/TerpDat';
import {SeekTerpRowInnerInfo} from './SeekTerpRow';

@observer
export class SeekActive extends React.Component<C_JobView> {
	
	@computed get seekers(): SeekerEntry[] {
		if (Staches().cTerp.pendingCount > 5) return [];
		
		const jobRef: JobRef = this.props.jobRef;
		return jobRef.seekDat.active;
	}
	
	render() {
		const vJobSeek: vJobSeek = Jewels().vJobSeek;
		const jobRef: JobRef = this.props.jobRef;
		const listMaxHeight = this.props.listMaxHeight;
		
		const seekerCount = this.seekers.length;
		
		return (
			<JobCard>
				
				<Row marB={12} padH={20} childCenterV>
					<Txt
						size={20}
						hue={HUE.blueDeep}
						childCenterV
					>Active Seekers ({seekerCount})</Txt>
					
					<Col grow/>
					
					<Butt
						on={() => vJobSeek.RemoveAllSeekers(jobRef)}
						danger
						subtle
						icon={MdRemoveCircleOutline}
						disabled={!seekerCount}
						tooltip={`Remove ALL Seekers`}
						marL={12}
					/>
				</Row>
				
				<Col
					minHeight={100}
					maxHeight={listMaxHeight}
					overflow
					padV={12}
				>
					{seekerCount > 0 ? (
						this.seekers.map(seeker => (
							<SeekerRow
								key={seeker.seekerId}
								jobRef={jobRef}
								seeker={seeker}
							/>
						))
					) : (
						<Txt marL={20}>none</Txt>
					)}
				</Col>
			</JobCard>
		);
	}
}

@observer
class SeekerRow extends React.Component<C_JobView> {
	
	@computed get seekTerpInfo(): SeekTerpInfo {
		const jobRef: JobRef = this.props.jobRef;
		const seeker: SeekerEntry = this.props.seeker;
		return jobRef.seekInfo.get(seeker.terpKey);
	}
	
	render() {
		// const oChat = Jewels().staffChat;
		const jobRef: JobRef = this.props.jobRef;
		const seeker: SeekerEntry = this.props.seeker;
		const onRemove = this.props.onRemove;
		
		const vJobSeek: vJobSeek = Jewels().vJobSeek;
		
		if (!this.seekTerpInfo) return <Txt>?</Txt>;
		
		const terpDat: TerpDat = this.seekTerpInfo.terpDat;
		const terpLabel = terpDat.label;
		
		// onForceAssign={() => vJobSeek.ForceAssignTerp(jobRef, )}
		// onRemove={() => vJobSeek.RemoveSeeker(jobRef, seeker)}
		
		// console.log(`sentAt: _________ `, seeker.sentAt);
		const sentAtLabel = thyme.nice.dateTime.minimal(seeker.sentAt);
		
		return (
			<Row grow shrink spread childV>
				
				<Butt
					on={() => vJobSeek.RemoveSeeker(jobRef, seeker)}
					icon={MdClose}
					iconSize={'.75rem'}
					tooltip={'Remove Seeker'}
					danger
					subtle
					marR={4}
					mini
					padding={'0'}
					square
				/>
				
				<Txt
					ellipsis
					w={125}
					noHoliday
				>{terpLabel}</Txt>
				
				<Col grow/>
				
				<Butt
					on={() => vJobSeek.ForceAssignTerp(jobRef, terpDat)}
					icon={MdAssignmentTurnedIn}
					iconSize={12}
					tooltip={[`Assign Now: ${terpLabel}`, '(will clear all active seekers & bids)']}
					mini
					subtle
					danger
					square
					marR={8}
				/>
				
				<SeekTerpRowInnerInfo
					jobRef={jobRef}
					seekTerpInfo={this.seekTerpInfo}
				/>
				
				<Txt
					size={12}
					mar={6}
					hue={'#555555'}
					w={60}
				>{sentAtLabel}</Txt>
			
			</Row>
		);
	}
}