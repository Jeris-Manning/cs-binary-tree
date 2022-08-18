import {observer} from 'mobx-react';
import {Jewels} from 'stores/RootStore';
import React from 'react';
import {action, computed, observable} from 'mobx';
import {Col, Img, Row, Txt} from '../../../Bridge/Bricks/bricksShaper';
import $j from '../../../Bridge/misc/$j';
import {UpField} from '../../../Bridge/misc/UpField';
import {MdAccessibility, MdClose, MdPrint, MdSend, MdVolumeOff, MdWarning} from 'react-icons/md';
import Butt from '../../../Bridge/Bricks/Butt';
import thyme from '../../../Bridge/thyme';
import {IoMdCheckmarkCircleOutline} from 'react-icons/io';
import {Ico} from '../../../Bridge/Bricks/Ico';
import {FiCircle} from 'react-icons/fi';
import {FaRegBuilding} from 'react-icons/fa';
import {Tip} from '../../../Bridge/misc/Tooltip';
import {PrintModal} from '../../../misc/PrintModal';
import type {C_JobView} from './JobBasics';
import {JobCard} from './JobBasics';
import {JobRef} from './JobRef';
import {JobUpdata} from '../../../datum/JobUpdata';

@observer
export class JobConfirmation extends React.Component<C_JobView> {
	
	// @computed get shouldShow() {
	// 	const jobRef: JobRef = this.props.jobRef;
	// 	if (jobRef.hasTerp) return true;
	// 	if (jobRef.jobDat.companyConfirmed) return true;
	// 	if (jobRef.jobDat.terpConfirmed) return true;
	// 	return false;
	// }
	
	@computed get confirmInfo() {
		return this.props.jobRef.jobUp.confirmationInfo.value;
	}
	
	@computed get confirmInfoIsEmail() {
		return $j.stringHas(this.confirmInfo, '@');
	}
	
	@computed get confirmationWarning() {
		const confirmInfo = this.confirmInfo;
		
		if (this.confirmInfoIsEmail) {
			// check if valid email
			const valid = $j.validateEmail(confirmInfo);
			
			const hasCommonTld =
				$j.stringHas(confirmInfo, '.com')
				|| $j.stringHas(confirmInfo, '.org')
				|| $j.stringHas(confirmInfo, '.edu')
				|| $j.stringHas(confirmInfo, '.net');
			
			if (!valid || !hasCommonTld) {
				return `Are you sure that's a valid email address?`;
			}
		}
		return '';
	}
	
	@computed get contactEmail() {
		return this.props.jobRef.contact.email;
	}
	
	@computed get companyEmails() {
		if (this.confirmInfoIsEmail)
			return $j.extract.emails(this.confirmInfo) || [];
		
		if ($j.stringHas(this.contactEmail, '@'))
			return $j.extract.emails(this.contactEmail) || [];
		
		return [];
	}
	
	@computed get terpEmails() {
		// TODO: support multiple emails?
		return [this.props.jobRef.terp.email];
	}
	
	@computed get internEmails() {
		return this.props.jobRef.jobDat.interns.map(intern => intern.email);
	}
	
	@computed get companyEmailsTooltip() {
		if (this.companyEmails.length === 0) return 'missing email';
		if (this.needSaveFirst) return 'Please save first. CTRL+S'
		return [`Send to:`, ...this.companyEmails]
	}
	
	@computed get terpEmailTooltip() {
		if (this.terpEmails.length === 0) return 'missing email';
		if (this.needSaveFirst) return 'Please save first. CTRL+S'
		return ['Send to:', ...this.terpEmails];
	}
	
	@computed get internEmailTooltip() {
		if (this.internEmails.length === 0) return 'no interns';
		if (this.needSaveFirst) return 'Please save first. CTRL+S'
		const emails = this.props.jobRef.jobDat.interns.map(intern => (
			intern.email || `${intern.label} is missing an email address`
		));
		return ['Send to:', ...emails];
	}
	
	@computed get canSendCompanyEmails() {
		if (this.needSaveFirst) return false;
		return this.companyEmails.length > 0;
	}
	
	@computed get canSendTerpEmail() {
		if (this.needSaveFirst) return false;
		return this.terpEmails.length > 0;
	}
	
	@computed get canSendInternEmail() {
		if (this.needSaveFirst) return false;
		return this.terpEmails.length > 0;
	}
	
	@computed get needSaveFirst() {
		return Jewels().vJobUpdate.canSave;
	}
	
	render() {
		// const {tabi = 20} = this.props;
		const vJobConfirm: vJobConfirm = Jewels().vJobConfirm;
		const jobRef: JobRef = this.props.jobRef;
		const jobUp = jobRef.jobUp;
		
		// if (!this.shouldShow) return <></>;
		
		return (
			<>
				
				<JobCard
					canSave={jobUp.confirmationInfo.hasChanged}
				>
					
					<UpField
						label={'Confirmation Info (Company)'}
						description={'If this is an email, it will send the confirmation email here instead'}
						state={jobUp.confirmationInfo}
						placeholder={this.contactEmail}
						// tabi={tabi + 3}
						grow
					/>
					
					{this.confirmationWarning ? (
						<Row marT={6} h={20}>
							<Ico
								icon={MdWarning}
								hue={'#dcaf0c'}
							/>
							<Txt noHoliday i marL={4}>{this.confirmationWarning}</Txt>
						</Row>
					) : <Row marT={6} h={20}/>}
					
					<Row h={24}/>
					
					<ConfirmationRow
						confirmedAt={jobRef.jobDat.companyConfirmed}
						label={'Company'}
						onSend={() => vJobConfirm.SendCompanyConfirmation(jobRef, this.companyEmails, true)}
						onSendTooltip={this.companyEmailsTooltip}
						onSilent={() => vJobConfirm.SendCompanyConfirmation(jobRef, this.companyEmails, false)}
						onClear={() => vJobConfirm.ClearCompanyConfirmation(jobRef)}
						showPrint
						canSend={this.canSendCompanyEmails}
						jobRef={jobRef}
					/>
					
					<Row h={12}/>
					
					<ConfirmationRow
						confirmedAt={jobRef.jobDat.terpConfirmed}
						label={'Interpreter'}
						onSend={() => vJobConfirm.SendTerpConfirmation(jobRef, this.terpEmails, true)}
						onSendTooltip={this.terpEmailTooltip}
						onSilent={() => vJobConfirm.SendTerpConfirmation(jobRef, this.terpEmails, false)}
						onClear={() => vJobConfirm.ClearTerpConfirmation(jobRef)}
						canSend={this.canSendTerpEmail}
						jobRef={jobRef}
					/>
					
					{!!jobRef.jobDat.interns.length && (
						<>
							<Row h={12}/>
							
							<ConfirmationRow
								confirmedAt={jobRef.jobDat.internConfirmed}
								label={'Interns'}
								onSend={() => vJobConfirm.SendInternConfirmation(jobRef, this.internEmails, true)}
								onSendTooltip={this.internEmailTooltip}
								onSilent={() => vJobConfirm.SendInternConfirmation(jobRef, this.internEmails, false)}
								onClear={() => vJobConfirm.ClearInternConfirmation(jobRef)}
								canSend={this.canSendInternEmail}
								jobRef={jobRef}
							/>
						</>
					)}
				
				</JobCard>
			
			
			</>
		);
	}
}

@observer
export class ConfirmationStatus extends React.Component<C_JobView> {
	@computed get companyConfirmed() {
		return this.props.jobRef.jobDat.companyConfirmed;
	}
	
	@computed get terpConfirmed() {
		return this.props.jobRef.jobDat.terpConfirmed;
	}
	
	@computed get companyConfirmedText() {
		return this.companyConfirmed
			? `Company confirmation sent ${thyme.nice.dateTime.short(this.companyConfirmed)}`
			: 'Company confirmation has NOT been sent.';
	}
	
	@computed get terpConfirmedText() {
		return this.terpConfirmed
			? `Interpreter confirmation sent ${thyme.nice.dateTime.short(this.terpConfirmed)}`
			: 'Interpreter confirmation NOT not been sent.';
	}
	
	render() {
		const jobRef: JobRef = this.props.jobRef;
		
		return (
			<Col marT={6}>
				<Tip text={this.companyConfirmedText}>
					<Row>
						<Ico
							icon={FaRegBuilding}
							size={24}
							// marR={4}
						/>
						<Ico
							icon={this.companyConfirmed ? IoMdCheckmarkCircleOutline : FiCircle}
							hue={this.companyConfirmed ? '#2c8700' : '#900505'}
							size={24}
						/>
					</Row>
				</Tip>
				
				<Row h={6}/>
				
				<Tip text={this.terpConfirmedText}>
					<Row>
						<Ico
							icon={MdAccessibility}
							size={24}
							// marR={4}
						/>
						<Ico
							icon={this.terpConfirmed ? IoMdCheckmarkCircleOutline : FiCircle}
							hue={this.terpConfirmed ? '#2c8700' : '#900505'}
							size={24}
						/>
					</Row>
				</Tip>
			
			</Col>
		);
	}
}

@observer
export class ConfirmationRow extends React.Component<C_JobView> {
	render() {
		const {
			confirmedAt,
			label,
			onSend,
			onSendTooltip,
			onSilent,
			onClear,
			showPrint,
			canSend,
		} = this.props;
		const jobRef: JobRef = this.props.jobRef;
		
		return (
			<Row childCenterV>
				
				{confirmedAt ? (
					<>
						<Tip text={`${label} has been confirmed`}>
							<Ico
								icon={IoMdCheckmarkCircleOutline}
								hue={'#2c8700'}
								size={24}
								marR={6}
							/>
						</Tip>
						
						<Txt noHoliday marR={6}>{label}: </Txt>
						<Txt noHoliday b>{thyme.nice.dateTime.short(confirmedAt)}</Txt>
					</>
				) : (
					<>
						<Ico
							icon={FiCircle}
							hue={'#900505'}
							size={24}
							marR={6}
						/>
						<Txt noHoliday b>{label}: UNCONFIRMED</Txt>
					</>
				)}
				
				<Col grow/>
				
				{showPrint && (
					<PrintConfirmation jobRef={jobRef}/>
				)}
				
				{!confirmedAt && (
					<Butt
						on={onSilent}
						icon={MdVolumeOff}
						iconHue={'#717171'}
						iconSize={20}
						secondary={!confirmedAt}
						mini
						subtle
						tooltip={`CONFIRM SILENTLY: Mark as confirmed but don't send an email.`}
						marL={6}
					/>
				)}
				
				<Butt
					on={onSend}
					icon={MdSend}
					secondary={!confirmedAt}
					mini
					tooltip={onSendTooltip}
					marL={6}
					enabled={canSend}
					grow
					maxWidth={45}
				/>
				
				{confirmedAt && (
					<Butt
						on={onClear}
						icon={MdClose}
						iconHue={'#717171'}
						iconSize={20}
						subtle
						mini
						danger
						tooltip={'Unconfirm'}
						marL={6}
					/>
				)}
			</Row>
		);
	}
}

const CANCELLATION_TEXT = `***Cancellation Policy*** ASLIS must be notified of cancellation or date/time changes 48 hours in advance or charges will be billed in full. Please refer to your agreement for full cancellation policy. ASLIS business hours are Monday – Friday from 7:30am – 6:30pm.`;
const NOTE_INFORMATION_TEXT = `Note: The Information transmitted in this fax is intended only for the entity to which it is addressed. It may contain confidential and/or privileged material, including “protected health information.” If you are not the intended recipient, you are hereby notified that any review, distribution, or copying of the data is strictly prohibited. If you have received this communication in error, please contact ASLIS at 763-478-8963 and destroy this fax.`;


@observer
export class PrintConfirmation extends React.Component<C_JobView> {
	
	@observable isOpen = false;
	
	@action OnOpen = () => this.isOpen = true;
	@action OnClose = () => this.isOpen = false;
	
	render() {
		const jobRef: JobRef = this.props.jobRef;
		const jobUp: JobUpdata = jobRef.jobUp;
		const vJobConfirm = Jewels().vJobConfirm;
		
		return (
			<>
				<Butt
					on={this.OnOpen}
					icon={MdPrint}
					iconHue={'#717171'}
					primary
					mini
					subtle
					tooltip={'Print / Fax'}
					marL={6}
					noHoliday
				/>
				
				<PrintModal
					isOpen={this.isOpen}
					onClose={this.OnClose}
					onPrint={() => vJobConfirm.CompanyConfirmPrinted(jobRef)}
				>
					
					{this.isOpen && (
						<Col
							w={800}
							padH={52}
							padB={52}
						>
							<Row childH marT={16}>
								<Img
									src={'https://portal.aslis.com/static/media/Logo_ASLIS_WhiteOnDarkNoDrop.e224e84f.png'}
									w={287}
									h={101}
									marB={24}
								/>
							</Row>
							
							<PrintRow label={`Fax From`} value={'763-478-3093'}/>
							<PrintRow label={`Fax To`} value={jobUp.confirmationInfo.value}/>
							
							<PrintRow label={`Today's Date`} value={thyme.nice.date.full(thyme.now())}/>
							
							<Row h={8}/>
							
							<Col
								outline={`#707070 2px solid`}
								pad={6}
							>
								<Txt noHoliday center b>** INTERPRETER CONFIRMATION **</Txt>
								<Txt noHoliday center>This is the official confirmation for your requested appointment.</Txt>
								<Txt noHoliday center>Please review the information below. If there are any errors, please contact
									ASLIS
									immediately.</Txt>
							
							</Col>
							
							<Row h={24}/>
							
							<PrintRow label={`Company Name`} value={jobRef.company.label}/>
							
							<PrintRow label={`Request By`} value={jobUp.requestedBy.value}/>
							
							<PrintRow label={`Job ID`} value={jobRef.jobId}/>
							
							<PrintRow label={`Job Date`} value={thyme.nice.date.full(jobUp.date.value)}/>
							
							<PrintRow
								label={`Start & End`}
								value={`${thyme.nice.time.short(jobUp.startTime.value)} to ${thyme.nice.time.short(jobUp.endTime.value)}`}
							/>
							
							<PrintRow label={`Deaf Names`} value={jobRef.deafNames.join(', ')}/>
							
							<PrintRow label={`Interpreter`} value={jobRef.terp.label}/>
							
							<PrintRow label={`Go To Address`} value={jobRef.location.label}/>
							
							<Row h={8}/>
							<PrintRow label={`Situation`} value={jobUp.situation.value}/>
							
							{jobUp.contactUponArrival.value && (
								<PrintRow label={`Contact On Arrival`} value={jobUp.contactUponArrival.value}/>
							)}
							
							<Row h={16}/>
							<Txt noHoliday size={14} b>{CANCELLATION_TEXT}</Txt>
							
							<Row h={16}/>
							<Txt noHoliday size={13}>{NOTE_INFORMATION_TEXT}</Txt>
							
							<Row h={16}/>
							<Txt noHoliday b i center>If you have feedback on the interpreter or services we provided,</Txt>
							<Txt noHoliday b i center>please contact us at the phone number or email listed below.</Txt>
							
							<Row h={24}/>
							<Txt noHoliday center>ASL Interpreting Services</Txt>
							<Txt noHoliday center>5801 Duluth Street #106 Golden Valley, MN 55422</Txt>
							
							<Row childH>
								<Txt noHoliday marR={16}>info@aslis.com</Txt>
								<Txt noHoliday marR={16}>763-478-8963 (Phone)</Txt>
								<Txt noHoliday marR={16}>952-388-2141 (VP)</Txt>
								<Txt noHoliday>763-498-3535 (Emergency)</Txt>
							</Row>
						</Col>
					)}
				
				</PrintModal>
			
			</>
		);
	}
}

@observer
class PrintRow extends React.Component {
	render() {
		const {
			label,
			value,
		} = this.props;
		
		return (
			<Row
				childS
				marB={8}
			>
				<Txt
					marR={6}
					size={14}
					hue={'#404040'}
					noHoliday
				>{label}:</Txt>
				
				<Txt noHoliday
					b
					size={16}
				>{value}</Txt>
			</Row>
		);
	}
}