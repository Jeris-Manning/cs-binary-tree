import React from 'react';
import {$m} from '../../Bridge/misc/$m';

const minLength = 4;
const prefixChance100 = 12;
const suffixChance100 = 12;

export class AprilFools2021_Handler {
	
	static Convert(text) {
		return;
		
		
		if (!text || text.length < minLength) return text;

		if ($m.random.Bool(prefixChance100)) {
			text = `${$m.random.Element(PREFIX)} ${text}`;
		}

		if ($m.random.Bool(suffixChance100)) {
			text = `${text} ${$m.random.Element(SUFFIX)}`;
		}

		return text;
	}
}

const PREFIX = [
	'Stupid',
	'Dumb',
	'Shitty',
	'Goddamn',
	'Crappy',
	'Effing',
	'Dumbass',
	`Fuckin'`,
	'Bullshit',
	'Ass',
	'Asshole',
	'Karen',
	'Sus',
	'Hella',
	'Lame',
	'Boring',
	`Heckin'`,
];

const SUFFIX = [
	'af',
	'ffs',
	'...ugh',
	'🙄',
	'👎',
	'jfc',
	'I guess',
	'but why',
	'😑',
	'😐',
	'😬',
	'🤬',
	'😡',
	'💩',
	'🖕',
	'🍑',
	'Shit',
	'Crap',
	'Bullshit',
	'Fuckery',
	'wtf',
	'amirite?',
	'Whatever',
	'idgaf',
];