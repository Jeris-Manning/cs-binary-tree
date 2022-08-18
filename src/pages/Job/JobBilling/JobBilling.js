import {observer} from 'mobx-react';
import React from 'react';
import {SimCard, SimHeader} from '../../../Bridge/misc/Card';
import {Row} from '../../../Bridge/Bricks/bricksShaper';
import {SimpKvpLabel} from '../../../Bridge/misc/SimpKvpLabel';
import {UpField} from '../../../Bridge/misc/UpField';
import ToggleButton from '../../../components/ToggleButton';
import thyme from '../../../Bridge/thyme';
import {JobCard} from '../JobUpdate/JobBasics';
import {SelectorField} from '../../../Bridge/misc/SelectorField';
import {computed} from 'mobx';
import {Upstate} from '../../../Bridge/misc/Upstate';

@observer
export class JobBilling extends React.Component<C_JobView> {
	render() {
		const jobRef: JobRef = this.props.jobRef;
		const jobUp: JobUpdata = jobRef.jobUp;
		
		return (
			<>
				
				<Row wFill>
					<SimCard header="Billing" w={400} padH={12}>
						TODO Billing
					</SimCard>
					
					<JobQbStatus
						jobRef={jobRef}
					/>
				</Row>
				
				<Row>
					<JobCard>
						<SimHeader header={'Company'}/>
						
						<UpField
							label={'Company Invoice'}
							state={jobUp.companyInvoice}
						/>
						
						<ToggleButton
							primary
							label={'Company Invoiced'}
							isChecked={jobUp.hasCompanyInvoiced.value}
							on={jobUp.hasCompanyInvoiced.Toggle}
							// disabled
							subtle
						/>
					
					</JobCard>
					
					<SimCard header={'Interpreter Invoice (vendor bill)'}>
						
						<SimpKvpLabel
							label={'Terp Invoiced On'}
							value={jobUp.terpInvoicedOn.value
								? thyme.nice.dateTime.short(jobUp.terpInvoicedOn.value)
								: '____'
							}
						/>
						
						<UpField
							state={jobUp.terpInvoice}
							label={'Terp Invoice'}
						/>
						
						<ToggleButton
							primary
							label={'Vendor Bill Created'}
							isChecked={jobUp.terpVendorBillCreated.value}
							on={jobUp.terpVendorBillCreated.Toggle}
							disabled
							subtle
						/>
						
						<SimpKvpLabel
							label={'Invoice Total'}
							value={jobUp.terpInvoicedTotal.value}
						/>
					
					</SimCard>
				</Row>
			
			</>
		);
	}
}


@observer
export class JobQbStatus extends React.Component<C_JobView> {
	
	@computed get isInvalid() {
		const jobUp = this.props.jobRef.jobUp;
		return Upstate.AnyError(jobUp.qbStatus);
	}
	
	@computed get canSave() {
		const jobUp = this.props.jobRef.jobUp;
		return Upstate.AnyChange(jobUp.qbStatus);
	}
	
	render() {
		const jobRef: JobRef = this.props.jobRef;
		const jobUp: JobUpdata = jobRef.jobUp;
		
		return (
			<JobCard
				minWidth={200}
				isInvalid={this.isInvalid}
				canSave={this.canSave}
			>
				<SimHeader header={'QB Status'}/>
				
				<SelectorField
					state={jobUp.qbStatus}
					hideOutline
					saveAsKey
				/>
			
			</JobCard>
		);
	}
}
