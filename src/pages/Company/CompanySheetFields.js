import thyme from '../../Bridge/thyme';
import $j from '../../Bridge/misc/$j';
import {Staches} from '../../stores/RootStore';
import {$m} from '../../Bridge/misc/$m';
import {TerpDat} from '../../datum/stache/TerpDat';
import {JOB_STATUS_ID_LABEL} from '../Job/JobUpdate/JobBasics';

const ThymeWithFormat = (dt, params) => thyme.nice.custom(dt, params.format);


export const COMPANY_SHEET_FIELDS = {
	jobId: {
		info: `Job ID (most are six digits)`,
		Get: (job, params) => job.jobId,
	},
	status: {
		info: `Job Status`,
		Get: (job, params) => JOB_STATUS_ID_LABEL[job.status],
	},
	billType: {
		info: `Bill Type (QB Name)`,
		Get: (job, params) => job.billType,
	},
	date: {
		info: '10/31/2000, or custom format (see link)',
		link: 'https://moment.github.io/luxon/docs/manual/formatting#table-of-tokens',
		params: {
			format: 'M/dd/yy',
		},
		Get: (job, params) => job.start,
		Format: ThymeWithFormat,
	},
	startTime: {
		info: '10:01 AM, or custom format (see link)',
		link: 'https://moment.github.io/luxon/docs/manual/formatting#table-of-tokens',
		params: {
			format: 'h:mm a',
		},
		Get: (job, params) => job.start,
		Format: ThymeWithFormat,
	},
	endTime: {
		info: '5:05 PM, or custom format (see link)',
		link: 'https://moment.github.io/luxon/docs/manual/formatting#table-of-tokens',
		params: {
			format: 'h:mm a',
		},
		Get: (job, params) => job.end,
		Format: ThymeWithFormat,
	},
	timeRange: {
		info: '10:01a-5:05p',
		Get: (job, params) => [job.start, job.end],
		Format: ([startDt, endDt]) => thyme.nice.range.little(startDt, endDt),
	},
	hours: {
		info: [
			`Number of hours (decimal)`,
			`Decimals: rounded to this number of decimals. Setting '2' would mean: 5.3333333 => 5.33`,
			`Round Minutes Up To: Setting '30' would mean: 5.11 => 5.5`,
			`(leave blank if unwanted)`,
			`Min Hours: uses higher of this number or the one on the job`,
		],
		params: {
			minHours: 2,
			decimals: 2,
			roundMinutesUpTo: '',
		},
		Get: (job, params) => {
			return $m.fancyHourCalculation(
				thyme.minutesBetween(job.start, job.end),
				$m.highest(job.hourMin || 0, params.minHours),
				params.roundMinutesUpTo,
				params.decimals,
			);
		},
	},
	amount: {
		info: [
			`Calculates hours (similar to hours field)`,
			`Multiply 'hours' by a number (can be 1),`,
			`then add one or more numbers (can be empty)`,
			`Min Hours: uses higher of this number or the one on the job`,
		],
		params: {
			prefix: '$',
			minHours: 2,
			multiply: 10,
			add: 0,
			decimals: 2,
			roundMinutesUpTo: '',
		},
		Get: (job, params) => {
			let amount = $m.fancyHourCalculation(
				thyme.minutesBetween(job.start, job.end),
				$m.highest(job.hourMin || 0, params.minHours),
				params.roundMinutesUpTo,
				params.decimals,
			);
			
			amount = $m.multiply(amount, $j.extract.numbers(params.multiply));
			amount = $m.add(amount, $j.extract.numbers(params.add));
			
			amount = $m.round(amount, params.decimals);
			
			return amount;
		},
		Summarize: (params) => {
			const multis = $j.extract.numbers(params.multiply).join(' * ') || '1';
			const adds = $j.extract.numbers(params.add).join(' + ') || '0';
			
			return [
				`hours = greaterOf (hoursBetweenStartEnd OR minHours ${params.minHours})`,
				`result = (hours * ${multis}) + ${adds}`,
				`rounded to ${params.decimals} decimal(s)`,
			];
		}
	},
	travel: {
		info: `Travel`,
		Get: (job, params) => job.travel,
	},
	situation: {
		info: `Situation will be truncated (max # characters) by the parameter`,
		params: {
			maxChar: 100,
		},
		Get: (job, params) => $j.trunc(job.situation, params.maxChar),
		Format: (value) => $j.replaceReturns(value),
	},
	situationRegex: {
		info: [
			`Uses regular expressions to capture text from the Situation (ask Trenton).`,
			`Example: /#[a-zA-Z0-9_]+/g (this will get hashtags)`,
		],
		link: `https://regexr.com/`,
		params: {
			regex: '/#[a-zA-Z0-9_]+/g',
			delimiter: ', ',
		},
		Get: (job, params) => (job.situation || '').match(params.regex),
		Format: (value) => $j.replaceReturns(value),
	},
	requestedBy: {
		info: `Requested By`,
		params: {
			maxChar: 100,
		},
		Get: (job, params) => $j.trunc(job.requestedBy, params.maxChar),
		Format: (value) => $j.replaceReturns(value),
	},
	deafNames: {
		info: `Deaf (patient) names, with delimiter (if multiple)`,
		params: {
			delimiter: ', ',
		},
		Get: (job, params) => job.deafs.map(d => `${d.firstName} ${d.lastName}`),
		isArray: true,
	},
	deafDob: {
		info: `Deaf (patient) Dates of Birth, with delimiter (if multiple)`,
		params: {
			delimiter: ', ',
		},
		Get: (job, params) => job.deafs.map(d => d.dob),
		isArray: true,
	},
	deafMrn: {
		info: `Deaf (patient) MRN. Use the Company Edit page to change this company's Medical Record ID type.`,
		params: {
			ifNone: 'missing'
		},
		Get: (job, params) => job.deafs.map(d => job.mrnLup[d.deafId] || params.ifNone),
		isArray: true,
	},
	terpName: {
		info: `Interpreter's full name`,
		Get: (job, params) => Staches().cTerp.GetOrStub(job.terpId, true, 'CompanySheetFields.terpName').dat,
		Format: (dat: TerpDat) => dat.label,
		// resume
	},
	terpMedicaId: {
		info: `Interpreter's Medica ID`,
		Get: (job, params) => Staches().cTerp.GetOrStub(job.terpId, true, 'CompanySheetFields.terpMedicaId').dat,
		Format: (dat: TerpDat) => dat.medicaId,
	},
	terpFairviewId: {
		info: `Interpreter's Fairview ID`,
		Get: (job, params) => Staches().cTerp.GetOrStub(job.terpId, true, 'CompanySheetFields.terpFairviewId').dat,
		Format: (dat: TerpDat) => dat.fairviewId,
	},
	address: {
		info: `Address`,
		params: {
			maxChar: 100,
		},
		Get: (job, params) => $j.trunc(job.address, params.maxChar),
		Format: (value) => $j.replaceReturns(value),
	},
	locationName: {
		info: `Location Name`,
		params: {
			maxChar: 100,
		},
		Get: (job, params) => $j.trunc(job.locationName, params.maxChar),
		Format: (value) => $j.replaceReturns(value),
	},
	
	text: {
		info: `Adds a column of user defined text`,
		params: {
			text: `ASL`
		},
		Get: (job, params) => params.text,
	},
	other: {
		info: `Get data from key (this is mostly a placeholder)`,
		params: {
			key: 'jobId',
		},
		Get: (job, params) => job[params.key],
	},
};


// TODO: separating DB/Atypical, NOW jobs, status, etc.

