import React from 'react';
import {observer} from 'mobx-react';
import {Jewels, Staches} from 'stores/RootStore';
import Butt from '../../../Bridge/Bricks/Butt';
import {MdAddBox as Icon_Create} from 'react-icons/md';
import Linker from '../../../Bridge/Nav/Linker';

@observer
export class CreateJobButton extends React.Component {
	render() {
		
		return (
			<Linker toKey={'job'} params={{jobId: 'new', tab: 'details'}}>
				
				<Butt
					// on={() =}
					label={'New Job'}
					icon={Icon_Create}
					mar={4}
					subtle
					custom={{
						// background: '#86ad00',
						background: '#3c4350',
						hover: '#6a8c00',
						active: '#9bbf41',
						// label: '#fff',
					}}
					iconHue={'#fff'}
					labelHue={'#fff'}
					// labelSize={16}
					padding={'8px 0px 8px 0px'}
				/>
			</Linker>
		)
	}
}