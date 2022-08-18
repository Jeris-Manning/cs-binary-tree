import React from 'react';
import {Row, Txt} from '../../Bridge/Bricks/bricksShaper';
import {ReColumn, T_FnSort} from '../../Bridge/ReTable/ReColumn';
import {T_RowDat} from '../../Bridge/ReTable/ReTable';
import {computed} from 'mobx';
import {Staches} from '../../stores/RootStore';
import {observer} from 'mobx-react';
import Linker from '../../Bridge/Nav/Linker';
import $j from '../../Bridge/misc/$j';
import type {TerpId} from '../../datum/stache/TerpDat';
import {TerpDat} from '../../datum/stache/TerpDat';
import {Tip} from '../../Bridge/misc/Tooltip';
import {ChatTerpAvatar} from '../chat/ChatTerpAvatar';

type Props = {
	column: ReColumn,
	dat: any,
	value: TerpId,
	cell: {},
}

const FnSort: T_FnSort = (a: T_RowDat, b: T_RowDat, column: ReColumn) => {
	const cTerp = Staches().cTerp;
	// these *should* be loaded by the renderer
	const aLabel = cTerp.GetOrStub(a[column.accessor], true, 'RC_Terp.Sort').label;
	const bLabel = cTerp.GetOrStub(b[column.accessor], true, 'RC_Terp.Sort').label;
	
	const _a = String(aLabel || '').toLowerCase();
	const _b = String(bLabel || '').toLowerCase();
	if (_a < _b) return -column.sortDirection;
	if (_a > _b) return column.sortDirection;
	return 0;
};

@observer
export class RC_Terp extends React.Component<Props> {
	
	static COLUMN = (config: ReColumn | Props): ReColumn => new ReColumn(config, RC_Terp, FnSort);
	
	@computed get dat(): TerpDat {
		let terpId = this.props.value;
		return Staches().cTerp.GetOrStub(terpId, true, 'RC_Terp').dat;
	}
	
	render() {
		const terpId = this.props.value;
		const cell = this.props.cell;
		
		if (!terpId) return <div/>;
		
		const label = $j.trunc(this.dat.label, 24);
		
		return (
			<Linker
				toKey={'terp'}
				params={{terpId: terpId, tab: 'edit'}}
			>
				<Row fill childCenterV>
					
					<ChatTerpAvatar
						terpKey={terpId}
						firstName={this.dat.firstName}
						lastName={this.dat.lastName}
						isPreview
					/>
					
					<Txt
						marL={2}
						size={12}
					>{label}</Txt>
				</Row>
			</Linker>
		);
	}
}