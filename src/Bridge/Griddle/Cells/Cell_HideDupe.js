import React, {Component} from 'react';
import {Row} from '../../Bricks/bricksShaper';
import {observer} from 'mobx-react';


@observer
export default class Cell_HideDupe extends React.Component {
	render() {
		const props = this.props;
		const valueAbove = props.valueAbove();
		if (valueAbove && props.value === valueAbove) {
			return <Row/>;
		}
		
		return (
			<Row>{props.value}</Row>
		);
	}
}