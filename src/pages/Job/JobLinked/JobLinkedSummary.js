import React from 'react';
import {observer} from 'mobx-react';
import {Col, Row, Txt} from '../../../Bridge/Bricks/bricksShaper';
import {SimpKvpLabel} from '../../../Bridge/misc/SimpKvpLabel';
import type {C_JobView} from '../JobUpdate/JobBasics';
import {JobCard} from '../JobUpdate/JobBasics';
import {LinkToJob} from '../LinkToJob';
import {JobSeriesDat} from '../../../datum/stache/JobSeriesDat';

@observer
export class JobLinkedSummary extends React.Component<C_JobView> {
	
	render() {
		const jobRef: JobRef = this.props.jobRef;
		const seriesDat: JobSeriesDat = jobRef.seriesDat;
		const count = (seriesDat.jobIds || []).length;

		return (
			<JobCard>
				<Row childCenterV>
					<LinkToJob
						jobId={jobRef.jobId}
						tabKey={'linked'}
					/>

					<Col w={24}/>

					<Txt marR={4}>
						Linked Jobs:
					</Txt>

					<Txt>
						{count}
					</Txt>

				</Row>
				
				<SimpKvpLabel
					label={'Linked Note'}
					value={seriesDat.note}
				/>
			</JobCard>
		);
	}
}