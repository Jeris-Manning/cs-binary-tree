import React from 'react';
import {observer} from 'mobx-react';
import {UpField} from './UpField';
import {action} from 'mobx';
import type {C_UpField} from './UpField';
import thyme, {badDt, isDt} from '../thyme';
import {Upstate} from './Upstate';
import type {ThymeDt} from '../thyme';
import Butt from '../Bricks/Butt';
import {Col, Row} from '../Bricks/bricksShaper';

const DESCRIPTION = [
	'This field is good at parsing times.',
	'You can do things like:',
	'2 --> 2:00 AM',
	'14 --> 2:00 PM',
	'520p --> 5:20 PM',
	'120+ --> 1:20 PM',
	'p OR + can be used for PM',
];

@observer
export class UpFieldTime extends React.Component<C_UpField> {
	
	@action OnBlur = () => {
		const state: Upstate<ThymeDt> = this.props.state;
		const date: ThymeDt = isDt(this.props.date) ? this.props.date : thyme.today();
		const value = state.value;
		
		if (isDt(value)) return;
		
		const parsed = thyme.parseTimeString(value);
		
		if (!parsed) {
			state.Change('');
			return;
		}
		
		const newValue = date.set(parsed);
		state.Change(newValue);
	}
	
	@action Change = (value) => {
		const state: Upstate<ThymeDt> = this.props.state;
		state.Change(value);
	};
	
	@action SetAm = () => {
		const state: Upstate<ThymeDt> = this.props.state;
		if (badDt(state.value)) return;
		
		const newValue = thyme.withAm(state.value);
		state.Change(newValue);
	};
	
	@action SetPm = () => {
		const state: Upstate<ThymeDt> = this.props.state;
		if (badDt(state.value)) return;
		
		const newValue = thyme.withPm(state.value);
		state.Change(newValue);
	};
	
	render() {
		const state: Upstate<ThymeDt> = this.props.state;
		// const isAm = isDt(state.value) && thyme.isAm(state.value);
		const isPm = isDt(state.value) && thyme.isPm(state.value);
		
		return (
			<Row {...this.props.rowProps}>
				<UpField
					onBlur={this.OnBlur}
					fnChange={this.Change}
					description={DESCRIPTION}
					formatter={thyme.nice.time.short}
					center
					size={24}
					inputWidth={160}
					selectOnFocus
					{...this.props}
				/>
				
				<Col
				
				>
					<TimeBtnSmall on={this.SetAm} label={'AM'} highlight={!isPm}/>
					<TimeBtnSmall on={this.SetPm} label={'PM'} highlight={isPm}/>
				</Col>
			</Row>
		);
	}
}

@observer
export class TimeBtnSmall extends React.Component {
	render() {
		const {
			on,
			label,
			highlight,
			b,
		} = this.props;
		
		return (
			<Butt
				on={on}
				label={label}
				primary
				subtle={!highlight}
				mini
				grow
				labelSize={14}
				b={b}
			/>
		);
	}
}