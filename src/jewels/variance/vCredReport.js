import {action, autorun, observable} from 'mobx';
import {ProgressiveLoader} from '../../Bridge/misc/Loader';
import $j, {vow} from '../../Bridge/misc/$j';
import thyme from '../../Bridge/thyme';
import {CredData, CredDataLup} from '../../datum/Credentialing/CredDatum';
import {Jewels} from '../../stores/RootStore';
import {DemandDef} from '../../datum/Credentialing/DemandDef';
import {CredDef} from '../../datum/Credentialing/CredDef';
import {TerpDef} from '../../datum/TerpDef';
import {DefLup, FilterSource} from '../../misc/DefinitionClasses';
import {Sifter} from '../../Bridge/Sifter/Sifter';
import type {SpecialtyKey} from '../../datum/TerpDef';
import type {TerpTagKey} from '../../datum/TerpTagDef';
import type {DemandKey} from '../../datum/stache/DemandDat';
import {TerpTagDef} from '../../datum/TerpTagDef';
import {SpecialtyDef} from '../../datum/SpecialtyDef';
import {BaseJewel} from '../BaseJewel';


export class vCredReport extends BaseJewel {
	
	_GetReportTerps = () => Jewels().credentials.GetReportTerps();
	_GetReportTerpExtra = () => Jewels().credentials.GetReportTerpExtra();
	_GetReportDemands = () => Jewels().credentials.GetReportDemands();
	_GetReportCreds = () => Jewels().credentials.GetReportCreds();
	_GetReportTerpCreds = () => Jewels().credentials.GetReportTerpCreds();
	_GetReportTags = () => Jewels().credentials.GetReportTags();
	_GetReportSpecialties = () => Jewels().credentials.GetReportSpecialties();
	_GetCompanyDemands = (companyId) => Jewels().demands.GetCompanyDemands(companyId);
	
	@observable loader = new ProgressiveLoader();
	@observable lastLoaded = '';
	
	@action Load = async () => {
		this.loader.Load(9, 'Get Terps');
		
		const terps = await this._GetReportTerps();
		
		this.loader.Next('Get Tags/Checklists');
		const extras = await this._GetReportTerpExtra();
		
		this.loader.Next('Get Demands');
		const demands = await this._GetReportDemands();
		
		this.loader.Next('Get Credentials');
		const creds = await this._GetReportCreds();
		
		this.loader.Next('Get Tag Info');
		const tagInfo = await this._GetReportTags();
		
		this.loader.Next('Get Specialty Info');
		const specInfo = await this._GetReportSpecialties();
		
		this.loader.Next('Get Terp Creds');
		const terpCreds = await this._GetReportTerpCreds();
		
		this.loader.Next('Processing');
		await $j.frame();
		this.ProcessData({terps, extras, demands, creds, tagInfo, specInfo, terpCreds});
		
		this.loader.Next('Rendering');
		await $j.frame();
		
		this.loader.Done('Done');
		
		this.lastLoaded = thyme.now();
	};
	
	
	@observable terpLup: DefLup<TerpKey, TerpDef>;
	@observable demandLup: DefLup<DemandKey, DemandDef>;
	@observable credLup: DefLup<CredKey, CredDef>;
	@observable credDataLup: CredDataLup;
	@observable tagLup: DefLup<TerpTagKey, TerpTagDef>;
	@observable specLup: DefLup<SpecialtyKey, SpecialtyDef>;
	
	@observable demandFilterSource: FilterSource<DemandKey, DemandDef>;
	@observable tagFilterSource: FilterSource<TerpTagKey, TerpTagDef>;
	@observable rateFilterSource: FilterSource<TerpTagKey, TerpTagDef>;
	@observable specFilterSource: FilterSource<SpecialtyKey, SpecialtyDef>;
	@observable sifter: Sifter;
	@observable terpSearchInput: string = '';
	@observable terpsShown = 0;
	@observable terpsTotal = 0;
	
	@observable rateDay: boolean = false;
	@observable rateEw: boolean = false;
	@observable rateDb: boolean = false;
	@observable rateLegal: boolean = false;
	@observable rateEr: boolean = false;
	@observable rateMhc: boolean = false;
	@observable rateVri: boolean = false;
	
	@action ProcessData = (data) => {
		const {
			terps,
			extras, // {terpId, tags, checklist, specialties}
			demands,
			creds,
			tagInfo,
			specInfo,
			terpCreds,
		} = data;
		
		const terpLup: DefLup<TerpKey, TerpDef> = new DefLup(TerpDef.MakeKey, TerpDef.MakeDef, terps);
		const demandLup: DefLup<DemandKey, DemandDef> = new DefLup(DemandDef.MakeKey, DemandDef.MakeDef, demands);
		const credLup: DefLup<CredKey, CredDef> = new DefLup(CredDef.MakeKey, CredDef.MakeDef, creds);
		const tagLup: DefLup<TerpTagKey, TerpTagDef> = new DefLup(TerpTagDef.MakeKey, TerpTagDef.MakeDef, tagInfo);
		const specLup: DefLup<SpecialtyKey, SpecialtyDef> = new DefLup(SpecialtyDef.MakeKey, SpecialtyDef.MakeDef, specInfo);
		
		const credDataLup = CredDataLup.Make(terpLup, credLup, terpCreds);
		credDataLup.ApplyDemandLup(demandLup);
		
		for (const row of extras) {
			const credData = credDataLup.lup.get(TerpDef.MakeKey(row.terpId));
			if (!credData) continue;
			
			credData.ApplyChecklist(row.checklist || []);
			
			if (row.tags)
				row.tags.forEach(tagId => credData.terp.AddTag(tagLup.GetWithId(tagId)));
			
			if (row.specialties)
				row.specialties.forEach(specId => credData.terp.AddSpec(specLup.GetWithId(specId)));
		}
		
		this.terpLup = terpLup;
		this.demandLup = demandLup;
		this.credLup = credLup;
		this.credDataLup = credDataLup;
		this.tagLup = tagLup;
		this.specLup = specLup;
		
		this.demandFilterSource = new FilterSource(demandLup, 'label', false);
		this.tagFilterSource = new FilterSource(tagLup, 'label', false);
		this.specFilterSource = new FilterSource(specLup, 'label', false);
		
		this.sifter = new Sifter(this.sifterDef);
		
		const sorter = $j.sort.alphabetic();
		const sortVal = (row) => `${row.credData.terp.lastName} ${row.credData.terp.firstName}`;
		
		this.rows = credDataLup.all.map(credData => ({
			show: true,
			meetsDemands: false,
			hasCount: 0,
			credData: credData,
			stat: 0,
		})).sort((a, b) => sorter(sortVal(a), sortVal(b)));
		
		this.terpsTotal = this.rows.length
		
		this.SetFilterDefaults();
	};
	
	@action SetTerpSearchInput = (val) => this.terpSearchInput = val;
	
	@action SetFilterDefaults = () => {
		this.demandFilterSource.SetShow(DemandDef.MakeKey(2));
		this.demandFilterSource.SetShow(DemandDef.MakeKey(3));
	};
	
	@action SetAllDemandsTo = (demandIds) => {
		this.demandFilterSource.HideAll();
		for (const demandId of demandIds) {
			this.demandFilterSource.SetShow(DemandDef.MakeKey(demandId));
		}
	}
	
	@action ToggleRate = (rateKey) => this[rateKey] = !this[rateKey];
	@action ToggleAllRates = () => {
		const to = !this.rateDay;
		this.rateDay = to;
		this.rateEw = to;
		this.rateDb = to;
		this.rateLegal = to;
		this.rateEr = to;
		this.rateMhc = to;
		this.rateVri = to;
	};
	
	@observable rows: dataRow[] = [];
	
	runRowCalculation = autorun(() => {
		if (!this.loader.hasLoaded) return;
		
		const checkSearch = this.terpSearchInput.length >= 3;
		const columnCount = this.demandFilterSource.shownCount;
		let terpsShown = 0;
		
		for (const row of this.rows) {
			
			const hasCount = this.CalculateHasCount(row.credData);
			const meetsDemands = hasCount === columnCount;
			
			if (meetsDemands !== row.meetsDemands) row.meetsDemands = meetsDemands;
			if (hasCount !== row.hasCount) row.hasCount = hasCount;
			
			const hasTags = this.CheckHasTags(row.credData);
			if (hasTags !== row.hasTags) row.hasTags = hasTags;
			
			const hasSpecs = this.CheckHasSpecs(row.credData);
			if (hasSpecs !== row.hasSpecs) row.hasSpecs = hasSpecs;
			
			const sifterAllow = this.sifter.filterList.every(f => f.Allowed(row));
			const searchAllow = !checkSearch
				|| $j.findInSearchString(this.terpSearchInput, row.credData.terp.searchString);
			
			const show = searchAllow && sifterAllow;
			if (row.show !== show) row.show = show;
			
			if (show) terpsShown++;
			
			const stat = columnCount - hasCount;
			if (row.stat !== stat) row.stat = stat;
		}
		
		this.terpsShown = terpsShown;
		
	}, {delay: 200});
	
	sifterDef = {
		meetsDemands: {
			label: 'Meets Demands',
			Check: row => row.meetsDemands,
		},
		hasTags: {
			label: 'Has Tags',
			Check: row => row.hasTags,
		},
		hasSpecs: {
			label: 'Has Specialties',
			Check: row => row.hasSpecs,
		},
		
	};
	
	CalculateHasCount = (credData: CredData) => {
		let count = 0;
		this.demandFilterSource.shown.forEach(defState => {
			if (credData.IsDemandVerified(defState.def)) count++;
		});
		return count;
	};
	
	CheckHasTags = (credData: CredData) => this.tagFilterSource.shown.every(t => credData.terp.tags.Has(t.def.key));
	CheckHasSpecs = (credData: CredData) => this.specFilterSource.shown.every(s => credData.terp.specs.Has(s.def.key));
	
	
	@observable csv = {
		headers: [],
		data: [],
		filename: '',
	};
	
	basicHeaders = [
		{key: 'terpId', label: 'Terp ID'},
		{key: 'name', label: 'Name'},
		{key: 'missing', label: 'Missing'},
		{key: 'email', label: 'Email'},
		{key: 'phone', label: 'Phone'},
	];
	
	runCsvCalculation = autorun(() => {
		if (!this.loader.hasLoaded) return;
		
		const shownCount = this.demandFilterSource.shownCount;
		
		let shownHeaders = [];
		
		const pushHeader = (defState) => {
			shownHeaders.push({
				key: defState.def.key,
				label: $j.trunc(defState.def.label, 20),
			});
		}
		
		this.demandFilterSource.shown.forEach(pushHeader);
		this.tagFilterSource.shown.forEach(pushHeader);
		this.specFilterSource.shown.forEach(pushHeader);
		
		if (this.rateDay) shownHeaders.push({key: 'rateDay', label: 'Day'});
		if (this.rateEw) shownHeaders.push({key: 'rateEw', label: 'Ew'});
		if (this.rateDb) shownHeaders.push({key: 'rateDb', label: 'Db'});
		if (this.rateLegal) shownHeaders.push({key: 'rateLegal', label: 'Legal'});
		if (this.rateEr) shownHeaders.push({key: 'rateEr', label: 'Er'});
		if (this.rateMhc) shownHeaders.push({key: 'rateMhc', label: 'Mhc'});
		if (this.rateVri) shownHeaders.push({key: 'rateVri', label: 'Vri'});
		
		let rows = [];
		
		for (const row of this.rows) {
			if (!row.show) continue;
			
			let statuses = {};
			
			for (const defState of this.demandFilterSource.shown) {
				statuses[defState.def.key] = row.credData.GetDemandStatusAbbrev(defState.def.key);
			}
			
			for (const defState of this.tagFilterSource.shown) {
				statuses[defState.def.key] = row.credData.terp.tags.Has(defState.def.key) ? 'Y' : '-';
			}
			
			for (const defState of this.specFilterSource.shown) {
				statuses[defState.def.key] = row.credData.terp.specs.Has(defState.def.key) ? 'Y' : '-';
			}
			
			if (this.rateDay) statuses.rateDay = row.credData.terp.rateDay;
			if (this.rateEw) statuses.rateEw = row.credData.terp.rateEw;
			if (this.rateDb) statuses.rateDb = row.credData.terp.rateDb;
			if (this.rateLegal) statuses.rateLegal = row.credData.terp.rateLegal;
			if (this.rateEr) statuses.rateEr = row.credData.terp.rateEr;
			if (this.rateMhc) statuses.rateMhc = row.credData.terp.rateMhc;
			if (this.rateVri) statuses.rateVri = row.credData.terp.rateVri;
			
			rows.push({
				terpId: row.credData.terp.terpId,
				name: `${row.credData.terp.firstName} ${row.credData.terp.lastName}`,
				missing: `${shownCount - row.hasCount}`,
				email: row.credData.terp.email || '',
				phone: row.credData.terp.phone || '',
				...statuses,
			});
		}
		
		this.csv.headers = [...this.basicHeaders, ...shownHeaders];
		this.csv.data = rows;
		this.csv.filename = `CredReport_${thyme.nice.date.fileName(thyme.today())}.csv`;
		
	}, {delay: 100});
	
	
	
	@action CopyFromCompanyDemands = async (companyId) => {
		if (!companyId) return;
		
		const [demandIds, error] = await vow(
			this._GetCompanyDemands(companyId)
		);
		
		if (error) throw new Error(error);
		
		console.log(`CopyFromCompanyDemands ${companyId} `, demandIds);
		
		this.SetAllDemandsTo(demandIds);
	}
	
}

type dataRow = {
	show: boolean,
	meetsDemands: boolean,
	hasTags: boolean,
	hasSpecs: boolean,
	hasCount: number,
	credData: CredData,
	stat: number,
};