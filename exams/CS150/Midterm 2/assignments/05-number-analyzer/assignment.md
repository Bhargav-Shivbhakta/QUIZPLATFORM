---
title: Number Analyzer
class: NumberAnalyzer
order: 5
difficulty: medium
estimate: 30 min
topics: sentinel loops, break, continue, min / max, counters
sample_tests: test1_basic, test2_negatives, test3_too_large
---

Read integers until **0** is entered, then print statistics about them.

## Rules
- A value **greater than 1000**: print `Value too large: X` and **stop reading** (use `break`). Values read before it still count.
- A **negative** value: count it as skipped and move on to the next value (use `continue`).
- Every other value counts: track the count, sum, minimum, maximum and how many are even.

## Output
If no values counted, print this line (no period at the end):
```
No numbers entered
```
Otherwise print:
```
Count: 4
Sum: 54
Minimum: 5
Maximum: 30
Average: 13.50
Even numbers: 2
```
In both cases finish with:
```
Skipped negatives: 0
```
The average uses two decimals: `printf("Average: %.2f%n", ...)`.

## Example
Input `8 -3 15 -20 4 0` prints:
```
Count: 3
Sum: 27
Minimum: 4
Maximum: 15
Average: 9.00
Even numbers: 2
Skipped negatives: 2
```

## Hints
- Read the first value before the loop, loop `while (value != 0)`, and read the next value at the end of the loop body.
- Before `continue`, read the next value. Otherwise the loop checks the same negative number forever.
- For the minimum and maximum, use the first counted value as the starting point: `if (count == 1 || value < min) min = value;`
- `sum / count` with ints loses the decimals. Use `(double) sum / count`.
- The "Skipped negatives" line prints even when no numbers were entered.
