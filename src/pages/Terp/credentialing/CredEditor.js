import React from 'react';
import {observer} from 'mobx-react';
import {Jewels} from 'stores/RootStore';
import {SimCard} from '../../../Bridge/misc/Card';
import {action, computed, observable, runInAction} from 'mobx';
import Formula from '../../../Bridge/Bricks/Formula/Formula';
import Fieldula from '../../../Bridge/Bricks/Formula/Fieldula';
import SimpleEnterField from '../../../components/SimpleEnterField';
import {MdEdit, MdSave} from 'react-icons/md';
import Butt from '../../../Bridge/Bricks/Butt';
import MiniField from '../../../components/MiniField';
import {Col, Txt} from '../../../Bridge/Bricks/bricksShaper';
import $j from '../../../Bridge/misc/$j';

@observer
export class CredEditor extends React.Component {
	
	@observable editorForm = new Formula({
		fields: {
			credId: new Fieldula({
				label: 'Credential ID',
				description: '',
				disabled: true,
			}),
			name: new Fieldula({
				label: 'Name',
				description: '',
			}),
			importantInfo: new Fieldula({
				label: 'Important Info',
				description: 'Bolded and important text',
				multiline: true,
			}),
			description: new Fieldula({
				label: 'Description',
				description: '',
				multiline: true,
			}),
			tooltip: new Fieldula({
				label: 'Tooltip',
				description: 'aka a hover bubble :)',
				multiline: true,
			}),
		}
	});
	
	@computed get credChoices() {
		const oCreds = Jewels().credentials;
		const allCreds = oCreds.allCreds;
		return Object.values(allCreds).map(cred => ({
			value: cred,
			label: cred.name,
		})).sort($j.sort.alphabetic('label'));
	}
	
	@observable credLoaded = null;
	
	@action Load = (cred) => {
		const oCreds = Jewels().credentials;
		this.credLoaded = oCreds.allCreds[cred.credId];
		this.editorForm.Import(this.credLoaded);
	};
	
	@action Save = async () => {
		const oCreds = Jewels().credentials;
		
		let newCred = {...this.credLoaded};
		
		Object.values(this.editorForm.fields).forEach(field => {
			newCred[field.id] = field.value;
		});
		
		await oCreds.PostCredEdit(newCred);
		
		runInAction(() => {
			this.credLoaded = null;
			this.editorForm.Clear();
		});
		
	};
	
	render() {
		
		return (
			<>
				<Col grow childCenterH>
					<Txt
						size={'2.4rem'}
						// marR={8}
					>
						Credential Editor
					</Txt>
				</Col>
				
				<SimCard padH={12} w={400}>
					<SimpleEnterField
						on={entry => this.Load(entry.value)}
						label={'Load Credential'}
						icon={MdEdit}
						usePicker
						choices={this.credChoices}
						tooltip={'Load Credential'}
					/>
				</SimCard>
				
				<SimCard padH={12} w={600}>
					{Object.values(this.editorForm.fields).map(field => (
						<MiniField
							key={field.id}
							field={field}
						/>
					))}
					
					<Butt
						on={this.Save}
						icon={MdSave}
						label={'Save'}
						secondary
						alert={'Saving...'}
						alertAfter={'Saved!'}
						disabled={!this.credLoaded}
					/>
				</SimCard>
			</>
		);
	}
}