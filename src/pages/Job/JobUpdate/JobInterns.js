import React from 'react';
import {observer} from 'mobx-react';
import {action, observable} from 'mobx';
import {Jewels} from '../../../stores/RootStore';
import Butt from '../../../Bridge/Bricks/Butt';
import {Col, Row, Txt} from '../../../Bridge/Bricks/bricksShaper';
import {FaUserGraduate} from 'react-icons/fa';
import Linker from '../../../Bridge/Nav/Linker';
import type {C_JobView} from './JobBasics';
import type {C_TerpDat} from '../../../datum/stache/TerpDat';
import {TerpDat} from '../../../datum/stache/TerpDat';
import {SelectorField} from '../../../Bridge/misc/SelectorField';
import {JobUpdata} from '../../../datum/JobUpdata';
import {SeekPrefName} from '../Seeking/SeekDeafCard';

@observer
export class JobInterns extends React.Component<C_JobView> {
	@observable showInternsField = false;
	@action SetShowInternsField = (show) => this.showInternsField = show;
	
	render() {
		const jobRef: JobRef = this.props.jobRef;
		const jobUp: JobUpdata = jobRef.jobUp;
		
		const interns: TerpDat[] = jobUp.interns.value || [];
		const internCount = interns.length;
		const lastDex = internCount - 1;
		
		if (interns.length === 0 && !this.showInternsField) {
			return (
				<Row>
					<Butt
						on={() => this.SetShowInternsField(true)}
						label={'Add Interns'}
						labelSize={12}
						labelHue={'#797979'}
						icon={FaUserGraduate}
						iconSize={14}
						iconHue={'#797979'}
						subtle
						mini
						secondary
					/>
				</Row>
			);
		}
		
		return (
			<>
				<Row wrap>
					
					{!this.showInternsField && (
						<Butt
							on={() => this.SetShowInternsField(true)}
							icon={FaUserGraduate}
							iconSize={16}
							subtle
							mini
							secondary
							marR={12}
							tooltip={'Add/Edit Interns'}
						/>
					)}
					
					{interns.map((terpDat, dex) => (
						<SeekPrefName
							key={terpDat.key}
							terpKey={terpDat.key}
							jobRef={jobRef}
							terpDat={terpDat}
							comma={dex !== lastDex}
						/>
						// <Intern
						// 	key={terpDat.key}
						// 	terpDat={terpDat}
						// 	comma={dex !== lastDex}
						// />
					))}
				</Row>
				
				{this.showInternsField && (
					<>
						<Row h={12}/>
						<InternSelector jobRef={jobRef}/>
					</>
				)}
			</>
		);
	}
}

@observer
class InternSelector extends React.Component<C_JobView> {
	
	render() {
		const jobRef: JobRef = this.props.jobRef;
		const jobUp = jobRef.jobUp;
		
		return (
			<SelectorField
				state={jobUp.interns}
				choices={Jewels().vTerpLists.internTerpDats}
				placeholder={'Add Intern'}
				multiple
				w={280}
				hideOutline
			/>
		)
	}
}


@observer
class Intern extends React.Component<C_TerpDat> {
	
	render() {
		const terpDat: TerpDat = this.props.terpDat;
		
		return (
			<Col marR={8}>
					<Linker toKey={'terp'} params={{terpId: terpDat.key}}>
						<Txt i>
							{terpDat.label}
						</Txt>
					</Linker>
			</Col>
		);
	}
}