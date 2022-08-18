// import Card from '../../Bridge/misc/Card';
// import Butt from '../../Bridge/Bricks/Butt';
// import thyme from '../../Bridge/thyme';
// import Griddle_DEPRECATED from '../../Bridge/Griddle/Griddle_DEPRECATED';
// import React from 'react';
// import {observer} from 'mobx-react';
// import {Jewels, Staches} from 'stores/RootStore';
// import {MdRefresh} from 'react-icons/md';
// import {action, observable} from 'mobx';
// import {Col, Row} from '../../Bridge/Bricks/bricksShaper';
// import $j from '../../Bridge/misc/$j';
// import {SimDateEntry} from '../../Bridge/misc/SimDateEntry';
//
// @observer
// export class ProcessedFromPortal extends React.Component {
//
// 	columns = [
// 		{
// 			header: 'Name',
// 			accessor: 'name',
// 		},
// 		{
// 			header: 'Count',
// 			accessor: 'count',
// 		},
// 	];
//
// 	@action Refresh = async () => {
// 		const oJobLists = Jewels().jobLists;
//
// 		return oJobLists.RefreshProcessedFromPortal(
// 			thyme.fromDateInput(this.start),
// 			thyme.fromDateInput(this.end),
// 		)
// 	};
//
// 	@observable start = thyme.toDateInput(thyme.nowMinus({months: 1}));
// 	@observable end = thyme.toDateInput(thyme.nowPlus({months: 1}));
//
// 	@action SetStart = (value) => {
// 		this.start = value;
// 	};
//
// 	@action SetEnd = (value) => {
// 		this.end = value;
// 	};
//
// 	render() {
// 		const oJobLists = Jewels().jobLists;
//
// 		return (
// 			<Card padH={12}>
//
// 				<Row marB={20}>
// 					{/*<DatePicker*/}
// 					{/*	value={this.start}*/}
// 					{/*	onChange={this.SetStart}*/}
// 					{/*	format={'LLL d, y'}*/}
// 					{/*	variant={'inline'}*/}
// 					{/*	autoOk*/}
// 					{/*/>*/}
//
// 					<SimDateEntry
// 						value={this.start}
// 						onChange={this.SetStart}
// 						label={'Start'}
// 						size={18}
// 						pad={8}
// 						w={180}
// 						infoSize={12}
// 					/>
//
// 					<Col w={50}/>
//
// 					<SimDateEntry
// 						value={this.end}
// 						onChange={this.SetEnd}
// 						label={'End'}
// 						size={18}
// 						pad={8}
// 						w={180}
// 						infoSize={12}
// 					/>
//
// 					{/*<DatePicker*/}
// 					{/*	value={this.end}*/}
// 					{/*	onChange={this.SetEnd}*/}
// 					{/*	format={'LLL d, y'}*/}
// 					{/*	variant={'inline'}*/}
// 					{/*	autoOk*/}
// 					{/*/>*/}
// 				</Row>
//
// 				<Butt
// 					on={this.Refresh}
// 					icon={MdRefresh}
// 					primary
// 					marB={12}
// 					loading={oJobLists.isRefreshing}
// 					label={`Load`}
// 				/>
//
// 				<Griddle_DEPRECATED
// 					columns={this.columns}
// 					rows={Object.values(oJobLists.processedFromPortal).sort($j.sort.alphabetic('name'))}
// 				/>
// 			</Card>
// 		);
// 	}
// }