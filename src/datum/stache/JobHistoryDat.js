import {action, computed, observable} from 'mobx';
import thyme from '../../Bridge/thyme';
import type {DatKey} from '../../Bridge/DockClient/Stache';
import type {ThymeDt} from '../../Bridge/thyme';
import {StaffDat} from './StaffDat';
import {Staches} from '../../stores/RootStore';
import type {TerpId} from './TerpDat';
import {Clutch} from '../../Bridge/DockClient/Stache';

// TODO: rewrite job history components

export type C_HistoryRow = {
	row: HistoryRow,
};

export class JobHistoryDat {
	
	@observable key: DatKey;
	
	@observable jobId: string;
	@observable version: number;
	@observable rows: HistoryRow[] = [];
	@observable updatedAt: ThymeDt;
	@observable updatedBy: string; // email?
	
	// @observable record: { data: [] };
	
	@computed get noteRows() {
		return this.rows.filter(JobHistoryDat.NoteFilter);
	}
	
	@computed get noteOrWarningRows() {
		return this.rows.filter(JobHistoryDat.NoteOrWarningFilter);
	}
	
	static NoteFilter(row) {
		return row.type === 'note';
	}
	
	static NoteOrWarningFilter(row) {
		return row.type === 'note' || row.datum.field === 'warning';
	}
	
	@action ApplyDatRaw = (datRaw) => {
		this.jobId = datRaw.jobId;
		this.version = datRaw.version;
		this.rows = ((datRaw.record || {}).data || [])
			.map((rawRow, dex) => new HistoryRow(rawRow, dex))
			.reverse() // most recent at top
		;
		this.updatedAt = thyme.fast.unpack(datRaw.updatedAt);
		this.updatedBy = datRaw.updatedBy;
	};
	
	constructor(key: DatKey) {this.key = key;}
	
	static Stub = (key: DatKey): JobHistoryDat => new JobHistoryDat(key);
}

export class HistoryRow {
	key: string;
	at: ThymeDt;
	by: string; // email
	type: 'change' | 'note' | 'seek';
	datum: HistoryDatumType;
	staffDat: StaffDat;
	staffClutch: Clutch<StaffDat>;
	
	constructor(rawRow, dex: number) {
		Object.assign(this, rawRow);
		this.key = String(dex); // change #
		this.at = thyme.fromSql(rawRow.at);
		// this.staffDat = Staches().cStaffByEmail.GetOrStub(rawRow.by, true, 'HistoryRow').dat;
		this.staffClutch = Staches().cStaffByEmail.GetOrStub(rawRow.by, true, 'HistoryRow');
	}
}

export type HistoryDatum_Change = {
	field: string,
	value: any,
	source?: string, // Push source jobId, etc.
};

export type HistoryDatum_Note = {
	note: string,
};

export type HistoryDatum_Seek = {
	seekType: HistorySeekType,
	
	terpId?: TerpId,
	terpIds?: TerpId[],
	terpCount?: number,
	seekerId?: number,
	bidNote?: string,
	description?: string,
	
	source?: string, // Push source jobId, etc.
};

export type HistorySeekType =
	'open'
	| 'requested'
	| 'bid'
	| 'decline'
	| 'assign'
	| 'unassign'
	| 'legacy'
	| 'forceAssign'
	| 'removed'
	| 'rejected';

export type HistoryDatumType = HistoryDatum_Change | HistoryDatum_Note | HistoryDatum_Seek;


const RECORD_TYPES = {
	change: 'change',
	note: 'note',
	seek: 'seek',
};

const SEEK_TYPES = {
	open: 'open',
	requested: 'requested',
	bid: 'bid',
	decline: 'decline',
	assign: 'assign',
	unassign: 'unassign',
	legacy: 'legacy',
	forceAssign: 'forceAssign',
};