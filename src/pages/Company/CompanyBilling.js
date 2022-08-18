import React from 'react';
import {observer} from 'mobx-react';
import {Jewels} from '../../stores/RootStore';
import {SimCard} from '../../Bridge/misc/Card';
import {Fielder} from '../../Bridge/Fielder/Fielder';
import {JOB_TABLE_DEFAULT_SIFTER, JobTable} from '../../components/JobTable';
import thyme from '../../Bridge/thyme';
import Butt from '../../Bridge/Bricks/Butt';
import {Row, Txt} from '../../Bridge/Bricks/bricksShaper';
import {MdDoneAll} from 'react-icons/md';
import {FILTER_STATUS} from '../../Bridge/Sifter/Sifter';

@observer
export class CompanyBilling extends React.Component {
	render() {
		const vCompany = Jewels().vCompany;
		
		const updata = vCompany.updata;
		const companyId = this.props.companyId;
		
		console.log(`billingSource? loading: ${vCompany.loader.isLoading}`)
		
		if (!vCompany.sheetSource) throw new Error(`no billingSource`);
		
		
		const sifter = {
			...JOB_TABLE_DEFAULT_SIFTER,
		};
		
		sifter.billed.status = FILTER_STATUS.required;
		sifter.billingManual.status = FILTER_STATUS.banned;
		
		return (
			<>
				
				<SimCard minHeight={600}>
					
					<Fielder
						spec={vCompany.sheetSpec}
						source={vCompany.sheetSource}
					/>
					
					
					<Row grow/>
					
					
					{vCompany.markedBillingComplete ? (
						<Row centerC>
							<Txt size={24} b>{vCompany.markedBillingComplete}</Txt>
						</Row>
					) : (
						<Butt
							on={vCompany.MarkTableJobsBillingComplete}
							icon={MdDoneAll}
							label={`Mark Billing Complete on ${vCompany.tableJobIds.length} jobs`}
							tooltip={`Marks 'Company Invoiced' and sets Qb Status: Complete`}
							primary
							subtle
							disabled={!vCompany.tableJobIds.length}
							alertAfter={'Done!'}
						/>
					)}
					
				</SimCard>
				
				<JobTable
					spec={vCompany.sheetTableSpec}
					getAllJobs={(params) => vCompany.GetJobsForTable(params)}
					sort={''} // TODO
					start={thyme.todayMinus({days: 6})}
					end={thyme.todayMinus({days: 1})}
					setSourceRef={vCompany.SetSheetSourceRef}
					sifter={sifter}
				/>
				
			</>
		);
	}
}