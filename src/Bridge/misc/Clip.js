import React from 'react';
import {observer} from 'mobx-react';
import {ClickAlert} from './Tooltip';
import {Txt} from '../Bricks/bricksShaper';
import {CopyToClipboard} from 'react-copy-to-clipboard';


type ClipTypes = {
	alert?: string,
	copy: string,
}

@observer
export class Clip extends React.Component<ClipTypes> {
	render() {
		const {
			alert = 'Copied',
			copy,
			children,
			keepFormatting
		} = this.props;
		
		let options = {};
		if (!keepFormatting) options.format = 'text/plain';
		
		return (
			<ClickAlert text={alert}>
				<CopyToClipboard
					text={copy}
					options={options}
				>
					{children}
				</CopyToClipboard>
			</ClickAlert>
		);
	}
}

type ClipTxtTypes = {
	...ClipTypes,
	size?: number,
	id?: boolean,
	title?: boolean,
	txt?: {},
}

@observer
export class ClipTxt extends React.Component<ClipTxtTypes> {
	render() {
		const {
			copy,
			size = 24,
			id = false,
			title = false,
			txt,
			keepFormatting
		} = this.props;
		
		const text = id
			? `#${copy}`
			: copy;
		
		const style = title
			? {
				b: true,
				size: 32,
			}
			: {};
		
		return (
			<Clip
				copy={copy}
				keepFormattin={keepFormatting}
			>
				<Txt
					size={size}
					{...style}
					{...txt}
					noHoliday
				>{text}</Txt>
			</Clip>
		);
	}
}