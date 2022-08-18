import React, {Component} from 'react';
import {Col, Row, Txt} from '../../Bricks/bricksShaper';
import {observer} from 'mobx-react';
import {Tip} from '../../misc/Tooltip';
import styled from 'styled-components';

const Text = styled.div`
	font-size: .75rem;
`;

@observer
export default class Cell_TextTrunc extends React.Component {
	render() {
		const original = this.props.value;
		let text = this.props.value;
		
		if (text && text[0] === '#') {
			return <Row childW marV={4}><Txt b>{text.substring(1)}</Txt></Row>;
		}
		
		
		if (text.length > 50) {
			text = text.substring(0, 50);
			
			return (
				<Tip
					text={this.props.column.card
						? <Txt preLine left>{original}</Txt>
						: original}
				>
					<Col fill childCenterV>
						<Text>{text}...</Text>
					</Col>
				</Tip>
			)
		}
		
		
		
		return (
			<Row fill childCenterV>
				<Text>{text}</Text>
			</Row>
		)
	}
}