import {observer} from 'mobx-react';
import React from 'react';
import thyme from '../../thyme';
import {Col, Row, Txt} from '../../Bricks/bricksShaper';
import {Tip} from '../../misc/Tooltip';

@observer
export class Cell_TimeStartEnd extends React.Component {
	render() {
		const start = this.props.row.start;
		const end = this.props.row.end;
		
		if (this.props.column.horizontal) {
			return (
				<Row fill childC>
					<Row childCenterV minWidth={80}>
						<Time time={start}/>
					</Row>
					
					<Col w={30}/>
					
					<Row childCenterV minWidth={80}>
						<Time time={end} hue={'#828282'}/>
					</Row>
				</Row>
			)
		}
		
		return (
			<Col fill childC>
				<Row childCenterV>
					<Time time={start}/>
				</Row>
				<Row childCenterV>
					<Time time={end} hue={'#828282'}/>
				</Row>
			</Col>
		);
	}
}

class Time extends React.Component {
	render() {
		const {
			time,
			hue,
		} = this.props;
		
		if (!time) return <Txt>?</Txt>;
		
		const dt = time.isValid ? time : thyme.fromFastJson(time);
		
		return (
			<>
				<Txt hue={hue} size={'1.2rem'}>{dt.toFormat('h')}</Txt>
				<Txt hue={hue || '#656565'} size={'1rem'} marB={1}>:{dt.toFormat('mm')}</Txt>
				<Txt hue={hue} size={'1rem'} marB={1} marL={2}>{dt.toFormat('a')}</Txt>
			</>
		);
	}
}

@observer
export class Cell_TimeStartEndSmall extends React.Component {
	render() {
		const start = this.props.row.start;
		const end = this.props.row.end;
		const durationWarning = this.props.column.durationWarning;
		let hue;
		let tooltip = '';
		
		if (durationWarning) {
			const minutes = end.diff(start, 'minutes').toObject().minutes;
			if (minutes >= durationWarning.minutes) {
				hue = durationWarning.hue;
				tooltip = durationWarning.tooltip;
			}
		}
		
		return (
			<Tip text={tooltip}>
				<Col fill childC hue={hue}>
					<Row childCenterV>
						<TimeSmall time={start} size={16}/>
					</Row>
					<Row childCenterV>
						<TimeSmall time={end} hue={'#828282'} size={12}/>
					</Row>
				</Col>
			</Tip>
		);
	}
}

class TimeSmall extends React.Component {
	render() {
		const {
			time,
			hue,
			size,
		} = this.props;
		
		if (!time) return <Txt>?</Txt>;
		
		const dt = time.isValid ? time : thyme.fromFastJson(time);
		
		return (
			<>
				<Txt hue={hue} size={size}>{dt.toFormat('h')}</Txt>
				<Txt hue={hue || '#656565'} size={size * .8} marB={1}>:{dt.toFormat('mm')}</Txt>
				<Txt hue={hue} size={size * .8} marB={1} marL={2}>{dt.toFormat('a')}</Txt>
			</>
		);
	}
}