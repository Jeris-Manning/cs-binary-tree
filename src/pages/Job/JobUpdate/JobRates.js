import React from 'react';
import {observer} from 'mobx-react';
import {computed} from 'mobx';
import {UpField} from '../../../Bridge/misc/UpField';
import {Col, Row, Txt} from '../../../Bridge/Bricks/bricksShaper';
import {Upstate} from '../../../Bridge/misc/Upstate';
import type {C_JobView} from './JobBasics';
import {JobCard} from './JobBasics';

@observer
export class JobRates extends React.Component<C_JobView> {
	
	@computed get isInvalid() {
		const jobUp = this.props.jobRef.jobUp;
		return Upstate.AnyError(jobUp.hourMin);
	}
	
	@computed get canSave() {
		const jobUp = this.props.jobRef.jobUp;
		return Upstate.AnyChange(
			jobUp.rate,
			jobUp.cap,
			jobUp.hourMin,
			jobUp.overrideRate,
			jobUp.flatRate,
		);
	}
	
	render() {
		// const { 	tabi } = this.props;
		const jobRef: JobRef = this.props.jobRef;
		const jobUp = jobRef.jobUp;
		
		return (
			<JobCard
				isInvalid={this.isInvalid}
				canSave={this.canSave}
			>
				<Row childSpread childS>
					<UpField
						label={'Rate'}
						state={jobUp.rate}
						// tabi={tabi + 1}
						w={'14%'}
					/>
					<UpField
						label={'Cap'}
						state={jobUp.cap}
						// tabi={tabi + 2}
						w={'14%'}
					/>
					<UpField
						label={'Hour Min'}
						state={jobUp.hourMin}
						// tabi={tabi + 3}
						w={'14%'}
						int
					/>
					<UpField
						label={'Override Rate'}
						state={jobUp.overrideRate}
						description={'The rate this interpreter is approved to bill per hour.'}
						// tabi={tabi + 4}
						w={'25%'}
					/>
					<UpField
						label={'Flat Rate'}
						state={jobUp.flatRate}
						description={'The total amount a terp can bill for this job, including travel.'}
						// tabi={tabi + 5}
						w={'18%'}
					/>
				</Row>
				
			</JobCard>
		);
	}
}

@observer
export class JobTravel extends React.Component<C_JobView> {
	
	@computed get canSave() {
		const jobUp = this.props.jobRef.jobUp;
		return Upstate.AnyChange(
			jobUp.terpTravel,
			jobUp.terpTravelRate,
			jobUp.companyTravel,
			jobUp.companyTravelRate,
		);
	}
	
	render() {
		// const {tabi} = this.props;
		const jobRef: JobRef = this.props.jobRef;
		const jobUp = jobRef.jobUp;
		
		return (
			<JobCard
				canSave={this.canSave}
			>
				<Row marT={8}>
					<Col maxWidth={'47%'} grow>
						<Txt b>Interpreter</Txt>
						
						<Row marT={4}>
							<UpField
								label={'Travel'}
								state={jobUp.terpTravel}
								// tabi={tabi + 6}
								grow
								shrink
								maxWidth={'48%'}
							/>
							
							<Col grow/>
							
							<UpField
								label={'Rate'}
								state={jobUp.terpTravelRate}
								// tabi={tabi + 7}
								grow
								shrink
								maxWidth={'48%'}
							/>
						</Row>
					</Col>
					
					<Col grow/>
					
					<Col maxWidth={'47%'} grow>
						<Txt b>Company</Txt>
						
						<Row marT={4}>
							<UpField
								label={'Travel'}
								state={jobUp.companyTravel}
								// tabi={tabi + 8}
								grow
								shrink
								maxWidth={'48%'}
							/>
							
							<Col grow/>
							
							<UpField
								label={'Rate'}
								state={jobUp.companyTravelRate}
								// tabi={tabi + 9}
								grow
								shrink
								maxWidth={'48%'}
							/>
						</Row>
					</Col>
				</Row>
			</JobCard>
		);
	}
}