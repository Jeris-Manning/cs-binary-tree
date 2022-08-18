import React from 'react';
import {observer} from 'mobx-react';
import {Jewels} from 'stores/RootStore';
import {action, computed, observable} from 'mobx';
import Butt from '../../../Bridge/Bricks/Butt';
import {Col, Row, Txt} from '../../../Bridge/Bricks/bricksShaper';
import thyme, {badDt} from '../../../Bridge/thyme';
import Loading from '../../../Bridge/misc/Loading';
import Formula from '../../../Bridge/Bricks/Formula/Formula';
import Fieldula from '../../../Bridge/Bricks/Formula/Fieldula';
import MiniField from '../../../components/MiniField';
import {MiniConfig} from '../../../components/ToggleRow';
import {Ico} from '../../../Bridge/Bricks/Ico';
import {MdDateRange, MdInput, MdWarning} from 'react-icons/md';
import $j, {is} from '../../../Bridge/misc/$j';
import {DatePicker} from '@material-ui/pickers';
import type {C_JobView} from './JobBasics';
import {JobCard} from './JobBasics';
import {Upstate} from '../../../Bridge/misc/Upstate';
import {JobRef} from './JobRef';
import {UpFieldTime} from '../../../Bridge/misc/UpFieldTime';

const DURATION_WARNING_HOURS = 7;

@observer
export class JobDateTime extends React.Component<C_JobView> {
	
	@computed get isInvalid() {
		const jobUp = this.props.jobRef.jobUp;
		return Upstate.AnyError(jobUp.date, jobUp.startTime, jobUp.endTime);
	}
	
	@computed get canSave() {
		const jobUp = this.props.jobRef.jobUp;
		return Upstate.AnyChange(jobUp.date, jobUp.startTime, jobUp.endTime);
	}
	
	@observable showP2P = false;
	@action ToggleP2P = () => this.showP2P = !this.showP2P;
	
	@computed get p2pShown() {
		const jobUp = this.props.jobRef.jobUp;
		return this.showP2P || jobUp.p2pDispatch.value || jobUp.p2pHome.value;
	}
	
	render() {
		const jobRef: JobRef = this.props.jobRef;
		
		if (!jobRef) return <Loading/>;
		
		const jobUp = jobRef.jobUp;
		const vJobUpdate = Jewels().vJobUpdate;
		
		
		return (
			<JobCard
				isInvalid={this.isInvalid}
				canSave={this.canSave}
			>
				<DateEditor
					// tabi={tabi + 0}
					dateUp={jobUp.date}
					showCalendar={vJobUpdate.showCalendar}
					toggleShowCalendar={vJobUpdate.ToggleShowCalendar}
					focus={jobRef.isNew}
				/>
				
				
				<Row
					marT={16}
				>
					<UpFieldTime
						state={jobUp.startTime}
						label={'Starts'}
						date={jobUp.date.value}
					/>
					
					<Col grow/>
					
					<UpFieldTime
						state={jobUp.endTime}
						label={'Ends'}
						date={jobUp.date.value}
					/>
				</Row>
				
				<Row marT={16} childV>
					<Txt caps size={12} hue={'#3c3c3c'}>Duration</Txt>
					
					<Col grow/>
					
					<Duration jobRef={jobRef}/>
					
					<Col grow/>
					
					<Col w={100} childE>
						<MiniConfig
							isChecked={this.p2pShown}
							onToggle={this.ToggleP2P}
							label={'P2P'}
						/>
					</Col>
				</Row>
				
				{this.p2pShown && (
					<Row
						marT={32}
					>
						<UpFieldTime
							state={jobUp.p2pDispatch}
							label={'P2P Dispatch'}
							date={jobUp.date.value}
							hue={'#eed9ff'}
						/>
						
						<Col grow/>
						
						<UpFieldTime
							state={jobUp.p2pHome}
							label={'P2P Home'}
							date={jobUp.date.value}
							hue={'#eed9ff'}
						/>
					</Row>
				)}
			</JobCard>
		);
	}
}

@observer
class Duration extends React.Component<C_JobView> {
	
	render() {
		const jobRef: JobRef = this.props.jobRef;
		
		if (!jobRef.duration)
			return <></>;
		
		const {hours, minutes} = jobRef.duration;
		
		let text = '';
		
		if (hours) {
			text += `${hours} ${$j.pluralOr(hours, 'hour')}`;
		}
		
		if (minutes) {
			text += ` ${minutes} ${$j.pluralOr(minutes, 'minute')}`;
		}
		
		const showWarning = hours > DURATION_WARNING_HOURS;
		
		return (
			<>
				{showWarning && (
					<Ico
						icon={MdWarning}
						size={24}
						hue={'#b30007'}
						marR={6}
						tooltip={'Long duration'}
					/>
				)}
				
				<Txt
					b={showWarning}
					hue={showWarning ? '#b30007' : '#000'}
					size={showWarning ? 24 : 16}
				>
					{text}
				</Txt>
			</>
		);
	}
}

@observer
class DateEditor extends React.Component {
	render() {
		const {
			dateUp,
			showCalendar,
			toggleShowCalendar,
			focus,
		} = this.props;
		
		return (
			<>
				{showCalendar ? (
					<Calendar
						dateUp={dateUp}
						toggleShowCalendar={toggleShowCalendar}
					/>
				) : (
					<DateEntry
						value={dateUp.value}
						onChange={dateUp.Change}
						toggleShowCalendar={toggleShowCalendar}
						label={'Date'}
						focus={focus}
					/>
				)}
			
			</>
		);
	}
}

@observer
class Calendar extends React.Component {
	
	@action SetDate = (value) => this.props.dateUp.Change(thyme.fromSdt(value));
	
	render() {
		const {
			dateUp,
			toggleShowCalendar,
		} = this.props;
		
		return (
			<Row>
				<Butt
					on={toggleShowCalendar}
					icon={MdInput}
					subtle
					primary
					// marT={80}
					marR={8}
					h={60}
					tooltip={'Switch to text input'}
				/>
				
				<DatePicker
					variant={'static'}
					value={dateUp.value}
					onChange={this.SetDate}
					views={['month', 'date']}
					minDate={thyme.now().startOf('month').minus({months: 3})}
					maxDate={thyme.now().endOf('month').plus({years: 3})}
					disableToolbar
				/>
			</Row>
		);
	}
}

@observer
export class DateEntry extends React.Component {
	
	@observable form = new Formula({
		fields: {
			dateInput: new Fieldula({
				placeholder: '', // '2-09 or 11/14 or 2 22 2022',
				description: `This field is good at parsing dates. <br/>You can do things like: <br/>2-09 <br/>2/9 <br/>1211 <br/>121121 <br/>2 22 2022`
			}),
		}
	});
	@observable error = '';
	@observable info = '';
	
	componentDidMount() {
		this.RefreshDisplay();
	}
	
	componentDidUpdate(prevProps: Readonly<P>, prevState: Readonly<S>, snapshot: SS) {
		this.RefreshDisplay();
	}
	
	@action RefreshDisplay = () => {
		if (this.props.value) {
			this.form.fields.dateInput.value = thyme.nice.date.short(this.props.value);
			this.info = thyme.nice.date.details(this.props.value);
		} else {
			this.form.fields.dateInput.value = '';
			this.info = '';
		}
	};
	
	@action Calculate = () => {
		const raw = this.form.fields.dateInput.value;
		const yearMonthDayObj = thyme.parseDateString(raw);
		
		console.log(`Calculating date entry, raw: ${raw}, yearMonthDateObj:`, yearMonthDayObj);
		
		if (!yearMonthDayObj) {
			this.error = 'Invalid date.';
			return;
		}
		
		if (is.string(yearMonthDayObj)) {
			this.error = yearMonthDayObj;
			return;
		}
		
		this.error = '';
		this.props.onChange(thyme.fromObject(yearMonthDayObj));
	};
	
	render() {
		const {
			value,
			onChange,
			label,
			toggleShowCalendar,
			focus,
		} = this.props;
		
		return (
			<Row>
				
				<Butt
					on={toggleShowCalendar}
					icon={MdDateRange}
					subtle
					mini
					primary
					marT={12}
					marR={8}
					h={60}
					tooltip={'Switch to calendar input'}
				/>
				
				<MiniField
					$={this.form.fields.dateInput}
					label={label}
					onBlur={this.Calculate}
					size={26}
					h={'auto'}
					width={'100%'}
					padding={`8px`}
					selectOnFocus
					center
					error={this.error}
					infoComponent={<Txt center i marT={2}>{this.info}</Txt>}
					focus={focus}
				/>
			</Row>
		);
	}
}

@observer
export class TimeButtons extends React.Component {
	
	@action SetTime = (hourMinuteObj) => {
		const up = this.props.up;
		
		if (!hourMinuteObj) {
			up.Change('');
			return;
		}
		
		const newValue = (up.value || thyme.today())
			.set(hourMinuteObj);
		
		up.Change(newValue);
	};
	
	@action SetAm = () => {
		const up = this.props.up;
		if (badDt(up.value)) return;
		
		const newValue = thyme.withAm(up.value);
		up.Change(newValue);
	};
	
	@action SetPm = () => {
		const up = this.props.up;
		if (badDt(up.value)) return;
		
		const newValue = thyme.withPm(up.value);
		up.Change(newValue);
	};
	
	render() {
		const {
			up,
			tabIndex,
			label,
			size,
			hueBg,
		} = this.props;
		
		const isAm = up.value ? thyme.isAm(up.value) : false;
		
		return (
			<Row>
				<TimeEntryOLD
					value={up.value}
					onSet={this.SetTime}
					tabIndex={tabIndex}
					label={label}
					size={size}
					hueBg={hueBg}
				/>
				<Col h={70} marT={17}>
					<TimeButt on={this.SetAm} label={'AM'} highlight={isAm}/>
					<TimeButt on={this.SetPm} label={'PM'} highlight={!isAm}/>
				</Col>
			</Row>
		);
	}
}

@observer
export class TimeEntryOLD extends React.Component {
	
	@observable form = new Formula({
		idPrefix: this.props.label,
		fields: {
			timeInput: new Fieldula({
				placeholder: '', // '2 or 520p or 520+',
				description: `This field is good at parsing times. <br/>You can do things like: <br/>2 --> 2:00 AM <br/>14 --> 2:00 PM <br/>520p --> 5:20 PM <br/>120+ --> 1:20 PM <br/>p OR + can be used for PM`
			}),
		}
	});
	
	@observable info = '';
	@observable infoWarning = false;
	
	componentDidMount() {
		this.RefreshDisplay();
	}
	
	componentDidUpdate(prevProps: Readonly<P>, prevState: Readonly<S>, snapshot: SS) {
		this.RefreshDisplay();
	}
	
	@action RefreshDisplay = () => {
		if (this.props.value) {
			this.form.fields.timeInput.value = thyme.nice.time.short(this.props.value);
			this.info = thyme.nice.time.timeOfDay(this.props.value);
			this.infoWarning = this.info.includes('very');
		} else {
			this.form.fields.timeInput.value = '';
			this.info = '';
		}
	};
	
	@action Calculate = () => {
		const raw = this.form.fields.timeInput.value;
		
		const hourMinuteObj = thyme.parseTimeString(raw);
		
		console.log(`Calculating time entry: `, hourMinuteObj);
		
		this.props.onSet(hourMinuteObj);
	};
	
	render() {
		const {
			value,
			onSet,
			label,
			tabIndex,
			size,
			hueBg,
		} = this.props;
		
		return (
			<>
				<MiniField
					$={this.form.fields.timeInput}
					label={label}
					tabIndex={tabIndex}
					onBlur={this.Calculate}
					size={size || 26}
					h={'auto'}
					width={'100%'}
					padding={`12px`}
					selectOnFocus
					center
					hueBg={hueBg}
					infoComponent={(
						<Txt
							center
							i
							b={this.infoWarning}
							hue={this.infoWarning ? '#b30007' : '#000'}
							marT={2}
						>{this.info}</Txt>
					)}
				/>
			</>
		);
	}
}

@observer
export class TimeButt extends React.Component {
	render() {
		const {
			on,
			value,
			label,
			highlight,
			b,
			marL,
		} = this.props;
		
		return (
			<Butt
				on={() => on(value)}
				label={label || `${value}`}
				primary
				subtle={!highlight}
				mini
				grow
				// labelSize={label ? label.length >= 3 && 10 : undefined}
				b={b}
				marL={marL}
				// minWidth={32}
			/>
		);
	}
}

@observer
export class JobDateTimeSummary extends React.Component<C_JobView> {
	
	@observable showModal = false;
	
	@action Open = () => {
		this.showModal = true;
	};
	@action Close = () => this.showModal = false;
	
	
	render() {
		const jobRef: JobRef = this.props.jobRef;
		const start = jobRef.start;
		const end = jobRef.end;
		
		if (!start || !end) {
			return <></>;
		}
		
		return (
			<>
				
				<Row>
					<Col>
						<Txt size={20} center>{thyme.nice.date.details2(start)}</Txt>
						
						<Row marT={4} childCenterV wrap>
							<Time time={start}/>
							<Txt size={'1rem'} grow center marH={4}>to</Txt>
							<Time time={end}/>
						</Row>
					</Col>
				</Row>
			</>
		);
	}
}

@observer
class Time extends React.Component {
	render() {
		const {
			time,
		} = this.props;
		
		if (!time) return <Loading size={8}/>;
		
		const hour = time.toFormat('h');
		const min = time.toFormat('mm');
		const a = time.toFormat('a');
		
		return (
			<Row childCenterV>
				<Txt size={26}>{hour}</Txt>
				<Txt size={24} marB={1} hue={'#656565'}>:{min}</Txt>
				<Txt size={24} marB={1} marL={2}>{a}</Txt>
			</Row>
		);
	}
}


// @observer
// export class JobDateTimeSummaryAlt extends React.Component {
//
// 	@observable showModal = false;
//
// 	@action Open = () => {
// 		this.showModal = true;
// 	};
// 	@action Close = () => this.showModal = false;
//
//
// 	render() {
// 		const oJobs = Jewels().jobs;
// 		const jobUpstate = oJobs.jobUpstate;
//
// 		const combined = thyme.combineDateStartEnd(jobUpstate.date.value, jobUpstate.startTime.value, jobUpstate.endTime.value);
//
// 		if (!combined) {
// 			return <Row/>;
// 		}
//
// 		const start = combined.start;
// 		const end = combined.end;
//
// 		return (
// 			<Row>
// 				<Col childC>
// 					<Txt
// 						size={24}
// 						marB={3}
// 						grow
// 					>{start.toFormat(`LLLL d`)}</Txt>
//
// 					<Txt
// 						size={20}
// 						grow
// 						hue={'#656565'}
// 					>{start.toFormat(`ccc y`)}</Txt>
//
// 				</Col>
//
// 				<Col marL={12} childN>
// 					<Row childC grow>
// 						<Txt
// 							size={24}
// 							hue={'#000'}
// 						>{start.toFormat('h')}</Txt>
//
// 						<Txt
// 							size={24}
// 							hue={'#000'}
// 						>:{start.toFormat('mm')}</Txt>
//
// 						<Txt
// 							size={20}
// 							marL={2}
// 							hue={'#000'}
// 						>{start.toFormat('a')}</Txt>
// 					</Row>
//
// 					<Row childC grow>
// 						<Txt
// 							size={20}
// 							hue={'#656565'}
// 						>{end.toFormat('h')}</Txt>
//
// 						<Txt
// 							size={20}
// 							hue={'#656565'}
// 						>:{end.toFormat('mm')}</Txt>
//
// 						<Txt
// 							size={16}
// 							marL={2}
// 							hue={'#656565'}
// 						>{end.toFormat('a')}</Txt>
// 					</Row>
// 				</Col>
// 			</Row>
// 		);
// 	}
// }