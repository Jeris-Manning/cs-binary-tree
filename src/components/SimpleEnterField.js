import {observer} from 'mobx-react';
import React, {Component} from 'react';
import {observable} from 'mobx';
import Formula from '../Bridge/Bricks/Formula/Formula';
import Fieldula from '../Bridge/Bricks/Formula/Fieldula';
import MiniField from './MiniField';
import Butt from '../Bridge/Bricks/Butt';
import {MdSearch} from 'react-icons/md';
import {Row} from '../Bridge/Bricks/bricksShaper';
import ListPicker from '../Bridge/Bricks/ListPicker';

@observer
export default class SimpleEnterField extends React.Component {
	
	@observable form = new Formula({
		fields: {
			input: new Fieldula({
				// formatter: v => `${v}`.trim(),
			}),
		}
	});
	
	Submit = async () => {
		let value = this.form.fields.input.value;
		
		if (typeof value === 'string') value = value.trim();
		if (this.props.type === 'number') value = parseInt(value);
		
		await this.props.on(value);
		
		if (this.props.clearAfter) this.form.fields.input.Clear();
	};
	
	render() {
		const props = this.props;
		const fields = this.form.fields;
		
		return (
			<Row>
				{props.usePicker ? (
					<ListPicker
						$={fields.input}
						choices={props.choices}
						onEnterKey={this.Submit}
						label={props.label}
						name={props.label}
						description={props.description}
						grow
						w={300}
					/>
				) : (
					<MiniField
						$={fields.input}
						onEnterKey={this.Submit}
						label={props.label}
						name={props.label}
						description={props.description}
						grow
						type={props.type}
						focus={props.focus}
					/>
				)}
				
				<Butt
					on={this.Submit}
					icon={props.icon || MdSearch}
					mini={props.mini}
					disabled={!fields.input.value}
					secondary
					marL={16}
				/>
			</Row>
		);
	}
}