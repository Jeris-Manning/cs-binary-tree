import React, {Component} from 'react';
import {Col, Row, Txt} from '../../Bricks/bricksShaper';
import {observer} from 'mobx-react';


@observer
export default class Cell_TimeRange extends React.Component {
	render() {
		throw new Error('reimplement');
		// const start = this.props.value.start;
		// const end = this.props.value.end;
		//
		// return (
		// 	<Row childSpread fill>
		// 		<Time time={start}/>
		// 		<Duration start={start} end={end}/>
		// 		<Time time={end}/>
		// 	</Row>
		// );
	}
}

@observer
class Time extends React.Component {
	render() {
		const time = this.props.time;
		const hour = time.format('h');
		const min = time.format(':mm');
		const a = time.format('a');
		
		return (
			<Row childC >
				<Txt size={'1.2rem'}>{hour}</Txt>
				<Txt size={'1rem'} marB={1} hue={'#656565'}>{min}</Txt>
				<Txt size={'1rem'} marB={1} marL={2}>{a}</Txt>
			</Row>
		);
	}
}

@observer
class Duration extends React.Component {
	render() {
		const start = this.props.start;
		const end = this.props.end;
		const hourDiff = end.diff(start, 'hour');
		const minuteDiff = end.diff(start, 'minute') %60;
		
		return (
			<Col marH={8} childC w={60}>
				{!!hourDiff && <Txt size={'0.8rem'} hue={'#656565'}>{hourDiff} hr</Txt>}
				{!!minuteDiff && <Txt size={'0.8rem'} hue={'#656565'}>{minuteDiff} min</Txt>}
			</Col>
		);
	}
}

