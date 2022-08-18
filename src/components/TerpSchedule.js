import React from 'react';
import {Col, Row, Txt} from '../Bridge/Bricks/bricksShaper';
import {observer} from 'mobx-react';
import {Jewels, Staches} from 'stores/RootStore';
import {MdEventBusy} from 'react-icons/md';
import Griddle_DEPRECATED from '../Bridge/Griddle/Griddle_DEPRECATED';
import Cell_Date from '../Bridge/Griddle/Cells/Cell_Date';
import Cell_Time from '../Bridge/Griddle/Cells/Cell_Time';
import thyme from '../Bridge/thyme';
import Cell_MapLink from '../Bridge/Griddle/Cells/Cell_MapLink';
import {Tip} from '../Bridge/misc/Tooltip';
import Cell_DeafNames from '../Bridge/Griddle/Cells/Cell_DeafNames';
import Butt from '../Bridge/Bricks/Butt';
import Linker from '../Bridge/Nav/Linker';
import Cell_JobLink_DEP from '../Bridge/Griddle/Cells/Cell_JobLink_DEP';
import {Cell_ScheduleSituation} from '../Bridge/Griddle/Cells/Cell_ScheduleSituation';
import {Avatar} from './Avatar';

@observer
export class TerpSchedule extends React.Component {
	render() {
		const {
			terpId
		} = this.props;
		
		const vTerpSched = Jewels().vTerpSched;
		
		const terp = Staches().cTerp.GetOrStub(terpId, true, 'TerpSchedule').dat;
		const photo = Staches().cTerpPhoto.GetOrStub(terpId).dat;
		const schedule = vTerpSched.terpScheduleLup[terpId] || [];
		const busyTimes = vTerpSched.busyTimesLup[terpId] || [];
		
		const rows = Object.values(schedule)
			.concat(busyTimes)
			.filter(j => j.start <= thyme.nowPlus({days: 14}))
			.sort(thyme.sorter('start'));
		
		return (
			<Col>
				<Row childW childCenterV mar={16}>
					
					<Avatar
						key={terpId}
						personObj={terp}
						photo={photo.url}
						linkToKey={'terp'}
						linkParams={{terpId: terpId}}
						size={60}
					/>
					
					<Tip text={`TerpId: ${terp.terpId}`}>
						<Linker toKey={'terp'} params={{terpId: terpId}}>
							<Txt b size={22} marL={16}>{terp.label}</Txt>
						</Linker>
					</Tip>
					
					<Txt i size={22} marL={16} hue={'#4f4f4f'}>{terp.specialty}</Txt>
					
					<Butt
						on={() => this.props.openBusyModal(terpId, terp.label)}
						icon={MdEventBusy}
						subtle
						mini
						marL={12}
						tooltip={'Add Busy Time'}
						selfStart={false}
					/>
				</Row>
				
				<Griddle_DEPRECATED
					rows={rows}
					columns={columns}
					rowClass={(row, prevRow) => getRowClass(row, prevRow)}
					// manualEvenOdd
				/>
			</Col>
		);
	}
}

function getRowClass(row, prevRow) {
	let rowClass = '';
	if (row.isCancelled)
		rowClass += ' -danger';
	
	return rowClass;
}

const columns = [
	{
		key: 'date',
		header: 'Date',
		accessor: 'start',
		cell: Cell_Date,
		cellProps: row => ({
			hue: row.isCancelled ? '#ea4d59' : '',
			tooltip: row.isCancelled ? 'Cancelled' : '',
			lineThrough: row.isCancelled,
		}),
	},
	{
		key: 'dayOfWeek',
		accessor: 'start',
		cell: Cell_Date,
		dateFormat: 'EEE',
	},
	{
		header: 'Start',
		accessor: 'start',
		cell: Cell_Time,
	},
	{
		header: 'End',
		accessor: 'end',
		cell: Cell_Time,
	},
	{
		header: 'Job ID',
		accessor: 'jobId',
		cell: Cell_JobLink_DEP,
	},
	{
		header: 'Situation',
		accessor: 'situation',
		w: '1fr',
		// cell: Cell_TextTrunc,
		cell: Cell_ScheduleSituation,
		valueGetter: row => row.jobId ? row.situation : ('#' + (row.note || row.comment)),
	},
	{
		// key: 'deafNames',
		header: 'Deaf',
		accessor: 'deaf',
		cell: Cell_DeafNames,
	},
	{
		header: 'Address',
		accessor: 'address',
		w: '1.5fr',
		cell: Cell_MapLink,
	},
];