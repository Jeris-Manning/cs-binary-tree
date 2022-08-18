import {observer} from 'mobx-react';
import React, {Component} from 'react';
import {Row, Txt} from './bricksShaper';
import {action} from 'mobx';
import {is} from '../misc/$j';

@observer
export default class ToggleBox extends React.Component {
	
	@action OnClick = () => {
		if (is.func(this.props.on)) this.props.on(!this.props.toggled);
	};
	
	render() {
		const {
			id,
			toggled,
			label,
			labelProps,
		} = this.props;
		
		return (
			<Row
				onClick={this.OnClick}
				childCenterV
				{...this.props}
			>
				<input
					id={id}
					type={'checkbox'}
					checked={toggled}
					value={label}
					onChange={this.OnClick}
					onClick={this.OnClick}
				/>
				
				<Txt marL={4} {...labelProps}>
					{label}
				</Txt>
			</Row>
		);
	}
}