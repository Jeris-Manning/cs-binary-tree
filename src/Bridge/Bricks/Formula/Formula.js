import {action, computed, observable} from 'mobx';


export default class Formula {
	
	@observable fields;
	@observable hasChanged = false;
	@observable disabled = false;
	importer;
	afterChange;
	
	constructor(options) {
		this.fields = options.fields;
		this.disabled = options.disabled;
		this.afterChange = options.afterChange;
		this.importer = options.importer;
		this.InitializeFields(options);
	}
	
	@action InitializeFields = (options) => {
		Object.keys(this.fields).forEach((fieldKey) => {
			const field = this.fields[fieldKey];
			field.id = options.idPrefix ? `${options.idPrefix}_${fieldKey}` : fieldKey;
			field.formAfterChange = this.FormAfterChange;
			field.form = this;
			if (this.disabled) field.disabled = true;
			// TODO
		});
	};
	
	
	@action SetRequiredSomething = () => {
		// something something
		// when tried submit, sets fields to show required
	};
	
	
	@action Import = (importObj, skipNullVals = false) => {
		if (!importObj) return; // use Clear() instead
		
		const obj = (typeof this.importer === 'function')
			? this.importer(importObj)
			: importObj;
		Object.values(this.fields).forEach(field => field.Import(obj, skipNullVals));
	};
	
	@action Clear = () => {
		Object.values(this.fields).forEach(field => field.Clear());
	};
	
	@action FormAfterChange = field => {
		this.hasChanged = true;
		if (typeof this.afterChange === 'function') this.afterChange(field);
	};
	
	@action ClearHasChanged = () => this.hasChanged = false;
	
	@computed get hasErrors() {
		return Object.values(this.fields).some(f => f.error);
	}
	
	@computed get missingRequired() {
		return Object.values(this.fields).some(f => f.required && !f.value);
	}
	
	@computed get isValid() {
		return !this.hasErrors && !this.missingRequired;
	}
}

