---
title: Sample Exam
course: Feature tour
description: Example questions showing every question type. Delete this folder once your real exams are in.
active: true
time_limit: 20
pass_mark: 70
order: 99
---

# Topic: Algebra

## A1 · single · easy · on-exam
Solve for $x$: $\;3x + 5 = 20$
- [ ] $x = 3$
- [x] $x = 5$
- [ ] $x = 15$
- [ ] $x = \tfrac{25}{3}$
> Hint: Subtract 5 from both sides first.
> Explanation: $3x = 15$, so $x = 5$.

## A2 · numeric · medium · on-exam
What is the positive root of $x^2 - 2x - 8 = 0$?
= 4
> Explanation: It factors as $(x-4)(x+2) = 0$, so the roots are $4$ and $-2$.

## A3 · multi · medium
Which of these are linear functions? Select all that apply.
- [x] $f(x) = 2x + 1$
- [ ] $f(x) = x^2$
- [x] $f(x) = -\tfrac{1}{2}x$
- [ ] $f(x) = \sqrt{x}$
> Explanation: A linear function has the form $f(x) = mx + b$. Squares and square roots are not linear.

## A4 · truefalse · easy
The slope of a horizontal line is undefined.
= false
> Explanation: A horizontal line has slope $0$. A *vertical* line has an undefined slope.

## A5 · numeric · hard
Evaluate $\displaystyle \sum_{k=1}^{10} k$
= 55
> Explanation: $\frac{n(n+1)}{2} = \frac{10 \cdot 11}{2} = 55$.

# Topic: Python basics

## P1 · single · easy · on-exam
What does this print?

```python
x = [1, 2, 3]
y = x
y.append(4)
print(len(x))
```
- [ ] 3
- [x] 4
- [ ] Error
- [ ] None
> Explanation: `y = x` makes both names point to the **same** list, so appending through `y` changes `x` too.

## P2 · text · medium
Fill in the blank: the Python keyword used to define a function is `____`.
= def
> Explanation: Functions are defined with `def name(args):`.

## P3 · multi · hard · on-exam
Which of these are **mutable** types in Python?
- [x] `list`
- [ ] `tuple`
- [x] `dict`
- [ ] `str`
- [x] `set`
> Explanation: Lists, dicts and sets can change after creation. Tuples and strings can't.

## P4 · single · medium
What is the time complexity of looking up a key in a Python `dict` on average?
- [x] $O(1)$
- [ ] $O(\log n)$
- [ ] $O(n)$
- [ ] $O(n \log n)$
> Explanation: Dicts are hash tables, so average lookup is constant time.

## P5 · numeric · medium
What does `7 // 2 + 7 % 2` evaluate to?
= 4
> Hint: `//` is floor division and `%` is the remainder.
> Explanation: `7 // 2` is `3` and `7 % 2` is `1`, so the total is `4`.

# Topic: Probability

## R1 · single · easy · on-exam
A fair die is rolled once. What is the probability of rolling an even number?
- [ ] $\tfrac{1}{6}$
- [ ] $\tfrac{1}{3}$
- [x] $\tfrac{1}{2}$
- [ ] $\tfrac{2}{3}$
> Explanation: There are 3 even outcomes (2, 4, 6) out of 6.

## R2 · numeric · medium
Two fair coins are flipped. What is the probability of getting exactly one head? Give a decimal.
= 0.5 ± 0.001
> Explanation: The outcomes HT and TH make $2$ out of $4$, so $0.5$.

## R3 · truefalse · medium · on-exam
If events $A$ and $B$ are independent, then $P(A \cap B) = P(A)\,P(B)$.
= true
> Explanation: That's the definition of independence.

## R4 · single · hard
The diagram shows a spinner with four equal sections. What is the chance of landing on a shaded section?

![Spinner with four equal sections, two of them shaded](images/spinner.svg)
- [ ] 25%
- [x] 50%
- [ ] 75%
- [ ] 100%
> Explanation: Two of the four equal sections are shaded, so $\tfrac{2}{4} = 50\%$.

# Topic: Biology

## B1 · text · easy · on-exam
The organelle where photosynthesis happens is the ____.
= chloroplast | chloroplasts
> Explanation: Chloroplasts contain chlorophyll, which captures light energy.

## B2 · single · medium
Which molecule carries genetic information in most living organisms?

| Option | Molecule |
|---|---|
| A | ATP |
| B | DNA |
| C | Glucose |
- [ ] A
- [x] B
- [ ] C
> Explanation: DNA stores genetic information. ATP carries energy, and glucose is a sugar.

## B3 · multi · easy · 2pts
Which of these are found in plant cells but **not** animal cells?
- [x] Cell wall
- [x] Chloroplasts
- [ ] Mitochondria
- [ ] Nucleus
> Explanation: Both cell types have mitochondria and a nucleus. Only plant cells have a cell wall and chloroplasts.
