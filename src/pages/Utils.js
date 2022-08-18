import React from 'react';
import {observer} from 'mobx-react';
import {Root, Router} from 'stores/RootStore';
import Butt from '../Bridge/Bricks/Butt';
import {Col, Row} from '../Bridge/Bricks/bricksShaper';

@observer
export class Utils extends React.Component {
	render() {
		const routes = Root().routes;
		
		return (
			<>
				<Row wrap>
					
					{routes.utilNavs.map(route => (
						<UtilLink route={route} key={route.originalPath}/>
					))}
					
				</Row>
			</>
		);
	}
}

@observer
class UtilLink extends React.Component {
	
	render() {
		const router = Router();
		const route = this.props.route;
		
		return (
			<Col w={300} mar={12}>
				<Butt
					on={() => router.Navigate(route)}
					label={route.name}
					icon={route.icon}
					secondary
				/>
			</Col>
		);
	}
}