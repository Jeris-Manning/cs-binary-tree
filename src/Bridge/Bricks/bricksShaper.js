import {observer} from 'mobx-react';
import React from 'react';
import styled from 'styled-components';
import {Root} from '../../stores/RootStore';
import {AprilFools2021_Handler} from '../../misc/holiday/AprilFools2021';

const StyledRow = styled.div(props => props.styled);
const StyledCol = styled.div(props => props.styled);
const StyledTxt = styled.p(props => props.styled);

const doNew = false; // slightly slower?

@observer
export class Row extends React.Component {
	render() {
		// if (doNew) {
		// 	return (
		// 		<StyledRow
		// 			className={this.props.className || 'row'}
		// 			styled={Shape(this.props, true, false)}
		// 			onClick={this.props.onClick}
		// 			onMouseEnter={this.props.onMouseEnter}
		// 			onMouseLeave={this.props.onMouseLeave}
		// 			tabIndex={this.props.tabi}
		// 			ref={this.props.innerRef}
		// 			{...this.props.style}
		// 		>
		// 			{this.props.children}
		// 		</StyledRow>
		// 	);
		// }
		const style = Shape(this.props, true);
		
		return (
			<div
				className={this.props.className || style.className || 'row'}
				style={style}
				onClick={this.props.onClick}
				onMouseEnter={this.props.onMouseEnter}
				onMouseLeave={this.props.onMouseLeave}
				tabIndex={this.props.tabi}
				ref={this.props.innerRef}
				{...this.props.style}
			>
				{this.props.children}
			</div>
		);
	}
}

@observer
export class Col extends React.Component {
	render() {
		// if (doNew) {
		// 	return (
		// 		<StyledCol
		// 			className={this.props.className || 'col'}
		// 			styled={Shape(this.props, false, false)}
		// 			onClick={this.props.onClick}
		// 			onMouseEnter={this.props.onMouseEnter}
		// 			onMouseLeave={this.props.onMouseLeave}
		// 			tabIndex={this.props.tabi}
		// 			ref={this.props.innerRef}
		// 			{...this.props.style}
		// 		>
		// 			{this.props.children}
		// 		</StyledCol>
		// 	);
		// }
		
		const style = Shape(this.props, false);
		
		return (
			<div
				className={this.props.className || style.className || 'col'}
				style={style}
				onClick={this.props.onClick}
				onMouseEnter={this.props.onMouseEnter}
				onMouseLeave={this.props.onMouseLeave}
				tabIndex={this.props.tabi}
				ref={this.props.innerRef}
				{...this.props.style}
			>
				{this.props.children}
			</div>
		);
	}
}

@observer
export class Txt extends React.Component {
	render() {
		// if (doNew) {
		// 	return (
		// 		<StyledTxt
		// 			className={this.props.className || 'txt'}
		// 			styled={Shape(this.props, true, true)}
		// 			onClick={this.props.onClick}
		// 			onMouseEnter={this.props.onMouseEnter}
		// 			onMouseLeave={this.props.onMouseLeave}
		// 		>
		// 			{this.props.children}
		// 		</StyledTxt>
		// 	);
		// }
		
		// if (Root().aprilFools && !this.props.noHoliday) {
		// 	return (
		// 		<p
		// 			className={this.props.className || 'txt'}
		// 			style={Shape(this.props, true, true)}
		// 			onClick={this.props.onClick}
		// 			onMouseEnter={this.props.onMouseEnter}
		// 			onMouseLeave={this.props.onMouseLeave}
		// 			{...this.props.style}
		// 		>
		// 			{AprilFools2021_Handler.Convert(this.props.children)}
		// 		</p>
		// 	);
		// }
		const style = Shape(this.props, true, true);
		
		return (
			<p
				className={this.props.className || style.className || 'txt'}
				style={style}
				onClick={this.props.onClick}
				onMouseEnter={this.props.onMouseEnter}
				onMouseLeave={this.props.onMouseLeave}
				{...this.props.style}
			>
				{this.props.children}
			</p>
		);
	}
}

@observer
export class Img extends React.Component {
	render() {
		return (
			<img
				className={this.props.className || 'img'}
				style={Shape(this.props, false)}
				onClick={this.props.onClick}
				onMouseEnter={this.props.onMouseEnter}
				onMouseLeave={this.props.onMouseLeave}
				src={this.props.src}
				alt={this.props.alt}
				{...this.props.style}
			>
				{this.props.children}
			</img>
		);
	}
}

@observer
export class Span extends React.Component {
	render() {
		return (
			<span
				className={this.props.className || 'txt'}
				style={Shape(this.props, true, true)}
				onClick={this.props.onClick}
				onMouseEnter={this.props.onMouseEnter}
				onMouseLeave={this.props.onMouseLeave}
				{...this.props.style}
			>
				{this.props.children}
			</span>
		);
	}
}

@observer
export class Grow extends React.Component {
	render() {
		return <Col grow/>;
	}
}


function Shape(props, isRow = true, isText = false) {
	let style = {};
	
	if (isText) {
		bs.initText(style, props);
	} else {
		bs.init(style, isRow, props);
	}
	
	const propKeys = Object.keys(props);
	
	for (let propKey of propKeys) {
		let didChange = bs.shape(
			style,
			propKey,
			props[propKey],
			isRow,
		);
		if (isText) {
			didChange = bs.shapeText(
				style,
				propKey,
				props[propKey]
			) || didChange;
		}
		
		if (!didChange) {
			style.className = `--${propKey.toUpperCase()}`;
			style.displayName = style.className;
		}
	}
	
	Object.keys(props)
		.forEach(propKey => {
				bs.shape(
					style,
					propKey,
					props[propKey],
					isRow,
				);
				if (isText) {
					bs.shapeText(
						style,
						propKey,
						props[propKey]
					);
				}
			}
		);
	
	return style;
}

class bs {
	
	static init(style, isRow = true, props) {
		style.display = 'flex';
		style.boxSizing = 'border-box';
		if (!isRow) style.flexDirection = 'column';
		// style.flex = `${GetFlexProp(props.grow, 0, 1)} ${GetFlexProp(props.shrink, 0, 1)} ${props.basis || 'auto'}`;
		style.flex = this.getFlex(props, this.flexDefaults, this.flexDefaultString);
		style.minWidth = 0;
	}
	
	static flexFitString = '1 1 auto';
	
	static flexDefaults = {
		grow: 0,
		shrink: 0,
		basis: 'auto',
	}
	
	static flexDefaultString = '0 0 auto';
	
	static flexTextDefaults = {
		grow: 0,
		shrink: 1,
		basis: 'auto',
	}
	static flexTextDefaultString = '0 1 auto';
	
	static getFlex(props, defaults, defaultString): string {
		if (props.fit) return this.flexFitString;
		
		let flexObj = {};
		let hasNonDefault = false;
		
		if (props.hasOwnProperty('grow')) {
			hasNonDefault = true;
			flexObj.grow = BoolTo(props.grow);
		} else {
			flexObj.grow = defaults.grow;
		}
		
		if (props.hasOwnProperty('shrink')) {
			hasNonDefault = true;
			flexObj.shrink = BoolTo(props.shrink);
		} else {
			flexObj.shrink = defaults.shrink;
		}
		
		if (props.hasOwnProperty('basis')) {
			hasNonDefault = true;
			flexObj.basis = BoolTo(props.basis);
		} else {
			flexObj.basis = defaults.basis;
		}
		
		if (!hasNonDefault) return defaultString;
		
		return `${flexObj.grow} ${flexObj.shrink} ${flexObj.basis}`;
	}
	
	static shape(style, key, val, isRow): boolean {
		if (!val) return false; // if prop was set to false
		
		const shaper = this.shapers[key];
		if (!shaper) return false; // don't recognize style key
		
		shaper(style, val, isRow);
		return true;
	}
	
	static initText(style, props) {
		style.boxSizing = 'border-box';
		// style.flex = `${GetFlexProp(props.grow, 0, 1)} ${GetFlexProp(props.shrink, 1, 1)} ${props.basis || 'auto'}`;
		style.flex = this.getFlex(props, this.flexTextDefaults, this.flexTextDefaultString);
	}
	
	static shapeText(style, key, val) {
		if (!val) return false; // if prop was set to false
		
		const textShaper = this.textShapers[key];
		if (!textShaper) return false; // don't recognize style key
		
		textShaper(style, val);
		return true;
	}
	
	static shapers = {
		
		grow: () => ({}),
		shrink: () => ({}),
		basis: () => ({}),
		
		selfStart: (style) => style.alignSelf = 'flex-start',
		selfEnd: (style) => style.alignSelf = 'flex-end',
		selfStretch: (style) => style.alignSelf = 'stretch',
		
		/* CHILDREN */
		childN: (style, val, isRow) => {
			if (isRow) style.alignItems = 'flex-start';
			else style.justifyContent = 'flex-start';
		},
		childS: (style, val, isRow) => {
			if (isRow) style.alignItems = 'flex-end';
			else style.justifyContent = 'flex-end';
		},
		childE: (style, val, isRow) => {
			if (isRow) style.justifyContent = 'flex-end';
			else style.alignItems = 'flex-end';
		},
		childW: (style, val, isRow) => {
			if (isRow) style.justifyContent = 'flex-start';
			else style.alignItems = 'flex-start';
		},
		childV: (style, val, isRow) => {
			if (isRow) style.alignItems = 'center';
			else style.justifyContent = 'center';
		},
		childH: (style, val, isRow) => {
			if (isRow) style.justifyContent = 'center';
			else style.alignItems = 'center';
		},
		childCenterV: (style, val, isRow) => {
			if (isRow) style.alignItems = 'center';
			else style.justifyContent = 'center';
		},
		childCenterH: (style, val, isRow) => {
			if (isRow) style.justifyContent = 'center';
			else style.alignItems = 'center';
		},
		childC: (style, val, isRow) => {
			style.justifyContent = 'center';
			style.alignItems = 'center';
		},
		childSpread: (style, val, isRow) => {
			style.justifyContent = 'space-between'; // is this right?
		},
		spread: (style, val, isRow) => {
			style.justifyContent = 'space-between'; // is this right?
		},
		childSpaced: (style, val, isRow) => {
			style.justifyContent = 'space-evenly'; // is this right?
		},
		spaced: (style, val, isRow) => {
			style.justifyContent = 'space-evenly'; // is this right?
		},
		wrap: (style) => style.flexWrap = 'wrap',
		
		/* WIDTH & HEIGHT */
		w: (style, val) => style.width = StringOrPx(val),
		h: (style, val) => style.height = StringOrPx(val),
		
		fill: (style) => {
			style.width = '100%';
			style.height = '100%';
		},
		wFill: (style) => style.width = '100%',
		hFill: (style) => style.height = '100%',
		fillView: (style) => {
			style.width = '100vw';
			style.height = '100vh';
		},
		wView: (style) => style.width = '100vw',
		hView: (style) => style.height = '100vh',
		
		fourth: (style) => style.width = '25%',
		third: (style) => style.width = '33.333%',
		half: (style) => style.width = '50%',
		twoThird: (style) => style.width = '66.666%',
		
		minWidth: (style, val) => style.minWidth = StringOrPx(val),
		minW: (style, val) => style.minWidth = StringOrPx(val),
		maxWidth: (style, val) => style.maxWidth = StringOrPx(val),
		maxW: (style, val) => style.maxWidth = StringOrPx(val),
		minHeight: (style, val) => style.minHeight = StringOrPx(val),
		minH: (style, val) => style.minHeight = StringOrPx(val),
		maxHeight: (style, val) => style.maxHeight = StringOrPx(val),
		maxH: (style, val) => style.maxHeight = StringOrPx(val),
		
		maxFifth: (style) => style.maxWidth = '20%',
		maxFourth: (style) => style.maxWidth = '25%',
		maxThird: (style) => style.maxWidth = '33.333%',
		maxHalf: (style) => style.maxWidth = '50%',
		maxTwoThird: (style) => style.maxWidth = '66.666%',
		maxFull: (style) => style.maxWidth = '100%',
		
		/* PADDING */
		padL: (style, val) => style.paddingLeft = StringOrPx(val),
		padR: (style, val) => style.paddingRight = StringOrPx(val),
		padT: (style, val) => style.paddingTop = StringOrPx(val),
		padB: (style, val) => style.paddingBottom = StringOrPx(val),
		pad: (style, val) => style.padding = StringOrPx(val),
		padH: (style, val) => {
			style.paddingLeft = StringOrPx(val);
			style.paddingRight = StringOrPx(val);
		},
		padV: (style, val) => {
			style.paddingTop = StringOrPx(val);
			style.paddingBottom = StringOrPx(val);
		},
		
		/* MARGIN */
		marL: (style, val) => style.marginLeft = StringOrPx(val),
		marR: (style, val) => style.marginRight = StringOrPx(val),
		marT: (style, val) => style.marginTop = StringOrPx(val),
		marB: (style, val) => style.marginBottom = StringOrPx(val),
		mar: (style, val) => style.margin = StringOrPx(val),
		marH: (style, val) => {
			style.marginLeft = StringOrPx(val);
			style.marginRight = StringOrPx(val);
		},
		marV: (style, val) => {
			style.marginTop = StringOrPx(val);
			style.marginBottom = StringOrPx(val);
		},
		
		/* POSITION */
		top: (style, val) => style.top = val + 'px',
		bottom: (style, val) => style.bottom = val + 'px',
		left: (style, val) => style.left = val + 'px',
		right: (style, val) => style.right = val + 'px',
		relative: (style) => style.position = 'relative',
		position: (style, val) => style.position = val,
		absolute: (style) => {
			style.position = 'absolute';
			style.top = 0; // TODO: make this configurable
		},
		sticky: (style) => {
			style.position = 'sticky';
			style.top = 0;
		},
		fixed: (style) => {
			style.position = 'fixed';
			style.top = 0;
		},
		z: (style, val) => style.zIndex = val,
		
		/* BACKGROUND & SHADOW & OUTLINE */
		bg: (style, val) => style.background = val,
		hue: (style, val) => style.backgroundColor = val,
		boxShadow: (style, val) => style.boxShadow = val,
		shadowPage: (style) => style.boxShadow = '0px 1px 5px 0px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 3px 1px -2px rgba(0, 0, 0, 0.12)',
		outline: (style, val) => style.outline = val,
		bgDanger: (style) => style.background = 'repeating-linear-gradient(45deg,rgba(255,20,100,.08),rgba(255,20,100,.08) 4px,transparent 4px,transparent 8px)',
		
		/* BORDER */
		border: (style, val) => style.border = val,
		borL: (style, val) => {
			style.borderLeftWidth = val;
			style.borderLeftStyle = 'solid';
		},
		hueBorL: (style, val) => style.borderLeftColor = val,
		borR: (style, val) => {
			style.borderRightWidth = val;
			style.borderRightStyle = 'solid';
		},
		hueBorR: (style, val) => style.borderRightColor = val,
		borT: (style, val) => {
			style.borderTopWidth = val;
			style.borderTopStyle = 'solid';
		},
		hueBorT: (style, val) => style.borderTopColor = val,
		borB: (style, val) => {
			style.borderBottomWidth = val;
			style.borderBottomStyle = 'solid';
		},
		hueBorB: (style, val) => style.borderBottomColor = val,
		circle: (style) => style.borderRadius = 360,
		rad: (style, val) => style.borderRadius = `${val}%`,
		borderRadius: (style, val) => style.borderRadius = val,
		
		/* MISC */
		pointerEvents: (style, val) => style.pointerEvents = StringOr(val, 'auto'),
		noPointerEvents: (style) => style.pointerEvents = 'none',
		overflow: (style, val) => style.overflow = StringOr(val, 'auto'),
		overflowX: (style, val) => style.overflowX = StringOr(val, 'auto'),
		overflowY: (style, val) => style.overflowY = StringOr(val, 'auto'),
		// scroll: (style) => {
		// 	style.overflowX = 'hidden';
		// 	style.overflowY = 'auto';
		// 	style.overscrollBehavior = 'contain';
		// },
		scrollV: (style) => {
			style.overflowX = 'hidden';
			style.overflowY = 'auto';
			style.overscrollBehavior = 'contain';
		},
		on: (style) => style.cursor = 'pointer',
		onClick: (style) => style.cursor = 'pointer',
		cursor: (style, val) => style.cursor = val,
		
		
		/* stubs */
		
		children: () => {},
	};
	
	static textShapers = {
		
		font: (style, val) => style.fontFamily = val,
		size: (style, val) => style.fontSize = StringOrPx(val),
		// b: (style) => style.fontWeight = 'bold',
		b: (style) => style.fontWeight = 700,
		semibold: (style) => style.fontWeight = 600,
		light: (style) => style.fontWeight = 'lighter',
		heavy: (style) => style.fontWeight = 'bolder',
		i: (style) => style.fontStyle = 'italic',
		mono: (style) => style.fontFamily = 'Roboto Mono, monospace',
		
		decor: (style, val) => style.textDecoration = val,
		u: (style) => style.textDecoration = 'underline',
		underline: (style) => style.textDecoration = 'underline',
		dotted: (style) => style.textDecoration = 'underline dotted',
		dashed: (style) => style.textDecoration = 'underline dashed',
		uDouble: (style) => style.textDecoration = 'underline double',
		lineThrough: (style) => style.textDecoration = 'line-through',
		strike: (style) => style.textDecoration = 'line-through',
		
		caps: (style) => style.textTransform = 'uppercase',
		capFirst: (style) => style.textTransform = 'capitalized',
		smallCaps: (style) => style.fontVariant = 'small-caps',
		
		justify: (style) => style.textAlign = 'justify',
		left: (style) => style.textAlign = 'left',
		right: (style)  => style.textAlign = 'right',
		center: (style) => style.textAlign = 'center',
		
		lineH: (style, val) => style.lineHeight = val,
		vertical: (style) => style.verticalAlign = 'middle',
		
		hue: (style, val) => {
			style.backgroundColor = undefined;
			style.color = val;
		},
		
		ellipsis: (style) => {
			style.textOverflow = 'ellipsis';
			style.whiteSpace = 'nowrap';
			style.overflow = 'hidden';
		},
		
		preLine: (style) => style.whiteSpace = 'pre-line',
		preWrap: (style) => style.whiteSpace = 'pre-wrap',
		noSelect: (style) => style.userSelect = 'none',
		break: (style) => {
			style.overflowWrap = 'break-word';
			style.wordBreak = 'break-all';
		},
		
		sideways: (style) => {
			style.writingMode = 'vertical-rl';
			style.transform = 'scale(-1)';
		},
	};
	
}

/**
 * If val is string, return val, else return 'or'
 */
function StringOr(val, or) {
	return (typeof val === 'string') ? val : or;
}

/**
 * If val is bool, return given true or false value (default: 1, 2) else return val
 */
function BoolTo(val, ifTrue = 1, ifFalse = 0) {
	if (typeof val !== 'boolean') return val;
	return val ? ifTrue : ifFalse;
}

/**
 * If val is string, return val, else return val + 'px'
 */
function StringOrPx(val) {
	return (typeof val === 'string') ? val : val + 'px';
}