import * as _ from "../preamble.js";

/**
$greet <| {
	$number <| it
	that <| {
		$name <| it


		["Hi ", $name, "! Your number is ", $number]
		|> ("" |> (add |> fold))
		|> that
	}
}

% Hi Ethan! Your number is 42
"Ethan" |> (42 |> $greet) |> print
*/

_.__valve("greet", (it) => {
  _.__valve("number", it);
  return (it) => {
    _.__valve("name", it);

    return _.fold(_._add)("")([
      "Hi ",
      _.read("name"),
      "! Your number is ",
      _.read("number"),
    ]);
  };
});

_.print(_.__valve("greet", 42)("Ethan"));
