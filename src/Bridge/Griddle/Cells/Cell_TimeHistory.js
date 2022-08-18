import React, {Component} from 'react';
import {Row, Txt} from '../../Bricks/bricksShaper';
import {observer} from 'mobx-react';
import thyme from '../../thyme';
import {Tip} from '../../misc/Tooltip';
import {Col} from '../../Bricks/bricksShaper';


@observer
export class Cell_TimeHistory extends React.Component {
	render() {
		const props = this.props;
		
		// MARK.render(this, `value`, props.value);
		
		if (!props.value) return <Row/>;
		
		// TODO: clean up
		const dt = props.value.isValid
			? props.value
			: thyme.fromFastJson(props.value);
		
		const tooltip = thyme.nice.dateTime.short(dt);
		return (
			<Tip text={tooltip}>
				<Col childC fill>
					<Txt
						hue={props.hue}
						size={props.column.size}
					>{thyme.nice.dateTime.relativeSmall(dt, false)}</Txt>
					<Txt
						hue={props.hue}
						size={props.column.size}
					>ago</Txt>
				</Col>
			</Tip>
		);
	}
}