import React from 'react';
import {Row, Txt} from '../../Bricks/bricksShaper';
import {observer} from 'mobx-react';
import {MdContentCopy} from 'react-icons/md';
import Linker from '../../Nav/Linker';
import Butt from '../../Bricks/Butt';
import {Clip} from '../../misc/Clip';


@observer
export class Cell_JobLink extends React.Component {
	render() {
		const props = this.props;
		
		return (
			<Row childCenterV>
				<Linker
					toKey={'job'}
					params={{jobId: props.value, tab: props.column.tab || 'details'}}
			        // params={TO_JOB.withKey(props.column.tab, props.value)}
			        // params2={{jobId: props.value, tab: props.column.tab || 'details'}}
				>
					<Txt b={props.column.bold}>
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

