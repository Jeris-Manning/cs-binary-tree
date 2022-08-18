import {observer} from 'mobx-react';
import React from 'react';
import type {C_SeekTerpInfo} from '../../../datum/stache/TerpDat';
import {TerpDat} from '../../../datum/stache/TerpDat';
import {computed} from 'mobx';
import {SeekTerpInfo} from '../../../datum/SeekTerpInfo';
import {Tip} from '../../../Bridge/misc/Tooltip';
import {Txt} from '../../../Bridge/Bricks/bricksShaper';

@observer
export class TerpDistance extends React.Component<C_SeekTerpInfo> {
	
	@computed get distance(): number | null {
		const info: SeekTerpInfo = this.props.seekTerpInfo;
		return info.distance;
	}
	
	render() {
		const info: SeekTerpInfo = this.props.seekTerpInfo;
		const terpDat: TerpDat = info.terpDat;
		
		let distance = this.distance;
		if (!distance) return <></>;
		
		distance = Math.round(distance);
		
		let label = `${distance}mi`;
		let hue = '#000';
		let tip = `Job is ${distance} miles away from home`;
		let b = false;
		
		if (distance < 1) {
			label = '<1';
			tip = `Job is VERY close to ${terpDat.firstName}'s home`;
			hue = '#276a05';
			b = true;
		} else if (distance > 99) {
			label = `99+`;
			hue = '#828282';
		}
		
		return (
			<Tip text={tip}>
				<Txt
					size={12}
					hue={hue}
					b={b}
					marL={4}
					w={26}
				>{label}</Txt>
			</Tip>
		);
	}
}