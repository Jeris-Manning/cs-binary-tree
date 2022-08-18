import {observer} from 'mobx-react';
import React from 'react';
import {computed} from 'mobx';
import {Col, Txt} from '../../../Bridge/Bricks/bricksShaper';
import Butt from '../../../Bridge/Bricks/Butt';
import {MdAssignmentTurnedIn} from 'react-icons/md';
import {HUE} from '../../../Bridge/HUE';
import {Jewels} from '../../../stores/RootStore';

@observer
export class SeekSelected extends React.Component<C_JobView> {
	
	@computed get count(): number {
		return this.props.jobRef.selectedTerpsCount;
	}
	
	render() {
		const jobRef: JobRef = this.props.jobRef;
		const listMaxHeight = this.props.listMaxHeight;
		const vJobSeek: vJobSeek = Jewels().vJobSeek;
		
		if (jobRef.hasAllTerpsSelected) {
			return (
				<Txt i>All {this.count} terps are selected.</Txt>
			);
		}
		
		if (this.count === 0) {
			return (
				<Txt i>No terps are selected.</Txt>
			);
		}
		
		if (this.count === 1) {
			const terpDat = jobRef.selectedTerpsArray[0];
			
			return (
				<>
					<Txt
						key={terpDat.key}
					>{terpDat.label}</Txt>
					
					<Butt
						on={() => vJobSeek.ForceAssignTerp(jobRef, terpDat)}
						icon={MdAssignmentTurnedIn}
						danger
						label={'Assign Now'}
						tooltip={['Skip seeking and assign this interpreter now', '(will clear all active seekers & bids)']}
						maxWidth={240}
						marT={16}
						mini
					/>
				</>
			);
		}
		
		return (
			<>
				<Txt
					size={20}
					hue={HUE.blueDeep}
					childCenterV
				>
					{this.count} Selected
				</Txt>
				
				<Col
					wrap
					maxHeight={listMaxHeight}
					scrollV
				>
					{jobRef.selectedTerpsArray.map(terpDat => (
						<Txt
							key={terpDat.key}
						>{terpDat.label}</Txt>
					))}
				</Col>
			</>
		);
	}
}