---
title: Loop Converter
class: LoopConverter
order: 4
difficulty: medium
estimate: 25 min
topics: converting for to while and do-while, continue, edge cases
sample_tests: test_n5, test_n0
---

This program works, but it uses three `for` loops. Rewrite it so that:

- **Part 1** uses a `while` loop
- **Part 2** uses a `do-while` loop
- **Part 3** uses a `while` loop (keep the `continue`)

The output must stay **exactly the same for every input**, including `0` and negative numbers. Your final program must not contain the keyword `for`.

## Output for input 5
```
Squares: 1 4 9 16 25
Countdown sum: 9
Skip threes: 1 2 4 5
```

## Output for input 0
```
Squares:
Countdown sum: 0
Skip threes:
```

## Hints
- Converting `for (init; cond; update) body` to while: put `init` before the loop and `update` at the end of the body.
- A do-while body always runs at least once. For n = 0 or a negative n the original loop runs zero times, so protect the do-while with an `if`.
- In Part 3, `continue` in a while loop jumps straight back to the condition and **skips** your update. Update the counter **before** `continue`, or the loop never ends.
- Click **Run tests**: the n = 0 and n = -3 tests catch the edge cases.
