import React, {Component} from 'react';
import {Row, Txt} from '../../Bricks/bricksShaper';
import {observer} from 'mobx-react';
import {Jewels, Router, Staches} from 'stores/RootStore';
import {computed} from 'mobx';
import Linker from '../../Nav/Linker';

@observer
export default class Cell_Terp extends React.Component {
	render() {
		const {
			value,
			column,
		} = this.props;
		
		const terp = Staches().cTerp.GetOrStub(value, true, 'Cell_Terp').dat;
		const propText = terp[column.terpProp || 'label'] || '?';
		
		return (
			<Row fill childCenterV>
				<Linker
					to={Router().routes.terp}
					params={{
						terpId: value,
					}}
				>
					<Txt
						size={column.size}
						b={column.bold}
						marR={5}
					>
						{propText}
					</Txt>
				</Linker>
			</Row>
		);
	}
}