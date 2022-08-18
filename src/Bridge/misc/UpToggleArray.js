import {observer} from 'mobx-react';
import React from 'react';
import {Row, Txt} from '../Bricks/bricksShaper';
import $j from './$j';
import IconToggle from '../Bricks/IconToggle';
import {action} from 'mobx';

// TODO: hasn't been used yet

@observer
export class UpToggleArray extends React.Component {
	
	@action SetEntry = (key, isSet) => {
		if (isSet) {
			this.props.state.Add(key);
		} else {
			this.props.state.Remove(key);
		}
	};
	
	render() {
		const {
			state,
			all,
			keyer = 'key',
			tooltipKey = 'tooltip',
			canEdit = true,
			entryProps,
			rowProps,
			getIcon,
			sort,
			hideUnset = false,
			noneText,
		} = this.props;
		
		const allEntries = all.slice.sort($j.sort.default(sort));
		
		const entries = hideUnset
			? allEntries.filter(e => state.value.includes(e[keyer]))
			: allEntries;
		
		
		return (
			<Row
				wrap
				{...rowProps}
			>
				{entries.map(entry => (
					<Entry
						entry={entry}
						keyer={keyer}
						set={this.SetEntry}
						get={key => state.value.includes(key)}
						getIcon={getIcon}
						tooltip={entry[tooltipKey]}
						canEdit={canEdit}
						marR={12}
						marB={12}
						{...entryProps}
					/>
				))}
				
				{entries.length <= 0 && (
					<Txt hue={'#636363'}>{noneText}</Txt>
				)}
			</Row>
		);
	}
}

@observer
class Entry extends React.Component {
	render() {
		const {
			entry,
			keyer,
			set,
			get,
			getIcon,
			tooltip,
			canEdit,
		} = this.props;
		
		const key = entry[keyer];
		const toggled = get(key);
		const icon = getIcon(key);
		const on = canEdit ? (toggleTo) => set(key, toggleTo) : undefined;
		
		return (
			<IconToggle
				key={entry[keyer]}
				on={on}
				toggled={toggled}
				icon={icon}
				tooltip={tooltip}
				marR={12}
				marB={12}
				{...this.props}
			/>
		);
	}
}