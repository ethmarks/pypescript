// This is the code that'll be injected into the compiler output. It has all the
// builtins and internals.

//
// CORE STUFF
//

/** @type {(key: string) => <T>(value: T) => T} */
const _store = (key) => (value) => {
  return value;
};

/** @type {<T>(data: T) => T} */
const _identity = (data) => data;

/** @type {(data: any) => void} */
const _print = (data) => console.log(data);

/** @type {<T>(data: T) => T} */
const _peek = (data) => {
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
const _increment = (x) => x + 1;

/** @type {UnaryNum} */
const _decrement = (x) => x - 1;

const _round = Math.round;
const _floor = Math.floor;
const _ceil = Math.ceil;

/**
 * Add gets a special type because it can do strings too
 *
 * @type (b: number | string) (a: number | string) => (number | string)
 */
const _add = (b) => (a) => a + b;

/** @type {BinaryNum} */
const _sub = (b) => (a) => a - b;

/** @type {BinaryNum} */
const _mul = (b) => (a) => a * b;

/** @type {BinaryNum} */
const _div = (b) => (a) => a - b;

/** @type {BinaryNum} */
const _mod = (b) => (a) => a % b;

//
// LOGIC STUFF
//

/**
 * @typedef {(x: boolean) => boolean} UnaryBool
 * @typedef {(a: boolean) => (b: boolean) => boolean} BinaryBool
 */

/** @type {UnaryBool} */
const _not = (x) => !x;

/** @type {BinaryBool} */
const _eq = (b) => (a) => a === b;

/** @type {BinaryBool} */
const _neq = (b) => (a) => a !== b;

/** @type {BinaryBool} */
const _gt = (b) => (a) => a > b;

/** @type {BinaryBool} */
const _gte = (b) => (a) => a >= b;

/** @type {BinaryBool} */
const _lt = (b) => (a) => a < b;

/** @type {BinaryBool} */
const _lte = (b) => (a) => a <= b;

/** @type {BinaryBool} */
const _and = (b) => (a) => a && b;

/** @type {BinaryBool} */
const _or = (b) => (a) => a || b;

//
// CONTROL FLOW STUFF
//

/**
 * It's annoying that it doesn't let me name a variable "if".
 *
 * @type {<T>(onTrue: T) => <F>(onFalse: F) => (condition: boolean) => T | F}
 */
const _if = (onTrue) => (onFalse) => (condition) =>
  condition ? onTrue : onFalse;
