// This is the code that'll be injected into the compiler output. It has all the
// builtins and internals.

//
// INTERNALS
//

const __globalStore = Object.create(null);

/** @type {(key: string) => (val: any) => any} */
const __valve = (key) => (val) => {
  if (key in __globalStore && typeof __globalStore[key] === "function") {
    return __globalStore[key](val);
  }
  return _store(key)(val);
};

/** @type {(key: string) => any} */
const __read = (key) => {
  if (!(key in __globalStore)) {
    throw new Error(`Tried to pype out of empty valve '$${key}'`);
  }
  return __globalStore[key];
};

/** @type {<IT, IR, THAT>(f: (it: IT) => IR, g: (it: IR) => THAT) => (it: IT) => THAT} */
const __joint = (f, g) => (it) => g(f(it));

//
// CORE STUFF
//

/** @type {(key: string) => <T>(value: T) => T} */
const _store = (key) => (value) => {
  __globalStore[key] = value;
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

/** @type {UnaryNum} */
const _round = (x) => Math.round(x);
/** @type {UnaryNum} */
const _floor = (x) => Math.floor(x);
/** @type {UnaryNum} */
const _ceil = (x) => Math.ceil(x);

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
const _div = (b) => (a) => a / b;

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

/** @type {<T>(tank: (it: undefined) => T) => (condition: boolean) => undefined | T} */
const _when =
  (tank) => (condition) => (condition ? tank(undefined) : undefined);

/** @type {(tank: (it: number) => undefined) => (count: number) => undefined} */
const _repeat = (tank) => (count) => {
  for (let i = 0; i < count; i++) tank(i);
};

//
// LIST STUFF
//

/** @type {<O,N>(tank: (it: O) => N) => (list: O[]) => N[]} */
const _map = (tank) => (list) => list.map(tank);

/** @type {<T>(tank: (it: T) => boolean) => (list: T[]) => T[]} */
const _filter = (tank) => (list) => list.filter(tank);

/** @type {<V,A>(tank: (it: V) => (acc: A) => A) => (initial: A) => (list: V[]) => A} */
const _foldl = (tank) => (initial) => (list) =>
  list.reduce((acc, item) => tank(item)(acc), initial);

/** @type {<V,A>(tank: (it: V) => (acc: A) => A) => (initial: A) => (list: V[]) => A} */
const _foldr = (tank) => (initial) => (list) =>
  list.reduceRight((acc, item) => tank(item)(acc), initial);

// nice little alias
const _fold = _foldl;

/** @type {<T>(tank: (it: T) => undefined) => (list: T[]) => T[]} */
const _each = (tank) => (list) => list.forEach(tank);

/** @type {(index: number) => <T>(list: T[]) => T} */
const _get = (index) => (list) => list[index];

/** @type {<T>(item: T) => (list: T[]) => T} */
const _push = (item) => (list) => [...list, item];

/** @type {(list: any[] | string) => number} */
const _length = (list) => list.length;

/** @type {(end: number) => (start: number) => number[]} */
const _range = (end) => (start) =>
  Array.from({ length: end - start }).map((_, index) => index + start);

//
// STRING STUFF
//

/** @type {(separator: string) => (str: string) => string[]} */
const _split = (separator) => (str) => str.split(separator);

/** @type {(separator: string) => (list: string[]) => string} */
const _join = (separator) => (list) => list.join(separator);

/** @type {(str: string) => string} */
const _trim = (str) => str.trim();

/** @type {(str: string) => string} */
const _upper = (str) => str.toUpperCase();

/** @type {(val: any) => string} */
const _stringify = (val) => val.toString();
