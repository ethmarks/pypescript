import * as _ from "../preamble.js";

/**
$fib
<| (1 |> lte)
|> (
	{ that
		<| (it |> (1 |> sub) |> $fib)
		|> ((it |> (2 |> sub) |> $fib) |> add)
	}
	|> (identity |> branchWith)
)

% 0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233, 377, 610, 987, 1597, 2584, 4181
(0 |> (20 |> range))
|> ($fib >> stringify |> map)
|> (", " |> join)
|> print
*/

_.__valve(
  "fib",
  _.branchWith(_.identity)((it) => {
    return _.add(_.read("fib")(_.sub(2)(it)))(
      _.read("fib")(_.sub(1)(it)),
    );
  })(_.lte(1)),
);

_.print(
  _.join(", ")(_.map(_.__joint(_.read("fib"), _.stringify))(_.range(20)(0))),
);
