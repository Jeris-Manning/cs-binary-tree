import {observer} from 'mobx-react';
import React from 'react';
import {computed} from 'mobx';
import {TerpPhotoDat} from '../../datum/stache/TerpPhotoDat';
import type {TerpKey} from '../../datum/stache/TerpDat';
import {Staches} from '../../stores/RootStore';
import {Col, Txt} from '../../Bridge/Bricks/bricksShaper';
import styled from 'styled-components';
import {Tip} from '../../Bridge/misc/Tooltip';

const CIRCLE_SIZE_STANDARD = 40;
const CIRCLE_SIZE_PREVIEW = 23;

const FONT_SIZE_STANDARD = 20;
const FONT_SIZE_PREVIEW = 8;

function GetInitials(firstName = '', lastName = '') {
	return `${firstName.slice(0, 1)} ${lastName.slice(0, 1)}`;
}

const StyTerpAvatar = styled.img`
  width: ${p => `${p.size}px`};
  height: ${p => `${p.size}px`};
  border-radius: 360px;
  aspect-ratio: 1;
`;

export type C_TerpAvatar = {
	terpKey: TerpKey,
	firstName: string,
	lastName: string,
	isPreview?: boolean,
}

@observer
export class ChatTerpAvatar extends React.Component<C_TerpAvatar> {
	
	@computed get terpPhotoDat(): TerpPhotoDat {
		const terpKey: TerpKey = this.props.terpKey;
		return Staches().cTerpPhoto.GetOrStub(terpKey).dat;
	}
	
	@computed get circleSize(): number {
		if (this.props.isPreview) return CIRCLE_SIZE_PREVIEW;
		return CIRCLE_SIZE_STANDARD;
	}
	
	@computed get fontSize(): number {
		if (this.props.isPreview) return FONT_SIZE_PREVIEW;
		return FONT_SIZE_STANDARD;
	}
	
	render() {
		// TEST HACK RESUME
		// return (
		// 	<Col
		// 		circle
		// 		hue={'#acacac'}
		// 		w={this.circleSize}
		// 		h={this.circleSize}
		// 		childC
		// 	/>
		// );
		
		const tooltip = this.props.tooltip;
		
		if (this.terpPhotoDat.url) {
			return (
				<Tip text={tooltip}>
					<StyTerpAvatar
						src={this.terpPhotoDat.url}
						size={this.circleSize}
					/>
				</Tip>
			);
		}
		
		
		// no picture
		const firstName = this.props.firstName;
		const lastName = this.props.lastName;
		
		return (
			<Tip text={tooltip}>
				<Col
					circle
					hue={'#acacac'}
					w={this.circleSize}
					h={this.circleSize}
					childC
				>
					<Txt
						size={this.fontSize}
						b
					>
						{GetInitials(firstName, lastName)}
					</Txt>
				</Col>
			</Tip>
		);
	}
}