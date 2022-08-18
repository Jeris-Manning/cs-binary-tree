import {DateTime, Duration, Interval} from 'luxon';
import $j from './misc/$j';

export type ThymeDt = DateTime;
export type ThymeDateKey = string;
export type ThymeTimeKey = string;
export type EpochMs = number;
export const isDt = (dt) => dt && dt.isValid;
export const badDt = (dt) => !dt || !dt.isValid;
export const NowMs = (): EpochMs => Date.now();
export const DiffMs = (startMs: EpochMs): EpochMs => Date.now() - startMs;

export default class thyme {
	
	/** startOf 'day' -> toMillis -> string */
	static toDateKey(dt: ThymeDt): ThymeDateKey {
		if (!dt || !dt.isValid) throw new Error(`invalid ThymeDt`);
		return String(dt.startOf('day').toMillis());
	}
	
	/** startOf 'minute' -> toMillis -> string */
	static toMinuteKey(dt: ThymeDt): ThymeTimeKey {
		if (!dt || !dt.isValid) throw new Error(`invalid ThymeDt`);
		return String(dt.startOf('minute').toMillis());
	}
	
	
	/**
	 * Shortcut for luxon DateTime.local()
	 * @returns {DateTime}
	 */
	static now() {
		return DateTime.local();
	}
	
	/**
	 * Start of today
	 * @returns {DateTime}
	 */
	static today() {
		return this.now().startOf('day');
	}
	
	/**
	 * Start of today (in smalldatetime format)
	 * @returns {string}
	 */
	static todaySdt() {
		return this.toSdt(this.today());
	}
	
	
	/**
	 * Shortcut for now converted to smalldatetime (mssql) string
	 * @returns {string}
	 */
	static nowSdt() {
		return thyme.toSdt(this.now());
	}
	
	static nowSql() {
		return thyme.toSql(this.now());
	}
	
	/**
	 * Now as 24 hour time: 13:30:23
	 * @param includeSeconds
	 * @returns {string}
	 */
	static nowTime(includeSeconds = true) {
		return thyme.now().toLocaleString(includeSeconds ? DateTime.TIME_24_WITH_SECONDS : DateTime.TIME_24_SIMPLE);
	}
	
	
	/**
	 * Converts luxon DateTime to smalldatetime (mssql) string
	 * @param luxonDt
	 * @returns {string}
	 */
	static toSdt(luxonDt) {
		return `${luxonDt.toISODate()} ${luxonDt.toLocaleString(DateTime.TIME_24_WITH_SECONDS)}`;
	}
	
	
	/**
	 * Converts smalldatetime (mssql) to luxon DateTime
	 * Note: source smallDateTime is actually a js Date
	 * @param smallDateTime
	 * @returns {DateTime}
	 */
	static fromSdt(smallDateTime) {
		if (!smallDateTime) return null;
		// console.log(`smallDateTime ${smallDateTime} is a ${smallDateTime.constructor.name}`)
		return DateTime.fromObject({
			year: smallDateTime.getFullYear(),
			month: smallDateTime.getMonth() + 1,
			day: smallDateTime.getDate(),
			hour: smallDateTime.getHours(),
			minute: smallDateTime.getMinutes(),
			second: smallDateTime.getSeconds(),
			// zone: 'utc'
		});
		// return DateTime.fromJSDate(smallDateTime); // works but slow af
		// return DateTime.fromISO(smallDateTime.toISOString()); // slowwww
	}
	
	static fromSql(timestamp) {
		return DateTime.fromSQL(timestamp);
	}
	
	static toSql(luxonDt) {
		return luxonDt.toSQL();
	}
	
	static fromJsDate(jsDate) {
		if (!jsDate) return null;
		return DateTime.fromJSDate(jsDate);
	}
	
	static toJsDate(dt) {
		if (badDt(dt)) return null;
		return dt.toJSDate();
	}
	
	/**
	 * Shortcut for luxon DateTime.fromISO(foo). Use when incoming JSON message.
	 * Must be stored as ISO (which it will be when sending a luxon DateTime)
	 * @param isoJson
	 * @returns {DateTime}
	 */
	static fromJson(isoJson) {
		return DateTime.fromISO(isoJson);
	}
	
	/**
	 * Fast parse of json DateTime stored as milliseconds
	 * @param millisJson
	 * @returns {DateTime}
	 */
	static fromJsonMillis(millisJson) {
		// console.log(`parsing jsonMillis: ${millisJson}`)
		// return DateTime.fromMillis(+millisJson);
		// return DateTime.fromMillis(~~millisJson);
		return DateTime.fromMillis(parseInt(millisJson, 10));
	}
	
	static addMs(dt: ThymeDt, ms: EpochMs): ThymeDt {
		return dt.plus(ms);
	}
	
	static fromMs(ms: EpochMs): ThymeDt {
		if (!ms) return null;
		return DateTime.fromMillis(ms);
	}
	
	static toMs(dt: ThymeDt): EpochMs {
		if (badDt(dt)) return 0;
		return dt.toMillis();
	}
	
	/**
	 * Shortcut: fromJson -> toSdt
	 * @param isoJson
	 * @returns {string}
	 */
	static fromJsonToSdt(isoJson) {
		return this.toSdt(this.fromJson(isoJson));
	}
	
	
	static fromSdtToFastJson(smallDateTime) {
		if (!smallDateTime) return null;
		return this.fromSdt(smallDateTime).toMillis();
	}
	
	static fromFastJson(fastJson) {
		if (!fastJson) return '';
		return DateTime.fromMillis(parseInt(fastJson, 10));
	}
	
	static fromFastJsonToSdt(fastJson) {
		return this.toSdt(this.fromFastJson(fastJson));
	}
	
	static toFastJson(dt) {
		return dt.toMillis();
	}
	
	static fromIso(iso) {
		return DateTime.fromISO(iso);
	}
	
	static toIso(dt) {
		return dt.toISO();
	}
	
	static fromObject(obj) {
		return DateTime.fromObject(obj);
	}
	
	/**
	 * startOf day
	 * @param dt
	 * @returns {DateTime|*}
	 */
	static toDateStart(dt) {
		if (badDt(dt)) return;
		return dt.startOf('day');
	}
	
	/**
	 * Returns date (start of day) as MS
	 * @param dt
	 * @returns {number}
	 */
	static toDateMs(dt) {
		return dt.startOf('day').toMillis();
	}
	
	static getRangeDates(start: ThymeDt, end: ThymeDt, cap: number = 365): ThymeDt[] {
		if (badDt(start)) return badDt(end) ? [] : [end.startOf('day')];
		if (badDt(end)) return badDt(start) ? [] : [start.startOf('day')];
		
		start = start.startOf('day');
		end = end.startOf('day');
		
		let daysBetween = this.daysBetween(start, end);
		if (daysBetween > cap) daysBetween = cap;
		
		let dates = [];
		
		for (let add = 0; add <= daysBetween; add++) {
			dates.push(start.plus({days: add}));
		}
		
		return dates;
	}
	
	/**
	 * Shortcut for luxon DateTime.plus
	 * @param addObj
	 * @returns {DateTime}
	 */
	static nowPlus(addObj) {
		return thyme.now().plus(addObj);
	}
	
	
	/**
	 * Shortcut for luxon DateTime.plus, converted to smalldatetime string
	 * @param addObj
	 */
	static nowPlusSdt(addObj) {
		return this.toSdt(this.nowPlus(addObj));
	}
	
	static nowPlusJson(addObj) {
		return this.toFastJson(this.nowPlus(addObj));
	}
	
	/**
	 * Shortcut for luxon DateTime.minus
	 * @param minusObj
	 * @returns {DateTime}
	 */
	static nowMinus(minusObj) {
		return thyme.now().minus(minusObj);
	}
	
	static nowMs() {
		return Date.now();
		// return thyme.now().toMillis();
	}
	
	static nowTiny() {
		return thyme.now().toFormat('mm.ss.SSS');
	}
	
	/**
	 * Shortcut for luxon DateTime.minus, converted to smalldatetime string
	 * @param minusObj
	 */
	static nowMinusSdt(minusObj) {
		return this.toSdt(this.nowMinus(minusObj));
	}
	
	static nowMinusJson(minusObj) {
		return this.toFastJson(this.nowMinus(minusObj));
	}
	
	static todayPlus(addObj) {
		return thyme.today().plus(addObj);
	}
	
	static todayMinus(minusObj) {
		return thyme.today().minus(minusObj);
	}
	
	static endOfToday() {
		return thyme.today().endOf('day');
	}
	
	static endOfTodayPlus(addObj) {
		return thyme.endOfToday().plus(addObj);
	}
	
	static endOfTodayMinus(minusObj) {
		return thyme.endOfToday().minus(minusObj);
	}
	
	/**
	 * Takes to <input/> values (date and time) to create a DateTime
	 * @param dateString
	 * @param timeString
	 * @param tz (e.g. 'America/Chicago')
	 */
	static fromInputs(dateString, timeString, tz) {
		if (tz) {
			return DateTime.fromISO(`${dateString}T${timeString}`, {
				zone: tz,
			});
		}
		return DateTime.fromISO(`${dateString}T${timeString}`);
	}
	
	static fromDateInput(dateString) {
		return DateTime.fromISO(dateString);
	}
	
	static fromTimeInput(timeString, tz) {
		if (tz) {
			return DateTime.fromISO(timeString, {
				zone: tz,
			});
		}
		return DateTime.fromISO(timeString);
	}
	
	static toDateInput(dt) {
		return thyme.nice.date.input(dt);
	}
	
	static toTimeInput(dt) {
		return thyme.nice.time.input(dt);
	}
	
	static toArray(dt: ThymeDt) {
		return [
			dt.year,
			dt.month,
			dt.day,
			dt.hour,
			dt.minute,
			dt.second,
		];
	}
	
	static isSoon(dt, add) {
		return dt <= this.nowPlus(add);
	}
	
	/**
	 * Now + duration <= dt, for example:
	 * Now = 10:00
	 * Duration = {minutes: 5}
	 * if dt is 9:58, false
	 * if dt is 9:55, true
	 * @param dt
	 * @param duration
	 * @returns {boolean}
	 */
	static hasElapsed(dt, duration) {
		return thyme.nowMinus(duration) >= dt;
	}
	
	static isSameDay(dt1, dt2) {
		if (!dt1 && !dt2) return true;
		if (!dt1 || !dt2) return false;
		return dt1.hasSame(dt2, 'day');
	}
	
	static sameYear(dt1, dt2) {
		if (!dt1 && !dt2) return true;
		if (!dt1 || !dt2) return false;
		return dt1.hasSame(dt2, 'year');
	}
	
	static isToday(dt) {
		return this.isSameDay(dt, this.now());
	}
	
	static isThisYear(dt) {
		return this.sameYear(dt, this.now());
	}
	
	static isThisYearOrWithin(dt, add) {
		return this.isThisYear(dt)
			|| dt <= this.nowPlus(add);
	}
	
	static isTomorrow(dt) {
		return this.isSameDay(dt, thyme.nowPlus({days: 1}));
	}
	
	/**
	 * Checks if hour and minute are same
	 * @param dt1
	 * @param dt2
	 */
	static isSameTime(dt1, dt2) {
		if (!dt1 && !dt2) return true;
		if (!dt1 || !dt2) return false;
		return dt1.hour === dt2.hour
			&& dt1.minute === dt2.minute;
	}
	
	static timeSince(dt) {
		return thyme.now().diff(dt);
	}
	
	static timeSinceString(dt) {
		return `${thyme.timeSince(dt).as('milliseconds')} ms`;
	}
	
	static logTimeSince(dt, label) {
		console.log(`${label} ${thyme.timeSince(dt)}ms`);
	}
	
	static timeBetween(dt1, dt2) {
		return dt2.diff(dt1);
	}
	
	static minutesBetween(dt1, dt2) {
		return dt2.diff(dt1).as('minutes');
	}
	
	static daysBetween(dt1, dt2) {
		return dt2.diff(dt1).as('days');
	}
	
	static hoursBetween(dt1, dt2) {
		return dt2.diff(dt1).as('hours');
	}
	
	static timeBetweenString(dt1, dt2) {
		return `${dt2.diff(dt1).as('milliseconds')} ms`;
	}
	
	static isBetween(dt, dtStart, dtEnd) {
		if (!dtStart || !dtEnd) return false;
		return Interval.fromDateTimes(dtStart, dtEnd).contains(dt);
	}
	
	static dayOfYear(dt) {
		return dt.ordinal;
	}
	
	static epoch = DateTime.fromMillis(0);
	
	/**
	 * Creates duration from object. Props:
	 *  milliseconds, seconds, minutes, hours, days, weeks, months, quarters, years
	 * @param obj
	 * @returns {Duration}
	 */
	static duration(obj) {
		return Duration.fromObject(obj);
	}
	
	static durationHoursMins(start, end) {
		if (!start || !end) return null;
		return end.diff(start, ['hours', 'minutes']).toObject();
	}
	
	/**
	 * Returns sorting function based on optional key
	 * @param key
	 * @returns {function(*, *): number}
	 */
	static sorter(key) {
		if (!key) return (a, b) => a - b;
		return (a, b) => a[key] - b[key];
	}
	
	/**
	 * Returns humanized relative offset, such as 'in 1 day'
	 * @param dt
	 * @param base (default: now)
	 * @returns {*}
	 */
	static relative(dt, base) {
		return dt.toRelative(base);
	}
	
	
	static minusWeekday(dt, weekdays) {
		if (weekdays > 5) throw Error(`I don't support this yet`);
		
		if (weekdays >= dt.weekday) {
			return dt.minus({days: weekdays + 2});
		}
		return dt.minus({days: weekdays});
	}
	
	/**
	 * Combines 2 dateTimes
	 * @param dateDt
	 * @param timeDt
	 * @returns {*}
	 */
	static joinDateTime(dateDt, timeDt) {
		return dateDt.set({
			hour: timeDt.hour,
			minute: timeDt.minute,
			second: timeDt.second,
		});
	}
	
	/**
	 * Combines 2 dateTimes
	 * @param dateDt
	 * @param timeDt
	 * @returns {*}
	 */
	static combine(dateDt, timeDt) {
		if (!dateDt || !timeDt) return null;
		return dateDt.set({
			hour: timeDt.hour,
			minute: timeDt.minute,
			second: timeDt.second,
		});
	}
	
	/**
	 * Returns new dateTime with hour set (using 1-12 am/pm)
	 * @param dt
	 * @param hour: 1-12
	 * @param isAm
	 * @returns {*}
	 */
	static withHour(dt, hour, isAm = true) {
		if (hour === 12) return dt.set({hour: isAm ? 0 : 12});
		return dt.set({
			hour: isAm ? (hour) : (hour + 12)
		});
	}
	
	static withMinute(dt, minute) {
		return dt.set({minute: minute});
	}
	
	static withAm(dt) {
		if (dt.hour < 12) return; // already AM
		return dt.set({hour: dt.hour - 12});
	}
	
	static withPm(dt) {
		if (dt.hour >= 12) return; // already PM
		return dt.set({hour: dt.hour + 12});
	}
	
	static getAmPmHour(dt) {
		const hour = dt.hour;
		if (hour === 0) return 12;
		if (hour <= 12) return hour;
		return hour - 12;
	}
	
	static isAm(dt) {
		return dt.hour < 12;
	}
	
	static isPm(dt) {
		return dt.hour >= 12;
	}
	
	static isWeekday(dt) {
		return dt && dt.weekday <= 5;
	}
	
	static isWeekend(dt) {
		return dt && dt.weekday >= 6;
	}
	
	static combineDateStartEnd(date, startTime, endTime) {
		if (!date || !startTime || !endTime) return null;
		
		const startDt = thyme.combine(date, startTime);
		let endDt = thyme.combine(date, endTime);
		
		if (endDt < startDt) endDt = endDt.plus({day: 1});
		
		return {
			start: startDt,
			end: endDt,
		};
	}
	
	/**
	 * Compares equality of oldDt and newDt using milliseconds
	 * @param oldDt
	 * @param newDt
	 * @returns {boolean}
	 */
	static hasChanged(oldDt, newDt) {
		if (newDt === undefined) return false;
		return (isDt(oldDt) ? oldDt.toMillis() : 0) !== (isDt(newDt) ? newDt.toMillis() : 0);
		// if (oldDt && newDt === undefined) return false;
		// return (oldDt ? oldDt.toMillis() : 0) !== (newDt ? newDt.toMillis() : 0);
	}
	
	/**
	 * Is evening or weekend
	 * Evening: (5pm to 8am)
	 * @param dt
	 */
	static isEw(dt) {
		if (thyme.isWeekend(dt)) return true;
		if (dt.hour < 8) return true;
		if (dt.hour > 17) return true;
		return false;
	}
	
	static mutateKeysFromFastJson(obj, keys) {
		if (!obj) return;
		
		keys.forEach(key => {
			if (obj[key]) {
				obj[key] = thyme.fromFastJson(obj[key]);
			}
		});
		
		return obj;
	}
	
	static mutate = {
		fromDbToEpoch: (obj, keys) => {
			if (!obj) return;
			keys.forEach(key => {
				if (obj[key]) {
					obj[key] = thyme.fromSdtToFastJson(obj[key]);
				}
			});
			return obj;
		},
		
		fromEpoch: (obj, keys) => {
			if (!obj) return;
			keys.forEach(key => {
				if (obj[key]) {
					obj[key] = thyme.fromFastJson(obj[key]);
				}
			});
			return obj;
		},
	};
	
	static fast = {
		pack: (dt) => {
			if (badDt(dt)) return dt;
			if (dt.isValid) return {thyme: thyme.toFastJson(dt)};
			if (dt instanceof Date) return {thyme: thyme.fromSdtToFastJson(dt)};
			return dt;
		},
		
		unpack: (thing) => {
			if (!thing) return null;
			switch (typeof thing) {
				case 'string':
				case 'number':
					return thyme.fromFastJson(thing);
				case 'object':
					return thyme.fromFastJson(thing.thyme);
			}
			return null;
		},
		
		obj: {
			pack: (obj, keys) => {
				keys.forEach(key => {
					if (obj.hasOwnProperty(key)) {
						obj[key] = thyme.fast.pack(obj[key]);
					}
				});
				return obj;
			},
			
			unpack: (obj) => {
				Object.keys(obj).forEach(key => {
					if ((obj[key] || {}).thyme) {
						obj[key] = thyme.fast.unpack(obj[key].thyme);
					}
				});
				return obj;
			},
		},
		
		array: {
			pack: (array, keys) => {
				array.forEach(o => thyme.fast.obj.pack(o, keys));
				return array;
			},
			
			unpack: (array) => {
				array.forEach(thyme.fast.obj.unpack);
				return array;
			},
		}
	};
	
	/**
	 * Tries to parse string into {hour, minute} object (24hr time)
	 * @param str
	 * @returns {null|{hour: number, minute: number}}
	 */
	static parseTimeString(str) {
		if (!str) return null;
		
		str = str.toLowerCase();
		
		let hour = 0;
		let minute = 0;
		
		const digits = str.match(/[0-9]/g);
		
		switch (digits.length) {
			case 1: // h
				hour = parseInt(digits[0]);
				break;
			case 2: // h h
				hour = parseInt(`${digits[0]}${digits[1]}`);
				break;
			case 3: // h m m
				hour = parseInt(digits[0]);
				minute = parseInt(`${digits[1]}${digits[2]}`);
				break;
			case 4: // h h m m
				hour = parseInt(`${digits[0]}${digits[1]}`);
				minute = parseInt(`${digits[2]}${digits[3]}`);
				break;
		}
		
		const isPm = str.includes('p') || str.includes('+');
		
		if (isPm) {
			if (hour < 12)
				hour += 12;
		} else {
			if (hour === 12)
				hour = 0;
		}
		
		console.log(`parseTimeString: ${str}, pm: ${isPm}, digits: [${digits.join(' ')}] --> ${hour}:${minute}`);
		
		return {hour: hour, minute: minute};
	}
	
	/**
	 * Tries to parse a string into {month, day, year} object
	 * @param originalString
	 * @returns {{month: number, year: number, day: number}|null}
	 */
	static parseDateString(originalString) {
		console.log(`thyme.parseDateString: ${originalString}`);
		if (!originalString) return null;
		
		let str = originalString.toLowerCase();
		
		const nowYear = thyme.now().year;
		const nowMonth = thyme.now().month;
		const nowDay = thyme.now().day;
		
		let year = nowYear;
		let month = nowMonth;
		let day = nowDay;
		
		if (str === 't' || str === 'today' || str === 'tod') {
			return {year: year, month: month, day: day};
		}
		if (str === 'tomorrow' || str === 'tmw' || str === 'tmrw' || str === 'tom') {
			const tomorrow = thyme.nowPlus({days: 1});
			return {year: tomorrow.year, month: tomorrow.month, day: tomorrow.day};
		}
		if (str === 'fortnight') {
			const fortnight = thyme.nowPlus({days: 14});
			return {year: fortnight.year, month: fortnight.month, day: fortnight.day};
		}
		if (str === 'fortnite') {
			return $j.stringMultiply(`😡😠`, 200);
		}
		
		// TODO: fix when month misspelled (should detect it as invalid)
		if (str.includes('jan')) month = 1;
		else if (str.includes('feb')) month = 2;
		else if (str.includes('mar')) month = 3;
		else if (str.includes('apr')) month = 4;
		else if (str.includes('may')) month = 5;
		else if (str.includes('jun')) month = 6;
		else if (str.includes('jul')) month = 7;
		else if (str.includes('aug')) month = 8;
		else if (str.includes('sep')) month = 9;
		else if (str.includes('oct')) month = 10;
		else if (str.includes('nov')) month = 11;
		else if (str.includes('dec')) month = 12;
		
		const parts = str.match(/[0-9]+/g);
		
		if (!parts) return null;
		if (parts.length === 1) {
			const single = parts[0];
			
			switch (single.length) {
				case 1:
				case 2:
					day = single;
					break;
				case 3:
					month = single.slice(0, 1);
					day = single.slice(1);
					if (month < nowMonth) year += 1;
					break;
				case 4:
					month = single.slice(0, 2);
					day = single.slice(2);
					if (month < nowMonth) year += 1;
					break;
				case 5:
					month = single.slice(0, 1);
					day = single.slice(1, 3);
					year = `20${single.slice(3)}`;
					break;
				case 6:
					month = single.slice(0, 2);
					day = single.slice(2, 4);
					year = `20${single.slice(4)}`;
					break;
				case 8:
					month = single.slice(0, 2);
					day = single.slice(2, 4);
					year = single.slice(4);
					break;
				default:
					return null;
			}
		} else if (parts.length === 2) {
			month = parts[0];
			day = parts[1];
			if (month < nowMonth) year += 1;
		} else if (parts.length === 3) {
			month = parts[0];
			day = parts[1];
			year = parts[2].length === 2 ? `20${parts[2]}` : parts[2];
		}
		
		
		if (month > 12 || day > 31) return null;
		
		return {year: year, month: month, day: day};
	}
	
	/* FORMATTING */
	
	// TODO: remove null checks?
	
	static nice = {
		
		/**
		 https://moment.github.io/luxon/docs/manual/formatting#table-of-tokens
		 */
		custom: (dt, format) => {
			if (!dt || !dt.isValid || !format) return '';
			return dt.toFormat(format);
		},
		
		date: {
			/**
			 * mm/dd/yyyy
			 * @param dt
			 * @param yearFirst (yyyy/mm/dd)
			 * @returns {string}
			 */
			short: (dt, yearFirst = false) => {
				if (badDt(dt)) return '';
				return yearFirst ? dt.toFormat('yyyy/MM/dd') : dt.toLocaleString(DateTime.DATE_SHORT);
			},
			
			/**
			 * January 1, 1970
			 * @param dt
			 * @returns {string}
			 */
			full: (dt) => dt && dt.toFormat(`LLLL d, y`),
			
			/**
			 * For html input
			 * @param dt
			 * @returns {string}
			 */
			input: (dt) => dt ? dt.toFormat('yyyy-MM-dd') : '',
			
			
			/**
			 * Sunday, January 1, 1970
			 * @param dt
			 * @param showYear
			 * @returns {string}
			 */
			details: (dt, showYear = true) => dt && dt.toFormat(`cccc, LLLL d${showYear ? `, y` : ''}`),
			details2: (dt, showYear = true) => dt && dt.toFormat(`cccc, LLL d${showYear ? `, y` : ''}`),
			
			/**
			 * Jan 1 || Jan 1, 1970
			 * @param dt
			 * @returns {string}
			 */
			brief: (dt) => {
				if (badDt(dt)) return '?';
				return thyme.isThisYear(dt)
					? dt.toFormat(`LLL d`)
					: dt.toFormat(`LLL d, y`);
			},
			
			fileName: (dt) => {
				if (badDt(dt)) return '';
				return dt.toFormat('yMMdd');
			},
			
			dayOfWeek: (dt) => {
				if (badDt(dt)) return '';
				return dt.toFormat('cccc');
			},
			
			/**
			 * January 1
			 * @param dt
			 * @returns {string}
			 */
			monthDay: (dt) => dt && dt.toFormat(`LLLL d`),
			
			/**
			 * Today || Tomorrow || Jan 1 || 2020 Jan
			 * @param dt
			 * @returns {string|string}
			 */
			pithy: (dt) => {
				if (badDt(dt)) return '';
				if (thyme.isToday(dt)) return 'Today';
				if (thyme.isTomorrow(dt)) return 'Tomorrow';
				if (thyme.isThisYearOrWithin(dt, {months: 5})) return dt.toFormat(`LLL d`);
				return dt.toFormat(`y LLL`);
			},
			
			/** yyMMdd */
			tinyKey: (dt) => dt.toFormat('yyMMdd'),
		},
		
		
		time: {
			/**
			 * 1:30:23 PM or 13:30:23
			 * @param dt
			 * @returns {string}
			 */
			full: (dt) => dt.toLocaleString(DateTime.TIME_WITH_SECONDS),
			
			/**
			 * 1:30 PM
			 * @param dt
			 * @returns {string}
			 */
			short: (dt) => dt ? dt.toLocaleString(DateTime.TIME_SIMPLE) : '',
			
			/**
			 * For html input
			 * @param dt
			 * @returns {string}
			 */
			input: (dt) => dt.toLocaleString(DateTime.TIME_24_SIMPLE),
			
			timeOfDay: (dt) => {
				if (badDt(dt)) return '';
				return timeOfDayByHour[dt.hour];
			}
		},
		
		dateTime: {
			/**
			 * 10/14/1983 1:30 PM
			 * @param dt
			 * @param use24
			 * @returns {string}
			 */
			short: (dt, use24 = false) => {
				if (badDt(dt)) return '';
				return `${thyme.nice.date.short(dt)} ${thyme.nice.time.short(dt, use24)}`;
			},
			
			/**
			 * isToday ? 1:30 PM : Jan 1 || Jan 1, 1970
			 * @param dt
			 * @returns {*|string}
			 */
			minimal: (dt) => {
				if (badDt(dt)) return '';
				return thyme.isToday(dt)
					? thyme.nice.time.short(dt)
					: thyme.nice.date.brief(dt);
			},
			
			/**
			 * Returns humanized relative offset, such as 'in 1 day'
			 * @param dt
			 * @param base
			 * @returns {string|null}
			 */
			relative: (dt, base) => {
				if (badDt(dt)) return '';
				return dt.toRelative(base);
			},
			
			/**
			 *
			 * @param dt
			 * @param includeAffix: true/false, include "in" or "ago"
			 * @returns {string|*}
			 */
			relativeSmall: (dt, includeAffix = true) => {
				if (badDt(dt)) return '';
				
				let result = dt.toRelative();
				
				if (!includeAffix) {
					result = result.replace('in ', '');
					result = result.replace(' ago', '');
				}
				
				result = result.replace('minute', 'min');
				
				return result;
			},
			
			/**
			 * isToday ? 1:30 PM : Jan 1 || Jan 1, 1970
			 * @param dt
			 * @returns {*|string}
			 */
			smallest: (dt) => {
				if (!dt || !dt.isValid) return '';
				if (thyme.isToday(dt)) return thyme.nice.time.short(dt);
				if (thyme.isThisYearOrWithin(dt, {months: 5})) return dt.toFormat(`M/dd`);
				return dt.toFormat(`M/d/yyyy`);
			},
			
			/**
			 * isToday ? 1:30 pm : January 1 || January 1, 1970
			 * @param dt
			 * @returns {*|string}
			 */
			less: (dt) => thyme.isToday(dt)
				? thyme.nice.time.short(dt).toLowerCase()
				: dt.toFormat(`LLLL d${!thyme.isThisYear(dt) ? `, y` : ''}`),
			
			/**
			 * 2021-01-29 19:31:58
			 */
			stamp: (dt) => dt.toFormat(`yyyy-MM-dd h:mm:ss a`),
			// stamp: (dt) => dt.toFormat(`yyyy-MM-dd HH:mm:ss`),
		},
		
		range: {
			/**
			 * 10:01a-5:05p
			 * @param startDt
			 * @param endDt
			 */
			little: (startDt, endDt) => {
				const start = thyme.nice.custom(startDt, 'h:mm') + (thyme.isAm(startDt) ? 'a' : 'p');
				const end = thyme.nice.custom(endDt, 'h:mm') + (thyme.isAm(endDt) ? 'a' : 'p');
				return `${start}-${end}`;
			}
		},
	};
	
	static reoccur = {
		repeats: {
			1: 'Daily',
			2: 'Weekly',
			3: 'every 2 Weeks',
			4: 'every 3 Weeks',
			5: 'Monthly',
		},
		
		/**
		 * Generates a series of dates.
		 * @param start
		 * @param count
		 * @param repeatType: day | week | month
		 * @param repeatCount: must be >=1
		 * @param weekdays (not supported for month repeat)
		 * @returns {[]}
		 */
		getDates: (start, count, repeatType = 'day', repeatCount, weekdays) => {
			console.log(`thyme.reoccur.getDates(${thyme.nice.dateTime.short(start)}, ${count} jobs, ${repeatType}, ${repeatCount} repeat, weekdays: ${weekdays})`);
			
			if (repeatCount < 1) throw new Error('thyme.reoccur.getDates must have >= 1 repeatCount');
			if (weekdays.length < 1) throw new Error('thyme.reoccur.getDates must have >= 1 weekdays.length');
			
			
			let dates = [];
			let current = start.startOf('day');
			let iters = 0;
			const maxIters = 100000;
			// const maxIters = 1000;
			
			switch (repeatType) {
				
				default:
				case 'day':
					
					while (dates.length < count && iters < maxIters) {
						iters++;
						
						current = current.plus({days: repeatCount});
						
						if (weekdays.includes(current.weekday)) {
							dates.push(current);
						}
					}
					
					break;
				
				
				case 'week':
					
					// TODO: shouldn't it be {week: repeatCount}
					let nextValidWeek = start.weekDay < 7 ? start.weekNumber : start.plus({week: repeatCount}).weekNumber;
					
					// console.log(`thyme.reoccur.week | currentWeek: ${start.weekNumber}, nextValidWeek: ${nextValidWeek}`);
					
					while (dates.length < count && iters < maxIters) {
						iters++;
						current = current.plus({days: 1});
						
						// console.log(`reoccur: iters@${iters}, current@${thyme.nice.date.short(current)}, weekNum@${current.weekNumber} === ${nextValidWeek}`);
						
						if (current.weekNumber === nextValidWeek) {
							if (weekdays.includes(current.weekday)) {
								dates.push(current);
							}
							
							if (current.weekday === 7) {
								nextValidWeek = current.plus({week: repeatCount}).weekNumber;
							}
						}
					}
					
					
					break;
				
				
				case 'month':
					while (dates.length < count && iters < maxIters) {
						iters++;
						
						current = current.plus({months: repeatCount});
						dates.push(current);
					}
					break;
			}
			
			if (iters >= maxIters) throw new Error(`thyme.reoccur.getDates hit max iterations and could not continue`);
			
			// console.log(`thyme.reoccur.getDates result:`, dates);
			
			return dates;
		},
	};
}

const timeOfDayByHour = {
	0: 'midnight',
	1: 'very late night',
	2: 'very late night',
	3: 'very late night',
	4: 'very early morning',
	5: 'very early morning',
	6: 'early morning',
	7: 'early morning',
	8: 'morning',
	9: 'morning',
	10: 'morning',
	11: 'late morning',
	12: 'noon',
	13: 'early afternoon',
	14: 'afternoon',
	15: 'afternoon',
	16: 'late afternoon',
	17: 'early evening',
	18: 'evening',
	19: 'evening',
	20: 'night',
	21: 'night',
	22: 'late night',
	23: 'late night',
};

export class Timer {
	start = thyme.nowMs();
	logs = [];
	
	// constructor(start = 'start') {
	// 	this.mark(start);
	// }
	
	mark = (name) => {
		this.logs.push({
			name: name,
			time: thyme.nowMs() - this.start,
		});
	};
	
	results = () => {
		return this.logs.map(log => `${log.name}@ ${log.time}ms`).join(', ');
	};
	
	total = (end = thyme.nowMs()) => {
		return end - this.start;
	};
	
	print = (prefix = '', suffix = '') => {
		console.log(`${prefix} ${this.results()} ${suffix}`);
	};
}