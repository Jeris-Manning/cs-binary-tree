import React, {Component} from 'react';
import {observer} from 'mobx-react';
import styled, {css, keyframes} from 'styled-components';
import {Txt} from '../Bricks/bricksShaper';

@observer
export default class Iconic extends React.Component {
	
	render() {
		const props = this.props;
		const Icon = props.icon || props.$;
		const rotate = props.rotate || props.spin;
		
		const iconProps = {
			size: props.size,
			color: props.color,
		};
		
		if (typeof Icon === 'string') {
			return (
				<Txt size={props.size} color={props.color}>{Icon}</Txt>
			);
		}
		
		if (rotate) {
			const duration = typeof rotate === 'boolean'
				? undefined
				: rotate;
			
			return (
				<Rotate duration={duration}>
					<Icon {...iconProps}/>
				</Rotate>
			);
		}
		if (props.shake) return (
			<Shake>
				<Icon {...iconProps}/>
			</Shake>
		);
		if (props.beat) return (
			<Beat>
				<Icon {...iconProps}/>
			</Beat>
		);
		if (props.blink) return (
			<Blink>
				<Icon {...iconProps}/>
			</Blink>
		);
		
		return (
			<div>
				<Icon {...iconProps}/>
			</div>
		);
	}
}


export const rotateKeyframes = keyframes`
  100% {
    transform: rotate(360deg)
  }
`;

export const shakeKeyframes = keyframes`
  10%, 90% {
    transform: translate3d(-1px, 0, 0);
  }
  20%, 80% {
    transform: translate3d(2px, 0, 0);
  }
  30%, 50%, 70% {
    transform: translate3d(-4px, 0, 0);
  }
  40%, 60% {
    transform: translate3d(4px, 0, 0);
  }
`;

export const beatKeyframes = keyframes`
  0% {
    transform: scale(.75);
  }
  20% {
    transform: scale(1);
  }
  40% {
    transform: scale(.75);
  }
  60% {
    transform: scale(1);
  }
  80% {
    transform: scale(.75);
  }
  100% {
    transform: scale(.75);
  }
`;

export const blinkKeyframes = keyframes`
  0% {
    transform: scale(1);
  }
  5% {
    transform: scale(.5);
  }
  10% {
    transform: scale(1);
  }
  100% {
    transform: scale(1);
  }
`;

export const shakeAnim = css`${shakeKeyframes} 0.82s linear infinite`;
export const beatAnim = css`${beatKeyframes} 0.82s linear infinite`;
export const blinkAnim = css`${blinkKeyframes} 5s linear infinite`;

const Rotate = styled.div`
	animation: ${p => css`
		${rotateKeyframes}
		${p.duration || '2s'}
		linear
		infinite
	`}
`;

export const Shake = styled.div`
	animation: ${shakeKeyframes} 0.82s linear infinite;
`;

export const Beat = styled.div`
	animation: ${beatKeyframes} 0.82s linear infinite;
`;

export const Blink = styled.div`
	animation: ${blinkKeyframes} 1s linear infinite;
`;
