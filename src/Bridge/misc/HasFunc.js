/**
 * @return {boolean}
 */
export default function HasFunc(obj, key) {
	return typeof obj[key] === 'function';
}