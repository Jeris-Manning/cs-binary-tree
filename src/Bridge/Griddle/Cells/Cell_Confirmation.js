import React from 'react';
import {observer} from 'mobx-react';
import {Ico} from '../../Bricks/Ico';
import {Tip} from '../../misc/Tooltip';
import {Col, Row} from '../../Bricks/bricksShaper';
import {IoMdCheckmarkCircleOutline} from 'react-icons/io';
import {FiCircle} from 'react-icons/fi';
import thyme from '../../thyme';

@observer
export class Cell_Confirmation extends React.Component {
	render() {
		const {
			column,
			value,
		} = this.props;
		
		// MARK.render(this, `value`, value);
		
		const tooltip = value
			? `${column.confirmType} confirmation sent ${thyme.nice.dateTime.short(value)}`
			: `${column.confirmType} confirmation has NOT been sent.`;
		
		return (
			<Col childC>
				<Tip text={tooltip}>
					<Row>
						<Ico
							icon={column.icon}
							size={column.iconSize || 18}
							hue={column.iconHue}
						/>
						<Ico
							icon={value ? IoMdCheckmarkCircleOutline : FiCircle}
							hue={value ? '#2c8700' : '#900505'}
							size={column.iconSize || 18}
						/>
					</Row>
				</Tip>
			</Col>
		);
	}
}