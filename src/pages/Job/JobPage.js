import React from 'react';
import {Row} from '../../Bridge/Bricks/bricksShaper';
import {observer} from 'mobx-react';
import {Jewels, Router} from 'stores/RootStore';
import {JobDetails} from './JobUpdate/JobDetails';
import {JobSeek} from './Seeking/JobSeek';
import {JobBilling} from './JobBilling/JobBilling';
import {TabPaper} from '../../Bridge/misc/TabPaper';
import {JobLinked} from './JobLinked/JobLinked';
import {JobHeader} from './JobHeader';
import {JobTabsLeft, JobTabsRight} from './JobTabsLeftRight';
import type {C_JobView} from './JobUpdate/JobBasics';
import {JOB_TABS} from './JobUpdate/JobBasics';
import {JobDeafEditor} from './JobUpdate/JobDeafEditor';
import Loading from '../../Bridge/misc/Loading';

@observer
export class JobPage extends React.Component {
	render() {
		const vJobUpdate = Jewels().vJobUpdate;
		const jobRef = vJobUpdate.jobRef;
		
		if (!jobRef) return <Loading/>;
		
		
		const params = Router().params;
		let tab = JOB_TABS[params.tab];
		let allTabs = Object.values(JOB_TABS);
		
		if (jobRef.isNew) {
			tab = JOB_TABS.details;
			allTabs = [JOB_TABS.details];
		}
		
		return (
			<>
				
				<TabPaper
					tabs={allTabs}
					activeTab={params.tab}
					onTabSelect={vJobUpdate.SelectTab}
					tabWidth={220}
					border={jobRef.jobPageBorder}
					leftComps={<JobTabsLeft jobRef={jobRef}/>}
					rightComps={<JobTabsRight jobRef={jobRef}/>}
				>
					<JobHeader
						jobRef={jobRef}
					/>
					
					<Row wrap={tab.wrap}>
						<JobContent
							tab={params.tab}
							wrap={tab.wrap}
							jobRef={jobRef}
						/>
					</Row>
					
					<Modals/>
				
				</TabPaper>
				
				<Row h={200}/>
			</>
		);
	}
}

@observer
class JobContent extends React.Component<C_JobView> {
	render() {
		const jobRef = this.props.jobRef;
		
		switch (this.props.tab) {
			default:
			case JOB_TABS.details.key:
				return <JobDetails jobRef={jobRef}/>;
			case JOB_TABS.seek.key:
				return <JobSeek jobRef={jobRef}/>;
			case JOB_TABS.billing.key:
				return <JobBilling jobRef={jobRef}/>;
			case JOB_TABS.linked.key:
				return <JobLinked jobRef={jobRef}/>;
		}
	}
}

@observer
class Modals extends React.Component {
	render() {
		return (
			<>
				
				<JobDeafEditor/>
				
			</>
		)
	}
}