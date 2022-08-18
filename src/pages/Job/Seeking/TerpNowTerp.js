import {observer} from 'mobx-react';
import React from 'react';
import type {C_SeekTerpInfo} from '../../../datum/stache/TerpDat';
import {TerpDat} from '../../../datum/stache/TerpDat';
import thyme from '../../../Bridge/thyme';
import {Ico} from '../../../Bridge/Bricks/Ico';
import {MdAccessTime} from 'react-icons/md';
import {SeekTerpInfo} from '../../../datum/SeekTerpInfo';

@observer
export class TerpNowTerp extends React.Component<C_SeekTerpInfo> {
	render() {
		const jobRef: JobRef = this.props.jobRef;
		const info: SeekTerpInfo = this.props.seekTerpInfo;
		const terpDat: TerpDat = info.terpDat;
		
		const entry = jobRef.terpNowTerpEntries.get(terpDat.key);
		if (!entry) return <></>;
		
		const tooltip = ([
			`NowTerp:`,
			thyme.nice.time.short(entry.start),
			thyme.nice.time.short(entry.end),
			entry.note,
		]);
		
		return (
			<Ico
				icon={MdAccessTime}
				tooltip={tooltip}
				hue={'#86ad00'}
				marR={4}
			/>
		);
	}
}