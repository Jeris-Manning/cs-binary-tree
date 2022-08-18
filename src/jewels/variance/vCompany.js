import {action, computed, observable, runInAction} from 'mobx';
import {Loader} from '../../Bridge/misc/Loader';
import {CompanyUpdata} from '../../datum/CompanyUpdata';
import $j, {MARK, vow} from '../../Bridge/misc/$j';
import {Jewels} from '../../stores/RootStore';
import thyme from '../../Bridge/thyme';
import {COMPANY_SHEET_FIELDS} from '../../pages/Company/CompanySheetFields';
import {FielderSpec} from '../../Bridge/Fielder/FielderSpec';
import {FielderSource} from '../../Bridge/Fielder/FielderSource';
import {FielderEntabler} from '../../Bridge/Fielder/FielderEntabler';
import {BaseJewel} from '../BaseJewel';
import type {T_MarkJobsBillingComplete_Params} from '../oJobEdit';

export class vCompany extends BaseJewel {
	
	_GetCompany = (companyId) => Jewels().company.GetCompany(companyId);
	_GetContacts = (companyId) => Jewels().company.GetContacts(companyId);
	_SaveCompany = (companyId, changes) => Jewels().company.SaveCompany(companyId, changes);
	_GetLocations = (companyId, showInactive) => Jewels().location.GetLocationsForCompany(companyId, showInactive);
	_CreateContact = (companyId) => Jewels().company.CreateContact(companyId);
	_GetMrnByCompanyRecordId = (companyRecordId) => Jewels().oDeaf.GetMrnByCompanyRecordId(companyRecordId);
	_GetJobsBy = (params) => Jewels().jobs.GetJobsBy(params);
	_MarkJobsBillingComplete = (jobIds) => Jewels().oJobEdit.MarkJobsBillingComplete(jobIds);
	
	@observable companyId = 0;
	@observable loader = new Loader();
	@observable error = '';
	@observable saveError = '';
	@observable updata = new CompanyUpdata({});
	@observable contacts = [];
	
	@observable sheetSpec = new FielderSpec(COMPANY_SHEET_FIELDS);
	@observable sheetSource;
	
	@action Load = async (companyId) => {
		if (companyId === 'overview') return;
		
		this.loader.Start();
		this.companyId = companyId;
		this.error = '';
		this.contacts = [];
		this.sheetSource = null;
		this.markedBillingComplete = '';
		
		const [[company, contacts], error] = await vow([
			this._GetCompany(companyId),
			this._GetContacts(companyId),
			// TODO make better:
			Jewels().demands.LoadDemands(),
		]);
		
		runInAction(() => {
			if (error) {
				this.error = JSON.stringify(error);
				this.loader.Error(error);
				return;
			}
			
			this.updata = new CompanyUpdata(company);
			this.contacts = contacts;
			this.sheetSource = new FielderSource(
				this.sheetSpec,
				this.updata.sheetFields,
			);
			this.LoadSheetTable();
			
		});
		
		this.loader.Done();
	};
	
	@computed get canSave() {
		if (!this.updata.companyId.value) return false;
		if (this.loader.isLoading) return false;
		return this.updata.hasChanged && this.updata.isValid;
	}
	
	@computed get saveTooltip() {
		if (!this.updata.isValid) return [
			'ERROR',
			...this.updata.errors.map(u => `${u.key}: ${u.error}`)
		];
		if (this.canSave) return 'Save (Ctrl+S)';
		return 'No changes';
	}
	
	@action Save = async () => {
		if (!this.canSave) return;
		
		this.loader.Start();
		this.saveError = '';
		
		const changes = this.updata.GetChanges();
		
		const [_, error] = await vow(
			this._SaveCompany(this.companyId, changes),
		);
		
		if (error) {
			this.saveError = JSON.stringify(error);
			this.loader.Error(error);
			return;
		}
		
		this.updata.updatedOn.Change(thyme.now());
		this.updata.lastUser.Change('you');
		if (this.updata.sheetFields.hasChanged) this.LoadSheetTable();
		
		this.updata.Apply();
		
		this.loader.Done();
	};
	
	@action Revert = () => this.updata.Revert();
	
	
	@observable locations = [];
	
	@action LoadLocations = async (companyId, showInactive) => {
		if (!companyId) throw new Error('LoadLocations: companyId required');
		
		const locs =
			await this._GetLocations(companyId, showInactive);
		
		runInAction(() => {
			this.locations = (locs || []).sort($j.sort.alphabetic('label'));
		});
	};
	
	@action CreateContact = (companyId) => this._CreateContact(companyId)
	
	@observable sheetTableSpec;
	@observable medicalRecords = {};
	// @observable tableJobIds = [];
	@observable markedBillingComplete = '';
	@observable sheetSourceRef;
	
	@action LoadSheetTable = () => {
		this.sheetTableSpec = FielderEntabler.SourceToSpec(this.sheetSource);
	};
	
	@action LoadMedicalRecords = async () => {
		const medicalRecordId = this.updata.medicalRecordId.value;
		if (!medicalRecordId) {
			this.medicalRecords = {};
			return {};
		}
		
		const [records, error] = await vow(
			this._GetMrnByCompanyRecordId(medicalRecordId)
		);
		
		if (error) throw error;
		
		runInAction(() => {
			this.medicalRecords = records || {};
		});
	};
	
	@action GetJobsForTable = async (tableParams) => {
		// this.tableJobIds = [];
		this.markedBillingComplete = '';
		
		const [[jobs, _], error] = await vow([
			this._GetJobsBy({
				by: 'company',
				companyId: this.companyId,
				...tableParams,
			}),
			this.LoadMedicalRecords(),
		]);
		
		if (error) throw error;
		
		runInAction(() => {
			for (const job of jobs) {
				job.mrnLup = this.medicalRecords;
				// this.tableJobIds.push(job.jobId);
			}
		});
		
		return jobs;
	};
	
	@action MarkTableJobsBillingComplete = async () => {
		const params: T_MarkJobsBillingComplete_Params = {
			jobIds: this.tableJobIds,
		};
		
		await this._MarkJobsBillingComplete(params);
		
		const jobs = this.tableJobIds.join(', ');
		const jobCount = this.tableJobIds.length;
		
		runInAction(() => {
			this.markedBillingComplete = `Marked ${jobCount} jobs complete:  ${jobs}`;
		})
		
	}
	
	@computed get tableJobIds() {
		if (!this.sheetSourceRef || !this.sheetSourceRef.sortedElements) return [];
		return this.sheetSourceRef.sortedElements
			.filter(e => e.meta.canShow)
			.map(e => e.row.jobId);
	}
	
	@action SetSheetSourceRef = (source) => this.sheetSourceRef = source;
}