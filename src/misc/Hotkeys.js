import React from 'react';
import {BaseHokeyHandler} from '../Bridge/Hokey';
import {observer} from 'mobx-react';

/// see:
/// https://craig.is/killing/mice
/// https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key/Key_Values

export const HOTKEY_MAP = {
	save: 'ctrl+s',
	prev: 'alt+<',
	next: 'alt+>',
	esc: 'esc',
};

type HotkeyTypes = {
	save?: () => boolean,
	prev?: () => boolean,
	next?: () => boolean,
	esc?: () => boolean,
}

@observer
export class Hokey extends React.Component<HotkeyTypes> {
	render() {
		return <BaseHokeyHandler {...this.props}/>
	}
}
