import React from 'react';
import {observer} from 'mobx-react';
import {Jewels} from 'stores/RootStore';
import {SimCard} from '../Bridge/misc/Card';
import Griddle_DEPRECATED from '../Bridge/Griddle/Griddle_DEPRECATED';
import Cell_Date from '../Bridge/Griddle/Cells/Cell_Date';
import Cell_Time from '../Bridge/Griddle/Cells/Cell_Time';
import Cell_Phone from '../Bridge/Griddle/Cells/Cell_Phone';
import Loading from '../Bridge/misc/Loading';
import Cell_Terp from '../Bridge/Griddle/Cells/Cell_Terp';

@observer
export class NowTerp extends React.Component {
	render() {
		const nowTerp = Jewels().nowTerp;
		
		return (
			<>
				<SimCard header='' noPad>
					{nowTerp.isWaiting && <Loading/>}
					<Griddle_DEPRECATED
						columns={columns}
						rows={nowTerp.shifts}
						spannerTop
					/>
				</SimCard>
			</>
		);
	}
}

const columns = [
	{
		key: 'date',
		header: 'Date',
		accessor: 'start',
		cell: Cell_Date,
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
		header: 'Terp',
		accessor: 'terpId',
		w: '1fr',
		cell: Cell_Terp,
	},
	{
		header: 'Phone',
		accessor: 'phone',
		cell: Cell_Phone,
	},
	{
		header: 'Note',
		accessor: 'note',
		w: '2fr'
	},
];