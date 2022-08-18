import React from 'react';
import {Col, Row, Txt} from '../Bridge/Bricks/bricksShaper';
import {observer} from 'mobx-react';
import {Jewels} from 'stores/RootStore';
import {SimCard} from '../Bridge/misc/Card';
import thyme from '../Bridge/thyme';
import {HiddenUntil} from '../Bridge/misc/HiddenUntil';

@observer
export class Home extends React.Component {
	
	render() {
		const oHours = Jewels().oHours;
		
		return (
			<Col N childCenterH grow overflow>
				
				<Row S childCenter h={30}>
					<Txt b size={22} marH={20}>NOW</Txt>
				</Row>
				
				<Row marV={12}>
					{oHours.status === 'open' && (
						<Txt>ASLIS is OPEN until {thyme.nice.time.short(oHours.end)}</Txt>
					)}
					{oHours.status === 'closed' && (
						<Txt>ASLIS is CLOSED until {thyme.nice.dateTime.short(oHours.start)}, due
							to: {oHours.reason}</Txt>
					)}
				</Row>
				
				<Row h={48}/>
				
				<HiddenUntil
					label={'Show Miro Board'}
				>
					<SimCard wFill h={800}>
						
						{<div
							style={{width: '100%', height: '100%'}}
							dangerouslySetInnerHTML={{
								__html: `<iframe
										style="width: 100%; height: 100%"
										src="https://miro.com/app/live-embed/o9J_kkO1gio=/"
									/>`
							}}
						/>}
					
					
					</SimCard>
				</HiddenUntil>
			</Col>
		);
	}
}




// import Cell_Time from '../Bridge/Griddle/Cells/Cell_Time';
// import Cell_CopyText from '../Bridge/Griddle/Cells/Cell_CopyText';
// import Cell_TextTrunc from '../Bridge/Griddle/Cells/Cell_TextTrunc';
// import Cell_DeafNames from '../Bridge/Griddle/Cells/Cell_DeafNames';
// import Cell_MapLink from '../Bridge/Griddle/Cells/Cell_MapLink';
// import Cell_Terp from '../Bridge/Griddle/Cells/Cell_Terp';



// @computed get $current() {
// 	console.log(`Calculating current now jobs`);
// 	const now = thyme.now();
// 	return Staches().futureJobs.asArray
// 		.filter(j => j.start <= now && j.end >= now)
// 		.sort(thyme.sorter('start'));
// }
//
// @computed get $currentLocs() {
// 	const locs = {};
// 	$j.each(this.$current, job => {
// 		$j.vouch(locs, job.locationId, {
// 			locationId: job.locationId,
// 			address: job.address,
// 			lat: job.lat,
// 			lng: job.lng,
// 			city: job.city,
// 			jobs: [],
// 		});
// 		locs[job.locationId].jobs.push(job);
// 	});
// 	return Object.values(locs);
// }

// <Card w={'100%'} header={''} borderless>
// 	<Col w={'100%'} h={600}>
// 		<GoogleMapReact
// 			bootstrapURLKeys={{key: $root.mapKey}}
// 			defaultCenter={{
// 				lat: 44.998495,
// 				lng: -93.353776,
// 			}}
// 			defaultZoom={10}
// 		>
// 			{this.$currentLocs.map(loc => (
// 				<Col
// 					h={30}
// 					w={30}
// 					hue={HUE.blueLight}
// 					lat={loc.lat}
// 					lng={loc.lng}
// 					childC
// 					circle
// 					key={loc.locationId}
// 				>
// 					<Tooltip
// 						content={`${loc.jobs.length} job${loc.jobs.length > 1 ? 's' : ''} at:   ${loc.address}`}>
// 						<Col circle hue={HUE.bgDark} w={24} h={24} childC>
// 							<Txt b size={18} hue={'white'}>{loc.jobs.length}</Txt>
// 						</Col>
// 					</Tip>
// 				</Col>
// 			))}
// 		</GoogleMapReact>
// 	</Col>
// </Card>
//
// <Card w={'100%'} header={'Current Jobs'} foldable={'hidden'}>
// 	<Griddle
// 		rows={this.$current}
// 		columns={currentJobsColumns}
// 	/>
// </Card>
//
// <Card w={'100%'} header={'Terps in the Field'} foldable={'hidden'}>
// 	<Griddle
// 		rows={this.$current.filter(j => j.terpId)}
// 		columns={terpColumns}
// 		sort={'terpName'}
// 	/>
// </Card>

// const currentJobsColumns = [
// 	{
// 		header: 'Start',
// 		accessor: 'start',
// 		cell: Cell_Time,
// 	},
// 	{
// 		header: 'End',
// 		accessor: 'end',
// 		cell: Cell_Time,
// 	},
// 	{
// 		header: 'Job ID',
// 		accessor: 'jobId',
// 		cell: Cell_CopyText,
// 		textOverride: row => row.jobId ? '' : 'busy',
// 	},
// 	{
// 		header: 'Situation',
// 		accessor: 'situation',
// 		w: '1fr',
// 		cell: Cell_TextTrunc,
// 	},
// 	{
// 		key: 'deafNames',
// 		header: 'Deaf',
// 		accessor: 'deaf',
// 		cell: Cell_DeafNames,
// 	},
// 	{
// 		header: 'Address',
// 		accessor: 'address',
// 		w: '1.5fr',
// 		cell: Cell_MapLink,
// 	},
// 	{
// 		header: 'Terp',
// 		accessor: 'terpId',
// 		cell: Cell_Terp,
// 	},
// ];
//
// const terpColumns = [
// 	{
// 		key: 'terpName',
// 		header: 'Name',
// 		valueGetter: (row) => {
// 			const terp = Staches().terps.Get(row.terpId);
// 			return terp ? terp.terpName : '?';
// 		},
// 		sorter: $j.sort.alphabetic(),
// 	},
// 	{
// 		header: 'On Job',
// 		accessor: 'jobId',
// 		cell: Cell_CopyText,
// 	},
// 	{
// 		header: 'Until',
// 		accessor: 'end',
// 		cell: Cell_Time,
// 	},
// 	{
// 		header: 'At',
// 		accessor: 'address',
// 		w: '1.5fr',
// 		cell: Cell_MapLink,
// 	},
// 	{
// 		key: 'terpRegion',
// 		header: 'Region',
// 		valueGetter: (row) => {
// 			const terp = Staches().terps.Get(row.terpId);
// 			return terp ? terp.region : '?';
// 		},
// 		sorter: $j.sort.alphabetic(),
// 	},
// ];