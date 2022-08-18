import React from 'react';

/**
 * func = () => {}
 */
export default class CallOnMount extends React.Component {
	
	componentDidMount() {
		let func = () => '';
		
		if (typeof this.props.func === 'function') func = this.props.func;
		if (typeof this.props.on === 'function') func = this.props.on;
		if (typeof this.props.onMount === 'function') func = this.props.onMount;
		
		// console.log(`-- CallOnMount Test: calling on mount func`);
		func();
	}
	
	render() {
		return null;
	}
}