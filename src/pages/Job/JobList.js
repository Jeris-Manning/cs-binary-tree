import {observer} from 'mobx-react';
import React, {Component} from 'react';
import {Row} from '../../Bridge/Bricks/bricksShaper';
import {JobTable} from '../../components/JobTable';
import {Jewels, Router} from '../../stores/RootStore';
import MiniField from '../../components/MiniField';
import {PageTitle} from '../../Bridge/misc/NavPage';

@observer
export class JobListPage extends React.Component {
	
	render() {
		const {
			jobIds = [],
		} = this.props;
		
		const oJobs = Jewels().jobs;
		
		return (
			<>
				
				<Row childH marT={24}>
					
					<MiniField
						$={oJobs.gotoJobForm.fields.input}
						onEnterKey={() => oJobs.SubmitGotoJobForm(true, false)}
						name={'Job ID'}
						description={'Can do lists of job IDs also!'}
						placeholder={'Show Job IDs'}
						w={600}
					/>
				</Row>
				
				
				<JobTable
					// header={`Jobs: ${jobIds.join(', ')}`}
					getAllJobs={(params) => oJobs.GetJobsByIds(jobIds)}
					hideStartDate
					hideEndDate
					refreshOnMount
					refreshOnUpdate
				/>
			
			</>
		);
	}
}


@observer
export class JobList extends React.Component {
	render() {
		const params = Router().params || {};
		const jobIds = (params.jobIds || '')
			.split('-');
		
		return (
			<>
				<PageTitle title={`Job IDs`}/>
				
				<JobListPage jobIds={jobIds}/>
			</>
		);
	}
}


/*

88888 88889 88890

http://localhost:3000/#/jobList/390702-393620-404247-405083-405938-405945


 */