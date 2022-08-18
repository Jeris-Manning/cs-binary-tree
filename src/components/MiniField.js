import React, {Component} from 'react';
import {observer} from 'mobx-react';
import {Col, Row} from '../Bridge/Bricks/bricksShaper';
import styled from 'styled-components';
import {MdInfoOutline as Icon_Info} from 'react-icons/md';
import {Tip} from '../Bridge/misc/Tooltip';

/*
	TODO: clean this class up
*/

const hue = {
	bg: '#f7f8fb',
	border: '#f7f8fb',
	hoverBg: '#edf4fb',
	hoverBorder: '#c6c9cb',
	error: '#ff1b2f',
	outline: '#269db5',
};


const Input = styled.input`
	//height: ${p => p.h ? (typeof p.h === 'string' ? p.h : `${p.h}px`) : '16px'}
	//height: ${p => p.h || 16}px;
	height: ${p => (
		p.h
			? Number.isInteger(p.h) ? `${p.h}px` : p.h
			: 'unset'
	)};
	width: ${p => p.width};
	font-size: ${p => p.size ? (typeof p.size === 'string' ? p.size : `${p.size}px`) : '1rem'};
	padding: ${p => p.padding || '6px'};
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
	height: ${p => (
		p.h
			? Number.isInteger(p.h) ? `${p.h}px` : p.h
			: '48px'
	)};
	font-size: ${p => p.size ? (typeof p.size === 'string' ? p.size : `${p.size}px`) : '1rem'};
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

const Label = styled.div`
	text-transform: uppercase;
	margin-bottom: 4px;
	margin-right: 3px;
	font-size: 12px;
	color: #3c3c3c;
`;

const ErrorText = styled.div`
	color: ${hue.error};
	font-weight: lighter;
	font-style: italic;
	font-size: .75em;
	margin-top: -2px;
	margin-bottom: 1px;
`;

@observer
export default class MiniField extends React.Component {
	
	constructor(props) {
		super(props);
		this.inputRef = props.inputRef || React.createRef();
	}
	
	componentDidMount() {
		if (this.props.focus) {
			this.inputRef.current.focus();
		}
	}
	
	onKeyPress = evt => {
		if (this.props.logAll) console.log(evt.key);
		
		switch (evt.key) {
			case 'Enter':
				const field = this.props.field || this.props.$;
				
				if (typeof this.props.onEnterKey === 'function') {
					
					if (field.multiline || this.props.multiline) {
						if (!evt.shiftKey) {
							this.props.onEnterKey(field.value);
							evt.preventDefault();
						}
					} else {
						this.props.onEnterKey(field.value);
					}
					
				} else if (evt.ctrlKey && typeof this.props.onCtrlEnterKey === 'function') {
					this.props.onCtrlEnterKey(field.value);
				}
				break;
		}
	};
	
	onFocus = (evt) => {
		if (this.props.selectOnFocus) evt.target.select();
		
		(this.props.field || this.props.$).onFocus();
		if (this.props.onFocus) this.props.onFocus();
	};
	
	onBlur = (evt) => {
		(this.props.field || this.props.$).onBlur();
		if (this.props.onBlur) this.props.onBlur();
	};
	
	render() {
		const props = this.props;
		const field = props.field || props.$;
		
		const InputComponent = (field.multiline || props.multiline || props.showAsMultiline)
			? TextArea
			: Input;
		
		const label = field.label || props.label;
		const description = field.description || props.description;
		const infoComponent = props.infoComponent;
		const error = field.error || props.error;
		
		return (
			<Col
				w={props.w}
				marL={props.marL || props.marH || props.mar}
				marR={props.marR || props.marH || props.mar}
				marT={props.marT || props.marV || props.mar}
				marB={props.marB || props.marV || props.mar || 12}
				shrink
				grow={props.grow}
				minHeight={props.minHeight}
				maxHeight={props.maxHeight}
				minWidth={props.minWidth}
				maxWidth={props.maxWidth}
			>
				{label && (
					<Row>
						<Label>{label}</Label>
						{description && (
							<Tip text={description}>
								<Icon_Info size={'.8em'}/>
							</Tip>
						)}
					</Row>
				)}
				
				
				{error && (
					<ErrorText>{error}</ErrorText>
				)}
				
				<InputComponent
					id={props.id || field.id || label || props.name}
					type={field.type || props.type}
					value={field.value || ''}
					placeholder={props.placeholder || field.placeholder}
					onChange={props.onChange || field.onChange}
					onFocus={this.onFocus}
					onBlur={this.onBlur}
					disabled={field.disabled || props.disabled}
					error={error}
					h={props.h}
					size={props.size}
					onKeyPress={this.onKeyPress}
					name={props.name || field.name || field.id}
					autoComplete={props.noAutoComplete ? 'off' : undefined}
					resize={props.resize}
					ref={this.inputRef}
					tabIndex={props.tabIndex}
					padding={props.padding}
					width={props.width}
					center={props.center}
					hueBg={props.hueBg}
				/>
				
				{infoComponent}
			</Col>
		);
	}
}