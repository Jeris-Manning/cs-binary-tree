import React, {Component} from 'react';
import {observer} from 'mobx-react';
import {Row, Txt} from '../Bridge/Bricks/bricksShaper';
import Loading from '../Bridge/misc/Loading';


@observer
export default class Time extends React.Component {
	render() {
		const {
			time,
			hourSize = '2.4rem',
			minuteSize = '2rem',
			amPmSize = '2rem',
			hueMin = '#656565',
			loadIfInvalid = false,
		} = this.props;
		
		if (!time) {
			return loadIfInvalid
				? <Loading size={8}/>
				: <Txt>invalid</Txt>;
		}
		
		const hour = time.toFormat('h');
		const min = time.toFormat('mm');
		const a = time.toFormat('a');
		
		return (
			<Row childCenterV>
				<Txt size={hourSize}>{hour}</Txt>
				<Txt size={minuteSize} marB={1} hue={hueMin}>:{min}</Txt>
				<Txt size={amPmSize} marB={1} marL={2}>{a}</Txt>
			</Row>
		);
	}
}