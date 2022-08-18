import {observer} from 'mobx-react';
import {Jewels, Staches} from 'stores/RootStore';
import React from 'react';
import $j from '../../../Bridge/misc/$j';
import {SimCard} from '../../../Bridge/misc/Card';
import {Col, Row, Txt} from '../../../Bridge/Bricks/bricksShaper';
import Linker from '../../../Bridge/Nav/Linker';
import './CompanyDemandList.css';
import {FaCheck} from 'react-icons/fa';
import Butt from '../../../Bridge/Bricks/Butt';
import {
	MdChevronLeft,
	MdChevronRight,
	MdFirstPage,
	MdLastPage,
	MdLayersClear,
	MdRefresh
} from 'react-icons/md';
import {MiniConfig} from '../../../components/ToggleRow';
import {computed} from 'mobx';
import {CompanyDat} from '../../../datum/stache/CompanyDat';

@observer
export class CompanyDemandList extends React.Component {
	render() {
		return (
			<>
				<Controls/>
				<Grid/>
				<Pagination/>
			</>
		);
	}
}

@observer
class Controls extends React.Component {
	render() {
		const oDemands = Jewels().demands;
		
		return (
			<>
				<SimCard>
					
					<Col wrap maxHeight={175}>
						{Object.values(oDemands.allDemands).slice().sort($j.sort.alphabetic('name')).map(demand => (
							<MiniConfig
								key={`cred_${demand.demandId}`}
								label={demand.name}
								isChecked={oDemands.demandColumns.includes(`${demand.demandId}`)}
								onToggle={(val) => oDemands.SetShowDemand(demand.demandId, val)}
							/>
						))}
					</Col>
					
					<Row marT={36} childV>
						<Butt
							on={oDemands.ClearDemands}
							icon={MdLayersClear}
							iconHue={'#575757'}
							iconSize={14}
							subtle
							mini
							tooltip={'Clear Selection'}
							marR={24}
						/>
						
						<MiniConfig
							label={'Only Show Companies With Demand'}
							isChecked={oDemands.showCompaniesWithDemand}
							onToggle={oDemands.ToggleShowCompaniesWithDemand}
						/>
						
						<Col w={50}/>
						
						<Pagination/>
						
						<Butt
							on={oDemands.LoadAllCompanyDemands}
							icon={MdRefresh}
							primary
							marL={24}
							label={`Refresh`}
							subtle
						/>
					</Row>
				</SimCard>
			</>
		);
	}
}

@observer
class Grid extends React.Component {
	render() {
		const oDemands = Jewels().demands;
		
		const demandColumns = oDemands.demandColumns;
		const columnTemplate = 'max-content ' + demandColumns.map(c => 'max-content').join(' ') + ' max-content';
		
		return (
			<SimCard>
				<div
					className={'credData'}
					style={{
						display: 'grid',
						gridTemplateColumns: columnTemplate,
						// maxHeight: 900,
						maxWidth: 1280,
						// overflow: 'auto',
					}}
				>
					
					<div className={'credData_header'}>
						<div className={'headerName'}/>
						
						{demandColumns.map(demandId => (
							<ColumnHeader
								key={demandId}
								demandId={demandId}
							/>
						))}
						
						<div className={'headerEndCap'}/>
					</div>
					
					{oDemands.companyRowsPaged.map(company => (
						<CompanyRow
							key={company.companyId}
							company={company}
							columns={demandColumns}
						/>
					))}
				</div>
			</SimCard>
		);
	}
}

@observer
class Pagination extends React.Component {
	render() {
		const oDemands = Jewels().demands;
		
		const pageNumber = oDemands.pageNumber;
		const pageCount = oDemands.pageCount;
		
		return (
			<Row childV>
				<Butt
					on={() => oDemands.SetPage(0)}
					icon={MdFirstPage}
					subtle
					mini
				/>
				
				<Butt
					on={() => oDemands.SetPage(pageNumber - 1)}
					icon={MdChevronLeft}
					subtle
					mini
					marL={8}
				/>
				
				<Txt
					marH={8}
					b
				>{pageNumber} / {pageCount}</Txt>
				
				<Butt
					on={() => oDemands.SetPage(pageNumber + 1)}
					icon={MdChevronRight}
					subtle
					mini
				/>
				
				<Butt
					on={() => oDemands.SetPage(pageCount)}
					icon={MdLastPage}
					subtle
					mini
					marL={8}
				/>
			</Row>
		);
	}
}

@observer
class ColumnHeader extends React.Component {
	render() {
		const {demandId} = this.props;
		const demand = Jewels().demands.allDemands[demandId];
		const name = demand ? demand.name : `?${demandId}`;
		
		return (
			<div className={'headerName'}>
				<Txt
					size={12}
					sideways
					b
				>
					{$j.trunc(name, 20)}
				</Txt>
			</div>
		);
	}
}

@observer
class CompanyRow extends React.Component {
	render() {
		const {
			company,
			columns,
		} = this.props;
		
		return (
			<div
				className={'credData_row'}
			>
				<div className={`credData_cell company`}>
					<Linker
						toKey={'company'}
						params={{companyId: company.companyId, tab: 'edit'}}
					>
						<Txt
							size={14}
							ellipsis
							w={200}
						>{company.name}</Txt>
					</Linker>
				</div>
				
				{columns.map(demandId => (
					<Cell
						key={`${company.companyId}_${demandId}`}
						hasDemand={company.demandIds.some(d => d == demandId)}
					/>
				))}
				
				<div/>
			</div>
		);
	}
}

@observer
class Cell extends React.Component {
	render() {
		return this.props.hasDemand
			? (
				<div className={`credData_cell status VERIFIED`}>
					<FaCheck
						color={'#000'}
						className={'statusIcon'}
						size={12}
					/>
				</div>
			) : (
				<div className={`credData_cell status NONE`}/>
			);
	}
}