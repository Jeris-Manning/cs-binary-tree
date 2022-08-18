import React from 'react';
import {observer} from 'mobx-react';
import {Col, Row, Txt} from '../Bridge/Bricks/bricksShaper';
import styled from 'styled-components';
import {MdInfoOutline as Icon_Info} from 'react-icons/md';
import {Tip} from '../Bridge/misc/Tooltip';
import {action, observable} from 'mobx';
import Linker from '../Bridge/Nav/Linker';
import {Clip} from '../Bridge/misc/Clip';

/*

	probably use UpField instead

*/
@observer
export class SimField extends React.Component {
	
	inputRef;
	@observable field = {
		value: '',
	};
	
	constructor(props) {
		super(props);
		this.inputRef = props.inputRef || React.createRef();
		this.Construct(props);
	}
	
	componentDidUpdate(prevProps: Readonly<P>, prevState: Readonly<S>, snapshot: SS) {
		this.DidUpdate(this.props);
	}
	
	@action Construct = (props) => this.field.value = props.value || '';
	@action DidUpdate = (props) => {
		if ((props.value || '') === this.field.value) return;
		this.field.value = props.value;
	}
	
	@action onChange = (evt) => {
		// console.log(`SimField onChange`, evt);
		this.field.value = evt.target.value;
		if (this.props.onChange) this.props.onChange(this.field.value);
	};
	
	@action onKeyPress = evt => {
		if (evt.key === 'Enter') return this.CheckEnterKey(evt);
	};
	
	@action CheckEnterKey = (evt) => {
		const {
			onEnterKey,
			multiline,
		} = this.props;
		
		if (!onEnterKey) return;
		
		if (multiline) {
			if (!evt.shiftKey) {
				this.props.onEnterKey(this.field.value);
				evt.preventDefault();
			}
		} else {
			this.props.onEnterKey(this.field.value);
		}
	};
	
	@action onFocus = (evt) => {
		const {
			selectOnFocus,
			onFocus,
		} = this.props;
		
		if (selectOnFocus) evt.target.select();
		if (onFocus) onFocus(this.field.value);
	};
	
	@action onBlur = (evt) => {
		const {
			onBlur,
		} = this.props;
		
		if (onBlur) onBlur(this.field.value);
	};
	
	getTypeStyling = (props) => {
		if (props.color) return ['color', {h: 24, padding: 0}];
		return [props.type];
	};
	
	render() {
		const {
			id,
			value,
			label,
			info,
			link,
			error,
			focus,
			selectOnFocus,
			onChange,
			onFocus,
			onBlur,
			onEnterKey,
			
			multiline,
			disabled,
			placeholder,
			autoComplete,
			
			type,
			color,
			
			labelProps,
			inputProps,
			
		} = this.props;
		
		const [inputType, typeStyling] = this.getTypeStyling(this.props);
		
		return (
			<Col
				{...this.props}
			>
				{label && (
					<Label
						{...this.props}
						field={this.field}
					/>
				)}
				
				
				{error && (
					<ErrorText>{error}</ErrorText>
				)}
				
				<InnerInput
					id={id || label}
					field={this.field}
					
					multiline={multiline}
					type={inputType}
					disabled={disabled}
					placeholder={placeholder}
					
					h={'100%'}
					name={id}
					{...typeStyling}
					
					{...inputProps}
					
					error={error}
					focus={focus}
					onChange={this.onChange}
					onFocus={this.onFocus}
					onBlur={this.onBlur}
					onKeyPress={this.onKeyPress}
					autoComplete={autoComplete ? undefined : 'off'}
					ref={this.inputRef}
				/>
			
			</Col>
		);
	}
}

@observer
class Label extends React.Component {
	render() {
		const {
			label,
			labelProps,
			info,
			link,
			field,
		} = this.props;
		
		return (
			<Row>
				<Clip copy={field.value}>
					<Txt
						uppercase
						size={12}
						hue={'#3c3c3c'}
						marB={4}
						marR={3}
						{...labelProps}
					>{label}</Txt>
				</Clip>
				
				<Info
					info={info}
					link={link}
				/>
			</Row>
		);
	}
}

@observer
class InnerInput extends React.Component {
	
	inputRef;
	
	constructor(props) {
		super(props);
		this.inputRef = props.inputRef || React.createRef();
	}
	
	componentDidMount() {
		if (this.props.focus) {
			this.inputRef.current.focus();
		}
	}
	
	render() {
		const {
			field,
			multiline,
		} = this.props;
		
		const InputComponent = (multiline) ? TextArea : Input;
		
		return (
			<InputComponent
				value={field.value}
				{...this.props}
				ref={this.inputRef}
			/>
		);
	}
}


@observer
class Info extends React.Component {
	render() {
		const {
			info,
			link,
		} = this.props;
		
		if (!info && !link) return <></>;
		
		if (link) return (
			<Linker href={link}>
				<Tip text={info}>
					<Icon_Info size={12}/>
				</Tip>
			</Linker>
		);
		
		return (
			<Tip text={info}>
				<Icon_Info size={12}/>
			</Tip>
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
};

function prop(key, or = 'none', pxIfNum = true) {
	return (p) => {
		const val = p.hasOwnProperty(key) ? p[key] : or;
		
		if (!pxIfNum) return val;
		if (!Number.isInteger(val)) return val;
		return val + 'px';
	};
}

const Input = styled.input`
  height: ${prop('h', 'unset')};
  width: ${p => p.width};
  font-size: ${prop('size', `1rem`)};
  padding: ${prop('padding', 6)};
  background-color: ${p => p.hueBg || hue.bg};
  border-style: solid;
  border-width: 1px;
  border-color: ${p => p.error ? hue.error : hue.border};
  outline-color: ${p => p.error ? hue.error : hue.outline};
  box-sizing: border-box;
  text-align: ${p => p.center ? 'center' : 'unset'};

  &:hover {
    background-color: ${hue.hoverBg};
    border-color: ${p => p.error ? hue.error : hue.hoverBorder};
  }
`;

const TextArea = styled.textarea`
  height: ${prop('h', 48)};
  font-size: ${prop('size', `1rem`)};
  padding: 6px;
  background-color: ${p => p.hueBg || hue.bg};
  border-style: solid;
  border-width: 1px;
  border-color: ${p => p.error ? hue.error : hue.border};
  outline-color: ${p => p.error ? hue.error : hue.outline};
  resize: ${p => p.resize};

  &:hover {
    background-color: ${hue.hoverBg};
    border-color: ${p => p.error ? hue.error : hue.hoverBorder};
  }
`;

const ErrorText = styled.div`
  color: ${hue.error};
  font-weight: lighter;
  font-style: italic;
  font-size: .75em;
  margin-top: -2px;
  margin-bottom: 1px;
`;