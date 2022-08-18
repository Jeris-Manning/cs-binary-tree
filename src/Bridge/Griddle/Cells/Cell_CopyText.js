import React, {Component} from 'react';
import {Row, Txt} from '../../Bricks/bricksShaper';
import {observer} from 'mobx-react';
import {MdContentCopy} from 'react-icons/md';
import Linker from '../../Nav/Linker';
import Butt from '../../Bricks/Butt';
import {Clip} from '../../misc/Clip';

@observer
export default class Cell_CopyText extends React.Component {
	render() {
		const props = this.props;
		
		return (
			<Row fill childCenterV>
				
				<Clip copy={props.value}>
					<Butt
						icon={MdContentCopy}
						iconSize={14}
						iconHue={'#6a6a6a'}
						subtle
						mini
						marR={5}
						tabi={-1}
					/>
				</Clip>
				
				{typeof props.column.link === 'function' && (
					<Linker to={props.column.link(props.value)} style={{textDecoration: 'none'}}>
						<Txt b={props.column.bold}>
							{props.value}
						</Txt>
					</Linker>
				
				) || (
					<Txt b={props.column.bold}>
						{props.value}
					</Txt>
				)}
			</Row>
		);
	}
}