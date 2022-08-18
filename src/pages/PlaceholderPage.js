import React, {Component} from 'react';
import {Col, Row, Txt} from '../Bridge/Bricks/bricksShaper';
import {observer} from 'mobx-react';
import {Jewels, Staches} from 'stores/RootStore';

@observer
export default class PlaceholderPage extends React.Component {
	
	render() {
		return (
			<Col N grow overflow>
				
				<Row childCenter h={50}>
					<Txt b size={22} marH={20} hue={'#bababa'}>PLACEHOLDER PAGE</Txt>
				</Row>
				
				
				<Row S childCenter h={50}>
					<Txt b size={22} marH={20} hue={'#e0e0e0'}>Very much a work in progress! {'<3'} Trenton</Txt>
				</Row>
			</Col>
		);
	}
}
