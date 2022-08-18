import {observer} from 'mobx-react';
import {Jewels, Staches} from 'stores/RootStore';
import React from 'react';
import {SimCard} from '../../Bridge/misc/Card';
import Butt from '../../Bridge/Bricks/Butt';
import Griddle_DEPRECATED from '../../Bridge/Griddle/Griddle_DEPRECATED';
import {action, computed, observable, runInAction} from 'mobx';
import {Col, Row, Txt} from '../../Bridge/Bricks/bricksShaper';
import thyme from '../../Bridge/thyme';
import {MdRefresh} from 'react-icons/md';
import {CSVLink} from 'react-csv';
import {FaFileCsv} from 'react-icons/fa';
import {VictoryChart, VictoryLine, VictoryScatter, VictoryTooltip} from 'victory';
import ToggleButton from '../../components/ToggleButton';
import {SimDateEntry} from '../../Bridge/misc/SimDateEntry';
import Cell_TextStyler_DEP from '../../Bridge/Griddle/Cells/Cell_TextStyler_DEP';


// const DEFAULT_START = thyme.now().startOf('year')
const DEFAULT_START = thyme.fromIso(`2020-02-03`);
const DEFAULT_END = thyme.nowPlus({days: 0}).endOf('week');

const FILTER_COMPANIES = [
	// 'Mayo Clinic-EOC',
	'Fargo-Moorhead EOC',
	'CentraCare-EOC',
	'MHC-Stipend Shift',
	'Boostlingo Co',
];

const BILL_STATUSES = [
	'filled / bill',
	'filled / bill - rush',
	'cancelled / bill',
	'vri/filled/bill',
	'problem/bill',
	'vri/cancelled/bill',
	'vri/filled/bill/rush',
	'filled / bill - after hours',
];


function isBillable(job) {
	return BILL_STATUSES.includes(job.billType.toLowerCase());
}


@observer
export class Billable extends React.Component {
	
	columns = [
		{
			key: 'date',
			header: 'Date',
			accessor: 'date',
			cell: Cell_TextStyler_DEP,
			format: val => thyme.nice.date.details(val),
		},
		{
			header: 'Count',
			accessor: 'count',
		},
	];
	
	@observable rawJobs = [];
	
	@action Refresh = async () => {
		const oJobLists = Jewels().jobLists;
		
		console.log(`Refresh: ${this.startInput}, ${this.endInput}`);
		
		const result =
			await oJobLists.GetAllJobs(
				this.startInput.startOf('day'),
				this.endInput.startOf('day'),
			);
		
		runInAction(() => {
			this.rawJobs = result;
		});
	};
	
	// @computed get jobs() {
	// 	return Jewels().jobLists.billable || [];
	// }
	
	
	@computed get jobsFiltered() {
		return (this.rawJobs || [])
			.filter(j => !FILTER_COMPANIES.includes(j.companyName))
			.filter(isBillable);
	}
	
	// @computed get jobsSorted() {
	// 	return this.jobs.sort(thyme.sorter('start'));
	// }
	
	@computed get rows() {
		if (this.byWeek) return this.rowsByWeek;
		
		return this.rowsByDay;
	}
	
	@computed get rowsByDay() {
		const withHours = this.withHours;
		let dates = {};
		
		this.jobsFiltered.forEach(job => {
			const date = job.start.startOf('day');
			const dateMs = date.toMillis();
			
			
			if (!dates.hasOwnProperty(dateMs)) {
				dates[dateMs] = {
					key: dateMs,
					date: date,
					dateFormatted: thyme.nice.date.short(date),
					jobs: [],
					count: 0,
				};
			}
			
			dates[dateMs].jobs.push(job);
			
			if (withHours) {
				const duration = thyme.timeBetween(job.start, job.end);
				
				dates[dateMs].count += Math.max(
					duration.as('hours'),
					(job.hourMin || 0)
				);
			} else {
				dates[dateMs].count += 1;
			}
		});
		
		Object.values(dates).forEach(row => row.count = Math.round(row.count));
		
		return Object.values(dates)
			.sort(thyme.sorter('date'));
	}
	
	@computed get rowsByWeek() {
		const withHours = this.withHours;
		let weeks = {};
		
		this.jobsFiltered.forEach(job => {
			const year = job.start.year;
			const weekNumber = job.start.weekNumber;
			const key = `${year}_${weekNumber}`;
			
			const date = job.start.startOf('week');
			
			if (!weeks.hasOwnProperty(key)) {
				weeks[key] = {
					key: key,
					date: date,
					dateFormatted: `week of ${thyme.nice.date.short(date)}`,
					jobs: [],
					count: 0,
				};
			}
			
			weeks[key].jobs.push(job);
			
			if (withHours) {
				const duration = thyme.timeBetween(job.start, job.end);
				
				weeks[key].count += Math.max(
					duration.as('hours'),
					(job.hourMin || 0)
				);
			} else {
				weeks[key].count += 1;
			}
			
		});
		
		Object.values(weeks).forEach(row => row.count = Math.round(row.count));
		
		return Object.values(weeks)
			.sort(thyme.sorter('date'));
		
	}
	
	@computed get domainHeight() {
		let max = 0;
		this.rows.forEach(row => {
			if (row.count > max) max = row.count;
		});
		return max;
	}
	
	@computed get downloadCsv() {
		return {
			headers: [
				{label: 'Date', key: 'dateFormatted'},
				{label: 'Count', key: 'count'},
			],
			data: this.rows,
			fileName: `Billable_Jobs_${thyme.nice.date.fileName(thyme.today())}.csv`,
		};
	}
	
	@computed get chartData() {
		const dates = this.rows.map(row => ({
			x: thyme.toJsDate(row.date),
			y: row.count,
			// label: `${row.dateFormatted}: ${row.count}`,
			// label: this.byWeek
			// 	? `${thyme.nice.date.brief(row.date)}: ${row.count}`
			// 	: `${row.dateFormatted}: ${row.count}`,
			label: this.byWeek
				? `${row.count}\n${thyme.nice.date.brief(row.date)}`
				: `${row.count}\n${row.dateFormatted}`,
		}));
		
		return {
			dates: dates,
			extra: [
				{
					x: thyme.toJsDate(thyme.today()),
					y: 0
				},
				{
					x: thyme.toJsDate(thyme.today()),
					y: 1000
				},
			]
		};
	}
	
	@observable startInput = DEFAULT_START;
	@observable endInput = DEFAULT_END;
	@observable byWeek = true;
	@observable withHours = false;
	
	@action SetStart = (value) => this.startInput = value;
	@action SetEnd = (value) => this.endInput = value;
	@action SetByWeek = (value) => this.byWeek = value;
	@action SetWithHours = (value) => this.withHours = value;
	
	render() {
		const oJobLists = Jewels().jobLists;
		
		return (
			<>
				<Col marB={12}>
					<Row childCenterV>
						<Col w={40}>
						</Col>
						
						<Col grow childCenterH>
							<Txt
								size={'2.4rem'}
							>
								Billable Jobs
							</Txt>
						</Col>
						
						<Col w={40}/>
					</Row>
				</Col>
				
				<Row>
					<Col>
						<Txt b>Filters out companies:</Txt>
						{FILTER_COMPANIES.map(comp => (
							<Txt key={comp}>{comp}</Txt>
						))}
					</Col>
					
					<Col marL={24}>
						<Txt b>Looks for these statuses:</Txt>
						{BILL_STATUSES.map(status => (
							<Txt key={status}>{status}</Txt>
						))}
					</Col>
				
				</Row>
				
				<SimCard padH={12}>
					
					<Row marB={20}>
						
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
						
						<Col w={50}/>
						
						<Col w={200}>
							<ToggleButton
								label={'Per Week'}
								isChecked={this.byWeek}
								on={() => this.SetByWeek(!this.byWeek)}
								subtle
							/>
							<Txt size={12} i center>Mon-Sun, does not capture before/after start & end range</Txt>
						</Col>
						
						<Col w={50}/>
						
						<Col w={200}>
							<ToggleButton
								label={'Billable Hours'}
								isChecked={this.withHours}
								on={() => this.SetWithHours(!this.withHours)}
								subtle
							/>
							<Txt size={12} i center>Greater of (duration vs minimum)</Txt>
						</Col>
					</Row>
					
					<Row>
						<Butt
							on={this.Refresh}
							icon={MdRefresh}
							primary
							marB={12}
							label={'Refresh'}
						/>
						
						<Col grow/>
						
						<CSVLink
							headers={this.downloadCsv.headers}
							data={this.downloadCsv.data}
							filename={this.downloadCsv.fileName}
							target={'_blank'}
						>
							<Butt icon={FaFileCsv} primary/>
						</CSVLink>
					
					</Row>
					
					<Griddle_DEPRECATED
						columns={this.columns}
						rows={this.rows}
					/>
				</SimCard>
				
				
				{this.rows.length && (
					<SimCard>
						<VictoryChart
							height={600}
							width={1300}
							scale={{x: 'time'}}
							domain={{y: [0, this.domainHeight]}}
						>
							{/*{this.byWeek && (*/}
							{/*	<VictoryBar*/}
							{/*		data={this.chartData.dates}*/}
							{/*		labels={({datum}) => datum.count}*/}
							{/*		alignment={'start'}*/}
							{/*	/>*/}
							{/*)}*/}
							<VictoryLine
								data={this.chartData.dates}
								interpolation={'basis'}
								labelComponent={<VictoryTooltip/>}
								style={{data: {stroke: 'green', strokeWidth: 2}}}
							/>
							{this.byWeek && (
								<VictoryScatter
									data={this.chartData.dates}
									labels={({datum}) => datum.count}
								/>
							)}
							<VictoryScatter
								data={this.chartData.dates}
								labelComponent={<VictoryTooltip/>}
							/>
							<VictoryLine
								data={this.chartData.extra}
								style={{data: {stroke: '#1b7fff', strokeWidth: 1}}}
							/>
						</VictoryChart>
					</SimCard>
				)}
			
			</>
		);
	}
}


// @observer
// class DateEntry extends React.Component {
//
// 	@observable form = new Formula({
// 		fields: {
// 			dateInput: new Fieldula({
// 				placeholder: '', // '2-09 or 11/14 or 2 22 2022',
// 				// description: `This field is good at parsing dates. <br/>You can do things like: <br/>2-09 <br/>2/9 <br/>1211 <br/>121121 <br/>2 22 2022`
// 			}),
// 		}
// 	});
// 	@observable error = '';
// 	@observable info = '';
//
// 	componentDidMount() {
// 		this.RefreshDisplay();
// 	}
//
// 	componentDidUpdate(prevProps: Readonly<P>, prevState: Readonly<S>, snapshot: SS) {
// 		this.RefreshDisplay();
// 	}
//
// 	@action RefreshDisplay = () => {
// 		if (this.props.value) {
// 			this.form.fields.dateInput.value = thyme.nice.date.short(this.props.value);
// 			this.info = thyme.nice.date.details(this.props.value);
// 		} else {
// 			this.form.fields.dateInput.value = '';
// 			this.info = '';
// 		}
// 	};
//
// 	@action Calculate = () => {
// 		const raw = this.form.fields.dateInput.value;
// 		const yearMonthDayObj = thyme.parseDateString(raw);
//
// 		console.log(`Calculating date entry: `, yearMonthDayObj);
//
// 		if (!yearMonthDayObj) {
// 			this.error = 'Invalid date.';
// 			return;
// 		}
//
// 		this.error = '';
// 		this.props.onChange(thyme.fromObject(yearMonthDayObj));
// 	};
//
// 	render() {
// 		const {
// 			value,
// 			onChange,
// 			label,
// 			tabIndex,
// 		} = this.props;
//
// 		return (
// 			<MiniField
// 				$={this.form.fields.dateInput}
// 				label={label}
// 				tabIndex={tabIndex}
// 				onBlur={this.Calculate}
// 				size={32}
// 				h={'auto'}
// 				w={300}
// 				// width={'100%'}
// 				padding={`16px`}
// 				selectOnFocus
// 				center
// 				error={this.error}
// 				infoComponent={<Txt center i marT={2}>{this.info}</Txt>}
// 			/>
// 		);
// 	}
// }