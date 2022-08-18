import {observer} from 'mobx-react';
import React from 'react';
import {Col, Row, Txt} from '../Bridge/Bricks/bricksShaper';
import Butt from '../Bridge/Bricks/Butt';
import {MdCheckBox, MdCheckBoxOutlineBlank} from 'react-icons/md';
import {Tip} from '../Bridge/misc/Tooltip';

@observer
export class CheckboxField extends React.Component {
	render() {
		const {
			field,
			onToggle,
		} = this.props;
		
		const {
			label,
			isSelected,
			formatted,
			value,
			tooltip,
		} = field || this.props;
		
		return (
			<Row
				childV
				marB={4}
			>
				<Butt
					on={onToggle}
					subtle
					mini
					icon={isSelected ? MdCheckBox : MdCheckBoxOutlineBlank}
					iconHue={'#575757'}
				/>
				
				<Col w={100}>
					<Txt
						marR={6}
						size={12}
						hue={'#404040'}
						b
					>{label}:</Txt>
				</Col>
				
				<Col grow shrink>
					<Tip text={tooltip}>
						<Txt
							size={12}
							shrink
						>{formatted || value}</Txt>
					</Tip>
				</Col>
			</Row>
		);
	}
}