import React, {Component} from 'react';
import {Row, Txt} from '../../Bricks/bricksShaper';
import {observer} from 'mobx-react';
import Linker from '../../Nav/Linker';

@observer
export default class Cell_Link extends React.Component {
	render() {
		const link = props.column.link(this.props.value);
		
		return (
			<Row fill childCenterV>
				<Linker
					to={link.to}
					params={link.params}
					style={{textDecoration: 'none'}}
				>
					<Txt b={link.bold} marR={5}>
						{link.label}
					</Txt>
				</Linker>
			</Row>
		);
	}
}