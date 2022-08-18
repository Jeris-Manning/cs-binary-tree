import React from 'react';
import {observer} from 'mobx-react';
import {Jewels} from 'stores/RootStore';
import thyme from '../Bridge/thyme';
import {Col} from '../Bridge/Bricks/bricksShaper';
import Griddle_DEPRECATED from '../Bridge/Griddle/Griddle_DEPRECATED';
import {MdPlayArrow} from 'react-icons/md';
import {SimCard} from '../Bridge/misc/Card';
import Cell_DateTime from '../Bridge/Griddle/Cells/Cell_DateTime';
import Butt from '../Bridge/Bricks/Butt';
import Cell_Button from '../Bridge/Griddle/Cells/Cell_Button';

@observer
export class Cron extends React.Component {
	
	
	render() {
		const oCron = Jewels().cron;
		
		return (
			<>
				<SimCard
					header={`Server loaded at: ${oCron.loadedAt && thyme.nice.dateTime.short(oCron.loadedAt) || '?'}`}>
					<Griddle_DEPRECATED
						rows={oCron.crons}
						columns={columns}
					/>
					
					<Col marT={50} childCenterH>
						<Butt
							on={oCron.ForceReload}
							label={'Force Reload'}
							danger
						/>
					</Col>
				</SimCard>
			</>
		);
	}
}

const columns = [
	{
		header: 'id',
		accessor: 'id',
	},
	{
		header: 'script',
		accessor: 'script',
	},
	{
		header: 'desc',
		accessor: 'description',
	},
	{
		header: 'runs',
		accessor: 'readable',
	},
	{
		header: 'last ran at',
		accessor: 'lastRanAt',
		cell: Cell_DateTime,
	},
	{
		header: 'last result',
		accessor: 'lastResult',
	},
	{
		header: '',
		key: 'forceRun',
		accessor: 'id',
		cell: Cell_Button,
		cellProps: row => ({
			w: 100,
			icon: MdPlayArrow,
			onPress: () => row.ForceRun(),
			tooltip: 'Force Run Now',
		})
	}
];