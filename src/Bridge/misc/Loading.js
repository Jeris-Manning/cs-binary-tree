import React from 'react';
import {observer} from 'mobx-react';
import ReactLoading from 'react-loading';
import {Row} from '../Bricks/bricksShaper';


function Loading(props) {
	return (
		<Row childC>
			<ReactLoading
				type={props.type || 'spin'} //spinningBubbles
				color={props.hue || '#ff9f46'}
				width={props.w || props.size || 100}
				height={props.h || props.size || 100}
				delay={props.delay}
			/>
		</Row>
	);
}

export default observer(Loading);
