import {SimCard} from '../../Bridge/misc/Card';
import Butt from '../../Bridge/Bricks/Butt';
import thyme from '../../Bridge/thyme';
import Griddle_DEPRECATED from '../../Bridge/Griddle/Griddle_DEPRECATED';
import React from 'react';
import {observer} from 'mobx-react';
import {Jewels, Staches} from 'stores/RootStore';
import {MdRefresh} from 'react-icons/md';
import {action, observable} from 'mobx';
import {Col, Row} from '../../Bridge/Bricks/bricksShaper';
import {VictoryChart, VictoryLine, VictoryScatter, VictoryTooltip} from 'victory';
import {Txt} from '../../Bridge/Bricks/bricksShaper';
import {SimDateEntry} from '../../Bridge/misc/SimDateEntry';

const DEFAULT_START = thyme.nowMinus({days: 60}).startOf('day');
const DEFAULT_END = thyme.nowPlus({days: 31}).endOf('day');

@observer
export class MiscQueryReport extends React.Component {
	
	@action Load1 = async () => {
		const oQuery = Jewels().miscQueryReports;
		
		return oQuery.Load1(
			this.startInput.startOf('day'),
			this.endInput.startOf('day'),
		);
	};
	
	@observable startInput = DEFAULT_START;
	@observable endInput = DEFAULT_END;
	
	@action SetStart = (value) => this.startInput = value;
	@action SetEnd = (value) => this.endInput = value;
	
	render() {
		const oQuery = Jewels().miscQueryReports;
		
		return (
			<>
				<SimCard>
					<VictoryChart
						height={600}
						width={1300}
						scale={{x: 'time'}}
						domain={{y: [0, 160]}}
						// containerComponent={<VictoryContainer responsive={false}/>}
					>
						{/*<VictoryLine*/}
						{/*	data={oQuery.chartData.line1}*/}
						{/*	interpolation={'basis'}*/}
						{/*	labelComponent={<VictoryTooltip/>}*/}
						{/*	style={{data: {stroke: 'black', strokeWidth: 5}}}*/}
						{/*/>*/}
						<VictoryLine
							data={oQuery.chartData.line2}
							interpolation={'basis'}
							labelComponent={<VictoryTooltip/>}
							style={{data: {stroke: 'red', strokeWidth: 2}}}
						/>
						<VictoryLine
							data={oQuery.chartData.line3}
							interpolation={'basis'}
							labelComponent={<VictoryTooltip/>}
							style={{data: {stroke: 'green', strokeWidth: 2}}}
						/>
						<VictoryScatter
							data={oQuery.chartData.scatter}
							labelComponent={<VictoryTooltip/>}
						/>
						<VictoryLine
							data={oQuery.chartData.extra}
							style={{data: {stroke: '#1b7fff', strokeWidth: 1}}}
						/>
					</VictoryChart>
				</SimCard>
				
				<SimCard padH={12}>
					
					<Row>
						<SimDateEntry
							value={this.startInput}
							onChange={this.SetStart}
							tabIndex={3}
							label={'Start'}
						/>
						
						<Col w={50}/>
						
						<SimDateEntry
							value={this.endInput}
							onChange={this.SetEnd}
							tabIndex={4}
							label={'End'}
						/>
					</Row>
					
					<Butt
						on={this.Load1}
						label={'Load Cxl / Not Cxl'}
						icon={MdRefresh}
						primary
						marT={12}
					/>
					
					<Row marV={12}>
						<Txt size={24}>{oQuery.summary}</Txt>
					</Row>
					
					<Griddle_DEPRECATED
						columns={oQuery.columns}
						rows={oQuery.rows}
					/>
				</SimCard>
			</>
		);
	}
}