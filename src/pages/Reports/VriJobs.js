// import {observer} from 'mobx-react';
// import {Jewels, Router, Staches} from 'stores/RootStore';
// import React, {Component} from 'react';
// import Card from '../../Bridge/misc/Card';
// import Butt from '../../Bridge/Bricks/Butt';
// import Griddle_DEPRECATED from '../../Bridge/Griddle/Griddle_DEPRECATED';
// import {action, computed, observable} from 'mobx';
// import {Col, Row, Txt} from '../../Bridge/Bricks/bricksShaper';
// import thyme from '../../Bridge/thyme';
// import Cell_JobLink_DEP from '../../Bridge/Griddle/Cells/Cell_JobLink_DEP';
// import Cell_Date from '../../Bridge/Griddle/Cells/Cell_Date';
// import {Cell_TimeStartEnd} from '../../Bridge/Griddle/Cells/Cell_TimeStartEnd';
// import Cell_CompanyLink from '../../Bridge/Griddle/Cells/Cell_CompanyLink';
// import {MdRefresh} from 'react-icons/md';
// import {SimDateEntry} from '../../Bridge/misc/SimDateEntry';
//
//
// @observer
// export class VriList extends React.Component {
//
// 	columns = [
// 		{
// 			header: 'Job ID',
// 			accessor: 'jobId',
// 			cell: Cell_JobLink_DEP,
// 			w: '120px',
// 		},
// 		{
// 			key: 'date',
// 			header: 'Date',
// 			accessor: 'start',
// 			cell: Cell_Date,
// 			b: true,
// 			alwaysShow: true,
// 			w: '160px',
// 		},
// 		{
// 			header: 'Start',
// 			accessor: 'start',
// 			cell: Cell_TimeStartEnd,
// 			w: '210px',
// 			horizontal: true,
// 		},
// 		{
// 			header: 'Company',
// 			accessor: 'companyName',
// 			cell: Cell_CompanyLink,
// 			// w: '360px',
// 		},
// 		{
// 			header: 'Status',
// 			accessor: 'status',
// 			w: '100px',
// 		},
// 	];
//
// 	@computed get jobs() {
// 		return Jewels().jobLists.vriJobs || [];
// 	}
//
// 	@computed get jobsSorted() {
// 		return this.jobs.sort(thyme.sorter('start'));
// 	}
//
// 	@observable startInput = thyme.today().minus({weeks: 2});
// 	@observable endInput = thyme.today().plus({weeks: 2});
//
// 	@action SetStart = (value) => this.startInput = value;
// 	@action SetEnd = (value) => this.endInput = value;
//
// 	render() {
// 		const oJobLists = Jewels().jobLists;
//
// 		return (
// 			<>
// 				<Col marB={12}>
// 					<Row childCenterV>
// 						<Col w={40}>
// 						</Col>
//
// 						<Col grow childCenterH>
// 							<Txt
// 								size={'2.4rem'}
// 							>
// 								VRI Jobs
// 							</Txt>
// 						</Col>
//
// 						<Col w={40}/>
// 					</Row>
//
// 					<Row childCenterH>
// 						<Txt
// 							size={'1.2rem'}
// 							marT={6}
// 						>
// 							This page will get better! 😅
// 						</Txt>
// 					</Row>
// 				</Col>
//
// 				<Card padH={12}>
//
// 					<Row childH>
// 						<SimDateEntry
// 							value={this.startInput}
// 							onChange={this.SetStart}
// 							tabIndex={1}
// 							label={'Start'}
// 							size={18}
// 							pad={8}
// 							w={180}
// 							infoSize={12}
// 						/>
//
// 						<Col w={24}/>
//
// 						<SimDateEntry
// 							value={this.endInput}
// 							onChange={this.SetEnd}
// 							tabIndex={2}
// 							label={'End'}
// 							size={18}
// 							marL={24}
// 							pad={8}
// 							w={180}
// 							infoSize={12}
// 						/>
//
// 					</Row>
//
// 					<Butt
// 						on={() => oJobLists.RefreshVriJobs(this.startInput, this.endInput)}
// 						icon={MdRefresh}
// 						primary
// 						marB={12}
// 						label={'Refresh'}
// 						// label={`Last refreshed: ${thyme.nice.time.short(oJobLists.lastRefreshed)}`}
// 						subtle
// 						loading={oJobLists.loadingVriJobs}
// 					/>
//
// 					<Griddle_DEPRECATED
// 						columns={this.columns}
// 						rows={this.jobsSorted}
// 					/>
// 				</Card>
//
// 			</>
// 		);
// 	}
// }
//
// @observer
// export class VriJobs extends React.Component {
// 	render() {
// 		const params = Router().params;
//
// 		return (
// 			<>
// 				<VriList {...params}/>
// 			</>
// 		);
// 	}
// }