import React, {Component} from 'react';
import {observer} from 'mobx-react';
import {Col, Row, Txt} from '../Bricks/bricksShaper';
import {HUE} from '../HUE';
import CallOnMount from './CallOnMount';


// function Page(props) {
// 	const bgHue = !props.noBg ? (props.hue || HUE.greyBlue) : null;
// 	const shadowPage = !props.noBg && !props.noShadow;
//
// 	return (
// 		<Col shrink wFill overflow class={'page'}>
// 			<Col
// 				hue={bgHue}
// 				shadowPage={shadowPage}
// 				marV={props.noMargin ? 0 : 40}
// 				marH={props.noMargin ? 0 : 40}
// 				// maxWidth={props.max || 1200}
// 				maxWidth={'100%'}
// 				pad={props.noPadding ? 0 : 18}
// 				wrap
// 				class={'page_inner'}
// 			>
// 				{props.onMount && <CallOnMount func={props.onMount}/>}
//
// 				{props.header && !!props.header.length &&
// 					<PageHeader header={props.header} style={props.headerStyle}/>
// 				}
//
// 				{props.children}
// 			</Col>
// 		</Col>
// 	);
// }
//
// export default observer(Page);


@observer
export class PageHeader extends React.Component {
	render() {
		const header = this.props.header;
		const style = this.props.style;

		if (!header) return <Row/>;
		
		if (!Array.isArray(header)) return (
			<Row marH={16} marV={10} childCenterH> <HeaderPart style={style}>{header}</HeaderPart> </Row>
		);
		
		
		return (
			<Row marH={16} marV={10} childCenterH>
				{header.map((h, i) =>
					<HeaderPart key={i} style={style[i]} marR={10}>{h}</HeaderPart>
				)}
			</Row>
		);
	}
}

@observer
class HeaderPart extends React.Component {
	render() {
		return (
			<Txt
				marR={this.props.marR}
				size={36}
				b={this.props.style === 'b'}
				i={this.props.style === 'i'}>
				{this.props.children}
			</Txt>
		);
	}
}
