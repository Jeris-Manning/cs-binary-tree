// $exy java$cript
import React from 'react';

export default class $j {
	
	/**
	 * Checks object for prop and if not found, adds default value
	 * @param obj
	 * @param key
	 * @param defaultVal
	 */
	static vouch(obj, key, defaultVal) {
		if (!obj.hasOwnProperty(key)) {
			obj[key] = typeof defaultVal === 'function' ? defaultVal() : defaultVal;
		}
	}
	
	/**
	 * Checks object for array first, then pushes value
	 * @param obj
	 * @param key
	 * @param val
	 */
	static vouchPush(obj, key, val) {
		if (obj.hasOwnProperty(key)) {
			obj[key].push(val);
		} else {
			obj[key] = [val];
		}
	}
	
	/**
	 * Converts an array to an obj[key]->array lookup
	 * @param array - array of objects, val[]
	 * @param key - val[key] becomes lookup key
	 */
	static convertToArrayLookup(array, key) {
		if (!array || !array.length) return {};
		
		let result = {};
		array.forEach(val => {
			this.vouchPush(result, val[key], val);
		});
		return result;
	}
	
	/**
	 * Converts array (rows) to object
	 * result[key] = rowToItem(row)
	 * @param array
	 * @param key
	 * @param rowToItem (default: entire row)
	 */
	static convertToLookup(array, key, rowToItem) {
		let lup = {};
		(array || []).forEach(row => {
			lup[row[key]] = (typeof rowToItem === 'function') ? rowToItem(row) : row;
		});
		return lup;
	}
	
	/**
	 * Converts array (rows) to es6 Map
	 * map.set(row[key], rowToItem(row))
	 * @param array
	 * @param key
	 * @param rowToItem
	 * @returns {Map}
	 */
	static convertToMap(array, key, rowToItem) {
		return array.reduce((map, row) => {
			map.set(row[key], isFunc(rowToItem) ? rowToItem(row) : row);
			return map;
		}, new Map());
	}
	
	/**
	 * Converts array of IDs/keys to lookup object (setting each key to 'true')
	 * @param array
	 */
	static convertToExistsLookup(array) {
		let lup = {};
		(array || []).forEach(key => lup[key] = true);
		return lup;
	}
	
	/**
	 * Converts array of strings to lookup
	 * @param array
	 */
	static convertToKeyLookup(array) {
		return array.reduce((lup, key) => {
			lup[key] = key;
			return lup;
		}, {});
	}
	
	/** Makes ES6 Map out of object array (forces key to be string) */
	static makeMap(array : {}[], keyer, addKeyToValue = true) : Map<string, any> {
		let map = new Map();
		
		for (const val of array) {
			const key = `${val[keyer]}`;
			if (addKeyToValue) val.key = key;
			map.set(key, val);
		}
		
		return map;
	}
	
	/**
	 * Converts array of strings to lookup
	 * @param original
	 * @param func (key, val) =>
	 */
	static objToObj(original, func) {
		let obj = {};
		Object.keys(original).forEach(key => obj[key] = func(key, original[key]));
		return obj;
	}
	
	
	/** Converts obj to es6 Map, and injects keys  */
	static toMap(obj) {
		let map = new Map();
		for (const [key, val] of Object.entries(obj)) {
			val.key = key;
			map.set(key, val);
		}
		return map;
	}
	
	static injectKeys(obj) {
		Object.keys(obj).forEach(key => obj[key].key = key);
		return obj;
	}
	
	/** Calls func if valid, with ...args */
	static try(func, ...args) {
		if (isFunc(func))
			func(...args);
	}
	
	/** If func, call on val, otherwise return val */
	static tryOr(func, val, ...args) {
		return isFunc(func)
			? func(val, ...args)
			: val;
	}
	
	/** calls func(..args) if it's a func, else returns func (assuming it's actually a value) */
	static callIfFunc(funcOrVal, ...args) {
		return isFunc(funcOrVal) ? funcOrVal(...args) : funcOrVal;
	}
	
	/** calls func(..args) if it's a func, else returns func (assuming it's actually a value) */
	static funcOr(funcOrVal, ...args) {
		return typeof funcOrVal === 'function'
			? funcOrVal(...args)
			: funcOrVal;
	}
	
	static make = {
		array: (length, rowMaker) => {
			let array = [];
			$j.times(length, (i) => array.push(rowMaker(i)));
			return array;
		}
	}
	
	/** str => (x) => x[str] OR func => func OR (x) => x.key */
	static makeKeyer(keyOrFunc) {
		if (is.string(keyOrFunc)) return (thing) => thing[keyOrFunc];
		if (is.func(keyOrFunc)) return keyOrFunc;
		return (thing) => thing.key;
	}
	
	/** adds kvp to new obj and returns new obj */
	static withKey(obj, key, value) {
		return {...obj, [key]: value};
	}
	
	/** removes kvp from new obj and returns new obj */
	static withoutKey(obj, key) {
		const {[key]: _, ...result} = obj;
		return result;
	}
	
	static reduce = {
		
		/**
		 * @param map
		 * @param accumulator
		 * @param func: (accumulator, value, key) => return new accumulator
		 * @returns {*}
		 */
		map: (map, accumulator, func) => {
			map.forEach((value, key) => {
				accumulator = func(accumulator, value, key);
			});
			return accumulator;
		},
		
		/**
		 * @param array
		 * @param accumulator
		 * @param func: (accumulator, value, key) => return new accumulator
		 * @returns {*}
		 */
		array: (array, accumulator, func) => {
			array.forEach((value, dex) => {
				accumulator = func(accumulator, value, dex);
			});
			return accumulator;
		},
		
		object: (obj, accumulator, func) => {
			Object.keys(obj).forEach(key => {
				accumulator = func(accumulator, obj[key], key);
			});
			return accumulator;
		},
	};
	
	static map = {
		getOrMake: (map, key, maker) => {
			if (!map.has(key)) {
				map.set(key, maker());
			}
			return map.get(key);
		},
		
		/**
		 * Returns keys that pass a predicate func
		 * @param map
		 * @param predicate = (val, key) => true | false
		 * @returns {[]}
		 */
		keysIf: (map, predicate) => {
			let keys = [];
			map.forEach((val, key) => {
				if (predicate(val, key))
					keys.push(key);
			});
			return keys;
		},
	};
	
	/**
	 * Tests every value in object or array
	 * @param obj
	 * @param predicate
	 * @returns {boolean}
	 */
	static all(obj, predicate) {
		if (Array.isArray(obj)) {
			return obj.every(predicate);
		}
		
		return Object.values(obj).every(predicate);
	}
	
	/**
	 * True if at least 1 value passes predicate in object or array
	 * @param obj
	 * @param predicate
	 * @returns {boolean}
	 */
	static any(obj, predicate) {
		if (Array.isArray(obj)) {
			return obj.some(predicate);
		}
		
		return Object.values(obj).some(predicate);
	}
	
	/**
	 * if object: func(key, value)
	 * if int: target * func(index)
	 * if array: func(element, index)
	 * @param target
	 * @param func
	 */
	static each(target, func) {
		if (Array.isArray(target)) {
			target.forEach(func);
		} else if (Number.isInteger(target)) {
			for (let dex = 0; dex < target; dex++) {
				func(dex);
			}
		} else {
			Object.keys(target).forEach(k => func(k, target[k]));
		}
	}
	
	static eachKey(obj, keyFunc) {
		if (Array.isArray(obj)) {
			throw new Error('$j.eachKey called on array, expecting object.');
		} else {
			Object.keys(obj).forEach(keyFunc);
		}
	}
	
	static eachVal(obj, valFunc) {
		if (Array.isArray(obj)) {
			throw new Error('$j.eachVal called on array, expecting object.');
		} else {
			Object.values(obj).forEach(valFunc);
		}
	}
	
	static eachKvp(obj, kvpFunc) {
		return Object.keys(obj).forEach(k => kvpFunc(k, obj[k]));
	}
	
	static distinct(array) {
		return [...new Set(array)];
	}
	
	/**
	 * Adds val to each key of obj
	 * @param val
	 * @param on
	 * @param withKeys['']
	 */
	static stub(val, on, withKeys) {
		withKeys.forEach(key => on[key] = val);
	}
	
	static times(count, func) {
		for (let i = 0; i < count; i++) {
			func(i);
		}
	}
	
	static stringMultiply(str, count) {
		let result = '';
		this.times(count, () => result += str);
		return result;
	}
	
	// static roughSizeOfObject(obj) {
	// 	let objectList = [];
	// 	let stack = [obj];
	// 	let bytes = 0;
	//
	// 	while (stack.length) {
	// 		let value = stack.pop();
	//
	// 		if (typeof value === 'boolean') {
	// 			bytes += 4;
	// 		} else if (typeof value === 'string') {
	// 			bytes += value.length * 2;
	// 		} else if (typeof value === 'number') {
	// 			bytes += 8;
	// 		} else if (
	// 			typeof value === 'object'
	// 			&& objectList.indexOf(value) === -1
	// 		) {
	// 			objectList.push(value);
	//
	// 			for (let i in value) {
	// 				stack.push(value[i]);
	// 			}
	// 		}
	// 	}
	//
	// 	return bytes;
	// }
	
	/**
	 * Truncates if greater than num
	 * @param str
	 * @param num
	 * @param addIfTrunc
	 * @returns {string|*}
	 */
	static trunc(str, num, addIfTrunc = '...') {
		if (!str) return '';
		if (!num) return str;
		
		if (str.length > num) {
			return `${str.substring(0, num)}${addIfTrunc}`;
		}
		return str;
	}
	
	/**
	 * Pads or truncates
	 * ('hey', 4) => ' hey'
	 * ('hey', 2) => 'he'
	 */
	static truncPadStart(str, num, padWith = ' ') {
		return (str || '')
			.substring(0, num)
			.padStart(num, padWith);
	}
	
	static truncPadEnd(str, num, padWith = ' ') {
		return (str || '')
			.substring(0, num)
			.padEnd(num, padWith);
	}
	
	static stringInsert(str, index, insert) {
		if (!str) return '';
		return `${str.slice(0, index)}${insert}${str.slice(index)}`;
	}
	
	static replaceReturns(str, withStr = ' ') {
		if (!str || !is.string(str)) return;
		return str.replace(/\r?\n|\r/g, withStr);
	}
	
	/* truly WTF, calling replace on null silently fails? */
	// static replaceReturns(str, withStr = ' ') {
	// 	console.log(`$j.replaceReturns(${str})`);
	//
	// 	console.log(`$j.replaceReturns: `, str);
	// 	console.log(`$j.replaceReturns: ${typeof str}`);
	// 	console.log(`$j.replaceReturns: ${str.constructor.name}`);
	// 	const asdf = str.replace('123', withStr);
	// 	console.log(`$j.replaceReturns: ${asdf}`, asdf);
	//
	// 	const replaced = str.replace(/\r?\n|\r/g, withStr);
	// 	console.log(`$j.replaceReturns(${str}), result: ${replaced}`);
	// 	return replaced;
	// }
	
	static lower(string) {
		return (string || '').toLowerCase();
	}
	
	/**
	 * (1, 'Job') => `Job`
	 * (3, 'Job') => `Jobs`
	 * @param num
	 * @param string
	 * @param suffix ('s' default)
	 * @returns {string|*}
	 */
	static plural(num, string, suffix = 's') {
		return num === 1 ? string : string + suffix;
	}
	
	/** make string singular or plural (or return 'or' if num is 0/invalid) */
	static pluralOr(num, string, or = '', suffix = 's') {
		if (!num) return or;
		return num === 1 ? string : string + suffix;
	}
	
	
	/**
	 * (1, 'Job') => `1 Job`
	 * (3, 'Job') => `3 Jobs`
	 * @param num
	 * @param string
	 * @param suffix ('s' default)
	 * @returns {string|*}
	 */
	static pluralCount(num, string, suffix = 's') {
		return `${num} ${num === 1 ? string : string + suffix}`;
	}
	
	static nextEnum(current: T, allEnums: T[]): T {
		if (!allEnums || !allEnums.length) return null;
		if (!current) return allEnums[0];
		
		const nextDex =
			allEnums.indexOf(current)
			+ 1;
		
		if (nextDex >= allEnums.length) return allEnums[0];
		return allEnums[nextDex];
	}
	
	static nextEnumWithKey(current: T, allEnums: T[]): T {
		if (!allEnums || !allEnums.length) return null;
		if (!current) return allEnums[0];
		
		const nextDex =
			allEnums.findIndex(v => v.key === current.key)
			+ 1;
		
		if (nextDex >= allEnums.length) return allEnums[0];
		return allEnums[nextDex];
	}
	
	static filter(obj, predicate) {
		if (!obj) return {};
		if (Array.isArray(obj)) return obj.filter(predicate);
		let result = {};
		
		Object.keys(obj).forEach(key => {
			if (obj.hasOwnProperty(key) && predicate(obj[key])) {
				result[key] = obj[key];
			}
		});
		
		return result;
	}
	
	// static log(obj1, obj2) {
	// 	if (obj2 === undefined) {
	// 		console.log(obj1);
	// 		return obj1;
	// 	}
	//
	// 	if (is.string(obj1)) {
	// 		if (is.string(obj2)) console.log(`${obj1}: ${obj2}`);
	// 		else console.log(obj1, obj2);
	// 	} else {
	// 		console.log(obj1, obj2);
	// 	}
	//
	// 	return obj2;
	// }
	
	static logKeyCount(obj, label) {
		console.log(`${label} ${Object.keys(obj).length}`);
	}
	
	static emailRegEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	
	static validateEmail(email) {
		return this.emailRegEx.test(email.toLowerCase());
	}
	
	static getOr(obj, key, or) {
		if (obj.hasOwnProperty(key)) return obj[key];
		return or;
	}
	
	static has(obj, key) {
		return obj && obj.hasOwnProperty(key);
	}
	
	static hasAny(obj, ...args) {
		return obj && args.some(key => obj.hasOwnProperty(key));
	}
	
	static hasAll(obj, ...args) {
		return obj && args.every(key => obj.hasOwnProperty(key));
	}
	
	static stringHas(search, has) {
		if (!search) return false;
		return search.toLowerCase().indexOf(has.toLowerCase()) >= 0;
	}
	
	static forceString(shouldBeString) {
		return typeof shouldBeString === 'string'
			? shouldBeString
			: JSON.stringify(shouldBeString);
	}
	
	static generateSearchString(...args) {
		return args.join(' ').toLowerCase();
	}
	
	/** assumes searchToString is already formatted appropriately
	 */
	static findInSearchString(input: string, stringToSearch: string): boolean {
		if (!input || !stringToSearch) return 0;
		const inputs = input.toLowerCase().split(' ');
		return inputs.every(i => stringToSearch.includes(i));
	}
	
	/**
	 * For css styling
	 * if !val: return or (default: 'unset')
	 * if int: return val + 'px'
	 * else return val
	 * @param val
	 * @param or
	 * @returns {string|*}
	 */
	static withPx(val, or = 'unset') {
		if (!val) return or;
		if (is.integer(val)) return val + 'px';
		return val;
	}
	
	static withFr(val, or = 'auto') {
		if (!val) return or;
		if (is.number(val)) return val + 'fr';
		return val;
	}
	
	static format = {
		phone: (str) => {
			return (!str || str.length !== 10)
				? `${str}`
				: `${str.slice(0, 3)}-${str.slice(3, 6)}-${str.slice(6, 10)}`;
		}
	};
	
	static extract = {
		emails: (str) => {
			if (!str) return [];
			return str.match(/([a-zA-Z0-9._+-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi);
		},
		
		uniqueKeys: (array, key) => {
			let keys = {};
			array.forEach(v => v[key] = true);
			return Object.keys(keys);
		},
		
		/** Extracts numbers (including decimals) from a string
		 * Works with any delimiter (except numbers and .)
		 * */
		numbers: (str) => {
			if (!str) return [];
			return `${str}`.match(/[0-9.]+/g).map(n => Number(n));
		},
	};
	
	static cast = {
		number: (str, or = 0) => Number(str) || or,
	};
	
	static sort = {
		
		default: (key) => {
			return (a, b) => {
				const _a = a[key];
				const _b = b[key];
				if (_a < _b) return -1;
				if (_a > _b) return +1;
				return 0;
			};
		},
		
		/**
		 * Alphabetic sorter with optional key
		 * @param key (optional)
		 * @param ignoreCase (default: true)
		 * @returns {Function}
		 */
		alphabetic: (key) => {
			return (a, b) => {
				const _a = ((key ? a[key] : a) || '').toLowerCase();
				const _b = ((key ? b[key] : b) || '').toLowerCase();
				if (_a < _b) return -1;
				if (_a > _b) return +1;
				return 0;
			};
		},
		
		distance: (key, valIfNull = 9999999) => {
			return (a, b) => {
				const _a = a[key] || valIfNull;
				const _b = b[key] || valIfNull;
				if (_a < _b) return -1;
				if (_a > _b) return +1;
				return 0;
			};
		},
	};
	
	/**
	 * inserts element at index (mutates)
	 */
	static insertInArray(array, index, element) {
		array.splice(index, 0, element);
	}
	
	/**
	 * Returns new map with element at index
	 */
	static insertInMap(map, index, insertKey, insertValue) {
		let result = new Map();
		let dex = 0;
		
		map.forEach((existingValue, existingKey) => {
			if (dex === index) result.set(insertKey, insertValue);
			result.set(existingKey, existingValue);
			dex++;
		});
		
		if (dex <= index) result.set(insertKey, insertValue);
		
		return result;
	}
	
	/**
	 * Splits a promise into [value, error]
	 * Usage:
	 *      const [result, error] = await split(
	 *          promiseFuncHere()
	 *      );
	 * @param promise
	 * @returns {[value, error]}
	 */
	static split(promise) {
		if (!promise) throw new Error(`cannot split null`);
		if (typeof promise.then !== 'function') return ([promise, null]);
		return promise.then(
			value => ([value, null]),
			error => ([null, error])
		);
	}
	
	
	static last(array) {
		if (!array || !array.length) return null;
		return array[array.length - 1];
	}
	
	static delay(ms) {
		return new Promise(resolve => setTimeout(resolve, ms));
	}
	
	static frame() {
		return this.delay(0);
	}
	
	static compare = {
		array: (arrayA, arrayB, key) => {
			if (!arrayA && !arrayB) return true;
			if (!arrayA && arrayB) return false;
			if (arrayA && !arrayB) return false;
			if (arrayA.length !== arrayB.length) return false;
			
			return key
				? arrayA.every((valueA, dex) => valueA[key] === arrayB[dex][key])
				: arrayA.every((valueA, dex) => valueA === arrayB[dex]);
		},
		
		inner: (objA, objB, key) => {
			if (!objA && !objB) return true;
			if (!objA && objB) return false;
			if (objA && !objB) return false;
			return objA[key] === objB[key];
		},
		
		/** Generates a compare function */
		with: {
			array: (key) => (a, b) => $j.compare.array(a, b, key),
			inner: (key) => (a, b) => $j.compare.inner(a, b, key),
		}
	};
	
	static hasChanged = {
		
		key: (a, b) => {
			if (!a && b) return true;
			if (a && !b) return true;
			return String(a) !== String(b);
		},
		
		number: (a, b) => {
			const aIsNil = is.nil(a);
			const bIsNil = is.nil(b);
			if (aIsNil !== bIsNil) return true;
			if (aIsNil && bIsNil) return false;
			return Number(a) !== Number(b);
		},
		
		valueArray: (arrayA, arrayB) => {
			if (!arrayA && arrayB) return true;
			if (arrayA && !arrayB) return true;
			if (arrayA.length !== arrayB.length) return true;
			
			return !arrayA.every((valueA, dex) => valueA === arrayB[dex]);
		},
		
		arrayContents: (arrayA, arrayB) => {
			if (!arrayA && arrayB) return true;
			if (arrayA && !arrayB) return true;
			if (arrayA.length !== arrayB.length) return true;
			
			for (let el of arrayA) {
				if (!arrayB.includes(el)) return true;
			}
			return false;
		},
		
		// es6 Map, check has keys only
		mapKeys: (mapA, mapB) => {
			if (!mapA && mapB) return true;
			if (mapA && !mapB) return true;
			if (mapA.size !== mapB.size) return true;
			
			for (const [key, val] of mapA) {
				if (!mapB.has(key)) return true;
			}
			return false;
		},
		
		objectDepth1: (objA, objB) => {
			const aValid = is.object(objA);
			const bValid = is.object(objB);
			if (!aValid && !bValid) return false;
			if (!aValid && bValid) return true;
			if (aValid && !bValid) return true;
			
			const aKeys = Object.keys(objA);
			const bKeys = Object.keys(objB);
			
			if (aKeys.length !== bKeys.length) return true;
			for (const key of aKeys) {
				if (!objB.hasOwnProperty(key)) return true;
				if (objA[key] !== objB[key]) return true;
			}
			
			return false;
			
			// TODO: this might be weird with undefined values?
		},
		
		inner: (objA, objB, key) => {
			if (!objA && !objB) return false;
			if (!objA && objB) return true;
			if (objA && !objB) return true;
			return objA[key] !== objB[key];
		},
		
		with: {
			inner: (key) => (a, b) => $j.hasChanged.inner(a, b, key),
		}
	};
	
	static changes = {
		
		obj: (oldObj, newObj) => {
			if (!is.object(oldObj)) return is.object(newObj) ? newObj : {};
			if (!is.object(newObj)) return {};
			
			let changes = {};
			
			for (const newKey of Object.keys(newObj)) {
				if (oldObj[newKey] === newObj[newKey]) continue;
				changes[newKey] = newObj[newKey];
			}
			
			return changes;
		}
	};
	
	static length(array) {
		if (!array || !Array.isArray(array)) return 0;
		return array.length;
	}
	
	
	
	/** css style helper */
	static prop(key, or = 'unset', pxIfNum = true) {
		return (p) => {
			const val = p.hasOwnProperty(key) ? p[key] : or;
			
			if (!pxIfNum) return val;
			if (!Number.isInteger(val)) return val;
			return val + 'px';
		};
	}
	
	
	/** filters and maps array (but iterates once) */
	static mapIf(array, predicate, mapper) {
		const result = [];
		let dex = 0;
		for (const val of array) {
			++dex;
			if (!predicate(val, dex)) continue;
			result.push(mapper(val, dex));
		}
		return result;
	}
	
	/** predicate: (value, key) => boolean */
	static getKeysFromMapIf(es6Map, predicate) {
		let result = [];
		for (let [key, val] of es6Map) {
			if (!predicate(val, key)) continue;
			result.push(key);
		}
		return result;
	}
	
	/** array of objects (must have key) to obj lookup */
	static arrayToLup(objArray, stringify = true) {
		let lup = {};
		for (let obj of objArray) {
			lup[stringify ? String(obj.key) : obj.key] = obj;
		}
		return lup;
	}
	
	/** key array to obj array using lookup */
	static mapFromLup(keyArray, lup, stringify = true) {
		return keyArray.map(key => lup[stringify ? String(key) : key]);
	}
	
	static mapToHasLup(keyArray, stringify = true) {
		let lup = {};
		for (let key of keyArray) {
			lup[stringify ? String(key) : key] = true;
		}
		return lup;
	}
	
	
	
	static findHashTags(str) {
		if (!str) return [];
		const matches = str.match(/#[a-zA-Z0-9_]+/g);
		if (!matches) return [];
		return matches.map(h => h.substring(1));
	}
}

export function isFunc(thing) {
	return typeof thing === 'function';
}

export const is = {
	func: (x) => typeof x === 'function',
	
	/**
	 * Returns TRUE if is object and !== null
	 * @param x
	 * @returns {boolean|boolean}
	 */
	object: (x) => typeof x === 'object' && x !== null,
	string: (x) => typeof x === 'string',
	array: (x) => Array.isArray(x),
	boolean: (x) => typeof x === 'boolean',
	integer: (x) => Number.isInteger(x),
	number: (x) => !Number.isNaN(x), // hmm don't use this?
	color: (x) => typeof x === 'string' && x.length && /^#([0-9A-F]{3}){1,2}$/i.test(x),
	
	/** true if null || undefined */
	nil: (x) => x === null || x === undefined,
	// TODO
};

/**
 * Splits a promise into [value, error]
 * OR a promise[] into [[...values], error] using Promise.all
 * ```
 *      const [result, error] = await vow(
 *          promiseFuncHere()
 *      );
 *      OR
 *      const [[resultA, resultB], error] = await vow([
 *          promiseA,
 *          promiseB,
 *      ]);
 * ```
 * @param promise or promise[]
 * @param invalidArgument
 * @returns {Promise<[result, error] | [results[], error]>}
 */
export function vow(promise, invalidArgument) {
	if (!promise) return [null, null];
	
	if (invalidArgument) throw new Error(`VOW: Use array argument for multiple promises`);
	
	if (Array.isArray(promise)) {
		return Promise.all(promise).then(
			values => ([values, null]),
			error => ([[], error])
		);
	}
	
	return promise.then(
		value => ([value, null]),
		error => ([null, error])
	);
}

// export async function vowLoader(promiseObj, setLoading) {
// 	let all = {};
//
// 	const promises = Object.keys(promiseObj).map(async (key) => {
//
// 	});
//
// 	const result = await Promise.all(promises);
//
// 	return Promise.all(async (entry) => {
// 		const [label, prom] = entry;
// 		setLoading(label, true);
// 		const result = await prom;
// 		setLoading(label, false);
// 		return result;
// 	}).then(
// 		values => ([values, null]),
// 		error => ([[], error])
// 	);
// }

export const MARK = {
	
	render: (thing, extra = '', obj = '') => {
		console.log(`📝🎥 render ${thing.constructor.name} ${extra}`, obj);
	},
	
	constructor: (thing, extra = '', obj = '') => {
		console.log(`📝🏗 constructor ${thing.constructor.name} ${extra}`, obj);
	},
	
	computed: (thing, extra = '', obj = '') => {
		console.log(`📝💻 computed ${thing.constructor.name} ${extra}`, obj);
	},
	
	autorun: (thing, extra = '', obj = '') => {
		console.log(`📝🏃‍♀️ autorun ${thing.constructor.name} ${extra}`, obj);
	},
	
	componentDidMount: (thing, extra = '', obj = '') => {
		console.log(`📝🏗 componentDidMount ${thing.constructor.name} ${extra}`, obj);
	},
};

/**
 * test test
 * @type {{distanceMiles: (function(*, *=, *=): number)}}
 */
// export const geo = {
// 	/**
// 	 *
// 	 * @param gMaps: window.google.maps
// 	 * @param latLng1: {lat: 00, lng: 00}
// 	 * @param latLng2: {lat: 00, lng: 00}
// 	 */
// 	distanceMiles: (gMaps, latLng1, latLng2) => {
// 		const meters = gMaps.geometry.spherical.computeDistanceBetween(
// 			new gMaps.LatLng(latLng1.lat, latLng1.lng),
// 			new gMaps.LatLng(latLng2.lat, latLng2.lng),
// 		);
//
// 		return meters * 0.00062137;
// 	},
//
// 	latLng: (lat, lng) => {
// 		return {lat: lat, lng: lng};
// 	},
//
// 	/**
// 	 * returns {lat: obj.lat, lng: obj.lng}
// 	 * @param obj
// 	 * @returns {{lng: *, lat: *}}
// 	 */
// 	from: (obj) => {
// 		return {lat: obj.lat, lng: obj.lng};
// 	}
// };


export const Frag = (props) => <>{props.children}</>;


export class Fluid {
	
	data;
	keyer;
	source;
	type;
	array;
	obj;
	isArray = false;
	isObject = false;
	
	constructor(data, keyer, source) {
		this.data = data;
		this.keyer = keyer;
		this.source = source;
		
		if (Array.isArray(this.data)) {
			this.type = 'array';
			this.isArray = true;
		} else if (typeof data === 'object' && data !== null) {
			this.type = 'object';
			this.isObject = true;
		} else {
			throw new Error(`Fluid doesn't support type ${this.type}`);
		}
	}
	
	keys = (keyer) => {
		if (this.isObject) {
			return new Fluid(Object.keys(this.data), '', this.data);
		}
		
		const key = keyer || this.keyer;
		
		if (!key) throw new Error(`Fluid cannot get keys from array without keyer`);
		
		if (this.isArray) return this.data.map(
		
		);
		
		
		// TODO
	};
	
	toExists = () => {
		let lup = {};
		
		return lup;
	};
	
	revert = () => this.source;
	
	test = {
		
		func: (x) => typeof x === 'function',
		
		/**
		 * Returns TRUE if is object and !== null
		 * @param x
		 * @returns {boolean|boolean}
		 */
		object: (x) => typeof x === 'object' && x !== null,
		string: (x) => typeof x === 'string',
		array: (x) => Array.isArray(x),
		boolean: (x) => typeof x === 'boolean',
		integer: (x) => Number.isInteger(x),
	};
}

export function $f(thing) {

}

export function kvp(objOrArray) {
	if (!objOrArray) return [];
	if (Array.isArray(objOrArray)) return objOrArray.map((v, i) => [i, v]);
	return Object.entries(objOrArray);
}