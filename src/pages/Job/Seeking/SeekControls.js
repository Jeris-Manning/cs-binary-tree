import React from 'react';
import {observer} from 'mobx-react';
import {Jewels} from 'stores/RootStore';
import Butt from '../../../Bridge/Bricks/Butt';
import {Row} from '../../../Bridge/Bricks/bricksShaper';
import {MdFavorite, MdVolumeOff} from 'react-icons/md';
import {GiWoodenSign} from 'react-icons/gi';
import type {C_JobView} from '../JobUpdate/JobBasics';
import {JobCard} from '../JobUpdate/JobBasics';
import {UpField} from '../../../Bridge/misc/UpField';
import {SeekUpdata} from '../../../datum/SeekUpdata';
import {computed} from 'mobx';


@observer
export class SeekOpenJobBoard extends React.Component<C_JobView> {
	
	@computed get canPost(): boolean {
		const jobRef: JobRef = this.props.jobRef;
		const seekUp: SeekUpdata = jobRef.seekUp;
		
		return jobRef.selectedTerpsCount > 0
			&& seekUp.openDescription.value;
	}
	
	render() {
		const jobRef: JobRef = this.props.jobRef;
		const seekUp: SeekUpdata = jobRef.seekUp;
		const openDescription = seekUp.openDescription;
		
		const vJobSeek = Jewels().vJobSeek;
		
		return (
			<JobCard>
				
				<UpField
					label={'Post Open'}
					state={openDescription}
					multiline
					h={80}
				/>
				
				<Row marT={12}>
					<Butt
						on={() => vJobSeek.MakeOpenSeekers(jobRef, false, false)}
						primary
						icon={GiWoodenSign}
						disabled={!this.canPost}
						label={`Open (${jobRef.selectedTerpsCount})`}
						grow
						tooltip={`Sends app notification`}
						alert={'Posting...'}
						alertAfter={'Posted!'}
					/>
					
					<Butt
						on={() => vJobSeek.MakeOpenSeekers(jobRef, true, false)}
						primary
						mini
						icon={MdVolumeOff}
						disabled={!this.canPost}
						tooltip={`Post silently (no notification)`}
						w={60}
						marL={12}
						alert={'Posting...'}
						alertAfter={'Posted!'}
					/>
				</Row>
				
				<Butt
					on={() => vJobSeek.MakeOpenSeekers(jobRef, false, true)}
					secondary
					disabled={!this.canPost}
					label={`Open & send email/text`}
					grow
					marT={8}
					tooltip={[
						`Sends app notification`,
						`AND email/text (legacy paging)`
					]}
					alert={'Posting...'}
					alertAfter={'Posted!'}
				/>
			</JobCard>
		);
	}
}

@observer
export class SeekRequestInterpreter extends React.Component<C_JobView> {
	
	@computed get canPost(): boolean {
		const jobRef: JobRef = this.props.jobRef;
		const seekUp: SeekUpdata = jobRef.seekUp;
		
		return jobRef.selectedTerpsCount > 0
			&& (seekUp.requestMessage.value || seekUp.openDescription.value);
	}
	
	render() {
		const jobRef: JobRef = this.props.jobRef;
		const seekUp: SeekUpdata = jobRef.seekUp;
		const requestMessage = seekUp.requestMessage;
		const openDescription = seekUp.openDescription;
		
		const vJobSeek = Jewels().vJobSeek;
		
		return (
			<JobCard>
				
				<UpField
					label={'Post Request'}
					state={requestMessage}
					placeholder={openDescription.value}
					multiline
					h={80}
				/>
				
				<Row marT={12}>
					<Butt
						on={() => vJobSeek.MakeRequestSeekers(jobRef)}
						primary
						icon={MdFavorite}
						disabled={!this.canPost}
						label={`Request (${jobRef.selectedTerpsCount})`}
						grow
						tooltip={`Sends app notification`}
						alert={'Requesting...'}
						alertAfter={'Requested!'}
					/>
					
					<Butt
						on={() => vJobSeek.MakeRequestSeekers(jobRef, true)}
						primary
						mini
						icon={MdVolumeOff}
						disabled={!this.canPost}
						tooltip={`Request silently (no notification)`}
						w={60}
						marL={12}
						alert={'Requesting...'}
						alertAfter={'Requested!'}
					/>
				</Row>
			</JobCard>
		);
	}
}