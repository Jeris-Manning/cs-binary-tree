import React from 'react';
import {Row, Txt} from '../../Bridge/Bricks/bricksShaper';
import {ReColumn, T_FnSort} from '../../Bridge/ReTable/ReColumn';
import {T_RowDat} from '../../Bridge/ReTable/ReTable';
import {computed} from 'mobx';
import {Staches} from '../../stores/RootStore';
import {observer} from 'mobx-react';
import $j from '../../Bridge/misc/$j';
import type {StaffId} from '../../datum/stache/StaffDat';
import {StaffDat} from '../../datum/stache/StaffDat';
import {Tip} from '../../Bridge/misc/Tooltip';
import {StaffAvatar} from '../Avatar';
import type {JobId} from '../../datum/stache/JobDat';
import {JobHistoryDat} from '../../datum/stache/JobHistoryDat';
import {Ico} from '../../Bridge/Bricks/Ico';
import {MdNoteAdd} from 'react-icons/md';
import {JobNotesSimple} from '../JobNoteModal';
import {SimCard} from '../../Bridge/misc/Card';

type Props = {
	column: ReColumn,
	dat: any,
	value: JobId,
	cell: {
		openModal: (JobId) => {},
	},
}

const FnSort: T_FnSort = (a: T_RowDat, b: T_RowDat, column: ReColumn) => {
	return 0;
};

@observer
export class RC_JobNotes extends React.Component<Props> {
	
	static COLUMN = (config: ReColumn | Props): ReColumn => new ReColumn(config, RC_JobNotes, FnSort);
	
	@computed get historyDat(): JobHistoryDat {
		const jobId = this.props.value;
		return Staches().cJobHistory.GetOrStub(jobId, true).dat;
	}
	
	render() {
		const jobId = this.props.value;
		const cell = this.props.cell;
		
		if (!jobId) return <div/>;
		
		const hasNotes = this.historyDat.noteRows.length > 0;
		
		let hue = '#b6b6b6';
		let tooltip = null;
		
		if (hasNotes) {
			hue = '#000000';
			tooltip = (
				<SimCard>
					<JobNotesSimple
						jobId={jobId}
					/>
				</SimCard>
			);
		}
		
		return (
			<Row>
				<Ico
					icon={MdNoteAdd}
					hue={hue}
					size={26}
					tooltip={tooltip}
					onClick={() => cell.openModal(jobId)}
				/>
			</Row>
		);
	}
}