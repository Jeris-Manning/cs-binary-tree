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
import {LocationDat} from '../../datum/stache/LocationDat';
import type {LocationId} from '../../datum/stache/LocationDat';
import {Tip} from '../../Bridge/misc/Tooltip';
import {JobDat} from '../../datum/stache/JobDat';
import {Ico} from '../../Bridge/Bricks/Ico';
import {FiVideo} from 'react-icons/fi';

type Props = {
	column: ReColumn,
	dat: JobDat,
	value: LocationId,
	cell: {
		showRegion?: boolean,
		trunc?: number,
	},
}

const FnSort: T_FnSort = (a: T_RowDat, b: T_RowDat, column: ReColumn) => {
	const cLocation = Staches().cLocation;
	// these *should* be loaded by the renderer
	const aLabel = cLocation.GetOrStub(a[column.accessor], true).label;
	const bLabel = cLocation.GetOrStub(b[column.accessor], true).label;
	
	const _a = String(aLabel || '').toLowerCase();
	const _b = String(bLabel || '').toLowerCase();
	if (_a < _b) return -column.sortDirection;
	if (_a > _b) return column.sortDirection;
	return 0;
};

@observer
export class RC_Location extends React.Component<Props> {
	
	static COLUMN = (config: ReColumn | Props): ReColumn => new ReColumn(config, RC_Location, FnSort);
	
	@computed get dat(): LocationDat {
		let locationId = this.props.value;
		return Staches().cLocation.GetOrStub(locationId, true).dat;
	}
	
	render() {
		const locationId = this.props.value;
		const cell = this.props.cell;
		const dat = this.props.dat;
		
		if (dat.vri) {
			return (
				<Row fill childCenterV>
					<Ico
						icon={FiVideo}
						marR={4}
					/>
					
					<Txt
						size={12}
					>VRI</Txt>
				</Row>
			);
		}
		
		if (!locationId) return <div/>;
		
		const label = $j.trunc(this.dat.label, cell.trunc);
		const tooltip = this.dat.label;
		
		const link = `https://maps.google.com/?q=${this.dat.address}`;
		const aStyle = {
			color: 'inherit',
			textDecoration: 'none'
		};
		
		return (
			<Tip text={tooltip}>
				<Row fill childCenterV>
					<a href={link} target="_blank" style={aStyle}>
						
						{cell.showRegion && (
							<Txt
								b
								size={12}
							>{this.dat.region.label}</Txt>
						)}
						
						<Txt
							size={12}
						>{label}</Txt>
					
					</a>
				</Row>
			</Tip>
		);
	}
}