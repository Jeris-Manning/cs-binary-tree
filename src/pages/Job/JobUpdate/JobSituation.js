import React from 'react';
import {observer} from 'mobx-react';
import {computed, trace} from 'mobx';
import {UpField} from '../../../Bridge/misc/UpField';
import {Row} from '../../../Bridge/Bricks/bricksShaper';
import {Upstate} from '../../../Bridge/misc/Upstate';
import {JobCard} from './JobBasics';
import type {C_JobView} from './JobBasics';
import {SelectorField} from '../../../Bridge/misc/SelectorField';
import {WantedTerpsField} from '../Seeking/WantedTerps';

const RECEIVED_CHOICES = {
	'phone': 'Phone',
	'email': 'Email',
	'voicemail': 'Voicemail',
	'fax': 'Fax',
	'text': 'Text',
	'chat': 'Chat',
	'internal': 'Internal',
	'radio': 'Radio Transmission',
};

@observer
export class JobSituation extends React.Component<C_JobView> {
	
	@computed get isInvalid() {
		const jobUp = this.props.jobRef.jobUp;
		return Upstate.AnyError(
			jobUp.situation,
			jobUp.requestedBy,
			jobUp.receivedFrom,
			jobUp.contactUponArrival,
			jobUp.specialNotes,
		);
	}
	
	@computed get canSave() {
		const jobUp = this.props.jobRef.jobUp;
		return Upstate.AnyChange(
			jobUp.situation,
			jobUp.requestedBy,
			jobUp.receivedFrom,
			jobUp.contactUponArrival,
			jobUp.specialNotes,
		);
	}
	
	render() {
		// const {	tabi } = this.props;
		const jobRef: JobRef = this.props.jobRef;
		const jobUp = jobRef.jobUp;
		
		return (
			<JobCard
				isInvalid={this.isInvalid}
				canSave={this.canSave}
			>
				
				<UpField
					label={'Situation'}
					state={jobUp.situation}
					multiline
					// tabi={tabi + 0}
					h={160}
				/>
				
				<Row childSpread marT={8}>
					<UpField
						label={'Requested By / From'}
						state={jobUp.requestedBy}
						// tabi={tabi + 1}
						grow
					/>
					
					<SelectorField
						state={jobUp.receivedFrom}
						placeholder={'From...'}
						// tabi={tabi + 2}
						grow
						maxWidth={'40%'}
						marL={8}
						saveAsKey
					/>
				</Row>
				
				<WantedTerpsField
					jobRef={jobRef}
					// tabi={tabi + 3}
				/>
				
				<UpField
					label={'Contact Upon Arrival'}
					state={jobUp.contactUponArrival}
					// tabi={tabi + 4}
					marT={8}
				/>
				
				<UpField
					label={'Special Notes'}
					state={jobUp.specialNotes}
					// tabi={tabi + 5}
					marT={8}
					multiline
					h={120}
				/>
				
				<UpField
					label={'Created By'}
					state={jobUp.createdBy}
					// tabi={tabi + 6}
					marT={8}
				/>
			</JobCard>
		);
	}
}

