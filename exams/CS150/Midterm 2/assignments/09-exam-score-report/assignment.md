---
title: Exam Score Report
class: ExamScoreReport
order: 9
difficulty: hard
estimate: 45 min
topics: arrays, methods, do-while input validation, switch, nested loops
sample_tests: test1_class, test2_invalid_scores, test4_bad_count
---

Complete every method marked `TODO`, then write `main`. Keep the method headers exactly as given.

## Input
The number of students **n**, then the scores.
- If n is not between 1 and 50, print `Number of students must be 1-50` and stop.
- `readScore` reads one score. If it is not 0-100, it prints `Invalid score: X, enter again` and reads again (use a do-while loop).

## Report
```
Scores: 88 92 75 64 59 95
Average: 78.83
Highest: 95
Lowest: 59
Above average: 3
Grade distribution:
A (2): * *
B (1): *
C (1): *
D (1): *
F (1): *
```
- **Above average** counts scores strictly greater than the average.
- Letter grades: A 90+, B 80-89, C 70-79, D 60-69, F below 60 (`letterGrade` uses an if / else-if / else chain).
- `gradeCounts` returns 5 counts (A, B, C, D, F) using `letterGrade` and a **switch**.
- `printHistogram` prints one line per grade with a ` *` for each student. A grade with no students prints just `D (0):`

## Hints
- Write and test one method at a time. The report only needs `main` to call them in order.
- `readScore`: `do { score = scnr.nextInt(); if (invalid) print; } while (invalid);` then return the score.
- `highest` and `lowest` should start from `scores[0]`, not 0, so they work for any scores.
- In `gradeCounts`, `switch (letterGrade(scores[i]))` with `case 'A': counts[0]++; break;` and so on.
- The histogram needs nested loops: the outer one over the 5 grades, the inner one printing " *" counts[g] times.
