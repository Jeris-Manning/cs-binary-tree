import {Row, Txt} from '../Bridge/Bricks/bricksShaper';
import {HUE} from '../Bridge/HUE';
import React, {Component} from 'react';
import {observer} from 'mobx-react';

@observer
export default class ErrorRow extends React.Component {
	render() {
		if (!this.props.error) {
			return <Row/>;
		}
		
		return (
			<Row marB={4} {...this.props}>
				<Txt hue={HUE.error} size={this.props.size || 24}>
					Error: {this.props.error}
				</Txt>
			</Row>
		);
	}
}