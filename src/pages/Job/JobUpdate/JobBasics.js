import React from 'react';
import {Col, Row, Txt} from '../../../Bridge/Bricks/bricksShaper';
import {computed} from 'mobx';
import {HUE} from '../../../Bridge/HUE';
import {observer} from 'mobx-react';
import {FiEdit} from 'react-icons/fi';
import {MdAccessibility, MdPayment} from 'react-icons/md';
import {FaLink} from 'react-icons/fa';
import {JobRef} from './JobRef';
import {SelectorField} from '../../../Bridge/misc/SelectorField';
import type {EnumChoice} from '../../../Bridge/misc/UpType';
import type {JobId, JobKey} from '../../../datum/stache/JobDat';

// TODO: reconcile with T_JobUp_xxxx in oJobEdit
export type JobChangeKey = string;
export type JobChanges = {[JobChangeKey]: any}
export type JobStatusId = number;
export type JobStatusName = string;


export const JOB_STATUS_ID_LABEL: { [JobStatusId]: string } = {
	1: 'Pending',
	2: 'Filled',
	3: 'SEARCHING',
	4: 'Paid',
	5: 'BIDDING',
	6: 'FOLLOW UP',
	7: 'Created by Company',
	8: 'Updated by Contact',
	9: 'Cancelled',
	10: 'SUBSTITUTE',
};

// export const JOB_STATUS: { [JobStatusName]: JobStatusId } = {
export const JOB_STATUS = {
	Pending: 1,
	Filled: 2,
	Searching: 3,
	Paid: 4,
	Bidding: 5,
	FollowUp: 6,
	CreatedByCompany: 7,
	UpdatedByContact: 8,
	Cancelled: 9,
	Substitute: 10,
};

export type JobStatusEnum = EnumChoice;
export const JOB_STATUS_ENUMS: JobStatusEnum[] = SelectorField.IdLabelObjToChoices(JOB_STATUS_ID_LABEL);

export const QB_STATUS_ID_LABEL = {
	0: 'Automated',
	1: 'Cancelled',
	2: 'Complete',
	3: 'Error',
	4: 'Manual',
	5: 'New',
};

export type QbStatusEnum = EnumChoice;
export const QB_STATUS_ENUMS: QbStatusEnum[] = SelectorField.IdLabelObjToChoices(QB_STATUS_ID_LABEL);

export type JobTabKey = 'details' | 'seek' | 'billing' | 'linked';

export const JOB_TABS = {
	details: {
		key: 'details', label: 'DETAILS', icon: FiEdit, wrap: true
	},
	seek: {
		key: 'seek', label: 'SEEK', icon: MdAccessibility, wrap: true
	},
	billing: {
		key: 'billing', label: '', icon: MdPayment, small: true, tooltip: 'Billing', wrap: true
	},
	linked: {
		key: 'linked', label: '', icon: FaLink, small: true, tooltip: 'Linked Jobs', wrap: false
	},
};

export type C_JobView = {
	jobRef: JobRef,
	// tabi: number, // TODO: try not to use this
}

export type C_JobCard = {
	isInvalid?: boolean,
	canSave?: boolean,
	children: any,
}


export type JobReceivedFromEnum = EnumChoice;
export const JOB_RECEIVED_FROM_LABELS = {
	'phone': 'Phone',
	'email': 'Email',
	'voicemail': 'Voicemail',
	'fax': 'Fax',
	'text': 'Text',
	'chat': 'Chat',
	'internal': 'Internal',
	'radio': 'Radio Transmission',
	'portal': 'Portal',
};
export const JOB_RECEIVED_FROM_ENUMS: JobReceivedFromEnum[] = SelectorField.IdLabelObjToChoices(JOB_RECEIVED_FROM_LABELS);

@observer
export class JobCard extends React.Component<C_JobCard> {
	@computed get outline() {
		if (this.props.isInvalid)
			return HUE.outline.invalid;
		
		if (this.props.canSave)
			return HUE.outline.canSave;
		
		return undefined;
	}
	
	render() {
		return (
			<Col
				hue={HUE.job.cardBg}
				shadowPage
				pad={12}
				mar={10}
				outline={this.outline}
				{...this.props}
			>
				{this.props.children}
			</Col>
		);
	}
}

export type C_JobIdTxt = {
	jobId: JobId | JobKey,
	spacing?: number,
	poundSignHue?: string,
	rowStyle?: any,
}

@observer
export class JobIdTxts extends React.Component<C_JobIdTxt> {
	render() {
		const jobId = String(this.props.jobId);
		const spacing = this.props.spacing || 4;
		const poundSignHue = this.props.poundSignHue || '#636363';
		const rowStyle = this.props.rowStyle;
		
		return (
			<Row {...rowStyle}>
				<Txt {...this.props} marR={spacing} hue={poundSignHue}>#</Txt>
				<Txt {...this.props} marR={spacing}>{jobId.slice(0, 3)}</Txt>
				<Txt {...this.props}>{jobId.slice(3)}</Txt>
			</Row>
		);
	}
}