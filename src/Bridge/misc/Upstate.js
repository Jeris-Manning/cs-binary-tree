import {action, computed, observable} from 'mobx';
import type {UpKey} from './UpType';

const slog = `color: #41b00f`

export class Upstate<TVal> {
	isUpstate: boolean = true;
	
	ToLog = (msg) => `%c🔼 ${this.key} ${msg}`;
	
	
	@observable dataType;
	@observable key: UpKey;
	@observable initialValue: TVal;
	@observable newValue: TVal;
	@observable isRequired: boolean;
	@observable shouldPackJson;
	@observable charLimit;
	
	@observable useClutch; // overrides initialValue & injected by Updata
	@observable clutchDatKey; // overrides this.key when accessing clutch data
	// TODO: combine this with clutch (probably remove clutch coupling)
	@observable useInitialValueObj;
	@observable initialValueObjKey;
	@observable choices: TVal[]; // {key, label, ...any}
	@observable fallbackComputedObj;
	@observable fallbackComputedKey;
	
	// function overrides
	fnInitialize;
	fnRevert;
	fnChange;
	fnHasChanged;
	fnCheckError;
	fnPack;
	
	
	// collection functions (special, often won't work)
	fnAdd;
	fnRemove;
	fnRemoveKey;
	fnToggle;
	fnCycle;
	fnAddAll;
	fnClear;
	fnAddAllOrClear;
	fnSet;
	fnSetAll;
	
	fnAfterInitSetValue;
	fnAfterChange;
	fnAfterRevert;
	
	constructor(config) {this.Construct(config);}
	
	@action Construct = (config) => {
		if (config.key) this.key = config.key;
		this.dataType = config.dataType;
		this.initialValue = config.defaultValue;
		this.isRequired = config.isRequired;
		this.shouldPackJson = config.shouldPackJson;
		this.charLimit = config.charLimit || 999999999;
		
		this.useClutch = config.useClutch;
		this.clutchDatKey = config.clutchDatKey;
		this.useInitialValueObj = config.useInitialValueObj;
		this.initialValueObjKey = config.initialValueObjKey;
		this.choices = config.choices;
		this.fallbackComputedObj = config.fallbackComputedObj;
		this.fallbackComputedKey = config.fallbackComputedKey;
		
		this.fnInitialize = config.fnInitialize;
		this.fnRevert = config.fnRevert;
		this.fnChange = config.fnChange;
		this.fnHasChanged = config.fnHasChanged;
		this.fnCheckError = config.fnCheckError;
		this.fnPack = config.fnPack;
		
		this.fnAdd = config.fnAdd;
		this.fnRemove = config.fnRemove;
		this.fnRemoveKey = config.fnRemoveKey;
		this.fnToggle = config.fnToggle;
		this.fnCycle = config.fnCycle;
		this.fnAddAll = config.fnAddAll;
		this.fnClear = config.fnClear;
		this.fnAddAllOrClear = config.fnAddAllOrClear;
		this.fnSet = config.fnSet;
		this.fnSetAll = config.fnSetAll;
		
		this.fnAfterInitSetValue = config.fnAfterInitSetValue;
		this.fnAfterChange = config.fnAfterChange;
		this.fnAfterRevert = config.fnAfterRevert;
	};
	
	@action SetInitialValue = (initialValue) => {
		this.initialValue = fnOrVal(this.fnInitialize, initialValue);
		
		if (this.fnAfterInitSetValue) {
			this.newValue = this.fnAfterInitSetValue(this.initialValue);
		}
	};
	
	@action SetUseClutch = (useClutch, clutchDatKey) => {
		this.useClutch = useClutch;
		this.clutchDatKey = clutchDatKey;
	}
	
	@action SetUseInitialValueObj = (useInitialValueObj, initialValueObjKey) => {
		this.useInitialValueObj = useInitialValueObj;
		this.initialValueObjKey = initialValueObjKey;
	}
	
	@action SetFallbackComputedObj = (fallbackComputedObj, fallbackComputedKey) => {
		this.fallbackComputedObj = fallbackComputedObj;
		this.fallbackComputedKey = fallbackComputedKey;
	}
	
	@action SetKey = (key) => this.key = key;
	
	@action Revert = () => {
		this.newValue = fnTry(this.fnRevert, this.initialValue, this.newValue);
		console.log(this.ToLog(`reverted to ${this.value}`), slog, this.value);
		fnTry(this.fnAfterRevert, this.previousValue);
	};
	
	@action Change = (newValue) => {
		console.log(this.ToLog(`change: ${this.value} --> ${newValue} | `), slog, this.value, newValue);
		this.newValue = fnOrVal(this.fnChange, newValue);
		fnTry(this.fnAfterChange, this.newValue);
	};
	
	@action Apply = () => {
		if (this.hasChanged) {
			console.log(this.ToLog(`Apply: ${this.initialValue} --> ${this.newValue} | `), slog);
			this.initialValue = this.newValue;
			this.newValue = undefined;
		}
	};
	
	
	/* Computes */
	
	@computed get previousValue(): TVal {
		if (this.useClutch) {
			const val = this.useClutch.dat[this.clutchDatKey || this.key];
			if (val === undefined) return this.initialValue;
			return val;
			// console.log(this.ToLog(`useClutch previousValue = ${val}`), this.useClutch);
			// return this.useClutch.dat[this.clutchDatKey || this.key];
		}
		if (this.useInitialValueObj) {
			return this.useInitialValueObj[this.initialValueObjKey];
		}
		
		return this.initialValue;
	}
	
	@computed get value(): TVal {
		// console.log(this.ToLog(`value ${this.previousValue} vs ${this.newValue}`));
		
		if (this.newValue !== undefined) return this.newValue;
		
		let previous = this.previousValue;
		if (previous !== undefined) return previous;
		
		if (this.fallbackComputedObj) return this.fallbackComputedObj[this.fallbackComputedKey];
		
		return undefined;
	}
	
	@computed get hasChanged(): boolean {
		let current = this.value;
		// console.log(this.ToLog(`HasChanged: ${this.previousValue} vs ${current}: ${current !== this.previousValue}`), this.previousValue, current);
		
		if (current === undefined) return false;
		if (this.fnHasChanged) {
			// console.log(this.ToLog(`fnHasChanged ${this.fnHasChanged(this.previousValue, current, this)}`));
			return this.fnHasChanged(this.previousValue, current, this);
		}
		return current !== this.previousValue;
	}
	
	@computed get packed() {
		let packed = this.fnPack ? this.fnPack(this.value) : this.value;
		return this.shouldPackJson ? JSON.stringify(packed) : packed;
	}
	
	@computed get error(): string {
		const val = this.value;
		if (this.isRequired && !val) return 'Required';
		if (val && val.length && val.length > this.charLimit) return `Char Limit: ${this.charLimit}`;
		return this.fnCheckError ? this.fnCheckError(val, this) : '';
	}
	
	@computed get isValid(): boolean {
		return !this.error;
	}
	
	toString = () => JSON.stringify(this);
	
	
	
	
	@action Add = (arg1, arg2, arg3) => this.Change(this.fnAdd(this.value, arg1, arg2, arg3));
	@action Remove = (arg1, arg2, arg3) => this.Change(this.fnRemove(this.value, arg1, arg2, arg3));
	@action RemoveKey = (arg1, arg2, arg3) => this.Change(this.fnRemoveKey(this.value, arg1, arg2, arg3));
	@action AddOrRemove = (add, arg1, arg2, arg3) => (add ? this.Add : this.Remove)(arg1, arg2, arg3);
	@action Toggle = (arg1, arg2) => this.Change(this.fnToggle(this.value, arg1, arg2));
	@action Cycle = (arg1, choices) => this.Change(this.fnCycle(this.value, choices || this.choices, arg1));
	@action AddAll = (choices) => this.Change(this.fnAddAll(this.value, choices || this.choices));
	@action Clear = () => this.Change(this.fnClear(this.value));
	@action AddAllOrClear = (choices) => this.Change(this.fnAddAllOrClear(this.value, choices || this.choices));
	@action Set = (arg1, arg2, arg3) => this.Change(this.fnSet(this.value, arg1, arg2, arg3));
	@action SetAll = (arg1, arg2, arg3) => this.Change(this.fnSetAll(this.value, arg1, arg2, arg3));
	
	@action Required = (): Upstate<TVal> => {
		this.isRequired = true;
		return this;
	};
	
	@action FnPack = (fnPack): Upstate<TVal> => {
		this.fnPack = fnPack;
		return this;
	}
	
	@action FnAfterChange = (fnAfterChange): Upstate<TVal> => {
		this.fnAfterChange = fnAfterChange;
		return this;
	}
	
	@action FnAfterRevert = (fnAfterRevert): Upstate<TVal> => {
		this.fnAfterRevert = fnAfterRevert;
		return this;
	}
	
	/** true if any given Upstate has an error */
	static AnyError(...ups: Upstate) {
		return ups.some(up => up.error);
	}
	
	/** true if any given Upstate has changed */
	static AnyChange(...ups: Upstate) {
		return ups.some(up => up.hasChanged);
	}
	
	
	// TODO: readonly fields
	
}


const isFunc = (func) => typeof func === 'function';
const fnOrVal = (func, val) => isFunc(func) ? func(val) : val
const fnTry = (func, ...args) => isFunc(func) ? func(...args) : undefined;
