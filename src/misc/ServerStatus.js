import {Col, Row, Txt} from '../Bridge/Bricks/bricksShaper';
import React from 'react';
import {observer} from 'mobx-react';
import {Root, RootStore} from 'stores/RootStore';
import {HUE} from '../Bridge/HUE';


@observer
export class ServerStatus extends React.Component {
	render() {
		const root: RootStore = Root();
		
		const ping = root.jeweler.ping;
		const requestCount = root.jeweler.requestCount;
		
		let hue;
		let text;
		
		if (root.isConnected) {
			hue = HUE.connected;
			// text = 'Connected';
			// text = `🔗 ${ping}`;
			// text = `${ping}ms (${requestCount})`;
			text = `${ping}ms`;
		} else {
			// does this ever actually render?
			hue = HUE.disconnected;
			text = 'Disconnected';
		}
		
		if (root.isLocalServer) {
			text += '  🏠';
			// text = 'LH ' + text;
		}
		
		text += ` [${root.clientPortId}]`;
		if (root.isPrime) text += `*`;
		if (root.IS_DEBUG) text += ` debug`;
		
		if (this.props.collapsed) {
			return (
				<Row>
					<Col w={16} h={16} circle hue={hue}/>
				</Row>
			);
		}
		
		return (
			<>
				<Row>
					<Col
						w={16}
						circle
						hue={hue}
						marR={5}
						onClick={() => root.ToggleForceDebug()}
					/>
					
					<Txt
						size={14}
						hue={hue}
					>{text}</Txt>
				</Row>
				
				{!!root.serverSimLag && (
					<Row marT={6}>
						<Txt size={14} hue={hue}>sim lag: {root.serverSimLag}ms</Txt>
					</Row>
				)}
			</>
		);
	}
}