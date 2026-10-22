---
title: Day Planner
class: DayPlanner
order: 2
difficulty: easy
estimate: 20 min
topics: switch statements, fall-through, break, default
sample_tests: test_day1, test_day6, test_day0
---

Read a day number (1 = Monday ... 7 = Sunday) and print three lines about that day.

## Input
One integer, for example `3`.

## Rules
- If the number is not between 1 and 7, print `Invalid day` and stop.
- **Line 1:** the day name: `Monday`, `Tuesday`, `Wednesday`, `Thursday`, `Friday`, `Saturday` or `Sunday`.
- **Line 2:** `Weekday` for days 1-5, `Weekend` for days 6-7.
- **Line 3:** the class schedule:

| Days | Print |
|---|---|
| Monday, Wednesday | `CS 150 lecture at 2:00 PM` |
| Tuesday, Thursday | `CS 150L lab at 10:00 AM` |
| Friday | `Office hours at 12:30 PM` |
| Saturday, Sunday | `No classes` |

You **must use switch statements**. For lines 2 and 3, group the cases that share an output using **fall-through**, for example:
```java
case 1:
case 3:
    System.out.println("...");
    break;
```

## Output for input 1
```
Monday
Weekday
CS 150 lecture at 2:00 PM
```

## Hints
- Use three separate `switch (day)` statements, one for each output line.
- Stacked labels like `case 1:` then `case 2:` with no code between them share the code that follows.
- Do not forget `break;` at the end of each group, or the next group runs too.
- `default:` can cover the last case (Sunday for line 1, the weekend for line 2).
