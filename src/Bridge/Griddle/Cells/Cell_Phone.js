import React, {Component} from 'react';
import {Row, Txt} from '../../Bricks/bricksShaper';
import {observer} from 'mobx-react';


@observer
export default class Cell_Phone extends React.Component {
	render() {
		const phone = this.props.value;
		
		const formatted = (!phone || phone.length !== 10)
			? `? ${phone}`
			: `${phone.slice(0, 3)}-${phone.slice(3, 6)}-${phone.slice(6, 10)}`;
		
		
		return (
			<Row fill childCenterV>
				<a href={`tel:${phone}`}>
					<Txt>{formatted}</Txt>
				</a>
			</Row>
		);
	}
}

