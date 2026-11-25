# PypeScript

PypeScript is a language that transpiles to JavaScript and uses pipes.

## About

Did you know that
[JavaScript will get a pipe operator](https://github.com/tc39/proposal-pipeline-operator)?
Well, eventually. It's been over a decade, and JavaScript still has zero pipes.
In an attempt to restore balance to the universe, PypeScript is a language which
is _only_ pipes, which are called "pypes".

> [!NOTE]
> The name is a portmanteau of "pype" and "TypeScript". It doesn't actually have
> anything to do with TypeScript or types, but TypeScript fits the portmanteau
> better than JavaScript, so whatever. It also has nothing to do with Python,
> despite the "py" prefix.

Here are some examples of syntax that PypeScript does _not_ have: `let`,
`const`, `if`, `else`, `for`, `while`, `function f() {}`, `f()`, `+`, `-`, `=`,
`===`, et cetera.

And here's all of the syntax that it _does_ have:

| Syntax          | Name      | Purpose                                         |
| --------------- | --------- | ----------------------------------------------- |
| `\|>`           | pype      | for pyping                                      |
| `<\|`           | backpype  | for pyping, but the other direction             |
| `$x`            | valve     | for pyping values in and out of stores          |
| `{}`            | tank      | the things which are pyped between              |
| `>>`            | joint     | for composing tanks so you can pype them easier |
| `%`             | comment   | the only thing that isn't a pype                |
| there's a bunch | built-ins | special tanks to pype between                   |

## Guide

Here's a simple example of some PypeScript code:

```pype
5 |> $num

$doubleAndPrint <| {
	2 |> mul |> $doubler
	it |> $doubler |> $numButDoubled
	$numButDoubled |> print
	$numButDoubled |> that
}

$num |> $doubleAndPrint |> $numReturnedByTheTankIdk
$numReturnedByTheTankIdk |> print
```

PypeScript's syntax is a little different from C-like languages. I'm just going
to explain the major differences from something like JavaScript.

### Pypes

> There shall be pypes.
>
> -- Commandment #1, _The Way of the Pype_

Pypes are rather important in PypeScript. Shocking, I know. Pypes do everything
from storing variables, invoking functions, and moving data around.

Pypes are fairly simple to understand. `5 |> print` takes `5` and applies it to
`print`. That's all there is to it. `5 |> increment |> increment |> print`
evaluates left-to-right, pyping 5 into increment, then into another increment,
and then printing the resulting 7.

Backpypes are just syntactic sugar for pypes that go in the other direction. For
example: `print <| 5`. They do have one quirk, though: they have very low
operator precedence, so you can imagine that it puts parentheses around both
sides of it, so everything on either side has to finish before it acts. `print
<| 5 |> (1 |> add)` will evaluate `5 |> (1 |> add)` before pyping into `print`,
even though the backpype comes first.

### Valves

> There shall be no `let`.
>
> -- Commandment #2, _The Way of the Pype_

Instead of variables, you use valves, which do basically the same thing but
slightly different. If you pype a value out of a valve, it will read the stored
value from that valve and put it onto the pypeline.

To write a valve, just prefix the name of the valve with a `$`, like so: `$num`.

If you pype a value into a valve, one of two things can happen:

1. If the valve is currently storing a [tank](#tanks), that value will be pyped
   into the tank.
2. In literally any other case, the value will be stored in the valve.

> [!NOTE]
> Behind the scenes, valves just use the `store` builtin. `5 |> $num` is the
> same as `5 |> ("num" |> store)`. If you ever need to overwrite a valve that is
> currently storing a tank, you can just use `store` directly.

### Tanks

> There shall be no [polyadicity](https://en.wikipedia.org/wiki/Arity).
>
> -- Commandment #3, _The Way of the Pype_

Instead of functions, you use tanks, which do basically the same thing but
slightly different. The biggest difference is that all tanks are
[unary](https://en.wikipedia.org/wiki/Unary_function), meaning they only ever
take one argument.

On the definition side, this eliminates the need to give parameters unique
names. So, for ergonomics, PypeScript automatically gives the single parameter
of every tank the same name: `it`. Whatever is pyped into a tank, you can access
it as `it`.

To return a value from a tank, pype it into `that`. `that` uses JavaScript
`return` behind the scenes, so you can use `that` to do early returns for
control flow.

On the usage side, this eliminates the need to specify argument order, which
means there's no need to use parentheses to call a tank. Just pype the value
directly into the tank, like so: `5 |> print`.

To write a tank, just use curly braces, like so: `{ it |> (5 |> add) |> that }`.
Tanks are just JavaScript arrow functions behind the scenes, so they're
first-class values just like in JS. To store a tank for reuse, just pype the
whole thing into a valve: `{ it |> (5 |> add) |> that } |> $addFive`.

> [!NOTE]
>
> Sometimes, you need to access multiple parameters from one tank. You can do
> this using [currying](https://en.wikipedia.org/wiki/Currying).
>
> Here's an example. `greet` is a tank which inputs a number and outputs another
> tank, which inputs a name and outputs the final greeting. Note that I had to
> pype the `it`s into valves, because otherwise I wouldn't be able to
> differentiate between the top level `it` and the bottom level `it`.
>
> ```pype
> $greet <| {
> 	$number <| it
> 	that <| {
> 		$name <| it
> 		
> 		that <| "Hi "
> 		|> ($name |> add)
> 		|> ("! Your number is " |> add)
> 		|> ($number |> add)
> 	}
> }
>
> % Hi Ethan! Your number is 42
> "Ethan" |> (42 |> $greet) |> print
> ```

### Joints

Joints are just a little convenience feature so that you don't have to make a
helper tank just to make a pypeline. They let you compose tanks together without
needing to provide the actual data input.

While we're at it, note you can split pypelines across multiple lines as long as
each line starts with a pype, backpype, or joint. Also, single-line comments are
written with `%`.

Here's an example of what joints simplify:

```pype
% Tedious, explicit method using a helper tank
$pypeline <| { 
	it 
	|> $parseArgs 
	|> $validateArgs 
	|> $executeArgs 
	|> $formatResult 
	|> that 
}

% Slightly more convenient method using joints
$pypeline 
<| $parseArgs 
>> $validateArgs 
>> $executeArgs 
>> $formatResult
```

## Builtins

Pypescript builtins are just tanks. The only difference between a builtin tank
and a user-defined tank is that you don't need a valve to access builtin tanks
(i.e. `5 |> print` instead of `5 |> $print`).

Behind the scenes, builtins are just JavaScript functions which are injected
into the compiler output before your code. You can see a complete list of all
builtins and their exact implementations in [`preamble.js`](./src/preamble.js).

### Core

- `store`: Stores a value in a store. The current implementation is
  globally-scoped, but I plan to make it lexically-scoped eventually. It's a
  curried binary function; the first argument is the key (`string`), and the
  second is the value (`any`). It returns the value afterwards, so you can use
  it in the middle of a pypeline if you want. For storing ordinary values, it's
  usually more ergonomic to just pype into a valve, but the only way to
  overwrite a valve which contains a tank is to use `store` directly. Example:
  `5 |> ("num" |> store)` will store `5` in `$num`, which is equivalent to `5 |>
  $num`.
- `read`: Retrieves a value from a store. Like with `store`, it's currently
  globally-scoped but I intend to make it lexically-scoped eventually. It's a
  unary function whose only argument is the key (`string`), and it returns the
  value from that store. If the store is empty, it returns `undefined`. It
  behaves identically to just pyping out of a valve, so the only reason to use
  `read` directly is if you're using dynamically-named stores. Example: `"num"
  |> read |> print` will read the value of `$num` and print it, which is
  equivalent to `$num |> print`.
- `exec`: Pypes `undefined` into a tank and returns its output. Useful if you
  have a tank which doesn't reference its `it` parameter, and you want to
  execute it for its side-effects or for its output. It's a unary function whose
  only argument is the tank (`(it: undefined) => any`) to execute. Example: `{5
  |> that} |> exec |> print`.
- `print`: Prints the input to the console. Just uses `console.log` behind the
  scenes.
- `peek`: Exactly the same as `print`, but it returns the original value, so you
  can put it in the middle of a pypeline.

### Math

> [!NOTE]
> Pypescript builtins are always data-last, so for binary operations (e.g.
> subtraction), you input the right operand (e.g. the
> [subtrahend](https://www.merriam-webster.com/dictionary/subtrahend)) first and
> the left operand (e.g. the
> [minuend](https://www.merriam-webster.com/dictionary/minuend)) second. For
> example:
>
> ```pype
> % 5 - 3
> 5 |> (3 |> sub) |> $fiveMinusThree
>
> % It helps if you break it into parts
> 3 |> sub |> $subtractThree
> 5 |> $subtractThree |> $fiveMinusThree
> ```

Arithmetic:

- `increment`: Increments x (`number`) by 1. Equal to `1 |> add`.
- `decrement`: Decrements x (`number`) by 1. Equal to `1 |> sub`.
- `round`: Rounds x (`number`) to the nearest integer.
- `floor`: Rounds x (`number`) down to the next-lowest integer.
- `ceil`: Rounds x (`number`) up to the next-highest integer.
- `add`: Adds two numbers. Curried binary function, which takes addend b
  (`number`) first and then augend a (`number`), then performs a + b.
- `sub`: Subtracts two numbers. Curried binary function, which takes subtrahend
  b (`number`) first and then minuend a (`number`), then performs a - b.
- `mul`: Multiplies two numbers. Curried binary function, which takes multiplier
  b (`number`) first and then multiplicand a (`number`), then performs a * b.
- `div`: Divides two numbers. Curried binary function, which takes divisor b
  (`number`) first and then dividend a (`number`), then performs a / b.
- `mod`: Divides two numbers and returns the remainder. Curried binary function,
  which takes modulus b (`number`) first and then dividend a (`number`), then
  performs a % b.
- `pow`: Exponentiates two numbers. Curried binary function, which takes power b
  (`number`) first and then base a (`number`), then performs a ** b.
- `root`: Root of two numbers. Curried binary function, which takes degree b
  (`number`) first and then radicand a (`number`), then performs a ** (1/b). Use
  `2 |> root` to take the square root.
- `log`: Logarithm of two numbers. Curried binary function, which takes argument
  b (`number`) first and then base a (`number`), then performs log_b(a). Use `10
  |> log` to take the common logarithm, `2 |> log` to take the binary logarithm,
  and `"nat" |> log` (or `euler |> exec |> log`) to take the natural logarithm.

Trig:

- `sin`: Sine of x (`number`).
- `cos`: Cosine of x (`number`).
- `tan`: Tangent of x (`number`).
- `asin`: Arcsine of x (`number`).
- `acos`: Arccosine of x (`number`).
- `atan`: Arctangent of x (`number`).

Constants:

> [!NOTE]
> I made the constants be thunks rather than direct `number`s, because I wanted
> to make it consistent that all builtins are tanks

- `euler`: Thunk which returns Euler's number.
- `pi`: Thunk which returns pi.

### Control flow

- `identity`: Immediately returns whatever is pyped into it. Equivalent to `{it
  |> that}`. If you're using `identity`, you'll almost certainly be passing it
  around rather than pyping directly into it, because it does literally nothing
  if you just use it in the middle of a pypeline like `5 |> identity |> print`.
- `thunk`: Converts a value into a [thunk](https://en.wikipedia.org/wiki/Thunk):
  a tank which doesn't reference its `it` and just returns the original value.
  If you pair `thunk` with `exec` in a pypeline, they cancel out: `5 |> thunk |>
  exec |> print`.

## Example

Here's a more complex example, which calculates the first 20 fibonacci numbers:

```pype
$fib
<| (1 |> lte)
|> (
	{ that
		<| (it |> (1 |> sub) |> $fib)
		|> ((it |> (2 |> sub) |> $fib) |> add)
	}
	|> (identity |> branchWith)
)

(0 |> (20 |> range))
|> ($fib >> stringify |> map)
|> (", " |> join)
|> print

% 0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233, 377, 610, 987, 1597, 2584, 4181
```

Don't worry, I'll walk you through each section.

```pype
$fib
<| (1 |> lte)
```

In the first bit, I set up a backpype into the `$fib` valve. The first step of
the pypeline is a predicate that checks if an input is less than or equal to 1.
`lte` is a curried builtin, so it's still waiting for one more input before it
evaluates.

```pype
|> (
	{ that
		<| (it |> (1 |> sub) |> $fib)
		|> ((it |> (2 |> sub) |> $fib) |> add)
	}
	|> (identity |> branchWith)
)
```

This is the bulk of the tank's logic. Notice towards the end that the last step
is `branchWith`. `branchWith` is a curried builtin which inputs an onTrue tank,
an onFalse tank, and a predicate tank (in that order), and outputs a tank which
takes an input, then applies it to either the onTrue or onFalse tank, depending
on whether the predicate returns true or false.

In this case, the onTrue tank is `identity`, which is a builtin which just
returns whatever input you give it. The onFalse tank adds together the result of
`$fib` with n-1 and n-2. And remember that the predicate is the `(1 |> lte)`
from earlier.

```pype
(0 |> (20 |> range))
|> ($fib >> stringify |> map)
|> (", " |> join)
|> print
```

This is the main pypeline. `(0 |> (20 |> range))` generates a list of all
integers from 0 to 20 (technically 0 to 19 since the endpoint isn't included).
Then that list is pyped into a map. The tank that I pype into the map is a joint
of `$fib >> stringify`, or in other words 'run the input through fib, then
stringify it'. Then that mapped list is pyped into `(", " |> join)`, which just
joins each element with commas. And finally, the result is printed.

For context, here's a semi-literal translation of the code into JavaScript (it's
a bit different structurally, because vanilla JS doesn't have anything like
`branchWith`):

```js
function fib(it) {
  return (it <= 1)
    ? it
    : fib(it - 1) + fib(it - 2);
}

console.log(
  [...Array(20).keys()]
    .map((n) => fib(n).toString())
    .join(", "),
);
```
