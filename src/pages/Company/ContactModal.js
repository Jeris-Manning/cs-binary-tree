import {observer} from 'mobx-react';
import React from 'react';
import {action, computed, observable} from 'mobx';
import {Jewels, Staches} from '../../stores/RootStore';
import {Col, Row, Txt} from '../../Bridge/Bricks/bricksShaper';
import {SimCard} from '../../Bridge/misc/Card';
import {UpField} from '../../Bridge/misc/UpField';
import thyme from '../../Bridge/thyme';
import Linker from '../../Bridge/Nav/Linker';
import PopModal from '../../components/PopModal';
import Butt from '../../Bridge/Bricks/Butt';
import {Hokey} from '../../misc/Hotkeys';
import {ContactEditor} from './ContactPage';
import {MARK} from '../../Bridge/misc/$j';

@observer
export class ContactModal extends React.Component {
	render() {
		const vContact: vContact = Jewels().vContact;
		
		const contactId = vContact.updata.contactId.value;
		
		return (
			<PopModal
				isOpen={vContact.isModalOpen}
				onClose={vContact.CancelModal}
				blocker
			>
				
				<ContactModalEditor/>
				
				
				<Row h={40}/>
				
				<Row h={60} marH={40} marT={20} marB={20}>
					<Butt
						on={vContact.CancelModal}
						label={'Cancel'}
						danger
					/>
					
					<Col minWidth={40} grow/>
					
					<Hokey
						save={vContact.SaveModal}
						esc={vContact.CancelModal}
					/>
					
					<Butt
						on={vContact.SaveModal}
						primary={contactId === 'NEW'}
						secondary={contactId !== 'NEW'}
						label={contactId === 'NEW' ? 'Create' : 'Save'}
						w={200}
						// loading={oDeaf.isSaving}
						// enabled={updata.hasChanged}
						tooltip={`${contactId === 'NEW' ? 'Create' : 'Save'} (Ctrl+S)`}
					/>
				</Row>
			
			</PopModal>
		)
	}
}


@observer
class ContactModalEditor extends React.Component {
	render() {
		const vContact = Jewels().vContact;
		const updata = vContact.updata;
		
		
		return (
			<>
			
				<ContactEditor/>
			
			</>
		);
	}
}