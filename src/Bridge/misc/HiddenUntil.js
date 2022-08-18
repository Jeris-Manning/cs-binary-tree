import React from 'react';
import {observer} from 'mobx-react';
import {action, observable} from 'mobx';
import Butt from '../Bricks/Butt';

@observer
export class HiddenUntil extends React.Component {
	
	@observable isShown = false;
	@action Show = () => this.isShown = true;
	@action Hide = () => this.isShown = false;
	
	render() {
		
		if (this.isShown) {
			return (
				<>
					{this.props.children}
				</>
			)
		}
		
		return (
			<Butt
				on={this.Show}
				{...this.props}
			/>
		)
	}
}