import React, {Component} from 'react';
import {observer} from 'mobx-react';
import {Jewels, Staches} from 'stores/RootStore';
import {computed} from 'mobx';
import Griddle_DEPRECATED from '../../Bridge/Griddle/Griddle_DEPRECATED';
import Cell_Date from '../../Bridge/Griddle/Cells/Cell_Date';
import Cell_Time from '../../Bridge/Griddle/Cells/Cell_Time';
import Cell_TextTrunc from '../../Bridge/Griddle/Cells/Cell_TextTrunc';
import Cell_DeafNames from '../../Bridge/Griddle/Cells/Cell_DeafNames';
import Cell_MapLink from '../../Bridge/Griddle/Cells/Cell_MapLink';
import Cell_JobLink_DEP from '../../Bridge/Griddle/Cells/Cell_JobLink_DEP';
import thyme from '../../Bridge/thyme';
import {Cell_ScheduleSituation} from '../../Bridge/Griddle/Cells/Cell_ScheduleSituation';


@observer
export default class ScheduleOverview extends React.Component {
	
	@computed get rows() {
		const {
			schedule,
			notes,
		} = this.props;
		
		const scheduleRows = schedule ? (Array.isArray(schedule) ? schedule : Object.values(schedule)) : [];
		const notesRows = notes ? (Array.isArray(notes) ? notes : Object.values(notes)) : [];
		
		return scheduleRows.concat(notesRows)
			.sort(thyme.sorter('start'));
	}
	
	render() {
		return (
			<Griddle_DEPRECATED
				rows={this.rows}
				columns={columns}
				rowClass={(row, prevRow) => getRowClass(row, prevRow)}
			/>
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
		cell: Cell_ScheduleSituation,
		valueGetter: row => row.jobId ? row.situation : ('#' + (row.note || row.comment)),
	},
	{
		key: 'deafNames',
		header: 'Deaf',
		accessor: 'deaf',
		cell: Cell_DeafNames,
	},
	{
		header: 'Address',
		key: 'address',
		valueGetter: row => (row.location || {}).address,
		w: '1.5fr',
		cell: Cell_MapLink,
	},
];