import {action, observable} from 'mobx';
import $j, {is, kvp} from '../misc/$j';
import {DragonListDef, DragonSpec} from './DragonSpec';
import {Upstate} from '../misc/Upstate';
import nanoid from 'nanoid';

export class DragonSource {
	
	@observable spec: DragonSpec = {};
	@observable upstate: Upstate = {};
	@observable lists: Map<DragonListKey, DragonListState> = new Map();
	@observable listsArray: DragonListState[] = [];
	@observable tray: DragonListState;
	
	constructor(spec, upstate) {
		this.Construct(spec, upstate);
	}
	
	@action Construct = (spec, upstate) => {
		if (!spec) throw new Error(`DragonSource requires DragonSpec`);
		
		this.spec = spec;
		this.upstate = upstate;
		this.upstate.fnAfterRevert = this.LoadFromUpstate;
		
		this.tray = new DragonListState(this.spec.tray);
		
		this.LoadFromUpstate();
	};
	
	@action LoadFromUpstate = () => {
		this.lists.clear();
		this.listsArray = [];
		
		for (const def of this.spec.listDefs) {
			
			const list = new DragonListState(def);
			this.listsArray.push(list);
			this.lists.set(def.key, list);
			
		}
		
		const value = this.upstate.value;
		if (!value || !is.object(value.data)) return;
		
		for (const [listKey, listItems] of kvp(value.data)) {
			
			const list = this.lists.get(listKey);
			
			for (const itemValue of listItems) {
				this.AddNewItem(itemValue, list);
				this.AddToTray(itemValue);
			}
			
		}
	};
	
	@action AddToTray = (itemValue) => {
		if (this.tray.HasValue(itemValue)) {
			this.tray.MoveToBottom(null, itemValue);
			return;
		}
		
		this.AddNewItem(itemValue, this.tray);
	};
	
	GetList = (listKey): DragonListState => {
		if (listKey === this.tray.key) return this.tray;
		return this.lists.get(listKey);
	};
	
	@action Move = (sourceListKey, targetListKey, itemKey, targetIndex) => {
		const sourceList = this.GetList(sourceListKey);
		const targetList = this.GetList(targetListKey);
		
		// console.log(`Move ${itemKey}: ${sourceList.debugLabel}) --> ${targetList.debugLabel} @${targetIndex}`);
		
		if (sourceList.isTray && !targetList.isTray) {
			// ADDING, make new item
			console.log(`🐉 ADDING`);
			const itemValue = sourceList.GetValueFromKey(itemKey);
			targetList.Remove(null, itemValue);
			this.AddNewItem(itemValue, targetList, targetIndex);
			
		} else if (!sourceList.isTray && targetList.isTray) {
			
			// DELETING
			console.log(`🐉 DELETING`);
			sourceList.Remove(itemKey);
			
		} else if (!sourceList.isTray && !targetList.isTray) {
			
			// MOVING, we're moving
			console.log(`🐉 MOVING`);
			const itemValue = sourceList.GetValueFromKey(itemKey);
			sourceList.Remove(itemKey, itemValue);
			targetList.Remove(null, itemValue);
			targetList.AddItem(itemKey, itemValue, targetIndex);
			
		} else {
			console.log(`🐉 NOTHING ..?`);
			return; // nothing, TODO: handle gracefully
		}
		
		this.UpdateUpstate();
	};
	
	@action AddNewItem = (itemValue, list, index) => {
		list.AddItem(
			`${itemValue}___${nanoid(12)}`,
			itemValue,
			index,
		);
	};
	
	
	/** change Upstate value */
	@action UpdateUpstate = () => {
		let upstate = {};
		
		for (const list of this.lists.values()) {
			if (list.def.isTray) continue;
			upstate[list.key] = list.ToState();
		}
		
		this.upstate.Change(upstate);
	};
	
	/** DnD handler */
	@action OnDragEnd = (result: DndDropResult) => {
		console.log(`OnDragEnd`, result);
		
		if (!result.destination) return;
		
		this.Move(
			result.source.droppableId,
			result.destination.droppableId,
			result.draggableId,
			result.destination.index,
		);
	};
}

/// DnD Droppable
export class DragonListState {
	
	@observable key: DragonListKey;
	@observable def: DragonListDef;
	@observable keyToValue: Map<DragonItemKey, string> = new Map(); // what is shown, order, etc.
	@observable valueToKey: Map<string, DragonItemKey> = new Map(); // just a lookup
	@observable isTray = false;
	@observable debugLabel = '';
	
	constructor(def) {
		this.key = def.key;
		this.def = def;
		this.isTray = def.isTray;
		this.debugLabel = def.isTray ? `TRAY` : `${this.def.label}(${this.key})`;
	}
	
	HasKey = (itemKey) => this.keyToValue.has(itemKey);
	HasValue = (itemValue) => this.valueToKey.has(itemValue);
	GetKeyFromValue = (itemValue) => this.valueToKey.get(itemValue);
	GetValueFromKey = (itemKey) => this.keyToValue.get(itemKey);
	
	@action Remove = (itemKey, itemValue) => {
		const key = itemKey || this.GetKeyFromValue(itemValue);
		const value = itemValue || this.GetValueFromKey(itemKey);
		console.log(`🐉 REMOVE from ${this.debugLabel}: ${value}(${key})`);
		this.keyToValue.delete(key);
		this.valueToKey.delete(value);
	};
	
	@action RemoveWithKey = (itemKey) => {
		const itemValue = this.keyToValue.get(itemKey);
		this.keyToValue.delete(itemKey);
		this.valueToKey.delete(itemValue);
	};
	
	@action RemoveWithValue = (itemValue) => {
		const itemKey = this.valueToKey.get(itemValue);
		this.keyToValue.delete(itemKey);
		this.valueToKey.delete(itemValue);
	};
	
	@action AddItem = (itemKey, itemValue, index = 999999) => {
		console.log(`🐉 ADD to ${this.debugLabel}: ${itemValue}(${itemKey}) @${index}`, itemValue);
		
		if (index < this.keyToValue.size) {
			this.keyToValue = $j.insertInMap(this.keyToValue, index, itemKey, itemValue);
		} else {
			this.keyToValue.set(itemKey, itemValue);
		}
		
		this.valueToKey.set(itemValue, itemKey);
	};
	
	@action MoveToBottom = (itemKey, itemValue) => {
		const key = itemKey || this.GetKeyFromValue(itemValue);
		const value = itemValue || this.GetValueFromKey(itemKey);
		if (!key || !value) return; // doesn't exist
		this.keyToValue.delete(key);
		this.valueToKey.delete(value);
		this.keyToValue.set(key, value);
		this.valueToKey.set(itemValue, itemKey);
	};
	
	@action Clear = () => {
		this.keyToValue.clear();
		this.valueToKey.clear();
	};
	
	ToState = () => [...this.keyToValue.values()];
	
}


export type DragonListKey = DndDroppableId;
export type DragonItemKey = DndDraggableId;

/* for ref, from DnD (sorta) */

type DndDraggableId = string;
type DndDroppableId = string;

type DndDropResult = {|
	draggableId: DndDraggableId,
	type: string,
	source: {|
		droppableId: DndDroppableId,
		index: number,
	|},
	destination: ?{|
		droppableId: DndDroppableId,
		index: number,
	|}, // may not have any destination (drag to nowhere)
	reason: 'DROP' | 'CANCEL',
|};
