import React, {Component} from 'react';
import {Row, Txt} from '../../Bricks/bricksShaper';
import {observer} from 'mobx-react';
import thyme from '../../thyme';


@observer
export default class Cell_Time extends React.Component {
	render() {
		// const time = this.props.value;
		// const time = thyme.fromFastJson(this.props.value);
		const props = this.props;
		
		// TODO: clean up
		const time = props.value.isValid
			? props.value
			: thyme.fromFastJson(props.value);
		
		// if (!time.isValid) {
		// 	return (
		// 		<Row>
		// 			<Txt hue={'#a30815'}>
		// 				{time.original} -> {time.invalidExplanation} {time.invalidReason}
		// 			</Txt>
		// 		</Row>
		// 	);
		// }
		
		const hour = time.toFormat('h');
		const min = time.toFormat('mm');
		const a = time.toFormat('a');
		// const hueMin = min === '00'
		// 	? '#a8a8a8'
		// 	: '#656565';
		const hueMin = '#656565';
		
		return (
			<Row fill childCenterV>
				<Txt size={'1.2rem'}>{hour}</Txt>
				<Txt size={'1rem'} marB={1} hue={hueMin}>:{min}</Txt>
				<Txt size={'1rem'} marB={1} marL={2}>{a}</Txt>
			</Row>
		);
	}
}