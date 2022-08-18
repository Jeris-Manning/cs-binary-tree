import {action, computed, observable, runInAction} from 'mobx';
import {Jewels} from '../../stores/RootStore';
import {Loader} from '../../Bridge/misc/Loader';
import {ContactUpdata} from '../../datum/ContactUpdata';
import {vow} from '../../Bridge/misc/$j';
import thyme from '../../Bridge/thyme';
import {BaseJewel} from '../BaseJewel';

export class vContact extends BaseJewel {
	
	_GetContact = (contactId) => Jewels().company.GetContact(contactId);
	_SaveContact = (contactId, changes) => Jewels().company.SaveContact(contactId, changes);
	_CreateContact = (companyId) => Jewels().company.CreateContact(companyId);
	
	@observable updata = new ContactUpdata({});
	@observable loader = new Loader();
	@observable error = '';
	
	@action Load = async (contactId) => {
		console.log(`vContact.Load: ${contactId}`);
		
		this.loader.Start();
		this.error = '';
		
		const [contact, error] = await vow(
			this._GetContact(contactId),
		);
		
		runInAction(() => {
			if (error) {
				this.error = JSON.stringify(error);
				this.loader.Error(error);
				return;
			}
			
			this.updata = new ContactUpdata(contact);
			this.loader.Done();
		});
	};
	
	@computed get canSave() {
		if (!this.updata.contactId.value) return false;
		if (this.loader.isLoading) return false;
		return this.updata.hasChanged && this.updata.isValid;
	}
	
	@computed get saveTooltip() {
		if (!this.updata.isValid) return [
			'ERROR',
			...this.updata.errors.map(u => `${u.key}: ${u.error}`)
		];
		if (this.canSave) return 'Save (Ctrl+S)';
		return 'No changes';
	}
	
	@action Save = async () => {
		if (!this.canSave) return;
		
		this.loader.Start();
		this.error = '';
		
		let contactId = this.updata.contactId.value;
		const companyId = this.updata.companyId.value;
		const changes = this.updata.GetChanges();
		
		changes.companyId = companyId;
		
		if (contactId === 'NEW') {
			const [newContactId, creationError] = await vow(
				this._CreateContact(companyId)
			);
			
			if (creationError) {
				this.error = JSON.stringify(creationError);
				this.loader.Error(error);
				return;
			}
			
			this.updata.contactId.Change(newContactId);
			this.updata.createdAt.Change(thyme.now());
			this.updata.updatedAt.Change(thyme.now());
			this.updata.updatedBy.Change('you');
			contactId = newContactId;
		}
		
		const [_, error] = await vow(
			this._SaveContact(contactId, changes),
		);
		
		if (error) {
			this.error = JSON.stringify(error);
			this.loader.Error(error);
			return;
		}
		
		this.updata.Apply();
		this.loader.Done();
	};
	
	@action Revert = () => this.updata.Revert();
	
	
	/* MODAL */
	
	@observable isModalOpen = false;
	afterModalSave;
	
	@action OpenModal = (contactId, companyId, afterSave) => {
		console.log(`Open Contact Modal: ${contactId} of ${companyId}`);
		
		this.isModalOpen = true;
		this.afterModalSave = afterSave;
		
		if (contactId && contactId !== 'NEW')
			return this.Load(contactId); // TODO: untested
		
		this.error = '';
		this.updata = new ContactUpdata({
			contactId: 'NEW',
			companyId: companyId,
			active: true,
			createdAt: thyme.now(),
			updatedAt: thyme.now(),
			updatedBy: 'you',
		});
	};
	
	@action CancelModal = () => {
		this.isModalOpen = false;
	};
	
	@action SaveModal = async () => {
		await this.Save();
		
		if (this.error) return;
		
		runInAction(() => {
			this.isModalOpen = false;
			if (this.afterModalSave) this.afterModalSave(this.updata);
		});
	};
}