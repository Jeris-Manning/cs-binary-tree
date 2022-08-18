import {observer} from 'mobx-react';
import React from 'react';
import type {C_SeekTerpInfo} from '../../../datum/stache/TerpDat';
import {TerpDat} from '../../../datum/stache/TerpDat';
import thyme from '../../../Bridge/thyme';
import {Blink} from '../../../Bridge/misc/Iconic';
import Linker from '../../../Bridge/Nav/Linker';
import {Ico} from '../../../Bridge/Bricks/Ico';
import {TiWarning} from 'react-icons/ti';
import {SeekTerpInfo} from '../../../datum/SeekTerpInfo';

@observer
export class TerpScheduleConflict extends React.Component<C_SeekTerpInfo> {
	render() {
		const jobRef: JobRef = this.props.jobRef;
		const info: SeekTerpInfo = this.props.seekTerpInfo;
		const terpDat: TerpDat = info.terpDat;
		
		const conflict = jobRef.anyOverlapByTerpKey.get(terpDat.key);
		if (!conflict) return <></>;
		
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