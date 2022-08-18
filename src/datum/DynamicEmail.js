import type {JobId} from './stache/JobDat';
import thyme, {ThymeDt} from '../Bridge/thyme';
import {JobRef} from '../pages/Job/JobUpdate/JobRef';


export class DynamicEmail {
	to: T_Email[];
	cc: T_Email[];
	from: T_Email;
	templateId: string; // 'd-1bb92eba011a4344940b5eaf07eff549'
	
	subject: string; // `ASLIS Job confirmed #${jobId}`,
	preheader: string; // `#${jobId} has been confirmed`,
	title: string; // `Job #${jobId}`,
	subtitle: string; // `Confirmed!`,
	header: string; // `Details`,
	footer: string; // 'Evaluate your Interpreter: https://aslis.com/provider-evaluate-interpreter',
	warning: string; // WARNING_48_HOUR,
	lines: T_DynamicLine[] = [];
	
	eventAttachment: T_EventAttachment;
}

export const MakeConfirmEmail = (
	jobRef: JobRef,
	emails: T_Email[],
	isCompany: boolean,
	isTerp: boolean,
	isIntern: boolean,
): DynamicEmail => {
	const jobDat = jobRef.jobDat;
	const companyDat = jobRef.company;
	const deafDats = jobRef.deafs.map(d => d.dat);
	const locationDat = jobRef.location;
	const terpDat = jobRef.terp;
	
	// TODO: make better
	if (!jobDat.jobId) throw new Error(`TODO: job not loaded`);
	if (!companyDat.companyId) throw new Error(`TODO: company not loaded`);
	if (!deafDats.length || !deafDats[0].deafId) throw new Error(`TODO: deaf not loaded`);
	if (!locationDat.locationId) throw new Error(`TODO: location not loaded`);
	if (!terpDat.terpId) throw new Error(`TODO: terp not loaded`);
	
	let lines: T_DynamicLine[] = [];
	const add = (key, value) => lines.push({key: key, value});
	const addOpt = (key, value) => value && lines.push({key: key, value});
	const HEADER = (label) => lines.push({full: label});
	const SPACE = () => lines.push({full: '-'});
	
	const jobId = jobDat.jobId;
	const date = thyme.nice.date.short(jobDat.start);
	const startTime = thyme.nice.time.short(jobDat.start);
	const endTime = thyme.nice.time.short(jobDat.end);
	
	add('Job ID', `${jobId}`);
	add('Date', date);
	add('Start', `${startTime} (Central)`);
	add('End', `${endTime} (Central)`);
	add('Interpreter', terpDat.label);
	add('Situation', jobDat.situation);
	add('Contact Upon Arrival', jobDat.contactUponArrival);
	
	if (jobRef.isVri) {
		add('VRI Link', jobDat.vriLink);
		addOpt('VRI Password', jobDat.vriPassword);
		addOpt('VRI Other', jobDat.vriOther);
	} else {
		add('Go to Address', locationDat.address);
		addOpt('Directions', locationDat.directions);
	}
	
	add('Location City', locationDat.city);
	
	if (isCompany) {
		add('Deaf Person', deafDats.map(d => d.label).join(', '));
	}
	
	if (isTerp) {
		for (let deaf of deafDats) {
			SPACE();
			add('Deaf Person', deaf.label);
			add('Birthdate', deaf.dob);
			addOpt('Special Details', deaf.notesForTerp);
		}
	}
	
	if (isIntern) {
		SPACE();
		HEADER('Interpreter Mentor');
		add('Name', terpDat.label);
		add('Phone', terpDat.phone);
		add('Email', terpDat.email);
	}
	
	SPACE();
	add('Company Name', companyDat.label);
	
	if (isCompany) {
		add('Bill to Address', `${companyDat.address} ${companyDat.address2}`);
		add('City/State/Zip', `${companyDat.city}, ${companyDat.state} ${companyDat.zip}`);
		add('Company Phone', companyDat.phone);
	}
	
	if (isTerp) {
		add('Requesting Company Name', companyDat.label);
		addOpt('Company Notes', companyDat.notesForTerp);
		add('Cap', jobDat.cap);
		SPACE();
		HEADER('Invoice Information');
		add('Bill to Company', `ASLIS`);
		add('Bill to Address', `5801 Duluth Street Suite 106`);
		add('City/State/Zip', `Golden Valley, MN 55422`);
		add('Phone', '763-478-8963');
	}
	
	SPACE();
	add('ASLIS Phone', `(763) 478-8963`);
	add('Sent At', thyme.nice.dateTime.short(thyme.now()));
	
	if (jobRef.isVri) {
		SPACE();
		add('VRI Eval', `https://aslis.com/vrieval/`);
	}
	
	
	let dynEmail = new DynamicEmail();
	dynEmail.lines = lines;
	
	dynEmail.to = emails;
	dynEmail.from = 'info@aslis.com';
	dynEmail.templateId = DYNAMIC_EMAIL_TEMPLATE_ID;
	
	dynEmail.subject = `ASLIS Job confirmed #${jobId}`;
	dynEmail.preheader = `#${jobId} has been confirmed`;
	dynEmail.title = `Job #${jobId}`;
	dynEmail.subtitle = `Confirmed!`;
	dynEmail.header = 'Details';
	
	if (isCompany) {
		dynEmail.footer = 'Evaluate your Interpreter: https://aslis.com/provider-evaluate-interpreter';
		dynEmail.warning = WARNING_48_HOUR;
	}
	
	dynEmail.eventAttachment = MakeJobEvent(
		jobId,
		jobDat.start,
		jobDat.end,
		locationDat.address,
		isTerp ? 'BUSY' : undefined,
	);
	
	return dynEmail;
}

export const MakeJobEvent = (
	jobId: JobId,
	start: ThymeDt,
	end: ThymeDt,
	address: string,
	busyStatus: string|undefined,
): T_EventAttachment => {
	return  {
		fileName: `aslis_${jobId}`,
		start: thyme.toArray(start),
		end: thyme.toArray(end),
		title: `#${jobId}`,
		description: `ASLIS Interpreting Job #${jobId}`,
		location: `${address}`,
		status: 'CONFIRMED',
		busyStatus: busyStatus,
		organizer: {
			name: 'ASLIS',
			email: 'info@aslis.com',
		}
	};
}

const DYNAMIC_EMAIL_TEMPLATE_ID = 'd-1bb92eba011a4344940b5eaf07eff549';
const WARNING_48_HOUR = 'If a request is cancelled with less than 48 business hours notice or the Deaf or Hard of Hearing client does not show, all applicable fees will be billed in full per the Customer Agreement.';


export type T_Email = string;

export type T_DynamicLine = {
	key: string, // label
	value: string,
	full?: string, // to add space: {full: ''}
}

export type T_EventAttachment = {
	fileName: string,
	
	start: number[], // thyme.toArray(start),
	end: number[], // thyme.toArray(end),
	title: string, // `#${job.jobId}`,
	description: string, // `ASLIS Interpreting Job #${job.jobId}`,
	location: string, // `${job.address}`,
	status: string, // 'CONFIRMED',
	busyStatus: string, // 'BUSY',
	organizer: {
		name: string, // 'ASLIS',
		email: string, // 'info@aslis.com',
	}
}


// /** see: SendGrid MailData */
// export type T_MailData = {
// 	to?: T_Email|T_Email[],
// 	cc?: T_Email|T_Email[],
// 	bcc?: T_Email|T_Email[],
// 	from: T_Email,
// 	replyTo?: T_Email,
//
// 	subject?: string,
// 	text?: string,
// 	html?: string,
// 	templateId: string,
//
// 	// dynamicTemplateData
// 	preheader: string; // `#${jobId} has been confirmed`,
// 	title: string; // `Job #${jobId}`,
// 	subtitle: string; // `Confirmed!`,
// 	header: string; // `Details`,
// 	footer: string; // 'Evaluate your Interpreter: https://aslis.com/provider-evaluate-interpreter',
// 	warning: string; // WARNING_48_HOUR,
//
// 	lines: T_DynamicLine[], // lines,
// }


// Pack = () => {
// 	let mailData: T_MailData = {
// 		to: this.to,
// 		cc: this.cc,
// 		from: this.from,
// 		subject: this.subject,
// 		text: this.subject,
// 		html: this.subject,
// 		templateId: this.templateId,
// 		dynamicTemplateData: {
// 			subject: this.subject,
// 			preheader: this.preheader,
// 			title: this.title,
// 			subtitle: this.subtitle,
// 			header: this.header,
// 			footer: this.footer,
// 			warning: this.warning,
// 			lines: this.lines,
// 		},
// 	};
//
// 	return {
// 		mailData: mailData,
// 		eventAttachment: this.eventAttachment,
// 	}
// }

// SendGrid MailData:
// export interface MailData {
// 	to?: EmailData|EmailData[],
// 	cc?: EmailData|EmailData[],
// 	bcc?: EmailData|EmailData[],
//
// 	from: EmailData,
// 	replyTo?: EmailData,
//
// 	sendAt?: number,
//
// 	subject?: string,
// 	text?: string,
// 	html?: string,
// 	content?: MailContent[],
// 	templateId?: string,
//
// 	personalizations?: PersonalizationData[],
// 	attachments?: AttachmentData[],
//
// 	ipPoolName?: string,
// 	batchId?: string,
//
// 	sections?: { [key: string]: string },
// 	headers?: { [key: string]: string },
//
// 	categories?: string[],
// 	category?: string,
//
// 	customArgs?: { [key: string]: any },
// 	asm?: ASMOptions,
//
// 	mailSettings?: MailSettings,
// 	trackingSettings?: TrackingSettings,
//
// 	substitutions?: { [key: string]: string },
// 	substitutionWrappers?: string[],
//
// 	isMultiple?: boolean,
// 	dynamicTemplateData?: { [key: string]: any },
// }