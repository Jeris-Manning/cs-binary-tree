import {observer} from 'mobx-react';
import React from 'react';
import {action, computed} from 'mobx';
import {SimCard} from '../../../Bridge/misc/Card';
import {Col, Row, Txt} from '../../../Bridge/Bricks/bricksShaper';
import {MdClose, MdDone} from 'react-icons/md';
import {HUE} from '../../../Bridge/HUE';
import type {C_JobView} from '../JobUpdate/JobBasics';
import {IconFilter} from '../../../components/IconFilter';
import {SeekUpdata} from '../../../datum/SeekUpdata';
import {SelectorField} from '../../../Bridge/misc/SelectorField';
import {UpTog} from '../../../Bridge/misc/UpField';
import {NowTerpFilterEntry} from '../../../datum/SeekerFiltersDef';

@observer
export class SeekFilters extends React.Component<C_JobView> {
	
	render() {
		const jobRef: JobRef = this.props.jobRef;
		const seekUp: SeekUpdata = jobRef.seekUp;
		
		return (
			<>
				<SimCard>
					<DemandFilters jobRef={jobRef}/>
				</SimCard>
				
				<SimCard marT={2}>
					<Row childSpread wrap>
						<TagFilters jobRef={jobRef}/>
					</Row>
					
					<Row marT={4} wrap>
						<SeekerFilters jobRef={jobRef}/>
						<NowTerpFilter jobRef={jobRef}/>
					</Row>
					
					<Row h={8}/>
					
					<Row wrap>
						
						<SelectorField
							state={seekUp.regionFilters}
							choices={jobRef.regionChoices}
							placeholder={'Region'}
							multiple
							grow
							minW={'35%'}
							marT={12}
							marH={4}
						/>
						
						<SelectorField
							state={seekUp.specialtyFilters}
							choices={jobRef.specialtyChoices}
							placeholder={'Specialty'}
							multiple
							grow
							minW={'35%'}
							marT={12}
							marH={4}
						/>
					
					</Row>
				
				</SimCard>
			</>
		);
	}
}

@observer
class TagFilters extends React.Component<C_JobView> {
	render() {
		const jobRef: JobRef = this.props.jobRef;
		const seekUp: SeekUpdata = jobRef.seekUp;
		
		return (
			<>
				{jobRef.tagClutch.dat.entries.map(entry => (
					<IconFilter
						key={entry.key}
						filterKey={entry.key}
						state={seekUp.tagFilters}
						clutch={jobRef.tagClutch}
					/>
				))}
			</>
		);
	}
}

@observer
class SeekerFilters extends React.Component<C_JobView> {
	render() {
		const jobRef: JobRef = this.props.jobRef;
		const seekUp: SeekUpdata = jobRef.seekUp;
		
		return (
			<>
				{jobRef.seekerFilters.map(entry => (
					<IconFilter
						key={entry.key}
						filterKey={entry.key}
						state={seekUp.seekerFilters}
						entry={entry}
						marL={4}
						marR={8}
					/>
				))}
			</>
		);
	}
}

@observer
class NowTerpFilter extends React.Component {
	render() {
		const jobRef: JobRef = this.props.jobRef;
		const seekUp: SeekUpdata = jobRef.seekUp;
		
		return (
			<IconFilter
				entry={NowTerpFilterEntry}
				state={seekUp.nowTerpFilter}
				useSingleStatus
				marL={4}
				marR={8}
			/>
		)
	}
}

@observer
class DemandFilters extends React.Component<C_JobView> {
	render() {
		const jobRef: JobRef = this.props.jobRef;
		const seekUp: SeekUpdata = jobRef.seekUp;
		
		return (
			<>
				<Row childCenterV>
					<Txt hue={HUE.blueDeep} size={'1.2rem'}>
						Demands
					</Txt>
					
					<Col marL={24} marT={4}>
						<UpTog
							state={seekUp.showAllDemands}
							label={'Show All'}
						/>
					</Col>
				</Row>
				
				<Row h={4}/>
				
				{jobRef.demandChoices.map(demand => (
						<DemandRow
							key={demand.key}
							demand={demand}
							jobRef={jobRef}
						/>
					)
				)}
			</>
		);
	}
}

@observer
class DemandRow extends React.Component<C_JobView> {
	
	@computed get status() {
		const seekUp: SeekUpdata = this.props.jobRef.seekUp;
		const state = seekUp.demands;
		const demand = this.props.demand;
		
		const wasSet = state.previousValue
			.some(val => val.key === demand.key);
		
		const isSet = state.value
			.some(val => val.key === demand.key);
		
		const isShown = isSet
			|| wasSet
			|| seekUp.showAllDemands.value;
		
		return {wasSet, isSet, isShown};
	}
	
	// optimization: @computed uses comparer.default
	@computed get wasSet() { return this.status.wasSet; }
	@computed get isSet() { return this.status.isSet; }
	@computed get isShown() { return this.status.isShown; }
	
	@action Toggle = () => {
		const state = this.props.jobRef.seekUp.demands;
		if (this.isSet) state.Remove(this.props.demand);
		else state.Add(this.props.demand);
	};
	
	render() {
		// trace();
		
		const {
			label,
		} = this.props.demand;
		
		const wasSet = this.wasSet;
		const isSet = this.isSet;
		const isShown = this.isShown;
		
		if (!isShown) {
			return <></>;
		}
		
		let color;
		let icon;
		let lineThrough = false;
		let b = false;
		
		if (isSet) {
			color = wasSet ? '#000000' : '#000ba7';
			icon = <MdDone color={color}/>;
			lineThrough = false;
			b = !wasSet;
		} else {
			color = wasSet ? '#cf0005' : '#7c7c7c';
			icon = <MdClose color={color}/>;
			lineThrough = wasSet;
			b = wasSet;
		}
		
		return (
			<Row
				onClick={this.Toggle}
				marB={3}
			>
				<Col marT={2}>
					{icon}
				</Col>
				<Txt
					marH={6}
					hue={color}
					lineThrough={lineThrough}
					b={b}
				>{label}</Txt>
			</Row>
		);
	}
}
