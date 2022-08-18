import {action, computed, observable} from 'mobx';
import {
	MdAccessibility,
	MdAccessTime,
	MdAccountBox,
	MdAvTimer,
	MdBuild,
	MdChat,
	MdDataUsage,
	MdDateRange, MdEdit,
	MdFileUpload,
	MdFilterList,
	MdHistory,
	MdPoll,
	MdSearch,
	MdTimelapse,
} from 'react-icons/md';
import {Home} from './pages/Home';
import {NowTerp} from './pages/NowTerp';
import {JobPage} from './pages/Job/JobPage';
import {FaHeartbeat, FaMoneyBill, FaThList} from 'react-icons/fa';
import {Seeking} from './pages/Seeking';
import {Cron} from './pages/Cron';
import {FinderPage} from './pages/Job/FinderPage';
import {TerpPage} from './pages/Terp/TerpPage';
import {TerpScheds} from './pages/Terp/TerpScheds';
import {Logs} from './pages/Reports/Logs';
import {Utils} from './pages/Utils';
import {DeafPage} from './pages/Deaf/DeafPage';
import {CompanyPage} from './pages/Company/CompanyPage';
import {CompanyJobs} from './pages/summaries/CompanyJobs';
import {FileUpload} from './pages/FileUpload';
import {Hours} from './pages/utils/Hours';
import {SqlMaint} from './pages/utils/SqlMaint';
import {AllActiveSeekers} from './pages/summaries/AllActiveSeekers';
import Account from './pages/Account';
import {BlankPaper} from './Bridge/misc/Paper';
import {CredEditor} from './pages/Terp/credentialing/CredEditor';
import {ChatPage} from './pages/ChatPage';
import {MiscQueryReport} from './pages/Reports/MiscQueryReport';
import {Billable} from './pages/Reports/Billable';
import {ActionListPage} from './pages/ActionList/ActionListPage';
import {UserPage} from './pages/misc/UserPage';
import {ContactPage} from './pages/Company/ContactPage';
import {Location} from './pages/Company/Location';
import {Staff} from './pages/Staff';
import {JobList} from './pages/Job/JobList';
import {Jewels} from './stores/RootStore';
import {CompanyDemandList} from './pages/Terp/credentialing/CompanyDemandList';
import {CompanyList} from './pages/Company/CompanyList';
import React from 'react';
import {CredReport} from './pages/Terp/credentialing/CredReport';
import {GiWoodenSign} from 'react-icons/gi';
import {SeekingNav} from './pages/Job/Seeking/SeekingNav';
import {AppNews} from './pages/Terp/AppNews';
import {CredQueueNavNotes, CredQueuePage} from './pages/Terp/CredQueuePage';
import {RouteDef} from './Bridge/RouterX/RouteDef';
import {DataEditPage} from './pages/DataEditPage';
import {DATA_EDIT_OVERVIEW} from './jewels/oDataEdit';


export default class routes {
	
	@observable routes = {
		home: new RouteDef({
			path: '/',
			important: false,
			component: Home,
			name: 'Dashboard',
			exact: true,
			icon: FaHeartbeat,
			browserTitle: () => 'Starfish 🤟⭐🐟',
			fnAfterEnter: () => {
				Jewels().oHours.LoadHours();
			},
		}),
		seeking: new RouteDef({
			path: '/seeking',
			customNav: SeekingNav,
			important: true,
			primary: true,
			component: Seeking,
			name: 'Bids',
			icon: GiWoodenSign,
		}),
		actionList: new RouteDef({
			path: '/actionList',
			icon: FaThList,
			iconSize: 14,
			name: 'Action!',
			pageProps: {
				pad: '0',
				marH: 12,
				marV: 12,
			},
			component: ActionListPage,
			primary: true,
			fnAfterEnter: () => Jewels().vActionList.SetIsOnPage(true),
			fnAfterExit: () => Jewels().vActionList.SetIsOnPage(false),
		}),
		account: new RouteDef({
			path: '/account',
			header: 'Accounts',
			name: 'Accounts',
			component: Account,
			icon: MdAccountBox,
			primary: true,
			noPadding: true,
		}),
		credentials: new RouteDef({
			path: '/credentials',
			header: 'Credentials',
			// notes: () => Jewels().credentials.queueCount,
			notes: CredQueueNavNotes,
			component: CredQueuePage,
			name: 'Credentials',
			icon: MdFilterList,
			primary: true,
		}),
		nowterp: new RouteDef({
			path: '/nowterp',
			header: 'NowTerp! Shifts',
			primary: true,
			component: NowTerp,
			name: 'NowTerp!',
			icon: MdAccessTime,
			fnAfterEnter: () => {
				// Staches().terps.Refresh();
				Jewels().nowTerp.Enter();
			},
		}),
		
		
		/* Secondary */
		terpScheds: new RouteDef({
			path: '/terpSched/:region',
			name: 'Terp Schedules',
			header: '',
			component: TerpScheds,
			icon: MdDateRange,
			defaultParams: {
				region: 'Metro',
			},
			fnAfterEnter: (params) => Jewels().vTerpSched.EnterTerpSchedPage(params.region),
			fnAfterParamsChange: (params) => Jewels().vTerpSched.ParamsChangeTerpSchedPage(params.region),
			browserTitle: (params) => `${params.region} - Starfish`,
		}),
		
		finder: new RouteDef({
			path: '/finder',
			header: 'Finder',
			name: 'Finder',
			component: FinderPage,
			icon: MdSearch,
			fnAfterEnter: () => {
				return Jewels().vFinder.OnEnter();
			}
		}),
		chat: new RouteDef({
			path: '/chat/:terpId',
			header: 'Chat',
			name: 'Chat History',
			icon: MdChat,
			component: ChatPage,
			defaultParams: {
				terpId: 'overview',
			},
		}),
		companyJobs: new RouteDef({
			path: '/companyJobs',
			header: 'Company Jobs',
			name: 'Company Jobs',
			component: CompanyJobs,
			icon: MdPoll,
			utility: true,
		}),
		credReport: new RouteDef({
			path: '/credReport',
			header: 'Credential Report',
			name: 'Credential Report',
			component: CredReport,
		}),
		companyDemands: new RouteDef({
			path: '/companyDemandsList',
			header: 'Company Demands List',
			name: 'Company Demands List',
			component: CompanyDemandList,
			icon: MdPoll,
			fnAfterEnter: () => {
				return Jewels().demands.LoadAllCompanyDemands();
			},
		}),
		// processedFromPortal: new RouteDef({
		// 	path: '/processedFromPortal',
		// 	header: 'Processed From Portal',
		// 	important: false,
		// 	component: ProcessedFromPortal,
		// 	name: 'Processed From Portal',
		// 	icon: MdFilterList,
		// 	utility: true,
		// }),
		appNews: new RouteDef({
			path: '/appNews',
			header: 'App News',
			name: 'App News',
			// icon: IoNewspaperOutline,
			component: AppNews,
			// utility: true,
			fnAfterEnter: () => Jewels().vStaffNews.EnterPage(),
		}),
		
		
		/* Link only pages */
		
		job: new RouteDef({
			path: '/job/:jobId/:tab',
			defaultParams: {
				tab: 'details',
			},
			header: '',
			page: BlankPaper,
			component: JobPage,
			browserTitle: (params) => `#${params.jobId}`,
			fnAfterEnter: (params) => Jewels().vJobUpdate.PageEnter(params),
			fnAfterParamsChange: (params) => Jewels().vJobUpdate.PageParamsChange(params),
			fnAfterExit: (params) => Jewels().vJobUpdate.PageExit(params),
		}),
		company: new RouteDef({
			path: '/company/:companyId/:tab',
			defaultParams: {
				companyId: 'overview',
				tab: 'edit',
			},
			page: BlankPaper,
			component: CompanyPage,
			noPadding: true,
			fnAfterEnter: ({companyId, tab}) => Jewels().vCompany.Load(companyId),
			fnAfterParamsChange: ({companyId, tab}) => Jewels().vCompany.Load(companyId),
		}),
		terp: new RouteDef({
			path: '/terp/:terpId',
			defaultParams: {
				terpId: 'overview',
			},
			component: TerpPage,
			fnAfterEnter: ({terpId}) => Jewels().vTerp.Load(terpId),
			fnAfterParamsChange: ({terpId}) => Jewels().vTerp.Load(terpId),
		}),
		deaf: new RouteDef({
			path: '/deaf/:deafId',
			defaultParams: {
				deafId: 'overview',
			},
			component: DeafPage,
			noPadding: true,
			fnAfterEnter: ({deafId}) => Jewels().vDeaf.Load(deafId),
			fnAfterParamsChange: ({deafId}) => Jewels().vDeaf.Load(deafId),
		}),
		contact: new RouteDef({
			path: '/contact/:contactId',
			component: ContactPage,
			fnAfterEnter: (params) => Jewels().vContact.Load(params.contactId),
			fnAfterParamsChange: (params) => Jewels().vContact.Load(params.contactId),
		}),
		location: new RouteDef({
			path: '/location/:locationId',
			component: Location,
		}),
		staff: new RouteDef({
			path: '/staff/:staffId',
			component: Staff,
		}),
		jobList: new RouteDef({
			path: '/jobList/:jobIds',
			component: JobList,
			defaultParams: {
				jobIds: '',
			},
		}),
		companyList: new RouteDef({
			path: '/companyList/:companyIds',
			component: CompanyList,
			defaultParams: {
				companyIds: '',
			},
		}),
		
		
		
		
		/* ADMIN UTILITIES */
		
		utils: new RouteDef({
			path: '/utils',
			header: 'Admin Utilities',
			name: 'Admin Utils',
			component: Utils,
			icon: MdBuild,
			secondary: true,
		}),
		logs: new RouteDef({
			path: '/logs',
			header: 'Logs',
			name: 'Log Grabber',
			component: Logs,
			icon: MdHistory,
			utility: true,
		}),
		cron: new RouteDef({
			path: '/cron',
			header: 'Crons',
			name: 'Crons',
			component: Cron,
			icon: MdAvTimer,
			utility: true,
			fnAfterEnter: () => Jewels().cron.Load(),
		}),
		fileUpload: new RouteDef({
			path: '/fileUpload',
			header: 'File Upload',
			name: 'File Upload',
			component: FileUpload,
			icon: MdFileUpload,
			utility: true,
		}),
		hours: new RouteDef({
			path: '/hours',
			header: 'Business Hours',
			name: 'Business Hours',
			component: Hours,
			icon: MdTimelapse,
			utility: true,
			fnAfterEnter: () => Jewels().oHours.LoadHours(),
		}),
		sqlMaint: new RouteDef({
			path: '/sqlMaint',
			header: 'Sql Maint',
			name: 'Sql Maint',
			component: SqlMaint,
			icon: MdDataUsage,
			utility: true,
		}),
		allActiveSeekers: new RouteDef({
			path: '/allActiveSeekers',
			header: 'All Active Seekers',
			name: 'All Active Seekers',
			component: AllActiveSeekers,
			icon: MdAccessibility,
			utility: true,
		}),
		credEditor: new RouteDef({
			path: '/credEditor',
			header: 'Credential Editor',
			name: 'Credential Editor',
			component: CredEditor,
			utility: true,
			fnAfterEnter: () => Jewels().credentials.LoadAllCreds(),
		}),
		miscQueryReport: new RouteDef({
			path: '/miscQueryReport',
			component: MiscQueryReport,
			name: 'Misc Query Report',
			header: 'Misc Query Report',
			utility: true,
		}),
		billableReport: new RouteDef({
			path: '/billableReport',
			icon: FaMoneyBill,
			name: 'Billable Report',
			component: Billable,
			utility: true,
		}),
		user: new RouteDef({
			path: '/user',
			name: 'User',
			component: UserPage,
			icon: MdAccountBox,
		}),
		dataEdit: new RouteDef({
			path: '/dataEdit/:tableKey/:pk',
			defaultParams: {
				tableKey: DATA_EDIT_OVERVIEW,
				pk: DATA_EDIT_OVERVIEW,
			},
			header: 'Data Editor',
			name: 'Data Editor',
			component: DataEditPage,
			icon: MdEdit,
			utility: true,
		}),
	};
	
	
	// TODO: update these
	
	@computed get routesArray() {
		return Object.values(this.routes);
	}
	
	@computed get menuNavs() {
		return this.routesArray.filter(r => r.primary && !r.hide);
	}
	
	@computed get secondaryNavs() {
		return this.routesArray.filter(r => r.secondary && !r.hide);
	}
	
	@computed get utilNavs() {
		return this.routesArray.filter(r => r.utility && !r.hide);
	}
	
	@computed get prependTitle() {
		if (Jewels().vChat.unreadChatCount) return '💬 ';
		return '';
	}
	
	@observable collapsed = false;
	@action ToggleCollapse = () => {
		this.collapsed = !this.collapsed;
	};
	
	@observable hidden = false;
	@action SetHiddenMenu = (hidden) => this.hidden = hidden;
	
	// @action NavToJob = jobId => {
	// 	// Root().JobStore.LoadJob(jobId);
	// 	this.history.push(`/job/${jobId}`);
	// };
}