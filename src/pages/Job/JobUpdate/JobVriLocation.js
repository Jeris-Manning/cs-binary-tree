import React from 'react';
import {observer} from 'mobx-react';
import {computed} from 'mobx';
import {UpField} from '../../../Bridge/misc/UpField';
import type {C_JobView} from './JobBasics';
import {JobCard} from './JobBasics';
import {Upstate} from '../../../Bridge/misc/Upstate';

@observer
export class JobVriLocation extends React.Component<C_JobView> {
	
	@computed get isInvalid() {
		const jobUp = this.props.jobRef.jobUp;
		return Upstate.AnyError(jobUp.vriLink, jobUp.vriPassword, jobUp.vriOther);
	}
	
	@computed get canSave() {
		const jobUp = this.props.jobRef.jobUp;
		return Upstate.AnyChange(jobUp.vriLink, jobUp.vriPassword, jobUp.vriOther);
	}
	
	render() {
		// const {
		// 	tabi
		// } = this.props;
		
		const jobRef: JobRef = this.props.jobRef;
		const jobUp = jobRef.jobUp;
		
		if (!jobRef.isVri) return <></>;
		
		return (
			<JobCard
				isInvalid={this.isInvalid}
				canSave={this.canSave}
			>
				<UpField
					label={'VRI Link'}
					state={jobUp.vriLink}
					multiline
					// tabi={tabi + 0}
					h={100}
				/>
				
				<UpField
					label={'VRI Password'}
					state={jobUp.vriPassword}
					// tabi={tabi + 1}
					marT={8}
				/>
				
				<UpField
					label={'VRI Misc'}
					state={jobUp.vriOther}
					multiline
					h={160}
					// tabi={tabi + 2}
					marT={8}
				/>
			</JobCard>
		);
	}
}

/*

{
  "links": [
    {
      "service": "",
      "title": "",
      "url": "",
      "id": "",
      "password": "",
      "note": ""
    }
  ]
}


*/