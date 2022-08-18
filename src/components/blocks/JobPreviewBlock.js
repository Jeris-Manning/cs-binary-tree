import React, {Component} from 'react';
import {observer} from 'mobx-react';
import {Col, Row, Txt} from '../../Bridge/Bricks/bricksShaper';
import {Tip} from '../../Bridge/misc/Tooltip';

@observer
export default class JobPreviewBlock extends React.Component {
	render() {
		
		return (
			<Row childCenterH hue={this.props.hue || '#eaeaea'} padV={6} padH={6}>
				<Col childC>
					<Row marB={6}>
						<Txt size={18}>340229</Txt>
					</Row>
					<Txt size={12} hue={'#599e4a'} b>FILLED</Txt>
				</Col>
				
				<Tip text={'Tuesday: in 6 days'}>
					<Col childC marL={12}>
						<Txt size={18}>Feb</Txt>
						<Txt size={22}>26</Txt>
					</Col>
				</Tip>
				
				<Tip text={'5 hours'}>
					<Col childC marL={12}>
						<TestTimeRow hour={'6'}/>
						<TestTimeRow hour={'11'}/>
					</Col>
				</Tip>
				<Tip text={'Company: Good Samaritan Society-Heritage Square'}>
					<Col childC marL={12} w={80}>
						<Txt size={12}>Good Samaritan Society...</Txt>
					</Col>
				</Tip>
				<Tip text={'Deaf: Fred Johnson, James Holden, Naomi Nagata. Situation: Blah blah blah blah blah.'}>
					<Col childC marL={12} w={80}>
						<Txt size={12}>Fred Johnso...</Txt>
						<Txt size={16}>+2</Txt>
					</Col>
				</Tip>
				<Tip text={'Interpreter: Persona Reallylongnamea'}>
					<Col childC marL={12} w={80}>
						<Txt size={12}>Terp: Persona Reallylo...</Txt>
					</Col>
				</Tip>
				<Tip text={`McDonald's 551 West Jefferson Ave St. Paul, MN 55102`}>
					<Col childC marL={12} w={80}>
						<Txt size={16}>St. Paul</Txt>
						<Txt size={12}>McDonald...</Txt>
					</Col>
				</Tip>
				<Tip text={`Jason yesterday at 10:32am`}>
					<Col childC marL={12} w={80}>
						<Txt size={12}>Yesterday</Txt>
						<Txt size={16}>Jason</Txt>
					</Col>
				</Tip>
			</Row>
		)
	}
}


@observer
class TestTimeRow extends React.Component {
	render() {
		const hueMin = this.props.hueMin || '#656565';
		
		return (
			<Row childCenterV>
				<Txt size={22}>{this.props.hour}</Txt>
				<Txt marT={1} size={16} hue={hueMin}>:00</Txt>
				<Txt marT={1} size={16} marL={2}>AM</Txt>
			</Row>
		)
	}
}