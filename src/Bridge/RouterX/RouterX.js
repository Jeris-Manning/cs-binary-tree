import {action, observable, runInAction, toJS} from 'mobx';
import {Router as DirectorRouter} from 'director/build/director';
// import queryString from 'query-string'; // TODO

const LOG = (str, param = '') => console.log('❎ RouterX: ' + str, param);

/**
 *
 *  route:
 *      path (required)
 *      component
 *
 *      optional:
 *          fnCanEnter (can block navigation)
 *          fnCanExit (can block navigation)
 *          fnAfterExit
 *          fnAfterEnter
 *          fnAfterParamsChange
 */
export class RouterX {
	@observable routes = {};
	@observable params = {};
	@observable query = {};
	@observable currentRoute;
	@observable currentPath;
	@observable currentRootPath;
	@observable director = {};
	// @observable eventPromisers = {};
	@observable eventPromisers = {};
	@observable canLeaveSite;
	@observable canNavigate;
	
	@action StartRouter = (config) => {
		LOG(`Starting Router`);
		
		const {
			routes,
			eventPromisers,
			canLeaveSite,
			canNavigate,
			onLeaveSite,
		} = config;
		
		this.Navigate = this.Navigate.bind(this);
		
		this.routes = {};
		this.eventPromisers = eventPromisers;
		this.canLeaveSite = canLeaveSite;
		this.canNavigate = canNavigate || (() => true);
		this.onLeaveSite = onLeaveSite || (() => ({}));
		
		if (this.canLeaveSite) {
			window.addEventListener('beforeunload', (event) => {
				if (this.canLeaveSite()) {
					this.onLeaveSite();
					return '';
				}
				event.preventDefault();
				event.returnValue = '';
			});
		}
		
		let routesForDirector = {};
		
		Object.keys(routes).forEach(routeKey => {
			const route = routes[routeKey];
			
			route.key = routeKey;
			this.routes[routeKey] = route;
			
			// when URL has changed externally, tell the store to go there
			routesForDirector[route.path] = (...paramsArr) => {
				LOG(`director triggered path change: ${route.path}`, paramsArr);
				// LOG(`this: `, this);
				this.Navigate(
					route,
					GetParamsObject(route.originalPath, paramsArr),
					GetQueryObject(paramsArr),
				).then();
			};
		});
		
		
		// defines the paths to watch out for
		this.director = new DirectorRouter({...routesForDirector})
			.configure({
				// strict: false,
				// before: (params) => LOG(`before ${window.location.search}`, params),
			})
			.init('/');
	};
	
	@action
	async Navigate(newRoute, paramsObj, queryParamsObj = {}) {
		// LOG(`Navigating: ${newRoute}`, paramsObj);
		
		if (!newRoute) throw new Error(`That route does not exist!`);
		
		if (typeof newRoute === 'string') {
			newRoute = this.routes[newRoute];
		}
		
		const canNavigate = this.canNavigate(newRoute, paramsObj, queryParamsObj);
		
		if (!canNavigate) {
			console.log(`Navigation cancelled`);
			return;
		}
		
		paramsObj = this.CalculateParams(paramsObj, newRoute.defaultParams);
		
		const newPath = GetPathAsUrl(
			newRoute.originalPath,
			paramsObj,
			queryParamsObj
		);
		
		LOG(`Navigating to ${newPath} from ${this.currentPath}`);
		
		if (newPath === this.currentPath) {
			return; // path didn't change
		}
		
		const currentRoute = this.currentRoute;
		const currentParams = toJS(this.params);
		const currentQueryParams = toJS(this.query);
		const newParams = toJS(paramsObj);
		const newQueryParams = toJS(queryParamsObj);
		
		const routeChanged = currentRoute !== newRoute;
		
		// check if either route blocks navigation
		if (currentRoute && routeChanged) {
			const canExit =
				await this.currentRoute.fnCanExit();
			if (!canExit) return;
			
			const canEnter =
				await newRoute.fnCanEnter();
			if (!canEnter) return;
			
			currentRoute.fnAfterExit(
				currentParams,
				currentQueryParams,
				newRoute,
			);
		}
		
		
		if (routeChanged) {
			await this.RouteEvent_Enter(newRoute, newParams, newQueryParams);
		} else {
			await this.RouteEvent_ParamsChanged(newRoute, newParams, newQueryParams)
		}
		
		runInAction(() => {
			this.currentRoute = newRoute;
			this.params = newParams;
			this.query = newQueryParams;
			this.currentPath = GetPathAsUrl(
				this.currentRoute.originalPath,
				this.params,
				this.query
			);
			this.currentRootPath = this.currentRoute.rootPath;
			
			
			// if (routeChanged) {
			// 	// TODO: fnAfterEnter should happen before we set the currentRoute
			// 	// TODO so it has a chance to load/set load before rendering for the first time
			// 	this.RouteEvent_Enter(newRoute, newParams, newQueryParams);
			// 	// newRoute.fnAfterEnter(
			// 	// 	newParams,
			// 	// 	newQueryParams
			// 	// );
			// } else {
			// 	// only params changed
			// 	newRoute.fnAfterParamsChange(
			// 		newParams,
			// 		newQueryParams
			// 	);
			// }
			
			// const hash = `#${this.currentPath}`;
			const hash = this.currentPath;
			if (hash !== window.location.hash) {
				window.history.pushState(null, null, hash);
			}
		});
		
	}
	
	NavClicker = (toKey, params) => {
		return {
			onClick: (evt) => {
				if (!IsNewTabDesired(evt)) {
					evt.preventDefault();
					return this.Navigate(toKey, params);
				}
			},
			href: GetPathAsUrl(
				this.routes[toKey].originalPath,
				params,
			),
		};
	};
	
	CalculateParams = (paramsObj, defaultParams) => {
		console.log(`CalculateParams`, paramsObj, defaultParams);
		
		if (!defaultParams) return paramsObj || {};
		
		if (typeof defaultParams === 'function') defaultParams = defaultParams();
		
		let result = toJS(defaultParams);
		
		Object.assign(result, paramsObj);
		
		// for (const key of Object.keys(result)) {
		// 	if (!paramsObj.hasOwnProperty(key)) continue;
		// 	result[key] = paramsObj[key];
		// }
		//
		// for (const key of Object.keys(paramsObj)) {
		// 	result[key] = paramsObj[key];
		// }
		
		return result;
	};
	
	@action
	async RouteEvent_Enter(route, params, queryParams) {
		// if (this.eventPromisers.hasOwnProperty('fnAfterEnter')) {
		// 	await this.eventPromisers.fnAfterEnter();
		// }
		if (this.eventPromisers.hasOwnProperty('fnAfterEnter')) {
			await this.eventPromisers.fnAfterEnter();
		}
		
		
		LOG(`fnAfterEnter ${route.key}`);
		
		runInAction(() => {
			route.fnAfterEnter(params, queryParams);
		});
	}
	
	@action
	async RouteEvent_ParamsChanged(route, params, queryParams) {
		return route.fnAfterParamsChange(params, queryParams);
	}
}

export const GetPathAsUrl = (originalPath, paramsObj = {}, queryObj = {}) => {
	const paramsString = GetParamsString(originalPath, paramsObj);
	const queryString = GetQueryString(queryObj);
	return `#${paramsString}${queryString}`;
};

/**
 * Takes path and params object and returns formatted url string.
 *
 * /book/:id/page/:pageId {id: 123, pageId: 555} => /book/123/page/555
 * @param originalPath
 * @param paramsObj
 */
export const GetParamsString = (originalPath, paramsObj = {}) => {
	const params = toJS(paramsObj);
	
	let newPath = originalPath;
	
	ForEachRegexMatch(
		originalPath,
		paramRegex,
		([fullMatch, paramKey, paramKeyWithoutColon]) => {
			const value = params[paramKeyWithoutColon];
			newPath =
				value !== undefined
					? newPath.replace(paramKey, value)
					: newPath.replace(`/${paramKey}`, '');
		}
	);
	
	return newPath;
};

/**
 * Takes query object and returns formatted url string.
 *
 * {thing: 'blah', other: [123, 456, 789]} => `?thing=blah&other=123,456,789`
 * @param queryObj
 */
export const GetQueryString = (queryObj = {}) => {
	return '';
	
	// const query = toJS(queryObj);
	//
	//
	// const result = Object.keys(query)
	// 	.map(key => (
	// 		`${key}${query[key] ? (
	// 			Array.isArray(query[key])
	// 				? '=' + query[key].join(',')
	// 				: '=' + query[key]
	// 		) : ''}`
	// 	))
	// 	.join('&');
	//
	// return result ? `?${result}` : '';
};

/*
converts an array of params [123, 100] to an object
Example: if the current this.path is /book/:id/page/:pageId it will return {id:123, pageId:100}
*/
export const GetParamsObject = (originalPath, paramsArray) => {
	let params = [];
	
	ForEachRegexMatch(
		originalPath,
		paramRegex,
		// eslint-disable-next-line
		([fullMatch, paramKey, paramKeyWithoutColon]) => {
			params.push(paramKeyWithoutColon);
		}
	);
	
	return paramsArray.reduce((obj, paramValue, index) => {
		obj[params[index]] = paramValue;
		return obj;
	}, {});
};


// TODO: fix this (make a better Director)
export const GetQueryObject = (paramsArray) => {
	return {};
	
	// if (!paramsArray || !paramsArray.length) return {};
	//
	// const path = paramsArray[0]; // I know
	//
	// let queryString = path.replace('&', '?');
	//
	// const queries = queryString.split('?');
	//
	// let obj = {};
	//
	// queries.forEach(query => {
	// 	const parts = query.split('=');
	//
	// 	obj[parts[0]] = parts.length === 1
	// 		? obj[parts[0]] = ''
	// 		: parts[1].split(',');
	// });
	//
	// return obj;
};

export const ForEachRegexMatch = (string, regexExpression, callback) => {
	let match;
	while ((match = regexExpression.exec(string)) !== null) {
		callback(match);
	}
};

function IsNewTabDesired(evt) {
	return evt.button === 2 || evt.metaKey || evt.ctrlKey;
}

/* eslint-disable */
export const paramRegex = /(:([^\/?]*))/g;
// export const optionalRegex = /(\/:[^\/]*\?)$/g;
