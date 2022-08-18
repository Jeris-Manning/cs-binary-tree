// import React from 'react';
// import {Box, Btn, Col, Row, Scroll, Txt} from '../Bridge/Bricks/bricksShaper';
// import {observer} from 'mobx-react';
// import TextField from './forms/TextField';
// import {MdClose} from 'react-icons/md';
//
// function FilterDict(props) {
//
// 	if (props.selected) {
// 		return (
// 			<Col shrink>
// 			<Row>
// 				<Txt>{props.extract(props.selected)}</Txt>
// 				<Btn onClick={props.onDeselect}><MdClose/></Btn>
// 			</Row>
// 		</Col>
// 		);
// 	}
//
//
// 	const list = props.dict ? Object.keys(props.dict).map(key => {
// 		return (
// 			<Box key={key} onClick={() => props.onSelect(key)}>
// 				<Txt>
// 					{props.extract(props.dict[key])}
// 				</Txt>
// 			</Box>
// 		);
// 	}) : <Txt>...</Txt>;
//
//
// 	return (
// 		<Col shrink>
// 			<Row>
// 				<Txt>Select</Txt>
// 			</Row>
// 			<Row>
// 				<TextField
// 					id={props.inputId}
// 					store={props.inputStore}
// 					label={props.inputLabel}
// 				/>
// 			</Row>
// 			<Scroll shrink>
// 				{list}
// 			</Scroll>
// 		</Col>
// 	);
// }
//
// export default observer(FilterDict);