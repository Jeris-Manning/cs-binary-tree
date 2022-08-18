import {Router, Staches} from '../../stores/RootStore';
import {action, computed, observable} from 'mobx';
import {Timer} from '../../Bridge/thyme';
import $j from '../../Bridge/misc/$j';
import {HUE} from '../../Bridge/HUE';
import {$m} from '../../Bridge/misc/$m';
import {EntablerSpec} from '../../Bridge/Entabler/EntablerSpec';
import {Cell_NavButton} from '../../Bridge/Griddle/Cells/Cell_Button';
import {MdSearch} from 'react-icons/md';
import Cell_CopyText from '../../Bridge/Griddle/Cells/Cell_CopyText';
import Cell_TextStyler from '../../Bridge/Griddle/Cells/Cell_TextStyler';
import {Cell_Email} from '../../Bridge/Griddle/Cells/Cell_Email';
import {EntablerSource} from '../../Bridge/Entabler/EntablerSource';
import Formula from '../../Bridge/Bricks/Formula/Formula';
import Fieldula from '../../Bridge/Bricks/Formula/Fieldula';
import {Clutch} from '../../Bridge/DockClient/Stache';
import {SearchDat} from '../../datum/stache/SearchDat';
import {BaseJewel} from '../BaseJewel';

const SEARCH_CHAR_MIN = 3;
const SEARCH_LIMIT = 100;
const SEARCH_DELAY = 400;

// TODO: this could be made to be completely reactive (instead of waiting for stache to fully load
export class vFinder extends BaseJewel {
	
	@observable hasLoadedOnce: boolean = false;
	
	@computed get dataMap() {
		const map = new Map();
		this.catClutches.forEach(catClutch => {
			map.set(catClutch.key, catClutch.dat.entries);
		});
		return map;
	}
	
	@observable catClutches: Clutch<SearchDat>[] = [];
	
	@computed get isLoadingSearchData() {
		return this.catClutches.some(clutch => !clutch.isSynced);
	}
	
	OnEnter = () => {
		if (this.hasLoadedOnce) return;
		this.Load().then();
	};
	
	@action Load = async (forceReload = false) => {
		console.log(`vFinder: beginning load`)
		
		const cSearch = Staches().cSearch;
		
		const companyClutch = cSearch.GetOrStub('company');
		const contactClutch = cSearch.GetOrStub('contact');
		const deafClutch = cSearch.GetOrStub('deaf');
		const staffClutch = cSearch.GetOrStub('staff');
		const terpClutch = cSearch.GetOrStub('terp');
		
		this.catClutches = [
			companyClutch,
			contactClutch,
			deafClutch,
			staffClutch,
			terpClutch,
		];
		
		this.CalculateCategories();
		
		this.hasLoadedOnce = true;
	};
	
	@observable isSearching = false;
	@observable searchString = '';
	@observable searchError = '';
	pendingSearch;
	
	@action OnSearchStringChange = (newVal) => {
		if (!newVal || newVal.length < SEARCH_CHAR_MIN) {
			this.searchString = '';
			this.source.Clear();
			this.isSearching = false;
			if (this.pendingSearch) clearTimeout(this.pendingSearch);
			// console.log(`set searchString: ''`);
			return;
		}
		
		this.isSearching = true;
		this.searchString = newVal.toLowerCase().trim();
		
		if (this.pendingSearch) clearTimeout(this.pendingSearch);
		this.pendingSearch = setTimeout(this.Recheck, SEARCH_DELAY);
		
		// console.log(`set searchString: ${this.searchString}`);
	};
	
	@action Recheck = () => {
		if (!this.searchString) {
			this.isSearching = false;
			return;
		}
		const timer = new Timer();
		let count = 0;
		this.searchError = '';
		this.source.Clear();
		
		const searchInputs = this.searchString.split(' ');
		
		for (const enabledCat of this.enabledCategories) {
			
			for (const datum of this.dataMap.get(enabledCat.key)) {
				if (count < SEARCH_LIMIT) {
					if (this.CheckInputsAgainstDatum(searchInputs, datum)) {
						this.source.Add(datum).then();
						++count;
					}
				} else {
					this.searchError = 'Please narrow your search.';
				}
			}
			
		}
		
		this.isSearching = false;
		
		timer.mark('done');
		timer.print(`Search Recheck:`);
	};
	
	CheckInputsAgainstDatum = (searchInputs, datum) => {
		if (!searchInputs || !datum) return false;
		
		if (this.showActiveOnly && !datum.active) return false;
		if (!datum.searchString) return false;
		
		// const hasString = datum.searchString.includes(input); // TODO
		
		const has = searchInputs.every(input => datum.searchString.includes(input));
		
		if (!has) return false;
		
		return true;
	};
	
	@action Reset = () => {
		this.searchString = '';
		this.form.fields.search.Clear();
		this.source.Clear();
		this.isSearching = false;
		if (this.pendingSearch) clearTimeout(this.pendingSearch);
		Object.values(this.categories).forEach(c => c.enabled = false);
		this.CalculateCategories();
	};
	
	@observable categories = $j.injectKeys({
		'terp': {
			enabled: false,
			label: 'Interpreter',
			navKey: 'terp',
			Navigate: (row) =>
				Router().Navigate('terp', {terpId: row.id}),
			GetParams: (row) => ({terpId: row.id}),
			buttonStyle: HUE.button.orange,
		},
		'deaf': {
			enabled: false,
			label: 'Deaf person',
			navKey: 'deaf',
			Navigate: (row) =>
				Router().Navigate('deaf', {deafId: row.id}),
			GetParams: (row) => ({deafId: row.id}),
			buttonStyle: HUE.button.blueLight,
		},
		'company': {
			enabled: false,
			label: 'Company',
			navKey: 'company',
			Navigate: (row) => Router().Navigate('company', {
				companyId: row.id,
				tab: 'edit'
			}),
			GetParams: (row) => ({companyId: row.id, tab: 'edit'}),
			buttonStyle: HUE.button.green,
		},
		'contact': {
			enabled: false,
			label: 'Contact',
			navKey: 'contact',
			Navigate: (row) =>
				Router().Navigate('contact', {contactId: row.id}),
			GetParams: (row) => ({contactId: row.id}),
			buttonStyle: HUE.button.blueDark,
		},
		'staff': {
			enabled: false,
			label: 'Staff',
			navKey: 'staff',
			Navigate: (row) =>
				Router().Navigate('staff', {staffId: row.id}),
			GetParams: (row) => ({staffId: row.id}),
			buttonStyle: HUE.button.red,
		},
	});
	
	@observable enabledCategories = [];
	@observable showActiveOnly = true;
	@observable logAllInput = false;
	
	@action CalculateCategories = () => {
		const cats = Object.values(this.categories).filter(c => c.enabled);
		console.log(`enabledCategories`, cats);
		this.enabledCategories = cats.length
			? cats
			: Object.values(this.categories);
	};
	
	@action ToggleCategory = (category) => {
		category.enabled = !category.enabled;
		this.CalculateCategories();
		this.Recheck();
	};
	
	@action ToggleShowActiveOnly = () => {
		this.showActiveOnly = !this.showActiveOnly;
		this.Recheck();
	};
	
	@action ToggleLogAllInput = () => {
		this.logAllInput = !this.logAllInput;
		
		if (this.logAllInput) {
			this.form.fields.search.onChange(`logging ${$m.random.Int()}`, true);
		}
	};
	
	@observable spec = new EntablerSpec({
		category: {
			label: 'Type',
			// Get: row => this.categories[row.catKey].label,
			Get: row => {
				console.log(`get category: ${row.catKey}`)
				return this.categories[row.catKey].label;
			},
			cell: Cell_NavButton,
			cellProps: row => {
				const cat = this.categories[row.catKey];
				return {
					w: 100,
					icon: MdSearch,
					label: cat.label,
					tooltip: `Go to ${cat.label} page`,
					buttProps: {
						label: cat.label,
						custom: cat.buttonStyle,
						iconHue: '#fff',
						tabi: 1,
					},
					toKey: cat.navKey,
					params: cat.GetParams(row),
				};
			}
		},
		id: {
			label: 'ID',
			cell: Cell_CopyText,
		},
		label: {
			label: 'Name',
			cell: Cell_TextStyler,
			style: {
				b: true,
				size: 18,
			},
		},
		email: {
			label: 'Email',
			cell: Cell_Email,
		},
		phone: {
			label: 'Phone',
			cell: Cell_CopyText,
		},
		// searchString: {
		// 	label: 'searchString TODO',
		// },
	});
	
	@observable source = new EntablerSource({
		label: 'Finder',
		spec: this.spec,
		keyer: (row) => `${row.catKey}_${row.key}`,
		// TODO: filters
	});
	
	@observable form = new Formula({
		fields: {
			search: new Fieldula({
				label: 'Search',
				afterChange: (v) => this.OnSearchStringChange(v),
			}),
		}
	});
}