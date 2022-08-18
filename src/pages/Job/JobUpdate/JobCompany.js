import React from 'react';
import {observer} from 'mobx-react';
import {SimHeader} from '../../../Bridge/misc/Card';
import {UpFieldSelectFromDat} from '../../../Bridge/misc/UpFieldSelect_DEPRECATED';
import $j from '../../../Bridge/misc/$j';
import Butt from '../../../Bridge/Bricks/Butt';
import {MdClear, MdPersonAdd} from 'react-icons/md';
import {Col, Row, Txt} from '../../../Bridge/Bricks/bricksShaper';
import Linker from '../../../Bridge/Nav/Linker';
import {UpKvpLabel} from '../../../Bridge/misc/UpField';
import {HUE} from '../../../Bridge/HUE';
import {Jewels, Staches} from '../../../stores/RootStore';
import {action, computed} from 'mobx';
import {ContactModal} from '../../Company/ContactModal';
import {Upstate} from '../../../Bridge/misc/Upstate';
import type {C_JobView} from './JobBasics';
import {JobCard} from './JobBasics';
import {SelectorField} from '../../../Bridge/misc/SelectorField';
import {JobUpdata} from '../../../datum/JobUpdata';

@observer
export class JobCompany extends React.Component<C_JobView> {
	
	@computed get isInvalid() {
		const jobUp = this.props.jobRef.jobUp;
		return Upstate.AnyError(
			jobUp.companyId,
			jobUp.contactId,
		);
	}
	
	@computed get canSave() {
		const jobUp = this.props.jobRef.jobUp;
		return Upstate.AnyChange(
			jobUp.companyId,
			jobUp.contactId,
		);
	}
	
	render() {
		const jobRef: JobRef = this.props.jobRef;
		
		// const {tabi} = this.props;
		
		return (
			<JobCard
				isInvalid={this.isInvalid}
				canSave={this.canSave}
			>
				{jobRef.hasCompany ? (
					<HasCompany
						// tabi={tabi}
						jobRef={jobRef}
					/>
				) : (
					<NoCompany
						// tabi={tabi}
						jobRef={jobRef}
					/>
				)}
			</JobCard>
		);
	}
}

@observer
class HasCompany extends React.Component<C_JobView> {
	render() {
		// const {tabi} = this.props;
		
		const vJobUpdate: vJobUpdate = Jewels().vJobUpdate;
		const jobRef: JobRef = this.props.jobRef;
		const jobUp: JobUpdata = jobRef.jobUp;
		
		const companyId = jobRef.jobUp.companyId.value;
		const company = jobRef.company;
		const address = `${company.address} ${company.address2} ${company.city}, ${company.state} ${company.zip}`;
		const phone = company.phone;
		const fax = company.fax;
		
		return (
			<>
				
				<Row wrap childV>
					<Linker toKey={'company'} params={{companyId: companyId, tab: 'edit'}}>
						<Txt size={24}>{company.name}</Txt>
						<Txt marL={8}>(#{companyId})</Txt>
					</Linker>
					
					<Col grow/>
					
					<Butt
						on={() => {
							jobUp.contactId.Change(0);
							jobUp.companyId.Change(0);
						}}
						icon={MdClear}
						subtle
						danger
						tooltip={'Clear Company'}
						marT={12}
						marL={4}
					/>
				</Row>
				
				<Txt size={10} i marT={12}>{address}</Txt>
				
				<Row marT={12}>
					<UpKvpLabel
						label={'Phone'}
						value={$j.format.phone(phone)}
						href={`tel:+${phone}`}
					/>
					
					<UpKvpLabel
						label={'Fax'}
						value={$j.format.phone(fax)}
						marL={16}
						href={`tel:+${fax}`}
					/>
				</Row>
				
				<UpKvpLabel
					label={'Note'}
					value={company.note || 'none'}
					marT={6}
				/>
				
				<ContactSection
					// tabi={tabi}
					jobRef={jobRef}
				/>
			
			</>
		);
	}
}

@observer
class NoCompany extends React.Component<C_JobView> {
	render() {
		// const {tabi} = this.props;
		
		const vJobUpdate: vJobUpdate = Jewels().vJobUpdate;
		const jobRef: JobRef = this.props.jobRef;
		const jobUp: JobUpdata = jobRef.jobUp;
		const cSearch = Staches().cSearch;
		
		return (
			<>
				
				<SimHeader header={`Company`}/>
				
				<SelectorField
					state={jobUp.companyId}
					choices={cSearch.GetOrStub('company').dat.activeEntries}
					placeholder={'Select Company'}
					Change={(entry) => jobUp.companyId.Change(entry.key)}
					hideOutline
				/>
				
				<Row h={24}/>
				
				<SelectorField
					state={jobUp.contactId}
					choices={cSearch.GetOrStub('contact').dat.activeEntries}
					placeholder={'Select Contact'}
					Change={(entry) => {
						jobUp.contactId.Change(entry.key);
						jobUp.companyId.Change(entry.companyId);
					}}
					hideOutline
				/>
				
				<Txt
					hue={HUE.error}
					b
					marT={6}
				>
					Required
				</Txt>
			
			</>
		);
	}
}


@observer
class ContactSection extends React.Component<C_JobView> {
	
	@action OpenContactModal = () => {
		const jobRef: JobRef = this.props.jobRef;
		const companyId = jobRef.company.companyId;
		const contactId = null; // TODO
		return Jewels().vContact.OpenModal(contactId, companyId, this.AfterSaveContactModal);
	};
	
	@action AfterSaveContactModal = (contact) => {
		const jobRef: JobRef = this.props.jobRef;
		jobRef.jobUp.contactId.Change(contact.contactId.value);
	};
	
	@computed get contactChoicesDat() {
		const jobRef: JobRef = this.props.jobRef;
		return jobRef.hasCompany
			? jobRef.companyContacts
			: Staches().cSearch.GetOrStub('contact').dat;
	}
	
	render() {
		// const {tabi} = this.props;
		const jobRef: JobRef = this.props.jobRef;
		const jobUp: JobUpdata = jobRef.jobUp;
		const vJobUpdate: vJobUpdate = Jewels().vJobUpdate;
		const cSearch = Staches().cSearch;
		
		return (
			<>
				<Txt
					hue={'#3c3c3c'}
					caps
					size={12}
					marT={16}
					marB={4}
				>Contact</Txt>
				
				<Row childV>
					
					<SelectorField
						state={jobUp.contactId}
						choices={this.contactChoicesDat.activeEntries}
						placeholder={'Select Contact'}
						Change={(entry) => {
							jobUp.contactId.Change(entry.key);
						}}
						hideOutline
						grow
					/>
					{/*<UpFieldSelectFromDat*/}
					{/*	dat={this.contactChoicesDat}*/}
					{/*	state={jobRef.jobUp.contactId}*/}
					{/*	activeOnly*/}
					{/*	keyer={'key'}*/}
					{/*	sorter={$j.sort.alphabetic('label')}*/}
					{/*	placeholder={'Select Contact'}*/}
					{/*	grow*/}
					{/*	size={16}*/}
					{/*	// tabi={tabi + 0}*/}
					{/*	focus*/}
					{/*/>*/}
					
					{jobRef.hasContact ? (
						<Butt
							on={() => jobUp.contactId.Change(0)}
							icon={MdClear}
							tooltip={'Clear Contact'}
							danger
							subtle
							marL={12}
						/>
					) : (
						<Butt
							on={this.OpenContactModal}
							icon={MdPersonAdd}
							tooltip={'Create Contact'}
							primary
							marL={12}
						/>
					)}
				</Row>
				
				{jobRef.hasContact && (
					<Contact jobRef={jobRef}/>
				)}
				
				<ContactModal/>
			
			</>
		);
	}
}

@observer
class Contact extends React.Component<C_JobView> {
	render() {
		const jobRef: JobRef = this.props.jobRef;
		// const {contactId} = this.props;
		
		const contact = jobRef.contact;
		
		const phone = contact.workPhone || contact.mobilePhone || contact.homePhone || '';
		const email = contact.email;
		const note = contact.note || 'none';
		const internNote = contact.internNote;
		
		return (
			<>
				
				<UpKvpLabel
					label={'Phone'}
					value={$j.format.phone(phone)}
					marT={12}
					href={`tel:+${phone}`}
				/>
				<UpKvpLabel
					label={'Email'}
					value={email}
					href={`mailto:${email}`}
				/>
				<UpKvpLabel
					label={'Note'}
					value={note}
				/>
				<UpKvpLabel
					label={'Intern'}
					value={internNote}
				/>
			
			</>
		);
	}
}