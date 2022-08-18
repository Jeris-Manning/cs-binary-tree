import React, {Component} from 'react';
import {disposeOnUnmount, observer} from 'mobx-react';
import {GetPathAsUrl} from '../RouterX/RouterX';
import {autorun, observable} from 'mobx';
import {Router} from '../../stores/RootStore';
import {is} from '../misc/$j';
import styled from 'styled-components';


@observer
export default class Linker extends React.Component {
	
	@observable route;
	
	@disposeOnUnmount
	onRoute = autorun(() => {
		
		this.route = this.props.to
			|| (this.props.toKey ? Router().routes[this.props.toKey] : null);
		
	}, {delay: 100});
	
	@observable href;
	
	@disposeOnUnmount
	onHref = autorun(() => {
		
		let params = this.props.params;
		if (!params) {
			params = is.func(this.route.defaultParams) ? this.route.defaultParams() : this.route.defaultParams;
		}
		
		this.href = this.route
			? GetPathAsUrl(
				this.route.originalPath,
				params,
				this.props.queryParams
			)
			: '';
		
	}, {delay: 100});
	
	render() {
		const props = this.props;
		const router = Router();
		
		if (typeof this.route === 'string') {
			// text link
			return (
				<a
					href={'#' + this.route}
					onClick={evt => {
						if (this.route.charAt(0) === '#' && !IsNewTabDesired(evt)) {
							throw new Error(`local text links not supported currently`);
							// evt.preventDefault();
							// window.location.hash = this.route;
						}
					}}
					style={{
						textDecoration: 'none',
						color: '#000',
					}}
				>
					{props.children}
				</a>
			);
		}
		
		return (
			<a
				style={{
					textDecoration: 'none',
					color: '#000',
				}}
				onClick={evt => {
					if (!IsNewTabDesired(evt)) {
						evt.preventDefault();
						router.Navigate(this.route, props.params || this.route.defaultParams, props.queryParams);
					}
				}}
				
				href={this.href}
			>
				{props.children}
			</a>
		);
	}
}

function IsNewTabDesired(evt) {
	return evt.button === 2 || evt.metaKey || evt.ctrlKey;
}

const ALink = styled.a`
  text-decoration: none;
  color: #000;
`;

@observer
export class LinkFragile extends React.Component {
	render() {
		const {
			toKey,
			params,
			children,
		} = this.props;
		
		return (
			<ALink
				{...Router().NavClicker(toKey, params)}
			>
				{children}
			</ALink>
		);
	}
}