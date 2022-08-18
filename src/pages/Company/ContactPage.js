import React from 'react';
import {Col, Row, Txt} from '../../Bridge/Bricks/bricksShaper';
import {observer} from 'mobx-react';
import {Jewels, Router, Staches} from 'stores/RootStore';
import {PageTitle} from '../../Bridge/misc/NavPage';
import {JobTable} from '../../components/JobTable';
import {UpCard, UpFieldFit, UpRow} from '../../Bridge/misc/UpField';
import ToggleButton from '../../components/ToggleButton';
import thyme from '../../Bridge/thyme';
import Linker from '../../Bridge/Nav/Linker';
import {SaveControls} from '../../components/SaveControls';

@observer
class ContactDetails extends React.Component {
	render() {
		const oJobs = Jewels().jobs;
		const contactId = this.props.contactId;
		
		return (
			<>
				<PageTitle title={`Contact (${contactId})`}/>
				
				
				<ContactHeader/>
				<ContactEditor/>
				
				<JobTable
					getAllJobs={(params) => oJobs.GetJobsBy({
						by: 'contact',
						contactId: contactId,
						...params,
					})}
				/>
			
			</>
		);
	}
}

@observer
export class ContactEditor extends React.Component {
	
	render() {
		const vContact = Jewels().vContact;
		const updata = vContact.updata;
		const companyId = updata.companyId.value;
		const company = Staches().cCompany.GetOrStub(companyId, true, 'Contact Editor');
		
		return (
			<>
				
				<Row wrap>
					
					<UpCard grow maxHalf>
						<Linker
							toKey={'company'}
							params={{companyId: companyId, tab: 'edit'}}
						>
							<Row
								marB={16}
								childV
							>
								<Txt
									size={12}
									hue={'#3c3c3c'}
									caps
									marR={8}
								>Company:</Txt>
								
								<Txt
									b
									u
									size={20}
								>
									{company.name} #{companyId}
								</Txt>
							</Row>
						</Linker>
						
						<UpRow>
							<UpFieldFit
								label={'Prefix'}
								state={updata.prefix}
								w={80}
							/>
							
							<UpFieldFit
								label={'First Name'}
								state={updata.firstName}
							/>
							
							<UpFieldFit
								label={'Last Name'}
								state={updata.lastName}
							/>
						</UpRow>
						
						<UpRow>
							
							<UpFieldFit
								label={'Email'}
								state={updata.email}
							/>
							
							<UpFieldFit
								label={'Referred By'}
								state={updata.referredBy}
							/>
						
						</UpRow>
						
						<UpRow>
							
							<UpFieldFit
								label={'Work Phone'}
								state={updata.workPhone}
							/>
							
							<UpFieldFit
								label={'Ext'}
								state={updata.workExt}
								w={60}
							/>
							
							<UpFieldFit
								label={'Fax'}
								state={updata.fax}
							/>
						
						</UpRow>
						
						<UpRow>
							
							<UpFieldFit
								label={'Home Phone'}
								state={updata.homePhone}
							/>
							
							<UpFieldFit
								label={'Cell Phone'}
								state={updata.mobilePhone}
							/>
						
						</UpRow>
					
					</UpCard>
					
					
					<UpCard grow>
						
						<UpFieldFit
							label={'Note'}
							state={updata.note}
							multiline
							h={200}
						/>
						
						<UpFieldFit
							label={'Intern Note'}
							state={updata.internNote}
							multiline
							h={100}
						/>
						
						<UpRow>
							<UpFieldFit
								label={'Created At'}
								state={updata.createdAt}
								formatter={thyme.nice.dateTime.short}
								readonly
							/>
							
							<UpFieldFit
								label={'Updated At'}
								state={updata.updatedAt}
								formatter={thyme.nice.dateTime.short}
								readonly
							/>
							
							<UpFieldFit
								label={'Last User'}
								state={updata.updatedBy}
								readonly
							/>
						</UpRow>
					
					</UpCard>
				</Row>
			
			</>
		);
	}
}

@observer
class ContactHeader extends React.Component {
	render() {
		const vContact = Jewels().vContact;
		const updata = vContact.updata;
		
		return (
			<>
				<PageTitle title={`${updata.firstName.value} (${updata.contactId.value})`}/>
				
				<Row marH={24} marT={8} childV>
					<Col childC>
						<Txt size={30} b>#{updata.contactId.value}</Txt>
					</Col>
					
					<Col grow/>
					
					<Txt size={30} b>{updata.firstName.value} {updata.lastName.value}</Txt>
					
					<Col grow/>
					
					<ToggleButton
						primary
						label={'Active'}
						isChecked={updata.active.value}
						on={updata.active.Toggle}
						subtle
						marR={24}
					/>
					
					<SaveControls store={vContact}/>
				
				</Row>
			</>
		
		);
	}
}

@observer
export class ContactPage extends React.Component {
	render() {
		const params = Router().params;
		
		return (
			<>
				<ContactDetails {...params}/>
			</>
		);
	}
}
