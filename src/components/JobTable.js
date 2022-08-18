import React from 'react';
import {observer} from 'mobx-react';
import {Staches} from 'stores/RootStore';
import {EntablerSpec} from '../Bridge/Entabler/EntablerSpec';
import Cell_Date from '../Bridge/Griddle/Cells/Cell_Date';
import {Cell_TimeStartEndSmall} from '../Bridge/Griddle/Cells/Cell_TimeStartEnd';
import Cell_TextStyler from '../Bridge/Griddle/Cells/Cell_TextStyler';
import $j, {vow} from '../Bridge/misc/$j';
import Cell_MapLink from '../Bridge/Griddle/Cells/Cell_MapLink';
import {Cell_JobStatus} from '../Bridge/Griddle/Cells/Cell_JobStatus';
import Cell_Terp from '../Bridge/Griddle/Cells/Cell_Terp';
import {action, observable} from 'mobx';
import {EntablerSource} from '../Bridge/Entabler/EntablerSource';
import {SimCard, SimHeader} from '../Bridge/misc/Card';
import Butt from '../Bridge/Bricks/Butt';
import {MdChevronLeft, MdChevronRight, MdRefresh} from 'react-icons/md';
import thyme from '../Bridge/thyme';
import {Entabler} from '../Bridge/Entabler/Entabler';
import {SimDateEntry} from '../Bridge/misc/SimDateEntry';
import {Col, Row, Txt} from '../Bridge/Bricks/bricksShaper';
import Loading from '../Bridge/misc/Loading';
import {FiChevronsLeft, FiChevronsRight} from 'react-icons/fi';
import {Cell_JobLink} from '../Bridge/Griddle/Cells/Cell_JobLink';
import {ButtCopy} from './ButtCopy';
import {FaClipboard, FaClipboardList} from 'react-icons/fa';
import {Sifter} from '../Bridge/Sifter/Sifter';
import {SifterLabel} from '../Bridge/Sifter/SifterComponents';

@observer
export class JobTable extends React.Component {
	
	componentDidMount() {
		this.Mount();
	}
	
	@action Mount = () => {
		this.sifter = new Sifter(this.props.sifter || JOB_TABLE_DEFAULT_SIFTER);
		this.sifter.OnChange(() => this.source.RecheckShow());
		
		this.source = new EntablerSource({
			label: 'JobTable',
			spec: this.props.spec || DEFAULT_SPEC,
			keyer: 'jobId',
			CanShow: this.CanShow,
			deferRowsPerFrame: 10,
		});
		
		$j.try(this.props.setSourceRef, this.source);
		
		this.startInput = this.props.start || thyme.now();
		this.endInput = this.props.end || thyme.nowPlus({months: 1});
		if (this.props.refreshOnMount) this.Refresh().then();
	};
	
	componentDidUpdate(prevProps: Readonly<P>, prevState: Readonly<S>, snapshot: SS) {
		if (this.props.refreshOnUpdate) this.Refresh().then();
	}
	
	@observable sifter;
	@observable source;
	
	@observable startInput; // thyme
	@observable endInput; // thyme
	
	@action SetStart = (value) => this.startInput = value;
	@action SetEnd = (value) => this.endInput = value;
	
	CanShow = (job) => this.sifter.Allowed(job);
	
	@action Refresh = async () => {
		this.source.Clear();
		
		this.jobCount = 0;
		
		const start = this.startInput.startOf('day');
		const end = this.props.hideEndDate
			? this.startInput.endOf('day')
			: this.endInput.endOf('day');
		
		
		const [allJobs, error] = await vow(
			this.props.getAllJobs({
				start: thyme.fast.pack(start),
				end: thyme.fast.pack(end),
			})
		);
		
		if (error) throw new Error(error);
		
		await this.source.Add(allJobs);
		
		console.log(`---- adding to JobTable: `, allJobs);
	};
	
	render() {
		const {
			header,
			hideStartDate,
			hideEndDate,
			sort,
		} = this.props;
		
		if (!this.source) return <></>;
		
		return (
			<SimCard>
				
				<Header
					sifter={this.sifter}
					source={this.source}
					
					header={header || 'Jobs'}
					startInput={this.startInput}
					SetStart={this.SetStart}
					endInput={this.endInput}
					SetEnd={this.SetEnd}
					hideStartDate={hideStartDate}
					hideEndDate={hideEndDate}
					Refresh={this.Refresh}
					isLoading={this.isLoading}
				/>
				
				<Table
					source={this.source}
					sort={sort === undefined ? 'date' : sort}
				/>
			
			</SimCard>
		);
	}
	
}

@observer
class Header extends React.Component {
	
	@action ShiftDate = (key, amount) => {
		const {
			startInput,
			SetStart,
			endInput,
			SetEnd,
			hideStartDate,
			hideEndDate,
		} = this.props;
		
		let shiftObj = {};
		
		if (hideEndDate) {
			const newDate = startInput.plus({days: amount});
			SetStart(newDate);
			SetEnd(newDate);
			return;
		}
		
		if (amount < 0) {
			shiftObj[key] = -amount;
			SetEnd(startInput);
			SetStart(startInput.minus(shiftObj));
		} else {
			shiftObj[key] = amount;
			SetStart(endInput);
			SetEnd(endInput.plus(shiftObj));
		}
	};
	
	render() {
		const {
			sifter,
			source,
			
			header,
			startInput,
			SetStart,
			endInput,
			SetEnd,
			hideStartDate,
			hideEndDate,
			Refresh,
			isLoading,
			
		} = this.props;
		
		const hideAllDateStuff = hideStartDate && hideEndDate;
		
		return (
			<Col>
				
				<Row marB={4}>
					
					<SimHeader header={header}/>
					
					<Col grow/>
					
					<Filters sifter={sifter}/>
					
				</Row>
				
				<Row marB={8}>
					
					<Butt
						on={Refresh}
						icon={MdRefresh}
						primary
						marB={12}
						loading={isLoading}
						label={`Get Jobs`}
						marR={24}
						subtle
					/>
					
					{!hideAllDateStuff && (
						<>
							{hideEndDate ? (
								<Butt
									on={() => this.ShiftDate('days', -1)}
									icon={MdChevronLeft}
									subtle
									mini
									marR={8}
									tooltip={'Previous day'}
								/>
							) : (
								<Butt
									on={() => this.ShiftDate('months', -1)}
									icon={FiChevronsLeft}
									subtle
									mini
									marR={8}
									tooltip={'Previous month'}
								/>
							)}
							
							{!hideStartDate && (
								<SimDateEntry
									value={startInput}
									onChange={SetStart}
									tabIndex={1}
									label={'Start'}
									size={18}
									pad={8}
									w={180}
									infoSize={12}
								/>
							)}
							
							{!hideEndDate && (
								<SimDateEntry
									value={endInput}
									onChange={SetEnd}
									tabIndex={2}
									label={'End'}
									size={18}
									marL={24}
									pad={8}
									w={180}
									infoSize={12}
								/>
							)}
							
							{hideEndDate ? (
								<Butt
									on={() => this.ShiftDate('days', +1)}
									icon={MdChevronRight}
									subtle
									mini
									marL={8}
									tooltip={'Next day'}
								/>
							) : (
								<Butt
									on={() => this.ShiftDate('months', +1)}
									icon={FiChevronsRight}
									subtle
									mini
									marL={8}
									tooltip={'Next month'}
								/>
							)}
						</>
					)}
					
					<Col w={24}/>
					
					<Col
						w={120}
						childC
					>
						<Counts
							source={source}
						/>
					</Col>
					
					<Col grow/>
					
					<CopyTableButtons source={source}/>
				
				</Row>
				
			</Col>
		);
	}
}

@observer
class Filters extends React.Component {
	render() {
		const {
			sifter
		} = this.props;
		
		return (
			<>
				{sifter.filterList.map(filter => (
					<SifterLabel
						key={filter.key}
						sifter={sifter}
						filter={filter}
						marH={4}
					/>
				))}
			</>
		);
	}
}

@observer
class CopyTableButtons extends React.Component {
	render() {
		const {
			source,
		} = this.props;
		
		const canCopy = source.counts.isLoaded;
		
		return (
			<>
				<ButtCopy
					tooltip={'Copy with Headers'}
					icon={FaClipboard}
					iconSize={18}
					iconHue={'#6a6a6a'}
					subtle
					marR={5}
					h={50}
					enabled={canCopy}
					text={() => source.ToClipboard(true)}
				/>
				
				<ButtCopy
					tooltip={'Copy just data'}
					icon={FaClipboardList}
					iconSize={18}
					iconHue={'#6a6a6a'}
					subtle
					h={50}
					enabled={canCopy}
					text={() => source.ToClipboard(false)}
				/>
			</>
		);
	}
}

@observer
class Table extends React.Component {
	render() {
		const {
			source,
			sort,
		} = this.props;
		
		return (
			<>
				
				<Entabler
					source={source}
					sort={sort}
				/>
			</>
		);
	}
}

@observer
class Counts extends React.Component {
	render() {
		const {
			counts
		} = this.props.source;
		
		return (
			<Row>
				{counts.isLoading > 0 && (
					<Loading size={16}/>
				)}
				
				<Txt
					size={'1.2rem'}
					marL={12}
				>
					{counts.canShow} of {counts.full}
				</Txt>
			</Row>
		);
	}
}

const DEFAULT_SPEC = new EntablerSpec({
	jobId: {
		label: 'Job ID',
		cell: Cell_JobLink,
		w: 'max-content',
	},
	date: {
		label: 'Date',
		accessor: 'start',
		cell: Cell_Date,
		b: true,
		alwaysShow: true,
		// w: 55,
		w: 'max-content',
		toClipboard: (row) => {
			console.log(`toClipboard date:`, row.start, row);
			return thyme.nice.date.input(row.start);
		},
	},
	start: {
		label: 'Start',
		cell: Cell_TimeStartEndSmall,
		noSort: true,
		toClipboard: (row) => {
			console.log(`toClipboard start:`, row.start, row);
			return `${thyme.nice.time.short(row.start)} - ${thyme.nice.time.short(row.end)}`;
		}
	},
	companyName: {
		label: 'Company',
		w: 100,
		cell: Cell_TextStyler,
		tooltip: v => v,
		// format: v => $j.trunc(v, 24),
		trunc: 24,
		linker: {
			key: 'company',
			params: (v, r) => ({companyId: r.companyId, tab: 'edit'}),
		},
		style: {
			size: 12,
		},
	},
	situation: {
		label: 'Situation',
		fr: 1.5,
		cell: Cell_TextStyler,
		tooltip: v => v,
		// Format: v => $j.trunc(v, 120),
		trunc: 120,
		style: {
			size: 12,
		},
	},
	deafNames: {
		label: 'Deaf',
		w: 120,
		cell: Cell_TextStyler,
		style: {size: '.75rem'},
		Get: (row) => row.deafs.map(d => `${d.firstName} ${d.lastName}`),
		// Get: (row) => row.deafs.map(d => d.fullName),
		Format: (val) => val.join(', '),
	},
	address: {
		label: 'Address',
		fr: 1.5,
		cell: Cell_MapLink,
		showRegion: true,
	},
	status: {
		label: 'Status',
		w: 60,
		cell: Cell_JobStatus,
	},
	terpId: {
		label: 'Terp',
		w: 80,
		cell: Cell_Terp,
		size: 12,
		toClipboard: (row) => {
			console.log(`toClipboard terpId: ${row.terpId}`, row);
			return Staches().cTerp.GetOrStub(row.terpId, true, 'JobTable').label; // should be loaded?
		},
	},
});

export const JOB_TABLE_DEFAULT_SIFTER = {
	filled: {
		label: 'filled',
		Check: row => row.billStatus.filled,
	},
	billed: {
		label: 'billed',
		Check: row => row.billStatus.billed,
	},
	cancelled: {
		label: 'cancelled',
		Check: row => row.billStatus.cancelled,
	},
	vri: {
		label: 'vri',
		Check: row => row.billStatus.vri,
	},
	rush: {
		label: 'rush',
		Check: row => row.billStatus.rush,
	},
	unable: {
		label: 'unable',
		Check: row => row.billStatus.unable,
	},
	billingManual: {
		label: 'manual',
		Check: row => `${row.qbStatus}` === `4`,
	},
	billComplete: {
		label: 'bill complete',
		Check: row => `${row.qbStatus}` === `2`,
	},
	// invoiced: {
	// 	label: 'company invoiced',
	// 	Check: row => row.hasCompanyInvoiced,
	// }
};