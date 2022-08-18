import React from 'react';
import {observer} from 'mobx-react';
import {Txt} from './bricksShaper';

function FieldLabel(props) {
	return (
		<Txt b marB={8} {...props}>{props.children}</Txt>
	);
}

/**
 * children
 * props
 * @returns {*}
 * @constructor
 */
export default observer(FieldLabel);
