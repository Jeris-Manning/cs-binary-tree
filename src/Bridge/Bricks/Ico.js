import React from 'react';
import {Col} from './bricksShaper';
import {observer} from 'mobx-react';
import {Tip} from '../misc/Tooltip';
import {MdCheckBox, MdCheckBoxOutlineBlank} from 'react-icons/md';
import {IconType} from 'react-icons';

type Props = {
	icon: IconType,
	hue?: string,
	hueBg?: string,
	size?: number,
	tooltip?: string,
}

@observer
export class Ico extends React.Component<Props> {
	render() {
		const {
			icon,
			hue,
			hueBg,
			size,
			tooltip,
		} = this.props;
		
		if (!icon) {
			return (
				<Tip text={tooltip}>
					<Col
						{...this.props}
						hue={hueBg}
						w={size}
						h={size}
					/>
				</Tip>
			);
		}
		
		const Icon = icon;
		
		return (
			<Tip text={tooltip}>
				<Col
					{...this.props}
					hue={hueBg}
				>
					<Icon
						color={hue}
						size={size}
					/>
				</Col>
			</Tip>
		);
	}
}

/**
 * Ico but takes an Upstate. If no value, return nothing.
 */
@observer
export class UpIco extends React.Component {
	render() {
		if (!this.props.state.value) return <React.Fragment/>;
		return <Ico {...this.props}/>;
	}
}

@observer
export class IcoToggle extends React.Component {
	render() {
		const {
			isSet,
			iconSet,
			iconUnset,
			hueSet,
			hueUnset,
		} = this.props;
		
		return <Ico
			icon={isSet
				? iconSet || MdCheckBox
				: iconUnset || MdCheckBoxOutlineBlank
			}
			hue={isSet
				? hueSet || '#000000'
				: hueUnset || '#7c7c7c'
			}
			{...this.props}
		/>
	}
}