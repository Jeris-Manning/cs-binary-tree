import {observer} from 'mobx-react';
import {Jewels, Staches} from 'stores/RootStore';
import React from 'react';
import {computed} from 'mobx';
import PopModal from '../../../components/PopModal';
import {Col, Txt} from '../../../Bridge/Bricks/bricksShaper';
import {SearchBox} from '../../../components/Goomap';
import {Row} from '../../../Bridge/Bricks/bricksShaper';
import {UpField, UpKvpLabel} from '../../../Bridge/misc/UpField';
import Butt from '../../../Bridge/Bricks/Butt';
import {UpFieldSelect_DEPRECATED} from '../../../Bridge/misc/UpFieldSelect_DEPRECATED';
import {Hokey} from '../../../misc/Hotkeys';

export const TIME_ZONES = {
	'America/Chicago': 'Central (Minnesota)',
	'America/Los_Angeles': 'Pacific',
	'America/Phoenix': 'Arizona',
	'America/Denver': 'Mountain',
	'America/New_York': 'Eastern',
};

@observer
export class LocationEditor extends React.Component {
	
	render() {
		const {
			isOpen,
			onClose,
		} = this.props;
		
		const oLocation = Jewels().location;
		const locUp = oLocation.locUpstate;
		
		return (
			<PopModal
				isOpen={isOpen}
				onClose={onClose}
				blocker
			>
				<Col marH={20} w={800} h={800}>
					<Txt size={20} marV={12}>
						{locUp.locationId.value ? 'Edit Location' : 'Create Location'}
					</Txt>
					
					<SearchBox
						id={'locationEditorSearch'}
						onSelected={locUp.Select}
					/>
					
					<Row h={24}/>
					
					<Row>
						
						<Col grow>
							
							<UpField
								label={'Short Name'}
								description={'A shorter label used on Starfish and the interpreter app'}
								state={locUp.shortName}
							/>
							
							<UpField
								label={'Directions'}
								description={'Notes for the Interpreter'}
								state={locUp.directions}
								multiline
								marT={8}
								h={100}
							/>
							
							<UpField
								label={'Full Address'}
								state={locUp.formatted}
								marT={8}
								multiline
								minHeight={120}
							/>
							
							{locUp.formatted.hasChanged ? (
								<UpKvpLabel
									label={'Old'}
									value={locUp.formatted.oldValue}
									marT={4}
									minHeight={30}
								/>
							) : (
								<Row h={38}/>
							)}
							
							<UpFieldSelect_DEPRECATED
								label={'Time Zone'}
								state={locUp.timeZone}
								choices={TIME_ZONES}
								grow
								h={45}
								size={18}
								w={250}
								marR={16}
							/>
						
						
						</Col>
						
						<Col w={40}/>
						
						<Col w={260}>
							<Txt
								hue={'#3c3c3c'}
								caps
								marB={8}
								marR={3}
								size={12}
							>
								Raw Location Data
							</Txt>
							
							<UpKvpLabel state={locUp.locationId}/>
							<UpKvpLabel state={locUp.lat}/>
							<UpKvpLabel state={locUp.lng}/>
							<UpKvpLabel state={locUp.mapped}/>
							<UpKvpLabel state={locUp.streetNumber}/>
							<UpKvpLabel state={locUp.street}/>
							<UpKvpLabel state={locUp.locality}/>
							<UpKvpLabel state={locUp.state}/>
							<UpKvpLabel state={locUp.zip}/>
							<UpKvpLabel state={locUp.placeId}/>
							<UpKvpLabel state={locUp.locationName}/>
							<UpKvpLabel
								marT={6}
								label={'RTG Address'}
								state={locUp.address}
							/>
							
							<UpField
								label={'City Override'}
								description={'Only change this in special circumstances'}
								state={locUp.locality}
								marT={6}
							/>
							
							<UpField
								marT={6}
								label={'Terp Region'}
								description={[
									'Enter ID to override region (TODO: make dropdown)',
									'',
									'Metro: 1',
									'Central: 2',
									'North East: 3',
									'North West: 4',
									'North Dakota: 4',
									'Southern: 5',
									'Wyoming: 6',
									'VRI Primary: 7',
									'Wisconsin: 8',
									'UNKNOWN: 404',
								]}
								state={locUp.terpRegion}
							/>
						</Col>
					
					</Row>
					
					
					<Row minHeight={40} grow/>
					
					<Row h={60} marH={40} marT={20} marB={20}>
						<Butt
							on={onClose}
							label={'Cancel'}
							danger
						/>
						
						<Col minWidth={40} grow/>
						
						<Hokey save={oLocation.SaveLocEditor}/>
						
						<Butt
							on={oLocation.SaveLocEditor}
							secondary
							label={'Save'}
							w={200}
							loading={oLocation.isSaving}
							tooltip={'Save (Ctrl+S)'}
							enabled={locUp.hasChanged}
						/>
					</Row>
				
				</Col>
			</PopModal>
		);
	}
}

