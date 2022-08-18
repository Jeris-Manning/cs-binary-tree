import {observer} from 'mobx-react';
import React from 'react';
import {Jewels, Staches} from '../../../stores/RootStore';
import {Col, Txt} from '../../../Bridge/Bricks/bricksShaper';
import type {C_JobView} from '../JobUpdate/JobBasics';
import {SelectorField} from '../../../Bridge/misc/SelectorField';
import type {C_TerpDat} from '../../../datum/stache/TerpDat';
import {TerpDat} from '../../../datum/stache/TerpDat';
import {SeekPrefName} from './SeekDeafCard';

@observer
export class WantedTerp extends React.Component<C_TerpDat> {
	render() {
		const jobRef: JobRef = this.props.jobRef;
		const terpDat: TerpDat = this.props.terpDat;
		const comma = this.props.comma;
		
		return (
			<SeekPrefName
				terpKey={terpDat.key}
				jobRef={jobRef}
				terpDat={terpDat}
				comma={comma}
			/>
		);
	}
}

@observer
export class WantedTerpsField extends React.Component<C_JobView> {
	render() {
		// const { tabi } = this.props;
		const jobRef: JobRef = this.props.jobRef;
		const jobUp = jobRef.jobUp;
		
		return (
			<Col>
				<Txt
					hue={'#3c3c3c'}
					caps
					size={12}
					marT={8}
					marB={4}
				>Wanted Interpreters</Txt>
				
				<SelectorField
					state={jobUp.wantedTerps}
					choices={Jewels().vTerpLists.activeTerpDats}
					placeholder={'none'}
					// tabi={tabi}
					multiple
					hideOutline
				/>
			</Col>
		);
	}
}