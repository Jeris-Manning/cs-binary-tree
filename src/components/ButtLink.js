import React, {Component} from 'react';
import Linker from '../Bridge/Nav/Linker';
import {observer} from 'mobx-react';
import {Jewels, Staches} from 'stores/RootStore';
import Butt from '../Bridge/Bricks/Butt';


@observer
export default class ButtLink extends React.Component {
	render() {
		if (this.props.on) console.warn(`ButtLink doesn't use 'on' function`);
		
		if (this.props.a) {
			return (
				<a
					href={this.props.a}
					target={'_blank'}
					style={{
						color: 'inherit',
						textDecoration: 'none'
					}}
				>
					<Butt
						{...this.props}
						on={() => ({})}
					/>
				</a>
			)
		}
		
		return (
			<Linker
				to={this.props.route}
				toKey={this.props.toKey}
				params={this.props.params}
			>
				<Butt
					{...this.props}
					on={() => ({})}
				/>
			</Linker>
		);
	}
}