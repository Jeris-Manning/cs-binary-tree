// import styled from 'styled-components';
// import {observer} from 'mobx-react';
// import React from 'react';
//
// function Builder(p, isRow = true) {
// 	return ({
// 		display: 'flex',
// 		flex: bb.flex(p),
// 		flexDirection: isRow ? 'row' : 'column',
// 		alignSelf: bb.alignSelf(p),
// 		justifyContent: isRow ? bb.justifyContentRow(p) : bb.justifyContentCol(p),
// 		alignItems: isRow ? bb.alignItemsRow(p) : bb.alignItemsCol(p),
// 		flexWrap: bb.flexWrap(p),
//
// 		boxSizing: 'border-box',
//
// 		width: bb.width(p),
// 		minWidth: bb.minWidth(p),
// 		maxWidth: bb.maxWidth(p),
//
// 		height: bb.height(p),
// 		minHeight: bb.minHeight(p),
// 		maxHeight: bb.maxHeight(p),
//
// 		position: bb.position(p),
// 		top: bb.top(p),
//
// 		pointerEvents: bb.pointerEvents(p),
//
// 		overflow: bb.overflow(p),
// 		overflowX: bb.overflowX(p),
// 		overflowY: bb.overflowY(p),
// 		overscrollBehavior: bb.overscrollBehavior(p),
//
// 		background: bb.background(p),
// 		backgroundColor: bb.backgroundColor(p),
// 		boxShadow: bb.boxShadow(p),
// 		zIndex: bb.zIndex(p),
// 		outline: bb.outline(p),
//
// 		paddingTop: bb.paddingTop(p),
// 		paddingBottom: bb.paddingBottom(p),
// 		paddingLeft: bb.paddingLeft(p),
// 		paddingRight: bb.paddingRight(p),
//
// 		marginTop: bb.marginTop(p),
// 		marginBottom: bb.marginBottom(p),
// 		marginLeft: bb.marginLeft(p),
// 		marginRight: bb.marginRight(p),
//
// 		border: bb.border(p),
// 		borderLeftWidth: bb.borderLeftWidth(p),
// 		borderLeftStyle: bb.borderLeftStyle(p),
// 		borderLeftColor: bb.borderLeftColor(p),
// 		borderBottomWidth: bb.borderBottomWidth(p),
// 		borderBottomStyle: bb.borderBottomStyle(p),
// 		borderBottomColor: bb.borderBottomColor(p),
//
// 		cursor: bb.cursor(p),
//
// 		borderRadius: bb.borderRadius(p),
// 	});
// }
//
// const StyledRow = styled.div(p => p.built);
// const StyledCol = styled.div(p => p.built);
//
// @observer
// export class Row extends React.Component {
// 	render() {
// 		return (
// 			<StyledRow
// 				built={Builder(this.props, true)}
// 				onClick={this.props.onClick}
// 				onMouseEnter={this.props.onMouseEnter}
// 				onMouseLeave={this.props.onMouseLeave}
// 			>
// 				{this.props.children}
// 			</StyledRow>
// 		)
// 	}
// }
//
// @observer
// export class Col extends React.Component {
// 	render() {
// 		return (
// 			<StyledCol
// 				built={Builder(this.props, false)}
// 				onClick={this.props.onClick}
// 				onMouseEnter={this.props.onMouseEnter}
// 				onMouseLeave={this.props.onMouseLeave}
// 			>
// 				{this.props.children}
// 			</StyledCol>
// 		)
// 	}
// }
//
//
// class bb {
//
// 	static flex(props) {
// 		return `${GetDefaultOrBoolOrProp(props.grow, 0, 1)} ${GetDefaultOrBoolOrProp(props.shrink, 0, 1)} ${props.basis || 'auto'}`;
// 	}
//
// 	static alignSelf(props) {
// 		if (props.selfStart) return 'flex-start';
// 		if (props.selfEnd) return 'flex-end';
// 		if (props.selfStretch) return 'stretch';
// 	}
//
// 	static alignItemsRow(props) {
// 		if (props.childN) return 'flex-start';
// 		if (props.childCenterV || props.childC) return 'center';
// 		if (props.childS) return 'flex-end';
// 	}
//
// 	static alignItemsCol(props) {
// 		if (props.childW) return 'flex-start';
// 		if (props.childCenterH || props.childC) return 'center';
// 		if (props.childE) return 'flex-end';
// 	}
//
// 	static justifyContentRow(props) {
// 		if (props.childW) return 'flex-start'; // DEFAULT
// 		if (props.childCenterH || props.childC) return 'center';
// 		if (props.childE) return 'flex-end';
// 		if (props.childSpread) return 'space-between';
// 		if (props.childSpaced) return 'space-evenly';
// 	}
//
// 	static justifyContentCol(props) {
//
// 		if (props.childN) return 'flex-start'; // DEFAULT
// 		if (props.childCenterV || props.childC) return 'center';
// 		if (props.childS) return 'flex-end';
// 		if (props.childSpread) return 'space-between';
// 		if (props.childSpaced) return 'space-evenly';
// 	}
//
// 	static flexWrap(props) {
// 		if (props.wrap) return 'wrap';
// 	}
//
// 	static width(props) {
// 		if (props.fill || props.wFill) return '100%';
// 		if (props.fillView || props.wView) return '100vw';
// 		if (props.w) return StringOr(props.w, props.w + 'px');
// 	}
//
// 	static minWidth(props) {
// 		if (props.minWidth) return StringOr(props.minWidth, props.minWidth + 'px');
// 	}
//
// 	static maxWidth(props) {
// 		if (props.maxWidth) return StringOr(props.maxWidth, props.maxWidth + 'px');
// 	}
//
// 	static height(props) {
// 		if (props.fill || props.hFill) return '100%';
// 		if (props.fillView || props.hView) return '100vh';
// 		if (props.h) return StringOr(props.h, props.h + 'px');
// 	}
//
// 	static minHeight(props) {
// 		if (props.minHeight) return StringOr(props.minHeight, props.minHeight + 'px');
// 	}
//
// 	static maxHeight(props) {
// 		if (props.maxHeight) return StringOr(props.maxHeight, props.maxHeight + 'px');
// 	}
//
// 	static top(props) {
// 		if (props.top) return props.top + 'px';
// 		if (props.sticky || props.fixed) return 0;
// 	}
//
// 	static position(props) {
// 		if (props.sticky) return 'sticky';
// 		if (props.fixed) return 'fixed';
// 	}
//
// 	static pointerEvents(props) {
// 		if (props.pointerEvents) return StringOr(props.pointerEvents, 'auto');
// 		if (props.noPointerEvents) return 'none';
// 	}
//
// 	static overflow(props) {
// 		if (props.overflow) return StringOr(props.overflow, 'auto');
// 	}
//
// 	static overflowX(props) {
// 		if (props.overflowX) return StringOr(props.overflowX, 'auto');
// 		if (props.scrollV || props.scroll) return 'hidden';
// 	}
//
// 	static overflowY(props) {
// 		if (props.overflowY) return StringOr(props.overflowY, 'auto');
// 		if (props.scrollV || props.scroll) return 'auto';
// 	}
//
// 	static overscrollBehavior(props) {
// 		if (props.scrollV || props.scroll) return 'contain';
// 	}
//
// 	static background(props) {
// 		if (props.bg) return props.bg;
// 	}
//
// 	static backgroundColor(props) {
// 		if (props.hue) return props.hue;
// 	}
//
// 	static boxShadow(props) {
// 		if (props.shadowPage) return '0px 1px 5px 0px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 3px 1px -2px rgba(0, 0, 0, 0.12)';
// 		if (props.boxShadow) return props.boxShadow;
// 	}
//
// 	static zIndex(props) {
// 		if (props.z) return props.z;
// 	}
//
// 	static outline(props) {
// 		if (props.outline) return props.outline;
// 	}
//
// 	static paddingTop(props) {
// 		if (props.padT) return props.padT + 'px';
// 		if (props.padV) return props.padV + 'px';
// 		if (props.pad) return props.pad + 'px';
// 	}
//
// 	static paddingBottom(props) {
// 		if (props.padB) return props.padB + 'px';
// 		if (props.padV) return props.padV + 'px';
// 		if (props.pad) return props.pad + 'px';
// 	}
//
// 	static paddingLeft(props) {
// 		if (props.padL) return props.padL + 'px';
// 		if (props.padH) return props.padH + 'px';
// 		if (props.pad) return props.pad + 'px';
// 	}
//
// 	static paddingRight(props) {
// 		if (props.padR) return props.padR + 'px';
// 		if (props.padH) return props.padH + 'px';
// 		if (props.pad) return props.pad + 'px';
// 	}
//
// 	static marginTop(props) {
// 		if (props.marT) return props.marT + 'px';
// 		if (props.marV) return props.marV + 'px';
// 		if (props.mar) return props.mar + 'px';
// 	}
//
// 	static marginBottom(props) {
// 		if (props.marB) return props.marB + 'px';
// 		if (props.marV) return props.marV + 'px';
// 		if (props.mar) return props.mar + 'px';
// 	}
//
// 	static marginLeft(props) {
// 		if (props.marL) return props.marL + 'px';
// 		if (props.marH) return props.marH + 'px';
// 		if (props.mar) return props.mar + 'px';
// 	}
//
// 	static marginRight(props) {
// 		if (props.marR) return props.marR + 'px';
// 		if (props.marH) return props.marH + 'px';
// 		if (props.mar) return props.mar + 'px';
// 	}
//
// 	static border(props) {
// 		if (props.border) return props.border;
// 	}
//
// 	static borderLeftWidth(props) {
// 		if (props.borL) return props.borL;
// 	}
//
// 	static borderLeftStyle(props) {
// 		if (props.borL) return 'solid';
// 	}
//
// 	static borderLeftColor(props) {
// 		if (props.hueBorL) return props.hueBorL;
// 	}
//
// 	static borderBottomWidth(props) {
// 		if (props.borB) return props.borB;
// 	}
//
// 	static borderBottomStyle(props) {
// 		if (props.borB) return 'solid';
// 	}
//
// 	static borderBottomColor(props) {
// 		if (props.hueBorB) return props.hueBorB;
// 	}
//
// 	static cursor(props) {
// 		if (props.onClick) return 'pointer';
// 	}
//
// 	static borderRadius(props) {
// 		if (props.circle) return 360;
// 		if (props.rad) return `${props.rad}%`;
// 		if (props.borderRadius) return props.borderRadius;
// 	}
// }
//
//
// function GetDefaultOrBoolOrProp(prop, ifUndefined, ifBool) {
// 	if (!prop) return ifUndefined;
// 	if (typeof prop === 'boolean') return ifBool;
// 	return prop;
// }
//
// function StringOr(prop, or) {
// 	return (typeof prop === 'string') ? prop : or;
// }