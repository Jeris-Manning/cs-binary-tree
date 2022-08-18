import {action, autorun, computed, observable, trace} from 'mobx';
import $j, {is, isFunc} from '../misc/$j';
import React from 'react';
import {ReColumn} from './ReColumn';
import type {ReColumnKey} from './ReColumn';
import {ReFilter} from './ReFilter';
import type {ReFilterStatus} from './ReFilter';

export type T_ReTable_Config = {
	label: string,
	rowMap: Map<string, T_ReRow>,
	columnList: ReColumn[],
}


export type ReRowKey = string;
export type T_ReRow = {
	key: ReRowKey,
	dat: T_RowDat,
	isPending: boolean,
}
export type T_RowDat = any;

export class ReTable {
	
	ToLog = (msg) => `🧮 ${msg}`;
	
	@observable label: string;
	@observable rowMap: Map<ReRowKey, T_ReRow>;
	@observable columnList: ReColumn[] = [];
	
	constructor(config: T_ReTable_Config) {
		this.label = config.label || '?';
		
		if (!config.rowMap) throw new Error(`ReTable requires rowMap`);
		this.rowMap = config.rowMap;
		
		if (!config.columnList) throw new Error(`ReTable requires columnList`);
		this.columnList = config.columnList;
	}
	
	@computed get template(): string {
		const template = this.columnList
			.map(c => c.template)
			.join(' ');
		
		return `auto ${template} auto`;
	}
	
	@observable allRows: T_ReRow[] = [];
	
	runAllRows = autorun(() => {
		// trace();
		// console.log(this.ToLog(`runAllRows ${this.rowMap.size}`));
		this.allRows = [...this.rowMap.values()];
	}, {delay: 100});
	
	@computed get sortedRows(): T_ReRow[] {
		const rows: T_ReRow[] = this.allRows.slice();
		
		if (!this.sortingColumns.length) return rows;
		
		return rows.sort((a, b) => {
			for (const column of this.sortingColumns) {
				const sortVal = column.fnSort(a.dat, b.dat, column);
				if (sortVal !== 0) return sortVal;
			}
		});
	}
	
	@observable sortingColumns: ReColumn[] = [];
	
	@action ClickColumn = (clickedColumn: ReColumn, direction = null) => {
		if (this.sortingColumns.length === 0) {
			clickedColumn.SetSort(direction === null ? 1 : direction);
			this.sortingColumns = [clickedColumn];
			return;
		}
		
		// TODO: multi sort
		// this.columnList
		// 	.filter(c => c.sortDirection !== 0)
		// 	.sort((a, b) => a.sortedAt - b.sortedAt)
		// 	.reverse();
		
		const currentColumn = this.sortingColumns[0];
		
		if (currentColumn.key === clickedColumn.key) {
			clickedColumn.CycleSort();
			return;
		}
		
		currentColumn.ResetSort();
		
		clickedColumn.SetSort(direction === null ? 1 : direction);
		this.sortingColumns = [clickedColumn];
	}
	
	
	/* FILTERING */
	
	// see: ReRowView.canShow
	// filters are removed/re-added to trigger recalculation
	@observable filters: ReFilter[] = [];
	
	@action SetFilter = (filter: ReFilter, status: ReFilterStatus|undefined) => {
		if (status !== undefined) filter.Set(status);
		
		this.filters = this.filters.filter(f => f.key !== filter.key);
		this.filters.push(filter);
	}
	
	@action CycleFilter = (filter: ReFilter) => {
		filter.Cycle();
		this.SetFilter(filter);
	}
	
	@action ResetFilter = (filter: ReFilter) => {
		filter.Reset();
		this.SetFilter(filter);
	}
	
	
	/* COUNTS */
	
	@computed get counts() {
		return {
			shown: this.sortedRows.length,
			full: this.rowMap.size,
		};
	}
	
	
	
	/* CLIPBOARD */
	
	ToClipboard = (includeColumns = true) => {
		const header = includeColumns
			? this.columnList.map(c => c.label).join('\t') + '\n'
			: '';
		
		const rows = this.sortedRows
			.map(row => (
				this.columnList.map(column => (
					$j.replaceReturns(
						column.fnClipboard(row.dat, column)
					)
				)).join('\t')
			)).join('\n');
		
		return header + rows;
	};
}


