import React from 'react';
import {Col, Row, Txt} from '../../Bridge/Bricks/bricksShaper';
import {Tip} from '../../Bridge/misc/Tooltip';
import {ReColumn, T_FnSort} from '../../Bridge/ReTable/ReColumn';
import type {ThymeDt} from '../../Bridge/thyme';
import thyme, {badDt} from '../../Bridge/thyme';
import {T_RowDat} from '../../Bridge/ReTable/ReTable';
import {observer} from 'mobx-react';

type Props = {
	column: ReColumn,
	dat: any,
	cell: {
		startKey: string,
		endKey: string,
		warningMinutes?: number,
		warningHue?: string,
		warningTooltip?: string,
	},
}

const FnSort: T_FnSort = (a: T_RowDat, b: T_RowDat, column: ReColumn) => {
	return thyme.sorter(column.cell.startKey);
};


@observer
export class RC_TimeRange extends React.Component<Props> {
	
	static COLUMN = (config: ReColumn | Props): ReColumn => new ReColumn(config, RC_TimeRange, FnSort);
	
	render() {
		const cell = this.props.cell;
		const dat = this.props.dat;
		
		const start: ThymeDt = dat[cell.startKey];
		const end: ThymeDt = dat[cell.endKey];
		
		if (badDt(start) || badDt(end)) return <div/>;
		
		let hue;
		let tooltip = '';
		
		if (cell.warningMinutes) {
			const minutes = end.diff(start, 'minutes').toObject().minutes;
			if (minutes >= cell.warningMinutes) {
				hue = cell.warningHue;
				tooltip = cell.warningTooltip;
			}
		}
		
		return (
			<Tip text={tooltip}>
				<Col fill childC hue={hue}>
					<Row childCenterV>
						<TimeSmall
							dt={start}
							size={16}
						/>
					</Row>
					
					<Row childCenterV>
						<TimeSmall
							dt={end}
							hue={'#828282'}
							size={12}
						/>
					</Row>
				</Col>
			</Tip>
		);
	}
}

class TimeSmall extends React.Component {
	render() {
		const dt: ThymeDt = this.props.dt;
		const hue: string = this.props.hue;
		const size: number = this.props.size;
		
		return (
			<>
				<Txt hue={hue} size={size}>{dt.toFormat('h')}</Txt>
				<Txt hue={hue || '#656565'} size={size * .8} marB={1}>:{dt.toFormat('mm')}</Txt>
				<Txt hue={hue} size={size * .8} marB={1} marL={2}>{dt.toFormat('a')}</Txt>
			</>
		);
	}
}