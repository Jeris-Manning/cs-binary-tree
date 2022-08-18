import React from 'react';
import {observer} from 'mobx-react';
import {Col, Row, Txt} from '../Bricks/bricksShaper';
import {Ico} from '../Bricks/Ico';
import {FaSortDown, FaSortUp} from 'react-icons/fa';
import './Entabler.css';
import {Tip} from '../misc/Tooltip';
import $j from '../misc/$j';

@observer
export class Entabler extends React.Component {
	
	componentDidMount() {
		// sort = 'columnKey' OR ['columnKey', directionInt]
		this.props.source.DoDefaultSort(this.props.sort);
	}
	
	render() {
		const {
			source,
		} = this.props;
		
		if (!source)
			throw new Error(`Entabler requires EntablerSource`);
		
		return (
			<div
				className={'entabler'}
				style={{
					display: 'grid',
					gridTemplateColumns: source.spec.template,
				}}
			>
				
				<Headers source={source}/>
				
				<Rows source={source}/>
				
			</div>
		);
	}
}

@observer
class Headers extends React.Component {
	render() {
		const {
			source
		} = this.props;
		
		return (
			<>
				<div/>
				
				{source.columnList.map(column => (
					<Header
						key={column.key}
						column={column}
						SortClick={() => source.CycleSort(column.key)}
					/>
				))}
				
				<div/>
			</>
		);
	}
}

@observer
class Header extends React.Component {
	render() {
		const {
			column, // ColumnState
			SortClick,
		} = this.props;
		
		const def = column.def;
		
		const sortIcon = column.sortDirection < 0 ? FaSortUp
			: column.sortDirection > 0 ? FaSortDown
				: null;
		
		return (
			<Row
				onClick={SortClick}
				childCenterV
				marB={12}
			>
				<Tip text={def.labelTooltip}>
					
					<Row childC>
						{def.labelIcon && (
							<Ico
								icon={def.labelIcon}
								iconHue={def.labelIconHue}
								iconSize={def.labelIconSize}
								marR={2}
							/>
						)}
						
						<Txt
							b
							hue={'#373737'}
						>
							{def.label}
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


@observer
class Rows extends React.Component {
	render() {
		const {
			source
		} = this.props;
		// trace();
		
		return (
			<>
				{source.sortedElements.map(element => (
					<EntablerRow
						key={element.key}
						element={element}
					/>
				))}
			</>
		);
	}
}


// class Cap extends React.Component {
// 	render() {
// 		return <Col minHeight={10} />;
// 	}
// }


@observer
class EntablerRow extends React.Component {
	render() {
		const {
			element
		} = this.props;
		
		return (
			<div className={element.className}>
				<div/>
				
				<Cells
					element={element}
				/>
				
				<div/>
			</div>
		);
	}
}

@observer
class Cells extends React.Component {
	render() {
		const {
			element
		} = this.props;
		
		return (
			<>
				{element.hydrated.map(cell => (
					<Cell
						{...cell}
					/>
				))}
			</>
		);
	}
}

@observer
class Cell extends React.Component {
	render() {
		const {
			value,
			element,
			column,
		} = this.props;
		
		if (!value && !column.showBlank) return <Row className={'cell'}/>;
		
		const Comp = column.cell || Cell_Default;
		const cellProps = $j.callIfFunc(column.cellProps, element.row);
		
		return (
			<Row className={'cell'}>
				<Comp
					value={value}
					row={element.row}
					column={column}
					{...cellProps}
				/>
			</Row>
		);
	}
}


@observer
class Cell_Default extends React.Component {
	render() {
		return (
			<Col shrink>
				{`${this.props.value}`}
			</Col>
		);
	}
}