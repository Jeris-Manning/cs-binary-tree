import React from 'react';
import {observer} from 'mobx-react';
import {Jewels, LocalStaff, Staches} from 'stores/RootStore';
import Butt from '../../../Bridge/Bricks/Butt';
import {Col, Row, Txt} from '../../../Bridge/Bricks/bricksShaper';
import {computed} from 'mobx';
import thyme from '../../../Bridge/thyme';
import {MdChat, MdCheck, MdClose} from 'react-icons/md';
import {Ico} from '../../../Bridge/Bricks/Ico';
import {TiPin} from 'react-icons/ti';
import type {C_JobView} from '../JobUpdate/JobBasics';
import {JobCard} from '../JobUpdate/JobBasics';
import {JobSeekDat, SeekerEntry} from '../../../datum/stache/JobSeekDat';
import type {C_SeekTerpInfo} from '../../../datum/stache/TerpDat';
import {TerpDat} from '../../../datum/stache/TerpDat';
import {StaffDat} from '../../../datum/stache/StaffDat';
import {SeekTerpRowInnerInfo} from './SeekTerpRow';

@observer
export class SeekBids extends React.Component<C_JobView> {
	
	render() {
		const jobRef: JobRef = this.props.jobRef;
		const seekDat: JobSeekDat = jobRef.seekDat;
		const bids = seekDat.bids;
		const staffId = LocalStaff().staffId;
		
		// const oChat = Jewels().staffChat;
		
		if (!bids.length) return <></>;
		
		return (
			<>
				
				<JobCard
					header={'Bids'}
				>
					{bids.map(seekerBid => (
						<BidRow
							key={seekerBid.seekerId}
							jobRef={jobRef}
							seekerBid={seekerBid}
							// onAccept={() => oSeek.AcceptBid(seekerBid)}
							// onReject={() => oSeek.RejectBid(seekerBid)}
							// onChat={() => oChat.LoadChat(seekerBid.terpId)}
							// onAck={() => oBids.Acknowledge({
							// 	jobId: oJobs.jobId,
							// 	seekerId: seekerBid.seekerId,
							// 	staffId: staffId,
							// })}
						/>
					))}
				</JobCard>
			</>
		);
	}
}

@observer
class BidRow extends React.Component<C_SeekTerpInfo> {
	
	@computed get seekTerpInfo(): SeekTerpInfo {
		const jobRef: JobRef = this.props.jobRef;
		const seekerBid: SeekerEntry = this.props.seekerBid;
		return jobRef.seekInfo.get(seekerBid.terpKey);
	}
	
	@computed get bidAckByStaff(): StaffDat {
		const seekerBid: SeekerEntry = this.props.seekerBid;
		if (!seekerBid.bidAckBy) return null;
		return Staches().cStaffById.GetOrStub(seekerBid.bidAckBy);
	}
	
	render() {
		const vJobSeek = Jewels().vJobSeek;
		const jobRef: JobRef = this.props.jobRef;
		const seekerBid: SeekerEntry = this.props.seekerBid;
		const isPinned = !!seekerBid.bidAckBy;
		
		if (!this.seekTerpInfo) return <Txt>?</Txt>;
		
		const terpDat: TerpDat = this.seekTerpInfo.terpDat;
		
		const onAccept = () => vJobSeek.AcceptBid(jobRef, seekerBid);
		const onReject = () => vJobSeek.RejectBid(jobRef, seekerBid);
		const onAck = () => vJobSeek.AckBid(seekerBid);
		const onChat = () => Jewels().vChat.OpenChat(terpDat.key);
		
		return (
			<Row marV={8}>
				
				{isPinned && (
					<Col childV>
						<Ico
							icon={TiPin}
							tooltip={`Pinned by ${this.bidAckByStaff.label}`}
						/>
					</Col>
				)}
				
				<Col
					w={40}
					marR={4}
				>
					
					<Butt
						on={onReject}
						icon={MdClose}
						tooltip={'Reject (TODO: inform terp)'}
						danger
						subtle
						mini
						square
					/>
					
					<Row minHeight={8} grow/>
					
					<Butt
						on={onChat}
						icon={MdChat}
						iconHue={'#6d6d6d'}
						primary
						subtle
						mini
						square
					/>
				</Col>
				
				<Col grow shrink>
					<Txt b>{terpDat.label}</Txt>
					<Txt>{thyme.nice.dateTime.short(seekerBid.bidAt)}</Txt>
					<Txt>Note: {seekerBid.bidNote || 'none'}</Txt>
				</Col>
				
				<Col>
					
					<Row childV spread>
						
						<SeekTerpRowInnerInfo
							jobRef={jobRef}
							seekTerpInfo={this.seekTerpInfo}
						/>
						
						{!isPinned && (
							<Butt
								on={onAck}
								icon={TiPin}
								tooltip={'Marks bid as being worked on (terp still sees it as Pending)'}
								primary
								subtle
								mini
								square
							/>
						)}
					</Row>
					
					<Butt
						on={onAccept}
						icon={MdCheck}
						tooltip={['Accept Bid & Assign', '(will keep other bids)']}
						green
						marT={16}
					/>
				</Col>
			</Row>
		);
	}
}