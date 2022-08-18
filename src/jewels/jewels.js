import oNowTerp from "./oNowTerp";
import oCredentials from "./oCredentials";
import { oTerp } from "./oTerp";
import oCompany from "./oCompany";
import { oDeaf } from "./oDeaf";
import oJobs from "./oJobs";
import oDemands from "./oDemands";
import oCompanyJobs from "./summaries/oCompanyJobs";
import oFileUpload from "./oFileUpload";
import oHours from "./utils/oHours";
import oSqlMaint from "./utils/oSqlMaint";
import oCron from "./utils/oCron";
import oLogs from "./utils/oLogs";
import oDash from "./summaries/oDash";
import oSeek from "./oSeek";
import oAccount from "./oAccount";
import { oStaffChat } from "./oStaffChat";
import { oJobLists } from "./summaries/oJobLists";
import { oMiscQueryReports } from "./summaries/oMiscQueryReports";
import { oBilling } from "./oBilling";
import { oLocation } from "./oLocation";
import { oJobSeries } from "./oJobSeries";
import { oTerpChecklist } from "./oTerpChecklist";
import { vContact } from "./variance/vContact";
import { vTerp } from "./variance/vTerp";
import { vCompany } from "./variance/vCompany";
import { vDeaf } from "./variance/vDeaf";
import { vCredReport } from "./variance/vCredReport";
import { vBids } from "./variance/vBids";
import { vStaffNews } from "./variance/vStaffNews";
import { oStaffNews } from "./oStaffNews";
import { vFinder } from "./variance/vFinder";
import { oTerpSched } from "./oTerpSched";
import { vTerpSched } from "./variance/vTerpSched";
import { oJobEdit } from "./oJobEdit";
import { vJobUpdate } from "./variance/vJobUpdate";
import { oJobSeek } from "./oJobSeek";
import { vJobSeek } from "./variance/vJobSeek";
import { vTerpLists } from "./variance/vTerpLists";
import { vDeafEditor } from "./variance/vDeafEditor";
import { vDeafLists } from "./variance/vDeafLists";
import { oWatcher } from "./oWatcher";
import { vJobSeries } from "./variance/vJobSeries";
import { vChat } from "./variance/vChat";
import { vJobConfirm } from "./variance/vJobConfirm";
import { oJobConfirm } from "./oJobConfirm";
import { vActionList } from "./variance/vActionList";
import { oDataEdit } from "./oDataEdit";


export class AllJewels {
  oDataEdit: oDataEdit = new oDataEdit();
  oDeaf: oDeaf = new oDeaf();
  oHours: oHours = new oHours();
  oJobConfirm: oJobConfirm = new oJobConfirm();
  oJobEdit: oJobEdit = new oJobEdit();
  oJobSeek: oJobSeek = new oJobSeek();
  oJobSeries: oJobSeries = new oJobSeries();
  oStaffChat: oStaffChat = new oStaffChat();
  oTerp: oTerp = new oTerp();
  oTerpSched: oTerpSched = new oTerpSched();
  oWatcher: oWatcher = new oWatcher();

  /* var store */
  vActionList: vActionList = new vActionList();
  vBids: vBids = new vBids();
  vChat: vChat = new vChat();
  vCompany: vCompany = new vCompany();
  vContact: vContact = new vContact();
  vCredReport: vCredReport = new vCredReport();
  vDeaf: vDeaf = new vDeaf();
  vDeafEditor: vDeafEditor = new vDeafEditor();
  vDeafLists: vDeafLists = new vDeafLists();
  vFinder: vFinder = new vFinder();
  vJobConfirm: vJobConfirm = new vJobConfirm();
  vJobUpdate: vJobUpdate = new vJobUpdate();
  vJobSeek: vJobSeek = new vJobSeek();
  vJobSeries: vJobSeries = new vJobSeries();
  vStaffNews: vStaffNews = new vStaffNews();
  vTerp: vTerp = new vTerp();
  vTerpSched: vTerpSched = new vTerpSched();
  vTerpLists: vTerpLists = new vTerpLists();

  /*
		---------------------------
			Move up when updated
		---------------------------
	*/

  nowTerp: oNowTerp = new oNowTerp();
  credentials: oCredentials = new oCredentials();
  demands: oDemands = new oDemands();
  terpChecklist: oTerpChecklist = new oTerpChecklist();
  oStaffNews: oStaffNews = new oStaffNews();

  /* details pages */
  jobs: oJobs = new oJobs();
  company: oCompany = new oCompany();
  seek: oSeek = new oSeek(); // TODO: remove after updating AllActiveSeekers page
  account: oAccount = new oAccount();
  billing: oBilling = new oBilling();
  location: oLocation = new oLocation();

  /* summaries */
  companyJobs: oCompanyJobs = new oCompanyJobs();
  dash: oDash = new oDash();
  jobLists: oJobLists = new oJobLists();
  miscQueryReports: oMiscQueryReports = new oMiscQueryReports();

  /* utils */
  fileUpload: oFileUpload = new oFileUpload();
  cron: oCron = new oCron();
  sqlMaint: oSqlMaint = new oSqlMaint();
  logs: oLogs = new oLogs();
}
