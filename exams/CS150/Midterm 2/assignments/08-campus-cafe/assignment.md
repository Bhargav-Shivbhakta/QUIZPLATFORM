---
title: Campus Cafe Ordering System
class: CampusCafe
order: 8
difficulty: hard
estimate: 45 min
topics: methods, switch, do-while, arrays as counters, conditional operator, printf
sample_tests: test1_small_order, test2_discount, test3_invalid_inputs
---

Complete every method marked `TODO`, then write `main`. Keep the method headers exactly as given.

## The menu
| # | Item | Price |
|---|---|---|
| 1 | Coffee | $2.50 |
| 2 | Latte | $4.50 |
| 3 | Bagel | $3.25 |
| 4 | Muffin | $2.75 |
| 5 | Sandwich | $7.95 |

`printMenu()` prints the title, the five items (each with `printf("%d. %-10s $%.2f%n", ...)`) and `0. Checkout`.
`itemName` and `itemPrice` use a **switch**. `isValidQuantity` accepts 1 to 10. `computeDiscount` returns 10% of the subtotal when the subtotal is at least **$20.00** (use `? :`), otherwise 0.

## Ordering (in `main`)
Print the menu once, then use a **do-while** loop to read orders until the item number is **0**:
- invalid item number: print `Invalid item: X` (do **not** read a quantity)
- valid item, invalid quantity: print `Invalid quantity: Q`
- otherwise add to that item's count and print `Added Q x Name`. Ordering the same item twice adds up.

## Receipt
If nothing was ordered, print `No items ordered. Goodbye!`. Otherwise print each ordered item in menu order, then the totals. Tax is **7.75%** of (subtotal - discount).
```
--- Receipt ---
Coffee x 2: $5.00
Bagel x 1: $3.25
Subtotal: $8.25
Discount: $0.00
Tax: $0.64
Total: $8.89
```

## Hints
- Build and test the helper methods first: click **Run** with no input and check that the menu prints correctly.
- `quantities[item] += qty;` uses the item number as the index. That is why the array has 6 elements and index 0 is unused.
- Inside the do-while: read the item; if it is 0, `break`; if it is invalid, print the message and `continue` without reading a quantity.
- Subtotal: loop over items 1-5 and add `quantities[item] * itemPrice(item)`.
- Print the receipt line with `printf("%s x %d: $%.2f%n", name, qty, qty * price)`.
- The discount applies at exactly $20.00, so use `>=`.
