import React from 'react';
import {observer} from 'mobx-react';
import {Col, Row} from '../Bricks/bricksShaper';


function TwoColumn(props) {
	const count = props.children ? props.children.length : 0;
	
	if (count === 0) return <Row/>;
	
	
	const itemsInCol1 = props.col1 || (count/2);
	const col1 = props.children.slice(0, itemsInCol1);
	const col2 = props.children.slice(itemsInCol1);
	// const col2 = props.children.slice(itemsInCol1, count);
	
	return (
		<Row wrap>
			<Col grow>{col1}</Col>
			<Col grow>{col2}</Col>
		</Row>
	);
}

export default observer(TwoColumn);