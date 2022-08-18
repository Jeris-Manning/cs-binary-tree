import React from 'react';
import {Col, Row, Txt} from '../../Bridge/Bricks/bricksShaper';
import {Tip} from '../../Bridge/misc/Tooltip';
import $j from '../../Bridge/misc/$j';
import {ReColumn, T_FnSort} from '../../Bridge/ReTable/ReColumn';
import type {ThymeDt} from '../../Bridge/thyme';
import thyme, {badDt} from '../../Bridge/thyme';
import {T_RowDat} from '../../Bridge/ReTable/ReTable';
import {observer} from 'mobx-react';
import {computed} from 'mobx';
import {JobHistoryDat} from '../../datum/stache/JobHistoryDat';
import {Staches} from '../../stores/RootStore';
import type {JobId} from '../../datum/stache/JobDat';
import {StaffAvatar} from '../Avatar';
import {StaffDat} from '../../datum/stache/StaffDat';
import {ReRenderer} from '../ReRenderer';

type Props = {
	column: ReColumn,
	dat: any,
	value: JobId,
	cell: {},
}

const FnSort: T_FnSort = (a: T_RowDat, b: T_RowDat, column: ReColumn) => {
	// TODO: this is broken
	const cJobHistory = Staches().cJobHistory;
	const aDat = cJobHistory.GetOrStub(a[column.accessor], true).dat;
	const bDat = cJobHistory.GetOrStub(b[column.accessor], true).dat;
	return (aDat.updatedAt || 0) - (bDat.updatedAt || 0);
};

@observer
export class RC_LastUpdated extends React.Component<Props> {
	
	static COLUMN = (config: ReColumn | Props): ReColumn => new ReColumn(config, RC_LastUpdated, FnSort);
	
	@computed get historyDat(): JobHistoryDat {
		const jobId = this.props.value;
		return Staches().cJobHistory.GetOrStub(jobId, true).dat;
	}
	
	@computed get staffDat(): StaffDat {
		return Staches().cStaffByEmail.GetOrStub(this.historyDat.updatedBy, true, 'RC_LastUpdated').dat;
	}
	
	@computed get timeFormatted(): string {
		const updatedAt = this.historyDat.updatedAt;
		
		const timeLabel = thyme.nice.dateTime.relativeSmall(updatedAt, false);
	}
	
	render() {
		const jobId = this.props.value;
		const cell = this.props.cell;
		
		if (!jobId) return <div/>;
		
		const updatedAt = this.historyDat.updatedAt;
		const timeTip = thyme.nice.dateTime.short(updatedAt);
		
		return (
			<Row fill childCenterV>
				
				<StaffAvatar
					staff={this.staffDat}
					backup={this.historyDat.updatedBy}
				/>
				
				<Col w={8}/>
				
				<Tip text={timeTip}>
					<Col grow childC>
						<TimeLabel
							time={updatedAt}
						/>
					</Col>
				</Tip>
			</Row>
		);
	}
}

@observer
class TimeLabel extends React.Component {
	render() {
		const time: ThymeDt = this.props.time;
		
		const timeLabel = thyme.nice.dateTime.relativeSmall(time, false);
		const timeAffix = timeLabel ? 'ago' : '';
		
		return (
			<ReRenderer ms={60 * 1000}>
				<Txt
					size={12}
				>{timeLabel}</Txt>
				
				<Txt
					size={12}
				>{timeAffix}</Txt>
			</ReRenderer>
		);
	}
}