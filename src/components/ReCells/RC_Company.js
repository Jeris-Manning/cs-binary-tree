import React from 'react';
import {Col, Row, Txt} from '../../Bridge/Bricks/bricksShaper';
import {ReColumn, T_FnSort} from '../../Bridge/ReTable/ReColumn';
import {T_RowDat} from '../../Bridge/ReTable/ReTable';
import {computed} from 'mobx';
import {DeafDat} from '../../datum/stache/DeafDat';
import styled from 'styled-components';
import {Clutch} from '../../Bridge/DockClient/Stache';
import {Staches} from '../../stores/RootStore';
import {observer} from 'mobx-react';
import Linker from '../../Bridge/Nav/Linker';
import $j from '../../Bridge/misc/$j';
import {CompanyDat} from '../../datum/stache/CompanyDat';
import type {CompanyId} from '../../datum/stache/CompanyDat';
import {Tip} from '../../Bridge/misc/Tooltip';

type Props = {
	column: ReColumn,
	dat: any,
	value: CompanyId,
	cell: {},
}

const FnSort: T_FnSort = (a: T_RowDat, b: T_RowDat, column: ReColumn) => {
	const cCompany = Staches().cCompany;
	// these *should* be loaded by the renderer
	const aLabel = cCompany.GetOrStub(a[column.accessor], true).label;
	const bLabel = cCompany.GetOrStub(b[column.accessor], true).label;
	
	const _a = String(aLabel || '').toLowerCase();
	const _b = String(bLabel || '').toLowerCase();
	if (_a < _b) return -column.sortDirection;
	if (_a > _b) return column.sortDirection;
	return 0;
};

@observer
export class RC_Company extends React.Component<Props> {
	
	static COLUMN = (config: ReColumn | Props): ReColumn => new ReColumn(config, RC_Company, FnSort);
	
	@computed get dat(): CompanyDat {
		let companyId = this.props.value;
		return Staches().cCompany.GetOrStub(companyId).dat;
	}
	
	render() {
		const companyId = this.props.value;
		const cell = this.props.cell;
		
		if (!companyId) return <div/>;
		
		const label = $j.trunc(this.dat.label, 24);
		const tooltip = this.dat.label;
		
		return (
			<Linker
				toKey={'company'}
				params={{companyId: companyId, tab: 'edit'}}
			>
				<Row fill childCenterV>
					<Tip text={tooltip}>
						<Txt
							size={12}
						>{label}</Txt>
					</Tip>
				</Row>
			</Linker>
		);
	}
}