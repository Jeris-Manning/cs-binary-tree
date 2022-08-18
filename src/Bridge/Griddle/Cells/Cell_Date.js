import React, {Component} from 'react';
import {Row, Txt} from '../../Bricks/bricksShaper';
import {observer} from 'mobx-react';
import thyme from '../../thyme';
import {Tip} from '../../misc/Tooltip';
import {isFunc} from '../../misc/$j';


@observer
export default class Cell_Date extends React.Component {
	render() {
		const props = this.props;
		
		if (!props.value) return <Text text={'???'}/>
		
		// const date = props.value;
		// TODO: clean up
		const date = props.value.isValid
			? props.value
			: thyme.fromFastJson(props.value);
		
		// if (!date.isValid) {
		// 	return (
		// 		<Row>
		// 			<Txt hue={'#a30815'}>
		// 				{date.original} -> {date.invalidExplanation} {date.invalidReason}
		// 			</Txt>
		// 		</Row>
		// 	)
		// }
		
		const valueAbove = isFunc(props.valueAbove) ? props.valueAbove() : null;
		
		if (valueAbove && thyme.isSameDay(date, valueAbove) && !props.column.alwaysShow) {
			return <Row/>;
		}
		
		const isToday = thyme.isToday(date);
		
		let textProps = {};
		
		// textProps.text = props.column.dateFormat
		// 	? date.toFormat(props.column.dateFormat)
		// 	: date.toFormat('MMM d');
		textProps.text = props.column.dateFormat ? date.toFormat(props.column.dateFormat) : thyme.nice.date.brief(date);
		textProps.b = props.column.b;
		textProps.underline = isToday && !props.lineThrough;
		textProps.lineThrough = props.lineThrough;
		textProps.hue = props.hue;
		
		// const tooltip = props.tooltip || (isToday && 'Today!');
		const tooltip = props.tooltip || thyme.nice.date.short(date);
		
		
		if (tooltip) {
			return (
				<Tip text={tooltip}>
					<Text {...textProps}/>
				</Tip>
			)
		}
		
		return (
			<Text {...textProps}/>
		);
	}
}


@observer class Text extends React.Component {
	render() {
		const props = this.props;
		
		return (
			<Row
				// fill
				childC
			>
				<Txt
					hue={props.hue}
					b={props.b}
					underline={props.underline}
					lineThrough={props.lineThrough}
				>{props.text}</Txt>
			</Row>
		)
	}
}