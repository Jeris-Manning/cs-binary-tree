import {observer} from 'mobx-react';
import React from 'react';
import {computed} from 'mobx';
import {Jewels} from '../../../stores/RootStore';
import $j from '../../../Bridge/misc/$j';
import {SimCard} from '../../../Bridge/misc/Card';
import {OverlappingJobs} from './JobDetails';
import {Col, Row, Txt} from '../../../Bridge/Bricks/bricksShaper';
import Butt from '../../../Bridge/Bricks/Butt';
import {MdChat, MdClose as Icon_Unchecked} from 'react-icons/md';
import Linker from '../../../Bridge/Nav/Linker';
import {Ico} from '../../../Bridge/Bricks/Ico';
import {FaMoneyBill} from 'react-icons/fa';
import {JobInterns} from './JobInterns';
import type {C_JobView} from './JobBasics';
import {JobCard} from './JobBasics';
import {Upstate} from '../../../Bridge/misc/Upstate';
import {HUE} from '../../../Bridge/HUE';

@observer
export class JobAssignedTerp extends React.Component<C_JobView> {
	
	@computed get canSave() {
		const jobUp = this.props.jobRef.jobUp;
		return Upstate.AnyChange(
			jobUp.terpId,
			jobUp.interns,
		);
	}
	
	render() {
		const jobRef: JobRef = this.props.jobRef;
		
		return (
			<>
				{jobRef.hasTerp ? (
					<AlreadyAssigned
						jobRef={jobRef}
					/>
				) : (
					<JobCard
						canSave={this.canSave}
					>
						<Txt b>No Interpreter Assigned</Txt>
						<Row h={12}/>
						<JobInterns
							jobRef={jobRef}
						/>
					</JobCard>
				)}
			</>
		);
	}
}


@observer
export class AlreadyAssigned extends React.Component<C_JobView> {
	@computed get warning() {
		// if (oSeek.seekersInOrder.length) return `Warning: ${oSeek.seekersInOrder.length} seekers still active.`;
		return '';
	}
	
	render() {
		const vJobSeek: vJobSeek = Jewels().vJobSeek;
		const jobRef: JobRef = this.props.jobRef;
		
		const terpDat = this.props.jobRef.terp;
		const terpId = terpDat.terpId;
		const phone = $j.format.phone(terpDat.phone);
		
		return (
			<SimCard>
				<Col fill hue={HUE.job.assignedTerpBg} padV={16} minHeight={100} childC>
					{jobRef.terpConflicts.length > 0 && (
						<OverlappingJobs jobs={jobRef.terpConflicts}/>
					)}
					
					<Row childCenterV>
						<Butt
							on={() => Jewels().vChat.OpenChat(terpId)}
							icon={MdChat}
							subtle
							marR={8}
						/>
						
						<Txt marR={8} size={18} b>Assigned: </Txt>
						
						<Linker toKey={'terp'} params={{terpId: terpId}}>
							<Txt size={20} b>{terpDat.label}</Txt>
						</Linker>
						
						<Butt
							on={() => vJobSeek.UnassignTerp(jobRef)}
							icon={Icon_Unchecked}
							subtle
							danger
							mini
							tooltip={'Remove'}
							marL={8}
							marT={3}
						/>
					</Row>
					
					<Row>
						<a href={`tel:${phone}`} target={'_blank'}>
							<Txt>{phone}</Txt>
						</a>
						
						<Ico
							icon={FaMoneyBill}
							tooltip={terpDat.rateSummary}
							size={20}
							marL={16}
						/>
					</Row>
					
					{this.warning && (
						<Txt marT={16}>{this.warning}</Txt>
					)}
					
					<Row h={12}/>
					
					<JobInterns jobRef={jobRef}/>
				
				</Col>
			</SimCard>
		);
	}
}