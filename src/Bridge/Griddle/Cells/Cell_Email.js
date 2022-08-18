import React from 'react';
import {observer} from 'mobx-react';
import {Col, Row, Txt} from '../../Bricks/bricksShaper';
import {MdContentCopy, MdEmail} from 'react-icons/md';
import Butt from '../../Bricks/Butt';
import {Clip} from '../../misc/Clip';


@observer
export class Cell_Email extends React.Component {
	render() {
		const {value} = this.props;
		
		if (!value) return <Col/>;
		
		return (
			<Row childC>
				
				<a href={`mailto:${value}`} target={'_blank'}>
					<Butt
						icon={MdEmail}
						iconSize={16}
						iconHue={'#6a6a6a'}
						subtle
						mini
						primary
						marR={6}
					/>
				</a>
				
				<Clip copy={value}>
					<Butt
						icon={MdContentCopy}
						iconSize={14}
						iconHue={'#6a6a6a'}
						subtle
						mini
						marR={6}
					/>
				</Clip>
				
				<Txt>
					{value}
				</Txt>
			</Row>
		);
	}
}

// <a href={`mailto:${value}`} target={'_blank'}>
