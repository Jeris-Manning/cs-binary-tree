import React from 'react';
import {observer} from 'mobx-react';
import {Jewels, Staches} from 'stores/RootStore';
import {computed} from 'mobx';
import {Row} from '../../../Bridge/Bricks/bricksShaper';
import type {C_JobView} from './JobBasics';
import {SelectorField} from '../../../Bridge/misc/SelectorField';


@observer
export class JobBillType extends React.Component<C_JobView> {
	
	@computed get billTypes() {
		const dat = Staches().cBillType.GetEnumClutch().dat;
		return dat.entries.map(choice => ({
			...choice,
			color: choice.billed ? 'red' : 'blue',
		}));
	}
	
	render() {
		const jobRef: JobRef = this.props.jobRef;
		const vJobUpdate: vJobUpdate = Jewels().vJobUpdate;
		
		return (
			<Row
				mar={12}
			>
				
				<SelectorField
					state={jobRef.jobUp.billType}
					saveAs={'label'}
					Change={(label, billTypeEntry) => vJobUpdate.ChangeBillType(jobRef, billTypeEntry)}
					choices={this.billTypes}
					grow
					h={45}
					FindChoice={FindBillTypeOption}
				/>
			
			</Row>
		);
	}
}

function FindBillTypeOption(choices, value) {
	return choices.find(choice => choice.label === value); // :(
}