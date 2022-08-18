import React from 'react';
import {Row, Txt} from '../../Bridge/Bricks/bricksShaper';
import {Tip} from '../../Bridge/misc/Tooltip';
import $j from '../../Bridge/misc/$j';
import {ReColumn, T_FnSort} from '../../Bridge/ReTable/ReColumn';
import type {ThymeDt} from '../../Bridge/thyme';
import thyme, {badDt} from '../../Bridge/thyme';
import {T_RowDat} from '../../Bridge/ReTable/ReTable';
import {observer} from 'mobx-react';

type Props = {
	column: ReColumn,
	dat: any,
	value: ThymeDt,
	cell: {
		style: any, // see: Txt
		tooltip: string,
		format: string,
	},
}

const FnSort: T_FnSort = (a: T_RowDat, b: T_RowDat, column: ReColumn) => {
	const aDt = a[column.accessor];
	const bDt = b[column.accessor];
	return aDt - bDt;
};

@observer
export class RC_Date extends React.Component<Props> {
	
	static COLUMN = (config: ReColumn | Props): ReColumn => new ReColumn(config, RC_Date, FnSort);
	
	render() {
		const value = this.props.value;
		const cell = this.props.cell;
		const dat = this.props.dat;
		
		if (badDt(value)) return <div/>;
		
		const style = $j.funcOr(cell.style, value, dat) || {};
		const tooltip = $j.funcOr(cell.tooltip, value, dat) || thyme.nice.date.short(value);
		const underline = thyme.isToday(value);
		
		const text = cell.format
			? value.toFormat(cell.format)
			: thyme.nice.date.brief(value);
		
		return (
			<Tip text={tooltip}>
				<Row childC>
					<Txt
						b
						underline={underline}
						{...style}
					>{text}</Txt>
				</Row>
			</Tip>
		);
	}
}