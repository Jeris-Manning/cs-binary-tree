import {observer} from 'mobx-react';
import React, {Component} from 'react';
import {Col} from './bricksShaper';
import {Tip} from '../misc/Tooltip';
import {MdClose} from 'react-icons/md';
import {action, computed} from 'mobx';
import {Txt} from './bricksShaper';

// unset, required, banned

@observer
export default class IconFilter_DEPRECATED extends React.Component {
	
	@action OnClick = () => {
		switch (this.props.status) {
			default:
			case 'unset':
				return this.props.set('required');
			case 'required':
				return this.props.skipBanned ? this.props.set('unset') : this.props.set('banned');
			case 'banned':
				return this.props.set('unset');
		}
	};
	
	@computed get iconColor() {
		switch (this.props.status) {
			default:
			case 'unset':
				return this.props.hueUnset || '#c5c5c5';
			case 'required':
				return this.props.hueRequired || '#005c02';
			case 'banned':
				return this.props.hueBanned || '#af848a';
		}
	}
	
	@computed get labelColor() {
		switch (this.props.status) {
			default:
			case 'unset':
				return this.props.hueUnset || '#000000';
			case 'required':
				return this.props.hueRequired || '#005c02';
			case 'banned':
				return this.props.hueBanned || '#9e1818';
		}
	}
	
	@computed get tooltip() {
		if (this.props.tooltip) return this.props.tooltip;
		
		switch (this.props.status) {
			default:
			case 'unset':
				return 'unset';
			case 'required':
				return 'only showing';
			case 'banned':
				return 'hiding';
		}
	}
	
	render() {
		const props = this.props;
		const Icon = props.toggled ? (props.iconOn || props.icon) : (props.iconOff || props.icon);
		const status = props.status;
		
		const overlay = status !== 'banned'
			? <Col/>
			: <MdClose color={props.hueX || '#c01624'} size={props.size || 26}/>;
		
		const inner = (
			<Col
				{...props}
				onClick={this.OnClick}
				childC
				relative
				outline={'none'}
			>
				<Icon
					size={props.size || 26}
					color={this.iconColor}
				/>
				
				<Col absolute>
					{overlay}
				</Col>
				
				{props.label && (
					<Txt
						marT={4}
						b
						size={props.size}
						hue={this.labelColor}
					>{props.label}</Txt>
				)}
			</Col>
		);
		
		if (this.tooltip) return (
			<Tip text={this.tooltip}>
				{inner}
			</Tip>
		);
		
		return <>
			{inner}
		</>;
	}
}