import {observer} from 'mobx-react';
import React from 'react';
import {computed} from 'mobx';
import {Jewels, Staches} from '../stores/RootStore';
import PopModal from './PopModal';
import {Col, Row, Txt} from '../Bridge/Bricks/bricksShaper';
import {SimField} from './SimField';
import {HistoryRow, JobHistoryDat} from '../datum/stache/JobHistoryDat';
import type {JobId} from '../datum/stache/JobDat';
import {StaffDat} from '../datum/stache/StaffDat';
import {StaffAvatar} from './Avatar';

@observer
export class JobNoteModal extends React.Component {
	render() {
		const vActionList = Jewels().vActionList;
		const jobId: JobId = vActionList.showNoteModalForJobId;
		
		return (
			<PopModal
				isOpen={!!jobId}
				onClose={vActionList.CloseNoteModal}
			>
				<Col
					marH={20}
					w={700}
					padV={16}
				>
					<JobNotesSimple
						jobId={jobId}
					/>
					
					
					<SimField
						label={`Add Note for #${jobId}`}
						// multiline
						focus
						onEnterKey={vActionList.SubmitNote}
					/>
				</Col>
			</PopModal>
		);
	}
}

@observer
export class JobNotesSimple extends React.Component<{ jobId: JobId }> {
	
	@computed get historyDat(): JobHistoryDat {
		const jobId: JobId = this.props.jobId;
		return Staches().cJobHistory.GetOrStub(jobId, true, 'JobNotesSimple').dat;
	}
	
	render() {
		if (!this.props.jobId) return <></>;
		
		return (
			<>
				{this.historyDat.noteRows.map(row => (
					<JobNoteRowSimple
						key={row.key}
						row={row}
					/>
				))}
			</>
		);
	}
}

@observer
export class JobNoteRowSimple extends React.Component<{ row: HistoryRow }> {
	render() {
		const row: HistoryRow = this.props.row;
		// const staff: StaffDat = row.staffDat;
		const staff: StaffDat = row.staffClutch.dat;
		
		return (
			<Row>
				<StaffAvatar staff={staff}/>
				
				<Txt
					marR={2}
					b
					hue={'#000'}
					left
				>
					{staff.label}:
				</Txt>
				
				<Txt
					marB={4}
					hue={'#000'}
					left
				>
					{row.datum.note}
				</Txt>
			</Row>
		);
	}
}