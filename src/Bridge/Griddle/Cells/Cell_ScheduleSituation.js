import React, {Component} from 'react';
import {Col, Row, Txt} from '../../Bricks/bricksShaper';
import {observer} from 'mobx-react';
import {Jewels, Staches} from 'stores/RootStore';
import {Tip} from '../../misc/Tooltip';
import styled from 'styled-components';
import Butt from '../../Bricks/Butt';
import {MdClose} from 'react-icons/md';

const Text = styled.div`
	font-size: .75rem;
`;

@observer
export class Cell_ScheduleSituation extends React.Component {
	render() {
		const row = this.props.row;
		
		const terpBusyId = row.terpBusyId;
		
		if (terpBusyId) {
			const vTerpSched = Jewels().vTerpSched;
			
			return (
				<Row childW marV={4}>
					<Txt b>
						{row.note || row.comment}
					</Txt>
					<Col grow/>
					<Butt
						on={() => vTerpSched.RemoveBusy(terpBusyId)}
						subtle
						mini
						danger
						tooltip={'Remove Busy Time'}
						icon={MdClose}
						iconSize={16}
					/>
				</Row>
			);
		}
		
		
		let text = row.situation;
		
		if (text.length > 50) {
			text = text.substring(0, 50);
			
			return (
				<Tip
					text={this.props.column.card
						? <Txt preLine left>{row.situation}</Txt>
						: row.situation}
				>
					<Col childCenterV>
						<Text>{text}...</Text>
					</Col>
				</Tip>
			);
		}
		
		
		return (
			<Row childCenterV>
				<Text>{text}</Text>
			</Row>
		);
	}
}