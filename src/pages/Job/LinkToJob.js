import {observer} from 'mobx-react';
import React from 'react';
import Linker from '../../Bridge/Nav/Linker';
import type {JobId, JobKey} from '../../datum/stache/JobDat';
import {JobIdTxts, JobTabKey} from './JobUpdate/JobBasics';

export const TO_JOB = {
	details: (jobId) => ({jobId: jobId, tab: 'details'}),
	seek: (jobId) => ({jobId: jobId, tab: 'seek'}),
	billing: (jobId) => ({jobId: jobId, tab: 'billing'}),
	linked: (jobId) => ({jobId: jobId, tab: 'linked'}),
	
	withKey: (key, jobId) => (TO_JOB[key] || TO_JOB.details)(jobId),
}

export type T_LinkToJob = {
	jobId: JobId|JobKey,
	tabKey?: JobTabKey,
	txtStyle?: any,
}

@observer
export class LinkToJob extends React.Component<T_LinkToJob> {
	render() {
		const jobId = this.props.jobId;
		const tabKey = this.props.tabKey || 'details';
		const txtStyle = this.props.txtStyle;
		
		return (
			<Linker
				toKey={'job'}
				params={TO_JOB.withKey(tabKey, jobId)}
			>
				<JobIdTxts
					jobId={jobId}
					{...txtStyle}
				/>
			</Linker>
		)
	}
}