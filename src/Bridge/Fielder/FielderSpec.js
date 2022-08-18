import $j from '../misc/$j';

const ValueWithAffix = (value, {prefix = '', suffix = ''}) => `${prefix}${value}${suffix}`;

export const FIELDER_DEFAULT_PARAMS = {
	prefix: '',
	suffix: '',
	delimiter: ', ',
	color: '#000000',
	bold: false,
	italics: false,
};

export class FielderSpec {
	
	defaultParams = {};
	columnLup = {};
	columnKeys = [];
	columnList = [];
	
	constructor(fieldsObj, defaultParams) {
		this.defaultParams = defaultParams || FIELDER_DEFAULT_PARAMS;
		this.columnLup = $j.objToObj(
			fieldsObj,
			(key, col) => new FielderColumnDef(key, col, this.defaultParams)
		);
		this.columnKeys = Object.keys(this.columnLup);
		this.columnList = Object.values(this.columnLup);
	}
	
	GetColumn = (key) => {
		const result = this.columnLup[key];
		if (!result) throw new Error(`FielderSpec: missing column key ${key}`);
		return result;
	}
	GetChoices = () => this.columnLup;
}

export class FielderColumnDef {
	key = '';
	label = '';
	info = [];
	link = '';
	isArray = false;
	defaultParams = {};
	
	Get;
	Format;
	Summarize;
	
	constructor(key, columnObj, defaultParams) {
		this.key = key;
		this.info = columnObj.info ? [columnObj.info].flat() : null;
		this.link = columnObj.link;
		this.isArray = columnObj.isArray;
		this.defaultParams = {
			...defaultParams,
			...columnObj.params,
		};
		
		this.label = this.defaultParams.label || columnObj.label || key;
		
		if (!columnObj.Get) throw new Error(`Fielder field must have Get function: ${key}`);
		this.Get = columnObj.Get;
		this.Format = (value, params) => this.StandardFormat(value, params, columnObj.Format);
		this.Summarize = columnObj.Summarize || (() => '');
	}
	
	StandardFormat = (value, params, Format) => {
		let formatted = Format ? Format(value, params) : value;
		
		if (Array.isArray(formatted)) formatted = formatted.join(params.delimiter);
		formatted = `${params.prefix}${formatted}${params.suffix}`;
		
		return formatted;
	};
}