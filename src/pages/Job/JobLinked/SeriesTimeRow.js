import {observer} from 'mobx-react';
import React from 'react';
import {computed} from 'mobx';
import {Row, Txt} from '../../../Bridge/Bricks/bricksShaper';
import {Tip} from '../../../Bridge/misc/Tooltip';
import thyme from '../../../Bridge/thyme';
import type {T_SeriesDateSection, T_SeriesTimeRow} from '../../../datum/LinkedSeriesUpdata';
import type {C_JobView} from '../JobUpdate/JobBasics';
import {SeriesJobPillGroup} from './SeriesJobPill';


@observer
class SeriesTimeRow extends React.Component<C_JobView> {
	render() {
		const jobRef: JobRef = this.props.jobRef;
		const timeRow: T_SeriesTimeRow = this.props.timeRow;
		
		return (
			<Row
				wrap
				marV={2}
				childV
			>
				<Tip text={'Start Time'}>
					<Txt
						size={18}
						w={86}
						b
						hue={'#000'}
					>{thyme.nice.time.short(timeRow.time)}</Txt>
				</Tip>
				
				<SeriesJobPillGroup
					timeRow={timeRow}
					jobRef={jobRef}
				/>
			
			</Row>
		);
	}
}


@observer
export class SeriesTimeRowGroup extends React.Component<C_JobView> {
	
	@computed get timeRows(): T_SeriesTimeRow[] {
		const section: T_SeriesDateSection = this.props.section;
		return [...section.times.values()];
	}
	
	render() {
		const jobRef: JobRef = this.props.jobRef;
		
		return (
			<>
				{this.timeRows.map(timeRow => (
					<SeriesTimeRow
						key={timeRow.key}
						timeRow={timeRow}
						jobRef={jobRef}
					/>
				))}
			</>
		);
		
	}
}