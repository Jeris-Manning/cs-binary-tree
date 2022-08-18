import {observable} from 'mobx';
import {IconType} from 'react-icons';

export type RouteKey = string;
export type RoutePath = string;
export type RouteParams = any;
export type RouteQueryParams = any;
export type T_FnCanEnter = () => boolean;
export type T_FnCanExit = () => boolean;
export type T_FnAfterEnter = (RouteParams, RouteQueryParams) => {};
export type T_FnAfterParamsChanged = (RouteParams, RouteQueryParams) => {};
export type T_FnAfterExit = (RouteParams, RouteQueryParams, RouteDef) => {};

export class RouteDef {
	
	@observable key: RouteKey;
	@observable path: RoutePath;
	@observable rootPath: RoutePath;
	@observable originalPath: RoutePath;
	
	@observable defaultParams: any;
	
	@observable icon: IconType;
	@observable label: string; // name (nav label)
	@observable header: string; // top of page
	
	@observable page;
	@observable component;
	
	@observable important: boolean;
	@observable exact: boolean;
	@observable noMargin: boolean;
	@observable noPadding: boolean;
	@observable headerStyle: any;
	@observable width;
	@observable notes;
	@observable browserTitle;
	@observable pageProps;
	
	@observable fnCanEnter: T_FnCanEnter = () => true;
	@observable fnCanExit: T_FnCanExit = () => true;
	@observable fnAfterEnter: T_FnAfterEnter = () => {};
	@observable fnAfterParamsChange: T_FnAfterParamsChanged = () => {};
	@observable fnAfterExit: T_FnAfterExit = () => {};
	
	constructor(config: RouteDef) {
		Object.assign(this, config);
		
		const originalPath = config.path;
		
		
		const queryIndex = originalPath.indexOf('?');
		this.path = queryIndex >= 0
			? originalPath.substring(0, queryIndex)
			: originalPath;
		this.rootPath = `/${originalPath.split('/')[1]}`;
		this.originalPath = originalPath;
	}
	
}