import {observer} from 'mobx-react';
import React from 'react';
import type {C_SeekTerpInfo} from '../../../datum/stache/TerpDat';
import {SeekTerpInfo} from '../../../datum/SeekTerpInfo';
import {computed} from 'mobx';
import thyme from '../../../Bridge/thyme';
import {MdFavoriteBorder, MdHelp, MdThumbDown} from 'react-icons/md';
import {GiWoodenSign} from 'react-icons/gi';
import {Tip} from '../../../Bridge/misc/Tooltip';
import {Col} from '../../../Bridge/Bricks/bricksShaper';

@observer
export class TerpSeekerStatus extends React.Component<C_SeekTerpInfo> {
	
	@computed get iconData() {
		const info: SeekTerpInfo = this.props.seekTerpInfo;
		const seeker = info.seeker;
		
		if (!seeker) return {};
		
		if (seeker.declinedAt) return {
			tooltip: `Declined at ${thyme.nice.dateTime.short(seeker.declinedAt)}`,
			hue: '#d20022',
			icon: MdThumbDown,
		};
		if (seeker.hiddenAt) return {
			tooltip: `Hidden at ${thyme.nice.dateTime.short(seeker.hiddenAt)}`,
			hue: '#d20022',
			icon: GiWoodenSign,
		};
		if (seeker.bidAt) return {
			tooltip: `Bid at ${thyme.nice.dateTime.short(seeker.bidAt)}`,
			hue: '#00ab0e',
			icon: GiWoodenSign,
		};
		if (seeker.seenAt) return {
			tooltip: `Seen at ${thyme.nice.dateTime.short(seeker.seenAt)}`,
			hue: '#abb13b',
			icon: GiWoodenSign,
		};
		if (seeker.isRequested) return {
			tooltip: `Requested at ${thyme.nice.dateTime.short(seeker.sentAt)}`,
			hue: '#717171',
			icon: MdFavoriteBorder,
		};
		return {
			tooltip: `Posted at ${thyme.nice.dateTime.short(seeker.sentAt)}`,
			hue: '#717171',
			icon: GiWoodenSign,
		};
	}
	
	@computed get icon() {
		const {seeker} = this.props;
		if (!seeker) return <MdHelp/>;
		return seeker.isRequested
			? (seeker.declinedAt ? MdThumbDown : MdFavoriteBorder)
			: GiWoodenSign;
	}
	
	render() {
		const info: SeekTerpInfo = this.props.seekTerpInfo;
		const seeker = info.seeker;
		if (!seeker) {
			return (
				<Col w={16}/>
			)
		}
		
		const data = this.iconData;
		const Icon = data.icon;
		
		return (
			<Tip text={[`${data.tooltip}`,`${seeker.description}`]}>
				<Icon color={data.hue}/>
			</Tip>
		);
	}
}