import {action, observable} from 'mobx';
import $j, {is} from '../misc/$j';
import {$m} from '../misc/$m';

export class FielderSource {
	
	@observable spec = {};
	@observable upstate = {};
	@observable columns = new Map();
	@observable filters = new Map();
	@observable columnCounter = 0;
	@observable filterCounter = 0;
	
	constructor(spec, upstate) {
		this.Construct(spec, upstate);
	}
	
	@action Construct = (spec, upstate) => {
		this.spec = spec;
		this.upstate = upstate;
		this.upstate.fnAfterRevert = this.LoadFromUpstate;
		this.LoadFromUpstate();
	};
	
	@action LoadFromUpstate = () => {
		this.columnCounter = 0;
		this.columns.clear();
		const value = this.upstate.value;
		
		if (!value || !is.object(value.data)) return;
		
		const columns = value.data.columns || [];
		const filters = value.data.filters || [];
		
		columns.forEach(col => this.AddColumn(col.key, col.params, false));
	};
	
	@action AddColumn = (key, params, updateState = true) => {
		const columnId = ++this.columnCounter;
		
		this.columns.set(
			columnId,
			new FielderColumnState(columnId, this.spec.GetColumn(key), params)
		);
		
		if (updateState) this.UpdateState();
		
		return columnId;
	};
	
	@action GetColumn = (columnId) => this.columns.get(columnId);
	@action GetParams = (columnId) => this.columns.get(columnId).params;
	
	@action MoveColumn = (idToMove, by) => {
		const columnIds = [...this.columns.keys()];
		
		const currentDex = columnIds.indexOf(idToMove);
		const targetDex = $m.minMaxIndex(currentDex + by, columnIds);
		
		if (currentDex === targetDex) return;
		
		let newColMap = new Map();
		
		columnIds.splice(targetDex, 0, columnIds.splice(currentDex, 1)[0]);
		columnIds.forEach(id => newColMap.set(id, this.columns.get(id)));
		
		this.columns = newColMap;
		this.UpdateState();
	};
	
	@action AlterColumnParam = (columnId, paramKey, paramVal) => {
		const column = this.GetColumn(columnId);
		column.SetParams({
			...column.params,
			[paramKey]: paramVal,
		});
		this.UpdateState();
	};
	
	@action RemoveColumn = (columnId) => {
		this.columns.delete(columnId);
		this.UpdateState();
	};
	
	@action UpdateState = () => {
		this.upstate.Change({
			columns: [...this.columns.values()].map(column => ({
				key: column.def.key,
				params: column.changedParams,
			})),
			filters: [...this.filters.values()].map(filter => ({
				key: filter.def.key,
				params: filter.changedParams, // TODO
			})),
		});
	};
}

export class FielderColumnState {
	
	@observable id = 0;
	@observable def;
	@observable changedParams = {};
	@observable params = {};
	
	constructor(id, def, changedParams) {
		if (!id) throw new Error(`FielderColumnState has invalid id`);
		if (!def) throw new Error(`FielderColumnState column ${id} has invalid def`);
		this.id = id;
		this.def = def;
		this.SetParams(changedParams);
	}
	
	@action SetParams = (newParams) => {
		this.changedParams = $j.changes.obj(this.def.defaultParams, newParams);
		
		let params = {
			label: this.def.label,
			...this.def.defaultParams,
			...this.changedParams,
		}
		
		if (!this.def.isArray) {
			delete params.delimiter;
		}
		
		this.params = params;
	};
}