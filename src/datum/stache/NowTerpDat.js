import {action, observable} from 'mobx';
import thyme from '../../Bridge/thyme';
import type {ThymeDt} from '../../Bridge/thyme';

export type NowTerpDateKey = string|'yyyy-MM-dd';

export class NowTerpDat {
	@observable key: NowTerpDateKey;
	@observable entries: NowTerpEntry[] = [];
	
	@action ApplyDatRaw = (datRaw) => {
		this.entries = thyme.fast.array.unpack(datRaw.entries);
	};
	
	constructor(key: NowTerpDateKey) {this.key = key;}
	static Stub = (key: NowTerpDateKey): NowTerpDat => new NowTerpDat(key);
	
	
	static MakeKey(dt: ThymeDt): NowTerpDateKey {
		return thyme.nice.date.input(dt);
	}
}


export class NowTerpEntry {
	shiftId: number;
	terpId: number;
	start: ThymeDt;
	end: ThymeDt;
	note: string;
}