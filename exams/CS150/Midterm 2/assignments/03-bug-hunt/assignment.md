---
title: Bug Hunt: Grade Counter
class: GradeCounter
order: 3
difficulty: medium
estimate: 25 min
topics: compile errors, logic errors, scope, integer division, if / else-if
sample_tests: test1_mixed, test2_boundaries
---

This program is supposed to read **n**, then **n** exam scores (0-100), and print how many A/B/C/D/F grades there are, the average, and the highest score.

It contains **six bugs**: **2 compile errors** and **4 logic errors**. Fix each one and add a comment on that line explaining what was wrong:
```java
int n = scnr.nextInt();  // FIX: missing semicolon
```
Do not rewrite the program from scratch.

## Grade boundaries
| Grade | Score |
|---|---|
| A | 90 and above |
| B | 80-89 |
| C | 70-79 |
| D | 60-69 |
| F | below 60 |

## Input and output
```
5
95 82 71 58 64
```
```
A: 1
B: 1
C: 1
D: 1
F: 1
Average: 74.00
Highest: 95
```

## Hints
- Start with the compile errors. Click **Run** and read the first error: the line number shows where to look.
- After fixing one compile error, run again. javac often shows only some errors until earlier ones are fixed.
- How many times should the loop run for n scores? Check the loop condition.
- Where is `sum` declared? A variable declared inside the loop is reset on every pass and does not exist after the loop.
- Is a score of exactly 80 a B? Check the comparison operator in that branch.
- Look very closely at the line `if (score > highest);` and what that semicolon does.
- `sum / n` with two ints throws away the decimals before the result is stored in a double. Cast one of them to double.
