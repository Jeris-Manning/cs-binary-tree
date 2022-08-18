import React from 'react';
import {observer} from 'mobx-react';
import {Jewels} from 'stores/RootStore';
import {SimHeader} from '../../../Bridge/misc/Card';
import {Col, Row, Txt} from '../../../Bridge/Bricks/bricksShaper';
import {Goomap} from '../../../components/Goomap';
import {action} from 'mobx';
import Butt from '../../../Bridge/Bricks/Butt';
import {MdAdd, MdClear, MdEdit, MdLocationOn} from 'react-icons/md';
import {LocationEditor} from './LocationEditor';
import {HUE} from '../../../Bridge/HUE';
import {OverlappingJobs} from './JobDetails';
import type {C_JobView} from './JobBasics';
import {JobCard} from './JobBasics';
import {SelectorField} from '../../../Bridge/misc/SelectorField';
import {JobUpdata} from '../../../datum/JobUpdata';

const MARKER_SIZE = 42;

@observer
export class JobLocation extends React.Component<C_JobView> {
	
	@action OpenLocEditor = (loc, companyId) => {
		const jobRef: JobRef = this.props.jobRef;
		
		return Jewels().location.OpenLocEditor(
			loc,
			companyId,
			jobRef.jobUp.locationId.Change,
		);
	};
	
	render() {
		const jobRef: JobRef = this.props.jobRef;
		
		const oLocation = Jewels().location;
		
		return (
			<>
				
				
				{jobRef.hasLocation ? (
					<HasLocation
						jobRef={jobRef}
						openLocEditor={this.OpenLocEditor}
					/>
				) : (
					<NoLocation
						jobRef={jobRef}
						openLocEditor={this.OpenLocEditor}
					/>
				)}
				
				<LocationEditor
					isOpen={oLocation.locEditorOpen}
					onClose={oLocation.CloseLocEditor}
				/>
			
			</>
		);
	}
}

@observer
class HasLocation extends React.Component<C_JobView> {
	render() {
		const jobRef: JobRef = this.props.jobRef;
		const location = jobRef.location;
		const openLocEditor = this.props.openLocEditor;
		
		// console.log(`HasLocation, hasChanged: ${jobRef.jobUp.locationId.hasChanged}`, jobRef.jobUp.locationId.previousValue, jobRef.jobUp.locationId.newValue);
		// console.log(`HasLocation, hasChanged2: ${jobRef.jobUp.locationId.newValue !== jobRef.jobUp.locationId.previousValue}`);
		
		return (
			<JobCard
				canSave={jobRef.jobUp.locationId.hasChanged}
			>
				
				{jobRef.locationConflicts.length > 0 && (
					<OverlappingJobs jobs={jobRef.locationConflicts}/>
				)}
				
				<SimHeader header={`Location: #${location.locationId}`}/>
				
				{jobRef.companyLocationMismatch && (
					<Txt
						hue={HUE.error}
						marB={6}
					>
						{jobRef.companyLocationMismatch}
					</Txt>
				)}
				
				<Txt b marB={4}>{location.locationName || location.address}</Txt>
				
				<Row>
					<Col grow shrink>
						{!location.street && (
							<Txt>{location.address}</Txt>
						)}
						<Txt>{location.streetNumber} {location.street}</Txt>
						<Txt>{location.locality}</Txt>
						<Txt>{location.state} {location.zip}</Txt>
						
						{!location.lastUpdate && (
							<Txt i hue={'#b41616'}>old location</Txt>
						)}
					
					</Col>
					
					<Butt
						on={() => openLocEditor(location, jobRef.company.companyId)}
						secondary
						icon={MdEdit}
						tooltip={'Edit Location or Directions'}
						subtle
						enabled={jobRef.hasCompany}
					/>
				</Row>
				
				<Txt i marT={8}>{location.directions}</Txt>
				
				<Row h={12}/>
				
				{!jobRef.isVri && (
					<Map
						h={200}
						location={location}
					/>
				)}
				
				<Butt
					on={() => jobRef.jobUp.locationId.Change(null)}
					icon={MdClear}
					subtle
					// mini
					tooltip={'Clear location'}
				/>
			
			</JobCard>
		)
	}
}

@observer
class NoLocation extends React.Component<C_JobView> {
	render() {
		const jobRef: JobRef = this.props.jobRef;
		const jobUp: JobUpdata = jobRef.jobUp;
		const openLocEditor = this.props.openLocEditor;
		
		return (
			<JobCard
				isInvalid={true}
				canSave={jobUp.locationId.hasChanged}
			>
				<SimHeader header={`Location`}/>
				
				<SelectorField
					state={jobUp.locationId}
					choices={jobRef.companyLocations.activeEntries}
					placeholder={'Select Location'}
					Change={(entry) => jobUp.locationId.Change(entry.key)}
				/>
				
				{/*<UpFieldSelectFromDat*/}
				{/*	dat={jobRef.companyLocations}*/}
				{/*	state={jobRef.jobUp.locationId}*/}
				{/*	keyer={'key'}*/}
				{/*	// choiceLabelKey={'address'}*/}
				{/*	choiceColorer={choice => choice.mapped ? '#000000' : '#bb0007'}*/}
				{/*	sorter={$j.sort.alphabetic('label')}*/}
				{/*	placeholder={'Select Location'}*/}
				{/*	grow*/}
				{/*	size={16}*/}
				{/*	// tabi={tabi + 0}*/}
				{/*/>*/}
				
				
				<Butt
					on={() => openLocEditor(null, jobRef.company.companyId)}
					icon={MdAdd}
					label={'New Location'}
					primary
					marT={24}
					enabled={jobRef.hasCompany}
				/>
			
			</JobCard>
		)
	}
}

@observer
class Map extends React.Component {
	render() {
		const {
			h = 200,
			location,
		} = this.props;
		
		const canShow = location && location.mapped && location.lat && location.lng;
		
		return (
			<Row h={h} hue={'#aaaaaa'}>
				{canShow && (
					<Goomap
						lat={location.lat}
						lng={location.lng}
						zoom={15}
					>
						<Row
							lat={location.lat}
							lng={location.lng}
							w={MARKER_SIZE}
							h={MARKER_SIZE}
							position={'absolute'}
							left={-MARKER_SIZE / 2}
							top={-MARKER_SIZE}
						>
							<MdLocationOn
								size={MARKER_SIZE}
								color={'#ab0014'}
							/>
						</Row>
					
					</Goomap>
				)}
			</Row>
		);
	}
}