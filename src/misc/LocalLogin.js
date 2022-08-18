import React, {Component} from 'react';
import {observer} from 'mobx-react';
import {Jewels, Root, Staches} from 'stores/RootStore';
import {Col, Txt} from '../Bridge/Bricks/bricksShaper';
import {computed, observable} from 'mobx';
import Formula from '../Bridge/Bricks/Formula/Formula';
import Fieldula from '../Bridge/Bricks/Formula/Fieldula';
import MiniField from '../components/MiniField';
import Butt from '../Bridge/Bricks/Butt';

@observer
export default class LocalLogin extends React.Component {
	
	@observable form = new Formula({
		fields: {
			username: new Fieldula({
				label: 'Username',
				required: true,
			}),
			password: new Fieldula({
				label: 'Password',
				required: true,
				type: 'password',
			}),
		}
	});
	
	@computed get canSubmit() {
		return this.form.fields.username.value && this.form.fields.password.value;
	}
	
	render() {
		const root = Root();
		const fields = this.form.fields;
		
		return (
			<Col childC grow fillView>
				
				<MiniField $={fields.username}/>
				<MiniField $={fields.password}/>
				
				<Txt hue={'#b40015'} marV={8}>{root.authError}</Txt>
				
				<Butt
					on={() => root.SendAuth(
						fields.username.value,
						fields.password.value,
					)}
					label={'Login'}
					primary
					loading={root.isAuthing}
					disabled={!this.canSubmit}
				/>
			</Col>
		);
	}
}