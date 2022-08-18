import RequestGem_DEPRECATED from '../Bridge/jewelerClient/RequestGem_DEPRECATED';
import $j, {vow} from '../Bridge/misc/$j';
import {WiseGem} from '../Bridge/jewelerClient/WiseGem';
import thyme from '../Bridge/thyme';
import {toJS} from 'mobx';
import {Router} from '../stores/RootStore';
import {BaseJewel} from './BaseJewel';

export default class oCompany extends BaseJewel {
	gems = {
		getDemands: new RequestGem_DEPRECATED({}), // TODO remove
		
		getCompany: new WiseGem('companyId'),
		saveCompany: new WiseGem('companyId'),
		createCompany: new WiseGem('companyName'),
		
		getContacts: new WiseGem('companyId'),
		getContact: new WiseGem('contactId'),
		saveContact: new WiseGem('contactId'),
		createContact: new WiseGem('companyId'),
		
		getCompaniesBy: new WiseGem('by'),
	};
	
	/* COMPANY */
	
	GetCompany = async (companyId) => {
		const [company, error] = await vow(
			this.gems.getCompany.Get({companyId: companyId})
		);
		
		if (error) throw new Error(error);
		if (!company) throw new Error(`Company ${companyId} doesn't exist`);
		
		return thyme.fast.obj.unpack(company);
	};
	
	SaveCompany = async (companyId, changes) => {
		const [_, error] = await vow(
			this.gems.saveCompany.Post({
				companyId: companyId,
				changes: changes,
			})
		);
		
		if (error) throw new Error(error);
	};
	
	CreateCompany = async (companyName) => {
		const result =
			await this.gems.createCompany.Post({companyName: companyName});
		return result.companyId;
	};
	
	/* CONTACTS */
	
	GetContacts = async (companyId) => {
		const [contacts, error] = await vow(
			this.gems.getContacts.Get({companyId: companyId})
		);
		
		if (error) throw new Error(error);
		if (!contacts) throw new Error(`Company ${companyId} doesn't exist`);
		
		return thyme.fast.array.unpack(contacts);
	};
	
	GetContact = async (contactId) => {
		const [contact, error] = await vow(
			this.gems.getContact.Get({contactId: contactId})
		);
		
		if (error) throw new Error(error);
		if (!contact) throw new Error(`Contact ${contactId} doesn't exist`);
		
		return thyme.fast.obj.unpack(contact);
	};
	
	SaveContact = async (contactId, changes) => {
		const [_, error] = await vow(
			this.gems.saveContact.Post({
				contactId: contactId,
				changes: changes,
			})
		);
		
		if (error) throw new Error(error);
	};
	
	CreateContact = async (companyId) => {
		const result =
			await this.gems.createContact.Post({companyId: companyId});
		return result.contactId;
	};
	
	GetCompaniesBy = (params) => {
		return this.gems.getCompaniesBy.Get(params);
	};
	
	GetCompaniesByIds = (companyIds) => {
		if (!companyIds || !companyIds.length) return;
		return this.GetCompaniesBy({
			by: 'companyIds',
			companyIds: toJS(companyIds),
		});
	};
	
	MakeCompanyList = (entry) => {
		const ids = $j.extract.numbers(entry);
		Router().Navigate('companyList', {companyIds: ids.join('-')});
	}
}