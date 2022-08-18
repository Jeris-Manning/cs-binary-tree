import {observer} from 'mobx-react';
import {Jewels} from 'stores/RootStore';
import React from 'react';
import {SimCard} from '../../Bridge/misc/Card';
import Griddle_DEPRECATED from '../../Bridge/Griddle/Griddle_DEPRECATED';
import {Row, Txt} from '../../Bridge/Bricks/bricksShaper';
import thyme from '../../Bridge/thyme';
import Cell_CompanyLink from '../../Bridge/Griddle/Cells/Cell_CompanyLink';
import Butt from '../../Bridge/Bricks/Butt';
import {MdRefresh} from 'react-icons/md';

@observer
export class CompanyJobs extends React.Component {
	render() {
		const oCompanyJobs = Jewels().companyJobs;
		
		const range = oCompanyJobs.range;
		
		return (
			<>
				<SimCard padH={12}>
					<Butt
						on={oCompanyJobs.Load}
						icon={MdRefresh}
						primary
						marB={12}
					/>
					{range && (
						<Row childCenterH>
							<Txt size={16} b>{thyme.nice.date.short(range.start)}</Txt>
							<Txt marH={10}>to</Txt>
							<Txt size={16} b>{thyme.nice.date.short(range.end)}</Txt>
						</Row>
					)}
					
					<Griddle_DEPRECATED
						columns={columns}
						rows={oCompanyJobs.count}
					/>
				</SimCard>
			
			
			</>
		);
	}
}

const columns = [
	{
		header: 'Job Count',
		accessor: 'jobs',
	},
	{
		header: 'Company',
		accessor: 'companyName',
		cell: Cell_CompanyLink,
	},
];