// math
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math

import $j from './$j';

export class $m {
	
	static highest = Math.max;
	
	static lowest = Math.min;
	
	/**
	 * Min, VALUE, Max (default: Number.MAX_VALUE)
	 * @param min
	 * @param val
	 * @param max
	 * @returns {number|*}
	 */
	static minMax(min, val, max = Number.MAX_VALUE) {
		if (val < min) return min;
		if (val > max) return max;
		return val;
	}
	
	/**
	 * Takes desired index but clamped to array bounds 0..length-1
	 * @param desired
	 * @param array
	 * @returns {number}
	 */
	static minMaxIndex(desired, array) {
		return this.minMax(0, desired, array.length - 1);
	}
	
	static multiply(...args) {
		return args.flat().reduce(this.reducers.multiply);
	}
	
	// static multiply = (...args) => {
	// 	console.log(`___ MULTIPLY ___`);
	// 	console.log(args);
	// 	console.log(args.flat());
	//
	// 	return args.flat().reduce($m.reducers.multiply, 1);
	// };
	
	
	static add(...args) {
		return args.flat().reduce(this.reducers.add, 0);
	}
	
	
	static reducers = {
		multiply: (accumulator, value) => accumulator * value,
		add: (accumulator, value) => accumulator + value,
	};
	
	static signOnly(num) {
		if (num < 0) return -1;
		if (num > 0) return +1;
		return 0;
	}
	
	static round(num, decimals = 0) {
		if (decimals === undefined || decimals === null) return num;
		if (decimals === 0) return Math.round(num);
		
		const multi = Math.pow(10, decimals);
		return Math.round((num + Number.EPSILON) * multi) / multi;
	}
	
	static roundToNearest(num, nearest) {
		if (nearest === undefined || nearest === null || nearest === '') return num;
		return Math.ceil(num / nearest) * nearest;
	}
	
	static toRange(rangeOrVal) {
		return Array.isArray(rangeOrVal)
			? rangeOrVal
			: [0, rangeOrVal];
	}
	
	static fancyHourCalculation(minutes, minHours, roundUpTo, decimals) {
		console.log(`fancy HOURS ----  minutes: ${minutes}`);
		
		roundUpTo = $j.cast.number(roundUpTo, null);
		
		if (roundUpTo !== null) {
			if (roundUpTo === 0) roundUpTo = 60;
			minutes = $m.roundToNearest(minutes, roundUpTo);
		}
		console.log(`HOURS ----  minutes: ${minutes}`);
		
		minutes = $m.minMax(
			$j.cast.number(minHours) * 60,
			minutes,
		);
		console.log(`HOURS ----  minutes: ${minutes}`);
		console.log(`HOURS ----  hours: ${minutes / 60}`);
		console.log(`HOURS ----  hours: ${$m.round(minutes / 60, decimals)}`);
		
		return $m.round(
			minutes / 60,
			decimals
		);
	}
	
	static percent100(percent01, decimals = 0) {
		return this.round((percent01 * 100), decimals);
	}
	
	static random = {
		
		/** [inclusive, exclusive] */
		Int: (range = [0, 100]) => {
			const [min, max] = $m.toRange(range);
			return Math.floor(Math.random() * (max - min)) + min;
		},
		
		Element: (array) => array[$m.random.Int(array.length)],
		
		Bool: (chance100 = 50) => Math.random() <= (chance100 / 100),
		
		Array: {
			Int: (valueRange = [0, 100], lengthRange = [5, 20]) => {
				return $j.make.array(
					$m.random.Int(lengthRange),
					() => $m.random.Int(valueRange)
				);
			}
		},
	};
	
	/** distance (as crow flies) between two latitude/longitudes in Meters */
	static DistanceBetween(lat1, lng1, lat2, lng2, sphereRadiusM = 6378137) {
		const latDiff = $m.DegToRad(lat2 - lat1);
		const lngDiff = $m.DegToRad(lng2 - lng1);
		const arc =
			Math.sin(latDiff / 2) * Math.sin(latDiff / 2)
			+ Math.cos($m.DegToRad(lat1)) * Math.cos($m.DegToRad(lat2))
			* Math.sin(lngDiff / 2) * Math.sin(lngDiff / 2)
		;
		const line = 2 * Math.atan2(Math.sqrt(arc), Math.sqrt(1 - arc));
		return sphereRadiusM * line;
	}
	
	static DegToRad(degree) {
		return degree * (Math.PI / 180);
	}
	
	static MetersToMiles(meters) {
		return meters * 0.00062137;
	}
}