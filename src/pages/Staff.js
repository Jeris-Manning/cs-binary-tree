import React, {Component} from 'react';
import {observer} from 'mobx-react';
import {Jewels, Router, Staches} from 'stores/RootStore';
import {computed} from 'mobx';
import {PageTitle} from '../Bridge/misc/NavPage';
import {Txt} from '../Bridge/Bricks/bricksShaper';


@observer
class StaffDetails extends React.Component {
	
	@computed get name() {
		return '??? Staff';
	}
	
	render() {
		const oJobs = Jewels().jobs;
		const staffId = this.props.staffId;
		
		// if (oCompany.isLoading) return (
		// 	<Loading/>
		// );
		
		
		return (
			<>
				<PageTitle title={`${this.name} (${staffId})`}/>
				
				<Txt>TODO: staffId {staffId}</Txt>
				
				{/*<JobTable*/}
				{/*	getAllJobs={(params) => oJobs.GetJobsBy({*/}
				{/*		by: 'staff',*/}
				{/*		staffId: staffId,*/}
				{/*		...params,*/}
				{/*	})}*/}
				{/*/>*/}
			
			</>
		);
	}
}


@observer
export class Staff extends React.Component {
	render() {
		const params = Router().params;
		
		return (
			<>
				<StaffDetails {...params}/>
			</>
		);
	}
}
