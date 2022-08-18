import React from 'react';
import {observer} from 'mobx-react';
import {SimCard} from '../../../Bridge/misc/Card';
import {Col, Row, Txt} from '../../../Bridge/Bricks/bricksShaper';
import $j from '../../../Bridge/misc/$j';
import Butt from '../../../Bridge/Bricks/Butt';
import './CredReport.css';
import {Jewels} from '../../../stores/RootStore';
import SimpleEnterField from '../../../components/SimpleEnterField';
import {CredData} from '../../../datum/Credentialing/CredDatum';
import Linker from '../../../Bridge/Nav/Linker';
import {ProgressiveButt} from '../../../Bridge/misc/ProgressiveButt';
import thyme from '../../../Bridge/thyme';
import {DefFilter, DefFilterHeader, FilterSource} from '../../../misc/DefinitionClasses';
import type {DemandKey} from '../../../datum/Credentialing/DemandDef';
import {DemandDef} from '../../../datum/Credentialing/DemandDef';
import {SifterLabel} from '../../../Bridge/Sifter/SifterComponents';
import {MdCheck, MdCheckBox, MdCheckBoxOutlineBlank, MdEmail, MdPhone} from 'react-icons/md';
import {SimField} from '../../../components/SimField';
import {Tip} from '../../../Bridge/misc/Tooltip';
import {Icon} from '@material-ui/core';
import {CSVLink} from 'react-csv';
import {FaFileCsv, FaRegArrowAltCircleUp} from 'react-icons/fa';
import {toJS} from 'mobx';


@observer
export class CredReport extends React.Component {
	
	render() {
		const vCredReport = Jewels().vCredReport;
		
		return (
			<>
				
				<LoadControl/>
				
				{vCredReport.loader.hasLoaded && (
					<>
						
						<Controls/>
						<Grid/>
					
					</>
				)}
			
			
			</>
		);
	}
}

@observer
class LoadControl extends React.Component {
	render() {
		const vCredReport = Jewels().vCredReport;
		
		const lastLoaded = vCredReport.lastLoaded;
		
		const label = lastLoaded
			? `Last Loaded: ${thyme.nice.time.short(lastLoaded)}`
			: 'Load Data';
		
		const tip = lastLoaded
			? 'Load Again'
			: 'This might take 10+ seconds';
		
		return (
			<ProgressiveButt
				loader={vCredReport.loader}
				on={vCredReport.Load}
				label={label}
				secondary
				tooltip={tip}
				h={lastLoaded ? undefined : 60}
				labelSize={lastLoaded ? undefined : `24px`}
			/>
		);
	}
}


@observer
class Controls extends React.Component {
	// TODO: break this up
	render() {
		const vCredReport = Jewels().vCredReport;
		const demandSource: FilterSource<DemandKey, DemandDef> = vCredReport.demandFilterSource;
		const tagSource = vCredReport.tagFilterSource;
		const specSource = vCredReport.specFilterSource;
		
		return (
			<>
				
				<SimCard>
					
					<Row
						maxHeight={600}
					>
						<Col wrap grow={2}>
							
							<DefFilterHeader
								source={demandSource}
								label={'Demands'}
							/>
							
							{demandSource.all.map((state: DefState) => (
								<DefFilter
									key={state.def.key}
									state={state}
								/>
							))}
							
							<Row h={12}/>
							
							<SimpleEnterField
								on={vCredReport.CopyFromCompanyDemands}
								icon={FaRegArrowAltCircleUp}
								label={'Copy from Company ID'}
								description={`This will lookup the demands from a Company ID and select them.`}
								mini
							/>
						</Col>
						
						<Col grow wrap marL={12}>
							
							<DefFilterHeader
								source={tagSource}
								label={'Tags'}
							/>
							
							{tagSource.all.map((state: DefState) => (
								<DefFilter
									key={state.def.key}
									state={state}
								/>
							))}
							
							<Row h={12}/>
							
							<RateFilters/>
						</Col>
						
						<Col grow wrap>
							
							<DefFilterHeader
								source={specSource}
								label={'Specialties'}
							/>
							
							{specSource.all.map((state: DefState) => (
								<DefFilter
									key={state.def.key}
									state={state}
								/>
							))}
						</Col>
					</Row>
					
					<Row marT={16} childS>
						
						<SimField
							label={'Search Name'}
							onChange={vCredReport.SetTerpSearchInput}
						/>
						
						<Row marB={8} childS>
							
							<Txt
								marL={24}
							>Showing {vCredReport.terpsShown} of {vCredReport.terpsTotal}</Txt>
							
							<Col w={24}/>
							
							{vCredReport.sifter.filterList.map(filter => (
								<SifterLabel
									key={filter.key}
									sifter={vCredReport.sifter}
									filter={filter}
									marL={24}
								/>
							))}
						</Row>
						
						<Col grow/>
						
						<CsvButton/>
					
					</Row>
				
				</SimCard>
			</>
		);
	}
}


@observer
class Grid extends React.Component {
	render() {
		const vCredReport = Jewels().vCredReport;
		
		let columnCount = 4; // email, phone, name, stat
		
		columnCount += vCredReport.demandFilterSource.shownCount;
		columnCount += vCredReport.tagFilterSource.shownCount;
		columnCount += vCredReport.specFilterSource.shownCount;
		
		if (vCredReport.rateDay) columnCount += 1;
		if (vCredReport.rateEw) columnCount += 1;
		if (vCredReport.rateDb) columnCount += 1;
		if (vCredReport.rateLegal) columnCount += 1;
		if (vCredReport.rateEr) columnCount += 1;
		if (vCredReport.rateMhc) columnCount += 1;
		if (vCredReport.rateVri) columnCount += 1;
		
		const template = $j.stringMultiply('max-content ', columnCount);
		
		return (
			<SimCard>
				<div
					className={'credReport'}
					style={{
						display: 'grid',
						gridTemplateColumns: template,
						maxHeight: 800,
						maxWidth: 1280,
						overflow: 'auto',
					}}
				>
					
					<Headers/>
					<Rows/>
				
				</div>
			</SimCard>
		);
	}
}

@observer
class Headers extends React.Component {
	render() {
		const vCredReport = Jewels().vCredReport;
		const demandSource = vCredReport.demandFilterSource;
		const tagSource = vCredReport.tagFilterSource;
		const specSource = vCredReport.specFilterSource;
		
		return (
			<div className={'credReport_header'}>
				<div className={'headerName'}/>
				<div className={'headerName'}/>
				<div className={'headerName'}/>
				<div className={'headerName'}/>
				
				{vCredReport.rateDay && <ColumnHeaderPlain label={'Day Rate'}/>}
				{vCredReport.rateEw && <ColumnHeaderPlain label={'Ew Rate'}/>}
				{vCredReport.rateDb && <ColumnHeaderPlain label={'Db Rate'}/>}
				{vCredReport.rateLegal && <ColumnHeaderPlain label={'Legal Rate'}/>}
				{vCredReport.rateEr && <ColumnHeaderPlain label={'Er Rate'}/>}
				{vCredReport.rateMhc && <ColumnHeaderPlain label={'Mhc Rate'}/>}
				{vCredReport.rateVri && <ColumnHeaderPlain label={'Vri Rate'}/>}
				
				{demandSource.shown.map((state: DefState) => (
					<ColumnHeader
						key={state.def.key}
						state={state}
					/>
				))}
				
				{tagSource.shown.map((state: DefState) => (
					<ColumnHeader
						key={state.def.key}
						state={state}
					/>
				))}
				
				{specSource.shown.map((state: DefState) => (
					<ColumnHeader
						key={state.def.key}
						state={state}
					/>
				))}
			</div>
		);
	}
}

@observer
class ColumnHeader extends React.Component {
	render() {
		const {
			state,
		} = this.props;
		
		return (
			<div className={'headerName'}>
				<Txt
					size={12}
					sideways
					b
				>
					{$j.trunc(state.def.label, 20)}
				</Txt>
			</div>
		);
	}
}

@observer
class ColumnHeaderPlain extends React.Component {
	render() {
		const {
			label,
		} = this.props;
		
		return (
			<div className={'headerName'}>
				<Txt
					size={12}
					sideways
					b
				>
					{$j.trunc(label, 20)}
				</Txt>
			</div>
		);
	}
}

@observer
class Rows extends React.Component {
	render() {
		const vCredReport = Jewels().vCredReport;
		
		return (
			<>
				{vCredReport.rows.map(row => (
					<CredDataRow
						key={row.credData.key}
						row={row}
					/>
				))}
			</>
		);
	}
}

@observer
class CredDataRow extends React.Component {
	render() {
		const row = this.props.row;
		
		let className = row.show
			? 'credReport_row'
			: 'credReport_row hidden';
		
		return (
			<div className={className}>
				<Cells row={row}/>
			</div>
		);
	}
}

@observer
class Cells extends React.Component {
	render() {
		const vCredReport = Jewels().vCredReport;
		const row = this.props.row;
		const credData: CredData = row.credData;
		const demandSource = vCredReport.demandFilterSource;
		const tagSource = vCredReport.tagFilterSource;
		const specSource = vCredReport.specFilterSource;
		
		return (
			<>
				
				<IconLink
					icon={MdEmail}
					value={credData.terp.email}
					href={`mailto:${credData.terp.email}`}
				/>
				
				<IconLink
					icon={MdPhone}
					value={credData.terp.phone}
					href={`tel:${credData.terp.phone}`}
				/>
				
				<TerpRowTitle credData={credData}/>
				
				<TerpStat row={row}/>
				
				{vCredReport.rateDay && <TerpRate value={credData.terp.rateDay}/>}
				{vCredReport.rateEw && <TerpRate value={credData.terp.rateEw}/>}
				{vCredReport.rateDb && <TerpRate value={credData.terp.rateDb}/>}
				{vCredReport.rateLegal && <TerpRate value={credData.terp.rateLegal}/>}
				{vCredReport.rateEr && <TerpRate value={credData.terp.rateEr}/>}
				{vCredReport.rateMhc && <TerpRate value={credData.terp.rateMhc}/>}
				{vCredReport.rateVri && <TerpRate value={credData.terp.rateVri}/>}
				
				
				{demandSource.shown.map(colState => (
					<DemandDatumCell
						key={`${credData.key}_${colState.def.key}`}
						credData={credData}
						demandKey={colState.def.key}
					/>
				))}
				
				{tagSource.shown.map(colState => (
					<OtherDatumCell
						key={`${credData.key}_${colState.def.key}`}
						lup={credData.terp.tags}
						entryKey={colState.def.key}
					/>
				))}
				
				{specSource.shown.map(colState => (
					<OtherDatumCell
						key={`${credData.key}_${colState.def.key}`}
						lup={credData.terp.specs}
						entryKey={colState.def.key}
					/>
				))}
			</>
		);
	}
}

@observer
class DemandDatumCell extends React.Component {
	render() {
		const credData: CredData = this.props.credData;
		const demandKey = this.props.demandKey;
		
		const status = credData.GetDemandStatus(demandKey);
		
		const Icon = status.icon;
		
		const className = `credReport_cell status ${status.key}`;
		
		return (
			<div className={className}>
				{Icon && <Icon/>}
			</div>
		);
	}
}

@observer
class OtherDatumCell extends React.Component {
	render() {
		const {
			lup,
			entryKey,
		} = this.props;
		
		const has = lup.Has(entryKey);
		const Icon = has ? MdCheck : undefined;
		const className = `credReport_cell status other ${has ? 'HAS' : ''}`;
		
		return (
			<div className={className}>
				{Icon && <Icon/>}
			</div>
		);
	}
}

@observer
class TerpRowTitle extends React.Component {
	render() {
		const credData: CredData = this.props.credData;
		const terp = credData.terp;
		
		return (
			<div className={`credReport_cell terp`}>
				<Linker
					toKey={'terp'}
					params={{terpId: credData.terpId}}
				>
					<p className={'terpName'}>{terp.firstName} {terp.lastName}</p>
				</Linker>
			</div>
		);
	}
}

@observer
class IconLink extends React.Component {
	render() {
		const {
			icon,
			value,
			href
		} = this.props;
		
		const Icon = icon;
		
		return (
			<div className={`credReport_cell status iconLink`}>
				{value && (
					<a href={href} target={'_blank'}>
						<Tip text={value}>
							<Icon/>
						</Tip>
					</a>
				)}
			</div>
		);
	}
}

@observer
class TerpStat extends React.Component {
	render() {
		const {row} = this.props;
		return (
			<div className={`credReport_cell terpStat ${row.stat === 0 ? 'good' : 'missing'}`}>
				<p>{row.stat}</p>
			</div>
		);
	}
}

@observer
class TerpRate extends React.Component {
	render() {
		const {value} = this.props;
		return (
			<div className={`credReport_cell terpRate`}>
				<p>{value}</p>
			</div>
		);
	}
}

@observer
class CsvButton extends React.Component {
	render() {
		const vCredReport = Jewels().vCredReport;
		
		const csv = toJS(vCredReport.csv);
		
		return (
			<CSVLink
				{...csv}
				target={'_blank'}
			>
				<Butt
					icon={FaFileCsv}
					primary
					tooltip={[
						'Download CSV (spreadsheet file)',
						'Uses abbreviations:',
						'V: verified',
						'P: pending',
						'E: expired',
						'C: checklisted',
						'Y: yes has tag or specialty',
						'-: none/missing',
					]}
				/>
			</CSVLink>
		);
	}
}

@observer
class RateFilters extends React.Component {
	render() {
		
		return (
			<>
				<Row
					onClick={() => Jewels().vCredReport.ToggleAllRates()}
					marB={4}
					childV
				>
					<Txt
						size={16}
						marR={4}
						noSelect
						smallCaps
					>Rates</Txt>
				</Row>
				
				<RateFilter label={'Day'} rateKey={'rateDay'}/>
				<RateFilter label={'Ew'} rateKey={'rateEw'}/>
				<RateFilter label={'Db'} rateKey={'rateDb'}/>
				<RateFilter label={'Legal'} rateKey={'rateLegal'}/>
				<RateFilter label={'Er'} rateKey={'rateEr'}/>
				<RateFilter label={'Mhc'} rateKey={'rateMhc'}/>
				<RateFilter label={'Vri'} rateKey={'rateVri'}/>
			</>
		)
	}
}

@observer
class RateFilter extends React.Component {
	render() {
		const label = this.props.label;
		const rateKey = this.props.rateKey;
		const isChecked = Jewels().vCredReport[rateKey];
		const CheckIcon = isChecked ? MdCheckBox : MdCheckBoxOutlineBlank;
		
		return (
			<Row
				onClick={() => Jewels().vCredReport.ToggleRate(rateKey)}
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
				>{label}</Txt>
			</Row>
		)
	}
}