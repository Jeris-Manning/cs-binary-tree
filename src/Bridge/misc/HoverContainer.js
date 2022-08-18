import React from 'react';
import {observer} from 'mobx-react';
import {Col, Row} from '../Bricks/bricksShaper';
import {observable, action} from 'mobx';
import {isFunc} from './$j';

@observer
export class HoverContainer extends React.Component {
	
	@observable hover = false;
	
	@action onMouseEnter = () => this.hover = true;
	@action onMouseLeave = () => this.hover = false;
	
	render() {
		const {
			children,
			col,
			row,
			
		} = this.props;
		
		// const Comp = (col && Col) || (row && Row) || Row;
		const Comp = col ? Col : Row;
		
		return (
			<Comp
				{...this.props}
				onMouseEnter={this.onMouseEnter}
				onMouseLeave={this.onMouseLeave}
			>
				{children(this.hover)}
			</Comp>
		)
	}
}

@observer
export class HoverRow extends React.Component {
	
	@observable hover = false;
	
	@action onMouseEnter = () => this.hover = true;
	@action onMouseLeave = () => this.hover = false;
	
	render() {
		const {
			children,
			hueOn,
			hueOff,
		} = this.props;
		
		return (
			<Row
				{...this.props}
				onMouseEnter={this.onMouseEnter}
				onMouseLeave={this.onMouseLeave}
				hue={this.hover ? hueOn : hueOff}
			>
				{isFunc(children) ? children(this.hover) : children}
			</Row>
		)
	}
}