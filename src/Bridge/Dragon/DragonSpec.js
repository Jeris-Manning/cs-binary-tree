import $j, {kvp} from '../misc/$j';


export class DragonSpec {
	
	listKeys = [];
	listDefs = [];
	listLup = {}; // key: { label, ... }
	tray = {};
	itemComponent;
	titleComponent;
	listStyle = {};
	itemStyle = {};
	
	constructor(config) {
		// console.log(`DragonSpec config`, config);
		this.itemComponent = config.itemComponent;
		this.titleComponent = config.titleComponent;
		this.listStyle = config.listStyle || {};
		this.itemStyle = config.itemStyle || {};
		
		for (const [keyRaw, listObj] of kvp(config.lists)) {
			const key = `${keyRaw}`;
			
			const def = new DragonListDef(key, {
				itemComponent: this.itemComponent,
				titleComponent: this.titleComponent,
				...listObj,
			});
			
			this.listKeys.push(key);
			this.listDefs.push(def);
			this.listLup[key] = def;
			
		}
		
		this.tray = new DragonListDef('___TRAY___', {
			itemComponent: this.itemComponent,
			titleComponent: this.titleComponent,
			...config.tray,
			isTray: true,
		});
		
		// console.log(`DragonSpec after constructor`, this);
	}
}

export class DragonListDef {
	key = '';
	label = '';
	isTray = false; // special list that stores all possible/existing items
	
	itemComponent;
	titleComponent;
	listStyle = {};
	itemStyle = {};
	
	constructor(key, listObj) {
		Object.assign(this, listObj);
		this.key = key;
		this.label = listObj.label;
		this.isTray = listObj.isTray;
		this.itemComponent = listObj.itemComponent;
		this.titleComponent = listObj.titleComponent;
		this.listStyle = listObj.listStyle || {};
		this.itemStyle = listObj.itemStyle || {};
	}
}
