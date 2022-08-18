import {observer} from 'mobx-react';
import {Jewels} from 'stores/RootStore';
import React from 'react';
import PopModal from '../../../components/PopModal';
import {Col, Row, Txt} from '../../../Bridge/Bricks/bricksShaper';
import {UpField} from '../../../Bridge/misc/UpField';
import Butt from '../../../Bridge/Bricks/Butt';
import {MdPersonAdd} from 'react-icons/md';
import ToggleButton from '../../../components/ToggleButton';
import {Hokey} from '../../../misc/Hotkeys';
import {vDeafEditor} from '../../../jewels/variance/vDeafEditor';
import {DeafUpdata} from '../../../datum/DeafUpdata';
import {SelectorField} from '../../../Bridge/misc/SelectorField';

@observer
export class JobDeafEditor extends React.Component {
	render() {
		const vDeafEditor: vDeafEditor = Jewels().vDeafEditor;
		const isVisible = vDeafEditor.isVisible;
		
		return (
			<PopModal
				isOpen={isVisible}
				onClose={vDeafEditor.HideEditor}
				blocker
			>
				<Layout/>
			</PopModal>
		);
	}
}

@observer
class Layout extends React.Component {
	render() {
		return (
			<>
				<TopControls/>
				
				<Row h={24}/>
				
				<DeafFields/>
				
				<Row h={40}/>
				
				<BottomControls/>
			</>
		);
	}
}

@observer
class TopControls extends React.Component {
	render() {
		const vDeafEditor: vDeafEditor = Jewels().vDeafEditor;
		const deafUp: DeafUpdata = vDeafEditor.deafUp;
		
		return (
			<>
				
				<Row marT={12}>
					
					<Butt
						on={vDeafEditor.ChangeDeafEditNew}
						icon={MdPersonAdd}
						subtle
						tooltip={'Create New Deaf Profile'}
						marR={12}
					/>
					
					<SelectorField
						state={vDeafEditor.selectedDeaf}
						choices={Jewels().vDeafLists.activeDeafNames}
						Change={vDeafEditor.ChangeDeafEditExisting}
						placeholder={'Find Existing Deaf Profile'}
						w={300}
						hideOutline
					/>
				</Row>
				
				<Txt size={20} marV={12}>
					{deafUp.deafId.value ? `Edit Deaf Profile #${deafUp.deafId.value}` : 'Create Deaf Profile'}
				</Txt>
			
			</>
		
		);
	}
}

@observer
class DeafFields extends React.Component {
	render() {
		const vDeafEditor: vDeafEditor = Jewels().vDeafEditor;
		const deafUp: DeafUpdata = vDeafEditor.deafUp;
		
		return (
			
			<Col marH={20} w={700}>
				
				<Row marT={12}>
					<UpField
						label={'First Name'}
						state={deafUp.firstName}
						// tabi={tabi + 1}
						marR={12}
					/>
					
					<UpField
						label={'Last Name'}
						state={deafUp.lastName}
						// tabi={tabi + 2}
					/>
					
					<Col grow/>
					
					<ToggleButton
						primary
						label={'Active'}
						isChecked={deafUp.active.value}
						on={deafUp.active.Toggle}
						subtle
					/>
				
				</Row>
				
				<Row marT={12}>
					<UpField
						label={'Date of Birth'}
						state={deafUp.dob}
						// tabi={tabi + 3}
						marR={12}
					/>
					
					<UpField
						label={'Email'}
						state={deafUp.email}
						// tabi={tabi + 3}
						w={300}
					/>
				</Row>
				
				<UpField
					label={'Notes from Deaf Profile'}
					description={'Can be seen and edited by the deaf person'}
					state={deafUp.notesDeafProfile}
					multiline
					marT={12}
					h={140}
					// tabi={tabi + 4}
				/>
				
				<UpField
					label={'Notes for Interpreter'}
					// description={'Can be seen by the interpreter'}
					state={deafUp.notesForTerp}
					multiline
					marT={12}
					h={140}
					// tabi={tabi + 4}
				/>
				
				<UpField
					label={'Notes for Staff'}
					description={'Supports #hashtags, e.g. #SEE #NOTES'}
					state={deafUp.notesForStaff}
					multiline
					marT={12}
					h={140}
					// tabi={tabi + 4}
				/>
			
			</Col>
		);
	}
}

@observer
class BottomControls extends React.Component {
	render() {
		const vDeafEditor: vDeafEditor = Jewels().vDeafEditor;
		const deafUp: DeafUpdata = vDeafEditor.deafUp;
		
		return (
			<Row h={60} marH={40} marT={20} marB={20}>
				<Butt
					on={vDeafEditor.HideEditor}
					label={'Cancel'}
					danger
				/>
				
				<Col minWidth={40} grow/>
				
				<Hokey save={vDeafEditor.SaveDeafEditor}/>
				
				<Butt
					on={vDeafEditor.SaveDeafEditor}
					secondary
					label={deafUp.deafId.value ? 'Save & Add' : 'Create'}
					w={200}
					tooltip={'Save (Ctrl+S)'}
				/>
			</Row>
		);
	}
}
