---
title: Temperature Tracker
class: TemperatureTracker
order: 7
difficulty: medium
estimate: 30 min
topics: arrays, methods with array parameters, indexes, averages
sample_tests: test1_week, test3_ties
---

`main` is already written: it reads 7 daily high temperatures (Monday to Sunday) into an array and prints a report. Complete the **five methods** marked `TODO`. Do not change the method headers or `main`.

| Method | Returns |
|---|---|
| `average(temps)` | the average of all temperatures (a double) |
| `maxIndex(temps)` | the **index** of the highest temperature; the first one if tied |
| `minIndex(temps)` | the **index** of the lowest temperature; the first one if tied |
| `countAbove(temps, limit)` | how many temperatures are **strictly greater** than `limit` |
| `countWarmerThanDayBefore(temps)` | how many days were warmer than the day before (Tue vs Mon, ..., Sun vs Sat) |

## Output for `72 75 88 81 79 90 68`
```
Mon: 72
Tue: 75
Wed: 88
Thu: 81
Fri: 79
Sat: 90
Sun: 68
Average: 79.0
Hottest: Sat (90)
Coldest: Sun (68)
Days above average: 3
Days warmer than the day before: 3
```

## Hints
- Use `temps.length`, not 7, so your methods work for any array size.
- `maxIndex` and `minIndex` return a position, not a temperature. Start with `int best = 0;` and update `best` when you find a strictly bigger (or smaller) value. That keeps the first one when there is a tie.
- Add up the temperatures as ints, then divide with `(double) sum / temps.length`.
- For "warmer than the day before", start the loop at index 1 and compare `temps[i]` with `temps[i - 1]`.
