import {action, computed, observable, runInAction, toJS} from 'mobx';
import {RouterX} from '../Bridge/RouterX/RouterX';
import {AllJewels} from '../jewels/jewels';
import {JewelerClient} from '../Bridge/DockClient/JewelerClient';
import {DockClient} from '../Bridge/DockClient/DockClient';
import {StacherClient} from '../Bridge/DockClient/StacherClient';
import EventPromiser from '../Bridge/RouterX/EventPromiser';
import routes from '../routes';
import {AllStaches} from '../staches/staches';
import HolidayEvent from '../misc/holiday/HolidayEvent';
import thyme from '../Bridge/thyme';
import $j, {is, kvp, vow} from '../Bridge/misc/$j';
import Holidays from 'date-holidays';
import {GetIfNextVersion, VERSION} from '../VERSION';
import {StaffAccount} from '../datum/StaffAccount';
import {vJobUpdate} from '../jewels/variance/vJobUpdate';

const holidayEventType = ''; // '', 'halloween_bat', 'halloween_spider',

export const Root = (): RootStore => RootStore.instance;
export const Jewels = (): AllJewels => RootStore.instance.jewels;
export const Staches = (): AllStaches => RootStore.instance.staches;
export const Router = (): RouterX => RootStore.instance.router;
export const LocalStaff = (): StaffAccount => RootStore.instance.staff;
export const IS_DEBUG = () => RootStore.instance.IS_DEBUG;

const USER_KEY = 'user';
const PREFS_KEY = 'prefs';
const TOKENS_KEY = 'tokens';

export class RootStore {
	static instance;
	
	@observable mapKey = 'AIzaSyAV2vP2ZNaE9NzomNQXF1AAmXzrmDAF-7E'; // todo: move
	
	router = new RouterX();
	routes = new routes();
	jeweler = new JewelerClient();
	stacher = new StacherClient();
	dock = new DockClient();
	eventPromiser = new EventPromiser(() => this.ShouldDeferRouterEvents());
	
	constructor() {
		console.log(`Constructing root`);
		RootStore.instance = this;
		
		this.router.StartRouter({
			routes: this.routes.routes,
			eventPromisers: {
				fnAfterEnter: this.eventPromiser.AddOrResolve
			},
			canLeaveSite: this.CanLeaveSite,
			canNavigate: this.CanNavigate,
			onLeaveSite: this.OnLeaveSite,
		});
		
		HolidayEvent(holidayEventType);
		
		this.InitializeTicker();
	}
	
	
	@computed get IS_DEBUG() {
		return this.forceDebug || this.isLocalClient;
	}
	
	@action MainMounted() {
		this.Initialize();
	}
	
	@observable isInitialized = false;
	@observable criticalError = "";
	@observable jewels: AllJewels = new AllJewels();
	@observable staches: AllStaches = new AllStaches();
	
	@action Initialize = () => {
		if (this.isInitialized) return;
		
		console.log(`ROOT initializing`);
		
		this.isLocalClient = window.location.href.includes('localhost');
		
		this.dock.Initialize({
			channels: {
				jeweler: this.jeweler,
				stacher: this.stacher,
			},
			onConnected: (header, content) => {
				console.log(`root connected ${thyme.nice.dateTime.short(thyme.now())}`);
				this.OnConnected(header, content);
			},
			onDisconnected: (header, content) => {
				console.log(`root disconnected`);
				this.OnDisconnected(header, content);
			},
			onAuthEvent: (header, content) => this.AuthEvent(header, content),
			onError: (header, content) => {
				runInAction(() => {
					this.criticalError = `Dock error: ${content.error}`;
				})
				throw new Error(`Dock error: ${content.error}`);
			},
			onForceCommand: () => {
				throw new Error('TODO onForceCommand');
			},
			onSetPrime: isPrime => this.SetIsPrime(isPrime),
		});
		
		this.stacher.Initialize({
			staches: this.staches,
		});
		
		this.jeweler.Initialize({
			jewels: Jewels(),
			injections: {
				root: this,
				router: this.router,
				staches: this.staches,
			},
		});
		
		this.isInitialized = true;
		
		console.log(`ROOT initialization complete`);
		
		this.stacher.PreloadAll();
	};
	
	@observable needsAuth = false;
	@observable isAuthing = false;
	@observable isAuthed = false;
	@observable authError = '';
	@observable user = {};
	@observable staff: StaffAccount = {};
	@observable nextVersion = null;
	
	@action SendAuth = async (username, password) => {
		this.authError = '';
		this.isAuthing = true;
		
		try {
			const answer =
				await this.dock.SendWorkerRequest('auth', {
					userPw: {
						username: username,
						password: password,
					},
					version: VERSION, // TODO: also send with renew
				});
			
			const result = answer.content;
			
			runInAction(() => {
				this.isAuthing = false;
				if (result.error) {
					this.authError = result.error;
				} else {
					this.needsAuth = false;
				}
			});
			
		} catch (err) {
			console.error(err);
		}
	};
	
	@action AuthEvent = async (header, content) => {
		console.log(`dock worker reports authEvent: `, header, content);
		
		this.serverSimLag = Number(header.serverSimLag || 0);
		
		if (content === 'needsAuth') {
			this.needsAuth = true;
			return;
		}
		
		if (content === 'isAuthed') {
			
			await this.OnSuccessfulAuth();
			
			// this.stacher.SendWorkerInitialize();
			// await this.stacher._PreloadAll();
			
			const user =
				await this.stacher.GetInfo(USER_KEY);
			
			console.log(`isAuthed: true`);
			
			runInAction(() => {
				this.user = user;
				this.needsAuth = false;
				this.isAuthing = false;
				this.isAuthed = true;
				this.authError = '';
				this.eventPromiser.Proceed();
			});
		}
	};
	
	@action OnSuccessfulAuth = async () => {
		const [[staff, _], error] = await vow([
			Jewels().account.GetStaffAccount(),
		]);
		
		if (error) throw new Error(`Please refresh. Unexpected server/database error: ${error} (or check logs)`);
		
		runInAction(() => {
			const staffAccount = new StaffAccount(staff);
			this.staff = staffAccount;
			this.nextVersion = GetIfNextVersion(staffAccount.newestVersion);
		});
		
		await this.LoadPrefs();
	};
	
	@action Logout = async () => {
		await this.stacher.RemoveInfo(TOKENS_KEY);
		window.location.reload();
	};
	
	
	ShouldDeferRouterEvents = () => {
		return !this.isConnected || !this.isAuthed;
	};
	
	
	@observable isConnected = false;
	@observable serverAddress = '';
	@observable isLocalServer = false;
	@observable isLocalClient = false;
	@observable serverSimLag = 0;
	@observable clientPortId: number;
	@observable forceDebug = false;
	
	@action OnConnected = (header, content = {}) => {
		this.isConnected = true;
		this.serverAddress = content.serverAddress || '';
		this.isLocalServer = this.serverAddress.includes('localhost');
		// this.isLocalClient = window.location.href.includes('localhost');
		this.clientPortId = header.clientPortId;
		console.log(`CONNECTED to ${this.serverAddress}`, header);
	};
	
	@action OnDisconnected = (header, content = {}) => {
		console.log(`DISCONNECTED`, header);
		this.isConnected = false;
	};
	
	@computed get areStachesAllPreloaded(): boolean {
		return this.stacher.isAllPreloaded;
	}
	
	@action ToggleForceDebug = () => this.forceDebug = !this.forceDebug;
	
	/* BROWSER NOTIFICATIONS */
	
	@observable isPrime = false;
	
	@action SetIsPrime = (isPrime) => {
		console.log(`Session is now PRIME: ${isPrime}`);
		this.isPrime = isPrime;
	};
	
	@action CheckNotificationPermission = () => {
		if ('Notification' in window) {
			if (Notification.permission !== 'granted') {
				Notification.requestPermission().then();
			}
		}
	};
	
	@action Notification = (text) => {
		if ('Notification' in window) {
			if (Notification.permission !== 'granted') {
				console.log(`Notification requires permission first`);
				Notification.requestPermission().then();
				return;
			}
			
			if (!this.isPrime) {
				console.log(`tried to do notification, but this session isn't PRIME`);
				return;
			}
			
			console.log(`Notification: ${text}`);
			new Notification(text);
		} else {
			console.log(`Can't find Notification in window`);
		}
	};
	
	CanLeaveSite = () => {
		const vJobUpdate = Jewels().vJobUpdate;
		if (vJobUpdate.isOnPage && vJobUpdate.canSave) return false;
		return true;
	};
	
	CanNavigate = () => {
		// TODO: make better system for this
		
		const vJobUpdate: vJobUpdate = Jewels().vJobUpdate || {};
		
		const warning = vJobUpdate.navigationWarning;
		if (warning) {
			const areYouSure = window.confirm(warning);
			if (!areYouSure) return false;
		}
		
		return true;
	};
	
	@action OnLeaveSite = () => {
		// ?
	};
	
	
	holidayUtil = new Holidays('US', 'mn');
	
	GetHolidays = (dt) => {
		if (!dt) return [];
		const holidays = this.holidayUtil.isHoliday(new Date(thyme.toIso(dt)));
		if (!holidays) return [];
		return Array.isArray(holidays)
			? holidays.map(h => h.name)
			: [holidays.name];
	};
	
	
	/* USER PREFS */
	// TODO: move to it's own class/file
	@observable prefs = GetDefaultPrefs();
	
	@action LoadPrefs = async () => {
		console.log(`Loading Prefs`);
		
		const existing =
			await this.stacher.GetInfo(PREFS_KEY);
		
		if (!existing) return this.SavePrefs(GetDefaultPrefs());
		
		const defaults = GetDefaultPrefs();
		const finalPrefs = GetDefaultPrefs();
		
		// overwrite each pref if has existing
		for (const categoryKey of Object.keys(defaults)) {
			if (!existing.hasOwnProperty(categoryKey)) {
				// no pref, use default
				continue;
			}
			
			const innerKeys = Object.keys(defaults[categoryKey]);
			
			for (const innerKey of innerKeys) {
				const existingObj = existing[categoryKey];
				if (existingObj.hasOwnProperty(innerKey)) {
					finalPrefs[categoryKey][innerKey] = existingObj[innerKey];
				}
			}
		}
		
		return this.SavePrefs(finalPrefs);
	};
	
	@action SavePrefs = async (prefs) => {
		this.prefs = prefs;
		
		let prefsToSave = {};
		
		for (const [key, val] of kvp(prefs)) {
			prefsToSave[key] = toJS(val);
		}
		
		await this.stacher.SetInfo(PREFS_KEY, prefsToSave);
		
		console.log(`Saved Prefs`, prefsToSave);
	};
	
	@action UpdatePref = async (prefCategory, innerKey, value) => {
		console.log(`UpdatePref ${prefCategory}.${innerKey}: ${value}`);
		this.prefs[prefCategory][innerKey] = value;
		await this.SavePrefs(this.prefs);
	};
	
	@action TogglePref = async (prefCategory, prefObj) =>
		this.UpdatePref(
			prefCategory.key,
			prefObj.key,
			!this.prefs[prefCategory.key][prefObj.key]
		);
	
	/* TICKER */
	
	@observable now = thyme.now();
	@observable tickerId = '';
	
	@action InitializeTicker = () => {
		this.tickerId = setInterval(() => this.Tick(), 1000);
		this.Tick();
	};
	
	@action Tick = () => {
		this.now = thyme.now();
	};
	
	
	/* MISC */
	shiftSpacer = 300;
	@observable lastShift = 0;
	
	@action OnShiftPressed = () => {
		console.log('shift');
		if (thyme.nowMs() - this.lastShift < this.shiftSpacer) {
			console.log('SHIFT SHIFT detected');
		} else {
			this.lastShift = thyme.nowMs();
		}
	};
	
	
	@computed get aprilFools() {
		return this.prefs.holiday.aprilFools;
	};
	
	// @action ToggleAprilFools = () => this.TogglePrefIn('holiday', 'aprilFools');
}

export const USER_PREFS = {
	chat: {
		key: 'chat',
		shouldRefJob: {
			key: 'shouldRefJob',
			prefDefault: false,
		},
	},
	unfilled: {
		key: 'unfilled',
		sortByEntry: {
			key: 'sortByEntry',
			prefDefault: false,
		},
	},
	action: {
		key: 'action',
		sortByEntry: {
			key: 'sortByEntry',
			prefDefault: false,
		},
	},
	bids: {
		key: 'bids',
		notify: {
			key: 'notify',
			prefDefault: true,
		},
	},
	holiday: {
		key: 'holiday',
		aprilFools: {
			key: 'aprilFools',
			prefDefault: false,
		},
	},
};

const GetDefaultPrefs = () => {
	let prefs = {};
	
	const categoryKeys = Object.keys(USER_PREFS);
	
	for (const catKey of categoryKeys) {
		prefs[catKey] = {};
		
		const innerKeys = Object.keys(USER_PREFS[catKey]);
		
		for (let innerKey of innerKeys) {
			if (innerKey === 'key') continue;
			prefs[catKey][innerKey] = USER_PREFS[catKey][innerKey].prefDefault;
		}
	}
	
	return prefs;
};