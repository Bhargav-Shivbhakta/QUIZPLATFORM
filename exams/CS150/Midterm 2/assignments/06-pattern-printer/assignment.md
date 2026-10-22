---
title: Pattern Printer
class: PatternPrinter
order: 6
difficulty: medium
estimate: 30 min
topics: nested for loops, methods, printf field width
sample_tests: test_n4, test_n1, test_n0
---

`main` is already written. Complete the **four methods** using nested `for` loops. Do not change the method headers or `main`.

For size **n** (1-9), the program prints four patterns separated by blank lines. Here is n = 4:

```
*
**
***
****

1234
123
12
1

   1   2   3   4
   2   4   6   8
   3   6   9  12
   4   8  12  16

   *
  ***
 *****
*******
```

1. `printRightTriangle(n)`: row r has r stars.
2. `printNumberTriangle(n)`: row r prints the digits 1 up to n - r + 1, with no spaces.
3. `printTimesTable(n)`: an n x n multiplication table; print each number with `printf("%4d", ...)`.
4. `printPyramid(n)`: row r has (n - r) spaces and then (2r - 1) stars. **Do not print spaces after the stars.**

## Hints
- Every pattern uses an outer loop for rows (`r` from 1 to n) and an inner loop for what goes on that row, then `System.out.println()` to end the row.
- For the number triangle, the inner loop runs from 1 to `n - r + 1` and prints the loop variable.
- `printf("%4d", value)` pads each number to 4 characters, which lines up the table.
- The pyramid needs two inner loops in each row: first the spaces, then the stars.
