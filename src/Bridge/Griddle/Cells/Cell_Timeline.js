import React, {Component} from 'react';
import {Row, Txt} from '../../Bricks/bricksShaper';
import {observer} from 'mobx-react';
import {Jewels, Staches} from 'stores/RootStore';
import {SimCard} from '../../misc/Card';
import Butt from '../../Bricks/Butt';
import {Col} from '../../Bricks/bricksShaper';
import {Tip} from '../../misc/Tooltip';
import {Ico} from '../../Bricks/Ico';
import {computed} from 'mobx';


@observer
export class Cell_Timeline extends React.Component {
	render() {
		const column = this.props.column;
		
		return (
			<Row fill childC>
				<Butt
					on={this.props.onClick}
					icon={column.icon}
					iconSize={column.iconSize || 26}
					iconHue={column.iconHue}
					subtle
					secondary
					// tooltip={(
					// 	<Card padH={20}>
					// 		{(this.props.value || []).map((entry, dex) => (
					// 			<HistoryRow
					// 				key={`${this.props.row.key}_${dex}`}
					// 				value={entry}
					// 			/>
					// 		))}
					// 	</Card>
					// )}
				/>
			</Row>
		);
	}
}


// @observer
// export class HistoryRow extends React.Component {
// 	render() {
//
// 		return (
// 			<Row marB={4} wrap>
// 				<Txt
// 					hue={'#444444'}
// 					b
// 					left
// 					marR={6}
// 					shrink
// 				>
// 					{timestamp}
// 				</Txt>
// 				<Txt
// 					hue={'#444444'}
// 					left
// 					shrink
// 				>
// 					{note}
// 				</Txt>
// 			</Row>
// 		);
// 	}
// }

@observer
export class Cell_TimelineNotes extends React.Component {
	
	@computed get notes() {
		return this.props.value.record.data
			.filter(d => d.type === 'note');
	}
	
	render() {
		const {
			column,
			value,
			row,
		} = this.props;
		
		const onClick = column.onClick;
		const staff = Staches().cStaffByEmail.GetOrStub(row.by, true, 'Cell_TimelineNotes').dat;
		
		if (!this.notes || !this.notes.length) {
			return (
				<Col
					fill
					childC
					onClick={() => onClick(row)}
				>
					<Ico
						icon={column.icon}
						size={column.iconSize || 26}
						hue={'#b6b6b6'}
					/>
				</Col>
			);
		}
		
		// MARK.render(this, 'notes', this.notes);
		
		return (
			<Col
				fill
				childC
				onClick={() => onClick(row)}
			>
				<Tip text={(
					<SimCard>
						{this.notes.map(row => (
							<Row key={row.at}>
								<Txt
									marR={2}
									b
									hue={'#000'}
									left
								>
									{staff.label}:
								</Txt>
								
								<Txt
									marB={4}
									hue={'#000'}
									left
								>
									{row.datum.note}
								</Txt>
							</Row>
						))}
					</SimCard>
				)}>
					<Ico
						icon={column.icon}
						size={column.iconSize || 26}
						hue={column.iconHue}
					/>
				</Tip>
			</Col>
		);
	}
}