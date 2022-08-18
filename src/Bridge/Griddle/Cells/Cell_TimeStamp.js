import React, {Component} from 'react';
import {Row, Txt} from '../../Bricks/bricksShaper';
import {observer} from 'mobx-react';
import thyme from '../../thyme';
import {Tip} from '../../misc/Tooltip';


@observer
export default class Cell_TimeStampDate extends React.Component {
	render() {
		const props = this.props;
		
		if (!props.value) return <Row/>;
		
		// TODO: clean up
		const dt = props.value.isValid
			? props.value
			: thyme.fromFastJson(props.value);
		
		const tooltip = thyme.nice.dateTime.short(dt);
		return (
			<Tip text={tooltip}>
				<Row fill childCenterV>
					<Txt
						hue={props.hue}
					>{thyme.relative(dt)}</Txt>
				</Row>
			</Tip>
		);
	}
}