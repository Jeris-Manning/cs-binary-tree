import React from 'react';
import {observer} from 'mobx-react';
import {Ico} from '../../Bricks/Ico';
import {Tip} from '../../misc/Tooltip';
import {Col} from '../../Bricks/bricksShaper';

@observer
export class Cell_IconTooltip extends React.Component {
	render() {
		const {
			column,
			value,
		} = this.props;
		
		// if (!value) return <Col/>;
		
		const icon = column.GetIcon ? column.GetIcon(value) : column.icon;
		
		const tooltip = column.tooltip ? column.tooltip :
			column.prefix
				? `${column.prefix} ${value}`
				: value;
		
		return (
			<Col childC>
				<Tip text={tooltip}>
					<Ico
						icon={icon}
						size={column.iconSize || 26}
						hue={column.iconHue}
					/>
				</Tip>
			</Col>
		);
	}
}