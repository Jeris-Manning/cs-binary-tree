import React from 'react';
import {Col, Row, Txt} from '../../Bridge/Bricks/bricksShaper';
import {Tip} from '../../Bridge/misc/Tooltip';
import $j from '../../Bridge/misc/$j';
import {ReColumn, T_FnSort} from '../../Bridge/ReTable/ReColumn';
import {T_RowDat} from '../../Bridge/ReTable/ReTable';
import {observer} from 'mobx-react';
import {JobDat} from '../../datum/stache/JobDat';
import {computed} from 'mobx';
import {IconType} from 'react-icons';
import {FiVideo} from 'react-icons/fi';
import {Ico} from '../../Bridge/Bricks/Ico';

type Props = {
	column: ReColumn,
	dat: JobDat,
	value: string,
	cell: {
		style?: any, // see: Txt
		trunc?: number,
		maxH?: number,
	},
}

type IconInfo = {
	label: string,
	icon: IconType,
	hue?: string,
};

const FnSort: T_FnSort = (a: T_RowDat, b: T_RowDat, column: ReColumn) => {
	const _a = String(a[column.accessor] || '').toLowerCase();
	const _b = String(b[column.accessor] || '').toLowerCase();
	if (_a < _b) return -column.sortDirection;
	if (_a > _b) return column.sortDirection;
	return 0;
};

@observer
export class RC_Situation extends React.Component<Props> {
	
	static COLUMN = (config: ReColumn | Props): ReColumn => new ReColumn(config, RC_Situation, FnSort);
	
	@computed get iconInfos(): IconInfo[] {
		const job: JobDat = this.props.dat;
		
		let icons = [];
		
		// if (job.vri) icons.push({label: 'VRI', icon: FiVideo});
		// TODO
		
		return icons;
	}
	
	render() {
		let situation = this.props.value;
		const cell = this.props.cell;
		const dat = this.props.dat;
		
		if (!situation) return <div/>;
		
		// const text = trunc(situation, cell.trunc);
		const text = situation;
		const style = $j.funcOr(cell.style, situation, dat) || {};
		
		let tooltip = [];
		let icons = [];
		
		for (let info of this.iconInfos) {
			tooltip.push(info.label);
			icons.push(
				<Ico
					key={info.label}
					icon={info.icon}
					hue={info.hue}
					marR={4}
				/>
			);
		}
		
		
		const hashtags: string = (dat.hashtags || []).join(' ');
		
		tooltip.push(situation);
		
		if (dat.specialNotes) {
			tooltip.push('');
			tooltip.push(dat.specialNotes);
		}
		
		return (
			<Col fill childCenterV>
				
				{hashtags && (
					<Txt
						uDouble
						mono
						size={11}
						marB={4}
					>{hashtags}</Txt>
				)}
				
				<Row
					maxH={cell.maxH || 42}
					overflow={'hidden'}
					shrink
					// wFill
				>
					{icons}
					
					<Tip text={tooltip}>
						<Txt
							{...style}
						>{text}</Txt>
					</Tip>
				
				</Row>
			</Col>
		);
	}
}

function trunc(str: string, num: number | undefined) {
	if (!str) return '';
	if (!num) return str;
	if (str.length <= num) return str;
	return `${str.substring(0, num)}...`;
}