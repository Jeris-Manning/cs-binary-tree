import {action, observable} from 'mobx';
import $j from '../Bridge/misc/$j';
import {observer} from 'mobx-react';
import React from 'react';
import {Tip} from '../Bridge/misc/Tooltip';
import {Row, Txt} from '../Bridge/Bricks/bricksShaper';
import {MdCheckBox, MdCheckBoxOutlineBlank} from 'react-icons/md';

export class DefLup<TKey, TDef> {
	
	keyMaker;
	defMaker;
	lup: Map<TKey, TDef> = new Map();
	all: TDef[] = [];
	
	constructor(keyMaker, defMaker, rows: any[]) {
		this.keyMaker = keyMaker;
		this.defMaker = defMaker;
		
		if (!rows) return;
		
		for (const row of rows) {
			this.Add(defMaker(row));
		}
	}
	
	Has = (key: TKey) => this.lup.has(key);
	Get = (key: TKey) => this.lup.get(key);
	GetWithId = (id: number) => this.lup.get(this.keyMaker(id));
	
	Add = (def: TDef) => {
		if (!def) return;
		this.lup.set(def.key, def);
		this.all.push(def);
	};
	
	GetWithIdOrAdd = (id: number, raw) => {
		const existing = this.GetWithId(id);
		if (existing) return existing;
		
		const def = this.defMaker(raw);
		this.Add(def);
		return def;
	};
}

// TODO: move
export class FilterSource<TKey, TDef> {
	@observable lup: Map<TKey, DefState<TDef>> = new Map();
	@observable all: DefState<TDef>[] = [];
	@observable shown: DefState<TDef>[] = [];
	@observable shownCount = 0;
	@observable totalCount = 0;
	
	constructor(defLup: DefLup<TKey, TDef>, sortBy: string = '', enabledByDefault: boolean = true) {
		let defs = [...defLup.all];
		if (sortBy) defs.sort($j.sort.alphabetic(sortBy));
		defs.forEach(def => {
			const state = new DefState(
				def,
				enabledByDefault,
				this.SetShow,
			);
			this.lup.set(def.key, state);
			this.all.push(state);
		});
		
		this.totalCount = this.all.length;
		
		this.Calculate();
	}
	
	@action SetShow = (key: TKey, show: boolean = true) => {
		const state = this.lup.get(key);
		if (state) state.show = show;
		this.Calculate();
	};
	
	@action Toggle = (key: TKey) => {
		const state = this.lup.get(key);
		if (state) state.show = !state.show;
		this.Calculate();
	};
	
	@action Calculate = () => {
		this.shown = this.all.filter(state => state.show);
		this.shownCount = this.shown.length;
	};
	
	@action SetAll = (show: boolean) => {
		this.all.forEach(state => state.show = show);
		this.shown = show ? this.all : [];
		this.shownCount = this.shown.length;
	};
	
	@action ShowAll = () => this.SetAll(true);
	@action HideAll = () => this.SetAll(false);
}

export class DefState<T> {
	@observable def: T;
	@observable show: boolean;
	Setter;
	
	constructor(def: T, show: boolean, setter) {
		this.def = def;
		this.show = show;
		this.Setter = setter;
	}
	
	@action SetShow = (show) => this.Setter(this.def.key, show);
	@action Toggle = () => this.Setter(this.def.key, !this.show);
}

@observer
export class DefFilterHeader extends React.Component {
	render() {
		const {
			source,
			label,
		} = this.props;
		
		const allSelected = source.shownCount === source.totalCount;
		
		const tip = allSelected ? `Deselect all ${label}` : `Select all ${label}`;
		const CheckIcon = allSelected ? MdCheckBox : MdCheckBoxOutlineBlank;
		const onClick = allSelected ? source.HideAll : source.ShowAll;
		
		return (
			<Tip text={tip}>
				<Row
					onClick={onClick}
					marB={4}
					childV
				>
					<Txt
						size={16}
						marR={4}
						noSelect
						smallCaps
					>{label}</Txt>
					
					<CheckIcon
						size={16}
					/>
				</Row>
			</Tip>
		)
	}
}

@observer
export class DefFilter extends React.Component {
	render() {
		const {
			state,
			label, // override
			tooltip, // override
		} = this.props;
		
		const labelStr = label || state.def.label || state.def.name;
		const tipStr = tooltip || state.def.tooltip || state.def.description;
		const CheckIcon = state.show ? MdCheckBox : MdCheckBoxOutlineBlank;
		const OtherIcon = state.def.icon;
		
		return (
			<Tip text={tipStr}>
				<Row
					onClick={state.Toggle}
				>
					
					<CheckIcon
						size={12}
					/>
					
					<Txt
						size={12}
						marL={2}
						marR={6}
						noSelect
						capFirst
					>{labelStr}</Txt>
					
					{OtherIcon && (
						<OtherIcon
							size={12}
						/>
					)}
				</Row>
			</Tip>
		);
	}
}
