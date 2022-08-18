const SetFlexSelf = (style, props) => {
	style.display = 'flex';
	
	if (props.flex) {
		style.flex = props.flex;
	} else {
		const grow = GetDefaultOrBoolOrProp(props.grow, 0, 1);  // default: 0 (no grow)
		const shrink = GetDefaultOrBoolOrProp(props.shrink, 0, 1);  // default: 0 (no shrink)
		const basis = GetDefaultOrBoolOrProp(props.basis, 'auto', 'auto');  // default: auto, does not accept bool
		
		style.flex = `${grow} ${shrink} ${basis}`;
	}
	
	if (props.selfStart) style.alignSelf = 'flex-start';
	if (props.selfEnd) style.alignSelf = 'flex-end';
	if (props.selfStretch) style.alignSelf = 'stretch';
	
	// else style.minHeight = 'min-content';
	// else if (props.h) style.minHeight = props.h;
	// default auto not working in chrome, see chromium bug #596743
};


const SetFlexChildren = (style, props, direction) => {
	if (direction === 'column') {
		style.flexDirection = 'column';
		
		if (props.childN) style.justifyContent = 'flex-start'; // DEFAULT
		if (props.childCenterV || props.childC) style.justifyContent = 'center';
		if (props.childS) style.justifyContent = 'flex-end';
		
		if (props.childW) style.alignItems = 'flex-start';
		if (props.childCenterH || props.childC) style.alignItems = 'center';
		if (props.childE) style.alignItems = 'flex-end';
	} else if (direction === 'row') {
		style.flexDirection = 'row';
		
		if (props.childW) style.justifyContent = 'flex-start'; // DEFAULT
		if (props.childCenterH || props.childC) style.justifyContent = 'center';
		if (props.childE) style.justifyContent = 'flex-end';
		
		if (props.childN) style.alignItems = 'flex-start';
		if (props.childCenterV || props.childC) style.alignItems = 'center';
		if (props.childS) style.alignItems = 'flex-end';
	}
	
	if (props.childStretch) style.alignItems = 'stretch'; // DEFAULT
	if (props.childSpread) style.justifyContent = 'space-between';
	if (props.childSpaced) style.justifyContent = 'space-evenly';
	
	if (props.wrap) style.flexWrap = 'wrap';
};

/**
 * Helper.
 * If prop is undefined, return @ifUndefined.
 * If prop is a boolean, return @ifBool.
 * Otherwise return @prop.
 * @param prop
 * @param ifUndefined
 * @param ifBool
 */
const GetDefaultOrBoolOrProp = (prop, ifUndefined, ifBool) => {
	if (!prop) return ifUndefined;
	if (typeof prop === 'boolean') return ifBool;
	return prop;
};

function StringOr(prop, or) {
	return (typeof prop === 'string') ? prop : or;
}

const suffix = 'px';

export const BricksStyler = (props, flexColumn, flexRow) => {
	let style = {};
	
	style.boxSizing = 'border-box';
	
	if (props.fill) {
		style.width = '100%';
		style.height = '100%';
	} else if (props.fillView) {
		style.width = '100vw';
		style.height = '100vh';
	} else {
		if (props.wFill) style.width = '100%';
		else if (props.wView) style.width = '100vw';
		
		if (props.hFill) style.height = '100%';
		else if (props.hView) style.height = '100vh';
	}
	
	if (props.w) style.width = props.w;
	if (props.h) style.height = props.h;
	
	if (props.minH || props.minHeight) style.minHeight = props.minH || props.minHeight;
	else style.minHeight = 0;
	if (props.minW || props.minWidth) style.minWidth = props.minW || props.minWidth;
	else style.minWidth = 0;
	
	if (props.maxWidth) style.maxWidth = props.maxWidth;
	if (props.maxHeight) style.maxHeight = props.maxHeight;
	
	if (props.sticky) {
		style.position = 'sticky';
		style.top = '0';
		style.boxSizing = 'border-box';
	}
	
	if (props.fixed) {
		style.position = 'fixed';
		style.top = '0';
	}
	
	if (props.pointerEvents) {
		style.pointerEvents = props.pointerEvents;
	}
	
	if (props.noPointerEvents) style.pointerEvents = 'none';
	if (props.pointerEvents) style.pointerEvents = StringOr(style.pointerEvents, 'auto');
	
	if (props.overflow) style.overflow = StringOr(style.overflow, 'auto');
	if (props.overflowX) style.overflowX = StringOr(style.overflow, 'auto');
	if (props.overflowY) style.overflowY = StringOr(style.overflow, 'auto');
	
	if (props.scrollV || props.scroll) {
		style.overflowX = 'hidden';
		style.overflowY = 'auto';
		style.overscrollBehavior = 'contain';
	}
	
	if (flexColumn) {
		SetFlexSelf(style, props);
		SetFlexChildren(style, props, 'column');
	} else if (flexRow) {
		SetFlexSelf(style, props);
		SetFlexChildren(style, props, 'row');
	}
	
	if (props.bg) style.background = props.bg;
	if (props.shadowPage) style.boxShadow = '0px 1px 5px 0px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 3px 1px -2px rgba(0, 0, 0, 0.12)';
	if (props.boxShadow) style.boxShadow = props.boxShadow;
	if (props.z) style.zIndex = props.z;
	
	if (props.outline) style.outline = props.outline;
	
	
	// PADDING
	
	if (props.pad) style.padding = props.pad + suffix;
	
	if (props.padV) {
		style.paddingTop = props.padV + suffix;
		style.paddingBottom = props.padV + suffix;
	} else {
		if (props.padT) style.paddingTop = props.padT + suffix;
		if (props.padB) style.paddingBottom = props.padB + suffix;
	}
	
	if (props.padH) {
		style.paddingLeft = props.padH + suffix;
		style.paddingRight = props.padH + suffix;
	} else {
		if (props.padL) style.paddingLeft = props.padL + suffix;
		if (props.padR) style.paddingRight = props.padR + suffix;
	}
	
	// MARGIN
	
	if (props.mar) style.margin = props.mar + suffix;
	
	if (props.marV) {
		style.marginTop = props.marV + suffix;
		style.marginBottom = props.marV + suffix;
	} else {
		if (props.marT) style.marginTop = Number.isInteger(props.marT) ? props.marT + suffix : props.marT;
		if (props.marB) style.marginBottom = Number.isInteger(props.marB) ? props.marB + suffix : props.marB;
	}
	
	if (props.marH) {
		style.marginLeft = props.marH + suffix;
		style.marginRight = props.marH + suffix;
	} else {
		if (props.marL) style.marginLeft = Number.isInteger(props.marL) ? props.marL + suffix : props.marL;
		if (props.marR) style.marginRight = Number.isInteger(props.marR) ? props.marR + suffix : props.marR;
	}
	
	
	// COLORS
	
	if (props.hue) style.backgroundColor = props.hue;
	
	
	// BORDERS
	if (props.circle) style.borderRadius = 360;
	else if (props.rad) style.borderRadius = `${props.rad}%`;
	else if (props.borderRadius) style.borderRadius = props.borderRadius;
	
	// TODO
	if (props.border) style.border = props.border;
	if (props.borL) style.borderLeftWidth = props.borL;
	if (props.borL) style.borderLeftStyle = 'solid';
	if (props.hueBorL) style.borderLeftColor = props.hueBorL;
	if (props.borB) style.borderBottomWidth = props.borB;
	if (props.borB) style.borderLeftStyle = 'solid';
	if (props.hueBorB) style.borderBottomColor = props.hueBorB;
	
	
	if (props.onClick) style.cursor = 'pointer';
	
	
	if (props.style) Object.assign(style, props.style); // For overrides
	return style;
	
};

export const TextStyler = (_style, props) => {
	if (props.font) _style['fontFamily'] = props.font;
	if (props.size) _style['fontSize'] = StringOr(props.size, `${props.size}px`);
	
	if (props.b) _style['fontWeight'] = 'bold';
	else if (props.l) _style['fontWeight'] = 'lighter';
	else if (props.h) _style['fontWeight'] = 'bolder';
	
	if (props.i) _style['fontStyle'] = 'italic';
	if (props.underline) _style['textDecoration'] = 'underline';
	if (props.lineThrough) _style['textDecoration'] = 'line-through';
	if (props.dotted) _style['textDecoration'] = 'underline dotted #909090';
	if (props.dashed) _style['textDecoration'] = 'underline dashed #909090';
	
	if (props.justify) _style['textAlign'] = 'justify';
	if (props.left) _style['textAlign'] = 'left';
	if (props.center) _style['textAlign'] = 'center';
	
	if (props.lineH) _style['lineHeight'] = props.lineH;
	
	if (props.vertical) _style['verticalAlign'] = 'middle';
	
	_style['backgroundColor'] = null;
	if (props.hue) _style['color'] = props.hue;
	
	if (props.ellipsis) {
		_style['textOverflow'] = 'ellipsis';
		_style['whiteSpace'] = 'nowrap';
		_style['overflow'] = 'hidden';
	}
	
	if (props.preLine) {
		
		_style['whiteSpace'] = 'pre-line';
	}
};


export const propsDummy = {
	h: '',
	w: '',
	
	N: '',
	E: '',
	S: '',
	W: '',
	grow: '',
	stretch: '',
	center: '',
	
	childN: '',
	childE: '',
	childS: '',
	childW: '',
	childSpread: '',
	childCenter: '',
	
	
	pad: '',
	padT: '',
	padR: '',
	padB: '',
	padL: '',
	padV: '',
	padH: '',
	
	mar: '',
	marT: '',
	marR: '',
	marB: '',
	marL: '',
	marV: '',
	marH: '',
	
	hue: '',
	
	justify: '',
	lineH: '',
};
