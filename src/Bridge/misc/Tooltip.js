import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import 'tippy.js/animations/perspective.css';
import React, {forwardRef} from 'react';
import {observer} from 'mobx-react';
import styled from 'styled-components';

type TipPlacement =
	'top'
	| 'bottom'
	| 'left'
	| 'right'
	| 'top-start'
	| 'top-end'
	| 'bottom-start'
	| 'bottom-end'
	| 'left-start'
	| 'left-end'
	| 'right-start'
	| 'right-end';

type TipProps = {
	text: string | string[] | React.Component,
	children: any,
	
	placement?: TipPlacement,
	delay?: number | [number, number],
	trigger?: 'mouseenter' | 'focus' | 'click' | 'manual',
};

@observer
export class Tip extends React.Component<TipProps> {
	render() {
		const props: TipProps = this.props;
		let text = props.text; // can also be component
		
		const placement = props.placement || 'top';
		const delay = props.delay || 0;
		const trigger = props.trigger || 'mouseenter';
		
		if (!text) {
			if (!props.children) return <></>;
			return <>{props.children}</>;
		}
		
		if (Array.isArray(text)) {
			text = (
				<>
					{text.map((inner, dex) => (
						<React.Fragment key={dex}>
							{inner}
							<br/>
						</React.Fragment>
					))}
				</>
			);
		}
		
		return (
			<Tippy
				content={text}
				animation={'perspective'}
				inertia
				arrow
				placement={placement}
				delay={delay}
				trigger={trigger}
			>
				<TippyWrapper>
					{props.children}
				</TippyWrapper>
			</Tippy>
		);
	}
}

@observer
export class ClickAlert extends React.Component<TipProps> {
	render() {
		return (
			<Tip
				trigger={'click'}
				{...this.props}
			/>
		);
	}
}

const TippyWrapper = forwardRef(
	(props, ref) => {
		return (
			<Wrapper ref={ref}>{props.children}</Wrapper>
		);
	}
);

const Wrapper = styled.div`
	//display: contents;
`;




// if (Array.isArray(text)) {
// 	if (text.length === 1) {
// 		text = text[0];
// 	} else {
// 		text = (
// 			<>
// 				<b>{text[0]}</b>
// 				<ul>
// 					{text.map((inner, dex) => {
// 						if (!inner || dex === 0) return <></>;
// 						return <li>{inner}</li>;
// 					})}
// 				</ul>
// 			</>
// 		);
// 	}
// }
// console.log(`Tip render ${trigger}: ${text}`, text);
// if (is.object(text)) {
// 	console.log(`_____________Tip given obj`, text);
// 	throw new Error(`Tip given obj`, text);
// }

// return (
// 	<>
// 		<Txt>TIP: {text}</Txt>
// 		{props.children}
// 	</>
// )