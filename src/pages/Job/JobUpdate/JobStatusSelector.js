import React from 'react';
import type {C_JobView} from './JobBasics';
import {observer} from 'mobx-react';
import {SelectorField} from '../../../Bridge/misc/SelectorField';

@observer
export class JobStatusSelector extends React.Component<C_JobView> {
	render() {
		const jobRef: JobRef = this.props.jobRef;
		
		return (
			<SelectorField
				state={jobRef.jobUp.status}
				// tabi={tabi + 1}
				w={200}
				h={60}
				saveAsKey
			/>
		)
	}
}