import React from 'react';
import {Col, Txt} from '../Bricks/bricksShaper';
import Select, {components} from 'react-select';
import {action, computed} from 'mobx';
import {observer} from 'mobx-react';
import {HUE} from '../HUE';

/* TLDR:
	- state: upstate or similar
	- choices: array of {key, label, color}, can be on state
	- Change: can be on state

 */

export type SelectorKey = string;

export type SelectorState = {
	value: SelectorChoice,
	Change?: (SelectorChoice) => {},
	choices?: SelectorChoice[],
	
	hasChanged?: boolean,
	error?: string,
}

export type SelectorChoice = {
	key: SelectorKey,
	label: string,
	color?: string,
}

export type C_SelectorField = {
	state: SelectorState,
	Change?: (SelectorChoice|any, SelectorChoice) => {}, // override
	choices?: SelectorChoice[], // override
	saveAsKey?: boolean, // Change to key (instead of SelectorChoice)
	saveAs?: string, // save as arbitrary key inside choice (this sucks)
	
	filter?: (SelectorChoice) => boolean,
	FindChoice?: (any) => SelectorChoice, // for dumb
	
	label?: string,
	placeholder?: string,
	enabled?: boolean,
	disabled?: boolean,
	
	isClearable?: boolean,
	multiple?: boolean,
	
	size?: number,
	// error: string,
	hideOutline?: boolean,
	selectorStyle?: {},
	
	// tabi,
}

// TODO: find something (or upgrade?) react-select cuz it's bad

@observer
export class SelectorField extends React.Component<C_SelectorField> {
	
	static IdLabelObjToChoices(obj): SelectorChoice[] {
		return Object.entries(obj).map(([key, label]) => ({key: String(key), label: label}));
	}
	
	static LabelArrayToChoices(arr): SelectorChoice[] {
		return arr.map(label => ({
			key: label,
			label: label,
		}));
	}
	
	static ObjToChoices(obj): SelectorChoice[] {
		return Object.entries(obj).map(([key, choice]) => ({key: String(key), ...choice}));
	}
	
	@computed get outline() {
		if (this.props.hideOutline) return undefined;
		
		if (this.props.state.error)
			return HUE.outline.invalid;
		
		if (this.props.state.hasChanged)
			return HUE.outline.canSave;
		
		return undefined;
	}
	
	@computed get styles() {
		const size = this.props.size || 18;
		const selectorStyle = this.props.selectorStyle || {};
		
		return {
			control: (baseStyle) => ({
				...baseStyle,
				height: '100%',
				...selectorStyle.control,
			}),
			container: (baseStyle) => ({
				...baseStyle,
				height: '100%',
				...selectorStyle.container,
			}),
			valueContainer: (baseStyle) => ({
				...baseStyle,
				padding: 10,
				fontSize: size,
				backgroundColor: '#f7f8fb',
				height: '100%', // props.h,
				...selectorStyle.valueContainer,
			}),
			indicatorsContainer: (baseStyle) => ({
				...baseStyle,
				height: '100%',
				...selectorStyle.indicatorsContainer,
			}),
			option: (baseStyle, {data}) => ({
				...baseStyle,
				color: data.color,
				...selectorStyle.option,
			}),
			singleValue: (baseStyle, {data}) => ({
				...baseStyle,
				color: data.color,
				...selectorStyle.singleValue,
			}),
		};
	}
	
	render() {
		const {
			label,
			selectorStyle,
		}: C_SelectorField = this.props;
		
		// console.log(`SelectorField render ${this.props.placeholder}`);
		
		return (
			<Col
				outline={this.outline}
				{...this.props}
			>
				{label && (
					<Txt b marB={8}>{label}</Txt>
				)}
				
				<SelectWrapper
					{...this.props}
					styles={this.styles}
					theme={DEFAULT_THEME}
				/>
			
			</Col>
		);
	}
}

@observer
class SelectWrapper extends React.Component<C_SelectorField> {
	
	@computed get isEnabled(): boolean {
		const {enabled, disabled} = this.props;
		if (disabled) return false;
		if (enabled !== undefined && !enabled) return false;
		return true;
	}
	
	@computed get allChoices(): SelectorChoice[] {
		return this.props.choices
			|| this.props.state.choices
			|| [];
	}
	
	@computed get availableChoices(): SelectorChoice[] {
		if (this.props.filter) return this.allChoices.filter(this.props.filter);
		return this.allChoices;
	}
	
	@computed get value(): SelectorChoice|SelectorChoice[] {
		let val = this.props.state.value;
		
		if (!val) return null; // no value
		
		if (this.props.multiple) {
			if (!Array.isArray(val))
				throw new Error(`SelectorField with 'multiple' must be array`);
			
			return val; // SelectorChoice[]
		}
		
		if (val.key) return val; // is (likely) SelectorChoice
		
		
		/* do smart convert */
		val = String(val);
		// is not SelectorChoice, assume it's a key and try to find SelectorChoice
		
		if (this.props.FindChoice) return this.props.FindChoice(this.allChoices, val);
		
		return this.allChoices
			.find(choice => choice.key === val);
	}
	
	@action Change = (chosen: SelectorChoice) => {
		const {
			Change, // override
			state,
			saveAsKey,
			saveAs,
		} = this.props;
		
		console.log(`SelectorField | chosen: ${chosen.key} ${chosen.label}`, chosen);
		
		let newVal = chosen;
		
		if (saveAsKey) newVal = chosen.key;
		else if (saveAs) newVal = chosen[saveAs];
		
		if (Change) return Change(newVal, chosen);
		return state.Change(newVal);
	};
	
	render() {
		const {
			placeholder,
			isClearable,
			multiple,
			
			styles,
			theme,
		}: C_SelectorField = this.props;
		
		const choices = this.availableChoices;
		
		if (!choices || !choices.length) {
			return <></>;
		}
		
		// console.log(`SelectWrapper render choices: ${choices.map(c => c.key).join(', ')}`);
		
		return (
			<Select
				options={choices}
				value={this.value}
				onChange={this.Change}
				getOptionValue={v => v.key}
				
				error={'test error'}
				
				disabled={!this.isEnabled}
				
				placeholder={placeholder}
				isClearable={isClearable}
				isMulti={multiple}
				
				components={{
					Input
				}}
				
				styles={styles}
				theme={theme}
			/>
		);
	}
}

const DEFAULT_THEME = theme => ({
	...theme,
	borderRadius: 0,
	colors: {
		...theme.colors,
		backgroundColor: '#f7f8fb',
		primary: '#269db5',
		primary2: '#269db5',
	}
});

@observer
class Input extends React.Component {
	render() {
		return (
			<components.Input
				{...this.props}
				autoComplete={'chrome-off'}
			/>
		);
	}
}




// NOTE on sorting: should sort on server if possible
// or implement a debounce for sorting
// currently it will sort many times as the choices load

// const choices = this.props.choices
// 	|| this.props.state.choices
// 	|| [];
//
// return this.props.sorter
// 	? choices.sort(this.props.sorter)
// 	: choices;