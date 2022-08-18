import React from 'react';
import type {C_JobView} from './JobUpdate/JobBasics';
import {Ico, UpIco} from '../../Bridge/Bricks/Ico';
import {HUE} from '../../Bridge/HUE';
import {FaHistory} from 'react-icons/fa';
import {observer} from 'mobx-react';
import {MdHotTub} from 'react-icons/md';
import {FiVideo} from 'react-icons/fi';


@observer
export class VriIcon extends React.Component<C_JobView> {
	render() {
		const jobRef: JobRef = this.props.jobRef;
		
		return (
			<UpIco
				state={jobRef.jobUp.vri}
				icon={FiVideo}
				hue={HUE.job.vri}
				size={30}
				tooltip={'VRI'}
				marH={6}
			/>
		)
	}
}

@observer
export class FollowUpIcon extends React.Component<C_JobView> {
	render() {
		const jobRef: JobRef = this.props.jobRef;
		
		return (
			<UpIco
				state={jobRef.jobUp.followUp}
				icon={FaHistory}
				hue={HUE.job.followUp}
				size={30}
				tooltip={'Need to follow up'}
				marH={6}
			/>
		)
	}
}

@observer
export class HolidayIcon extends React.Component<C_JobView> {
	render() {
		const jobRef: JobRef = this.props.jobRef;
		
		if (!jobRef.holidays.length) return <></>;
		
		return (
			<Ico
				icon={MdHotTub}
				hue={'#747373'}
				size={30}
				tooltip={['Holiday:', ...jobRef.holidays]}
				marH={6}
			/>
		);
	}
}