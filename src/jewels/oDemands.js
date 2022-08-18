import {action, computed, observable, runInAction} from 'mobx';
import $j, {vow} from '../Bridge/misc/$j';
import {WiseGem} from '../Bridge/jewelerClient/WiseGem';
import {Staches} from '../stores/RootStore';
import {BaseJewel} from './BaseJewel';


export default class oDemands extends BaseJewel {
	
	gems = {
		getDemands: new WiseGem(),
		getCompanyDemands: new WiseGem(),
		getAllCompanyDemands: new WiseGem(),
	};
	
	@action GetAllDemands = async () => this.gems.getDemands.Get();
	@action GetCompanyDemands = async (companyId) => this.gems.getCompanyDemands.Get({companyId: companyId});
	@action GetAllCompanyDemands = async () => this.gems.getAllCompanyDemands.Get();
	
	// id
	// name
	// category
	// notes
	
	@observable demands = [];
	@observable categories = [];
	
	@action LoadDemands = async () => {
		const demands =
			await this.GetAllDemands();
		
		runInAction(() => {
			this.demands = demands.sort($j.sort.alphabetic('name'));
			this.categories = $j.convertToArrayLookup(demands, 'category');
		});
	};
	
	@observable allDemands = {};
	@observable allCompanies = {};
	@observable allCompanyDemandList = [];
	@observable demandColumns = ['2'];
	@observable showCompaniesWithDemand = true;
	@observable pageNumber = 0;
	
	@action LoadAllCompanyDemands = async () => {
		const [[allDemands, companyDemands], error] = await vow([
			this.GetAllDemands(),
			this.GetAllCompanyDemands(),
		]);
		
		if (error) throw new Error(error);
		
		runInAction(() => {
			this.allDemands = $j.convertToLookup(allDemands, 'demandId');
			this.allCompanies = $j.convertToLookup(companyDemands.companies, 'companyId')
			
			const allCompanyDemandList = [];
			
			companyDemands.prefs.forEach(({companyId, demandIds}) => {
				const company = this.allCompanies[companyId];
				
				if (company) {
					allCompanyDemandList.push({
						...company,
						name: company.name || `${companyId}`,
						demandIds: demandIds,
					});
				}
			});
			
			this.allCompanyDemandList = allCompanyDemandList.slice().sort($j.sort.alphabetic('name'));
			console.log(`allCompanyDemands:`, this.allCompanyDemandList);
			
			this.SetPage(this.pageNumber);
		});
	};
	
	@computed get companyRows() {
		if (!this.showCompaniesWithDemand) return this.allCompanyDemandList;
		return this.allCompanyDemandList.filter(row =>
			row.demandIds.some(id => this.demandColumns.includes(`${id}`))
		);
	}
	
	companiesPerPage = 50;
	
	@computed get companyRowsPaged() {
		const current = this.pageNumber * this.companiesPerPage;
		return this.companyRows.slice(current, current + this.companiesPerPage);
	}
	
	@computed get pageCount() {
		return Math.ceil(this.companyRows.length / this.companiesPerPage) - 1;
	}
	
	@action ClearDemands = () => this.demandColumns = [];
	
	@action SetShowDemand = (demandId, show) => {
		if (show) {
			this.demandColumns.push(`${demandId}`);
		} else {
			this.demandColumns = this.demandColumns.filter(d => d !== `${demandId}`);
		}
		this.SetPage(this.pageNumber);
	}
	
	@action SetPage = (page) => {
		if (page < 0) page = 0;
		if (page > this.pageCount) page = this.pageCount;
		this.pageNumber = page;
	}
	
	@action ToggleShowCompaniesWithDemand = () => {
		this.showCompaniesWithDemand = !this.showCompaniesWithDemand;
		this.SetPage(this.pageNumber);
	}
}