import React from 'react';
import {ReColumn} from './ReColumn';
import {Col} from '../Bricks/bricksShaper';
import {observer} from 'mobx-react';

export type C_ReCell = {
	value?: any,
	dat: any,
	column: ReColumn
}

@observer
export class RC_Default extends React.Component<C_ReCell> {
	render() {
		return (
			<Col shrink>
				{`${this.props.value}`}
			</Col>
		);
	}
}