import {observer} from 'mobx-react';
import {Jewels} from 'stores/RootStore';
import React from 'react';
import {Col, Row, Txt} from '../../Bridge/Bricks/bricksShaper';
import {JobDateTimeSummary} from './JobUpdate/JobDateTime';
import {MdClose} from 'react-icons/md';
import {ConfirmationStatus} from './JobUpdate/JobConfirmation';
import Butt from '../../Bridge/Bricks/Butt';
import {Tip} from '../../Bridge/misc/Tooltip';
import $j from '../../Bridge/misc/$j';
import {HUE} from '../../Bridge/HUE';
import {Blink} from '../../Bridge/misc/Iconic';
import {SaveControls} from '../../components/SaveControls';
import Defer from '../../Bridge/misc/Defer';
import {PageTitle} from '../../Bridge/misc/NavPage';
import {JobRef} from './JobUpdate/JobRef';
import {FollowUpIcon, HolidayIcon, VriIcon} from './JobInfoIcons';
import {JobStatusSelector} from './JobUpdate/JobStatusSelector';
import {
	CompanySummary,
	ConflictsSummary,
	DeafSummary,
	LocationSummary,
	TerpSummary,
	TimeZoneSummary
} from './JobUpdate/JobSummaries';

@observer
export class JobHeader extends React.Component<C_JobView> {
	render() {
		const vJobUpdate: vJobUpdate = Jewels().vJobUpdate;
		const jobRef: JobRef = this.props.jobRef;
		
		return (
			<>
				<JobPageTitle jobRef={jobRef}/>
				
				{jobRef.saveError && <SaveError error={jobRef.saveError}/>}
				
				<JobProblemAlert jobRef={jobRef}/>
				
				<Row
					padV={4}
					padH={16}
					minHeight={60}
					wrap
					hue={HUE.job.headerBg}
					shadowPage
				>
					<Row
						grow
						minWidth={500}
						childSpread
						childV
					>
						<JobDateTimeSummary jobRef={jobRef}/>
						<ConflictsSummary jobRef={jobRef}/>
						<TimeZoneSummary jobRef={jobRef}/>
						<CompanySummary jobRef={jobRef}/>
						<DeafSummary jobRef={jobRef}/>
						<LocationSummary jobRef={jobRef}/>
						
					</Row>
					
					<Row
						grow
						minWidth={500}
						childSpread
						childV
					>
						<Row wrap>
							<VriIcon jobRef={jobRef}/>
							<FollowUpIcon jobRef={jobRef}/>
							
							<Defer wait={60}>
								<HolidayIcon jobRef={jobRef}/>
							</Defer>
						</Row>
						
						<TerpSummary jobRef={jobRef}/>
						<ConfirmationStatus jobRef={jobRef}/>
						<JobStatusSelector jobRef={jobRef}/>
						
						<SaveControls
							store={vJobUpdate}
							saveName={'SaveJob'}
							canRevertName={'canRevert'}
							revertName={'RevertJob'}
							saveObj={jobRef}
							revertContainerProps={{
								marL: 4,
							}}
							spacerProps={{
								w: 0,
							}}
							saveButtProps={{
								minWidth: 100,
								maxWidth: 120,
								grow: true,
							}}
						/>
					</Row>
				</Row>
				
				<JobWarning jobRef={jobRef}/>
			</>
		);
	}
}

@observer
class JobWarning extends React.Component<C_JobView> {
	render() {
		const jobRef: JobRef = this.props.jobRef;
		const warningUp = jobRef.jobUp.warning;
		
		if (!warningUp.value) return <></>
		
		return (
			<Row
				childH
				marT={12}
				marB={4}
			>
				
				<Row
					hue={HUE.job.warningBg}
					padV={8}
					padH={8}
					// padH={16}
					minWidth={400}
					// outline={`thick solid ${'#de5454'}`}
					shadowPage
					childV
				>
					<Butt
						on={() => warningUp.Change('')}
						icon={MdClose}
						subtle
						mini
					/>
					
					<Col w={8}/>
					
					<Txt
						size={20}
						b
						center
					>{warningUp.value}</Txt>
					
				</Row>
			
			</Row>
		)
	}
}

@observer
class OutOfDate extends React.Component {
	render() {
		const oJobs = Jewels().jobs;
		
		// TODO
		// TODO
		// TODO
		// TODO
		
		return (
			<Row
				childCenterH
				h={120}
				marT={12}
				marB={16}
			>
				<Col
					hue={'#d7aaaa'}
					padV={4}
					padH={16}
					minWidth={400}
					outline={`thick solid ${'#c70000'}`}
					on={oJobs.Reload}
				>
					<Txt
						size={34}
						b
						center
						marB={8}
						smallCaps
					>Old Version (v{oJobs.version})</Txt>
					
					<Txt
						size={32}
						b
						center
					>{oJobs.outOfDate.by} updated this job! (v{oJobs.outOfDate.version})</Txt>
				</Col>
			</Row>
		);
	}
}

@observer
class SaveError extends React.Component {
	render() {
		const {error} = this.props;
		
		return (
			<Row childE marR={16} marB={6}>
				<Txt
					hue={HUE.error}
					b
				>
					{$j.trunc(error, 400, '...')}
				</Txt>
			</Row>
		);
	}
}

@observer
class JobPageTitle extends React.Component<C_JobView> {
	render() {
		const {
			jobRef,
		} = this.props;
		
		if (!jobRef.jobId) return <PageTitle title={'Job'}/>;
		
		const companyName = jobRef.company.name;
		const start = jobRef.start;
		
		const startStr = start
			? start.toFormat('M/dd')
			: '';
		
		return <PageTitle title={`${jobRef.jobId} ${startStr} ${companyName}`}/>;
	}
}

@observer
export class JobProblemAlert extends React.Component<C_JobView> {
	render() {
		const {
			jobRef
		} = this.props;
		
		const problems = jobRef.problems;
		const problemCount = problems.length;
		
		if (!problemCount) return <></>;
		
		let additional = '';
		let tip = '';
		
		if (problemCount >= 2) {
			additional = `  +${problemCount - 1} more`
			tip = problems;
		}
		
		return (
			<Row
				childC
				marT={4}
				marB={12}
			>
				<Blink>
					<Tip text={tip}>
						<Row
							hue={'#d7aaaa'}
							padV={4}
							padH={16}
							childC
							outline={`thick solid ${'#de5454'}`}
						>
							<Txt
								size={24}
								b
								center
							>Problem: {firstProblem}{additional}</Txt>
						
						</Row>
					</Tip>
				</Blink>
			</Row>
		);
	}
}