import React, {Component} from 'react';
import {Row, Txt} from '../../Bricks/bricksShaper';
import {observer} from 'mobx-react';
import {Col} from '../../Bricks/bricksShaper';
import {Tip} from '../../misc/Tooltip';


const STATUS_CHOICES_DEPRECATED = {
	1: {
		label: 'Pending',
		b: true,
	},
	2: {
		label: 'Filled',
	},
	3: {
		label: 'SEARCH',
		b: true,
		// hueBg: '#f1e9cb'
	},
	4: {
		label: 'Paid',
		b: true,
	},
	5: {
		label: 'BIDDING',
		b: true,
	},
	6: {
		label: 'FOLLOWUP',
		b: true,
	},
	7: {
		label: 'Company',
		b: true,
		hueBg: '#e4dff5'
	},
	8: {
		label: 'Contact',
		b: true,
		hueBg: '#e4dff5'
	},
	9: {
		label: 'Cancel',
		b: true,
		hueBg: '#e5adad'
	},
	10: {
		label: 'SUB',
		b: true,
	},
};

@observer
export class Cell_JobStatus extends React.Component {
	
	render() {
		if (!this.props.value) return <Row/>;
		
		const tooltip = `${this.props.row.billType}<br/>isCancelled: ${this.props.row.isCancelled}`;
		const entry = STATUS_CHOICES_DEPRECATED[this.props.value];
		
		return (
			<Tip text={tooltip}>
				<Col
					fill
					childC
				>
					<Row
						hue={entry.hueBg}
						pad={4}
					>
						<Txt
							size={12}
							b={entry.b}
						>{entry.label}</Txt>
					</Row>
				</Col>
			</Tip>
		);
	}
}