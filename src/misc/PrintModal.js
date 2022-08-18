import React, {Component} from 'react';
import {observer} from 'mobx-react';
import Modal from 'react-modal';
import {Col, Row} from '../Bridge/Bricks/bricksShaper';
import ReactToPrint from 'react-to-print';
import Butt from '../Bridge/Bricks/Butt';
import {MdPrint} from 'react-icons/md';

/**
 * isOpen
 * onClose
 * blocker
 */
@observer
export class PrintModal extends React.Component {
	
	innerRef;
	
	render() {
		const {
			isOpen,
			onClose,
			w,
			children,
			onPrint,
		} = this.props;
		
		let style = {
			overlay: overlay,
			content: contentDefault
		};
		
		return (
			<Modal
				isOpen={isOpen}
				onRequestClose={onClose}
				style={style}
			>
				<ReactToPrint
					trigger={() => (
						<Row
							childC
							marT={16}
							padB={16}
							borB={1}
						>
							<Butt
								icon={MdPrint}
								label={'Print'}
								secondary
								w={200}
								h={60}
								noHoliday
							/>
						</Row>
					)}
					content={() => this.innerRef}
					onAfterPrint={onPrint}
				/>
				
				{/*/>*/}
				
				<Col
					ref={r => this.innerRef = r}
					w={w}
				>
					{children}
				</Col>
			</Modal>
		);
		
	}
}



const overlay = {
	zIndex: 20,
	backgroundColor: '#00000054',
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
