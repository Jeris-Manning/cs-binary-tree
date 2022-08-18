import {observer} from 'mobx-react';
import React, {Component} from 'react';
import {action, observable} from 'mobx';
import Formula from '../Bridge/Bricks/Formula/Formula';
import Fieldula from '../Bridge/Bricks/Formula/Fieldula';
import {Row} from '../Bridge/Bricks/bricksShaper';
import ListPicker from '../Bridge/Bricks/ListPicker';
import Butt from '../Bridge/Bricks/Butt';
import Chip from '@material-ui/core/Chip';

@observer
export class ChoiceFilter extends React.Component {
	@observable form = new Formula({
		fields: {
			input: new Fieldula({
			}),
		}
	});
	
	@observable showInput = false;
	
	@action Begin = () => this.showInput = true;
	
	@action Add = (filter) => {
		this.form.fields.input.Clear();
		this.props.onAdd(filter);
		this.showInput = false;
	};
	
	@action Remove = (filter) => {
		this.props.onRemove(filter);
	};
	
	render() {
		const {
			chosen,
			choices,
			onAdd,
			onRemove,
			onClear,
			icon,
			label,
		} = this.props;
		
		return (
			
			<Row wrap shrink childCenterV marR={16}>
				{this.showInput ? (
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
				
				{chosen.map(filter => (
					<Chip
						key={filter.id}
						onDelete={() => this.Remove(filter)}
						label={filter.label}
						size={'small'}
						// icon={icon}
					/>
				))}
			</Row>
		);
	}
}