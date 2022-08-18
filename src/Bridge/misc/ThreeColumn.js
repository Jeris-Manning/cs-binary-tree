import React from 'react';
import {observer} from 'mobx-react';
import {Col, Row} from '../Bricks/bricksShaper';

function ThreeColumn(props) {
	const count = props.children ? props.children.length : 0;
	
	if (count === 0) return <Row/>;
	
	
	const itemsInCol1 = props.col1 || (count/3);
	const itemsInCol2 = props.col2 || (count/3);
	const col1 = props.children.slice(0, itemsInCol1);
	const col2 = props.children.slice(itemsInCol1, itemsInCol1 + itemsInCol2);
	const col3 = props.children.slice(itemsInCol1 + itemsInCol2);
	
	return (
		<Row wrap>
			<Col grow shrink>{col1}</Col>
			<Col grow shrink>{col2}</Col>
			<Col grow shrink>{col3}</Col>
		</Row>
	);
}

export default observer(ThreeColumn);