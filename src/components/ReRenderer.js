import React from 'react';
import {action, observable} from 'mobx';
import {observer} from 'mobx-react';


export type C_ReRenderer = {
	// default 10 000 (10 seconds)
	ms: number,
}

@observer
export class ReRenderer extends React.Component<C_ReRenderer> {
	
	interval;
	
	componentDidMount() {
		this.interval = setInterval(
			this.Trigger,
			this.props.ms || 10000
		);
	}
	
	componentWillUnmount() {
		clearInterval(this.interval);
	}
	
	@observable counter = 0;
	@action Trigger = () => this.counter += 1;
	
	render() {
		if (this.counter < 0) return <></>; // never true but triggers rerender
		
		return (
			<>
				{this.props.children}
			</>
		);
	}
}