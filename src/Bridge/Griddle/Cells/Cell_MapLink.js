import React, {Component} from 'react';
import {Row, Txt} from '../../Bricks/bricksShaper';
import {observer} from 'mobx-react';
import styled from 'styled-components';
import $j from '../../misc/$j';
import {Tip} from '../../misc/Tooltip';

const Text = styled.div`
	font-size: .75rem;
	margin-right: 5px;
`;

@observer
export default class Cell_MapLink extends React.Component {
	render() {
		const props = this.props;
		
		// short circuit and display text instead
		if (props.value && props.value[0] === '#') {
			return <Row childW marV={4}><Txt b>{props.value.substring(1)}</Txt></Row>;
		}
		
		const link = `https://maps.google.com/?q=${props.value}`;
		
		const aStyle = {
			color: 'inherit',
			textDecoration: 'none'
		};
		
		return (
			<Row fill childCenterV>
				<Tip text={props.value}>
					<a href={link} target='_blank' style={aStyle}>
						{props.column.showRegion && (
							<Txt b size={'.75rem'}>{props.row.region}</Txt>
						)}
						<Text>{$j.trunc(props.value, 50)}</Text>
					</a>
				</Tip>
			</Row>
		);
	}
}