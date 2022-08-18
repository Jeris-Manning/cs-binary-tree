import React from 'react';
import {Col, Txt} from '../../Bridge/Bricks/bricksShaper';
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
	},
}

const FnSort: T_FnSort = (a: T_RowDat, b: T_RowDat, column: ReColumn) => {
	const aDt = a[column.accessor];
	const bDt = b[column.accessor];
	return aDt - bDt;
};

@observer
export class RC_Timestamp extends React.Component<Props> {
	
	static COLUMN = (config: ReColumn | Props): ReColumn => new ReColumn(config, RC_Timestamp, FnSort);
	
	render() {
		const value = this.props.value;
		const cell = this.props.cell;
		const dat = this.props.dat;
		
		if (badDt(value)) return <div/>;
		
		const style = $j.funcOr(cell.style, value, dat) || {};
		const tooltip = $j.funcOr(cell.tooltip, value, dat)
			|| thyme.nice.dateTime.short(value);
		
		const text = thyme.nice.dateTime.relativeSmall(value, false);
		
		return (
			<Tip text={tooltip}>
				<Col grow childC>
					
					<Txt
						size={12}
						{...style}
					>{text}</Txt>
					
					<Txt
						size={12}
						{...style}
					>ago</Txt>
					
				</Col>
			</Tip>
		);
	}
}