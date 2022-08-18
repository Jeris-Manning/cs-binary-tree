import React from 'react';
import {Col, Row, Txt} from '../../Bridge/Bricks/bricksShaper';
import {observer} from 'mobx-react';
import {Root, Router} from 'stores/RootStore';
import {NavPage} from '../../Bridge/misc/NavPage';
import {StatusMenu} from './StatusMenu';
import {NavMenu} from './NavMenu';
import {Overlay} from './Overlay';
import FullLoadingScreen from '../../Bridge/misc/FullLoadingScreen';
import LocalLogin from '../../misc/LocalLogin';
import {HUE} from '../../Bridge/HUE';

@observer
export default class AppLayout extends React.Component {
	
	componentDidMount() {
		console.log(`mounted AppPage`);
		
		const needsRedirect = window
			&& window.location
			&& window.location.protocol === 'http:'
			&& !window.location.hostname.includes('localhost')
			&& !window.location.hostname.includes('192.168');
		
		console.log(`Needs redirect: ${needsRedirect}, protocol: ${window.location.protocol}, hostname: ${window.location.hostname}`);
		
		if (needsRedirect) {
			window.location.href = window.location.href.replace(/^http(?!s)/, 'https');
		}
		
		Root().MainMounted();
	}
	
	
	render() {
		const root = Root();
		
		if (!root.isInitialized) {
			return <FullLoadingScreen text={'Initializing'}/>;
		}
		
		if (!root.isConnected) {
			return <FullLoadingScreen text={'Connecting'}/>;
		}
		
		if (root.needsAuth) {
			return (
				<LocalLogin/>
			);
		}
		
		if (!root.isAuthed) {
			return <FullLoadingScreen text={'Authorizing'}/>;
		}
		
		if (!root.areStachesAllPreloaded) {
			return <FullLoadingScreen text={'Preloading'}/>;
		}
		
		return (
			<>
				<Row
					PAGE_ROW
					hue={HUE.pageBg}
				>
					<NavMenu/>
					
					<Col
						CONTENT_COLUMN
						grow
						shrink
					>
						{root.criticalError && (
							<Txt
								hue={HUE.error}
								mar={16}
								size={32}
							>{root.criticalError}</Txt>
						)}
						<CurrentNavPage/>
					</Col>
					
					<StatusMenu/>
				</Row>
				
				<Overlay/>
			</>
		);
	}
}


@observer
class CurrentNavPage extends React.Component {
	render() {
		const router = Router();
		
		return (
			<NavPage nav={router.currentRoute}/>
		);
	}
}