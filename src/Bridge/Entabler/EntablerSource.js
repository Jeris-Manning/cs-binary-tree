import {action, autorun, observable, runInAction, values} from 'mobx';
import $j, {is, isFunc, vow} from '../misc/$j';
import React from 'react';
import thyme from '../thyme';
import {$m} from '../misc/$m';

export class EntablerSource {
	
	CanLoad = (row) => true; // can load element (otherwise not loaded)
	CanShow = (row) => true; // can show element (otherwise hidden)
	LoadElement = async (row) => row;
	Keyer = (row) => row.key; // can be string instead of func
	// deferRowsPerFrame = 30; // TODO
	
	@observable label;
	@observable spec;
	@observable elementLup = new Map();
	@observable columnLup = new Map();
	@observable columnList = [];
	
	constructor(config) {
		this.Construct(config);
	}
	
	@action Construct = (config) => {
		this.label = config.label || '?';
		this.CanLoad = config.CanLoad || (row => true);
		this.CanShow = config.CanShow || (row => true);
		this.LoadElement = config.Load || (row => row);
		this.Keyer = $j.makeKeyer(config.keyer || config.Keyer);
		
		this.SetSpec(config.spec);
	};
	
	@action SetSpec = (spec) => {
		if (!spec) throw new Error(`EntablerSource requires EntablerSpec`);
		
		this.spec = spec;
		
		this.columnLup.clear();
		this.columnList = [];
		
		this.spec.columnList.forEach((colDef, dex) => {
			const colState = new ColumnState(colDef, dex);
			this.columnLup.set(colDef.key, colState);
			this.columnList.push(colState);
		});
	};
	
	
	@action Clear = () => this.elementLup.clear();
	@action HasElement = (key) => this.elementLup.has(key);
	@action GetElement = (key) => this.elementLup.get(`${key}`);
	
	@action Add = async (row) => {
		if (!row) return;
		
		if (is.array(row)) {
			return vow(
				row.map(this.Add)
			);
		}
		
		row.key = `${this.Keyer(row)}`;
		
		if (!row.key) {
			console.warn(`${this.label} EntablerSource row missing key (check Keyer)`, row);
			return;
		}
		
		const element = new RowElement(row);
		this.elementLup.set(element.key, element);
		
		return this.CheckLoad(element);
	};
	
	@action Reload = (key) => {
		const element = this.GetElement(key);
		element.meta.isLoaded = false;
		return this.CheckLoad(element);
	};
	
	@action CheckLoad = async (element) => {
		if (element.meta.isLoaded) {
			this.CheckShow(element);
			return;
		}
		
		if (!this.CanLoad(element.row)) return; // don't load
		
		element.meta.isLoading = true;
		
		const loadedRow =
			await this.LoadElement(element.row);
		
		runInAction(() => {
			loadedRow.key = element.key;
			element.row = loadedRow;
			element.meta.isLoading = false;
			element.meta.isLoaded = true;
			
			this.Hydrate(element);
			this.CheckShow(element, true);
		});
	};
	
	@action CheckShow = (element, forceSet = false) => {
		if (!element.meta.isLoaded) return;
		
		const canShow = this.CanShow(element.row);
		
		if (forceSet || canShow !== element.meta.canShow) {
			element.SetCanShow(canShow);
		}
	};
	
	@action Hydrate = (element) => {
		element.Hydrate(this.columnList);
	};
	
	@action SetFnCanLoad = (fnCanLoad) => {
		this.CanLoad = fnCanLoad || (() => true);
		this.RecheckLoad();
	};
	
	@action SetFnCanShow = (fnCanShow) => {
		this.CanShow = fnCanShow || (() => true);
		this.RecheckShow();
	};
	
	@action SetFnCheckers = (fnCanLoad, fnCanShow) => {
		this.CanLoad = fnCanLoad || (() => true);
		this.CanShow = fnCanShow || (() => true);
		this.RecheckLoad();
	};
	
	@action RecheckLoad = () => this.elementLup.forEach(this.CheckLoad);
	@action RecheckShow = () => this.elementLup.forEach(this.CheckShow);
	@action Recheck = () => this.RecheckLoad();
	
	
	/* SORTING */
	
	@observable loadedElements = [];
	@observable sortedElements = [];
	@observable sortingColumns = [];
	
	runLoadedElements = autorun(() => {
		// trace();
		this.loadedElements = [...this.elementLup.values()]
			.filter(e => e.meta.isLoaded);
		
		this.ResortElements();
		
	}, {delay: 100});
	
	
	@action CalculateSorting = () => {
		this.sortingColumns = this.columnList
			.filter(c => c.sortDirection !== 0)
			.sort((a, b) => a.sortedAt - b.sortedAt)
			.reverse();
		this.ResortElements();
	};
	
	@action ResortElements = () => {
		// console.log(`ResortElements ${this.label}`);
		this.sortedElements = this.sortingColumns.length
			? this.loadedElements.slice().sort(this.Sorter)
			: this.loadedElements.slice();
	};
	
	Sorter = (elementA, elementB) => {
		for (const column of this.sortingColumns) {
			
			const sortVal = column.def.Sorter(
				elementA.hydrated[column.index].value,
				elementB.hydrated[column.index].value,
				column.sortDirection
			);
			
			if (sortVal !== 0) return sortVal;
		}
		return 0;
	};
	
	@action DoDefaultSort = (sort) => {
		if (!sort) return;
		if (is.string(sort)) this.SetSort(sort, 1);
		if (is.array(sort)) this.SetSort(sort[0], sort[1]);
	};
	
	@action SetSort = (columnKey, direction) => {
		this.columnLup.get(columnKey).SetSort(direction);
		this.CalculateSorting();
	};
	
	@action CycleSort = (columnKey) => {
		this.columnLup.get(columnKey).CycleSort();
		this.CalculateSorting();
	};
	
	@action ResetSort = () => {
		this.columnList.forEach(c => c.ResetSort());
		this.CalculateSorting();
	};
	
	
	/* COUNTS */
	
	@observable counts = {};
	
	runCounts = autorun(() => {
		// trace();
		let isLoading = 0;
		let isLoaded = 0;
		let canShow = 0;
		this.elementLup.forEach(element => {
			if (element.meta.isLoading) isLoading++;
			if (element.meta.isLoaded) isLoaded++;
			if (element.meta.canShow) canShow++;
		});
		
		this.counts = {
			isLoading: isLoading,
			isLoaded: isLoaded,
			canShow: canShow,
			full: this.elementLup.size,
		};
	}, {delay: 50});
	
	
	ToClipboard = (includeColumns = true) => {
		const header = includeColumns
			? this.spec.columnList.map(c => c.label).join('\t') + '\n'
			: '';
		
		const rows = [...this.elementLup.values()]
			.filter(e => e.meta.isLoaded && e.meta.canShow)
			.map(element => element.hydrated.map(cell => {
				console.log(`${this.label} clipboard map: `, cell, element)
				const val = isFunc(cell.column.toClipboard)
					? cell.column.toClipboard(element.row)
					: cell.value;
				
				return $j.replaceReturns(`${val}`);
			}).join('\t'))
			.join('\n');
		
		
		return header + rows;
	};
}

export class ColumnState {
	@observable key;
	@observable def;
	@observable index;
	@observable sortDirection = 0;
	@observable sortedAt = 0;
	
	constructor(def, index) {
		this.Construct(def, index);
	}
	
	@action Construct = (def, index) => {
		this.def = def;
		this.key = def.key;
		this.index = index;
	};
	
	@action CycleSort = () =>
		this.SetSort(
			this.sortDirection === 0 ? 1
				: this.sortDirection === 1 ? -1
				: 0
		);
	
	@action SetSort = (dir) => {
		this.sortedAt = (dir !== 0 && this.sortDirection === 0) ? thyme.nowMs() : 0;
		this.sortDirection = $m.signOnly(dir);
	};
	
	@action ResetSort = () => this.SetSort(0);
}

export class RowElement {
	@observable key;
	@observable meta = {
		isLoaded: false,
		isLoading: false,
		canShow: false,
		isHydrated: false,
		// deferFrames: this.deferRowsPerFrame ? Math.floor(this.addedCount / this.deferRowsPerFrame) : 0
	};
	@observable row;
	@observable hydrated; // []
	@observable className = 'entabler_row';
	
	constructor(row) {
		this.Construct(row);
	}
	
	@action Construct = (row) => {
		this.key = row.key;
		this.row = row;
	};
	
	@action Hydrate = (columnList, forceRehydrate) => {
		if (this.meta.isHydrated && !forceRehydrate) return;
		
		this.hydrated = columnList.map(column => ({
			key: `${this.key}_${column.key}`,
			element: this,
			column: column.def,
			value: column.def.GetValue(this.row),
		}));
	};
	
	@action SetCanShow = (canShow) => {
		this.meta.canShow = canShow;
		this.className = canShow ? 'entabler_row' : 'entabler_row hidden';
	};
}