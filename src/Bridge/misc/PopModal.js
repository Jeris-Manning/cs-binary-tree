import React from 'react';
import {observer} from 'mobx-react';
import Modal from 'react-modal';

function PopModal(props) {
	
	let style = {
		overlay: overlay,
		content: contentDefault
	};
	
	if (props.leftSide) style.content = leftSide;
	
	return (
		
		<Modal
			isOpen={props.isOpen}
			onRequestClose={props.onClose || props.onRequestClose}
			shouldCloseOnOverlayClick={!props.blocker}
			style={style}
		>
			{props.children}
		</Modal>
	);
}

/**
 *
 * isOpen
 * onRequestClose
 * shouldCloseOnOverlayClick
 * children
 * @returns {*}
 * @constructor
 */
export default observer(PopModal);

const overlay = {
	zIndex: 5,
};

const contentDefault = {
	top: '50%',
	left: '50%',
	right: 'auto',
	bottom: 'auto',
	marginRight: '-50%',
	transform: 'translate(-50%, -50%)',
	overflow: 'hidden',
	padding: 0,
	maxHeight: '100vh',
	overflowY: 'auto',
};

const leftSide = {
	top: '0',
	left: '0',
	right: 'auto',
	bottom: 'auto',
	// marginRight: '-50%',
	// transform: 'translate(0, -50%)',
	overflow: 'hidden',
	padding: 0,
	maxHeight: '100vh',
	overflowY: 'auto',
	border: '',
};
