---
title: Movie Ticket Pricer
class: MovieTicket
order: 1
difficulty: medium
estimate: 30 min
topics: if / else-if chains, logical operators, conditional operator (? :), printf
sample_tests: test1_adult_evening, test2_child_matinee, test6_invalid_age
---

Write a program that prices one movie ticket.

## Input
One line with four values: the customer's **age** (int), the **day** (a 3-letter name such as `Mon` or `Tue`), the **hour** of the show (0-23) and whether they are a **student** (`y` or `n`).

```
30 Fri 19 n
```

## Rules
1. If the age is not between 0 and 120, print `Invalid age` and stop. Otherwise, if the hour is not between 0 and 23, print `Invalid hour` and stop.
2. **Base price**, using an if / else-if / else chain:
   - under 13: **$8.00**
   - 65 or older: **$9.00**
   - everyone else: **$14.00**
3. Then apply these discounts **in this order**:
   - **Matinee** (show starts before hour 17): subtract $2.00
   - **Tuesday** (the day is exactly `Tue`): subtract $1.50
   - **Student** (flag is `y` or `Y` *and* age is 13 to 25): take 10% off
4. A ticket never costs less than **$5.00**.
5. Use the conditional operator `? :` to choose the show type: `Matinee` before hour 17, otherwise `Evening`.

## Output
```
Show type: Evening
Ticket price: $14.00
```
Print the price with two decimals: `System.out.printf("Ticket price: $%.2f%n", price);`

## Hints
- Read the inputs in order with `nextInt()`, `next()`, `nextInt()` and `next().charAt(0)`.
- Compare the day with `day.equals("Tue")`, not `==`. `==` checks whether two Strings are the same object, not the same text.
- Keep the price in a `double`. Apply the matinee and Tuesday discounts first, then multiply by 0.90 for the student discount.
- The $5.00 minimum is checked **after** all discounts: `if (price < 5.00) price = 5.00;`
- A senior at a Tuesday matinee: 9.00 - 2.00 - 1.50 = 5.50.
