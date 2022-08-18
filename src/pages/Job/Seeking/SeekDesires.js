import React from 'react';
import {observer} from 'mobx-react';
import {Col, Row} from '../../../Bridge/Bricks/bricksShaper';
import {MdAddCircleOutline} from 'react-icons/md';
import {WantedTerpsField} from './WantedTerps';
import {HiddenUntil} from '../../../Bridge/misc/HiddenUntil';
import type {C_JobView} from '../JobUpdate/JobBasics';
import {JobCard} from '../JobUpdate/JobBasics';
import {TerpDat} from '../../../datum/stache/TerpDat';
import {JobUpdata} from '../../../datum/JobUpdata';
import {SeekPrefName} from './SeekDeafCard';

@observer
export class SeekDesires extends React.Component<C_JobView> {
	render() {
		const jobRef: JobRef = this.props.jobRef;
		const jobUp: JobUpdata = jobRef.jobUp;
		
		const wantedTerps: TerpDat[] = jobUp.wantedTerps.value || [];
		const terpCount = wantedTerps.length;
		const lastDex = terpCount - 1;
		
		console.log(`----- wantedTerps: ${wantedTerps.length}`, wantedTerps);
		
		if (terpCount === 0) {
			return (
				<HiddenUntil
					label={'Add Wanted Terp'}
					icon={MdAddCircleOutline}
					iconSize={14}
					subtle
					mini
					primary
				>
					<WantedTerpsField
						jobRef={jobRef}
					/>
				</HiddenUntil>
			);
		}
		
		return (
			<JobCard
				canSave={jobUp.wantedTerps.hasChanged}
			>
				<Row
					childV
					wrap
				>
					{wantedTerps.map((terpDat, dex) => (
						<SeekPrefName
							key={terpDat.key}
							terpKey={terpDat.key}
							jobRef={jobRef}
							terpDat={terpDat}
							comma={dex !== lastDex}
						/>
					))}
				</Row>
				
				<Row h={12}/>
				
				<HiddenUntil
					icon={MdAddCircleOutline}
					label={'Add Wanted Terp'}
					iconSize={14}
					subtle
					mini
					primary
				>
					<WantedTerpsField
						jobRef={jobRef}
					/>
				</HiddenUntil>
			</JobCard>
		);
		
		
		
		// if (this.wantedTerps.length === 0 && !this.showWantedTerpsField) {
		// 	return (
		// 		<Butt
		// 			on={this.SetShowWantedTerpsField}
		// 			label={'Add Wanted Terp'}
		// 			// labelSize={12}
		// 			icon={MdAddCircleOutline}
		// 			iconSize={14}
		// 			subtle
		// 			mini
		// 			primary
		// 		/>
		// 	);
		// }
		//
		// return (
		// 	<SimCard header={'Wanted Interpreters'}>
		// 		<Row wrap>
		// 			{this.wantedTerps.map(terp => (
		// 					<WantedTerp
		// 						key={terp.terpId}
		// 						terp={terp}
		// 					/>
		// 				))}
		//
		// 			{!this.showWantedTerpsField && (
		// 				<Butt
		// 					on={this.SetShowWantedTerpsField}
		// 					icon={MdAddCircleOutline}
		// 					iconSize={16}
		// 					subtle
		// 					mini
		// 					primary
		// 					marL={12}
		// 					tooltip={'Add Wanted Terp'}
		// 				/>
		// 			)}
		// 		</Row>
		//
		// 		{this.showWantedTerpsField && (
		// 			<WantedTerpsField state={this.upstate.wantedTerps}/>
		// 		)}
		// 	</SimCard>
		// );
	}
}
