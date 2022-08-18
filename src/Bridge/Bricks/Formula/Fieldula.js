import {action, computed, observable} from 'mobx';
import thyme from '../../thyme';

/**
 * Input must call:
 *      value
 *      onChange
 *      onFocus
 *      onBlur
 */
export default class Fieldula {
	
	@observable id = ''; // injected
	@observable value = '';
	@observable label = '';
	@observable placeholder = '';
	@observable description = '';
	@observable type = '';
	@observable required = false;
	@observable requiredText = 'Required!';
	@observable multiline = false;
	@observable locked = false;
	@observable choices = {};
	@observable form = {};
	@observable settings = {};
	@observable useValuePassthrough = false;
	
	@observable error = '';
	@observable disabled = false;
	@observable hasChanged = false;
	
	errorChecker;
	formatter;
	importer;
	exporter;
	afterChange;
	formAfterChange; // injected
	
	
	constructor(options) {
		this.value = options.value;
		this.label = options.label;
		this.placeholder = options.placeholder;
		this.description = options.description;
		this.type = options.type;
		this.multiline = options.multiline;
		this.locked = options.locked;
		this.choices = options.choices;
		this.disabled = options.disabled;
		this.settings = options.settings || {};
		this.useValuePassthrough = options.useValuePassthrough;
		
		this.errorChecker = options.errorChecker;
		this.formatter = options.formatter;
		this.importer = options.importer;
		this.exporter = options.exporter;
		this.afterChange = options.afterChange;
		
		this.required = options.required;
		if (options.requiredText) this.requiredText = options.requiredText;
		
	}
	
	
	@computed get $exported() {
		return (typeof this.exporter === 'function')
			? this.exporter(this.value)
			: this.value;
	}
	
	@action onChange = (evt, useValuePassthrough) => {
		// console.log(`Fieldula onChange:`, evt);
		const current = this.value;
		
		const value = (this.useValuePassthrough || useValuePassthrough)
			? evt
			: evt.target.value;
		
		this.value = (typeof this.formatter === 'function')
			? this.formatter(value)
			: value;
		
		this.formAfterChange(this);
		if (typeof this.afterChange === 'function') this.afterChange(this.value);
		
		if (current !== this.value) {
			this.hasChanged = true;
		}
	};
	
	@action onFocus = () => {
	
	};
	
	@action onBlur = () => {
		let error = '';
		
		if (!this.value && this.required) {
			error = this.requiredText || 'Required!';
		} else if (typeof this.errorChecker === 'function') {
			error = this.errorChecker(this.value);
		}
		
		this.error = error;
	};
	
	
	@action Import = (importObj, skipNullVals = false) => {
		if (skipNullVals && !importObj[this.id]) return;
		
		let importedVal = (typeof this.importer === 'function')
			? this.importer(importObj[this.id], importObj)
			: importObj[this.id];
		
		if (skipNullVals && !importedVal) return;
		
		this.value = (typeof this.formatter === 'function')
			? this.formatter(importedVal)
			: importedVal;
	};
	
	@action ImportValue = (value, skipNullVals = false) => {
		let importedVal = (typeof this.importer === 'function')
			? this.importer(value)
			: value;
		
		if (skipNullVals && !importedVal) return;
		
		this.value = (typeof this.formatter === 'function')
			? this.formatter(importedVal)
			: importedVal;
	};
	
	@action Clear = () => {
		this.value = '';
	};
	
	@action ClearHasChanged = () => this.hasChanged = false;
}


export class Importer {
	static Date(val) {
		return val && thyme.nice.date.short(val);
	}
	
	static Time(val) {
		return val && thyme.nice.time.short(val);
	}
	
	static DateTime(val) {
		return val && thyme.nice.dateTime.short(val);
	}
}

export class Exporter {
	static Date(val) {
		return val && thyme.fromDateInput(val);
	}
	
	static Time(val) {
		return val && thyme.fromTimeInput(val);
	}
}

export class Formatter {
	static Phone(val) {
		if (!val || !val.length || val.length < 10) return '';
		return `${val.slice(0, 3)}-${val.slice(3, 6)}-${val.slice(6, 10)}`;
	}
}