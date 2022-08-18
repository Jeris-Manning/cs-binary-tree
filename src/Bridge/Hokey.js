import React from 'react';
import {configure, GlobalHotKeys} from 'react-hotkeys';

class HokeyManager {
	
	static isInitialized = false;
	static id = 0;
	static hotkeys = {}; // hotkeyTypeKey: Map - id: handler
	static packageKeyMap = {};
	static packageHandlers = {};
	static packageProps = {};
	
	static Initialize(props) {
		if (this.isInitialized) return;
		this.isInitialized = true;
		console.log(`⌨ Hokey | initializing`, props);
		
		const {
			keyMap,
		} = props;
		
		for (const typeKey of Object.keys(keyMap)) {
			
			this.hotkeys[typeKey] = new Map();
			this.packageKeyMap[typeKey] = keyMap[typeKey];
			this.packageHandlers[typeKey] = (event) => this.Handle(typeKey, event);
			
		}
		
		configure({
			// logLevel: 'verbose',
			ignoreTags: [], // ['input', 'select', 'textarea']
			ignoreEventsCondition: () => false,
		});
		
		
		this.packageProps = {
			keyMap: this.packageKeyMap,
			handlers: this.packageHandlers,
		}
		
		
		console.log(`⌨ Hokey | initialization complete`, this.packageProps);
	}
	
	static AddHandler(props) {
		const handlerId = ++this.id;
		
		for (const typeKey of Object.keys(props)) {
			
			if (this.hotkeys.hasOwnProperty(typeKey)) {
				this.hotkeys[typeKey].set(handlerId, props[typeKey]);
				console.log(`⌨ Hokey | added hotkey: ${typeKey} (${handlerId})`);
			} else {
				console.warn(`⌨ Hokey | unknown hotkey type: ${typeKey}`);
			}
			
		}
		
		return handlerId;
	};
	
	static RemoveHandler(props, handlerId) {
		for (const typeKey of Object.keys(props)) {
			
			if (!this.hotkeys.hasOwnProperty(typeKey)) continue;
			
			this.hotkeys[typeKey].delete(handlerId);
			console.log(`⌨ Hokey | removed hotkey: ${typeKey} (${handlerId})`);
			
		}
	}
	
	static Handle(typeKey, event) {
		const handlers = this.hotkeys[typeKey];
		
		// console.log(`⌨ Hokey | checking event handlers: ${typeKey}`);
		
		for (let handler of [...handlers.values()].reverse()) {
			
			const consumed = handler();
			
			if (consumed) {
				event.preventDefault();
				console.log(`⌨ Hokey | ${typeKey} consumed`);
				return;
			}
			
		}
	}
	
}


export class BaseHokeyHandler extends React.Component {
	
	handlerId;
	
	componentDidMount() {
		this.handlerId = HokeyManager.AddHandler(this.props);
	}
	
	componentWillUnmount() {
		HokeyManager.RemoveHandler(this.props, this.handlerId);
	}
	
	render() {
		return <React.Fragment/>;
	}
}

export class RootHokeyInitializer extends React.Component {
	
	constructor(props) {
		super(props);
		HokeyManager.Initialize(props);
	}
	
	render() {
		console.log(`⌨ Hokey | render initializer`, HokeyManager.packageProps);
		return <GlobalHotKeys {...HokeyManager.packageProps}/>;
	}
}
