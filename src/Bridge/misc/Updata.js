import {entries, toJS} from 'mobx';
import $j from './$j';

export class Updata {
	static Init(updata, dataObj, config = {}) {
		if (!updata || !dataObj) throw new Error(`Upstate Updata.Init requires reference and dataObj (can be empty)`);
		
		// console.log(`Updata.Init`, updata, dataObj);
		
		let keys = [];
		let states = [];
		
		for (const [key, state] of entries(updata)) {
			if (!state) continue;
			if (!state.isUpstate) continue;
			
			keys.push(key);
			states.push(state);
			
			state.SetKey(key);
			
			if (config.useClutch) {
				state.SetUseClutch(config.useClutch);
			} else if ($j.has(dataObj, key)) {
				state.SetInitialValue(dataObj[key]);
			}
		}
		
		updata.allKeys = keys;
		updata.allStates = states;
		
		// console.log(`Updata.Init: set keys (states count: ${states.length})`, keys);
	}
	
	static GetChanges(updata) {
		let changes = {};
		
		updata.allStates.forEach(state => {
			if (state.hasChanged) {
				// console.log(`state has changed: ${state.key}`, toJS(state.packed));
				changes[state.key] = toJS(state.packed);
			}
		});
		
		return changes;
	}
	
	static ToObject(updata) {
		let obj = {};
		
		updata.allStates.forEach(state => {
			obj[state.key] = toJS(state.packed);
		});
		
		return obj;
	}
}