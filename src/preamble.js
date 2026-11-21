// This is the code that'll be injected into the compiler output. It has all the
// builtins and internals.

//
// INTERNALS
//

const __globalStore = Object.create(null);

/**
 * This is an internal function, so it's fine if it's polyadic
 *
 * @type {(key: string, val: any) => any}
 */
export const __valve = (key, val) => {
  if (key in __globalStore && typeof __globalStore[key] === "function") {
    return __globalStore[key](val);
  }
  return _store(key)(val);
};

/** @type {(key: string) => any} */
export const __read = (key) => {
  if (!(key in __globalStore)) {
    throw new Error(`Tried to pype out of empty valve '$${key}'`);
  }
  return __globalStore[key];
};

/** @type {<IT, IR, THAT>(f: (it: IT) => IR, g: (it: IR) => THAT) => (it: IT) => THAT} */
export const __joint = (f, g) => (it) => g(f(it));

//
// CORE STUFF
//

/** @type {(key: string) => <T>(value: T) => T} */
export const _store = (key) => (value) => {
  __globalStore[key] = value;
  return value;
};

/** @type {<T>(data: T) => T} */
export const _identity = (data) => data;

/** @type {(data: any) => void} */
export const _print = (data) => console.log(data);

/** @type {<T>(data: T) => T} */
export const _peek = (data) => {
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
export const _increment = (x) => x + 1;

/** @type {UnaryNum} */
export const _decrement = (x) => x - 1;

/** @type {UnaryNum} */
export const _round = (x) => Math.round(x);
/** @type {UnaryNum} */
export const _floor = (x) => Math.floor(x);
/** @type {UnaryNum} */
export const _ceil = (x) => Math.ceil(x);

/**
 * Add gets a special type because it can do strings too
 *
 * @type (b: number | string) (a: number | string) => (number | string)
 */
export const _add = (b) => (a) => a + b;

/** @type {BinaryNum} */
export const _sub = (b) => (a) => a - b;

/** @type {BinaryNum} */
export const _mul = (b) => (a) => a * b;

/** @type {BinaryNum} */
export const _div = (b) => (a) => a / b;

/** @type {BinaryNum} */
export const _mod = (b) => (a) => a % b;

//
// LOGIC STUFF
//

/**
 * @typedef {(x: boolean) => boolean} UnaryBool
 * @typedef {(a: boolean) => (b: boolean) => boolean} BinaryBool
 */

/** @type {UnaryBool} */
export const _not = (x) => !x;

/** @type {BinaryBool} */
export const _eq = (b) => (a) => a === b;

/** @type {BinaryBool} */
export const _neq = (b) => (a) => a !== b;

/** @type {BinaryBool} */
export const _gt = (b) => (a) => a > b;

/** @type {BinaryBool} */
export const _gte = (b) => (a) => a >= b;

/** @type {BinaryBool} */
export const _lt = (b) => (a) => a < b;

/** @type {BinaryBool} */
export const _lte = (b) => (a) => a <= b;

/** @type {BinaryBool} */
export const _and = (b) => (a) => a && b;

/** @type {BinaryBool} */
export const _or = (b) => (a) => a || b;

//
// CONTROL FLOW STUFF
//

/**
 * It's annoying that it doesn't let me name a variable "if".
 *
 * @type {<T>(onTrue: T) => <F>(onFalse: F) => (condition: boolean) => T | F}
 */
export const _if = (onTrue) => (onFalse) => (condition) =>
  condition ? onTrue : onFalse;

/** @type {<T>(tank: (it: undefined) => T) => (condition: boolean) => undefined | T} */
export const _when =
  (tank) => (condition) => (condition ? tank(undefined) : undefined);

/** @type {(tank: (it: number) => undefined) => (count: number) => undefined} */
export const _repeat = (tank) => (count) => {
  for (let i = 0; i < count; i++) tank(i);
};

//
// LIST STUFF
//

/** @type {<O,N>(tank: (it: O) => N) => (list: O[]) => N[]} */
export const _map = (tank) => (list) => list.map(tank);

/** @type {<T>(tank: (it: T) => boolean) => (list: T[]) => T[]} */
export const _filter = (tank) => (list) => list.filter(tank);

/** @type {<V,A>(tank: (it: V) => (acc: A) => A) => (initial: A) => (list: V[]) => A} */
export const _foldl = (tank) => (initial) => (list) =>
  list.reduce((acc, item) => tank(item)(acc), initial);

/** @type {<V,A>(tank: (it: V) => (acc: A) => A) => (initial: A) => (list: V[]) => A} */
export const _foldr = (tank) => (initial) => (list) =>
  list.reduceRight((acc, item) => tank(item)(acc), initial);

// nice little alias
export const _fold = _foldl;

/** @type {<T>(tank: (it: T) => undefined) => (list: T[]) => T[]} */
export const _each = (tank) => (list) => list.forEach(tank);

/** @type {(index: number) => <T>(list: T[]) => T} */
export const _get = (index) => (list) => list[index];

/** @type {<T>(item: T) => (list: T[]) => T} */
export const _push = (item) => (list) => [...list, item];

/** @type {(list: any[] | string) => number} */
export const _length = (list) => list.length;

/** @type {(end: number) => (start: number) => number[]} */
export const _range = (end) => (start) =>
  Array.from({ length: end - start }).map((_, index) => index + start);

//
// STRING STUFF
//

/** @type {(separator: string) => (str: string) => string[]} */
export const _split = (separator) => (str) => str.split(separator);

/** @type {(separator: string) => (list: string[]) => string} */
export const _join = (separator) => (list) => list.join(separator);

/** @type {(str: string) => string} */
export const _trim = (str) => str.trim();

/** @type {(str: string) => string} */
export const _upper = (str) => str.toUpperCase();

/** @type {(val: any) => string} */
export const _stringify = (val) => val.toString();
