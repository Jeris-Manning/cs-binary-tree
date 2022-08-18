import {Stache, STACHE_MODE} from '../Bridge/DockClient/Stache';
import {CompanyDat} from '../datum/stache/CompanyDat';
import {ContactDat} from '../datum/stache/ContactDat';
import {DeafDat} from '../datum/stache/DeafDat';
import {StaffDat} from '../datum/stache/StaffDat';
import {TerpDat} from '../datum/stache/TerpDat';
import {TerpPhotoDat} from '../datum/stache/TerpPhotoDat';
import {TerpTagDat} from '../datum/stache/TerpTagDat';
import {TerpSpecialtyDat} from '../datum/stache/TerpSpecialtyDat';
import {RegionDat} from '../datum/stache/RegionDat';
import {LocationDat} from '../datum/stache/LocationDat';
import {JobHistoryDat} from '../datum/stache/JobHistoryDat';
import {SearchDat} from '../datum/stache/SearchDat';
import {CompanyLocationsDat} from '../datum/stache/CompanyLocationsDat';
import {JobDat} from '../datum/stache/JobDat';
import {CompanyDeafsDat} from '../datum/stache/CompanyDeafsDat';
import {CompanyContactsDat} from '../datum/stache/CompanyContactsDat';
import {BillTypeDat} from '../datum/stache/BillTypeDat';
import {TerpListDat} from '../datum/stache/TerpListDat';
import {CredentialDat} from '../datum/stache/CredentialDat';
import {DemandDat} from '../datum/stache/DemandDat';
import {TerpCredsDat} from '../datum/stache/TerpCredsDat';
import {TerpDemandsDat} from '../datum/stache/TerpDemandsDat';
import {DeafPrefsDat} from '../datum/stache/DeafPrefsDat';
import {JobSeekDat} from '../datum/stache/JobSeekDat';
import {NowTerpDat} from '../datum/stache/NowTerpDat';
import {DeafListDat} from '../datum/stache/DeafListDat';
import {CompanyPrefsDat} from '../datum/stache/CompanyPrefsDat';
import {WatcherDat} from '../datum/stache/WatcherDat';
import {JobSeriesDat} from '../datum/stache/JobSeriesDat';
import {TerpChatDat} from '../datum/stache/TerpChatDat';
import {ChatSummaryDat} from '../datum/stache/ChatSummaryDat';
import {TerpNextJobDat} from '../datum/stache/TerpNextJobDat';
import {TerpChatHistoryDat} from '../datum/stache/TerpChatHistoryDat';
import {TerpCredListDat} from '../datum/stache/TerpCredListDat';
import {JobOverlapDat} from '../pages/Job/JobUpdate/JobOverlapDat';
import {JobChatDat} from '../datum/stache/JobChatDat';
import {JobsByDateDat} from '../datum/stache/JobsByDateDat';
import {SeekSummaryDat} from '../datum/stache/SeekSummaryDat';

const FULL = STACHE_MODE.full;
const ON_DEMAND = STACHE_MODE.onDemand;
const ENUM = STACHE_MODE.enum;

export class AllStaches {
	
	cBillType: Stache<BillTypeDat> = new Stache(BillTypeDat, ENUM); // enum
	cChatSummary: Stache<ChatSummaryDat> = new Stache(ChatSummaryDat, ON_DEMAND);
	cCompany: Stache<CompanyDat> = new Stache(CompanyDat, FULL);
	cCompanyContacts: Stache<CompanyContactsDat> = new Stache(CompanyContactsDat, ON_DEMAND);
	cCompanyDeafs: Stache<CompanyDeafsDat> = new Stache(CompanyDeafsDat, ON_DEMAND);
	cCompanyLocations: Stache<CompanyLocationsDat> = new Stache(CompanyLocationsDat, ON_DEMAND);
	cCompanyPrefs: Stache<CompanyPrefsDat> = new Stache(CompanyPrefsDat, ON_DEMAND);
	cContact: Stache<ContactDat> = new Stache(ContactDat, FULL);
	cCredential: Stache<CredentialDat> = new Stache(CredentialDat, ENUM); // enum
	cDeaf: Stache<DeafDat> = new Stache(DeafDat, FULL);
	cDeafList: Stache<DeafListDat> = new Stache(DeafListDat, ON_DEMAND);
	cDeafPrefs: Stache<DeafPrefsDat> = new Stache(DeafPrefsDat, FULL);
	cDemand: Stache<DemandDat> = new Stache(DemandDat, ENUM); // enum
	cJob: Stache<JobDat> = new Stache(JobDat, ON_DEMAND);
	cJobChat: Stache<JobChatDat> = new Stache(JobChatDat, ON_DEMAND);
	cJobHistory: Stache<JobHistoryDat> = new Stache(JobHistoryDat, ON_DEMAND);
	cJobOverlap: Stache<JobOverlapDat> = new Stache(JobOverlapDat, ON_DEMAND);
	cJobSeek: Stache<JobSeekDat> = new Stache(JobSeekDat, ON_DEMAND);
	cJobSeries: Stache<JobSeriesDat> = new Stache(JobSeriesDat, ON_DEMAND);
	cJobsByDate: Stache<JobsByDateDat> = new Stache(JobsByDateDat, ON_DEMAND);
	cLocation: Stache<LocationDat> = new Stache(LocationDat, ON_DEMAND);
	cNowTerp: Stache<NowTerpDat> = new Stache(NowTerpDat, FULL);
	cRegion: Stache<RegionDat> = new Stache(RegionDat, ENUM); // enum
	cSearch: Stache<SearchDat> = new Stache(SearchDat, FULL);
	cSeekSummary: Stache<SeekSummaryDat> = new Stache(SeekSummaryDat, ON_DEMAND);
	cStaffByEmail: Stache<StaffDat> = new Stache(StaffDat, FULL);
	cStaffById: Stache<StaffDat> = new Stache(StaffDat, FULL);
	cStaffByName: Stache<StaffDat> = new Stache(StaffDat, FULL);
	cTerp: Stache<TerpDat> = new Stache(TerpDat, FULL);
	cTerpChat: Stache<TerpChatDat> = new Stache(TerpChatDat, ON_DEMAND);
	cTerpChatHistory: Stache<TerpChatHistoryDat> = new Stache(TerpChatHistoryDat, ON_DEMAND);
	cTerpCredList: Stache<TerpCredListDat> = new Stache(TerpCredListDat, ON_DEMAND);
	cTerpCreds: Stache<TerpCredsDat> = new Stache(TerpCredsDat, FULL);
	cTerpDemands: Stache<TerpDemandsDat> = new Stache(TerpDemandsDat, FULL);
	cTerpList: Stache<TerpListDat> = new Stache(TerpListDat, ON_DEMAND);
	cTerpNextJob: Stache<TerpNextJobDat> = new Stache(TerpNextJobDat, ON_DEMAND);
	cTerpPhoto: Stache<TerpPhotoDat> = new Stache(TerpPhotoDat, FULL);
	cTerpSpecialty: Stache<TerpSpecialtyDat> = new Stache(TerpSpecialtyDat, ENUM); // enum
	cTerpTag: Stache<TerpTagDat> = new Stache(TerpTagDat, ENUM); // enum
	cWatcher: Stache<WatcherDat> = new Stache(WatcherDat, ON_DEMAND);
	
}


/*
	IndexedDB create index
	https://developer.mozilla.org/en-US/docs/Web/API/IDBObjectStore/createIndex
	IDBObjectStore.createIndex()

*/

// ## OLD
// terps
// 	lookups: ['region'],
// terpTags,
// terpSpecialties,
// regions,
// deafs,
// companies,
// contacts
// 	lookups: ['companyId'],
// staff
// 	altKeys: ['staffId', 'internalName']

// @observable lookupKeys = [];
// @observable altKeys = []; // MUST also be unique
// this.lookupKeys = config.lookups || [];
// this.lookupKeys.forEach(key => this._lookups.set(key, new Map()));
// this.altKeys = config.altKeys || [];
// this.altKeys.forEach(key => this._alts.set(key, new Map()));
// this._lookups.forEach(lup => lup.clear());
// this._alts.forEach(alt => alt.clear());
// this.lookupKeys.forEach(lookupKey => {
// 	const lup = this._lookups.get(lookupKey);
// 	const itemKey = `${item[lookupKey]}`;
// 	const items = lup.get(itemKey) || [];
// 	items.push(item);
// 	lup.set(itemKey, items);
// });
//
// this.altKeys.forEach(altKey => {
// 	const lup = this._alts.get(altKey);
// 	lup.set(item[altKey], item);
// });
//
// LupGet = (inLup, key) => {
// 	const lup = this._lookups.get(inLup);
// 	return lup.get(`${key}`) || [];
// };
//
// GetAlt = (inAlt, key, inner = '', or = '???') => {
// 	const alt = this._alts.get(inAlt);
// 	return inner
// 		? (alt.get(key) || {})[inner] || or
// 		: alt.get(key) || {};
// };