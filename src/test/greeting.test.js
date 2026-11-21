import * as _ from "../preamble.js";

/**
$greet <| {
	$number <| it
	that <| {
		$name <| it

		that <| "Hi "
		|> ($name |> add)
		|> ("! Your number is " |> add)
		|> ($number |> add)
	}
}

% Hi Ethan! Your number is 42
"Ethan" |> (42 |> $greet) |> print
*/

_.__valve("greet", (it) => {
  _.__valve("number", it);
  return (it) => {
    _.__valve("name", it);

    return _._add(_.__read("number"))(
      _._add("! Your number is ")(_._add(_.__read("name"))("Hi ")),
    );
  };
});

_._print(_.__read("greet")(42)("Ethan"));
