import React, {Component} from 'react';
import {observer} from 'mobx-react';
import {MdKeyboardArrowDown, MdKeyboardArrowLeft, MdKeyboardArrowRight, MdKeyboardArrowUp} from 'react-icons/md';
import Butt from '../Bricks/Butt';

const icons = {
	up: MdKeyboardArrowUp,
	down: MdKeyboardArrowDown,
	left: MdKeyboardArrowLeft,
	right: MdKeyboardArrowRight,
};

// TODO: rewrite

@observer
export default class Foldable extends React.Component {
	
	render() {
		const props = this.props;
		
		// rightDown (default)
		// leftDown
		// upDown
		
		const icon = props.shown ? icons.down
			: props.leftDown ? icons.left
			: props.upDown ? icons.up
			: icons.right;
		
		return (
			<Butt
				on={props.onClick}
				icon={icon}
				iconSize={props.size || 14}
				iconHue={props.hue || 'black'}
				subtle
				mini
			
			/>
		)
	}
}