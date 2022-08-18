import {action, computed, observable, runInAction} from 'mobx';
import RequestGem_DEPRECATED from '../Bridge/jewelerClient/RequestGem_DEPRECATED';
import thyme from '../Bridge/thyme';
import PostGem_DEPRECATED from '../Bridge/jewelerClient/PostGem_DEPRECATED';
import {WiseGem} from '../Bridge/jewelerClient/WiseGem';
import $j, {vow} from '../Bridge/misc/$j';
import {Loader} from '../Bridge/misc/Loader';
import {CredDatum} from '../datum/Credentialing/CredDatum';
import {BaseJewel} from './BaseJewel';

// TODO: cleanup/modernize
export default class oCredentials extends BaseJewel {
	
	gems = {
		// demands: new RequestGem_DEPRECATED({}),
		creds: new RequestGem_DEPRECATED({}),
		verify: new PostGem_DEPRECATED({}),
		remove: new PostGem_DEPRECATED({}),
		queue: new RequestGem_DEPRECATED({}),
		fileUrl: new RequestGem_DEPRECATED({}),
		addArchive: new PostGem_DEPRECATED({}),
		terpList: new RequestGem_DEPRECATED({}),
		unverify: new PostGem_DEPRECATED({}),
		postCredEdit: new PostGem_DEPRECATED(),
		getCredSearchData: new WiseGem(),
		// getTerpCreds: new WiseGem(),
		// getTerpChecklist: new WiseGem(),
		// saveTerpChecklist: new WiseGem(),
		// setChecklistByTerpId: new WiseGem(),
		getAllCreds: new WiseGem(),
		getReportTerps: new WiseGem(),
		getReportTerpExtra: new WiseGem(),
		getReportDemands: new WiseGem(),
		getReportCreds: new WiseGem(),
		getReportTerpCreds: new WiseGem(),
		getReportTags: new WiseGem(),
		getReportSpecialties: new WiseGem(),
	};
	
	
	
	
	
	@observable isLoading = false;
	@observable credsByCategory = [];
	@observable demands = {};
	@observable showReviewModal = false;
	@observable reviewCred = {};
	@observable reviewTerpCred = {};
	@observable photoCred = {};
	@observable photoTerpCred = {};
	
	/* TERP PAGE */
	@action LoadTerp = async (terpId) => {
		this.isLoading = true;
		
		const credsResult =
			await this.gems.creds.Request({terpId: terpId});
		
		runInAction(() => {
			let cats = {};
			
			Object.values(credsResult.creds).forEach(cred => {
				if (!cats.hasOwnProperty(cred.category)) {
					cats[cred.category] = {
						categoryName: cred.category,
						creds: [],
					};
				}
				
				if (cred.credId === 1) {
					this.photoCred = cred;
					this.photoTerpCred = cred.terpCreds.current;
					cats[cred.category].creds.push(cred);
				} else {
					cats[cred.category].creds.push(cred);
				}
			});
			
			Object.values(cats)
				.forEach(cat => cat.creds.sort((a, b) => a.name.localeCompare(b.name)));
			
			this.credsByCategory = Object.values(cats)
				.sort((a, b) => a.categoryName.localeCompare(b.categoryName));
			
			this.demands = credsResult.demands;
			
			this.isLoading = false;
		});
	};
	
	@action Review = (cred, terpCred) => {
		this.reviewCred = cred;
		this.reviewTerpCred = terpCred;
		this.showReviewModal = true;
	};
	
	@action HideReview = () => {
		this.showReviewModal = false;
		this.reviewCred = {};
		this.reviewTerpCred = {};
	};
	
	
	@action VerifyCred = async (cred, terpCred, expiresOn, sendAlert) => {
		console.log(`VerifyCred ${terpCred.terpCredId}`);
		
		await this.gems.verify.Post({
			terpCredId: terpCred.terpCredId,
			terpId: terpCred.terpId,
			credName: cred.name,
			expiresOn: expiresOn ? thyme.toFastJson(thyme.fromDateInput(expiresOn)) : null,
			sendAlert: sendAlert,
		});
		
		this.HideReview();
		
		return this.LoadTerp(terpCred.terpId);
	};
	
	@action RemoveCred = async (cred, terpCred, reason, sendAlert) => {
		console.log(`RemoveCred ${terpCred.terpCredId}`);
		
		await this.gems.remove.Post({
			terpCredId: terpCred.terpCredId,
			terpId: terpCred.terpId,
			credName: cred.name,
			reason: reason,
			sendAlert: sendAlert,
		});
		
		this.HideReview();
		
		return this.LoadTerp(terpCred.terpId);
	};
	
	GetFileUrl = fileKey => {
		return this.gems.fileUrl.Request({fileKey: fileKey});
	};
	
	@computed get demandsMet() {
		return Object.values(this.demands).filter(d => d.met);
	}
	
	
	@action SubmitArchive = async (terpId, credId, expiresOn) => {
		await this.gems.addArchive.Post({
			terpId: terpId,
			credId: credId,
			expiresOn: expiresOn ? thyme.toFastJson(expiresOn) : null,
		});
		return this.LoadTerp(terpId);
	};
	
	@action Unverify = async (terpCred) => {
		await this.gems.unverify.Post({
			terpCredId: terpCred.terpCredId,
		});
		
		this.HideReview();
		
		return this.LoadTerp(terpCred.terpId);
	};
	
	/* Terps (cred) List */
	// @observable terpCredsLup = {};
	//
	// @action LoadTerpList = async () => {
	// 	const result =
	// 		await this.gems.terpList.Request();
	//
	// 	runInAction(() => {
	// 		let lup = {};
	//
	// 		result.forEach(row => {
	// 			if (!lup.hasOwnProperty(row.terpId)) {
	// 				lup[row.terpId] = {
	// 					terpId: row.terpId,
	// 					basicCredCount: [],
	// 					basicCredNames: [],
	// 					otherCredCount: [],
	// 					archiveCredCount: [],
	// 					missingContract: true,
	// 					hasContract: false,
	// 					hasPhoto: false,
	// 				};
	// 			}
	//
	// 			if (row.credId === 1) {
	// 				lup[row.terpId].hasPhoto = true;
	// 			} else if (basicCreds.includes(row.credId)) {
	// 				lup[row.terpId].basicCredCount.push(row);
	// 				lup[row.terpId].basicCredNames.push(basicCredNames[row.credId]);
	// 			} else if (row.fileLocation === 'ARCHIVE') {
	// 				lup[row.terpId].archiveCredCount.push(row);
	// 			} else {
	// 				lup[row.terpId].otherCredCount.push(row);
	// 			}
	//
	// 			if (row.credId === 2) {
	// 				lup[row.terpId].missingContract = false;
	// 				lup[row.terpId].hasContract = true;
	// 			}
	// 		});
	//
	// 		this.terpCredsLup = lup;
	// 	});
	//
	// };
	
	
	@action GetAllCreds = async () => this.gems.getAllCreds.Get();
	
	/* Cred editor */
	
	@observable allCreds = {};
	
	@action LoadAllCreds = async () => {
		const creds =
			await this.gems.getAllCreds.Get();
		
		runInAction(() => {
			this.allCreds = $j.convertToLookup(creds, 'credId');
		});
	};
	
	@action PostCredEdit = async (newCred) => {
		await this.gems.postCredEdit.Post({
			credId: newCred.credId,
			cred: newCred,
		});
		
		this.LoadAllCreds().then();
	};
	
	
	/* Cred Search page */
	
	// cell
	// none: blank
	// requested: blue MdStarBorder
	// pending: purple MdHourglassEmpty
	// expired: red MdClose
	// expiring soon: yellow MdCheck
	// verified: green MdCheck
	
	@observable needsLoad = true;
	@observable dataLoader = new Loader();
	@observable dataTerps = {};
	@observable dataDemands = {};
	@observable dataCreds = {};
	@observable dataTerpCreds = [];
	@observable dataFull = {};
	@observable dataCalculated = false;
	
	@action StartLoad = () => {
		this.needsLoad = false;
		if (!this.dataCalculated) {
			return this.LoadCredDataList();
		}
	};
	
	@action LoadCredDataList = async () => {
		this.dataLoader.Start();
		
		const [data, error] = await vow(
			this.gems.getCredSearchData.Get()
		);
		
		if (error) throw new Error(error);
		
		runInAction(() => {
			this.dataTerps = $j.convertToLookup(data.terps, 'terpId');
			this.dataDemands = $j.convertToLookup(data.demands, 'demandId');
			this.dataCreds = $j.convertToLookup(data.creds, 'credId');
			
			data.checklists.forEach(terp => {
				(this.dataTerps[terp.terpId] || {}).checklist = terp.checklist || [];
			});
			
			thyme.fast.array.unpack(data.terpCreds);
			this.dataTerpCreds = data.terpCreds;
			
			this.CalculateDataFull();
			this.SetCredsShownDefaults();
			
			this.dataLoader.Stop();
		});
	};
	
	@action CalculateDataFull = () => {
		this.dataCalculated = false;
		const dataFull = {};
		
		const allTerps = Object.values(this.dataTerps);
		const allCreds = Object.values(this.dataCreds);
		const terpCreds = this.dataTerpCreds;
		
		allTerps.forEach(terp => {
			terp.checklist = terp.checklist || [];
			terp.credData = CredDatum.MakeCredDataForTerp(allCreds, [], false);
			// terp.SetChecklist(terp.checklist.includes())
			dataFull[terp.terpId] = terp;
		});
		
		terpCreds.forEach(tCred => {
			const terp = dataFull[tCred.terpId];
			if (terp) {
				const datum = terp.credData[tCred.credId];
				if (datum) datum.AddTerpCred(tCred);
			}
		});
		
		Object.values(dataFull).forEach(terp => {
			CredDatum.FinalizeAll(terp.credData);
		});
		
		this.dataFull = dataFull;
		this.dataCalculated = true;
	};
	
	/* CRED COLUMNS TO SHOW */
	
	@observable dataCredColumns = [];
	
	@action SetCredsShownDefaults = () => {
		this.dataCredColumns = ['2'];
	};
	
	@action SetShowCred = (credId, show) => {
		if (show) {
			this.dataCredColumns.push(`${credId}`);
		} else {
			this.dataCredColumns = this.dataCredColumns.filter(c => c !== `${credId}`);
		}
	};
	
	@computed get dataCredDemands() {
		return Object.values(this.dataDemands).map(demand => ({
			label: demand.name,
			demand: demand,
			value: demand.demandId,
		})).slice().sort($j.sort.alphabetic('label'));
	}
	
	@action ShowCredsBasedOnDemand = (demand) => {
		console.log(`ShowCredsBasedOnDemand: `, demand);
		this.dataCredColumns = demand.credsRequired.flat().filter(c => c > 0);
	};
	
	@observable dataCredAllSelected = false;
	
	@action DataCredSelectAll = () => {
		this.dataCredAllSelected = !this.dataCredAllSelected;
		if (this.dataCredAllSelected) {
			this.dataCredColumns = Object.keys(this.dataCreds);
		} else {
			this.dataCredColumns = ['2'];
		}
		
		console.log(`Toggled dataCredAllSelected: ${this.dataCredAllSelected}`, this.dataCredColumns);
	};
	
	
	@computed get credDataListCsv() {
		// TODO
		
		return {
			headers: [
				{label: 'Name', key: 'name'},
			
			],
			data: this.rows,
			fileName: `Terp Contracts ${thyme.nice.date.fileName(thyme.today())}.csv`,
		};
	}
	
	
	GetReportTerps = () => this.gems.getReportTerps.Get();
	GetReportTerpExtra = () => this.gems.getReportTerpExtra.Get();
	GetReportDemands = () => this.gems.getReportDemands.Get();
	GetReportCreds = () => this.gems.getReportCreds.Get();
	GetReportTerpCreds = () => this.gems.getReportTerpCreds.Get();
	GetReportTags = () => this.gems.getReportTags.Get();
	GetReportSpecialties = () => this.gems.getReportSpecialties.Get();
	
	
	
	
	
	
	/* TERP PAGE CREDS */
	
	// @action GetTerpCreds = async (terpId) => this.gems.getTerpCreds.Get({terpId: terpId});
	// @action GetTerpChecklist = async (terpId) => this.gems.getTerpChecklist.Get({terpId: terpId});
	//
	// @action SaveTerpChecklist = async (terpId, checklist) => {
	// 	return this.gems.saveTerpChecklist.Post({
	// 		terpId: terpId,
	// 		checklist: checklist,
	// 	});
	// };
	//
	// @action SetChecklistByTerpId = async (terpIdToChange, sourceTerpId) => {
	// 	return this.gems.setChecklistByTerpId.Post({
	// 		terpIdToChange: terpIdToChange,
	// 		sourceTerpId: sourceTerpId,
	// 	});
	// };
}

const basicCreds = [2, 3, 4, 26];
const basicCredNames = {
	// I know this sucks
	2: 'Contract',
	3: 'W9',
	4: 'Insurance',
	26: `Driver's License`
};


// const credExample = {
// 	credId: 'id',
// 	demandId: 'demand_id',
// 	name: 'name',
// 	description: 'description',
// 	requires: 'requires',
// 	requiresVerify: 'requires_verify',
// 	expires: 'expires',
// 	form: 'form',
// 	isPublic: 'is_public',
// 	category: 'subcategory',
// 	prefix: 'file_prefix',
// 	cannedRejections: 'canned_rejections',
// };
//
// const terpCredExample = {
// 	terpCredId: 'id',
// 	credId: 'credential_id',
// 	terpId: 'terp_id',
// 	expiresOn: 'expires_on',
// 	fileLocation: 'file_location',
// 	verified: 'verified',
// 	verifiedAt: 'verified_at',
// 	verifiedBy: 'verified_by',
// 	expired: 'expired',
// 	removed: 'removed',
// 	note: 'note',
// 	submission: 'submission',
// 	submittedAt: 'submitted_at',
// };
//
// const demandExample = {
// 	demandId: 'id',
// 	name: 'name',
// 	category: 'category',
// 	notes: 'notes',
// 	// metAny: 'met_any',
// 	// metAll: 'met_all',
// 	credsRequired: 'credsRequired',
// };
//
//
// const terpListTerp = {
// 	terpId: '',
// 	// firstName: '',
// 	// lastName: '',
// 	basicCredCount: '',
// 	otherCredCount: '',
// 	archiveCredCount: '',
// };