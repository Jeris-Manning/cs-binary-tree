import React, {Component} from 'react';
import {observer} from 'mobx-react';
import {Col, Row, Txt} from '../../Bridge/Bricks/bricksShaper';
import {Tip} from '../../Bridge/misc/Tooltip';
import thyme from '../../Bridge/thyme';

/**
 * Requires date (luxon DateTime)
 * Optional:
 *      mSize, dSize, ySize (font sizes)
 */
@observer
export default class DateBlock extends React.Component {
	render() {
		const dt = this.props.date;
		
		if (!dt || !dt.isValid) {
			return (
				<Col>
					<Txt size={18}>?</Txt>
				</Col>
			)
		}
		
		const year = dt.year;
		const month = dt.monthShort.toUpperCase();
		const day = dt.day;
		
		return (
			<Col childCenterH>
				<Txt size={this.props.mSize || 18}>{month}</Txt>
				<Txt size={this.props.dSize || 22}>{day}</Txt>
				<Txt size={this.props.ySize || 18}>{year}</Txt>
			</Col>
		)
	}
}

/**
 * Requires start & end (luxon DateTimes)
 * Optional:
 *      mSize, dSize, ySize (font sizes)
 */
@observer
export class DateTimeRangeBlock extends React.Component {
	render() {
		const date = this.props.date;
		const start = this.props.start;
		const end = this.props.end;
		
		if (!date || !date.isValid || !start || !start.isValid || !end || !end.isValid) {
			return (
				<Col>
					<Txt size={18}>?</Txt>
				</Col>
			)
		}
		
		const year = thyme.isThisYear(date) ? '' : date.year;
		const month = date.monthShort.toUpperCase();
		const day = date.day;
		const weekday = date.weekdayLong;
		
		const duration = end.diff(start, ['hours', 'minutes']).toObject();
		let durationText = `${duration.hours} hr`;
		if (duration.minutes) durationText += `${duration.minutes} min`;
		
		
		return (
			<Row childCenterH>
				<Tip text={weekday}>
					<Col childC>
						<Txt size={this.props.mSize || 18}>{month}</Txt>
						<Txt size={this.props.dSize || 22}>{day}</Txt>
						{year && (
							<Txt size={this.props.ySize || 18}>{year}</Txt>
						)}
					</Col>
				</Tip>
				
				<Tip text={durationText}>
					<Col childCenterV childE marL={18}>
						<TimeRow dt={start}/>
						<TimeRow dt={end}/>
					</Col>
				</Tip>
				
				{/*<Butt*/}
				{/*	on={this.props.onEdit}*/}
				{/*	icon={MdEdit}*/}
				{/*	iconHue={'#fff'}*/}
				{/*	subtle*/}
				{/*	mini*/}
				{/*	fillV*/}
				{/*	marL={20}*/}
				{/*/>*/}
			</Row>
		)
	}
}

@observer
class TimeRow extends React.Component {
	render() {
		const dt = this.props.dt;
		
		const hour = dt.toFormat('h');
		const min = dt.toFormat('mm');
		const a = dt.toFormat('a');
		const hueMin = this.props.hueMin || '#656565';
		
		return (
			<Row childCenterV>
				<Txt size={22}>{hour}</Txt>
				<Txt marT={1} size={16} hue={hueMin}>:{min}</Txt>
				<Txt marT={1} size={16} marL={2}>{a}</Txt>
			</Row>
		)
	}
}