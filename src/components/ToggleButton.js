import {observer} from 'mobx-react';
import React, {Component} from 'react';
import Butt from '../Bridge/Bricks/Butt';
import {computed} from 'mobx';
import {MdCheckBox, MdCheckBoxOutlineBlank} from 'react-icons/md';
import {Tip} from '../Bridge/misc/Tooltip';
import {Row, Txt} from '../Bridge/Bricks/bricksShaper';


@observer
export default class ToggleButton extends React.Component {
	
	@computed get isChecked() {
		if (this.props.isChecked) {
			return !this.props.invert;
		}
		return this.props.invert;
	}
	
	render() {
		const icon = this.isChecked
			? this.props.checkedIcon || MdCheckBox
			: this.props.uncheckedIcon || MdCheckBoxOutlineBlank;
		
		return (
			<Butt
				icon={icon}
				{...this.props}
			/>
		);
	}
}