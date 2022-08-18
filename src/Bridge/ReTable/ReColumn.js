import {action, computed, observable} from 'mobx';
import thyme from '../thyme';
import {$m} from '../misc/$m';
import $j from '../misc/$j';
import {IconType} from 'react-icons';
import {T_RowDat} from './ReTable';

export type ReColumnKey = string;

/** (rowA, rowB, sortDirection) => -1 | 0 | +1 */
export type T_FnSort = (T_RowDat, T_RowDat, ReColumn) => number;
export type T_FnClipboard = (T_RowDat, ReColumn) => string;

const DEFAULT_TEMPLATE = 'auto';

export class ReColumn {
	@observable key: ReColumnKey;
	@observable cellComponent;
	
	/* label (header) */
	@observable label: string;
	@observable labelIcon: IconType;
	@observable labelIconHue: string;
	@observable labelIconSize: number;
	@observable labelTooltip: string;
	
	/* sorting */
	@observable noSort: boolean;
	@observable fnSort: T_FnSort = FnSortDefaultString;
	@observable sortDirection: number = 0;
	@observable sortedAt: number = 0; // ms, for multi-sort comparing
	
	/* optional config */
	@observable accessor: string;
	@observable showBlank: boolean;
	@observable templateOverride: string;
	@observable w: number;
	@observable fr: number;
	@observable fnClipboard: T_FnClipboard = FnClipboardDefault;
	@observable center: boolean;
	
	@observable cell = {};
	
	constructor(config, cellComponent, fnSort: T_FnSort) {
		Object.assign(this, config); // TODO: check observable-ability of cell
		if (!this.accessor) this.accessor = this.key;
		this.cellComponent = cellComponent;
		this.fnSort = fnSort || FnSortDefaultString;
	}
	
	@computed get template(): string {
		if (this.templateOverride) return this.templateOverride;
		if (this.w) return $j.withPx(this.w);
		if (this.fr) return $j.withFr(this.fr);
		return DEFAULT_TEMPLATE;
	}
	
	
	@action SetSort = (dir: number) => {
		if (this.noSort) return;
		
		if (dir > 1) dir = -1; // cycling
		else if (dir < -1) dir = 1; // cycling
		this.sortedAt = (dir !== 0 && this.sortDirection === 0) ? thyme.nowMs() : 0;
		this.sortDirection = $m.signOnly(dir);
	};
	
	@action CycleSort = () => this.SetSort(this.sortDirection + 1);
	@action ResetSort = () => this.SetSort(0);
}

const FnSortDefaultString: T_FnSort = (a: T_RowDat, b: T_RowDat, column: ReColumn) => {
	const _a = String(a[column.accessor] || '').toLowerCase();
	const _b = String(b[column.accessor] || '').toLowerCase();
	if (_a < _b) return -column.sortDirection;
	if (_a > _b) return column.sortDirection;
	return 0;
};

// !Number.isNaN(x)
// a - b

const FnClipboardDefault: T_FnClipboard = (dat: T_RowDat, column: ReColumn) => `${dat[column.accessor]}`;