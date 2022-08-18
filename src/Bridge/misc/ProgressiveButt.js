import React from 'react';
import {observer} from 'mobx-react';
import Butt from '../Bricks/Butt';
import {ProgressiveLoader} from './Loader';
import {$m} from './$m';

@observer
export class ProgressiveButt extends React.Component {
	render() {
		const loader: ProgressiveLoader = this.props.loader;
		
		const label = loader.isLoading
			? `${loader.percent100}% ${loader.stageName}`
			: this.props.label;
		
		return (
			<Butt
				{...this.props}
				disabled={loader.isLoading}
				label={label}
				hideLoading
			/>
		);
	}
}