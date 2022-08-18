import React from 'react';
import {observer} from 'mobx-react';
import styled from 'styled-components';
import {MdCheckBox, MdCheckBoxOutlineBlank, MdInfoOutline} from 'react-icons/md';
import {Col, Row, Txt} from '../Bricks/bricksShaper';
import {Tip} from './Tooltip';
import {computed} from 'mobx';
import Linker from '../Nav/Linker';
import $j from './$j';
import {SimCard} from './Card';
import Butt from '../Bricks/Butt';
import {Upstate} from './Upstate';
import {Clip} from './Clip';
import {HUE} from '../HUE';

const hue = {
	bg: '#f7f8fb',
	border: '#f7f8fb',
	hoverBg: '#edf4fb',
	hoverBorder: '#c6c9cb',
	error: '#ff1b2f',
	outline: '#269db5',
	hasChanged: '#86ad00',
	disabledBg: '#fff',
	disabledBorder: '#fff',
};


const BgColor = (props) => props.disabled ? hue.disabledBg : hue.bg;

const BorderColor = (props) => {
	if (props.error) return hue.error;
	if (props.disabled) return hue.disabledBorder;
	return props.hasChanged ? hue.hasChanged : hue.border;
}


const Input = styled.input`
	height: ${p => $j.withPx(p.h)};
	width: ${p => $j.withPx(p.w, '100%')};
	//min-width: ${p => $j.withPx(p.minWidth || 100)};
	font-size: ${p => $j.withPx(p.size, '1rem')};
	padding: ${p => p.padding || '6px'};
	background-color: ${BgColor};
	border-style: solid;
	border-width: 1px;
	border-color: ${BorderColor};
	outline-color: ${p => p.error ? hue.error : hue.outline};
	box-sizing: border-box;
	text-align: ${p => p.center ? 'center' : 'unset'};
	
	&:hover {
		background-color: ${hue.hoverBg};
		border-color: ${p => p.error ? hue.error : hue.hoverBorder};
	}
`;

const TextArea = styled.textarea`
	flex: 1 1 auto;
	font-size: ${p => p.size ? (typeof p.size === 'string' ? p.size : `${p.size}px`) : '1rem'};
	padding: 6px;
	background-color: ${hue.bg};
	border-style: solid;
	border-width: 1px;
	border-color: ${p => p.error ? hue.error : p.hasChanged ? hue.hasChanged : hue.border};
	outline-color: ${p => p.error ? hue.error : hue.outline};
	resize: ${p => p.resize};
	
	&:hover {
		background-color: ${hue.hoverBg};
		border-color: ${p => p.error ? hue.error : hue.hoverBorder};
	}
`;

export type C_UpField = {
	state: Upstate,
	label?: string,
	description?: string,
	placeholder?: string,
	error?: string,
	multiline?: boolean,
	infoComponent?: any,
	formatter?: () => {},
	type?: string,
	disabled?: boolean,
	tabi?: number,
	autoComplete?: any,
	focus?: boolean,
	onFocus?: () => {},
	selectOnFocus?: boolean,
	onBlur?: () => {},
	onChange?: (any) => {},
	int?: boolean,
	number?: boolean,
	fnChange?: () => {}, // overrides
	center?: boolean,
	size?: number,
	inputWidth?: any,
	inputHeight?: any,
}

@observer
export class UpField extends React.Component<C_UpField> {
	
	constructor(props) {
		super(props);
		this.inputRef = React.createRef();
	}
	
	componentDidMount() {
		if (this.props.focus) {
			this.inputRef.current.focus();
		}
	}
	
	onChange = (evt) => {
		let value = evt.target.value;
		
		if (this.isInt) value = Math.round(value);
		
		if (this.props.onChange) this.props.onChange(value);
		
		if (this.props.fnChange) {
			this.props.fnChange(value);
			return;
		}
		
		this.props.state.Change(value);
	};
	
	onFocus = (evt) => {
		if (this.props.selectOnFocus) evt.target.select();
		if (this.props.onFocus) this.props.onFocus();
	};
	
	onBlur = (evt) => {
		if (this.props.onBlur) this.props.onBlur();
	};
	
	@computed get hasChanged() {
		return this.props.state.hasChanged;
	}
	
	@computed get isInt() {
		return this.props.int || this.props.state.dataType === 'Int';
	}
	
	@computed get inputType() {
		if (this.props.number || this.props.state.dataType === 'Float') return 'number';
		if (this.isInt) return 'number';
		return undefined;
	}
	
	@computed get value() {
		if (!this.props.state.value) return '';
		
		return this.props.formatter
			? this.props.formatter(this.props.state.value)
			: this.props.state.value;
	}
	
	render() {
		const {
			state,
			label,
			description,
			placeholder,
			error,
			multiline,
			infoComponent,
			type,
			disabled,
			tabi,
			autoComplete,
			center,
			size,
			w,
			h,
			inputWidth,
			inputHeight,
		} = this.props;
		
		const InputComponent =
			multiline ? TextArea : Input;
		const errorText = error || state.error;
		
		
		return (
			<Col
				{...this.props}
				tabi={-1}
			>
				{label && (
					<Clip copy={this.value}>
						<Row
							tabi={-1}
							childV
							// marB={4}
						>
							<Txt
								hue={HUE.fieldLabel}
								caps
								marR={3}
								size={12}
							>
								{label}
							</Txt>
							{description && (
								<Tip text={description}>
									<MdInfoOutline size={12}/>
								</Tip>
							)}
						</Row>
					</Clip>
				)}
				
				
				{errorText && (
					<Txt
						hue={hue.error}
						i
						light
						size={12}
						marT={-2}
						marB={1}
					>
						{errorText}
					</Txt>
				)}
				
				<InputComponent
					id={state.key}
					type={type || this.inputType}
					value={this.value}
					placeholder={placeholder}
					onChange={this.onChange}
					onFocus={this.onFocus}
					onBlur={this.onBlur}
					hasChanged={this.hasChanged}
					disabled={disabled}
					error={errorText}
					autoComplete={autoComplete ? undefined : 'off'}
					ref={this.inputRef}
					tabIndex={tabi}
					center={center}
					size={size}
					w={inputWidth}
					h={inputHeight}
				/>
				
				{infoComponent}
			</Col>
		);
	}
}

@observer
export class UpFieldFit extends React.Component<C_UpField> {
	render() {
		if (this.props.readonly) return (
			<UpKvpLabel
				marT={4}
				marB={4}
				marL={4}
				marR={4}
				fit
				{...this.props}
			/>
		)
		
		if (this.props.card) return (
			<UpCard {...this.props.card}>
				<UpField
					marT={4}
					marB={4}
					marL={4}
					marR={4}
					fit
					{...this.props}
				/>
			</UpCard>
		)
		
		return (
			<UpField
				marT={4}
				marB={4}
				marL={4}
				marR={4}
				fit
				{...this.props}
			/>
		)
	}
}

@observer
export class UpRow extends React.Component {
	render() {
		return (
			<Row
				childSpread
				{...this.props}
			/>
		)
	}
}

@observer
export class UpCard extends React.Component {
	render() {
		return (
			<SimCard
				pad={8}
				{...this.props}
			/>
		)
	}
}

@observer
export class UpKvpLabel extends React.Component {
	
	@computed get value() {
		const val = this.props.value || (this.props.state || {}).value;
		
		if (!val) return '';
		
		return this.props.formatter
			? this.props.formatter(val)
			: val;
	}
	
	render() {
		const {
			label,
			// value,
			state = {},
			link,
			href,
		} = this.props;
		
		return (
			<Row
				// childS
				childCenterV
				marB={4}
				{...this.props}
			>
				<Clip copy={this.value}>
					<Txt
						size={12}
						hue={'#404040'}
						marR={6}
						smallcaps
					>
						{label || state.key}:
					</Txt>
				</Clip>
				
				{link ? (
					<Linker {...link}>
						<Txt
							size={14}
							prewrap
							b
						>
							{this.value}
						</Txt>
					</Linker>
				) : href ? (
					<a href={href} target={'_blank'}>
						<Txt
							size={14}
							prewrap
						>
							{this.value}
						</Txt>
					</a>
				) : (
					<Txt
						size={14}
						prewrap
					>
						{this.value}
					</Txt>
				)}
			</Row>
		);
	}
}

// @observer
// class UpClick extends React.Component {
// 	render() {
//
// 		return (
// 			<Col
// 				on={}
// 			>
// 				<UpFieldFit
// 					{...this.props}
// 					on={undefined}
// 				/>
// 			</Col>
// 		)
// 	}
// }


@observer
export class UpTog extends React.Component {
	render() {
		const {
			state,
			label,
			tooltip,
			icon,
		} = this.props;
		
		const CheckIcon = state.value ? MdCheckBox : MdCheckBoxOutlineBlank;
		const OtherIcon = icon;
		
		return (
			<Tip text={tooltip}>
				<Row
					onClick={state.Toggle}
				>
					
					<CheckIcon
						size={16}
					/>
					
					<Txt
						size={16}
						marL={2}
						marR={6}
						noSelect
						capFirst
					>{label}</Txt>
					
					{OtherIcon && (
						<OtherIcon
							size={16}
						/>
					)}
				</Row>
			</Tip>
		);
	}
}

@observer
export class UpCycleButt extends React.Component {
	render() {
		const state: Upstate = this.props.state;
		const current = state.value;
		// todo
		
		return (
			<Butt
				on={state.Cycle}
				icon={current.icon}
				tooltip={current.tooltip}
				subtle
				secondary
				mini
			/>
		)
	}
}