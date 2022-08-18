import {observer} from 'mobx-react';
import {Jewels, Staches} from 'stores/RootStore';
import React from 'react';
import {Txt} from '../../../Bridge/Bricks/bricksShaper';
import {Ico} from '../../../Bridge/Bricks/Ico';
import {IoMdInformationCircleOutline} from 'react-icons/io';
import {FaExclamationCircle} from 'react-icons/fa';
import {computed} from 'mobx';
import type {C_JobView} from '../JobUpdate/JobBasics';
import {LinkedSeriesUpdata, SeriesJobEntry} from '../../../datum/LinkedSeriesUpdata';
import {JobDiffInfo} from './JobDiffInfo';
import $j from '../../../Bridge/misc/$j';

@observer
export class JobDiff extends React.Component<C_JobView> {
	
	@computed get diffInfo(): JobDiffInfo {
		const jobRef: JobRef = this.props.jobRef;
		const jobEntry: SeriesJobEntry = this.props.jobEntry;
		return jobRef.seriesUp.diffs.get(jobEntry.key);
	}
	
	@computed get diffStrings(): string[] {
		if (!this.diffInfo) return [];
		const jobRef: JobRef = this.props.jobRef;
		const seriesUp: LinkedSeriesUpdata = jobRef.seriesUp;
		
		let diffStrings = [];
		for (let [fieldKey, str] of this.diffInfo.diffs.entries()) {
			if (!str) continue; // no diff
			if (!seriesUp.pushFields.value.get(fieldKey)) continue; // field not enabled
			
			diffStrings.push(str);
		}
		return diffStrings;
	}
	
	@computed get diffsText(): string {
		if (this.diffStrings.length === 0) return '';
		return [
			$j.pluralCount(this.diffStrings.length, 'DIFFERENCE', 'S'),
			'',
			...this.diffStrings
		];
	}
	
	render() {
		if (!this.diffsText) {
			return (
				<Ico
					icon={IoMdInformationCircleOutline}
					tooltip={`No differences with current job`}
					hue={'#34ad0e'}
				/>
			);
		}
		
		return (
			<Ico
				icon={FaExclamationCircle}
				tooltip={this.diffsText}
				hue={'#e50909'}
				size={24}
			/>
		);
	}
}