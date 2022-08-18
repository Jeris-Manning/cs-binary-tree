import React from 'react';
import {Col, Row} from '../../Bridge/Bricks/bricksShaper';
import {ReColumn, T_FnSort} from '../../Bridge/ReTable/ReColumn';
import {T_RowDat} from '../../Bridge/ReTable/ReTable';
import {computed} from 'mobx';
import {DEAF_CATEGORIES, DeafDat} from '../../datum/stache/DeafDat';
import styled from 'styled-components';
import {Clutch} from '../../Bridge/DockClient/Stache';
import {Staches} from '../../stores/RootStore';
import {observer} from 'mobx-react';

type Props = {
	column: ReColumn,
	dat: any,
	value: Clutch<DeafDat>[],
	cell: {
		style: any, // see: Txt
	},
}

const FnSort: T_FnSort = (a: T_RowDat, b: T_RowDat, column: ReColumn) => {
	return 0;
};

@observer
export class RC_DeafArray extends React.Component<Props> {
	
	static COLUMN = (config: ReColumn | Props): ReColumn => new ReColumn(config, RC_DeafArray, FnSort);
	
	@computed get dats(): DeafDat[] {
		const clutches = Staches().cDeaf
			.GetMulti(this.props.value || [], true, 'RC_DeafArray');
		return (clutches || []).map(c => c.dat);
	}
	
	render() {
		if (!this.dats.length) return <div/>;
		
		return (
			<Col fill childCenterV>
				{this.dats.map(deaf => (
					<DeafLabel
						key={deaf.key}
						label={deaf.label}
						categoryIds={deaf.categoryIds}
						hashtags={deaf.hashtags}
					/>
				))}
			</Col>
		);
	}
}


const Text = styled.div`
  font-size: 12px;
`;
const CatText = styled.div`
  font-size: 11px;
  font-family: "Roboto Mono", monospace;
  font-weight: bolder;
  text-decoration: underline double;
`;

@observer
class DeafLabel extends React.Component {
	render() {
		const label: string = this.props.label;
		const categoryIds: number[] = this.props.categoryIds;
		// const hashtags: string[] = this.props.hashtags;
		// hashtags.join(' ')
		
		const categories = (categoryIds || [])
			.map(id => DEAF_CATEGORIES[id])
			.join(' ');
		
		return (
			<Text>{label}<CatText>{categories}</CatText></Text>
		);
	}
}