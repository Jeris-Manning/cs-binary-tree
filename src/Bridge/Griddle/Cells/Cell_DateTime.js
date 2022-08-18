import React, {Component} from 'react';
import {Row, Txt} from '../../Bricks/bricksShaper';
import {observer} from 'mobx-react';


@observer
export default class Cell_DateTime extends React.Component {
	render() {
		const dt = this.props.value;
		
		if (!dt.isValid) {
			return (
				<Row>
					<Txt hue={'#a30815'}>
						{dt.original} -> {dt.invalidExplanation} {dt.invalidReason}
					</Txt>
				</Row>
			);
		}
		
		const date = dt.toFormat('MMM d');
		
		const hour = dt.toFormat('h');
		const min = dt.toFormat('mm');
		const a = dt.toFormat('a');
		// const hueMin = min === '00'
		// 	? '#a8a8a8'
		// 	: '#656565';
		const hueMin = '#656565';
		
		
		return (
			<Row fill childCenterV>
				<Txt size={'1rem'} marB={1}>{date}</Txt>
				<Txt size={'1.2rem'} marL={5}>{hour}</Txt>
				<Txt size={'1rem'} marB={1} hue={hueMin}>:{min}</Txt>
				<Txt size={'1rem'} marB={1} marL={2}>{a}</Txt>
			</Row>
		);
	}
}