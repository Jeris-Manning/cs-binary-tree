import {observer} from 'mobx-react';
import {Jewels, Root, Staches} from 'stores/RootStore';
import React, {Component} from 'react';
import {Col} from '../Bridge/Bricks/bricksShaper';

@observer
export default class Login extends React.Component {
	
	componentDidMount() {
		Root().auth.LoginScreenMount();
	}
	
	componentWillUnmount() {
		Root().auth.LoginScreenUnmount();
	}
	
	render() {
		
		const bg = 'radial-gradient(#40404b, #111118) rgba(34,34,40,0.94)';
		
		return (
			<Col bg={bg} childC grow fillView>
				
				<Col h={400} >
					<div id='auth' className="lock"/>
				</Col>
			</Col>
		);
	}
}