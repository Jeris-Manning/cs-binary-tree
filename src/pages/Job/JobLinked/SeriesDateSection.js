import {observer} from 'mobx-react';
import React from 'react';
import type {T_SeriesDateSection} from '../../../datum/LinkedSeriesUpdata';
import {LinkedSeriesUpdata} from '../../../datum/LinkedSeriesUpdata';
import {Col, Row, Span, Txt} from '../../../Bridge/Bricks/bricksShaper';
import Butt from '../../../Bridge/Bricks/Butt';
import {TiInputChecked} from 'react-icons/ti';
import thyme from '../../../Bridge/thyme';
import {SeriesTimeRowGroup} from './SeriesTimeRow';
import {action} from 'mobx';
import {Root} from '../../../stores/RootStore';
import {Tip} from '../../../Bridge/misc/Tooltip';
import {Ico} from '../../../Bridge/Bricks/Ico';
import {MdWarning} from 'react-icons/md';
import $j from '../../../Bridge/misc/$j';
import {HUE} from '../../../Bridge/HUE';

@observer
class DateSection extends React.Component<C_JobView> {
	@action ToggleAllSelected = () => {
		const jobRef: JobRef = this.props.jobRef;
		const seriesUp: LinkedSeriesUpdata = jobRef.seriesUp;
		const section: T_SeriesDateSection = this.props.section;
		
		const first = section.jobs[0];
		const current = seriesUp.selectedJobs.value.get(first.key);
		const jobKeys = section.jobs.map(j => j.key);
		seriesUp.selectedJobs.SetAll(jobKeys, !current);
	}
	
	render() {
		const jobRef: JobRef = this.props.jobRef;
		const seriesUp: LinkedSeriesUpdata = jobRef.seriesUp;
		const section: T_SeriesDateSection = this.props.section;
		const hue = this.props.hue;
		
		return (
			<Row
				hue={hue}
				padV={6}
				childV
				wrap
			>
				<Butt
					on={this.ToggleAllSelected}
					subtle
					mini
					icon={TiInputChecked}
					iconHue={'#7d7d7d'}
				/>
				
				<Col
					w={160}
				>
					<Txt
						size={18}
						b
						hue={'#656565'}
						marT={4}
					>
						{thyme.nice.date.monthDay(section.date)}
						<Span marL={8} hue={'#8e8e8e'}>{section.date.year}</Span>
					</Txt>
					<Txt
						size={14}
						hue={'#8e8e8e'}
						marL={2}
					>{thyme.nice.date.dayOfWeek(section.date)}</Txt>
				</Col>
				
				<Col shrink>
					<SeriesTimeRowGroup
						section={section}
						jobRef={jobRef}
					/>
				</Col>
				
				<Col grow/>
				
				<HolidayWarning date={section.date}/>
			</Row>
		);
	}
}

@observer
export class SeriesDateSectionGroup extends React.Component<C_JobView> {
	render() {
		const jobRef: JobRef = this.props.jobRef;
		const seriesUp: LinkedSeriesUpdata = jobRef.seriesUp;
		
		return (
			<>
				{seriesUp.dateSectionArray.map((section, dex) => (
					<DateSection
						key={section.key}
						section={section}
						hue={dex % 2 ? HUE.series.rowEven : HUE.series.rowOdd}
						jobRef={jobRef}
					/>
				))}
			</>
		);
	}
}


@observer
class HolidayWarning extends React.Component {
	render() {
		const {date} = this.props;
		
		const holidays = Root().GetHolidays(date);
		
		if (!holidays || !holidays.length) return <></>;
		
		return (
			<Tip text={['Holiday:', ...holidays]}>
				<Row
					// borB={2}
					// hueBorB={'#6c6c6c'}
					childV
					marR={6}
				>
					<Ico icon={MdWarning} hue={'#b60505'}/>
					<Txt b marL={2}>{$j.trunc(holidays[0], 20)}</Txt>
				</Row>
			</Tip>
		);
	}
}