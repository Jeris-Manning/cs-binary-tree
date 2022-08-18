import React from 'react';
import {observer} from 'mobx-react';
import {MdClose} from 'react-icons/md';
import Butt from '../Bridge/Bricks/Butt';
import {Col, Row, Txt} from '../Bridge/Bricks/bricksShaper';

@observer
export class Chip extends React.Component {
	render() {
		const {
			children,
			label,
			hueBg,
			leftComp,
			rightComp,
		} = this.props;
		
		return (
			<Row
				childV
				circle
				shadowPage
				{...this.props}
				hue={hueBg || '#fff'}
			>
				{leftComp || <Col w={34}/>}
				
				{label && (
					<Txt>{label}</Txt>
				)}
				
				{children}
				
				{rightComp || <Col w={34}/>}
			</Row>
		)
	}
}

@observer
export class ChipRemovable extends React.Component {
	render() {
		const {
			onRemove
		} = this.props;
		
		return (
			<Chip
				leftComp={(
					<Butt
						on={onRemove}
						subtle
						mini
						icon={MdClose}
						iconHue={'#575757'}
						circle
						// h={h}
						tooltip={'Remove Preview'}
					/>
				)}
				
				{...this.props}
			/>
		);
	}
}