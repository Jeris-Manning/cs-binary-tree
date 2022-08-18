import React from 'react';
import {observer} from 'mobx-react';
import {Row, Txt} from '../Bricks/bricksShaper';
import {Tip} from './Tooltip';

/**
 *  label, value, rowStyle, labelStyle, valueStyle, tooltip
 */
@observer
export class SimpKvpLabel extends React.Component {
	render() {
		const {
			label,
			value,
			rowStyle,
			labelStyle,
			valueStyle,
			tooltip,
		} = this.props;
		
		return (
			<Row
				childS
				marB={4}
				{...rowStyle}
			>
				<Txt
					marR={6}
					size={14}
					hue={'#404040'}
					{...labelStyle}
				>
					{label}:
				</Txt>
				
				<Tip text={tooltip}>
					
					<Txt
						b
						size={18}
						{...valueStyle}
					>
						{value}
					</Txt>
				
				</Tip>
			</Row>
		);
	}
}