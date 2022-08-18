

/**
 * @param props
 * @param dir: row, col
 * @param type: container, text, image, button
 * @param webOrNative: web, native
 */
export const Styler = (props, dir, type, webOrNative) => {
	let _style = {};
	
	const parentDir = props.parentdir || (webOrNative === 'web' ? 'row' : 'column');
	
	PaddingStyler(_style, props, webOrNative);
	MarginStyler(_style, props, webOrNative);
	BorderStyler(_style, props);
	
	if (type === 'container') {
		FlexStyler(_style, props, parentDir, dir, type, webOrNative);
		SelfAlignStyler(_style, props, parentDir, dir);
		ChildAlignStyler(_style, props, dir);
		if (props.hue) _style['backgroundColor'] = props.hue;
		else _style['backgroundColor'] = 'rgba(0, 0, 0, 0)'; // TODO native inspector bug
	}
	else if (type === 'text') {
		TextStyler(_style, props, webOrNative);
		if (props.hue) _style['color'] = props.hue;
		
	}
	else if (type === 'image') {
		FlexStyler(_style, props, parentDir, dir, type, webOrNative);
		SelfAlignStyler(_style, props, parentDir, dir);
		ChildAlignStyler(_style, props, dir);
		ImageStyler(_style, props);
		if (props.hue) _style['backgroundColor'] = props.hue;
		if (props.fill) {
			_style['minWidth'] = '100%';
			_style['minHeight'] = '100%';
		}
		
	}
	else if (type === 'button') {
		if (props.hue) _style['backgroundColor'] = props.hue;
	}
	
	if (props.style) Object.assign(_style, props.style); // For overrides
	
	return _style;
};

export const FlexStyler = (_style, props, parentDir, dir, type, webOrNative) => {
	const suffix = webOrNative === 'web' ? 'px' : 0;
	// if (webOrNative === 'web') _style['display'] = 'flex';
	_style['display'] = 'flex';
	
	
	_style['flexDirection'] = dir;
	
	let _grow = 0;
	// const _shrink = type === 'text' ? 1 : 0;
	let _shrink = (props.w || props.h || props.test) ? 0 : 1;
	let _basis = '';
	
	if (props.grow) {
		_grow = typeof(props.grow) === 'number' ? props.grow : 1;
	}
	
	if (parentDir === 'row') {
		if (props.h && type !== 'text') {
			_style['height'] = props.h + suffix;
		}
		else if (type === 'image' && !props.fill) {
			_style['height'] = (props.w || 50) + suffix;
		}
		
		if (props.w) {
			_basis = props.w + suffix;
			_style['width'] = _basis; // Flexbox bug #464210 workaround
		}
		else if (type === 'image' && !props.fill) {
			_basis = (props.h || 50) + suffix;
			_style['width'] = _basis; // Flexbox bug #464210 workaround
		}
		
	} else {
		if (props.h && type !== 'text') {
			_basis = props.h + suffix;
			_style['height'] = _basis; // Flexbox bug #464210 workaround
		}
		else if (type === 'image') {
			_basis = (props.w || 50) + suffix;
			_style['height'] = _basis; // Flexbox bug #464210 workaround
		}
		
		if (props.w) {
			_style['width'] = props.w + suffix;
		}
		else if (type === 'image') {
			_style['width'] = (props.h || 50) + suffix;
		}
	}
	
	if (props.flex) {
		_style['flex'] = props.flex;
	}
	else {
		if (webOrNative === 'web') {
			_style['flex'] = `${_grow} ${_shrink} ${_basis || 'auto'}`;
			// console.log(`Setting ${type} flex to ${_style['flex']}`);
		}
		else {
			_style['flexGrow'] = _grow;
			_style['flexShrink'] = _shrink;
			_style['flexBasis'] = _basis || 'auto';
		}
	}
	
	if (props.overflow) {
		_style['overflow'] = 'auto';
	}
};

export const SelfAlignStyler = (_style, props, parentDir) => {
	if (parentDir === 'row') {
		if (props.N) _style['alignSelf'] = 'flex-start';
		if (props.E) _style['marginLeft'] = 'auto';
		if (props.S) _style['alignSelf'] = 'flex-end';
		if (props.W) _style['marginRight'] = 'auto';
	} else {
		if (props.N) _style['marginBottom'] = 'auto';
		if (props.E) _style['alignSelf'] = 'flex-end';
		if (props.S) _style['marginTop'] = 'auto';
		if (props.W) _style['alignSelf'] = 'flex-start';
	}
	
	if (props.stretch) _style['alignSelf'] = 'stretch';
	if (props.center) _style['alignSelf'] = 'center';
};

export const ChildAlignStyler = (_style, props, dir) => {
	if (dir === 'row') {
		/** ROW **/
		if (props.childN)       _style['alignItems'] = 'flex-start';
		else if (props.childS)  _style['alignItems'] = 'flex-end';
		// else                    _style['alignItems'] = 'stretch';
		
		if (props.childE)       _style['justifyContent'] = 'flex-end';
		else if (props.childW)  _style['justifyContent'] = 'flex-start';
		else                    _style['justifyContent'] = 'center';
	} else {
		/** COLUMN **/
		if (props.childN)       _style['justifyContent'] = 'flex-start';
		else if (props.childS)  _style['justifyContent'] = 'flex-end';
		else                    _style['justifyContent'] = 'center';
		
		if (props.childE)       _style['alignItems'] = 'flex-end';
		else if (props.childW)  _style['alignItems'] = 'flex-start';
		// else                    _style['alignItems'] = 'stretch';
	}
	
	if (props.childSpread)      _style["justifyContent"] = "space-between";
	if (props.childCenter)      _style["alignItems"] = "center";
};


export const PaddingStyler = (_style, props, webOrNative) => {
	const suffix = webOrNative === 'web' ? 'px' : 0;
	
	if (props.pad) {
		_style['padding'] = props.pad + suffix;
		return;
	}
	
	if (props.padV) {
		_style['paddingTop'] = props.padV + suffix;
		_style['paddingBottom'] = props.padV + suffix;
	} else {
		if (props.padT) _style['paddingTop'] = props.padT + suffix;
		if (props.padB) _style['paddingBottom'] = props.padB + suffix;
	}
	
	if (props.padH) {
		_style['paddingLeft'] = props.padH + suffix;
		_style['paddingRight'] = props.padH + suffix;
	} else {
		if (props.padL) _style['paddingLeft'] = props.padL + suffix;
		if (props.padR) _style['paddingRight'] = props.padR + suffix;
	}
};

export const MarginStyler = (_style, props, webOrNative) => {
	const suffix = webOrNative === 'web' ? 'px' : 0;
	
	if (props.mar) {
		_style['margin'] = props.mar + suffix;
		return;
	}
	
	if (props.marV) {
		_style['marginTop'] = props.marV + suffix;
		_style['marginBottom'] = props.marV + suffix;
	} else {
		if (props.marT) _style['marginTop'] = props.marT + suffix;
		if (props.marB) _style['marginBottom'] = props.marB + suffix;
	}
	
	if (props.marH) {
		_style['marginLeft'] = props.marH + suffix;
		_style['marginRight'] = props.marH + suffix;
	} else {
		if (props.marL) _style['marginLeft'] = props.marL + suffix;
		if (props.marR) _style['marginRight'] = props.marR + suffix;
	}
};


export const TextStyler = (_style, props, webOrNative) => {
	const suffix = webOrNative === 'web' ? 'px' : 0;
	
	if (props.lineH) {
		_style['lineHeight'] = props.lineH;
	}

	if (webOrNative === 'web') {
		
		if (props.font) _style['fontFamily'] = props.font;
		if (props.size || props.s) _style['fontSize'] = props.size || props.s;// + suffix;
		
		if (props.b) _style['fontWeight'] = 'bold';
		else if (props.l) _style['fontWeight'] = 'lighter';
		else if (props.h) _style['fontWeight'] = 'bolder';
		
		if (props.underline) _style['textDecoration'] = 'underline';
		if (props.lineThrough) _style['textDecoration'] = 'line-through';
		
		if (props.i) _style['fontStyle'] = 'italic';
		
		if (props.justify) {
			_style['textAlign'] = 'justify';
		}
		if (props.left) {
			_style['textAlign'] = 'left';
		}
		if (props.center) {
			_style['textAlign'] = 'center';
		}
		
		if (props.vertical) {
			_style['verticalAlign'] = 'middle';
		}
	
	} else {
		if (props.size) _style['fontSize'] = props.size;
		
		if (props.b) _style['fontFamily'] = 'bold';
		else if (props.i) _style['fontFamily'] = 'italic';
		else if (props.l) _style['fontFamily'] = 'light';
		else if (props.h) _style['fontFamily'] = 'heavy';
		
		if (props.underline) _style['textDecorationLine'] = 'underline';
		
	}

};

export const BorderStyler = (_style, props) => {
	// TODO
	
	if (props.circle) _style['borderRadius'] = 100;
	else if (props.rad) _style['borderRadius'] = `${props.rad}%`;
	
	if (props.borB) _style['borderBottomWidth'] = props.borB;
	
	if (props.hueBorB) _style['borderBottomColor'] = props.hueBorB;
	
	
};

export const ImageStyler = (_style, props, webOrNative) => {
	// const suffix = webOrNative === 'web' ? 'px' : 0;
	// if (!props.h) _style['height'] = (props.w || '50') + suffix;
	// if (!props.w) _style['width'] = (props.h || '50') + suffix;
	
	// if (props.circle) _style['borderRadius'] = '50%';
	// else if (props.rad) _style['borderRadius'] = `${props.rad}%`;
	
	if (props.hueTint) _style['tintColor'] = props.hueTint;
	
};





// const propsDummy = {
// 	h: '',
// 	w: '',
//
// 	N: '',
// 	E: '',
// 	S: '',
// 	W: '',
// 	grow: '',
// 	stretch: '',
// 	center: '',
//
// 	childN: '',
// 	childE: '',
// 	childS: '',
// 	childW: '',
// 	childSpread: '',
// 	childCenter: '',
//
//
// 	pad: '',
// 	padT: '',
// 	padR: '',
// 	padB: '',
// 	padL: '',
// 	padV: '',
// 	padH: '',
//
// 	mar: '',
// 	marT: '',
// 	marR: '',
// 	marB: '',
// 	marL: '',
// 	marV: '',
// 	marH: '',
//
// 	hue: '',
//
// 	justify: '',
// };


// export const PaddingStyler = (_style, props) => {
// 	if (props.pad) {
// 		_style.Set(props.pad, _pad);
// 		return;
// 	}
//
// 	if (props.padV) {
// 		_style.Set(props.padV, _padT, _padB);
// 	} else {
// 		_style.SetIf(props.padT, _padT);
// 		_style.SetIf(props.padB, _padB);
// 	}
//
// 	if (props.padH) {
// 		_style.Set(props.padH, _padL, _padR);
// 	} else {
// 		_style.SetIf(props.padL, _padL);
// 		_style.SetIf(props.padR, _padR);
// 	}
//
// };
//
// export const MarginStyler = (_style, props) => {
// 	if (props.mar) {
// 		_style.Set(props.mar, _mar);
// 		return;
// 	}
//
// 	if (props.marV) {
// 		_style.Set(props.marV, _marT, _marB);
// 	} else {
// 		_style.SetIf(props.marT, _marT);
// 		_style.SetIf(props.marB, _marB);
// 	}
//
// 	if (props.marH) {
// 		_style.Set(props.marH, _marL, _marR);
// 	} else {
// 		_style.SetIf(props.marL, _marL);
// 		_style.SetIf(props.marR, _marR);
// 	}
//
// };



// export const Style = {
//
//
// 	Set: function (value, key1, key2 = null) {
// 		this[key1] = value;
// 		if (key2) this[key2] = value;
// 	},
//
// 	/**
// 	 * @return {boolean}
// 	 */
// 	SetIf: function (value, key1, key2 = null) {
// 		if (value) {
// 			this[key1] = value;
// 			if (key2) this[key2] = value;
// 			return true;
// 		}
// 		return false;
// 	},
// };