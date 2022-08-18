import {disposeOnUnmount, Observer, observer} from 'mobx-react';
import React from 'react';
import {autorun, computed, observable} from 'mobx';
import {Col, Txt} from '../Bricks/bricksShaper';
import Select, {components} from 'react-select';
import {is} from './$j';

const Input = ({autoComplete, ...props}) => <components.Input {...props} autoComplete={'chrome-off'}/>;

// TODO: this could use a rewrite, maybe split up, get rid of autorun
// TODO: why does highlighting cause full list to rerender?
// what a mess

/** use SelectorField */
@observer
export class UpFieldSelect_DEPRECATED extends React.Component {
	
	constructor(props) {
		super(props);
		this.inputRef = React.createRef();
	}
	
	componentDidMount() {
		if (this.props.focus) {
			this.inputRef.current.focus();
		}
	}
	
	@observable choiceObj = {};
	
	@disposeOnUnmount
	runChoiceObj = autorun(() => {
		const {
			choices,
			filter,
			choiceLabelKey,
			choiceColorer,
			keyer,
		} = this.props;
		
		if (!choices) {
			this.choiceObj = {};
			return;
		}
		
		// MARK.autorun(this, `choiceObj ${this.props.state ? this.props.state.key : this.props.placeholder || '?'}`);
		
		let choiceObj = {};
		
		if (Array.isArray(choices)) {
			
			
			// console.log(`autorun runChoiceObj, choice array:`, choices);
			
			for (const choice of choices) {
				if (filter && !filter(choice)) continue;
				const key = choice.key || choice[keyer];
				
				if (!key) throw new Error(`UpFieldSelect requires keyer (or .key) if choices is an array`);
				
				choiceObj[key] = {
					value: key,
					label: typeof choice === 'string'
						? choice
						: choice[choiceLabelKey || 'label'] || key,
					color: choiceColorer
						? choiceColorer(choice)
						: undefined,
					data: choice,
				};
			}
			
		} else {
			
			Object.keys(choices).forEach(key => {
				
				if (!filter || filter(choices[key])) {
					const choice = choices[key];
					
					choiceObj[key] = {
						value: key,
						label: typeof choice === 'string'
							? choice
							: choice[choiceLabelKey || 'label'] || key,
						color: choiceColorer
							? choiceColorer(choice)
							: undefined,
						data: choice,
					};
				}
			});
			
		}
		
		console.log(`autorun runChoiceObj`, choiceObj);
		
		
		this.choiceObj = choiceObj;
		
	}, {delay: 100});
	
	@computed get choiceArray() {
		return this.props.sorter
			? Object.values(this.choiceObj).sort(this.props.sorter)
			: Object.values(this.choiceObj);
	}
	
	@computed get value() {
		if (!this.props.state || !this.props.state.value) return '';
		
		const val = this.props.state.value;
		
		if (this.props.multiple) return val.map(v => this.choiceObj[v]);
		
		if (is.object(val) && val.key) {
			return this.choiceObj[val.key];
		}
		
		return this.choiceObj[val];
	}
	
	onChange = (choice) => {
		console.log(`choice: `, choice);
		let val = this.props.multiple
			? choice.map(c => c.value)
			: choice.value;
		
		// if (is.object(val) && val.key)
		
		if (this.props.state) this.props.state.Change(val);
		if (this.props.onChange) this.props.onChange(val);
	};
	
	onFocus = () => {
		if (this.props.onFocus) this.props.onFocus();
	};
	
	onBlur = () => {
		if (this.props.onBlur) this.props.onBlur();
	};
	
	render() {
		const {
			state,
			error,
			label,
			placeholder,
			disabled,
			tabi,
			size,
			isClearable,
			multiple,
		} = this.props;
		
		const errorText = error || (state || {}).error;
		
		// TODO: cleanup
		const styles = {
			control: (style) => ({
				...style,
				height: '100%',
			}),
			container: (style) => ({
				...style,
				height: '100%',
			}),
			valueContainer: (style) => ({
				...style,
				padding: 10,
				fontSize: size || 18,
				backgroundColor: '#f7f8fb',
				height: '100%', // props.h,
			}),
			indicatorsContainer: (style) => ({
				...style,
				height: '100%',
			}),
			option: (style, {data}) => ({
				...style,
				color: data.color,
			}),
			singleValue: (style, {data}) => ({
				...style,
				color: data.color,
			}),
		};
		
		const theme = theme => ({
			...theme,
			borderRadius: 0,
			colors: {
				...theme.colors,
				backgroundColor: '#f7f8fb',
				primary: '#269db5',
				primary2: '#269db5',
			}
		});
		
		return (
			<Col
				{...this.props}
				tabi={-1}
			>
				{label && (
					<Txt b marB={8}>{label}</Txt>
				)}
				{errorText && <Txt i l hue={'#ff1b2f'} size={'.75em'} marB={4}>{errorText}</Txt>}
				<SelectWrapper
					isMulti={multiple}
					options={this.choiceArray}
					value={this.value}
					onChange={this.onChange}
					onFocus={this.onFocus}
					onBlur={this.onBlur}
					placeholder={placeholder}
					disabled={disabled}
					error={error}
					styles={styles}
					theme={theme}
					tabIndex={tabi}
					isClearable={isClearable}
					inputRef={this.inputRef}
				/>
			</Col>
		);
	}
}

@observer
class SelectWrapper extends React.Component {
	
	@computed get options() {
		return this.props.options.slice();
	}
	
	render() {
		const props = this.props;
		const options = this.options;
		
		return (
			<Observer>{() => (
				<Select
					{...props}
					options={options}
					ref={props.inputRef}
					components={{
						Input
					}}
				/>
			)}
			</Observer>
		);
	}
}


@observer
export class UpFieldSelectFromDat extends React.Component {
	
	@computed get choices() {
		const dat = this.props.dat || {};
		const activeOnly = this.props.activeOnly;
		
		if (activeOnly) return dat.activeEntries || [];
		return dat.entries || [];
	}
	
	render() {
		return (
			<UpFieldSelect_DEPRECATED
				choices={this.choices}
				keyer={'key'}
				{...this.props}
			/>
		)
	}
}