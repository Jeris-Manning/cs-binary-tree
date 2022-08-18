import React from 'react';
import {observer} from 'mobx-react';
import {Jewels} from 'stores/RootStore';
import {computed} from 'mobx';
import {Col, Row} from '../../../Bridge/Bricks/bricksShaper';
import {MdCheckBox, MdCheckBoxOutlineBlank, MdLayersClear,} from 'react-icons/md';
import Butt from '../../../Bridge/Bricks/Butt';
import {SeekWhyNot} from './SeekWhyNot';
import {FaRegHeart} from 'react-icons/fa';
import type {C_JobView} from '../JobUpdate/JobBasics';
import {JobCard} from '../JobUpdate/JobBasics';
import {UpCycleButt} from '../../../Bridge/misc/UpField';
import {SeekTerpRow} from './SeekTerpRow';

@observer
export class SeekTerpSelectionList extends React.Component<C_JobView> {
	render() {
		const jobRef: JobRef = this.props.jobRef;
		const listHeight = this.props.listHeight;
		
		return (
			<JobCard>
			
				<OptionBar jobRef={jobRef}/>
				
				<Col
					h={listHeight}
					overflow
					padV={12}
				>
					<TerpGrid jobRef={jobRef}/>
				</Col>
			
			</JobCard>
		)
		
	}
}

@observer
class OptionBar extends React.Component<C_JobView> {
	render() {
		const jobRef: JobRef = this.props.jobRef;
		const seekUp: SeekUpdata = jobRef.seekUp;
		
		const vJobSeek = Jewels().vJobSeek;
		
		return (
			<Row>
				<Butt
					on={() => vJobSeek.SelectAll(jobRef)}
					icon={jobRef.hasAllTerpsSelected ? MdCheckBox : MdCheckBoxOutlineBlank}
					subtle
					primary
					label={`${jobRef.terpsFilteredCount}`}
					tooltip={'Select All'}
				/>
				
				<Col grow/>
				
				<Butt
					on={() => vJobSeek.SelectAllPreferred(jobRef)}
					subtle
					secondary
					icon={FaRegHeart}
					tooltip={`Select Preferred terps`}
					// mini
				/>
				
				<Col grow/>
				
				<SeekWhyNot jobRef={jobRef}/>
				
				<Col grow/>
				
				<UpCycleButt state={seekUp.terpSorting}/>
				
				<Col grow/>
				
				<Butt
					on={() => vJobSeek.ResetFiltersAndSelected(jobRef)}
					icon={MdLayersClear}
					subtle
					secondary
					// marL={12}
					tooltip={'Reset Filters / Selection'}
					mini
				/>
			</Row>
		)
	}
}

@observer
class TerpGrid extends React.Component<C_JobView> {
	render() {
		const jobRef: JobRef = this.props.jobRef;
		
		return (
			<Col>
				{jobRef.terpsFilteredAndSorted.map(seekTerpInfo => (
						<SeekTerpRow
							key={seekTerpInfo.key}
							jobRef={jobRef}
							seekTerpInfo={seekTerpInfo}
							isSelectable
						/>
					)
				)}
			</Col>
		);
	}
}
