import {observer} from 'mobx-react';
import React from 'react';
import {Jewels} from '../../stores/RootStore';
import Butt from '../../Bridge/Bricks/Butt';
import {FaChevronLeft, FaChevronRight} from 'react-icons/fa';
import {Col, Row, Txt} from '../../Bridge/Bricks/bricksShaper';
import {MdContentCopy} from 'react-icons/md';
import {JobWatchers} from './JobUpdate/JobWatchers';
import {Tip} from '../../Bridge/misc/Tooltip';
import thyme from '../../Bridge/thyme';
import {StaffAvatar} from '../../components/Avatar';
import {Ico} from '../../Bridge/Bricks/Ico';
import type {C_JobView} from './JobUpdate/JobBasics';
import {Clip} from '../../Bridge/misc/Clip';


@observer
export class JobTabsLeft extends React.Component<C_JobView> {
	render() {
		const jobRef: JobRef = this.props.jobRef;
		const vJobUpdate: vJobUpdate = Jewels().vJobUpdate;
		
		return (
			<>
				
				<Butt
					on={() => vJobUpdate.NavShiftJobId(-1)}
					icon={FaChevronLeft}
					iconHue={'#fff'}
					subtle
					tooltip={[`Previous Job`, `alt <`]}
				/>
				
				<StaffAt
					staff={jobRef.createdBy}
					time={jobRef.jobDat.createdAt}
					title={'Made'}
					verb={'Created'}
				/>
				
				
				<StaffAt
					staff={jobRef.updatedBy}
					time={jobRef.history.updatedAt}
					title={'Last'}
					verb={'Last Updated'}
				/>
				
				<Col grow/>
				
				<JobIdHeader jobId={jobRef.jobId}/>
				
				<Col grow/>
				
				<Col grow/>
			
			</>
		);
	}
}

@observer
export class JobTabsRight extends React.Component<C_JobView> {
	render() {
		const jobRef: JobRef = this.props.jobRef;
		const vJobUpdate: vJobUpdate = Jewels().vJobUpdate;
		
		return (
			<>
				
				<JobWatchers jobRef={jobRef}/>
				
				<Butt
					on={() => vJobUpdate.NavShiftJobId(+1)}
					icon={FaChevronRight}
					iconHue={'#fff'}
					tooltip={[`Next Job`, `alt >`]}
					subtle
				/>
			
			</>
		);
	}
}


@observer
class JobIdHeader extends React.Component {
	render() {
		const jobId = this.props.jobId;
		
		return (
			<Col
				hue={'#fff'}
				marT={12}
				padH={12}
				padT={12}
				z={20}
			>
				<Clip copy={jobId}>
					<Col
						// childCenterV
						// minWidth={160}
						// marB={12}
						// circle
						// h={48}
					>
						<Row>
							<Txt b size={27} marR={4} hue={'#636363'}>#</Txt>
							<Txt b size={27} marR={4}>{jobId.slice(0, 3)}</Txt>
							<Txt b size={27} marR={6}>{jobId.slice(3)}</Txt>
							<Ico
								icon={MdContentCopy}
								hue={'#2c2c2c'}
								size={20}
								marT={6}
							/>
						</Row>
					</Col>
				</Clip>
			</Col>
		);
	}
}

@observer
class StaffAt extends React.Component {
	render() {
		const {
			staff,
			time,
			title,
			verb,
		} = this.props;
		
		// MARK.render(this, `StaffAt`, this.props);
		
		if (!staff || !time) return <React.Fragment/>;
		
		return (
			<Tip
				text={`${verb} by ${staff.internalName} at ${thyme.nice.dateTime.short(time)}`}
			>
				<Col
					marH={4}
					childC
				>
					<Txt
						marB={1}
						size={12}
						hue={'#bebebe'}
						caps
					>{title}</Txt>
					
					<StaffAvatar
						staff={staff}
						size={20}
						radius={1}
						noTooltip
					/>
					
					<Txt
						marT={1}
						size={12}
						hue={'#d2d2d2'}
					>{thyme.nice.dateTime.smallest(time)}</Txt>
				</Col>
			
			</Tip>
		);
	}
}