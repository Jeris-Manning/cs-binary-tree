import React from 'react';
import {observer} from 'mobx-react';
import {FILTER_STATUS, Sifter} from './Sifter';
import {Tip} from '../misc/Tooltip';
import {Col, Txt} from '../Bricks/bricksShaper';

// @observer
// export class SifterIcon extends React.Component {
// 	render() {
//
// 	}
// }


@observer
export class SifterLabel extends React.Component {
	render() {
		const {
			sifter,
			filter,
		} = this.props;
		
		const {
			key,
			def,
			status,
		} = filter;
		
		const {
			label,
			info,
		} = def;
		
		const style = STATUS_STYLE[status];
		
		const tip = info
			? [style.tooltip, '', info]
			: style.tooltip;
		
		return (
			<Tip text={tip}>
				<Col
					{...this.props}
					onClick={() => sifter.Cycle(key)}
				>
					<Txt
						hue={style.labelHue}
						{...style.labelStyle}
					>{label}</Txt>
				</Col>
			</Tip>
		);
	}
}

@observer
export class SifterLabelsGroup extends React.Component {
	render() {
		const sifter: Sifter = this.props.sifter;
		
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
		)
	}
}


const STATUS_STYLE = {
	[FILTER_STATUS.unset]: {
		tooltip: 'unset',
		iconHue: '#c5c5c5',
		labelStyle: {
			hue: '#8d8d8d',
			size: 18,
			b: true,
			smallCaps: true,
		},
	},
	[FILTER_STATUS.required]: {
		tooltip: 'showing',
		iconHue: '#005c02',
		labelStyle: {
			hue: '#005c02',
			size: 18,
			b: true,
			smallCaps: true,
			u: true,
		},
	},
	[FILTER_STATUS.banned]: {
		tooltip: 'hiding',
		iconHue: '#af848a',
		labelStyle: {
			hue: '#9e1818',
			size: 18,
			b: true,
			smallCaps: true,
			strike: true,
		},
	},
};