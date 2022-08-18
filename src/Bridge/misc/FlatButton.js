import './FlatButton.css';
import React from 'react';
import {observer} from 'mobx-react';
import Loading from './Loading';


function FlatButton(props) {
	
	// primary, danger, other
	
	let classes = 'flatButt';
	
	if (props.primary) classes += ' primary';
	else if (props.danger) classes += ' danger';
	else classes += ' other';
	
	const loading = props.loading || false;
	
	const hueMain = GetHueMain(props);
	const hueHover = GetHueHover(props);
	const hueClick = GetHueClick(props);
	
	const Icon = props.icon || null;
	
	let _style = {
		width: props.w,
		height: props.h,
	};
	
	return (
		<button
			onClick={props.on || props.onClick || props.onPress}
			disabled={props.disabled || loading}
			onMouseEnter={props.onMouseEnter}
			onMouseLeave={props.onMouseLeave}
			
			style={_style}
			
			className={classes}
			>
			{loading && <Loading size={props.loadingSize || 50}/>}
			{!loading && Icon && <Icon size={props.iconSize || 20}/>}
			{!loading && props.label}
		</button>
		
		// <Col
		// 	hue={'white'}
		// 	shadowPage
		// 	padV={20}
		// 	maxWidth={props.max}
		// 	w={props.w}
		// 	mar={16}
		// >
		// 	<CardHeader header={props.header}/>
		// 	{props.children}
		// </Col>
	);
}

export default observer(FlatButton);


/**
 * @return {string}
 */
function GetHueMain(props) {
	if (props.hueMain) return props.hueMain;
	if (props.submit || props.accept) return '#01b6d1';
	if (props.cancel || props.delete) return '#ff342c';
}

/**
 * @return {string}
 */
function GetHueHover(props) {
	if (props.hueHover) return props.hueHover;
	if (props.submit || props.accept) return '#86ad00';
	if (props.cancel || props.delete) return '#c02721';
}

/**
 * @return {string}
 */
function GetHueClick(props) {
	if (props.hueClick) return props.hueClick;
	if (props.submit || props.accept) return '#7a9e00';
	if (props.cancel || props.delete) return '#a2211b';
}
