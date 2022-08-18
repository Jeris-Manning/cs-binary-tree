import {observer} from 'mobx-react';
import React, {Component} from 'react';
import {action, observable} from 'mobx';
import Formula from '../Bridge/Bricks/Formula/Formula';
import Fieldula from '../Bridge/Bricks/Formula/Fieldula';
import {Row} from '../Bridge/Bricks/bricksShaper';
import ListPicker from '../Bridge/Bricks/ListPicker';
import Butt from '../Bridge/Bricks/Butt';

@observer
export class ChipList extends React.Component {
	@observable form = new Formula({
		fields: {
			input: new Fieldula({}),
		}
	});
	
	@observable showInput = false;
	
	@action Begin = () => this.showInput = true;
	
	@action Add = (thing) => {
		this.form.fields.input.Clear();
		this.props.onAdd(thing);
		this.showInput = false;
	};
	
	@action Remove = (thing) => {
		this.props.onRemove(thing);
	};
	
	render() {
		const {
			chosen,
			choices,
			chipBuilder,
			onAdd,
			onRemove,
			icon,
			label,
			collapse,
		} = this.props;
		
		return (
			
			<Row
				wrap
				shrink
				childCenterV
				marR={16}
			>
				{this.showInput || !collapse ? (
					<ListPicker
						$={this.form.fields.input}
						choices={choices}
						onSelect={this.Add}
						label={label}
						placeholder={label}
						name={label}
						w={300}
					/>
				) : (
					<Butt
						on={this.Begin}
						icon={icon}
						// label={`+`}
						mini
						subtle
						primary
						tooltip={label}
					/>
				)}
				
				{chosen.map(chipBuilder)}
			</Row>
		);
	}
}