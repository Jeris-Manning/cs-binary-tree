import React, {Component} from 'react';
import {Row} from '../../Bricks/bricksShaper';
import {observer} from 'mobx-react';
import Butt from '../../Bricks/Butt';
import ButtLink from '../../../components/ButtLink';


@observer
export default class Cell_Button extends React.Component {
	render() {
		const props = this.props;
		
		return (
			<Row fill>
				<Butt
					on={props.onPress}
					icon={props.icon}
					iconSize={props.size || 16}
					fillV
					tooltip={props.tooltip}
					{...props.buttProps}
				/>
			</Row>
		);
	}
}

@observer
export class Cell_NavButton extends React.Component {
	render() {
		const props = this.props;
		
		return (
			<Row fill>
				<ButtLink
					icon={props.icon}
					iconSize={props.size || 16}
					fillV
					tooltip={props.tooltip}
					toKey={props.toKey}
					params={props.params}
					{...props.buttProps}
				/>
			</Row>
		);
	}
}