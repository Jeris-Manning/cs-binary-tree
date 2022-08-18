import React from 'react';
import $j from '../../../Bridge/misc/$j';
import {Col, Row, Txt} from '../../../Bridge/Bricks/bricksShaper';
import {Ico} from '../../../Bridge/Bricks/Ico';
import {MdFiberNew, MdHelp, MdWarning} from 'react-icons/md';
import {observer} from 'mobx-react';
import {Tip} from '../../../Bridge/misc/Tooltip';
import {TiPin} from 'react-icons/ti';
import {Jewels} from '../../../stores/RootStore';
import {HUE} from '../../../Bridge/HUE';
import {FaExclamationCircle} from 'react-icons/fa';

@observer
export class SeekingNav extends React.Component {
	render() {
		const {
			nav,
			selected,
			borderLeftHue,
			bgHue,
			textHue,
			isHovering,
			SetHover,
		} = this.props;
		
		const Icon = nav.icon || MdHelp;
		
		const vBids = Jewels().vBids;
		
		const newBids = vBids.bidsNewCount;
		const ackBids = vBids.bidsAckedCount;
		const issueCount = vBids.issuesCount;
		
		return (
			<Row
				h={48}
				padR={12}
				hue={bgHue}
				childV
				onMouseEnter={() => SetHover(true)}
				onMouseLeave={() => SetHover(false)}
				wFill
			>
				
				<Col w={6} hFill hue={borderLeftHue}/>
				
				<Ico
					icon={Icon}
					size={18}
					hue={textHue}
					marL={10}
				/>
				
				<Txt
					hue={textHue}
					marL={10}
					size={16}
					// semibold
				>{nav.name}</Txt>
				
				<Col grow/>
				
				<Status
					// hue={'#c6c9cb'}
					icon={TiPin}
					count={ackBids}
					tip={`${$j.pluralCount(ackBids, 'bid')} being worked on`}
					selected={selected}
				/>
				
				<Col grow/>
				
				<Status
					hue={HUE.navMenu.newBids}
					icon={MdFiberNew}
					count={newBids}
					tip={`${$j.pluralCount(newBids, 'new bid')}`}
					selected={selected}
				/>
				
				<Col grow/>
				
				<Status
					hue={HUE.navMenu.issues}
					icon={FaExclamationCircle}
					count={issueCount}
					tip={`${$j.pluralCount(issueCount, 'issue')}`}
					selected={selected}
					iconSize={15}
				/>
			
			</Row>
		);
	}
}

@observer
class Status extends React.Component {
	render() {
		const {
			hue,
			icon,
			iconSize,
			count,
			tip,
			selected,
		} = this.props;
		
		const bgHue = count > 0 ? hue : undefined;
		const textHue = count > 0
			? selected ? '#000' : '#fff'
			: '#949494';
		
		return (
			<Tip text={tip}>
				<Col
					childH
				>
					<Col
						childC
						h={18}
					>
						<Ico
							icon={icon}
							size={iconSize || 18}
							hue={'#bebebe'}
						/>
					</Col>
					
					<Col
						hue={bgHue}
						childH
						marT={2}
						grow
						padH={4}
						padT={4}
						padB={2}
					>
						<Txt
							size={14}
							hue={textHue}
							// b
							noHoliday
							lineH={1}
							center
						>
							{count || '0'}
						</Txt>
					</Col>
				</Col>
			</Tip>
		);
	}
}