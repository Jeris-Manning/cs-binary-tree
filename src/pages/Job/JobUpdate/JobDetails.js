import React from 'react';
import {observer} from 'mobx-react';
import {Jewels} from 'stores/RootStore';
import {Col, Row, Txt} from '../../../Bridge/Bricks/bricksShaper';
import thyme from '../../../Bridge/thyme';
import Timeline, {TimelineNotes} from './Timeline';
import {JobDateTime} from './JobDateTime';
import {JobSituation} from './JobSituation';
import {JobBillType} from './JobBillType';
import {JobLocation} from './JobLocation';
import {JobCompany} from './JobCompany';
import {JobDeaf} from './JobDeaf';
import {JobConfirmation} from './JobConfirmation';
import ToggleButton from '../../../components/ToggleButton';
import {JobLinkedSummary} from '../JobLinked/JobLinkedSummary';
import {JobRates, JobTravel} from './JobRates';
import {Ico} from '../../../Bridge/Bricks/Ico';
import {UpField} from '../../../Bridge/misc/UpField';
import Linker from '../../../Bridge/Nav/Linker';
import {Tip} from '../../../Bridge/misc/Tooltip';
import {TiWarning} from 'react-icons/ti';
import {JobVriLocation} from './JobVriLocation';
import {Blink} from '../../../Bridge/misc/Iconic';
import {JobAssignedTerp} from './JobAssignedTerp';
import {JobCard} from './JobBasics';
import {ChatCard} from '../ChatCard';
import {OverlapEntry} from './JobOverlapDat';

@observer
export class JobDetails extends React.Component<C_JobView> {
	
	render() {
		const jobRef: JobRef = this.props.jobRef;
		
		return (
			<>
				
				<Col grow shrink maxThird>
					
					<JobDateTime jobRef={jobRef}/>
					<JobCompany jobRef={jobRef}/>
					<JobVriLocation jobRef={jobRef}/>
					<JobLocation jobRef={jobRef}/>
				
				</Col>
				
				<Col grow shrink maxThird>
					
					<JobConfirmation jobRef={jobRef}/>
					<JobAssignedTerp jobRef={jobRef}/>
					<JobTravel jobRef={jobRef}/>
					
					<JobDeaf jobRef={jobRef}/>
					
					<JobSituation
						 // needs 20
						jobRef={jobRef}
					/>
					
					<JobRates jobRef={jobRef}/>
				
				</Col>
				
				<Col grow shrink maxThird>
					
					<JobBillType jobRef={jobRef}/>
					
					<Row marL={12}>
						<JobVriButton jobRef={jobRef}/>
						<Col grow/>
						<JobFollowUpButton jobRef={jobRef}/>
					</Row>
					
					<JobWarningEdit jobRef={jobRef}/>
					
					{!jobRef.isNew && (
						<>
							<TimelineNotes jobRef={jobRef}/>
							<ChatCard jobRef={jobRef}/>
							<JobLinkedSummary jobRef={jobRef}/>
							
							<Timeline jobRef={jobRef}/>
						</>
					)}
				
				</Col>
			
			</>
		);
	}
}

@observer
export class JobFollowUpButton extends React.Component<C_JobView> {
	render() {
		const jobRef: JobRef = this.props.jobRef;
		const jobUp = jobRef.jobUp;
		
		return (
			<ToggleButton
				primary
				label={'Follow Up'}
				// icon={FaHistory}
				// iconHue={'#c97272'}
				// iconSize={30}
				tooltip={'Need to follow up'}
				isChecked={jobUp.followUp.value}
				on={jobUp.followUp.Toggle}
				subtle
			/>
		);
	}
}

@observer
export class JobVriButton extends React.Component<C_JobView> {
	render() {
		const vJobUpdate: vJobUpdate = Jewels().vJobUpdate;
		const jobRef: JobRef = this.props.jobRef;
		const jobUp = jobRef.jobUp;
		
		return (
			<ToggleButton
				primary
				label={'VRI'}
				// icon={FiVideo}
				// tooltip={'VRI'}
				isChecked={jobUp.vri.value}
				on={jobUp.vri.Toggle}
				subtle
				afterClick={vJobUpdate.ComputeCap}
				alert={'Updated Cap'}
			/>
		);
	}
}

@observer
export class JobWarningEdit extends React.Component<C_JobView> {
	render() {
		// const {tabi} = this.props;
		const jobRef: JobRef = this.props.jobRef;
		const jobUp = jobRef.jobUp;
		
		return (
			<JobCard
				canSave={jobUp.warning.hasChanged}
			>
				<UpField
					label={'Warning'}
					state={jobUp.warning}
					description={'Adds a warning to the top of the job (staff only)'}
					
					marT={8}
				/>
			</JobCard>
		);
	}
}

// TODO: move
@observer
export class OverlappingJobs extends React.Component<{jobs: OverlapEntry[]}> {
	
	render() {
		const jobs = this.props.jobs;
		
		return (
			<Row
				hue={'#fcdf8b'}
				pad={2}
				wrap
				childV
				marB={4}
			>
				<Blink>
					<Ico
						icon={TiWarning}
						hue={'#d20022'}
						marR={4}
						size={22}
					/>
				</Blink>
				
				<Txt
					marR={8}
					b
				>Overlap:</Txt>
				
				{jobs.map(job => (
					<Linker
						key={job.jobKey}
						toKey={'job'}
						params={{jobId: job.jobKey, tab: 'details'}}
					>
						<Tip text={[
							`#${job.jobKey}`,
							thyme.nice.time.short(job.start),
							thyme.nice.time.short(job.end),
						]}>
							<Txt marR={4}>#{job.jobKey}</Txt>
						</Tip>
					</Linker>
				))}
			</Row>
		);
	}
}