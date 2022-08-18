import React, {Component} from 'react';
import {Txt} from '../../Bridge/Bricks/bricksShaper';
import {observer} from 'mobx-react';
import {Jewels, Router, Staches} from 'stores/RootStore';
import {PageTitle} from '../../Bridge/misc/NavPage';
import {JobTable} from '../../components/JobTable';


@observer
class LocationDetails extends React.Component {
	
	render() {
		const oJobs = Jewels().jobs;
		const locationId = this.props.locationId;
		
		// if (oCompany.isLoading) return (
		// 	<Loading/>
		// );
		
		
		return (
			<>
				<PageTitle title={`location ${locationId}`}/>
				
				<Txt>TODO: locationId {locationId}</Txt>
				
				
				<JobTable
					getAllJobs={(params) => oJobs.GetJobsBy({
						by: 'location',
						locationId: locationId,
						...params,
					})}
				/>
			
			</>
		);
	}
}


@observer
export class Location extends React.Component {
	render() {
		const params = Router().params;
		
		return (
			<>
				<LocationDetails {...params}/>
			</>
		);
	}
}
