// import {action, computed, observable} from 'mobx';
// import thyme from '../Bridge/thyme';
//
// /**
//  * A job
//  */
// // thanks ^
// // TODO: remove most of this, should be looking at jobUpstate instead
// export default class Job {
//
// 	@observable key = '';
// 	@observable jobId = '';
// 	@observable start = ''; // thyme
// 	@observable end = ''; // thyme
// 	@observable createdAt = ''; // thyme
// 	@observable createdBy = ''; // internalName
// 	@observable updatedOn = ''; // thyme
// 	@observable updatedBy = '';
// 	@observable isCancelled = '';
// 	@observable status = 0;
// 	// @observable statusId = 0;
// 	@observable billType; // comes in as string
// 	@observable billTypeId; // gets added locally based on a lookup from billType
// 	@observable situation = '';
// 	@observable rate = '';
// 	@observable cap = '';
// 	@observable specialNotes = '';
// 	@observable hourMin = 2;
// 	@observable flatRate = 0;
// 	@observable overrideRate = 0;
// 	@observable contactUponArrival = '';
// 	@observable requestedBy = '';
// 	@observable terpInvoice = '';
//
// 	@observable terpId = '';
// 	@observable deafIds = [];
// 	@observable deafs = []; // TODO no longer used?
// 	@observable regionId = '';
// 	@observable region = '';
// 	@observable wantedTerps = [];
// 	@observable interns = [];
//
// 	@observable companyId = '';
// 	@observable companyName = '';
// 	@observable companyLocations = []; // {};
// 	@observable companyContacts = [];
// 	@observable companyDeafs = {}; // lup
// 	@observable contactId = '';
// 	@observable companyNote = '';
//
// 	@observable confirmationInfo = '';
// 	@observable companyConfirmed = ''; // thyme
// 	@observable terpConfirmed = ''; // thyme
//
// 	@observable locationId = '';
// 	@observable address = '';
// 	@observable directions = '';
// 	@observable city = '';
// 	@observable latitude = '';
// 	@observable longitude = '';
// 	@observable mapped = '';
// 	@observable streetNumber = '';
// 	@observable street = '';
// 	@observable locality = '';
// 	@observable state = '';
// 	@observable zip = '';
// 	@observable formatted = '';
// 	@observable placeID = '';
// 	@observable locationName = '';
//
// 	@observable p2pDispatch = '';
// 	@observable p2pHome = '';
// 	@observable qbStatus = '';
//
// 	/* job_extra */
// 	@observable vri = false;
// 	@observable receivedFrom = '';
// 	@observable followUp = false;
// 	@observable warning = '';
// 	@observable teamedId = 0;
// 	@observable seriesId = 0;
//
// 	@observable history = {
// 		jobId: '',
// 		version: '',
// 		record: {
// 			data: [],
// 		},
// 		updatedAt: '', // thyme
// 		updatedBy: '',
// 	};
//
// 	@observable chats = {};
// 	@observable companyConflicts = [];
// 	@observable locationConflicts = [];
// 	@observable deafConflicts = {};
// 	@observable terpConflicts = [];
//
// 	@observable mock = false;
//
// 	/* Calculated */
//
// 	@computed get duration() {
// 		return thyme.timeBetween(this.start, this.end);
// 	}
//
// 	constructor(raw, source) {
// 		this.Init(raw, source);
// 	}
//
// 	@action Init = (obj) => {
// 		if (!obj) {
// 			return console.error(`tried to Job.Init undefined object`);
// 		}
//
// 		Object.assign(this, obj);
// 		this.jobId = `${this.jobId}`;
// 	};
//
// 	@action SetBillTypeId = (billTypeId) => this.billTypeId = billTypeId;
//
// 	@computed get conflictTypes() {
// 		let types = '';
// 		if (this.companyConflicts.length) types += 'company ';
// 		if (this.locationConflicts.length) types += 'location ';
// 		if (Object.values(this.deafConflicts).some(d => d.length)) types += 'deaf ';
// 		if (this.terpConflicts.length) types += 'terp ';
// 		return types;
// 	}
// }