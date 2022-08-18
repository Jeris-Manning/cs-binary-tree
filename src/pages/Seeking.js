import React from 'react';
import {observer} from 'mobx-react';
import {SimCard} from '../Bridge/misc/Card';
import {Jewels, Root, Staches, USER_PREFS} from '../stores/RootStore';
import {SEEKING_ISSUES} from '../jewels/variance/vBids';
import {Col, Row, Txt} from '../Bridge/Bricks/bricksShaper';
import Butt from '../Bridge/Bricks/Butt';
import {MdContentCopy, MdNotificationsActive, MdNotificationsOff} from 'react-icons/md';
import {computed} from 'mobx';
import type {JobId} from '../datum/stache/JobDat';
import {JobDat} from '../datum/stache/JobDat';
import {CompanyDat} from '../datum/stache/CompanyDat';
import {Clip} from '../Bridge/misc/Clip';
import {LinkToJob} from './Job/LinkToJob';
import thyme from '../Bridge/thyme';
import {SeekerEntry} from '../datum/stache/JobSeekDat';
import {TerpDat} from '../datum/stache/TerpDat';
import {Tip} from '../Bridge/misc/Tooltip';
import {TiPin} from 'react-icons/ti';
import {FaUndo} from 'react-icons/fa';
import {STATUS_STYLE} from '../components/ReCells/RC_JobStatus';
import {StaffDat} from '../datum/stache/StaffDat';

@observer
export class Seeking extends React.Component {
	
	render() {
		return (
			<>
				<SeekingHeader/>
				
				<SimCard
					header={'New Bids'}
					wFill
				>
					<NewBids/>
				</SimCard>
				
				<SimCard
					header={'Bids in Progress'}
					wFill
				>
					<AckedBids/>
				</SimCard>
				
				<SimCard
					header={'Issues'}
					wFill
				>
					<SeekingIssueGroup/>
				</SimCard>
			
			</>
		);
	}
}

@observer
class SeekingHeader extends React.Component {
	render() {
		const root = Root();
		const notifyPref = root.prefs.bids.notify;
		
		return (
			<>
				<Row
					childC
				>
					<Butt
						on={() => root.TogglePref(USER_PREFS.bids, USER_PREFS.bids.notify)}
						icon={notifyPref ? MdNotificationsActive : MdNotificationsOff}
						iconHue={'#818181'}
						subtle
						tooltip={[
							`Notifications are ${notifyPref ? 'ON' : 'OFF'}`,
							`Click to toggle`
						]}
					/>
					
					<Txt
						size={32}
						marH={24}
					>Seeking</Txt>
				</Row>
				
				<SeekingStats/>
			</>
		);
	}
}

@observer
class SeekingStats extends React.Component {
	render() {
		const vBids = Jewels().vBids;
		
		return (
			<Row
				childH
				marT={6}
				marB={6}
			>
				
				<Stat
					label={'Jobs SEARCHING: '}
					count={vBids.searchingCount}
				/>
				
				<Stat
					label={'Total seekers: '}
					count={vBids.seekerCount}
				/>
			
			</Row>
		);
	}
}

@observer
class Stat extends React.Component {
	render() {
		const {
			label,
			count,
		} = this.props;
		
		return (
			<Row marR={12}>
				<Txt>{label}</Txt>
				<Txt
					b
					marL={2}
				>{count}</Txt>
			</Row>
		);
	}
}

@observer
class SeekingIssueGroup extends React.Component {
	render() {
		const vBids: vBids = Jewels().vBids;
		
		return (
			<>
				<SeekingIssue
					dat={vBids.noSeekersDat}
					issue={SEEKING_ISSUES.noSeekers}
				/>
				
				<Row h={12}/>
				
				<SeekingIssue
					dat={vBids.badSeekersDat}
					issue={SEEKING_ISSUES.badSeekers}
				/>
			</>
		);
	}
}

@observer
class SeekingIssue extends React.Component {
	
	@computed get jobIds(): JobId[] {
		return this.props.dat.jobIds || [];
	}
	
	@computed get jobDats(): JobDat[] {
		// TODO: sorting?
	}
	
	render() {
		const issue = this.props.issue;
		
		return (
			<>
				<Txt
					b
					hue={'#b83c00'}
					size={18}
					marB={8}
				>{issue}</Txt>
				
				{this.jobIds.map(jobId => (
					<SeekingJobRow
						key={jobId}
						jobId={jobId}
					/>
				))}
			</>
		);
	}
}

@observer
class SeekingJobRow extends React.Component<{ jobId: JobId }> {
	
	@computed get jobDat(): JobDat {
		return Staches().cJob.GetOrStub(this.props.jobId, true, 'SeekingJobRow')
			.dat;
	}
	
	@computed get companyDat(): CompanyDat {
		let companyId = this.jobDat.companyId;
		return Staches().cCompany.GetOrStub(companyId, true, 'SeekingJobRow').dat;
	}
	
	render() {
		const jobId = this.props.jobId;
		
		const statusStyle = STATUS_STYLE[this.jobDat.status] || {};
		const label = statusStyle.label;
		const hueBg = statusStyle.hueBg;
		const b = statusStyle.b;
		
		return (
			<Row
				marB={4}
			>
				<LinkToJob
					jobId={jobId}
					tabKey={'seek'}
					txtStyle={{
						b: true,
						rowStyle: {
							w: 75,
						}
					}}
				/>
				
				<Clip copy={jobId}>
					<Butt
						icon={MdContentCopy}
						iconSize={14}
						iconHue={'#6a6a6a'}
						subtle
						mini
						marL={4}
					/>
				</Clip>
				
				<Txt
					marL={12}
					w={160}
				>{thyme.nice.dateTime.short(this.jobDat.start)}</Txt>
				
				<Txt
					marL={12}
					w={200}
				>{this.companyDat.label}</Txt>
				
				<Row
					marL={12}
					hue={hueBg}
					pad={4}
				>
					<Txt
						size={12}
						b={b}
					>{label}</Txt>
				</Row>
			
			</Row>
		);
	}
}

@observer
class NewBids extends React.Component {
	render() {
		const vBids: vBids = Jewels().vBids;
		const entries: SeekerEntry[] = vBids.bidSeekersNew;
		
		return (
			<>
				{entries.map(entry => (
					<BidEntry
						key={entry.seekerId}
						entry={entry}
					/>
				))}
			</>
		);
	}
}

@observer
class AckedBids extends React.Component {
	render() {
		const vBids: vBids = Jewels().vBids;
		const entries: SeekerEntry[] = vBids.bidSeekersAcked;
		
		return (
			<>
				{entries.map(entry => (
					<BidEntry
						key={entry.seekerId}
						entry={entry}
					/>
				))}
			</>
		);
	}
}

@observer
class BidEntry extends React.Component<{ entry: SeekerEntry }> {
	
	@computed get jobDat(): JobDat {
		const entry: SeekerEntry = this.props.entry;
		return Staches().cJob.GetOrStub(entry.jobId, true, 'BidEntry')
			.dat;
	}
	
	@computed get companyDat(): CompanyDat {
		let companyId = this.jobDat.companyId;
		return Staches().cCompany.GetOrStub(companyId, true, 'BidEntry').dat;
	}
	
	@computed get terpDat(): TerpDat {
		const entry: SeekerEntry = this.props.entry;
		return Staches().cTerp.GetOrStub(entry.terpId, true, 'BidEntry').dat;
	}
	
	@computed get staffDat(): StaffDat {
		const entry: SeekerEntry = this.props.entry;
		return Staches().cStaffById.GetOrStub(entry.bidAckBy, true, 'BidEntry').dat;
	}
	
	render() {
		const entry: SeekerEntry = this.props.entry;
		
		const bidNote = entry.bidNote;
		const bidAt = entry.bidAt;
		
		return (
			
			<Row
				marB={4}
				childV
			>
				<LinkToJob
					jobId={entry.jobId}
					tabKey={'seek'}
					txtStyle={{
						b: true,
						rowStyle: {
							w: 75,
						}
					}}
				/>
				
				<Clip copy={entry.jobId}>
					<Butt
						icon={MdContentCopy}
						iconSize={14}
						iconHue={'#6a6a6a'}
						subtle
						mini
						marL={4}
					/>
				</Clip>
				
				<Txt
					marL={12}
					w={160}
				>{thyme.nice.dateTime.short(this.jobDat.start)}</Txt>
				
				<Txt
					marL={12}
					w={200}
				>{this.companyDat.label}</Txt>
				
				<Txt
					marL={16}
					w={200}
				>{this.terpDat.label}</Txt>
				
				<Tip text={thyme.nice.dateTime.short(bidAt)}>
					<Txt
						marL={4}
						center
						w={120}
					>
						{thyme.nice.dateTime.relative(bidAt)}
					</Txt>
				</Tip>
				
				<Txt
					marL={4}
					b
					w={400}
				>
					{bidNote}
				</Txt>
				
				<Col grow/>
				
				<Txt
					marR={8}
				>
					{this.staffDat.label}
				</Txt>
				
				<BidAckButton
					entry={entry}
				/>
			
			</Row>
		);
	}
}

@observer
class BidAckButton extends React.Component<{ entry: SeekerEntry }> {
	render() {
		const entry: SeekerEntry = this.props.entry;
		
		if (!entry.bidAckBy) {
			return (
				<Butt
					on={() => Jewels().vJobSeek.AckBid(entry)}
					icon={TiPin}
					tooltip={'Marks bid as being worked on (terp still sees it as Pending)'}
					primary
					marV={2}
				/>
			);
		}
		
		// unack
		return (
			<Butt
				on={() => Jewels().vJobSeek.UnackBid(entry)}
				icon={FaUndo}
				tooltip={'Mark as NEW again'}
				secondary
				marV={2}
				subtle
			/>
		);
	}
}