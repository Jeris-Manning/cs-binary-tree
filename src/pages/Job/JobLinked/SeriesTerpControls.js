import React from 'react';
import type {C_JobView} from '../JobUpdate/JobBasics';
import {SimCard} from '../../../Bridge/misc/Card';
import Butt from '../../../Bridge/Bricks/Butt';
import {UpTog} from '../../../Bridge/misc/UpField';
import {LinkedSeriesUpdata} from '../../../datum/LinkedSeriesUpdata';
import {action} from 'mobx';
import {observer} from 'mobx-react';
import {Jewels} from '../../../stores/RootStore';
import {Txt} from '../../../Bridge/Bricks/bricksShaper';
import {TerpDat} from '../../../datum/stache/TerpDat';
import $j from '../../../Bridge/misc/$j';


@observer
export class SeriesTerpControls extends React.Component<C_JobView> {
	
	@action PushTerp = () => {
		const jobRef: JobRef = this.props.jobRef;
		const seriesUp: LinkedSeriesUpdata = jobRef.seriesUp;
		
		const terpDat: TerpDat = jobRef.terp;
		
		let warn = jobRef.hasTerp
			? `Are you sure you want to assign ${terpDat.label} to ${$j.pluralCount(seriesUp.jobsSelectedCount, 'job')}?`
			: `Are you sure you want to REMOVE any interpreters from ${$j.pluralCount(seriesUp.jobsSelectedCount, 'job')}?`;
		
		const areYouSure = window.confirm(warn);
		if (!areYouSure) return;
		
		const vJobSeries: vJobSeries = Jewels().vJobSeries;
		return vJobSeries.PushTerp(seriesUp);
	}
	
	render() {
		const jobRef: JobRef = this.props.jobRef;
		const seriesUp: LinkedSeriesUpdata = jobRef.seriesUp;
		
		if (!jobRef.hasTerp) {
			return (
				<SimCard>
					
					{/*<UpTog*/}
					{/*	state={seriesUp.terpPushSetStatus}*/}
					{/*	label={'Set Status to Searching'}*/}
					{/*/>*/}
					
					
					<Butt
						on={this.PushTerp}
						enabled={seriesUp.jobsSelectedCount}
						label={`Remove terps from (${seriesUp.jobsSelectedCount || 'none'})`}
					/>
				</SimCard>
			)
		}
		
		return (
			<SimCard>
				
				<UpTog
					state={seriesUp.terpPushClearSeekers}
					label={'Clear Active Seekers/Bids'}
					tooltip={'Removes ALL bids/requests/open posts from selected jobs'}
				/>
				
				{/*<UpTog*/}
				{/*	state={seriesUp.terpPushSetStatus}*/}
				{/*	label={'Set Status to Filled'}*/}
				{/*/>*/}
				
				{/*<UpTog*/}
				{/*	state={seriesUp.terpPushNotification}*/}
				{/*	label={'Send Notifications'}*/}
				{/*	tooltip={'Sends an "Assigned" app notification for EACH selected job'}*/}
				{/*/>*/}
				
				{/*<UpTog*/}
				{/*	state={seriesUp.terpPushConfirmation}*/}
				{/*	label={'Send Confirmations'}*/}
				{/*	tooltip={'Sends a confirmation for EACH selected job'}*/}
				{/*/>*/}
				
				<Butt
					on={this.PushTerp}
					enabled={seriesUp.jobsSelectedCount}
					label={`Assign Terp To (${seriesUp.jobsSelectedCount || 'none'})`}
					tooltip={'Be careful with this, it skips checking for demands/credentials/deaf prefs!'}
					danger
					marT={12}
				/>
			</SimCard>
		)
	}
}