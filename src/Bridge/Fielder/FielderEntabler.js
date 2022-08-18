import React from 'react';
import {EntablerSpec} from '../Entabler/EntablerSpec';
import {FielderSource} from './FielderSource';
import {toJS} from 'mobx';
import {observer} from 'mobx-react';
import {Txt} from '../Bricks/bricksShaper';

export class FielderEntabler {
	
	static SourceToSpec(fielderSource: FielderSource): EntablerSpec {
		let entablerColumnObj = {};
		
		fielderSource.columns.forEach((fielderColState, columnId) => {
			
			const params = toJS(fielderColState.params);
			
			const entablerKey = `${columnId}_${fielderColState.def.key}`;
			
			console.log(`SourceToSpec, info: `, fielderColState.def.info);
			
			entablerColumnObj[entablerKey] = {
				label: params.label,
				labelTooltip: fielderColState.def.Summarize(params),
				fielderColumnDef: toJS(fielderColState.def),
				fielderColumnParams: toJS(fielderColState.params),
				Get: this.Get,
				Format: this.Format,
				cell: Cell_FielderFormatted,
				// w, fr, template stuff TODO
			};
		});
		
		return new EntablerSpec(entablerColumnObj);
	}
	
	static Get = (row, entablerColumn) => {
		return entablerColumn.fielderColumnDef.Get(row, entablerColumn.fielderColumnParams);
	};
	
	static Format = (row, entablerColumn) => {
		return entablerColumn.fielderColumnDef.Format(row, entablerColumn.fielderColumnParams);
	};
	
	
}

@observer
export class Cell_FielderFormatted extends React.Component {
	render() {
		const {
			value,
			column,
		} = this.props;
		
		const {
			color,
			bold,
			italics,
		} = column.fielderColumnParams;
		
		return (
			<Txt
				hue={color || '#000'}
				b={bold}
				i={italics}
			>{value}</Txt>
		);
	}
}