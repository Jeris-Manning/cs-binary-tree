import React from 'react';
import {observer} from 'mobx-react';
import {Jewels} from 'stores/RootStore';
import Butt from '../../../Bridge/Bricks/Butt';
import {Col, Row} from '../../../Bridge/Bricks/bricksShaper';
import {MdRemoveCircleOutline, MdSave} from 'react-icons/md';
import {SeriesDupeControls} from './SeriesDupeControls';
import {LinkedSeriesUpdata} from '../../../datum/LinkedSeriesUpdata';
import {SeriesDateSectionGroup} from './SeriesDateSection';
import {SeriesPushControls} from './SeriesPushControls';
import {SeriesSelectionControls} from './SeriesSelectionControls';
import {UpField} from '../../../Bridge/misc/UpField';
import {JobCard} from '../JobUpdate/JobBasics';
import {SeriesTerpControls} from './SeriesTerpControls';
import {action} from 'mobx';

@observer
export class JobLinked extends React.Component<C_JobView> {
	
	@action RemoveThisJob = async () => {
		const jobRef: JobRef = this.props.jobRef;
		const seriesUp: LinkedSeriesUpdata = jobRef.seriesUp;
		
		return Jewels().vJobSeries.RemoveJobsFromSeries(
			seriesUp.seriesId,
			[parseInt(jobRef.jobId)]
		);
	}
	
	render() {
		const jobRef: JobRef = this.props.jobRef;
		const seriesUp: LinkedSeriesUpdata = jobRef.seriesUp;
		
		if (!seriesUp.hasSeries) {
			return <NoSeries jobRef={jobRef}/>;
		}
		
		return (
			<>
				
				<Col w={400}>
					<SeriesDupeControls jobRef={jobRef}/>
					<SeriesTerpControls jobRef={jobRef}/>
					<SeriesPushControls jobRef={jobRef}/>
				</Col>
				
				<Col grow shrink marR={16}>
					<SeriesSelectionControls jobRef={jobRef}/>
					<SeriesDateSectionGroup jobRef={jobRef}/>
					
					<Col
						marT={34}
					>
						<LinkedNotes jobRef={jobRef}/>
					</Col>
					
					<Row grow/>
					
					<Row>
						<Col grow/>
						<Butt
							on={this.RemoveThisJob}
							icon={MdRemoveCircleOutline}
							label={'Remove this job from the series'}
							danger
							subtle
							shrink
						/>
						<Col grow/>
					</Row>
				</Col>
			
			</>
		);
	}
}

@observer
class NoSeries extends React.Component<C_JobView> {
	render() {
		const jobRef: JobRef = this.props.jobRef;
		const vJobSeries = Jewels().vJobSeries;
		
		return (
			<Col grow childH marV={42}>
				<Butt
					on={() => vJobSeries.CreateSeries(jobRef.jobId)}
					label={'Create Linked Job Series'}
					secondary
					tooltip={'This allows you to create other "linked" jobs, such as for a college class or teamed job.'}
				/>
			</Col>
		);
	}
}



@observer
export class LinkedNotes extends React.Component {
	
	@action AddRawJobIds = async () => {
		const jobRef: JobRef = this.props.jobRef;
		const seriesUp: LinkedSeriesUpdata = jobRef.seriesUp;
		
		const seriesId = seriesUp.seriesId;
		const jobIds = seriesUp.jobIdsToAdd.value
			.split(',')
			.map(id => parseInt(id))
			.filter(id => id);
		
		if (!jobIds.length) return;
		
		await Jewels().vJobSeries.AddJobsToSeries(seriesId, jobIds);
		
		seriesUp.jobIdsToAdd.Revert();
	}
	
	@action SaveSeriesNote = async () => {
		const jobRef: JobRef = this.props.jobRef;
		const seriesUp: LinkedSeriesUpdata = jobRef.seriesUp;
		
		return Jewels().vJobSeries.ChangeSeriesNote(
			seriesUp.seriesId,
			seriesUp.seriesNote.value,
		);
	};
	
	render() {
		const jobRef: JobRef = this.props.jobRef;
		const seriesUp: LinkedSeriesUpdata = jobRef.seriesUp;
		const vJobSeries: vJobSeries = Jewels().vJobSeries;
		
		return (
			<>
				
				<JobCard pad={0}>
					<Row>
						<UpField
							state={seriesUp.seriesNote}
							label={'Series Note'}
							description={'A staff-only note that will display on all linked jobs.'}
							multiline
							h={100}
							grow
							minWidth={200}
							marL={12}
							marV={12}
						/>
						
						<Butt
							on={this.SaveSeriesNote}
							enabled={!!seriesUp.seriesNote.hasChanged}
							mini
							icon={MdSave}
							secondary
							square
							marL={8}
						/>
					</Row>
				</JobCard>
				
				<JobCard pad={0}>
					<Row>
						<UpField
							state={seriesUp.jobIdsToAdd}
							label={'Add Job IDs to this series'}
							description={'Add job IDs here (comma separated)'}
							multiline
							grow
							minWidth={200}
							marL={12}
							marV={12}
						/>
						
						<Butt
							on={this.AddRawJobIds}
							enabled={!!seriesUp.jobIdsToAdd.value}
							mini
							icon={MdSave}
							secondary
							square
							marL={8}
						/>
					</Row>
				</JobCard>
			</>
		);
	}
}