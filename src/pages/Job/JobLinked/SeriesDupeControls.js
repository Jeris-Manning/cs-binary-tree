import {Observer, observer} from 'mobx-react';
import React from 'react';
import {SimCard} from '../../../Bridge/misc/Card';
import {Col, Row, Txt} from '../../../Bridge/Bricks/bricksShaper';
import Butt from '../../../Bridge/Bricks/Butt';
import {IoMdCopy} from 'react-icons/io';
import {MdDeleteSweep, MdLibraryAdd} from 'react-icons/md';
import styled from 'styled-components';
import {computed} from 'mobx';
import $j from '../../../Bridge/misc/$j';
import Select from 'react-select';
import type {C_JobView} from '../JobUpdate/JobBasics';
import {LinkedSeriesUpdata} from '../../../datum/LinkedSeriesUpdata';
import {UpField} from '../../../Bridge/misc/UpField';
import {SelectorField} from '../../../Bridge/misc/SelectorField';
import {Jewels} from '../../../stores/RootStore';


@observer
export class SeriesDupeControls extends React.Component<C_JobView> {
	
	render() {
		const jobRef: JobRef = this.props.jobRef;
		const seriesUp: LinkedSeriesUpdata = jobRef.seriesUp;
		const vJobSeries = Jewels().vJobSeries;
		
		return (
			<SimCard>
				<Row
					childV
				>
					<SelectorField
						state={seriesUp.reoccurringEnum}
						w={160}
						hideOutline
						size={14}
						selectorStyle={{
							valueContainer: {
								padding: 2,
							}
						}}
					/>
					
					<Col grow/>
					
					<WeekdayGroup
						weekdayState={jobRef.seriesUp.weekdays}
						disabled={seriesUp.reoccurringEnum.value.repeatType === 'month'}
					/>
					
					<Col grow/>
					
					<Butt
						on={() => vJobSeries.AddPreview(jobRef, jobRef.jobDat.start)}
						icon={IoMdCopy}
						primary
						subtle
						mini
						tooltip={[
							'Duplicate Current Job:',
							'This will create a PREVIEW of a duplicate of the current job (with the below fields copied over) on the same date/time.',
						]}
					/>
				
				</Row>
				
				<Row
					childV
					marT={12}
				>
					<Txt
						marR={6}
						size={20}
					>Add</Txt>
					
					<UpField
						state={seriesUp.occurrences}
						w={50}
					/>
					
					<Txt
						marL={6}
						size={20}
					>{$j.plural(seriesUp.occurrences.value, 'Job')}</Txt>
					
					<Col grow/>
					
					<Butt
						on={() => vJobSeries.AddPreviewRepeating(jobRef)}
						primary
						label={'Preview'}
						// tooltip={'Create Series:<br/>This will create a PREVIEW of a duplicate of the current job (with the below fields copied over) on the same date/time.'}
						// marR={24}
					/>
				</Row>
				
				{!!seriesUp.previews.length && (
					<Row
						marT={24}
						childV
						padH={24}
					>
						<Butt
							on={() => vJobSeries.ClearPreviews(jobRef)}
							danger
							// enabled={seriesUp.previews.length}
							mini
							icon={MdDeleteSweep}
							// tooltip={`Remove Previews (${oLinked.stubs.size})`}
							tooltip={`Remove Previews (${seriesUp.previews.length})`}
						/>
						
						<Col w={24}/>
						
						<Butt
							on={() => vJobSeries.CreateJobsFromPreviews(jobRef)}
							secondary
							enabled={seriesUp.previews.length}
							icon={MdLibraryAdd}
							// label={`Create ${oLinked.stubs.size} ${$j.plural('Job', oLinked.form.occurrences)}`}
							label={`Create ${$j.pluralCount(seriesUp.previews.length, 'Job')}`}
							tooltip={'This will create jobs with data from the fields below.'}
						/>
					</Row>
				)}
			
			</SimCard>
		);
	}
}

@observer
class WeekdayGroup extends React.Component {
	render() {
		const weekdayState = this.props.weekdayState;
		const disabled = this.props.disabled;
		
		if (disabled) return <></>;
		
		return (
			<>
				<DayToggle weekday={7} state={weekdayState} disabled={disabled}/>
				<DayToggle weekday={1} state={weekdayState} disabled={disabled}/>
				<DayToggle weekday={2} state={weekdayState} disabled={disabled}/>
				<DayToggle weekday={3} state={weekdayState} disabled={disabled}/>
				<DayToggle weekday={4} state={weekdayState} disabled={disabled}/>
				<DayToggle weekday={5} state={weekdayState} disabled={disabled}/>
				<DayToggle weekday={6} state={weekdayState} disabled={disabled}/>
			</>
		);
	}
}

const WEEKDAYS = [
	'',
	'Mondays only',
	'Tuesdays only',
	'Wednesdays only',
	'Thursdays only',
	'Fridays only',
	'Saturdays only',
	'Sundays only'
];

@observer
class DayToggle extends React.Component {
	@computed get isSet(): boolean {
		return this.props.state.value[this.props.weekday];
	}
	
	render() {
		const {
			weekday,
			state,
			b,
			marL,
			disabled
		} = this.props;
		
		
		return (
			<Butt
				on={() => state.Set(weekday, !this.isSet)}
				label={WEEKDAYS[weekday][0]}
				primary
				subtle={!this.isSet}
				mini
				grow
				b={b}
				marL={marL}
				tooltip={WEEKDAYS[weekday]}
				disabled={disabled}
			/>
		);
	}
}

const hue = {
	bg: '#f7f8fb',
	border: '#f7f8fb',
	hoverBg: '#edf4fb',
	hoverBorder: '#c6c9cb',
	error: '#ff1b2f',
	outline: '#269db5',
	hasChanged: '#86ad00',
};

const InputComp = styled.input`
  height: ${p => (
          p.h
                  ? Number.isInteger(p.h) ? `${p.h}px` : p.h
                  : 'unset'
  )};
  width: ${p => p.width};
  font-size: ${p => p.size ? (typeof p.size === 'string' ? p.size : `${p.size}px`) : '1rem'};
  padding: ${p => p.padding || '6px'};
  background-color: ${hue.bg};
  border-style: solid;
  border-width: 1px;
  border-color: ${p => p.error ? hue.error : p.hasChanged ? hue.hasChanged : hue.border};
  outline-color: ${p => p.error ? hue.error : hue.outline};
  box-sizing: border-box;
  text-align: center;

  &:hover {
    background-color: ${hue.hoverBg};
    border-color: ${p => p.error ? hue.error : hue.hoverBorder};
  }
`;


@observer
class DupeControlInput extends React.Component {
	
	@computed get isInt() {
		return this.props.int || this.props.state.dataType === 'Int';
	}
	
	render() {
		const {
			key,
			value,
			onChange,
			tabi,
			disabled,
			error,
			w,
			size,
		} = this.props;
		
		return (
			<InputComp
				id={key}
				type={'number'}
				value={value}
				onChange={evt => onChange(Math.round(evt.target.value))}
				disabled={disabled}
				error={error}
				autoComplete={'off'}
				tabIndex={tabi}
				width={`${w}px`}
				size={size}
				onFocus={(evt) => evt.target.select()}
			/>
		);
	}
}

@observer
export class InputSelect extends React.Component {
	
	
	@computed get choiceObj() {
		if (!this.props.choices) return {};
		
		let choices = {};
		Object.keys(this.props.choices).forEach(key => {
			choices[key] = {
				value: key,
				label: typeof this.props.choices[key] === 'string'
					? this.props.choices[key]
					: this.props.choices[key][this.props.choiceLabelKey || 'label'],
				color: this.props.choiceColorer ? this.props.choiceColorer(this.props.choices[key]) : undefined,
			};
		});
		return choices;
	}
	
	@computed get choiceArray() {
		return this.props.sorter
			? Object.values(this.choiceObj).sort(this.props.sorter)
			: Object.values(this.choiceObj);
	}
	
	onChange = (choice) => {
		if (this.props.state) this.props.state.Change(choice.value);
		if (this.props.onChange) this.props.onChange(choice.value);
	};
	
	render() {
		const {
			value,
			onChange,
			label,
			disabled,
			tabi,
			size,
		} = this.props;
		
		return (
			<Col
				{...this.props}
			>
				{label && (
					<Txt b marB={8}>{label}</Txt>
				)}
				<SelectWrapper
					component={Select}
					options={this.choiceArray}
					value={this.choiceObj[value]}
					onChange={choice => onChange(choice.value)}
					disabled={disabled}
					tabIndex={tabi}
					styles={{
						valueContainer: (style) => ({
							...style,
							padding: 10,
							fontSize: size || 18,
							backgroundColor: '#f7f8fb',
							height: '100%', // props.h,
						}),
						container: (style) => ({...style}),
						option: (style, {data}) => ({
							...style,
							color: data.color,
						}),
						singleValue: (style, {data}) => ({
							...style,
							color: data.color,
						}),
					}}
					theme={theme => ({
						...theme,
						borderRadius: 0,
						colors: {
							...theme.colors,
							backgroundColor: '#f7f8fb',
							primary: '#269db5',
							primary2: '#269db5',
						}
					})}
				/>
			</Col>
		);
	}
}

@observer
class SelectWrapper extends React.Component {
	
	@computed get options() {
		return this.props.options.slice();
	}
	
	render() {
		const props = this.props;
		const SelectComponent = props.component;
		const options = this.options;
		
		return (
			<Observer>{() => (
				<SelectComponent
					{...props}
					options={options}
				/>
			)}
			</Observer>
		);
	}
}