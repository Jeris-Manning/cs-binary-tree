import React from 'react';
import {observer} from 'mobx-react';
import Butt from '../Bridge/Bricks/Butt';
import {is} from '../Bridge/misc/$j';

@observer
export class ButtCopy extends React.Component {
	
	Copy = () => {
		const text = is.func(this.props.text)
			? this.props.text()
			: this.props.text;
		
		
		return navigator.clipboard.writeText(text);
	};
	
	render() {
		return (
			<Butt
				alert={'Copied'}
				on={this.Copy}
				{...this.props}
			/>
		);
	}
}