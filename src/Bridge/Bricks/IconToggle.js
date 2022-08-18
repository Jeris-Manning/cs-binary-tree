import {observer} from 'mobx-react';
import React, {Component} from 'react';
import {Col} from './bricksShaper';
import {Tip} from '../misc/Tooltip';
import {action} from 'mobx';
import {is} from '../misc/$j';


@observer
export default class IconToggle extends React.Component {
	
	@action OnClick = () => {
		if (is.func(this.props.on)) this.props.on(!this.props.toggled);
	};
	
	render() {
		const {
			on,
			toggled,
			icon,
			size,
			iconOn,
			iconOff,
			hue,
			hueOn,
			hueOff,
			tooltip,
		} = this.props;
		
		const Icon = toggled
			? (iconOn || icon)
			: (iconOff || icon);
		
		const color = toggled
			? (hueOn || hue || '#000')
			: (hueOff || hue || '#c5c5c5');
		
		return (
			<Tip text={tooltip}>
				<Col
					{...this.props}
					onClick={this.OnClick}
					childCenterV
				>
					<Icon
						size={size || 26}
						color={color}
					/>
				</Col>
			</Tip>
		);
	}
}