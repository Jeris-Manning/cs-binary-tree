import React from 'react';
import {observer} from 'mobx-react';
import {action} from 'mobx';
import {Jewels, Router} from '../../stores/RootStore';
import {SimCard} from '../../Bridge/misc/Card';
import {Row, Txt} from '../../Bridge/Bricks/bricksShaper';
import {MdAddCircleOutline, MdSearch} from 'react-icons/md';
import Butt from '../../Bridge/Bricks/Butt';
import Linker from '../../Bridge/Nav/Linker';

@observer
export class CompanyContacts extends React.Component {
	
	@action CreateContact = async () => {
		const vCompany = Jewels().vCompany;
		
		if (!vCompany.companyId) return;
		
		const contactId =
			await vCompany.CreateContact(vCompany.companyId);
		
		return Router().Navigate('contact', {contactId: contactId});
	};
	
	render() {
		const vCompany = Jewels().vCompany;
		
		return (
			<SimCard
				header={'Contacts'}
				{...this.props}
			>
				
				{vCompany.contacts.map(contact => (
					<ContactRow
						key={contact.contactId}
						contact={contact}
					>
					
					</ContactRow>
				))}
				
				<Butt
					on={this.CreateContact}
					marT={16}
					secondary
					icon={MdAddCircleOutline}
					label={'Add'}
				/>
			
			</SimCard>
		);
	}
}

@observer
class ContactRow extends React.Component {
	render() {
		const {
			contact
		} = this.props;
		
		return (
			<Linker
				toKey={'contact'}
				params={{contactId: contact.contactId}}
			>
				<Row
					marB={4}
				>
					
					<Butt
						toKey={'contact'}
						params={{contactId: contact.contactId}}
						icon={MdSearch}
						iconSize={14}
						mini
						subtle
					/>
					
					<Txt
						marL={6}
						hue={contact.active ? '#000' : '#b30707'}
						lineThrough={!contact.active}
					>{`${contact.firstName} ${contact.lastName}`}</Txt>
				</Row>
			</Linker>
		);
	}
}