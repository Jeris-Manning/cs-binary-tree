import {Observer, observer} from 'mobx-react';
import React, {Component} from 'react';
import {action, computed} from 'mobx';
import {Col, Row, Txt} from './bricksShaper';
import CreatableSelect from 'react-select/lib/Creatable';
import Select from 'react-select';

@observer
export default class ListPicker extends React.Component {
	
	
	@computed get choices() {
		return this.props.choices || (this.props.field || this.props.$).choices;
	}
	
	@action OnChange = (val) => {
		(this.props.field || this.props.$).onChange(val, true);
		if (typeof this.props.onSelect === 'function') this.props.onSelect(val);
	};
	
	render() {
		const props = this.props;
		const field = props.field || props.$;
		
		let styles = {};
		
		styles.valueContainer = (style) => ({
			...style,
			padding: 10,
			fontSize: props.size || 18,
			backgroundColor: '#f7f8fb',
			height: props.h,
		});
		
		styles.container = (style) => ({
			...style,
		});
		
		if (props.column) {
			styles.valueContainer = (style) => ({
				...style,
				padding: 10,
				flexDirection: 'column',
				alignItems: 'flex-start',
				fontSize: 18,
				backgroundColor: '#f7f8fb',
			});
		}
		
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
		
		const SelectComponent = field.settings.canCreate ? CreatableSelect : Select;
		
		return (
			<>
				<Col
					w={props.w}
					marT={props.marV || 8}
					marB={props.marB || 10}
					marR={props.marR || 20}
					grow={props.grow}
				>
					{field.error && (
						<Row w={props.marL || 20}>
							{field.error && <Col w={4} hue={'#ff1b2f'}/>}
						</Row>
					)}
					
					{field.label && (
						<Txt b marB={8}>{field.label}</Txt>
					)}
					{field.help && <Txt i l hue={'#4b798e'} size={'.75em'} marB={8}>{field.help}</Txt>}
					{field.error && <Txt i l hue={'#ff1b2f'} size={'.75em'} marB={4}>{field.error}</Txt>}
					<SelectWrapper
						{...props}
						component={SelectComponent}
						isMulti={field.settings.multiple || props.multiple}
						options={this.choices}
						value={field.value}
						placeholder={field.placeholder || props.placeholder}
						onChange={this.OnChange}
						onFocus={field.onFocus}
						onBlur={field.onBlur}
						disabled={field.disabled}
						error={field.error}
						styles={styles}
						theme={theme}
					/>
				</Col>
			</>
		);
	}
}

@observer
class SelectWrapper extends React.Component {
	
	@computed get options() {
		console.log(`SelectWrapper computing options`);
		return this.props.options.slice();
	}
	
	render() {
		const props = this.props;
		const SelectComponent = props.component;
		const options = this.options;
		console.log(`SelectWrapper render`);
		
		return (
			<Observer>{() => (
				<SelectComponent
					{...props}
					options={options}
					// isMulti={field.settings.multiple}
					// options={this.choices}
					// value={field.value}
					// placeholder={field.placeholder}
					// onChange={field.onChange}
					// onFocus={field.onFocus}
					// onBlur={field.onBlur}
					// disabled={field.disabled}
					// error={field.error}
					// styles={styles}
					// theme={theme}
				/>
			)}
			</Observer>
		);
	}
}