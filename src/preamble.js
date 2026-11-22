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
  return store(key)(val);
};

/** @type {<IT, IR, THAT>(f: (it: IT) => IR, g: (it: IR) => THAT) => (it: IT) => THAT} */
export const __joint = (f, g) => (it) => g(f(it));

//
// CORE STUFF
//

/** @type {(key: string) => <T>(value: T) => T} */
export const store = (key) => (value) => {
  __globalStore[key] = value;
  return value;
};

/** @type {(key: string) => any} */
export const read = (key) => {
  if (!(key in __globalStore)) {
    throw new Error(`Tried to pype out of empty valve '$${key}'`);
  }
  return __globalStore[key];
};

/** @type {<T>(tank: (it: undefined) => T) => T} */
export const exec = (tank) => tank(undefined);

/** @type {<T>(data: T) => T} */
export const identity = (data) => data;

/** @type {(data: any) => void} */
export const print = (data) => console.log(data);

/** @type {<T>(data: T) => T} */
export const peek = (data) => {
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
export const increment = (x) => x + 1;

/** @type {UnaryNum} */
export const decrement = (x) => x - 1;

/** @type {UnaryNum} */
export const round = (x) => Math.round(x);
/** @type {UnaryNum} */
export const floor = (x) => Math.floor(x);
/** @type {UnaryNum} */
export const ceil = (x) => Math.ceil(x);

/**
 * Add gets a special type because it can do strings too
 *
 * @type {(b: number | string) => (a: number | string) => (number | string)}
 */
export const add = (b) => (a) => a + b;

/** @type {BinaryNum} */
export const sub = (b) => (a) => a - b;

/** @type {BinaryNum} */
export const mul = (b) => (a) => a * b;

/** @type {BinaryNum} */
export const div = (b) => (a) => a / b;

/** @type {BinaryNum} */
export const mod = (b) => (a) => a % b;

//
// LOGIC STUFF
//

/**
 * @typedef {(x: boolean) => boolean} UnaryBool
 * @typedef {(a: boolean) => (b: boolean) => boolean} BinaryBool
 * @typedef {(a: any) => (b: any) => boolean} BinaryAny
 */

/** @type {UnaryBool} */
export const not = (x) => !x;

/** @type {BinaryAny} */
export const eq = (b) => (a) => a === b;

/** @type {BinaryAny} */
export const neq = (b) => (a) => a !== b;

/** @type {BinaryBool} */
export const gt = (b) => (a) => a > b;

/** @type {BinaryBool} */
export const gte = (b) => (a) => a >= b;

/** @type {BinaryBool} */
export const lt = (b) => (a) => a < b;

/** @type {BinaryBool} */
export const lte = (b) => (a) => a <= b;

/** @type {BinaryBool} */
export const and = (b) => (a) => a && b;

/** @type {BinaryBool} */
export const or = (b) => (a) => a || b;

//
// CONTROL FLOW STUFF
//

/** @type {<T>(onTrue: T) => <F>(onFalse: F) => (condition: boolean) => T | F} */
export const cond = (onTrue) => (onFalse) => (condition) =>
  condition ? onTrue : onFalse;

/** @type {<T>(onTrue: (it: undefined) => T) => <F>(onFalse: (it: undefined) => F) => (condition: boolean) => T | F} */
export const branch = (onTrue) => (onFalse) => (condition) =>
  condition ? onTrue(undefined) : onFalse(undefined);

/** @type {<T>(tank: (it: undefined) => T) => (condition: boolean) => undefined | T} */
export const when =
  (tank) => (condition) => (condition ? tank(undefined) : undefined);

/** @type {(tank: (it: number) => undefined) => (count: number) => undefined} */
export const repeat = (tank) => (count) => {
  for (let i = 0; i < count; i++) tank(i);
};

//
// LIST STUFF
//

/** @type {<O,N>(tank: (it: O) => N) => (list: O[]) => N[]} */
export const map = (tank) => (list) => list.map(tank);

/** @type {<T>(tank: (it: T) => boolean) => (list: T[]) => T[]} */
export const filter = (tank) => (list) => list.filter(tank);

/** @type {<V,A>(tank: (it: V) => (acc: A) => A) => (initial: A) => (list: V[]) => A} */
export const foldl = (tank) => (initial) => (list) =>
  list.reduce((acc, item) => tank(item)(acc), initial);

/** @type {<V,A>(tank: (it: V) => (acc: A) => A) => (initial: A) => (list: V[]) => A} */
export const foldr = (tank) => (initial) => (list) =>
  list.reduceRight((acc, item) => tank(item)(acc), initial);

// nice little alias
export const fold = foldl;

/** @type {<T>(tank: (it: T) => undefined) => (list: T[]) => undefined} */
export const each = (tank) => (list) => list.forEach(tank);

/** @type {(index: number) => <T>(list: T[]) => T} */
export const get = (index) => (list) => list[index];

/** @type {<T>(item: T) => (list: T[]) => T[]} */
export const push = (item) => (list) => [...list, item];

/** @type {(list: any[] | string) => number} */
export const length = (list) => list.length;

/** @type {(end: number) => (start: number) => number[]} */
export const range = (end) => (start) =>
  Array.from({ length: end - start }).map((_, index) => index + start);

//
// STRING STUFF
//

/** @type {(separator: string) => (str: string) => string[]} */
export const split = (separator) => (str) => str.split(separator);

/** @type {(separator: string) => (list: string[]) => string} */
export const join = (separator) => (list) => list.join(separator);

/** @type {(str: string) => string} */
export const trim = (str) => str.trim();

/** @type {(str: string) => string} */
export const upper = (str) => str.toUpperCase();

/** @type {(val: any) => string} */
export const stringify = (val) => val.toString();
