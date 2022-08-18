import React from 'react';
import {observer} from 'mobx-react';
import {MdClose} from 'react-icons/md';
import {action, computed} from 'mobx';
import {Col, Txt} from '../Bridge/Bricks/bricksShaper';
import {Upstate} from '../Bridge/misc/Upstate';
import type {FilterEntry, FilterIndex, FilterKey, FilterSet} from '../Bridge/misc/UpType';
import {IconType} from 'react-icons';
import {Clutch} from '../Bridge/DockClient/Stache';
import {Ico} from '../Bridge/Bricks/Ico';
import {Tip} from '../Bridge/misc/Tooltip';
import {FilterStatusToIndex} from '../Bridge/misc/UpType';

// unset, required, banned

export type C_IconFilter = {
	filterKey: FilterKey,
	state: Upstate<FilterSet>,
	
	// need 1:
	clutch: Clutch, // clutch.dat.entries = FilterEntry[]
	entries?: FilterEntry[],
	entry?: FilterEntry,
	
	iconColors?: [string, string, string], // [unset, required, banned]
	labelColors?: [string, string, string], // [unset, required, banned]
	xColor?: string,
	icon?: IconType, // overrides icon in FilterEntry
	
	showLabel?: boolean,
	tip?: string, // overrides entry.tip | entry.description
	useSingleStatus?: boolean,
}


const DEFAULT_ICON_COLORS: [string, string, string] = ['#c5c5c5', '#005c02', '#af848a'];
const DEFAULT_LABEL_COLORS: [string, string, string] = ['#000000', '#005c02', '#9e1818'];


@observer
export class IconFilter extends React.Component<C_IconFilter> {
	
	@computed get entries(): FilterEntry[] {
		if (this.props.entry) return [this.props.entry];
		if (this.props.entries) return this.props.entries;
		if (!this.props.clutch) throw new Error(`IconFilter requires clutch or entries`);
		
		return this.props.clutch.dat.entries || [];
	}
	
	@computed get entry(): FilterEntry {
		if (this.props.entry) return this.props.entry;
		const filterKey = this.props.filterKey;
		return this.entries.find(e => e.key === filterKey);
	}
	
	@computed get filterSet(): FilterSet {
		return this.props.state.value;
	}
	
	@computed get statusIndex(): FilterIndex {
		if (this.props.useSingleStatus) return FilterStatusToIndex[this.props.state.value];
		if (this.filterSet.req.includes(this.props.filterKey)) return 1;
		if (this.filterSet.ban.includes(this.props.filterKey)) return 2;
		return 0;
	}
	
	@computed get iconColor() {
		const iconColors =
			this.props.iconColors
			|| this.entry.iconColors
			|| DEFAULT_ICON_COLORS;
		return iconColors[this.statusIndex];
	}
	
	@computed get labelColor() {
		const labelColors = this.props.labelColors
			|| this.entry.labelColors
			|| DEFAULT_LABEL_COLORS;
		return labelColors[this.statusIndex];
	}
	
	@computed get tip() {
		if (this.props.tip) return this.props.tip;
		if (!this.entry) return '';
		
		return this.entry.tip
			|| this.entry.description;
	}
	
	@computed get isRequired() {return this.statusIndex === 1;};
	
	@computed get isBanned() {return this.statusIndex === 2;};
	
	@action OnClick = () => {
		const filterKey = this.props.filterKey;
		const state = this.props.state;
		
		state.Cycle(filterKey);
	};
	
	render() {
		if (!this.entry) return <Txt>?</Txt>;
		
		return (
			<Tip text={this.tip}>
				<Col
					{...this.props}
					onClick={this.OnClick}
					childC
					relative
					outline={'none'}
				>
					<Ico
						icon={this.entry.icon}
						size={26}
						hue={this.iconColor}
					/>
					
					<Col absolute>
						{this.isBanned && (
							<MdClose color={this.props.xColor || '#c01624'} size={26}/>
						)}
					</Col>
					
					{this.props.showLabel && (
						<Txt
							marT={4}
							b
							// size={props.size}
							hue={this.labelColor}
						>{this.entry.label}</Txt>
					)}
				</Col>
			</Tip>
		);
	}
}