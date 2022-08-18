import React from 'react';
import {Row, Txt} from '../../Bricks/bricksShaper';
import {observer} from 'mobx-react';
import {Router} from 'stores/RootStore';
import {MdContentCopy} from 'react-icons/md';
import Linker from '../../Nav/Linker';
import Butt from '../../Bricks/Butt';
import {Clip} from '../../misc/Clip';

@observer
export default class Cell_JobLink_DEP extends React.Component {
	render() {
		const props = this.props;
		
		const router = Router();
		
		return (
			<Row fill childCenterV>
				<Linker to={router.routes.job} params={{jobId: props.value, tab: props.column.tab || 'details'}}>
					<Txt b={props.column.bold} marR={5}>
						{props.value}
					</Txt>
				</Linker>
				
				<Clip copy={props.value}>
					<Butt
						icon={MdContentCopy}
						iconSize={14}
						iconHue={'#6a6a6a'}
						subtle
						mini
						marR={5}
					/>
				</Clip>
			</Row>
		);
	}
}