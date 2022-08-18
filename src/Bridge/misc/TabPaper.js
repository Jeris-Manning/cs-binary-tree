import React from 'react';
import {observer} from 'mobx-react';
import {Col, Row, Txt} from '../Bricks/bricksShaper';
import {HUE} from '../HUE';
import styled from 'styled-components';
import {Tip} from './Tooltip';

@observer
export class TabPaper extends React.Component {
	
	render() {
		const {
			tabs,
			activeTab,
			onTabSelect,
			innerStyle = {},
			children,
			tabWidth,
			border,
			paperHue,
			leftComps,
			rightComps,
		} = this.props;
		
		const width = tabWidth || `${100 / tabs.length}%`;
		
		return (
			<Col
				wFill
				overflow
				padT={10}
				// padH={20}
				padB={160}
			>
				
				<Row>
					<Row grow maxThird>
						{leftComps}
					</Row>
					
					{tabs.map(tab => (
						<Tab
							key={tab.key}
							tab={tab}
							isActive={activeTab === tab.key}
							width={tab.small ? undefined : width}
							onClick={() => onTabSelect(tab.key)}
						/>
					))}
					
					<Row grow/>
					
					<Row grow maxThird>
						{rightComps}
					</Row>
				</Row>
				
				<Col
					hue={paperHue || HUE.paperBg}
					shadowPage
					// boxShadow={'0px 1px 5px 0px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 3px 1px -2px rgba(0, 0, 0, 0.12)'}
					// pad={innerStyle.pad || 8}
					border={border}
				>
					{children}
				</Col>
			</Col>
		);
	}
}

@observer
class Tab extends React.Component {
	
	render() {
		const {
			isActive,
			tab,
			onClick,
			width,
		} = this.props;
		
		const Icon = tab.icon;
		const StyledTab = isActive ? ActiveTab : InactiveTab;
		
		return (
			<StyledTab
				onClick={isActive ? undefined : onClick}
				isActive={isActive}
				// disabled={isActive}
				width={width}
			>
				<Tip text={tab.tooltip}>
					<Row childC>
						
						{Icon && (
							<Icon size={26}/>
						)}
						
						{tab.label && (
							<Txt
								size={24}
								marL={!!Icon ? 12 : undefined}
							>{tab.label}</Txt>
						)}
					</Row>
				</Tip>
			</StyledTab>
		);
	}
}

const InactiveTab = styled.button`
	width: ${p => p.width};
	padding: 16px 16px;
	margin-left: 4px;
	margin-right: 4px;
	background: #9ca5ac;
	border: none;
	box-shadow:
		0 1px 5px 0 rgba(0,0,0,0.2),
		0 2px 2px 0 rgba(0,0,0,0.14),
		0 3px 1px -2px rgba(0,0,0,0.12);
	transition:
		background-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,
		box-shadow 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,
		border 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
	cursor: pointer;
	user-select: none;
	outline: none;
	border-radius: 12px 12px 0 0;
	
	&:hover {
		background: #abb4bc;
	}
	
	&:active {
		background: #abb4bc;
		box-shadow:
			0 5px 5px -3px rgba(0,0,0,0.2),
			0 8px 10px 1px rgba(0,0,0,0.14),
			0 3px 14px 2px rgba(0,0,0,0.12);
	}
`;

const ActiveTab = styled(InactiveTab)`
	background: #fff;
	box-shadow: none;
	z-index: 20;
	//border-radius: 20px 20px 0 0;
	cursor: default;
	
	&:hover {
		background: #fff;
	}
	
	&:active {
		background: #dce5ec;
		box-shadow: none;
			//0 5px 5px -3px rgba(0,0,0,0.2),
			//0 8px 10px 1px rgba(0,0,0,0.14),
			//0 3px 14px 2px rgba(0,0,0,0.12);
	}
`;