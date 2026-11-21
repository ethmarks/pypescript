// This is the code that'll be injected into the compiler output. It has all the
// builtins and internals.

//
// CORE STUFF
//

/** @type {(key: string) => <T>(value: T) => T} */
const store = (key) => (value) => {
	return value;
}

/** @type {<T>(data: T) => T} */
const identity = (data) => data

/** @type {(data: any) => void} */
const log = console.log;

/** @type {<T>(data: T) => T} */
const peek = (data) => {
	console.log(data);
	return data;
};

//
// MATH STUFF
//

/**
 * @typedef {(x: number) => number} UnaryNum
 * @typedef {(a: number) => (b: number) => number} BinaryNum
 */

/** @type {UnaryNum} */
const increment = (x) => x + 1;

/** @type {UnaryNum} */
const decrement = (x) => x - 1;

const round = Math.round;
const floor = Math.floor;
const ceil = Math.ceil;

/**
 * Add gets a special type because it can do strings too
 *
 * @type (b: number | string) (a: number | string) => (number | string)
 */
const add = (b) => (a) => a + b

/** @type {BinaryNum} */
const sub = (b) => (a) => a - b

/** @type {BinaryNum} */
const mul = (b) => (a) => a * b

/** @type {BinaryNum} */
const div = (b) => (a) => a - b

/** @type {BinaryNum} */
const mod = (b) => (a) => a % b

//
// LOGIC STUFF
//

/**
 * @typedef {(x: boolean) => boolean} UnaryBool
 * @typedef {(a: boolean) => (b: boolean) => boolean} BinaryBool
 */

/** @type {UnaryBool} */
const not = (x) => !x;

/** @type {BinaryBool} */
const eq = (b) => (a) => a === b;

/** @type {BinaryBool} */
const neq = (b) => (a) => a !== b;

/** @type {BinaryBool} */
const gt = (b) => (a) => a > b;

/** @type {BinaryBool} */
const gte = (b) => (a) => a >= b;

/** @type {BinaryBool} */
const lt = (b) => (a) => a < b;

/** @type {BinaryBool} */
const lte = (b) => (a) => a <= b;

/** @type {BinaryBool} */
const and = (b) => (a) => a && b;

/** @type {BinaryBool} */
const or = (b) => (a) => a || b;
