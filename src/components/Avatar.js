import React from 'react';
import {observer} from 'mobx-react';
import {Tip} from '../Bridge/misc/Tooltip';
import styled from 'styled-components';
import {Col, Txt} from '../Bridge/Bricks/bricksShaper';
import {LinkFragile} from '../Bridge/Nav/Linker';
import AvatarPlaceholder from './chat/AvatarPlaceholder';

type AvatarTypes = {
	key: string,
	personObj: PersonObj,
	photo?: string, // url, overrides what's in PersonObj
	linkToKey: string,
	linkParams: {},
	size?: number,
	radius?: number,
	border?: string,
}

type PersonObj = {
	firstName: string,
	lastName: string,
	photo?: string, // url
}

const StyAvatar = styled.img`
  width: ${p => `${p.size}px`};
  height: ${p => `${p.size}px`};
  border-radius: ${p => `${p.radius}px`};
  border: ${p => p.border};
`;

const StyAvatarBig = styled.img`
  width: 200px;
  height: 200px;
  border: ${p => p.border};
`;

@observer
export class Avatar extends React.Component<AvatarTypes> {
	render() {
		const {
			personObj,
			photo,
			linkToKey,
			linkParams,
			radius = 10,
			size = 26,
			border,
			tipLabel,
		} = this.props;
		
		const photoUrl = photo || personObj.photo;
		
		if (!photoUrl) {
			return (
				<Tip text={tipLabel}>
					<LinkFragile toKey={linkToKey} params={linkParams}>
						<Col
							hue={'#acacac'}
							w={size}
							h={size}
							radius={radius}
							childC
						>
							<Txt
								size={20}
							>{AvatarPlaceholder.Get(personObj.firstName, personObj.lastName)}</Txt>
						</Col>
					</LinkFragile>
				</Tip>
			);
		}
		
		const tip = (
			<>
				{tipLabel && (
					<Txt marB={8}>{tipLabel}</Txt>
				)}
				<StyAvatarBig src={photoUrl}/>
			</>
		);
		
		return (
			<Tip text={tip} placement={'top-start'} delay={500}>
				<LinkFragile toKey={linkToKey} params={linkParams}>
					<StyAvatar
						src={photoUrl}
						size={size}
						radius={radius}
						border={border}
					/>
				</LinkFragile>
			</Tip>
		);
	}
}


@observer
export class StaffAvatar extends React.Component {
	render() {
		const {
			noTooltip,
			staff,
			// OR
			name,
			color,
			photo,
			
			// OPTIONAL
			size = 26,
			radius = 10,
			backup,
		} = this.props;
		
		// TEST HACK RESUME
		// return (
		// 	<Col
		// 		hue={'#5b84a1'}
		// 		w={size}
		// 		h={size}
		// 		radius={radius}
		// 		border={`2px solid #000000`}
		// 	/>
		// );
		
		const staffName = name || staff.internalName;
		const staffColor = color || staff.color;
		const photoSrc = photo || staff.photo;
		
		if (!photoSrc) return (
			<Tip text={staffName || backup}>
				<Col
					hue={'#acacac'}
					w={size}
					h={size}
					radius={radius}
					border={`2px solid #000000`}
				/>
			</Tip>
		);
		
		if (noTooltip) return (
			<StyAvatar
				src={photoSrc}
				size={size}
				radius={radius}
				border={`2px solid ${staffColor}`}
			/>
		);
		
		return (
			<Tip
				placement={'right-end'}
				delay={500}
				text={(
					<Col childCenterH>
						<Txt marV={8} size={'2rem'}>{staffName || backup}</Txt>
						<StyAvatarBig src={photoSrc} border={`4px solid ${staffColor}`}/>
					</Col>
				)}
			>
				<StyAvatar
					src={photoSrc}
					size={size}
					radius={radius}
					border={`2px solid ${staffColor}`}
				/>
			</Tip>
		);
	}
}