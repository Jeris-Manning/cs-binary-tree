import React, {Component} from 'react';
import {Row, Txt} from '../../Bricks/bricksShaper';
import {observer} from 'mobx-react';
import {Jewels, Router, Staches} from 'stores/RootStore';
import Linker from '../../Nav/Linker';

@observer
export default class Cell_CompanyLink extends React.Component {
	render() {
		const props = this.props;
		const row = props.row;
		
		const router = Router();
		
		return (
			<Row fill childCenterV>
				<Linker to={router.routes.company} params={{companyId: row.companyId, tab: 'edit'}}>
					<Txt b={props.column.bold} marR={5}>
						{props.value}
					</Txt>
				</Linker>
			</Row>
		);
	}
}