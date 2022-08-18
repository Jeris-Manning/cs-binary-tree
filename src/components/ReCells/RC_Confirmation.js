import React from 'react';
import {Col, Row} from '../../Bridge/Bricks/bricksShaper';
import {Tip} from '../../Bridge/misc/Tooltip';
import $j from '../../Bridge/misc/$j';
import {IconType} from 'react-icons';
import {ReColumn} from '../../Bridge/ReTable/ReColumn';
import type {T_FnSort} from '../../Bridge/ReTable/ReColumn';
import {T_RowDat} from '../../Bridge/ReTable/ReTable';
import {MdHelp} from 'react-icons/md';
import {Ico} from '../../Bridge/Bricks/Ico';
import {observer} from 'mobx-react';
import {IoMdCheckmarkCircleOutline} from 'react-icons/io';
import {FiCircle} from 'react-icons/fi';
import thyme from '../../Bridge/thyme';

type Props = {
	column: ReColumn,
	dat: any,
	value: boolean,
	cell: {
		icon: IconType,
		iconHue: string,
		iconSize: number,
		tooltip: string,
		confirmType: string,
	},
}

const FnSort: T_FnSort = (a: T_RowDat, b: T_RowDat, column: ReColumn) => {
	const _a = a[column.accessor];
	const _b = b[column.accessor];
	if (_a) return !_b ? column.sortDirection : 0;
	return _b ? -column.sortDirection : 0;
}

@observer
export class RC_Confirmation extends React.Component<Props> {
	
	static COLUMN = (config: ReColumn | Props): ReColumn => new ReColumn(config, RC_Confirmation, FnSort);
	
	render() {
		const value = this.props.value;
		const cell = this.props.cell;
		const dat = this.props.dat;
		
		if (!value) return <div/>;
		
		const icon = cell.icon || MdHelp;
		const iconHue = $j.funcOr(cell.iconHue, value, dat);
		const iconSize = $j.funcOr(cell.iconSize, value, dat);
		
		
		const tooltip = value
			? `${cell.confirmType} confirmation sent ${thyme.nice.dateTime.short(value)}`
			: `${cell.confirmType} confirmation has NOT been sent.`;
		
		return (
			<Row childC>
				<Tip text={tooltip}>
					
					<Ico
						icon={icon}
						hue={iconHue}
						size={iconSize || 18}
					/>
					
					<Ico
						icon={value ? IoMdCheckmarkCircleOutline : FiCircle}
						hue={value ? '#2c8700' : '#900505'}
						size={cell.iconSize || 18}
					/>
					
				</Tip>
			</Row>
		);
	}
}