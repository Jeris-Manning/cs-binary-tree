import React from 'react';



type DeferType = {
	wait: number,
}

/** wait: how many frames to wait (generally browser runs at 60 FPS) */
export default class Defer extends React.PureComponent<DeferType> {
	
	state = {
		shouldRender: false,
	};
	
	componentDidMount() {
		this.wait(this.props.wait);
	}
	
	stop = false;
	
	componentWillUnmount() {
		this.stop = true;
	}
	
	wait = (toWait) => {
		if (this.stop) return;
		
		if (!toWait) {
			this.setState({shouldRender: true});
			return;
		}
		
		// let wait = toWait;
		
		window.requestAnimationFrame(() => {
			--toWait;
			this.wait(toWait);
		});
	};
	
	render() {
		if (!this.state.shouldRender) return null;
		return this.props.children;
	}
}