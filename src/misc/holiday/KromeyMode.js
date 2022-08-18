import React from 'react';
import {Col, Row} from '../../Bridge/Bricks/bricksShaper';
import {action, observable} from 'mobx';
import {$m} from '../../Bridge/misc/$m';
import Butt from '../../Bridge/Bricks/Butt';
import {MdCheckBox, MdCheckBoxOutlineBlank} from 'react-icons/md';
import {observer} from 'mobx-react';

@observer
export class KromeyMode extends React.Component {
	
	timeout;
	@observable isChecked: boolean = true;
	
	@action Check = () => {
		clearTimeout(this.timeout);
		
		this.isChecked = true;
	}
	
	@action Uncheck = () => {
		clearTimeout(this.timeout);
		
		this.isChecked = false;
		this.timeout = setTimeout(this.Check, $m.random.Int([2, 40]) * 1000);
	}
	
	@action Toggle = () => {
		(this.isChecked ? this.Uncheck : this.Check)();
	}
	
	render() {
		
		return (
			<Col
				marT={20}
				marH={8}
			>
				<Row childC>
					<Butt
						on={this.Toggle}
						icon={this.isChecked ? MdCheckBox : MdCheckBoxOutlineBlank}
						label={`Kromey Mode`}
						danger
						noHoliday
						labelSize={14}
						padding={'8px 8px'}
					/>
				</Row>
			</Col>
		)
	}
}