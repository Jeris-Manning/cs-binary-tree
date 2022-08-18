import React from 'react';
import {Row, Txt} from '../../Bridge/Bricks/bricksShaper';
import {ReColumn, T_FnSort} from '../../Bridge/ReTable/ReColumn';
import {T_RowDat} from '../../Bridge/ReTable/ReTable';
import {computed} from 'mobx';
import {Staches} from '../../stores/RootStore';
import {observer} from 'mobx-react';
import $j from '../../Bridge/misc/$j';
import type {StaffEmail, StaffId} from '../../datum/stache/StaffDat';
import {StaffDat} from '../../datum/stache/StaffDat';
import {Tip} from '../../Bridge/misc/Tooltip';
import {StaffAvatar} from '../Avatar';
import {Clutch} from '../../Bridge/DockClient/Stache';

type Props = {
	column: ReColumn,
	dat: any,
	value: StaffId|StaffEmail,
	cell: {
		useEmail?: boolean,
	},
}

const FnSort: T_FnSort = (a: T_RowDat, b: T_RowDat, column: ReColumn) => {
	const cStaff = Staches().cStaffByName;
	// these *should* be loaded by the renderer
	const aLabel = cStaff.GetOrStub(a[column.accessor], true, 'RC_Staff.FnSort').label;
	const bLabel = cStaff.GetOrStub(b[column.accessor], true, 'RC_Staff.FnSort').label;
	
	const _a = String(aLabel || '').toLowerCase();
	const _b = String(bLabel || '').toLowerCase();
	if (_a < _b) return -column.sortDirection;
	if (_a > _b) return column.sortDirection;
	return 0;
};

@observer
export class RC_Staff extends React.Component<Props> {
	
	static COLUMN = (config: ReColumn | Props): ReColumn => new ReColumn(config, RC_Staff, FnSort);
	
	@computed get clutch(): Clutch<StaffDat> {
		let staff = this.props.value;
		const cell = this.props.cell;
		const stache = cell.useEmail ? Staches().cStaffByName : Staches().cStaffById;
		return stache.GetOrStub(staff, true, 'RC_Staff');
	}
	
	render() {
		// TODO: this is untested
		
		
		
		const staff = this.props.value;
		const cell = this.props.cell;
		
		if (!staff) return <div/>;
		
		const dat = this.clutch.dat;
		
		const label = $j.trunc(dat.label, 24);
		const tooltip = dat.label;
		
		
		return (
			<Tip text={tooltip}>
				<Row fill childCenterV>
					
					<StaffAvatar
						staff={dat}
						backup={staff}
					/>
					
					<Txt
						size={12}
					>{label + dat.internalName}</Txt>
				</Row>
			</Tip>
		);
	}
}