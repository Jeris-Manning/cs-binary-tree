import React, {Component} from 'react';
import {Col, Row} from '../../Bricks/bricksShaper';
import {observer} from 'mobx-react';
import {Jewels, Staches} from 'stores/RootStore';
import styled from 'styled-components';


const Text = styled.div`
	font-size: .75rem;
`;

@observer
export default class Cell_DeafNames extends React.Component {
	render() {
		const value = this.props.value;
		
		const deafs = Array.isArray(value)
			? value
			: (value ? Object.values(value) : []);
		
		const names = deafs.map(deaf => (
			<Text key={deaf.deafId}>{deaf.firstName} {deaf.lastName}</Text>
		));
		
		return (
			<Row fill childCenterV>
				<Col>
					{names.length ? (
						names
					) : (
						<Text>?</Text>
					)}
				</Col>
			</Row>
		);
	}
}