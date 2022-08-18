import {observer} from 'mobx-react';
import {Jewels} from 'stores/RootStore';
import React from 'react';
import {SimCard} from '../../Bridge/misc/Card';
import Butt from '../../Bridge/Bricks/Butt';
import {Col, Row, Txt} from '../../Bridge/Bricks/bricksShaper';
import {MdChevronLeft, MdChevronRight} from 'react-icons/md';
import {SimDateEntry} from '../../Bridge/misc/SimDateEntry';
import {ReTableView} from '../../Bridge/ReTable/ReTableView';
import {JobNoteModal} from '../../components/JobNoteModal';
import {ReFilterView} from '../../Bridge/ReTable/ReFilterView';
import {Required, Unset} from '../../Bridge/ReTable/ReFilter';
import {action} from 'mobx';


@observer
export class ActionListPage extends React.Component {
	
	render() {
		return (
			<>
				<Header/>
				<Filters/>
				<Table/>
				<JobNoteModal/>
			</>
		);
	}
}

@observer
class Header extends React.Component {
	render() {
		const vAction = Jewels().vActionList;
		
		return (
			<Col marT={12} marB={12}>
				<Row childCenterV>
					<Col w={40}/>
					
					<Col grow childCenterH>
						<Txt
							size={'2.4rem'}
							// marR={8}
						>
							Action!
						</Txt>
					</Col>
					
					<Col w={40}/>
				</Row>
				
				<Counts/>
			</Col>
		);
	}
}

@observer
class Counts extends React.Component {
	render() {
		const vAction = Jewels().vActionList;
		
		// const counts = vAction.source.counts;
		// const countStr = `${counts.canShow}/${counts.isLoading + counts.canShow} of ${counts.full}`
		// const countStr = `${vAction.datesCount} days, ${vAction.listJobIdsCount} total, byDate: ${vAction.byDateCount}, followUp: ${vAction.followUpCount}`;
		const countStr = `${vAction.listJobIdsCount} jobs need action`;
		
		return (
			<Row childC>
				<Txt
					size={'1.2rem'}
					marT={6}
					marL={12}
				>
					{countStr}
				</Txt>
			</Row>
		);
	}
}


@observer
class Filters extends React.Component {
	render() {
		const vAction = Jewels().vActionList;
		
		return (
			<SimCard marB={2} maxFull>
				<Row>
					
					<Butt
						on={vAction.PreviousDataRange}
						icon={MdChevronLeft}
						subtle
						mini
						marR={8}
						tooltip={'Previous 7 days'}
					/>
					
					<SimDateEntry
						value={vAction.startInput}
						onChange={vAction.SetStart}
						tabIndex={1}
						label={'Start'}
						size={18}
						pad={8}
						w={180}
						infoSize={12}
					/>
					
					<Col w={24}/>
					
					<SimDateEntry
						value={vAction.endInput}
						onChange={vAction.SetEnd}
						tabIndex={2}
						label={'End'}
						size={18}
						pad={8}
						w={180}
						infoSize={12}
					/>
					
					<Butt
						on={vAction.NextDataRange}
						icon={MdChevronRight}
						subtle
						mini
						marL={8}
						tooltip={'Next 7 days'}
					/>
					
					<Col w={24}/>
					
					<Col grow shrink>
						
						{/*<Row h={12}/>*/}
						
						<Row wrap>
							{vAction.mainFilters.map((refilter) => (
								<ReFilterView
									key={refilter.key}
									refilter={refilter}
									retable={vAction.retable}
									rowStyle={{
										marR: 24,
									}}
								/>
							))}
							
							<Col grow/>
							
							{vAction.regionFilters.map((refilter) => (
								<ReFilterView
									key={refilter.key}
									refilter={refilter}
									retable={vAction.retable}
									rowStyle={{
										marR: 12,
									}}
									size={14}
								/>
							))}
							
						</Row>
						
						<Row grow/>
						
						<Row wrap>
							{/*<Col grow/>*/}
							<Txt
								hue={'#8d8d8d'}
								b
								smallCaps
								size={12}
								marR={8}
							>Created By:</Txt>
							
							<CreatedByFilters/>
						</Row>
						
					</Col>
					
				</Row>
			</SimCard>
		);
	}
}


@observer
class Table extends React.Component {
	render() {
		const vAction = Jewels().vActionList;
		
		return (
			<>
				<SimCard pad={0} padH={4} padT={8} maxFull>
					<ReTableView
						retable={vAction.retable}
						columnList={vAction.columnList}
						sortKey={'date'}
					/>
				</SimCard>
			</>
		);
	}
}

@observer
class CreatedByFilters extends React.Component {
	
	@action Cycle = (name: string) => {
		const vAction = Jewels().vActionList;
		const refilter = vAction.createdByFilter;
		
		let list = refilter.compareWith || [];
		
		const has = list.includes(name);
		
		if (has) {
			list = list.filter(n => n !== name);
		} else {
			list.push(name);
		}
		
		refilter.compareWith = list;
		vAction.retable.SetFilter(refilter);
	}
	
	render() {
		const vAction = Jewels().vActionList;
		const refilter = vAction.createdByFilter;
		
		return (
			<>
				{vAction.createdByNames.map(name => (
					<ReFilterView
						key={name}
						refilter={refilter}
						retable={vAction.retable}
						size={11}
						rowStyle={{
							marR: 8,
						}}
						label={name}
						labelStyle={{
							smallCaps: false,
							b: false,
						}}
						fnCycle={() => this.Cycle(name)}
						status={(refilter.compareWith || []).includes(name) ? Required : Unset}
					/>
				))}
			</>
		);
	}
}