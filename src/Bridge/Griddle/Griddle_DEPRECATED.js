import React, {Component} from 'react';
import {observer} from 'mobx-react';
import {Jewels, Root, Staches} from 'stores/RootStore';
import './Griddle.css';
import $j from '../misc/$j';
import {computed, observable} from 'mobx';
import Defer from '../misc/Defer';

/**
 * Columns (array) must have unique KEY (falls back to accessor)
 * Rows (array) must have unique KEY
 * header
 * cell
 *
 * sort: columnKey || columnAccessor
 * desc or descend: true (default: false)
 *
 * Optional:
 *  spanner: top | bottom
 */
@observer
export default class Griddle_DEPRECATED extends React.Component {
	
	@observable sortColumn = null;
	@observable sortDirection = ''; // asc || ascend || desc || descend
	
	@computed get $rowsWithVals() {
	
	}
	
	@computed get $rowsSorted() {
		const props = this.props;
		
		if (!props.sort && !this.sortColumn) return props.rows;
		
		
		let rows = props.rows.slice();
		
		const column = this.sortColumn ||
			props.columns.find(c => (c.key || c.accessor) === props.sort);
		
		if (typeof column.sorter === 'function') {
			rows.sort((a, b) => {
				const _a = getCellValue(a, column, Root());
				const _b = getCellValue(b, column, Root());
				return column.sorter(_a, _b);
			});
		} else {
			rows.sort($j.sort.default(column.accessor));
		}
		
		if (this.sortDirection && this.sortDirection === 'descend') {
			rows.reverse();
		} else if (props.desc || props.descend) {
			rows.reverse();
		}
		
		return rows;
	}
	
	@computed get $rowComps() {
		if (!this.$rowsSorted || !this.$rowsSorted.length) return [];
		
		const props = this.props;
		let previousRow;
		let currentRow;
		const topSpanner = props.columns.find(col => col.spanner === 'top');
		const bottomSpanner = props.columns.find(col => col.spanner === 'bottom');
		
		const deferRowsPerFrame = this.props.deferRowsPerFrame;
		
		return this.$rowsSorted.map((row, rowIndex) => {
			previousRow = currentRow;
			currentRow = row;
			
			return <Row
				key={row.key || rowIndex}
				columns={this.$columns}
				gridInfo={this.$gridInfo}
				row={row}
				previousRow={previousRow}
				topSpanner={topSpanner}
				bottomSpanner={bottomSpanner}
				rowIndex={rowIndex}
				deferWait={deferRowsPerFrame ? Math.floor(rowIndex / deferRowsPerFrame) : 0}
			/>;
		});
	}
	
	@computed get $columns() {
		return this.props.columns.filter(col => !col.spanner);
	}
	
	@computed get $columnTemplate() {
		return this.$columns.map(col => col.w || col.width || 'auto').join(' ');
	}
	
	@computed get $gridInfo() {
		return {
			noStripes: this.props.noStripes,
			manualEvenOdd: this.props.manualEvenOdd,
			compact: this.props.compact,
			rowClass: this.props.rowClass,
		};
	}
	
	
	render() {
		const props = this.props;
		
		$j.each(props.columns, col => {
			if (!col.key && !col.accessor) throw new Error(`Griddle column must have key or accessor ${col.header}`);
			if (!col.accessor && typeof col.valueGetter !== 'function') throw new Error(`Griddle column must have accessor or valueGetter ${col.header}`);
		});
		
		let className = 'griddle';
		if (!props.noStripes) className += ' -stripes';
		
		const style = {
			display: 'grid',
			gridTemplateColumns: this.$columnTemplate,
			columnGap: props.colGap,
			rowGap: props.rowGap,
		};
		
		return (
			<div className={className} style={style}>
				<Headers
					columns={this.$columns}
					compact={this.props.compact}
				/>
				{this.$rowComps}
			</div>
		);
	}
}


@observer
class Headers extends React.Component {
	render() {
		return (
			<>
				{this.props.columns.map((column, dex) => {
					let className = 'header';
					
					if (this.props.compact) {
						className += ' -compact';
					}
					if (dex === 0) {
						className += ' -first';
					}
					if (dex === this.props.columns.length - 1) {
						className += ' -last';
					}
					
					
					return (
						<Header
							key={column.key || column.accessor}
							column={column}
							className={className}
						/>
					);
				})}
			</>
		);
	}
}


@observer
class Header extends React.Component {
	render() {
		const col = this.props.column;
		
		return (
			<div
				className={this.props.className}
			>
				{col.header}
			</div>
		);
	}
}


@observer
class Row extends React.Component {
	
	render() {
		const row = this.props.row;
		const columns = this.props.columns;
		const topSpanner = this.props.topSpanner;
		const bottomSpanner = this.props.bottomSpanner;
		const className = this.props.className;
		const gridInfo = this.props.gridInfo;
		
		let rowClass = '';
		
		if (gridInfo.compact)
			rowClass += ' -compact';
		
		if (!gridInfo.manualEvenOdd)
			rowClass += this.props.rowIndex % 2 === 0 ? ' -even' : ' -odd';
		
		if (gridInfo.rowClass)
			rowClass += (typeof gridInfo.rowClass === 'function')
				? ' ' + gridInfo.rowClass(this.props.row, this.props.previousRow)
				: ' ' + gridInfo.rowClass;
		
		
		return (
			<>
				{topSpanner && (
					<Spanner
						row={row}
						column={topSpanner}
						// className={className}
						columnCount={columns.length}
						key={`${row.key}_${topSpanner.key || topSpanner.accessor}`}
						previousRow={this.props.previousRow}
						columns={columns}
						gridInfo={this.props.gridInfo}
						rowIndex={this.props.rowIndex}
						containerStyler={typeof topSpanner.containerStyler === 'function'
							? topSpanner.containerStyler(row, topSpanner)
							: undefined}
					/>
				)}
				
				
				{columns.map((column, colIndex) => {
						
						const cellProps = typeof column.cellProps === 'function'
							? column.cellProps(row)
							: {};
						
						const containerStyler = typeof column.containerStyler === 'function'
							? column.containerStyler(row, column)
							: undefined;
						
						if (colIndex === 0)
							rowClass += ' -firstCol';
						
						if (colIndex === columns.length - 1)
							rowClass += ' -lastCol';
						
						return (
							<Cell
								key={`${row.key}_${column.key || column.accessor}`}
								row={row}
								previousRow={this.props.previousRow}
								column={column}
								columns={columns}
								// gridInfo={this.props.gridInfo}
								// colIndex={colIndex}
								// rowIndex={this.props.rowIndex}
								cellProps={cellProps}
								containerStyler={containerStyler}
								rowClass={rowClass}
								deferWait={this.props.deferWait}
							/>
						);
					}
				)}
				
				
				{bottomSpanner && (
					<Spanner
						row={row}
						column={bottomSpanner}
						// className={className}
						columnCount={columns.length}
						key={`${row.key}_${bottomSpanner.key || bottomSpanner.accessor}`}
						previousRow={this.props.previousRow}
						columns={columns}
						gridInfo={this.props.gridInfo}
						rowIndex={this.props.rowIndex}
						containerStyler={typeof bottomSpanner.containerStyler === 'function'
							? bottomSpanner.containerStyler(row, bottomSpanner)
							: undefined}
					/>
				)}
			
			</>
		);
	}
}

// TODO: Combine Cell + Spanner?

@observer
class Cell extends React.Component {
	
	// @computed get $className() {
	// 	let cell = 'cell';
	// 	const gridInfo = this.props.gridInfo;
	//
	// 	if (gridInfo.compact)
	// 		cell += ' -compact';
	//
	// 	if (!gridInfo.manualEvenOdd)
	// 		cell += this.props.rowIndex % 2 === 0 ? ' -even' : ' -odd';
	//
	// 	if (this.props.colIndex === 0)
	// 		cell += ' -firstCol';
	//
	// 	if (this.props.colIndex === this.props.columns.length - 1)
	// 		cell += ' -lastCol';
	//
	// 	if (gridInfo.rowClass)
	// 		cell += (typeof gridInfo.rowClass === 'function')
	// 			? ' ' + gridInfo.rowClass(this.props.row, this.props.previousRow)
	// 			: ' ' + gridInfo.rowClass;
	//
	// 	return cell;
	// }
	
	@computed get $value() {
		return getCellValue(this.props.row, this.props.column, Root());
	}
	
	// @computed get $valueAbove() {
	// 	return getCellValue(this.props.previousRow, this.props.column, Root());
	// }
	
	render() {
		const column = this.props.column;
		const row = this.props.row;
		const Comp = column.cell || Cell_Default;
		const cellProps = this.props.cellProps;
		const containerStyler = this.props.containerStyler;
		const deferWait = this.props.deferWait;
		
		return (
			<div
				className={'cell ' + this.props.rowClass}
				style={containerStyler}
			>
				{(this.$value || column.showBlank)
					? (
						<Defer wait={deferWait}>
							<Comp
								column={column}
								row={row}
								value={this.$value}
								valueAbove={() => getCellValue(this.props.previousRow, column)}
								{...cellProps}
							/>
						</Defer>
					) : (
						<div/>
					)
				}
			</div>
		);
	}
}

@observer
class Spanner extends React.Component {
	
	@computed get $className() {
		let cell = 'cell';
		const gridInfo = this.props.gridInfo;
		
		if (gridInfo.compact)
			cell += ' -compact';
		
		if (!gridInfo.manualEvenOdd)
			cell += this.props.rowIndex % 2 === 0 ? ' -even' : ' -odd';
		
		if (this.props.colIndex === 0)
			cell += ' -firstCol';
		
		if (this.props.colIndex === this.props.columns.length - 1)
			cell += ' -lastCol';
		
		if (gridInfo.rowClass)
			cell += (typeof gridInfo.rowClass === 'function')
				? ' ' + gridInfo.rowClass(this.props.row, this.props.previousRow)
				: ' ' + gridInfo.rowClass;
		
		return cell;
		
		// return getCellClassName(
		// 	this.props.gridInfo,
		// 	this.props.columns,
		// 	this.props.row,
		// 	this.props.colIndex,
		// 	this.props.rowIndex);
	}
	
	@computed get $value() {
		return getCellValue(this.props.row, this.props.column, Root());
	}
	
	render() {
		const row = this.props.row;
		const column = this.props.column;
		const columnCount = this.props.columnCount;
		const Comp = column.cell || Cell_Default;
		
		return (
			<div
				className={this.$className}
				style={{
					gridColumnStart: 1,
					gridColumnEnd: columnCount + 1,
				}}
			>
				<Comp
					value={this.$value}
					column={column}
					row={row}
					className={this.$className}
				/>
			</div>
		);
	}
}


@observer
class Cell_Default extends React.Component {
	
	
	render() {
		const val = '' + this.props.value;
		return (
			<div>
				<div>{val}</div>
			</div>
		);
	}
}


function getCellValue(row, column) {
	if (!row) return null;
	return (typeof column.valueGetter === 'function')
		? column.valueGetter(row, Root())
		: row[column.accessor];
}