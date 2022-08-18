import $j, {is} from '../misc/$j';

export class EntablerSpec {
	
	columnLup = {};
	columnKeys = [];
	columnList = [];
	template = '';
	
	constructor(columnsObj) {
		this.columnLup = $j.objToObj(
			columnsObj,
			(key, col) => new EntablerColumnDef(key, col),
		);
		
		this.columnKeys = Object.keys(this.columnLup);
		this.columnList = Object.values(this.columnLup);
		
		const template = this.columnList
			.map(c => c.template)
			.join(' ');
		
		this.template = `auto ` + template + ' auto';
		// console.log(`template: ${this.template}`)
	}
}

export class EntablerColumnDef {
	
	key;
	accessor;
	className;
	w;
	fr;
	template;
	trunc;
	cell;
	label;
	labelIcon;
	labelTooltip;
	noSort;
	// can be others
	
	Get;
	Format;
	Sorter;
	
	constructor(key, columnObj) {
		this.key = key;
		this.accessor = key;
		this.className = 'header';
		
		Object.assign(this, columnObj);
		
		this.template = Generate.Template(columnObj);
		this.Get = Generate.Get(columnObj);
		this.Format = Generate.Format(columnObj);
		this.Sorter = columnObj.Sorter || Generate.DefaultSorter;
	}
	
	GetValue = (row) => this.Format(this.Get(row, this), this);
}

class Generate {
	
	static Template(colObj) {
		if (colObj.template) return colObj.template;
		if (colObj.w) return $j.withPx(colObj.w);
		if (colObj.fr) return $j.withFr(colObj.fr);
		return 'auto';
	}
	
	static Get(colObj) {
		if (is.func(colObj.Get)) return colObj.Get;
		return this.StandardGet;
	}
	
	static StandardGet(row, colDef) {
		return row[colDef.accessor];
	}
	
	static Format(colObj) {
		if (is.func(colObj.Format)) return colObj.Format;
		return this.StandardFormat;
	}
	
	static StandardFormat(value, colDef) {
		let formatted = value;
		
		if (Array.isArray(value)) formatted = value.join($j.getOr(colDef.delimiter, ', '));
		if (colDef.prefix) formatted = colDef.prefix + formatted;
		if (colDef.suffix) formatted += colDef.suffix;
		
		if (colDef.trunc) formatted = $j.trunc(formatted, colDef.trunc);
		return formatted;
	}
	
	static DefaultSorter(a, b, direction = 1) {
		const _a = typeof a === 'string' ? a.toLowerCase() : a;
		const _b = typeof b === 'string' ? b.toLowerCase() : b;
		if (_a < _b) return -direction;
		if (_a > _b) return direction;
		return 0;
	}
}