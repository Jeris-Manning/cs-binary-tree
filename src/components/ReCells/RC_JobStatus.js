import React from 'react';
import {Col, Row, Txt} from '../../Bridge/Bricks/bricksShaper';
import {Tip} from '../../Bridge/misc/Tooltip';
import $j from '../../Bridge/misc/$j';
import {ReColumn, T_FnSort} from '../../Bridge/ReTable/ReColumn';
import Linker from '../../Bridge/Nav/Linker';
import Butt from '../../Bridge/Bricks/Butt';
import {MdContentCopy} from 'react-icons/md';
import {Clip} from '../../Bridge/misc/Clip';
import {T_RowDat} from '../../Bridge/ReTable/ReTable';
import {observer} from 'mobx-react';
import type {JobStatusId} from '../../pages/Job/JobUpdate/JobBasics';

type Props = {
	column: ReColumn,
	dat: any,
	value: JobStatusId,
	cell: {	},
}

export const STATUS_STYLE = {
	1: {
		label: 'Pending',
		b: true,
	},
	2: {
		label: 'Filled',
	},
	3: {
		label: 'SEARCH',
		b: true,
		// hueBg: '#f1e9cb'
	},
	4: {
		label: 'Paid',
		b: true,
	},
	5: {
		label: 'BIDDING',
		b: true,
	},
	6: {
		label: 'FOLLOWUP',
		b: true,
	},
	7: {
		label: 'Company',
		b: true,
		hueBg: '#e4dff5'
	},
	8: {
		label: 'Contact',
		b: true,
		hueBg: '#e4dff5'
	},
	9: {
		label: 'Cancel',
		b: true,
		hueBg: '#e5adad'
	},
	10: {
		label: 'SUB',
		b: true,
	},
}

const FnSort: T_FnSort = (rowA: T_RowDat, rowB: T_RowDat, column: ReColumn) => {
	const a = rowA[column.accessor];
	const b = rowB[column.accessor];
	if (!a) return !b ? 0 : -1;
	if (!b) return !a ? 0 : +1;
	
	const _a = STATUS_STYLE[a].label.toLowerCase();
	const _b = STATUS_STYLE[b].label.toLowerCase();
	if (_a < _b) return -column.sortDirection;
	if (_a > _b) return column.sortDirection;
	return 0;
};

@observer
export class RC_JobStatus extends React.Component<Props> {
	
	static COLUMN = (config: ReColumn | Props): ReColumn => new ReColumn(config, RC_JobStatus, FnSort);
	
	render() {
		const value = this.props.value;
		const cell = this.props.cell;
		const dat = this.props.dat;
		
		if (!value) return <div/>;
		
		const statusStyle = STATUS_STYLE[value];
		
		const label = statusStyle.label;
		const hueBg = statusStyle.hueBg;
		const b = statusStyle.b;
		const billType = dat.billType;
		const isCancelled = dat.isCancelled;
		
		const tooltip = [billType, `isCancelled: ${isCancelled}`];
		
		return (
			<Tip text={tooltip}>
				<Col
					fill
					childC
				>
					<Row
						hue={hueBg}
						pad={4}
					>
						<Txt
							size={12}
							b={b}
						>{label}</Txt>
					</Row>
				</Col>
			</Tip>
		);
	}
}