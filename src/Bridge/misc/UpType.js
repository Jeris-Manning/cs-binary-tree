import type {ThymeDt} from '../thyme';
import thyme from '../thyme';
import $j, {is} from './$j';
import {toJS} from 'mobx';
import nanoid from 'nanoid';
import {Upstate} from './Upstate';
import {IconType} from 'react-icons';


export type UpKey = string;
export type IdKey = string;

export class UpType {
	
	static String(config = {}): Upstate<string> {
		return new Upstate({
			dataType: 'String',
			// defaultValue: '',
			...config
		});
	}
	
	static Int(defaultValue = 0, config = {}): Upstate<number> {
		return new Upstate({
			dataType: 'Int',
			defaultValue: defaultValue,
			...config
		});
	}
	
	static Float(config = {}) {
		return new Upstate({
			dataType: 'Float',
			defaultValue: 0,
			fnHasChanged: $j.hasChanged.number,
			...config
		});
	}
	
	static Bool(defaultValue = false, config = {}): Upstate<boolean> {
		return new Upstate({
			dataType: 'Bool',
			defaultValue: defaultValue,
			fnInitialize: v => !!v,
			fnToggle: (current) => !current,
			fnCycle: (current) => !current,
			...config
		});
	}
	
	static Thyme(config = {}): Upstate<ThymeDt> {
		return new Upstate({
			dataType: 'Thyme',
			// defaultValue: thyme.epoch,
			fnHasChanged: thyme.hasChanged,
			...config,
		});
	}
	
	static Array(defaultValue = [], config = {}) {
		return new Upstate({
			dataType: 'Array',
			defaultValue: defaultValue,
			fnHasChanged: $j.hasChanged.valueArray,
			fnPack: v => toJS(v),
			fnInitialize: (val) => val || [],
			fnAdd: (current, toAdd) => [...current, toAdd],
			fnRemove: (current, toRemove) => current.filter(v => v !== toRemove),
			fnRemoveKey: (current, key) => current.filter(v => v.key !== key),
			fnSet: (current, dex, val) => {
				const newArray = [...current];
				newArray[dex] = val;
				return newArray;
			},
			...config
		});
	}
	
	static Obj(config = {}) {
		return new Upstate({
			dataType: 'Obj',
			defaultValue: {},
			fnHasChanged: $j.hasChanged.objectDepth1,
			fnAdd: (current, key, val) => ({...current, [key]: val}),
			fnRemove: (current, key) => ({...current, [key]: undefined}),
			...config
		});
	}
	
	static IdKey(config = {}): Upstate<IdKey> {
		return new Upstate({
			dataType: 'IdKey',
			defaultValue: '',
			fnInitialize: v => String(v),
			fnHasChanged: $j.hasChanged.key,
			fnChange: (v) => v ? String(v) : v,
			...config
		});
	}
	
	static Enum(choices: EnumChoice[] = [], defaultIndex = undefined, config = {}): Upstate<EnumChoice> {
		return new Upstate({
			dataType: 'Enum',
			choices: choices,
			defaultValue: defaultIndex !== undefined ? choices[defaultIndex] : null,
			fnInitialize: (v: EnumChoice|IdKey) => {
				if (v === null) return defaultIndex !== undefined ? choices[defaultIndex] : null;
				if (choices.includes(v)) return v;
				return choices.find(
					v !== undefined && v.key
						? c => c.key === String(v.key) // choice
						: c => c.key === String(v) // key
				)
			},
			// initialValueGetter: up => up.choice
			fnPack: val => {
				if (is.nil(val)) return null;
				return val.key || val;
			},
			fnCycle: (current: EnumChoice, choicesOverride: EnumChoice[]) =>
				$j.nextEnumWithKey(current, choicesOverride || choices),
			fnHasChanged: (a, b, upstate) => {
				if (Number.isInteger(a) || Number.isInteger(b)) {
					// console.log(`${upstate.key} Enum hasChanged NUMBER: '${a}' '${b}'`, a, b);
					return $j.hasChanged.number(a, b);
				}
				// console.log(`${upstate.key} Enum hasChanged: '${a}' '${b}'`, a, b);
				if (!a && b) return true;
				if (a && !b) return true;
				if (!a && !b) return false;
				if (a.key) {
					return a.key !== b.key;
				}
				return String(a) !== String(b);
			},
			...config
		});
	}
	
	static EnumArray(choices: EnumChoice[] = [], config = {}): Upstate<EnumChoice[]> {
		return new Upstate({
			dataType: 'EnumArray',
			choices: choices,
			defaultValue: [],
			fnInitialize: arr => {
				if (!choices || !choices.length) return arr;
				return (arr || []).map(
					val => choices.find(
						val && val.key
							? choice => choice.key === String(val.key)
							: choice => choice.key === String(val)
					));
			},
			fnPack: FnPackKeys, //arr => (arr || []).map(v => v.key),
			fnHasChanged: $j.hasChanged.valueArray,
			fnAdd: (current, toAdd) => [...current, toAdd],
			fnRemove: (current, toRemove) => current.filter(v => v !== toRemove),
			fnAddAll: (current, choices) => [...choices],
			fnClear: (current) => [],
			fnAddAllOrClear: (current: EnumChoice[], choices: EnumChoice[]) => {
				return current.length >= choices.length
					? []
					: [...choices];
			},
			...config
		});
	}
	
	/// skips hasChanged content check
	/// | note: choices must be constant to work correctly
	static EnumMap(choices: EnumChoice[] = [], config = {}): Upstate<EnumMapHolder> {
		return new Upstate({
			dataType: 'EnumMap',
			choices: choices,
			defaultValue: {
				token: 0,
				map: new Map(),
			},
			// fnInitialize: val => {
			// 	// TODO
			// },
			// fnPack: val => {
			// 	// TODO
			// },
			fnHasChanged: $j.hasChanged.with.inner('token'),
			fnAdd: (current: EnumMapHolder, toAdd: EnumChoice) => {
				current.map.set(toAdd.key, toAdd);
				return {
					token: nanoid(12),
					map: current.map,
				};
			},
			fnRemove: (current: EnumMapHolder, toRemove: EnumChoice) => {
				current.map.delete(toRemove.key);
				return {
					token: nanoid(12),
					map: current.map,
				};
			},
			fnAddAll: (current: EnumMapHolder, choices: EnumChoice[]) => {
				for (let choice of choices) {
					current.map.set(choice.key, choice);
				}
				return {
					token: nanoid(12),
					map: current.map,
				};
			},
			fnCycle: (current: EnumMapHolder, choices: EnumChoice[], toCycle: EnumChoice) => {
				console.log(`cycle ${toCycle.key} (count: ${current.map.size})`);
				if (current.map.has(toCycle.key)) {
					current.map.delete(toCycle.key);
				} else {
					current.map.set(toCycle.key, toCycle);
				}
				return {
					token: nanoid(12),
					map: current.map,
				};
			},
			fnClear: (current: EnumMapHolder) => {
				current.map.clear();
				return {
					token: nanoid(12),
					map: current.map,
				};
			},
			fnAddAllOrClear: (current: EnumMapHolder, choices: EnumChoice[]) => {
				const count = current.map.size;
				if (count >= choices.length) {
					console.log(`clear ${count}`);
					current.map.clear();
				} else {
					console.log(`ADD all ${choices.length}`);
					for (let choice of choices) {
						current.map.set(choice.key, choice);
					}
				}
				return {
					token: nanoid(12),
					map: current.map,
				};
			},
			// getInner: (current, key) => current.map.get(key),
		});
	}
	
	static Filter(defaultFilterSet: FilterSet, config = {}): Upstate<FilterSet> {
		return new Upstate({
			dataType: 'Filter',
			defaultValue: defaultFilterSet || {req: [], ban: []},
			fnHasChanged: (a, b) => (
				$j.hasChanged.arrayContents(a.req, b.req)
				|| $j.hasChanged.arrayContents(a.ban, b.ban)
			),
			fnCycle: (current, choices: EnumChoice[], keyToCycle) => {
				if (current.req.includes(keyToCycle)) {
					return { // required --> banned
						req: current.req.filter(k => k !== keyToCycle),
						ban: [...current.ban, keyToCycle],
					};
				}
				if (current.ban.includes(keyToCycle)) {
					return { // banned --> unset
						req: current.req,
						ban: current.ban.filter(k => k !== keyToCycle),
					};
				}
				
				return { // unset --> required
					req: [...current.req, keyToCycle],
					ban: current.ban,
				};
			},
			
			...config
		});
	}
	
	static FilterSingle(defaultFilterValue: FilterStatus, config = {}): Upstate<FilterStatus> {
		return new Upstate({
			dataType: 'FilterSingle',
			defaultValue: defaultFilterValue || 'unset',
			fnCycle: (current) => FilterCycleStatus[current] || 'required',
			...config
		});
	}
	
	/** Holds data array (or custom object) but diffs based on temporary Token */
	static Exotic(config = {}) {
		return new Upstate({
			dataType: 'Exotic',
			defaultValue: {
				token: 0,
				data: [],
			},
			fnInitialize: v => ({
				token: 0,
				data: v || [],
			}),
			fnChange: v => ({
				token: nanoid(12),
				data: v || [],
			}),
			fnHasChanged: $j.hasChanged.with.inner('token'),
			fnPack: v => toJS(v.data),
			...config,
		});
	}
	
	static ExoticJson(config = {}) {
		return this.Exotic({
			shouldPackJson: true,
			...config
		});
	}
	
	static BoolMapSimple(config = {}): Upstate<BoolMap> {
		return new Upstate({
			dataType: 'BoolMapSimple',
			defaultValue: new Map(),
			fnAfterInitSetValue: (initial: BoolMap) => new Map(initial),
			fnRevert: (initial: BoolMap) => new Map(initial),
			fnHasChanged: (prev, current: BoolMap) => current.size > 0,
			fnSet: (current: BoolMap, key, setTo) => {
				if (setTo) current.set(key, true);
				else current.delete(key);
				return current;
			},
			fnSetAll: (current: BoolMap, keys, setTo) => {
				if (setTo) keys.forEach(k => current.set(k, true));
				else keys.forEach(k => current.delete(k));
				return current;
			},
			fnToggle: (current: BoolMap, key) => {
				const setTo = !current.has(key);
				if (setTo) current.set(key, true);
				else current.delete(key);
				return current;
			},
			fnClear: (current: BoolMap) => current.clear() || current,
			...config
		});
	}
}

export const FnPackKeys = (vals = []) => vals.map(v => v.key);

export type StringKey = string;

export type EnumChoice = { key: IdKey, label: string, ...any };
export type EnumChoiceMap = Map<IdKey, EnumChoice>;
export type EnumMapHolder = { token: string, map: EnumChoiceMap }

export type FilterKey = string | number;
export type FilterSet = { req: FilterKey[], ban: FilterKey[] };
export type FilterStatus = 'unset' | 'required' | 'banned';
export type FilterIndex = number; // 0, 1, 2
export type FilterEntry = {
	key: FilterKey,
	label: string,
	defaultStatus: FilterStatus,
	icon?: IconType,
	tip?: string,
	description?: string,
	iconColors?: [string, string, string], // [unset, required, banned]
	labelColors?: [string, string, string], // [unset, required, banned]
}

export type BoolMap = Map<StringKey, boolean>;


export const FilterIndexToStatus = {
	0: 'unset',
	1: 'required',
	2: 'banned',
};

export const FilterStatusToIndex = {
	'unset': 0,
	'required': 1,
	'banned': 2,
};

export const FilterCycleIndex = {
	0: 1,
	1: 2,
	2: 0,
};

export const FilterCycleStatus = {
	'unset': 'required',
	'required': 'banned',
	'banned': 'unset',
};