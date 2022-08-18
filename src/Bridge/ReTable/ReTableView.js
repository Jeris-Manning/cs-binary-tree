import React from 'react';
import {observer} from 'mobx-react';
import {Col, Row, Txt} from '../Bricks/bricksShaper';
import {Ico} from '../Bricks/Ico';
import {FaSortDown, FaSortUp} from 'react-icons/fa';
import './ReTable.css';
import {Tip} from '../misc/Tooltip';
import {ReTable} from './ReTable';
import {computed} from 'mobx';
import {ReColumn} from './ReColumn';
import type {T_ReRow, T_RowDat} from './ReTable';
import {RC_Default} from './RC_Default';
import type {ReColumnKey} from './ReColumn';

export type C_ReTableView = {
	retable: ReTable,
	sortKey?: ReColumnKey,
	sortDirection?: number,
}

@observer
export class ReTableView extends React.Component<C_ReTableView> {
	
	componentDidMount() {
		const sortKey: ReColumnKey = this.props.sortKey;
		if (!sortKey) return;
		
		const retable: ReTable = this.props.retable;
		const column = retable.columnList.find(c => c.key === sortKey);
		if (!column) return;
		
		retable.ClickColumn(column, this.props.sortDirection || 1);
		column.SetSort(this.props.sortDirection || 1);
	}
	
	render() {
		const retable: ReTable = this.props.retable;
		
		if (!retable)
			throw new Error(`ReTableView requires retable`);
		
		return (
			<OuterGrid retable={retable}>
				
				<ReColumnGroup retable={retable}/>
				<ReRowGroup retable={retable}/>
			
			</OuterGrid>
		);
	}
}

@observer
class OuterGrid extends React.Component {
	render() {
		const retable: ReTable = this.props.retable;
		
		return (
			<div
				className={'retable'}
				style={{
					display: 'grid',
					gridTemplateColumns: retable.template,
				}}
			>
				{this.props.children}
			</div>
		);
	}
}


@observer
class ReRowGroup extends React.Component<C_ReTableView> {
	render() {
		const retable: ReTable = this.props.retable;
		// trace();
		
		return (
			<>
				{retable.sortedRows.map((row: T_ReRow) => (
					<ReRowView
						key={row.key}
						retable={retable}
						row={row}
					/>
				))}
			</>
		);
	}
}


@observer
class ReRowView extends React.Component<C_ReTableView> {
	
	@computed get canShow(): boolean {
		const retable: ReTable = this.props.retable;
		const row: T_ReRow = this.props.row;
		
		if (row.isPending) return false;
		if (retable.filters.length === 0) return true;
		
		const dat: T_RowDat = row.dat;
		return retable.filters.every(f => f.Allowed(dat));
	}
	
	@computed get className(): string {
		return this.canShow
			? 'retable_row'
			: 'retable_row hidden';
	}
	
	render() {
		const retable: ReTable = this.props.retable;
		const row: T_ReRow = this.props.row;
		
		return (
			<div className={this.className}>
				<div/>
				
				<ReCellGroup
					retable={retable}
					row={row}
				/>
				
				<div/>
			</div>
		);
	}
}

@observer
class ReCellGroup extends React.Component<C_ReTableView> {
	render() {
		const retable: ReTable = this.props.retable;
		const row: T_ReRow = this.props.row;
		
		return (
			<>
				{retable.columnList.map((column: ReColumn) => (
					<ReCell
						key={`${column.key}_${row.key}`}
						column={column}
						row={row}
					/>
				))}
			</>
		);
	}
}

@observer
class ReCell extends React.Component {
	render() {
		const column: ReColumn = this.props.column;
		const row: T_ReRow = this.props.row;
		const dat: T_RowDat = row.dat;
		
		const Comp = column.cellComponent || RC_Default;
		
		const value = dat[column.accessor];
		
		// console.log(`🧨🧨🧨🧨 render ReCell: ${column.key}_${row.key} | `, value);
		
		const className = column.center ? 'cell center' : 'cell';
		
		return (
			<div className={className}>
				<Comp
					value={value}
					dat={dat}
					column={column}
					cell={column.cell}
				/>
			</div>
		);
	}
}


/* =======================
	COLUMN HEADERS
======================== */

@observer
class ReColumnGroup extends React.Component<C_ReTableView> {
	render() {
		const retable: ReTable = this.props.retable;
		
		return (
			<>
				<div/>
				
				{retable.columnList.map(column => (
					<ColumnHeader
						key={column.key}
						column={column}
						retable={retable}
					/>
				))}
				
				<div/>
			</>
		);
	}
}

@observer
class ColumnHeader extends React.Component<C_ReTableView> {
	render() {
		const column: ReColumn = this.props.column;
		const retable: ReTable = this.props.retable;
		
		const sortIcon = column.sortDirection < 0
			? FaSortUp
			: column.sortDirection > 0
				? FaSortDown
				: null;
		
		const onClick = !column.noSort
			? () => retable.ClickColumn(column)
			: undefined;
		
		return (
			<Row
				onClick={onClick}
				childCenterV
				marB={12}
			>
				<Tip text={column.labelTooltip}>
					
					<Row childC>
						{column.labelIcon && (
							<Ico
								icon={column.labelIcon}
								iconHue={column.labelIconHue}
								iconSize={column.labelIconSize}
								marR={2}
							/>
						)}
						
						<Txt
							b
							hue={'#373737'}
						>
							{column.label}
						</Txt>
					</Row>
				
				</Tip>
				
				<Ico
					icon={sortIcon}
					size={12}
					hue={'#373737'}
					marL={4}
				/>
			</Row>
		);
	}
}