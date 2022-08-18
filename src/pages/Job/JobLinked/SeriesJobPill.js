import {observer} from 'mobx-react';
import React from 'react';
import {C_JobDat, JobDat} from '../../../datum/stache/JobDat';
import type {T_SeriesTimeRow} from '../../../datum/LinkedSeriesUpdata';
import {LinkedSeriesUpdata, SeriesJobEntry} from '../../../datum/LinkedSeriesUpdata';
import {computed} from 'mobx';
import {Ico} from '../../../Bridge/Bricks/Ico';
import {FaAngleDoubleLeft, FaAngleDoubleRight} from 'react-icons/fa';
import Butt from '../../../Bridge/Bricks/Butt';
import {MdChat, MdCheckBox, MdCheckBoxOutlineBlank, MdClose, MdFiberNew} from 'react-icons/md';
import {Col, Row, Txt} from '../../../Bridge/Bricks/bricksShaper';
import {SmallJobLink} from '../SmallJobLink';
import {JobDiff} from './JobDiff';
import {TerpDat} from '../../../datum/stache/TerpDat';
import {Jewels, Staches} from '../../../stores/RootStore';
import type {C_JobView} from '../JobUpdate/JobBasics';
import styled from 'styled-components';
import {JobSeekDat} from '../../../datum/stache/JobSeekDat';
import {HUE} from '../../../Bridge/HUE';
import {vJobSeries} from '../../../jewels/variance/vJobSeries';
import {GiWoodenSign} from 'react-icons/gi';
import $j from '../../../Bridge/misc/$j';

const PillContainer = styled.div`
  display: flex;
  background: ${p => p.hue};
  box-shadow: rgb(0 0 0 / 20%) 0 1px 5px 0,
  rgb(0 0 0 / 14%) 0 2px 2px 0,
  rgb(0 0 0 / 12%) 0 3px 1px -2px;
  border-radius: 360px;
  margin-left: 2px;
  margin-right: 2px;
  padding-right: 4px;
  height: 44px;
`;

@observer
export class SeriesJobPill extends React.Component<C_JobView> {
	
	@computed get isSelected(): boolean {
		const seriesUp: LinkedSeriesUpdata = this.props.jobRef.seriesUp;
		const jobEntry: SeriesJobEntry = this.props.jobEntry;
		return seriesUp.selectedJobs.value.get(jobEntry.key);
	}
	
	@computed get isCurrent(): boolean {
		const seriesUp: LinkedSeriesUpdata = this.props.jobRef.seriesUp;
		const jobEntry: SeriesJobEntry = this.props.jobEntry;
		return jobEntry.key === seriesUp.currentJobKey;
	}
	
	render() {
		const jobRef: JobRef = this.props.jobRef;
		const seriesUp: LinkedSeriesUpdata = jobRef.seriesUp;
		const jobEntry: SeriesJobEntry = this.props.jobEntry;
		
		if (jobEntry.isPreview) {
			return (
				<PreviewPill
					jobEntry={jobEntry}
					jobRef={jobRef}
				/>
			);
		}
		
		let hueBg = HUE.series.pill.defaultBg;
		if (this.isSelected) hueBg = HUE.series.pill.selectedBg;
		else if (this.isCurrent) hueBg = HUE.series.pill.currentBg;
		
		const height = 44;
		
		return (
			<PillContainer
				hue={hueBg}
			>
				<Row
					childV
				>
					{this.isCurrent ? (
						<Ico
							icon={FaAngleDoubleRight}
							size={26}
							hue={HUE.series.pill.sideButtons}
							h={height}
							circle
							tooltip={'Current Job'}
							childV
							padL={4}
						/>
					) : (
						<Butt
							on={() => seriesUp.selectedJobs.Toggle(jobEntry.key)}
							subtle
							mini
							icon={this.isSelected ? MdCheckBox : MdCheckBoxOutlineBlank}
							iconHue={HUE.series.pill.sideButtons}
							circle
							h={height}
						/>
					)}
					
					<SeriesPillMid
						jobEntry={jobEntry}
					/>
					
					
					{this.isCurrent ? (
						<Ico
							icon={FaAngleDoubleLeft}
							size={26}
							hue={HUE.series.pill.sideButtons}
							h={height}
							circle
							tooltip={'Current Job'}
							marL={8}
							childV
						/>
					) : (
						<Col marL={8}>
							<JobDiff
								jobRef={jobRef}
								jobEntry={jobEntry}
							/>
						</Col>
					)}
				</Row>
			</PillContainer>
		);
	}
}

@observer
class PreviewPill extends React.Component {
	render() {
		const jobRef: JobRef = this.props.jobRef;
		const seriesUp: LinkedSeriesUpdata = jobRef.seriesUp;
		const jobEntry: SeriesJobEntry = this.props.jobEntry;
		
		const vJobSeries: vJobSeries = Jewels().vJobSeries;
		
		const height = 44;
		
		return (
			<PillContainer
				hue={HUE.series.pill.previewBg}
			>
				<Row
					childV
				>
					<Butt
						on={() => vJobSeries.RemovePreview(jobRef, jobEntry)}
						iconHue={HUE.series.pill.sideButtons}
						subtle
						mini
						circle
						h={height}
						icon={MdClose}
						tooltip={'Remove Preview'}
					/>
					
					<Txt size={14}>Preview</Txt>
					
					<Ico
						icon={MdFiberNew}
						size={26}
						hue={HUE.series.pill.sideButtons}
						h={height}
						circle
						tooltip={'This job will be created.'}
						marL={8}
						childV
					/>
				</Row>
			</PillContainer>
		);
	}
}

@observer
class SeriesPillMid extends React.Component<C_JobDat> {
	
	@computed get terpDat(): TerpDat {
		const jobEntry: SeriesJobEntry = this.props.jobEntry;
		const jobDat: JobDat = jobEntry.dat;
		if (!jobDat.terpId) return null;
		return Staches().cTerp.GetOrStub(jobDat.terpId, true, 'SeriesPillMid');
	}
	
	@computed get jobSeekDat(): JobSeekDat {
		const jobEntry: SeriesJobEntry = this.props.jobEntry;
		const jobDat: JobDat = jobEntry.dat;
		return Staches().cJobSeek.GetOrStub(jobDat.jobId, true).dat;
	}
	
	render() {
		const jobEntry: SeriesJobEntry = this.props.jobEntry;
		const jobDat: JobDat = jobEntry.dat;
		
		return (
			<Col
				PILL_MID
				marL={8}
			>
				<SmallJobLink
					jobId={jobDat.jobId}
					isCancelled={jobDat.isCancelled}
				/>
				
				{this.terpDat ? (
					<Row>
						<Txt size={14}>{this.terpDat.label}</Txt>
						<Butt
							on={() => Jewels().vChat.OpenChat(this.terpDat.key)}
							icon={MdChat}
							iconSize={14}
							iconHue={HUE.series.pill.sideButtons}
							mini
							subtle
							marL={2}
						/>
					</Row>
				) : (
					<Row>
						<Txt b size={14}>no terp</Txt>
						{this.jobSeekDat.activeSeekerCount > 0 && (
							<Ico
								icon={GiWoodenSign}
								tooltip={$j.pluralCount(this.jobSeekDat.activeSeekerCount, 'active seeker')}
								marL={4}
							/>
						)}
					</Row>
				)}
			
			</Col>
		)
	}
}




@observer
export class SeriesJobPillGroup extends React.Component<C_JobView> {
	render() {
		const jobRef: JobRef = this.props.jobRef;
		const timeRow: T_SeriesTimeRow = this.props.timeRow;
		
		return (
			<>
				{timeRow.jobs.map(jobEntry => (
					<SeriesJobPill
						key={jobEntry.key}
						jobEntry={jobEntry}
						jobRef={jobRef}
					/>
				))}
			</>
		);
	}
}