import {action, computed, observable, toJS} from 'mobx';
import thyme from '../Bridge/thyme';
import {Upstate} from '../Bridge/misc/Upstate';
import {JobDat} from './stache/JobDat';
import {Clutch} from '../Bridge/DockClient/Stache';
import type {JobChanges, JobReceivedFromEnum, QbStatusEnum} from '../pages/Job/JobUpdate/JobBasics';
import {
	JOB_RECEIVED_FROM_ENUMS,
	JOB_STATUS,
	JOB_STATUS_ENUMS,
	JobStatusEnum,
	QB_STATUS_ENUMS, QB_STATUS_ID_LABEL
} from '../pages/Job/JobUpdate/JobBasics';
import {Updata} from '../Bridge/misc/Updata';
import {UpType} from '../Bridge/misc/UpType';
import {TerpDat} from './stache/TerpDat';
import type {DeafId} from './stache/DeafDat';
import {JobRef} from '../pages/Job/JobUpdate/JobRef';
import {LocalStaff} from '../stores/RootStore';


export class JobUpdata {
	
	@observable jobId = UpType.IdKey();
	@observable status: Upstate<JobStatusEnum> = UpType.Enum(JOB_STATUS_ENUMS).Required();
	@observable date = UpType.Thyme().Required();
	@observable startTime = UpType.Thyme().Required();
	@observable endTime = UpType.Thyme().Required();
	
	@observable locationId = UpType.IdKey();
	@observable companyId = UpType.IdKey().Required();
	@observable contactId = UpType.IdKey().Required();
	// @observable deafs: Upstate<Clutch<DeafDat>[]> = UpType.Array().FnPack(FnPackKeys); // TODO: EnumArray?
	@observable deafIds: Upstate<DeafId[]> = UpType.Array();
	@observable terpId = UpType.IdKey();
	
	@observable situation = UpType.String();
	@observable specialNotes = UpType.String();
	@observable contactUponArrival = UpType.String();
	@observable followUp = UpType.Bool();
	@observable warning = UpType.String();
	@observable isCancelled = UpType.Bool();
	
	@observable requestedBy = UpType.String();
	@observable createdBy = UpType.String();
	@observable receivedFrom: Upstate<JobReceivedFromEnum> = UpType.Enum(JOB_RECEIVED_FROM_ENUMS);
	
	@observable confirmationInfo = UpType.String(); // ?
	@observable p2pDispatch = UpType.Thyme();
	@observable p2pHome = UpType.Thyme();
	@observable wantedTerps: Upstate<TerpDat[]> = UpType.EnumArray();
	@observable interns: Upstate<TerpDat[]> = UpType.EnumArray();
	
	@observable vri = UpType.Bool();
	@observable vriLink = UpType.String();
	@observable vriPassword = UpType.String();
	@observable vriOther = UpType.String();
	
	
	/* BILLING */
	
	// @observable qbStatus: Upstate<QbStatusEnum> = UpType.Enum(QB_STATUS_ENUMS, 0).Required();
	@observable qbStatus: Upstate<QbStatusEnum> = UpType.Enum(QB_STATUS_ENUMS, 0);
	@observable billType: Upstate<string> = UpType.Enum().Required(); // BillTypeEntry.label
	
	@observable cap = UpType.String();
	@observable hourMin = UpType.Int(2).Required();
	@observable rate = UpType.String().Required();
	@observable flatRate = UpType.Float();
	@observable overrideRate = UpType.Float();
	
	@observable terpTravel = UpType.Float();
	@observable terpTravelRate = UpType.Float();
	@observable companyTravel = UpType.Float();
	@observable companyTravelRate = UpType.Float();
	
	@observable hasCompanyInvoiced = UpType.Bool();
	@observable companyInvoice = UpType.String();
	@observable terpInvoice = UpType.String();
	@observable terpInvoicedOn = UpType.Thyme();
	@observable terpVendorBillCreated = UpType.Bool();
	@observable terpInvoicedTotal = UpType.Float();
	
	@observable allKeys = [];
	@observable allStates = [];
	
	
	@observable jobRef: JobRef;
	
	constructor(jobRef: JobRef) { this.Construct(jobRef); }

	@action Construct = (jobRef: JobRef) => {
		this.jobRef = jobRef;
		
		/* might be a stub! */
		const jobClutch = jobRef.jobClutch;
		
		Updata.Init(this, jobClutch, {
			useClutch: jobClutch,
		});
		
		if (jobRef.isNew) this.InitializeJobCreation(jobClutch);
		// if (is.nil(this.flatRate.value)) this.flatRate.Change(0);
		// if (is.nil(this.overrideRate.value)) this.overrideRate.Change(0);
		this.rate.SetFallbackComputedObj(jobRef, 'rateFallback');
		this.cap.SetFallbackComputedObj(jobRef, 'capFallback');
	};
	
	@action Apply = () => this.allStates.forEach(f => f.Apply());
	@action Revert = () => this.allStates.forEach(f => f.Revert());
	
	
	@computed get hasChanged() {
		// console.log(`hasChanged`, this.allStates.filter(s => s.hasChanged).map(s => s.key));
		return this.allStates.some(s => s.hasChanged);
	}
	
	@computed get keysWithChanges() {
		// console.log(`keysWithChanges`, this.allStates.filter(s => s.hasChanged).map(s => s.key));
		// console.log(`keysWithChanges ${this.allStates.length} states`);
		return this.allStates.filter(s => s.hasChanged).map(s => s.key);
	}
	
	@computed get keysWithErrors() {
		return this.allStates.filter(s => s.error).map(s => s.key);
	}
	
	GetChanges = (): JobChanges => {
		// console.log(`get changes`, this.keysWithChanges);
		let changes = Updata.GetChanges(this);
		
		// console.log(`changes: `, changes);
		
		delete changes.date;
		delete changes.startTime;
		delete changes.endTime;
		
		if (this.date.hasChanged || this.startTime.hasChanged || this.endTime.hasChanged) {
			const previousStart = this.jobRef.jobDat.start;
			const previousEnd = this.jobRef.jobDat.end;
			
			const {start, end} = thyme.combineDateStartEnd(
				this.date.value,
				this.startTime.value,
				this.endTime.value
			);
			
			changes.start = [thyme.fast.pack(previousStart), thyme.fast.pack(start)];
			changes.end = [thyme.fast.pack(previousEnd), thyme.fast.pack(end)];
		}
		
		delete changes.p2pDispatch;
		delete changes.p2pHome;
		
		if (this.p2pDispatch.hasChanged || this.p2pHome.hasChanged) {
			if (!this.p2pDispatch.value || !this.p2pHome.value) {
				changes.p2pDispatch = '';
				changes.p2pHome = '';
			} else {
				const {start, end} = thyme.combineDateStartEnd(
					this.date.value,
					this.p2pDispatch.value,
					this.p2pHome.value
				);
				changes.p2pDispatch = thyme.fast.pack(start);
				changes.p2pHome = thyme.fast.pack(end);
			}
		}
		
		if (this.jobRef.isNew) {
			changes.rate = this.rate.packed;
			changes.cap = this.cap.packed;
			changes.qbStatus = this.qbStatus.packed;
		}
		
		return toJS(changes);
	};
	
	InitializeJobCreation = (jobClutch: Clutch<JobDat>) => {
		const dat = jobClutch.dat; // will be a stub
		
		this.status.Change(JOB_STATUS.Searching);
		this.billType.Change('Filled / BILL');
		this.createdBy.Change(LocalStaff().internalName);
		// this.qbStatus.Change(0); // 0 = Automated (thanks Patrick)
	}
}
