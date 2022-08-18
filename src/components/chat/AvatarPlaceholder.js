export default class AvatarPlaceholder {
	static Get(firstName, lastName) {
		if (!firstName) return emojiByLetter.z;
		return emojiByLetter[firstName.slice(0, 1).toLowerCase()] || emojiByLetter.z;
	}
	
	static GetInitials(firstName = '', lastName = '') {
		return `${firstName.slice(0, 1)} ${lastName.slice(0, 1)}`
	}
}

const emojiByLetter = {
	a: '😀',
	b: '😁',
	c: '😂',
	d: '🤣',
	e: '😃',
	f: '😄',
	g: '😅',
	h: '😆',
	i: '😉',
	j: '😊',
	k: '😋',
	l: '😎',
	m: '😍',
	n: '🥰',
	o: '😚',
	p: '🙂',
	q: '🤗',
	r: '🤩',
	s: '🤔',
	t: '😑',
	u: '🙄',
	v: '😏',
	w: '😛',
	x: '😜',
	y: '😝',
	z: '🙃',
};