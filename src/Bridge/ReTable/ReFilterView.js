import React from 'react';
import {observer} from 'mobx-react';
import {Tip} from '../misc/Tooltip';
import {Col, Row, Txt} from '../Bricks/bricksShaper';
import {Banned, ReFilter, Required, Unset} from './ReFilter';
import {ReTable} from './ReTable';
import {Ico} from '../Bricks/Ico';
import {IconType} from 'react-icons';
import type {ReFilterStatus} from './ReFilter';

type Props = {
	refilter: ReFilter,
	retable: ReTable,
	size?: number,
	
	label?: string;
	icon?: IconType;
	
	rowStyle?: any,
	labelStyle?: any,
	iconStyle?: any,
	
	fnCycle?: any,
	status?: ReFilterStatus,
};

@observer
export class ReFilterView extends React.Component<Props> {
	
	componentDidMount() {
		const refilter = this.props.refilter;
		const retable = this.props.retable;
		retable.SetFilter(refilter);
		// console.log(`ReFilterView mount: ${this.props.label || refilter.label}`);
	}
	
	render() {
		const refilter = this.props.refilter;
		const retable = this.props.retable;
		
		const status = this.props.status !== undefined
			? this.props.status
			: refilter.status;
		
		const icon = this.props.icon || refilter.icon;
		const label = this.props.label || refilter.label;
		
		const style = STATUS_STYLE[status];
		const tip = style.tooltip;
		const overlay = style.overlay;
		
		const rowStyle = this.props.rowStyle;
		const labelStyle = this.props.labelStyle;
		const iconStyle = this.props.iconStyle;
		const sizeStyle = this.props.size ? {size: this.props.size} : {};
		
		const fnCycle = this.props.fnCycle || retable.CycleFilter;
		
		return (
			<Tip text={tip}>
				<Row
					onClick={() => fnCycle(refilter)}
					childCenterV
					relative
					{...rowStyle}
				>
					
					{icon && (
						<Ico
							icon={icon}
							marR={4}
							{...style.iconStyle}
							{...iconStyle}
							{...sizeStyle}
						/>
					)}
					
					<Txt
						{...style.labelStyle}
						{...labelStyle}
						{...sizeStyle}
					>{label}</Txt>
					
					{overlay}
				
				</Row>
			</Tip>
		);
	}
}


const STATUS_STYLE = {
	[Unset]: {
		tooltip: 'unset',
		iconStyle: {
			hue: '#c5c5c5',
			size: 18,
		},
		labelStyle: {
			hue: '#8d8d8d',
			size: 18,
			b: true,
			smallCaps: true,
		},
	},
	[Required]: {
		tooltip: 'showing',
		iconStyle: {
			hue: '#005c02',
			size: 18,
		},
		labelStyle: {
			hue: '#005c02',
			size: 18,
			b: true,
			smallCaps: true,
			// u: true,
		},
		overlay: (
			<Col absolute fill childS>
				<Row
					hue={'#005c02'}
					h={2}
				/>
			</Col>
		),
	},
	[Banned]: {
		tooltip: 'hiding',
		iconStyle: {
			hue: '#af848a',
			size: 18,
		},
		labelStyle: {
			hue: '#9e1818',
			size: 18,
			b: true,
			smallCaps: true,
			// strike: true,
		},
		overlay: (
			<Col absolute fill childCenterV>
				<Row
					hue={'#9e1818'}
					h={2}
				/>
			</Col>
		),
	},
};