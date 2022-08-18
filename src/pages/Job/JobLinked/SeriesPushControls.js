import {observer} from 'mobx-react';
import React from 'react';
import {action, computed} from 'mobx';
import {Col, Row, Txt} from '../../../Bridge/Bricks/bricksShaper';
import {SimCard} from '../../../Bridge/misc/Card';
import {MdCheckBox, MdCheckBoxOutlineBlank, MdHelp, MdLayersClear, MdRestore} from 'react-icons/md';
import type {C_JobView} from '../JobUpdate/JobBasics';
import type {T_SeriesField} from './LinkedSeriesFields';
import {SERIES_FIELDS} from './LinkedSeriesFields';
import {LinkedSeriesUpdata} from '../../../datum/LinkedSeriesUpdata';
import styled from 'styled-components';
import Butt from '../../../Bridge/Bricks/Butt';
import {Ico} from '../../../Bridge/Bricks/Ico';
import {HUE} from '../../../Bridge/HUE';
import {Jewels} from '../../../stores/RootStore';

@observer
export class SeriesPushControls extends React.Component<C_JobView> {
	
	render() {
		const jobRef: JobRef = this.props.jobRef;
		
		return (
			<>
				<PushCard hue={'#fff'}>
					<PushTopBar
						jobRef={jobRef}
					/>
				</PushCard>
				
				<PushCard>
					<Row>
						<PushJobField jobRef={jobRef} field={SERIES_FIELDS.status} third/>
						<PushJobField jobRef={jobRef} field={SERIES_FIELDS.followUp} third/>
						<PushJobField jobRef={jobRef} field={SERIES_FIELDS.warning}/>
					</Row>
					
					<Row>
						<PushJobField jobRef={jobRef} field={SERIES_FIELDS.billType} third/>
						<PushJobField jobRef={jobRef} field={SERIES_FIELDS.cap} third/>
						<PushJobField jobRef={jobRef} field={SERIES_FIELDS.vri}/>
					</Row>
					
					<Row>
						<PushJobField jobRef={jobRef} field={SERIES_FIELDS.companyConfirmed} half/>
						<PushJobField jobRef={jobRef} field={SERIES_FIELDS.terpConfirmed} half/>
					</Row>
				</PushCard>
				
				<PushCard>
					
					<Row>
						<PushJobField jobRef={jobRef} field={SERIES_FIELDS.start} grow/>
						<PushJobField jobRef={jobRef} field={SERIES_FIELDS.end} grow/>
					</Row>
					
					<PushJobField jobRef={jobRef} field={SERIES_FIELDS.locationId}/>
					
					<PushJobField jobRef={jobRef} field={SERIES_FIELDS.deafIds}/>
					<PushJobField jobRef={jobRef} field={SERIES_FIELDS.situation}/>
					<PushJobField jobRef={jobRef} field={SERIES_FIELDS.specialNotes}/>
				
				</PushCard>
				
				<PushCard>
					<Row>
						<PushJobField jobRef={jobRef} field={SERIES_FIELDS.requestedBy} half/>
						<PushJobField jobRef={jobRef} field={SERIES_FIELDS.createdBy}/>
					</Row>
					
					<Row>
						<PushJobField jobRef={jobRef} field={SERIES_FIELDS.confirmationInfo} half/>
						<PushJobField jobRef={jobRef} field={SERIES_FIELDS.contactUponArrival}/>
					</Row>
				</PushCard>
				
				
				<PushCard>
					<PushJobField jobRef={jobRef} field={SERIES_FIELDS.vri}/>
					<PushJobField jobRef={jobRef} field={SERIES_FIELDS.vriLink}/>
					<PushJobField jobRef={jobRef} field={SERIES_FIELDS.vriPassword}/>
					<PushJobField jobRef={jobRef} field={SERIES_FIELDS.vriOther}/>
				</PushCard>
				
				<PushCard>
					<Row>
						<PushJobField jobRef={jobRef} field={SERIES_FIELDS.terpTravel} half/>
						<PushJobField jobRef={jobRef} field={SERIES_FIELDS.terpTravelRate}/>
					</Row>
					
					<Row>
						<PushJobField jobRef={jobRef} field={SERIES_FIELDS.companyTravel} half/>
						<PushJobField jobRef={jobRef} field={SERIES_FIELDS.companyTravelRate}/>
					</Row>
				</PushCard>
				
				
				<PushCard>
					<Row>
						<PushJobField jobRef={jobRef} field={SERIES_FIELDS.rate} third/>
						<PushJobField jobRef={jobRef} field={SERIES_FIELDS.cap} third/>
						<PushJobField jobRef={jobRef} field={SERIES_FIELDS.hourMin}/>
					</Row>
					
					<Row marT={4}>
						<PushJobField jobRef={jobRef} field={SERIES_FIELDS.overrideRate} half/>
						<PushJobField jobRef={jobRef} field={SERIES_FIELDS.flatRate}/>
					</Row>
				</PushCard>
				
				<PushCard>
					<PushJobField jobRef={jobRef} field={SERIES_FIELDS.wantedTerps}/>
					<PushJobField jobRef={jobRef} field={SERIES_FIELDS.interns}/>
					<PushJobField jobRef={jobRef} field={SERIES_FIELDS.qbStatus}/>
				</PushCard>
			
			</>
		);
	}
}

@observer
class PushTopBar extends React.Component<C_JobView> {
	
	@action ToggleAll = () => {
		const jobRef: JobRef = this.props.jobRef;
		const seriesUp: LinkedSeriesUpdata = jobRef.seriesUp;
		
		if (seriesUp.hasAllFieldsSelected) {
			seriesUp.pushFields.Clear();
		} else {
			seriesUp.pushFields.SetAll(Object.keys(SERIES_FIELDS), true);
		}
	}
	
	@action PushChanges = () => {
		const jobRef: JobRef = this.props.jobRef;
		const seriesUp: LinkedSeriesUpdata = jobRef.seriesUp;
		
		const vJobSeries: vJobSeries = Jewels().vJobSeries;
		return vJobSeries.PushChanges(seriesUp);
	}
	
	render() {
		const jobRef: JobRef = this.props.jobRef;
		const seriesUp: LinkedSeriesUpdata = jobRef.seriesUp;
		
		return (
			<>
				<Row
					marH={4}
					marV={8}
				>
					<Txt
						size={16}
						smallCaps
						hue={HUE.blueDeep}
					>
						Current Job {jobRef.jobId}
					</Txt>
					
					<Col grow/>
					
					<Ico
						icon={MdHelp}
						hue={'#575757'}
						tooltip={`These fields determine what will be transferred to duplicated jobs or pushed to selected jobs. It also determines what fields are checked when the jobs on the right are compared to the current job.`}
					/>
				</Row>
				
				<Row marB={6} marR={4}>
					<Butt
						on={this.ToggleAll}
						icon={seriesUp.hasAllFieldsSelected ? MdCheckBox : MdCheckBoxOutlineBlank}
						subtle
						mini
						iconHue={'#575757'}
						tooltip={'Select All Fields'}
					/>
					
					<Butt
						on={seriesUp.pushFields.Revert}
						icon={MdRestore}
						subtle
						mini
						iconHue={'#575757'}
						marL={16}
						tooltip={'Reset to default'}
					/>
					
					<Col grow/>
					
					<Butt
						on={this.PushChanges}
						secondary
						enabled={seriesUp.jobsSelectedCount}
						label={`Push To (${seriesUp.jobsSelectedCount || 'none'})`}
						tooltip={[
							`Takes selected fields below for the CURRENT job,`,
							`then PUSHES those values to the selected jobs.`,
							`This is very useful for when you need to make a change to several jobs!`
						]}
					/>
				</Row>
			</>
		);
	}
}

@observer
class PushCard extends React.Component {
	render() {
		return (
			<SimCard
				pad={4}
				// padL={4}
				// padR={4}
				// marV={2}
				marT={2}
				marB={1}
				hue={'rgba(255,255,255,0.7)'}
				{...this.props}
			/>
		);
	}
}


@observer
class PushJobField extends React.Component<C_JobView> {
	
	@computed get rawVal() {
		const field: T_SeriesField = this.props.field;
		const jobRef: JobRef = this.props.jobRef;
		return jobRef.jobDat[field.key];
	}
	
	@computed get formatted(): string {
		const field: T_SeriesField = this.props.field;
		const jobRef: JobRef = this.props.jobRef;
		return field.fnFormat
			? field.fnFormat(this.rawVal, jobRef.jobDat)
			: this.rawVal;
	}
	
	@computed get isEnabled(): boolean {
		const field: T_SeriesField = this.props.field;
		const jobRef: JobRef = this.props.jobRef;
		const seriesUp: LinkedSeriesUpdata = jobRef.seriesUp;
		
		return seriesUp.pushFields.value.get(field.key);
	}
	
	render() {
		const field: T_SeriesField = this.props.field;
		const jobRef: JobRef = this.props.jobRef;
		const seriesUp: LinkedSeriesUpdata = jobRef.seriesUp;
		
		const Icon = this.isEnabled ? MdCheckBox : MdCheckBoxOutlineBlank;
		const hue = this.isEnabled ? '#3c3c3c' : '#949494';
		
		return (
			<Col
				// fit
				marT={4}
				{...this.props}
			>
				<Row
					onClick={() => seriesUp.pushFields.Toggle(field.key)}
					fit
				>
					
					<Col w={18}>
						<Icon
							size={18}
							color={hue}
						/>
					</Col>
					
					<Col
						marT={2}
						marL={4}
						fit
					>
						<Txt
							size={12}
							hue={hue}
							caps
							// marB={4}
							b
							noSelect
						>
							{field.label}
						</Txt>
						
						<Txt
							size={12}
							hue={hue}
							fit
							overflow={'hidden'}
						>
							{this.formatted || 'none'}
						</Txt>
					</Col>
				
				</Row>
			</Col>
		);
	}
}

@observer
class PushJobFieldLabel extends React.Component<C_JobView> {
	
	render() {
		const field: T_SeriesField = this.props.field;
		const jobRef: JobRef = this.props.jobRef;
		const seriesUp: LinkedSeriesUpdata = jobRef.seriesUp;
		const Icon = this.isEnabled ? MdCheckBox : MdCheckBoxOutlineBlank;
		
		return (
			<CheckButton
				onClick={() => seriesUp.pushFields.Toggle(field.key)}
			>
				
				<Row
					childV
				>
					<Icon
						size={18}
						color={'#575757'}
					/>
					
					<Txt
						hue={'#3c3c3c'}
						caps
						marB={4}
						marR={3}
						size={12}
					>
						{field.label}
					</Txt>
				</Row>
			
			</CheckButton>
		);
	}
}


const CheckButton = styled.button`
  height: 30px;
  padding: 2px 4px;
  background: none;
  border: none;
  border-radius: 360px;
  transition: background-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms, box-shadow 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms, border 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
  cursor: pointer;
  user-select: none;
  outline: none;

  //&:hover {
  //  background: #949494;
  //}

  &:active {
    background: #c6c6c6;
    box-shadow: 0 5px 5px -3px rgba(0, 0, 0, 0.2),
    0 8px 10px 1px rgba(0, 0, 0, 0.14),
    0 3px 14px 2px rgba(0, 0, 0, 0.12);
  }
`;