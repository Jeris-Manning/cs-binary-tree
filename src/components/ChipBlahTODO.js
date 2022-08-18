// import {observer} from 'mobx-react';
// import React, {Component} from 'react';
// import styled from 'styled-components';
// import {Col} from '../Bridge/Bricks/bricksShaper';
// import {IoMdCloseCircle} from 'react-icons/io';
// import {Chip as MatUiChip} from '@material-ui/core';
//
// // icon, text, deleteButton
// // hues, size
//
// const Container = styled.div`
// 	border-radius: 360px;
// 	background: #c6c6c6;
// `;
//
// const Label = styled.div`
//     font-size: ${p => p.labelSize || '1.25rem'};
// 	color: #000000;
// `;
//
// const Delete = styled.button`
//     border: none;
//
//     width: 20px;
//     height: 20px;
// `;
//
// @observer
// export default class ChipBlahTODO extends React.Component {
//
// 	OnDelete = () => {
// 		console.log(`test test test`);
// 	};
//
// 	render() {
// 		return (
// 			<Col {...this.props}>
// 				<MatUiChip
// 					size={'small'}
// 					onDelete={this.OnDelete}
// 					label={this.props.label}
// 				/>
// 			</Col>
// 		);
//
//
// 		const {
// 			onDelete,
// 			icon, // TODO
// 			label,
// 		} = this.props;
//
// 		const Icon = IoMdCloseCircle;
//
// 		return (
// 			<Col {...this.props}>
// 				<Container>
//
//
// 					<Icon
// 						size={'.7rem'}
// 						color={'#898989'}
// 						onClick={this.OnDelete}
// 					/>
//
// 				</Container>
//
// 			</Col>
// 		);
// 	}
// }