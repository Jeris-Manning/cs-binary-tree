import React, {Component} from 'react';
import {observer} from 'mobx-react';
import styled from 'styled-components';
import Linker from '../Nav/Linker';
import {Col, Row} from './bricksShaper';
import {MdHelp} from 'react-icons/md';
import {Tip} from '../misc/Tooltip';

const ButtonBase = styled.button`
			height: 100%;
	        padding: 2px 4px;
	        background: ${p => p.bg};
		    border: none;
		    box-shadow: none;
		    border-radius: 4px;
		    transition: background-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,box-shadow 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,border 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
	        cursor: pointer;
	        user-select: none;
	        outline: none;
		       
		    &:hover {
		        background: ${p => p.bgHover};
			}
			
			&:active {
		        background: ${p => p.bgActive};
				box-shadow: 0 5px 5px -3px rgba(0,0,0,0.2),
							0 8px 10px 1px rgba(0,0,0,0.14),
							0 3px 14px 2px rgba(0,0,0,0.12);
			}
`;

@observer
export default class IconLinker extends React.Component {
	render() {
		const {
			to,
			params,
			icon,
			tooltip,
			size,
			iconHue,
			hueBg,
			hueHover,
			hueActive,
		} = this.props;
		
		const Icon = icon || MdHelp;
		
		const routeTo = typeof to === 'string' ? undefined : to;
		const routeKey = typeof to === 'string' ? to : undefined;
		
		const inner = (
			<Linker
				to={routeTo}
				toKey={routeKey}
				params={params}
			>
				<ButtonBase
					bg={hueBg || 'none'}
					bgHover={hueHover || '#949494'}
					bgActive={hueActive || '#c6c6c6'}
				>
					<Row childC>
						
						{Icon && (
							<Icon
								size={size || '1rem'}
								color={iconHue || '#000'}
							/>
						)}
					</Row>
				</ButtonBase>
			</Linker>
		);
		
		if (tooltip)
			return (
				<Tip text={tooltip}>
					<Col
						{...this.props}
					>
						{inner}
					</Col>
				</Tip>
			);
		
		return (
			<Col
				{...this.props}
			>
				{inner}
			</Col>
		);
	}
}

// @observer
// export class IconLinky extends React.Component {
// 	render() {
//
// 		const {
// 			to,
// 			icon,
// 			tooltip,
// 			size,
// 			iconHue,
// 			hueBg,
// 			hueHover,
// 			hueActive,
// 		} = this.props;
//
// 		const Icon = icon || MdHelp;
//
// 		const inner = (
// 			<Linky
// 				to={to}
// 			>
// 				<ButtonBase
// 					bg={hueBg || 'none'}
// 					bgHover={hueHover || '#949494'}
// 					bgActive={hueActive || '#c6c6c6'}
// 				>
// 					<Row childC>
// 						{Icon && (
// 							<Icon
// 								size={size || '1rem'}
// 								color={iconHue || '#000'}
// 							/>
// 						)}
// 					</Row>
// 				</ButtonBase>
// 			</Linky>
// 		);
//
// 		if (tooltip)
// 			return (
// 				<Tip text={tooltip}>
// 					<Col
// 						{...this.props}
// 					>
// 						{inner}
// 					</Col>
// 				</Tip>
// 			);
//
// 		return (
// 			<Col
// 				{...this.props}
// 			>
// 				{inner}
// 			</Col>
// 		);
// 	}
// }