import React, {Component} from 'react';
import {observer} from 'mobx-react';
import styled from 'styled-components';
import {Col, Row, Txt} from '../Bridge/Bricks/bricksShaper';
import {
	MdCheckBox as Icon_Checked,
	MdCheckBoxOutlineBlank as Icon_Unchecked,
	MdInfoOutline as Icon_Info
} from 'react-icons/md';
import {Tip} from '../Bridge/misc/Tooltip';

const hue = {
	bg: '#f7f8fb',
	border: '#f7f8fb',
	hoverBg: '#edf4fb',
	hoverBorder: '#c6c9cb',
	error: '#ff1b2f',
	outline: '#269db5',
};

const Input = styled.input`
	height: ${p => p.h || 16}px;
	padding: 6px;
	background-color: ${hue.bg};
	border-style: solid;
	border-width: 1px;
	border-color: ${p => p.error ? hue.error : hue.border};
	outline-color: ${p => p.error ? hue.error : hue.outline};
	
	&:hover {
		background-color: ${hue.hoverBg};
		border-color: ${p => p.error ? hue.error : hue.hoverBorder};
	}
`;

const Label = styled.div`
	//text-transform: uppercase;
	margin-bottom: 6px;
	margin-right: 4px;
	margin-left: 6px;
	font-size: 14px;
	color: #3c3c3c;
`;

/**
 * label
 * isChecked
 * onChange
 */
@observer
export default class ToggleRow extends React.Component {
	render() {
		return (
			<Row
				onClick={() => this.props.onChange(!this.props.isChecked)}
			>
				
				<Input
					type={'checkbox'}
					checked={this.props.isChecked}
					onChange={() => this.props.onChange(!this.props.isChecked)}
				/>
				
				<Label>{this.props.label}</Label>
				
				{this.props.tooltip && (
					<Col marT={3}>
						<Tip text={this.props.tooltip}>
							<Icon_Info size={'.8em'}/>
						</Tip>
					</Col>
				)}
			
			</Row>
		);
	}
}

@observer
export class ToggleCategory extends React.Component {
	
	ToggleAll = () => {
		if (this.props.rows.every(r => r.isChecked)) {
			this.props.rows.forEach(r => this.props.onChange(r.rowId, false));
		} else {
			this.props.rows.forEach(r => this.props.onChange(r.rowId, true));
		}
	};
	
	render() {
		return (
			<Col
				marH={8}
				marB={16}
			>
				<Txt
					onClick={this.ToggleAll}
					marB={10}
					size={18}
				>{this.props.title}</Txt>
				
				{this.props.rows.map(row => {
					return (
						<ToggleRow
							key={row.rowId}
							label={row.label}
							isChecked={!!row.isChecked}
							onChange={(checked) => this.props.onChange(row.rowId, checked)}
							tooltip={row.tooltip}
						/>
					);
				})}
			</Col>
		);
	}
}

@observer
export class MiniConfig extends React.Component {
	render() {
		const {
			onToggle,
			isChecked,
			label,
			tooltip,
		} = this.props;
		
		return (
			<Tip text={tooltip}>
				<Row
					onClick={() => onToggle(!isChecked)}
				>
					{isChecked
						? <Icon_Checked size={'0.7rem'}/>
						: <Icon_Unchecked size={'0.7rem'}/>
					}
					<Txt size={'0.7rem'} marL={2} noSelect>{label}</Txt>
				</Row>
			</Tip>
		)
	}
}
