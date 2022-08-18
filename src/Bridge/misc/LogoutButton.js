import {observer} from 'mobx-react';
import React from 'react';
import {FaDoorOpen} from 'react-icons/fa';
import Butt from '../Bricks/Butt';
import {Root} from '../../stores/RootStore';

@observer
export class LogoutButton extends React.Component {
	render() {
		return (
			<Butt
				on={Root().Logout}
				label={'Log Out'}
				labelSize={14}
				labelHue={'#BDBDBD'}
				textTransform={'none'}
				
				icon={FaDoorOpen}
				iconSize={14}
				iconHue={'#BDBDBD'}
				
				danger
				subtle
				mini
				
				h={20}
			/>
		)
	}
}