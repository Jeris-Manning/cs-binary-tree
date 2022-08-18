import {observer} from 'mobx-react';
import React from 'react';
import thyme from '../../../Bridge/thyme';
import {Blink} from '../../../Bridge/misc/Iconic';
import Linker from '../../../Bridge/Nav/Linker';
import {Ico} from '../../../Bridge/Bricks/Ico';
import {TiWarning} from 'react-icons/ti';
import {DeafDat} from '../../../datum/stache/DeafDat';
import type {C_JobView} from './JobBasics';
import {OverlapEntry} from './JobOverlapDat';

@observer
export class JobDeafScheduleConflict extends React.Component<C_JobView> {
	render() {
		const jobRef: JobRef = this.props.jobRef;
		const deafDat: DeafDat = this.props.deafDat;
		const deafKey = deafDat.key;
		
		const conflicts = jobRef.deafConflicts.filter(job => job.deafKeys.includes(deafKey));
		if (!conflicts.length) return <></>;
		
		const conflict: OverlapEntry = conflicts[0];
		
		const tooltip = ([
			`Conflict:`,
			conflict.jobKey,
			thyme.nice.time.short(conflict.start),
			thyme.nice.time.short(conflict.end),
			// conflict.companyName,
			// conflict.address,
			// conflict.region,
		]);
		
		return (
			<Blink>
				<Linker toKey={'job'} params={{jobId: conflict.jobKey, tab: 'details'}}>
					<Ico
						icon={TiWarning}
						tooltip={tooltip}
						hue={'#d20022'}
						marR={4}
					/>
				</Linker>
			</Blink>
		);
	}
}