import React from 'react';
import {observer} from 'mobx-react';
import {Jewels, Staches} from 'stores/RootStore';
import {action, computed} from 'mobx';
import {SimHeader} from '../../../Bridge/misc/Card';
import Butt from '../../../Bridge/Bricks/Butt';
import {MdAssignmentInd, MdClear, MdEdit, MdPersonAdd, MdScreenLockLandscape} from 'react-icons/md';
import {Row, Txt} from '../../../Bridge/Bricks/bricksShaper';
import Linker from '../../../Bridge/Nav/Linker';
import {Tip} from '../../../Bridge/misc/Tooltip';
import {Col} from '../../../Bridge/Bricks/bricksShaper';
import {FaAmericanSignLanguageInterpreting, FaBirthdayCake} from 'react-icons/fa';
import type {C_JobView} from './JobBasics';
import {JobCard} from './JobBasics';
import type {DeafKey} from '../../../datum/stache/DeafDat';
import {DeafDat} from '../../../datum/stache/DeafDat';
import {JobDeafScheduleConflict} from './JobDeafScheduleConflict';
import {SelectorField} from '../../../Bridge/misc/SelectorField';
import {Clutch} from '../../../Bridge/DockClient/Stache';

@observer
export class JobDeaf extends React.Component<C_JobView> {
	
	OpenDeafEditor = (deafKey: DeafKey) => {
		const vDeafEditor = Jewels().vDeafEditor;
		const jobRef: JobRef = this.props.jobRef;
		
		vDeafEditor.StartEdit(
			deafKey,
			jobRef.company.companyId,
			(key) => Jewels().vJobUpdate.AddDeafKey(jobRef, key),
		);
	};
	
	NewDeafEditor = () => this.OpenDeafEditor();
	
	@action Add = (deafKey: DeafKey) => {
		const vJobUpdate = Jewels().vJobUpdate;
		const jobRef: JobRef = this.props.jobRef;
		vJobUpdate.AddDeafKey(jobRef, deafKey);
	}
	
	@action Remove = (deafKey: DeafKey) => {
		const vJobUpdate = Jewels().vJobUpdate;
		const jobRef: JobRef = this.props.jobRef;
		vJobUpdate.RemoveDeafKey(jobRef, deafKey);
	}
	
	@computed get isInvalid() {
		const jobUp = this.props.jobRef.jobUp;
		return !jobUp.deafIds.value || jobUp.deafIds.value.length === 0;
	}
	
	@computed get canSave() {
		const jobUp = this.props.jobRef.jobUp;
		return jobUp.deafIds.hasChanged;
	}
	
	render() {
		// const {
		// 	tabi
		// } = this.props;
		const jobRef: JobRef = this.props.jobRef;
		const jobUp = jobRef.jobUp;
		
		return (
			<>
				
				<JobCard
					isInvalid={this.isInvalid}
					canSave={this.canSave}
				>
					<SimHeader header={'Deaf Names'}/>
					
					{jobUp.deafIds.value.map(deafId => (
						<DeafRow
							key={deafId}
							deafId={deafId}
							onEdit={() => this.OpenDeafEditor(deafId)}
							onRemove={() => this.Remove(deafId)}
							jobRef={jobRef}
						/>
					))}
					
					<Row>
						
						<SelectorField
							state={{}}
							Change={(entry) => this.Add(entry.key)}
							choices={jobRef.companyDeafs.activeEntries}
							placeholder={'Add Deaf Person'}
							// tabi={tabi}
							hideOutline
							grow
						/>
						
						<Butt
							on={this.NewDeafEditor}
							icon={MdPersonAdd}
							primary
							tooltip={'Add New Deaf Person'}
							marL={12}
						/>
					</Row>
				
				</JobCard>
			
			</>
		);
	}
}

@observer
export class DeafRow extends React.Component<C_JobView> {
	
	@computed get deafDat(): DeafDat {
		return Staches().cDeaf
			.GetOrStub(this.props.deafId, true, 'JobDeaf.DeafRow')
			.dat;
	}
	
	render() {
		const jobRef: JobRef = this.props.jobRef;
		const onEdit = this.props.onEdit;
		const onRemove = this.props.onRemove;
		
		const deafDat: DeafDat = this.deafDat;
		
		// console.log(`DeafRow ${this.props.deafId}`, deafDat);
		
		return (
			<Row
				marB={6}
				childCenterV
			>
				<Butt
					on={onRemove}
					icon={MdClear}
					tooltip={'Remove deaf person from job'}
					danger
					mini
					subtle
				/>
				
				<Col w={8}/>
				
				<Linker toKey={'deaf'} params={{deafId: deafDat.deafId}}>
					<Txt>{deafDat.label}</Txt>
				</Linker>
				
				<Col grow minWidth={8}/>
				
				<JobDeafScheduleConflict
					jobRef={jobRef}
					deafDat={deafDat}
				/>
				
				<Tip text={[`Date of Birth: `, `${deafDat.dob || 'unknown'}`]}>
					<FaBirthdayCake
						size={14}
						color={deafDat.dob ? '#4b4b4b' : '#BFBFBF'}
					/>
				</Tip>
				
				<Col w={8}/>
				
				<Tip
					text={[`Notes in Deaf Profile: `, `${deafDat.notesDeafProfile || 'none'}`]}
				>
					<MdAssignmentInd
						size={'1.6rem'}
						color={deafDat.notesDeafProfile ? '#4b4b4b' : '#BFBFBF'}
					/>
				</Tip>
				
				<Col w={8}/>
				
				<Tip text={[`Notes for TERP: `, `${deafDat.notesForTerp || 'none'}`]}>
					<FaAmericanSignLanguageInterpreting
						size={'1.5rem'}
						color={deafDat.notesForTerp ? '#4b4b4b' : '#BFBFBF'}/>
				</Tip>
				
				<Col w={8}/>
				
				<Tip text={[`Notes for STAFF only: `, `${deafDat.notesForStaff || 'none'}`]}>
					<MdScreenLockLandscape
						size={'1.6rem'}
						color={deafDat.notesForStaff ? '#4b4b4b' : '#BFBFBF'}
					/>
				</Tip>
				
				<Col w={16}/>
				
				<Butt
					on={onEdit}
					icon={MdEdit}
					tooltip={'Edit Deaf Profile'}
					secondary
					mini
					subtle
				/>
			</Row>
		);
	}
}