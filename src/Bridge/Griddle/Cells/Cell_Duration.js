import React, {Component} from 'react';
import {Col, Txt} from '../../Bricks/bricksShaper';
import {observer} from 'mobx-react';


@observer
export default class Cell_Duration extends React.Component {
	render() {
		const start = this.props.value.start;
		const end = this.props.value.end;
		const hourDiff = end.diff(start, 'hour');
		const minuteDiff = end.diff(start, 'minute') % 60;
		
		return (
			<Col fill childC>
				{!!hourDiff && <Txt size={'0.8rem'} hue={'#656565'}>{hourDiff} hr</Txt>}
				{!!minuteDiff && <Txt size={'0.8rem'} hue={'#656565'}>{minuteDiff} min</Txt>}
			</Col>
		);
	}
}