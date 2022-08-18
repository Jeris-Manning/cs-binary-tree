import React from 'react';
import {Txt} from '../Bricks/bricksShaper';
import {observer} from 'mobx-react';
import {Router} from 'stores/RootStore';
import {Helmet} from 'react-helmet';
import {Root} from '../../stores/RootStore';
import {Paper} from './Paper';

@observer
export class NavPage extends React.Component {
	render() {
		const nav = this.props.nav || {};
		
		const PageComponent = nav.page || Paper;
		
		return (
			<>
				<Title nav={nav}/>
				
				<PageComponent
					max={nav.width}
					header={nav.header}
					headerStyle={nav.headerStyle}
					noMargin={nav.noMargin}
					noPadding={nav.noPadding}
					{...nav.pageProps}
				>
					{nav.component ? (
						<NavComp nav={nav}/>
					) : (
						<Txt>Invalid path</Txt>
					)}
				</PageComponent>
			
			</>
		);
	}
}


@observer
class Title extends React.Component {
	render() {
		const routes = Root().routes;
		const params = Router().params;
		const nav = this.props.nav;
		const notes = (nav.notes && nav.notes.count) ? `(${nav.notes.count}) ` : '';
		const prepend = routes.prependTitle;
		
		let title = '';
		
		if (typeof nav.browserTitle === 'function') {
			title = `${prepend}${nav.browserTitle(params)}`
		} else {
			title = `${prepend}${notes}${nav.header || nav.name || '?'} - Starfish`;
		}
		
		return (
			<Helmet>
				<title>{title}</title>
			</Helmet>
		)
	}
}


@observer
export class PageTitle extends React.Component {
	render() {
		const prepend = Root().routes.prependTitle;
		const title = `${prepend}${this.props.title}`;
		
		return (
			<Helmet>
				<title>{title}</title>
			</Helmet>
		)
	}
}

@observer
export class PageTitleStandard extends React.Component {
	render() {
		const prepend = Root().routes.prependTitle;
		
		const {
			name,
			id,
		} = this.props;
		
		const title = `${name} (${id})`;
		
		return (
			<Helmet>
				<title>{prepend}{title}</title>
			</Helmet>
		)
	}
}

@observer
class NavComp extends React.Component {
	render() {
		const nav = this.props.nav;
		const Comp = nav.component;
		
		return (
			<>
				<Comp {...nav.props}/>
			</>
		);
	}
}