import React from 'react';
import {Row, Txt} from '../../Bridge/Bricks/bricksShaper';
import {Tip} from '../../Bridge/misc/Tooltip';
import $j from '../../Bridge/misc/$j';
import {ReColumn, T_FnSort} from '../../Bridge/ReTable/ReColumn';
import Linker from '../../Bridge/Nav/Linker';
import Butt from '../../Bridge/Bricks/Butt';
import {MdContentCopy} from 'react-icons/md';
import {Clip} from '../../Bridge/misc/Clip';
import {T_RowDat} from '../../Bridge/ReTable/ReTable';
import {observer} from 'mobx-react';

type Props = {
	column: ReColumn,
	dat: any,
	value: string,
	cell: {
		fnFormat: (string, any) => string,
		useDatArrayKey: string,
		style: any, // see: Txt
		tooltip: string,
		trunc: number,
		showClipButton: boolean,
		linker: {
			// see: Linker
			toKey: string, // page
			params: (string, any) => any, // return {companyId: r.companyId, tab: 'edit'}
		},
	},
}

const FnSort: T_FnSort = (a: T_RowDat, b: T_RowDat, column: ReColumn) => {
	const _a = String(a[column.accessor] || '').toLowerCase();
	const _b = String(b[column.accessor] || '').toLowerCase();
	if (_a < _b) return -column.sortDirection;
	if (_a > _b) return column.sortDirection;
	return 0;
};

@observer
export class RC_Text extends React.Component<Props> {
	
	static COLUMN = (config: ReColumn | Props): ReColumn => new ReColumn(config, RC_Text, FnSort);
	
	render() {
		let value = this.props.value;
		const cell = this.props.cell;
		const dat = this.props.dat;
		
		if (cell.fnFormat) value = cell.fnFormat(value, dat);
		
		if (cell.useDatArrayKey) {
			value = (value || []).map(v => v.dat[cell.useDatArrayKey]).join(', ');
		}
		
		if (!value) return <div/>;
		
		const style = $j.funcOr(cell.style, value, dat) || {};
		const tooltip = $j.funcOr(cell.tooltip, value, dat);
		const showClipButton = cell.showClipButton;
		
		const text = cell.trunc
			? $j.trunc(value, cell.trunc)
			: value;
		
		let innerText = (
			<Txt
				{...style}
			>{text}</Txt>
		);
		
		if (cell.linker) {
			const toKey = cell.linker.toKey;
			const params = $j.funcOr(cell.linker.params, value, dat);
			
			innerText = (
				<Linker
					toKey={toKey}
					params={params}
				>
					{innerText}
				</Linker>
			);
		}
		
		return (
			<Tip text={tooltip}>
				<Row fill childCenterV>
					{innerText}
					
					{showClipButton && (
						<Clip copy={value}>
							<Butt
								icon={MdContentCopy}
								iconSize={14}
								iconHue={'#6a6a6a'}
								subtle
								mini
								marL={4}
								marR={5}
							/>
						</Clip>
					)}
				</Row>
			</Tip>
		);
	}
}