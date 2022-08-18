import {observer} from 'mobx-react';
import React, {Component} from 'react';
import {Col, Txt} from '../Bricks/bricksShaper';
import {HUE} from '../HUE';
import Loading from './Loading';

@observer
export default class FullLoadingScreen extends React.Component {
	
	render() {
		
		return (
			<Col hue={HUE.bgDark} childC fillView>
				<Txt marV={20} hue={'white'}>{this.props.text}</Txt>
				<Loading/>
			</Col>
		);
	}
}