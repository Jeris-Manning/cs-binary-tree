import React from 'react';
import {observer} from 'mobx-react';
import {Jewels, Staches} from 'stores/RootStore';
import {Col} from '../../Bricks/bricksShaper';
import {StaffAvatar} from '../../../components/Avatar';

@observer
export class Cell_StaffAvatar extends React.Component {
	
	render() {
		const {
			value,
		} = this.props;
		
		if (!value) return <Col/>;
		
		const staff = Staches().cStaffByName.GetOrStub(value, true, 'Cell_StaffAvatar').dat;
		
		return (
			<Col childC>
				<StaffAvatar
					staff={staff}
					backup={value}
				/>
			</Col>
		);
	}
}