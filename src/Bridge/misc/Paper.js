import {observer} from 'mobx-react';
import React, {Component} from 'react';
import {HUE} from '../HUE';
import {Col, Txt} from '../Bricks/bricksShaper';

@observer
export class Paper extends React.Component {
	render() {
		const props = this.props;
		
		return (
			<Col
				shrink
				wFill
				overflow
				className={'page'}
				padB={160}
			>
				<Col
					hue={HUE.paperBg}
					shadowPage={!props.noBg && !props.noShadow}
					marV={props.marV || 40}
					// marH={props.marH || 40}
					maxWidth={'100%'}
					pad={props.pad || 18}
					wrap
					className={'page_inner'}
				>
					{props.children}
				</Col>
			</Col>
		);
	}
}

@observer
export class PaperHeader extends React.Component {
	render() {
		const {
			header,
			subtitle,
		} = this.props;
		
		return (
			<Col marB={12} childCenterH>
				<Txt
					size={'2.4rem'}
				>
					{header}
				</Txt>
				
				{subtitle && (
					<Txt
						size={'1.2rem'}
						marT={6}
					>{subtitle}</Txt>
				)}
			</Col>
		);
	}
}

@observer
export class BlankPaper extends React.Component {
	render() {
		return (
			<>
				{this.props.children}
			</>
		);
	}
}