import React from 'react';
import {observer} from 'mobx-react';
import {Jewels, Staches} from 'stores/RootStore';
import {Col, Row, Txt} from '../../../Bridge/Bricks/bricksShaper';
import {HUE} from '../../../Bridge/HUE';
import {MdAssignmentInd, MdEdit, MdScreenLockLandscape, MdWarning} from 'react-icons/md';
import {Tip} from '../../../Bridge/misc/Tooltip';
import Linker from '../../../Bridge/Nav/Linker';
import {FaAmericanSignLanguageInterpreting, FaBirthdayCake} from 'react-icons/fa';
import {action, computed} from 'mobx';
import Butt from '../../../Bridge/Bricks/Butt';
import {Ico} from '../../../Bridge/Bricks/Ico';
import {OverlappingJobs} from '../JobUpdate/JobDetails';
import {SeekTerpInfoSummary} from './SeekWhyNot';
import type {C_DeafClutch, DeafKey} from '../../../datum/stache/DeafDat';
import {DeafDat} from '../../../datum/stache/DeafDat';
import type {C_JobView} from '../JobUpdate/JobBasics';
import {JobCard} from '../JobUpdate/JobBasics';
import type {DeafPref} from '../../../datum/stache/DeafPrefsDat';
import {DEAF_PREFS, DeafPrefsDat} from '../../../datum/stache/DeafPrefsDat';
import type {TerpKey} from '../../../datum/stache/TerpDat';
import {TerpDat} from '../../../datum/stache/TerpDat';
import {SeekTerpInfo} from '../../../datum/SeekTerpInfo';
import {Clutch} from '../../../Bridge/DockClient/Stache';

@observer
export class SeekDeafCard extends React.Component<C_JobView> {
	
	OpenDeafEditor = (deafKey: DeafKey) => {
		const vDeafEditor = Jewels().vDeafEditor;
		const jobRef: JobRef = this.props.jobRef;
		
		vDeafEditor.StartEdit(
			deafKey,
			jobRef.company.companyId,
			(key) => Jewels().vJobUpdate.AddDeafKey(jobRef, key),
		);
	};
	
	render() {
		const jobRef: JobRef = this.props.jobRef;
		
		const deafClutch: Clutch<DeafDat> = this.props.deafClutch;
		const deafDat: DeafDat = deafClutch.dat;
		
		const deafPrefClutch: Clutch<DeafPrefsDat> = this.props.deafPrefClutch;
		const deafPrefDat: DeafPrefsDat = deafPrefClutch.dat;
		
		const conflicts = jobRef.deafConflicts.filter(overlap => overlap.deafKeys.includes(deafDat.key));
		
		return (
			<JobCard
				{...this.props}
			>
				
				{conflicts.length > 0 && (
					<OverlappingJobs jobs={conflicts}/>
				)}
				
				<Row childC marB={8}>
					
					<Linker toKey={'deaf'} params={{deafId: deafDat.deafId}}>
						<Txt hue={HUE.blueDeep} size={'1.2rem'}>{deafDat.label}</Txt>
					</Linker>
					
					<Col grow/>
					
					<DeafNotesRow
						deafClutch={deafClutch}
					/>
					
					<Col w={16}/>
					
					<Butt
						on={() => this.OpenDeafEditor(deafClutch.key)}
						icon={MdEdit}
						tooltip={'Edit Deaf Profile'}
						secondary
						mini
						subtle
					/>
				
				</Row>
				
				<DeafHashtags
					deafClutch={deafClutch}
				/>
				
				<PrefsSection
					jobRef={jobRef}
					deafClutch={deafClutch}
					deafPrefClutch={deafPrefClutch}
				/>
			
			</JobCard>
		);
	}
}


@observer
class DeafNotesRow extends React.Component<C_DeafClutch> {
	render() {
		const deafClutch: Clutch<DeafDat> = this.props.deafClutch;
		const deafDat: DeafDat = deafClutch.dat;
		
		return (
			<>
				
				<Tip text={[`Date of Birth:`, deafDat.dob || 'unknown']}>
					<FaBirthdayCake
						size={14}
						color={deafDat.dob ? '#4b4b4b' : '#BFBFBF'}
					/>
				</Tip>
				
				<Col w={16}/>
				
				<Tip
					text={[`Notes in Deaf Profile:`, deafDat.notesDeafProfile || 'none']}
				>
					<MdAssignmentInd
						size={'1.6rem'}
						color={deafDat.notesDeafProfile ? '#4b4b4b' : '#BFBFBF'}
					/>
				</Tip>
				
				<Col w={16}/>
				
				<Tip text={[`Notes for TERP:`, deafDat.notesForTerp || 'none']}>
					<FaAmericanSignLanguageInterpreting
						size={'1.5rem'}
						color={deafDat.notesForTerp ? '#4b4b4b' : '#BFBFBF'}
					/>
				</Tip>
				
				<Col w={16}/>
				
				<Tip
					text={[`Notes for STAFF only:`, deafDat.notesForStaff || 'none']}
				>
					<MdScreenLockLandscape
						size={'1.6rem'}
						color={deafDat.notesForStaff ? '#4b4b4b' : '#BFBFBF'}
					/>
				</Tip>
				
			</>
		);
	}
}

@observer
class DeafHashtags extends React.Component<C_DeafClutch> {
	render() {
		const deafClutch: Clutch<DeafDat> = this.props.deafClutch;
		const deafDat: DeafDat = deafClutch.dat;
		
		if (!deafDat.hashtags || deafDat.hashtags.length === 0) return <></>;
		
		return (
			<Row
				childV
				marB={12}
				wrap
			>
				<Ico
					icon={MdWarning}
					hue={'#db1212'}
					size={18}
					marR={6}
				/>
				
				{deafDat.hashtags.map((tag, dex) => (
					<Txt
						key={`${deafDat.key}_${tag}_${dex}`}
						marR={6}
						hue={'#db1212'}
						size={18}
						b
					>{tag}</Txt>
				))}
			</Row>
		);
	}
}

@observer
class PrefsSection extends React.Component {
	render() {
		const jobRef: JobRef = this.props.jobRef;
		const deafPrefClutch: Clutch<DeafPrefsDat> = this.props.deafPrefClutch;
		const deafPrefDat: DeafPrefsDat = deafPrefClutch.dat;
		
		return (
			<>
				<PrefGroup
					pref={DEAF_PREFS.general}
					terpKeys={deafPrefDat.prefs.general}
					jobRef={jobRef}
				/>
				<PrefGroup
					pref={DEAF_PREFS.business}
					terpKeys={deafPrefDat.prefs.business}
					jobRef={jobRef}
				/>
				<PrefGroup
					pref={DEAF_PREFS.medical}
					terpKeys={deafPrefDat.prefs.medical}
					jobRef={jobRef}
				/>
				<PrefGroup
					pref={DEAF_PREFS.edu}
					terpKeys={deafPrefDat.prefs.edu}
					jobRef={jobRef}
				/>
				
				<PrefGroup
					pref={DEAF_PREFS.no}
					terpKeys={deafPrefDat.noTerps}
					jobRef={jobRef}
					noList
				/>
			</>
		);
	}
}

@observer
class PrefGroup extends React.Component {
	render() {
		const jobRef: JobRef = this.props.jobRef;
		const pref: DeafPref = this.props.pref;
		const terpKeys: TerpKey[] = this.props.terpKeys || [];
		const noList: boolean = this.props.noList;
		
		const terpCount = terpKeys.length;
		const lastDex = terpCount - 1;
		
		if (terpCount === 0) return <></>;
		
		return (
			<Row
				marT={4}
				childV
				wrap
			>
				<Ico
					icon={pref.icon}
					marR={4}
				/>
				<Txt
					marR={12}
					hue={HUE.grey}
				>{pref.label}:</Txt>
				
				{terpCount > 0 ? (
					terpKeys.map((terpKey, dex) => (
						<SeekPrefName
							key={terpKey}
							terpKey={terpKey}
							jobRef={jobRef}
							noList={noList}
							comma={dex !== lastDex}
						/>
					))
				) : (
					<></>
				)}
			</Row>
		);
	}
}

@observer
export class SeekPrefName extends React.Component<C_JobView> {
	
	@computed get terpDat(): TerpDat {
		return this.props.terpDat
			|| Staches().cTerp.GetOrStub(this.props.terpKey, true, 'SeekPrefName').dat;
	}
	
	@computed get label(): string {
		const label = this.terpDat.label;
		if (this.props.comma) return `${label},`;
		return label;
	}
	
	@computed get seekTerpInfo(): SeekTerpInfo {
		const jobRef: JobRef = this.props.jobRef;
		return jobRef.seekInfo.get(this.props.terpKey) || {};
	}
	
	@computed get isPickable(): boolean {
		if (this.props.noList) return false;
		return this.seekTerpInfo.canPick;
	}
	
	render() {
		const jobRef: JobRef = this.props.jobRef;
		let hue;
		let b;
		let onClick;
		let tip;
		
		if (this.isPickable) {
			hue = '#33843d';
			b = true;
			onClick = () => Jewels().vJobSeek.SelectTerp(jobRef, this.terpDat);
		} else {
			hue = this.props.noList
				? HUE.labelRed
				: '#464646';
			tip = (
				<JobCard>
					<SeekTerpInfoSummary info={this.seekTerpInfo}/>
				</JobCard>
			);
			
			console.log(`SeekPrefName can't pick ${this.terpDat.terpId}`, this.seekTerpInfo);
		}
		
		return (
			<Tip text={tip}>
				<Row
					onClick={onClick}
					marR={3}
				>
					<Txt
						hue={hue}
						b={b}
					>
						{this.label}
					</Txt>
				</Row>
			</Tip>
		);
	}
}

@observer
export class SeekDeafSection extends React.Component<C_JobView> {
	
	@action OpenDeafEditor = (deafKey: DeafKey) => {
		const jobRef: JobRef = this.props.jobRef;
		const vDeafEditor = Jewels().vDeafEditor;
		const vJobUpdate = Jewels().vJobUpdate;
		
		return vDeafEditor.StartEdit(
			deafKey,
			jobRef.company.companyId,
			vJobUpdate.AddDeafKey,
		);
	};
	
	render() {
		const jobRef: JobRef = this.props.jobRef;
		const deafs: Clutch<DeafDat>[] = jobRef.deafs;
		const deafPrefs: Clutch<DeafPrefsDat>[] = jobRef.deafPrefs;
		
		console.log(`SeekDeafSection, DeafPref: ${jobRef.deafPrefs.length}`, jobRef.deafPrefs);
		
		// 0 deafs
		if (deafs.length === 0) return (
			<JobCard invalid>
				<Txt b size={18}>Missing Deaf Names!</Txt>
			</JobCard>
		);
		
		// 1 deaf
		if (deafs.length === 1) return (
			<SeekDeafCard
				jobRef={jobRef}
				deafClutch={deafs[0]}
				deafPrefClutch={deafPrefs[0]}
				onEdit={this.OpenDeafEditor}
			/>
		);
		
		// 2+ deafs
		return (
			<>
				{deafs.map((deafClutch, dex) => (
					<SeekDeafCard
						key={deafClutch.key}
						jobRef={jobRef}
						deafClutch={deafClutch}
						deafPrefClutch={deafPrefs[dex]}
						marV={2}
						onEdit={this.OpenDeafEditor}
					/>
				))}
			</>
		);
	}
}