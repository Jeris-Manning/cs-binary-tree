import {action, observable} from 'mobx';
import {kvp} from '../misc/$j';

export class Sifter {
	
	@observable filterLup = {};
	@observable filterList: FilterState[] = [];
	onChange;
	
	constructor(filters) {
		this.Construct(filters);
	}
	
	@action Construct = (filters) => {
		for (const [key, obj] of kvp(filters)) {
			
			const filter = new FilterState(
				new FilterDef(key, obj)
			);
			
			this.filterLup[key] = filter;
			this.filterList.push(filter);
			
		}
	};
	
	@action Cycle = (filterKey) => {
		this.filterLup[filterKey].Cycle();
		if (this.onChange) this.onChange();
	}
	
	@action OnChange = (onChange) => this.onChange = onChange;
	
	
	Allowed = (datum) => this.filterList.every(f => f.Allowed(datum));
	
}

class FilterDef {
	
	key = '';
	accessor = '';
	compareTo = true;
	label = '';
	status = FILTER_STATUS.unset; // default
	icon;
	info;
	noUnset;
	noRequired;
	noBanned;
	
	Check; // (datum, def) => true/false
	
	constructor(key, filterObj) {
		this.key = key;
		this.accessor = key;
		this.label = key;
		this.Check = FilterDef.StandardCheck;
		
		Object.assign(this, filterObj); // overrides
	}
	
	static StandardCheck(datum, def) {
		return datum && datum[def.accessor] === def.compareTo;
	}
}

class FilterState {
	@observable key;
	@observable def;
	@observable status = FILTER_STATUS.unset;
	
	constructor(def, status) {
		this.Construct(def, status);
	}
	
	@action Construct = (def) => {
		this.key = def.key;
		this.def = def;
		this.status = def.status;
	};
	
	@action Cycle = () => this.status = this.GetNext()
	@action Set = (status) => this.status = status;
	@action Reset = () => this.status = this.def.status;
	
	Allowed = (datum) => {
		switch (this.status) {
			case FILTER_STATUS.unset:
				return true;
			
			case FILTER_STATUS.required:
				return this.def.Check(datum, this.def);
			
			case FILTER_STATUS.banned:
				return !this.def.Check(datum, this.def);
		}
	};
	
	GetNext = () => {
		switch (this.status) {
			case FILTER_STATUS.unset:
				return this.def.noRequired ? FILTER_STATUS.banned : FILTER_STATUS.required;
			
			case FILTER_STATUS.required:
				return this.def.noBanned ? FILTER_STATUS.unset : FILTER_STATUS.banned;
			
			case FILTER_STATUS.banned:
				return this.def.noUnset ? FILTER_STATUS.required : FILTER_STATUS.unset;
		}
	}
	
}

export const FILTER_STATUS = {
	unset: 0,
	required: 1,
	banned: -1,
};