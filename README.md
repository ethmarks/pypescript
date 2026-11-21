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

And here's the syntax that it _does_ have:

| Syntax | Name     | Purpose                                         |
| ------ | -------- | ----------------------------------------------- |
| `\|>`  | pype     | for pyping                                      |
| `<\|`  | backpype | for pyping, but the other direction             |
| `$x`   | valve    | for pyping values in and out of stores          |
| `{}`   | tank     | the things which are pyped between              |
| `>>`   | joint    | for composing tanks so you can pype them easier |

## Guide

Here's an example of some PypeScript code:

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

1. If the valve is currently storing a tank (basically a function), that value
   will be pyped into the tank.
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
Tanks are just JavaScript functions behind the scenes, so they're first-class
values just like in JS. To store a tank for reuse, just pype the whole thing
into a valve: `{ it |> (5 |> add) |> that } |> $addFive`.

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
