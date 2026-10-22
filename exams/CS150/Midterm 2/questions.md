---
title: Midterm 2
active: true          # the exam students see first
time_limit: 75        # minutes, for "actual exam" mode
---

# Topic: Tracing if, if-else & switch Statements

## Q1 · truefalse · easy
True or False: the if/else statement executes one block of statements if its boolean expression is true, or another block if it is false.
- [x] True
- [ ] False
> Hint: What does the word else describe: the case when the condition is true, or when it is false?
> Explanation: That is exactly what if/else does: the if block runs when the condition is true, the else block when it is false.

## Q2 · single · easy
The ________ statement is used to make simple decisions in Java.
- [ ] for
- [ ] branch
- [ ] do-while
- [x] if
> Hint: Which keyword checks a condition once instead of repeating?
> Explanation: The if statement makes simple decisions; for and do-while are loops.

## Q3 · single · medium
In an if / else-if / else chain, how many branches run each time the chain executes?
- [ ] Zero or one
- [x] Exactly one
- [ ] Every branch whose condition is true
- [ ] At least two
> Hint: After one branch of the chain runs, does Java check the others? And what does the final else cover?
> Explanation: The first true condition's branch runs and the rest are skipped. If none is true, the final else runs, so exactly one branch runs.

## Q4 · numeric · easy · on-exam
What is x after this code?

```java
int x = 75;
int y = 60;
if (x > y)
    x = x - y;
```
= 15
> Hint: Check the condition first. Only if it is true does the subtraction happen.
> Explanation: 75 > 60 is true, so x = 75 - 60 = 15.

## Q5 · numeric · medium
What is x after this code?

```java
int x = 45;
int y = 20;
if (x < y)
    x = y - x;
else
    x = x % y;
```
= 5
> Hint: Decide which branch runs, then remember that % gives the remainder.
> Explanation: 45 < 20 is false, so the else runs: x = 45 % 20 = 5.

## Q6 · single · medium
What is x after this code?

```java
int x = 20;
int y = 20;
if (x > y)
    x = y - x;
++x;
```
- [ ] 20
- [ ] 19
- [ ] 0
- [x] 21
> Hint: Is 20 > 20? Also notice which lines belong to the if when there are no braces.
> Explanation: 20 > 20 is false, so the if body is skipped. ++x is outside the if, so x becomes 21.

## Q7 · single · medium
What are ans, x and y after this code?

```java
int ans = 35, x = 50, y = 50;
if (x >= y) {
    ans = x + 10;
    x -= y;
}
else {
    ans = y + 10;
    y += x;
}
```
- [x] ans = 60, x = 0, y = 50
- [ ] ans = 60, x = 50, y = 100
- [ ] ans = 45, x = 50, y = 0
- [ ] ans = 45, x = 50, y = 50
> Hint: Is x >= y true when they are equal? Then run the statements in the chosen block in order.
> Explanation: 50 >= 50 is true, so ans = 50 + 10 = 60 and x = 50 - 50 = 0. y is unchanged at 50.

## Q8 · single · medium
What are ans and x after this code?

```java
int ans = 0, x = 4, y = 9;
if (x * 2 > y) {
    ans = x;
}
else {
    ans = y - x;
    x = 0;
}
```
- [ ] ans = 4, x = 4
- [x] ans = 5, x = 0
- [ ] ans = 5, x = 4
- [ ] ans = 4, x = 0
> Hint: Work out x * 2 first, then compare it with y.
> Explanation: x * 2 = 8, and 8 > 9 is false. The else runs: ans = 9 - 4 = 5 and x = 0.

## Q9 · single · medium
What are ans, x and y after this code?

```java
int ans = 30, x = 30, y = 30;
if (x >= y) {
    x += y;
    ans = x + 10;
}
else {
    y -= x;
    ans = y - 10;
}
```
- [ ] ans = 40, x = 30, y = 30
- [ ] ans = -10, x = 30, y = 0
- [x] ans = 70, x = 60, y = 30
- [ ] ans = 40, x = 0, y = 30
> Hint: Order matters: x changes before ans is calculated.
> Explanation: 30 >= 30 is true, so x = 30 + 30 = 60 and then ans = 60 + 10 = 70. y stays 30.

## Q10 · single · hard · on-exam
What is ans after this code? (Note the semicolon.)

```java
int x = 90, y = 55, ans = 10;
if (x == y);
    ans *= 2;
```
- [x] 20
- [ ] 145
- [ ] 10
- [ ] No value, there is a syntax error
> Hint: Look closely at what ends the if statement on the first line.
> Explanation: The semicolon ends the if with an empty statement. ans *= 2 is a separate statement that always runs, so ans = 20.

## Q11 · single · medium
What is ans after this code? (Look at the braces.)

```java
int x = 200, y = 155, ans = 10;
if (x <= y)
    System.out.print(ans);
    ans *= 3;
```
- [ ] 45
- [x] 30
- [ ] 10
- [ ] No value, there is a syntax error
> Hint: Without braces, how many statements does the if control? Indentation means nothing to Java.
> Explanation: Without braces only the print belongs to the if. ans *= 3 always runs, giving 30 (the print is skipped because 200 <= 155 is false).

## Q12 · multi · medium
For which scores does this code print "B"? (Select all)

```java
if (score >= 90)
    System.out.print("A");
else if (score >= 80)
    System.out.print("B");
else
    System.out.print("C");
```
- [x] 80
- [x] 85
- [x] 89
- [ ] 90
- [ ] 79
> Hint: A score only reaches the else-if when the first condition was false.
> Explanation: "B" prints for scores that fail score >= 90 but pass score >= 80, which is 80 through 89.

## Q13 · single · medium
What is bonus after this code?

```java
int bonus, sales = 10000;
if (sales < 5000)
    bonus = 200;
else if (sales < 7500)
    bonus = 500;
else if (sales < 10000)
    bonus = 750;
else if (sales < 20000)
    bonus = 1000;
else
    bonus = 1250;
```
- [ ] 200
- [ ] 500
- [ ] 750
- [x] 1000
- [ ] 1250
> Hint: The chain stops at the first true condition. Is 10000 < 10000?
> Explanation: 10000 is not < 5000, < 7500, or < 10000, but it is < 20000, so bonus = 1000.

## Q14 · numeric · hard
What is bonus after this code? (These are separate if statements.)

```java
int bonus, sales = 1250;
if (sales > 1000)
    bonus = 100;
if (sales > 750)
    bonus = 50;
if (sales > 500)
    bonus = 25;
else
    bonus = 0;
```
= 25
> Hint: Separate if statements are all checked. Which assignment happens last?
> Explanation: These are three separate ifs and all three conditions are true. Each overwrites bonus, and the last sets it to 25.

## Q15 · numeric · hard
What is bonus after this code?

```java
int bonus, sales = 10000;
if (sales > 5000)
    bonus = 200;
if (sales > 7500)
    bonus = 500;
if (sales > 10000)
    bonus = 750;
if (sales > 20000)
    bonus = 1000;
else
    bonus = 1250;
```
= 1250
> Hint: The else belongs only to the last if. Is 10000 > 20000?
> Explanation: The final if/else is separate from the earlier ifs. 10000 > 20000 is false, so its else sets bonus to 1250, overwriting 500.

## Q16 · single · hard · on-exam
What is bonus after this code?

```java
int bonus, sales = 85000;
char dept = 'S';
if (sales > 100000)
    if (dept == 'R')
        bonus = 2000;
    else
        bonus = 1500;
else if (sales > 75000)
    if (dept == 'R')
        bonus = 1250;
    else
        bonus = 1000;
else
    bonus = 0;
```
- [ ] 2000
- [ ] 1500
- [x] 1000
- [ ] 1250
> Hint: First find which outer branch sales falls into, then check dept inside it.
> Explanation: 85000 is not > 100000, but it is > 75000. dept is 'S', not 'R', so the inner else sets bonus to 1000.

## Q17 · single · medium
What is printed?

```java
int a = 11;
int b = 9;
if (b < a) {
    if (a + 2 <= b) {
        System.out.println("Jane");
    } else {
        System.out.println("John");
    }
} else {
    if (a - 2 >= b) {
        System.out.println("Joe");
    } else {
        System.out.println("Jessie");
    }
}
```
- [ ] Jessie
- [ ] Joe
- [ ] Jane
- [x] John
> Hint: Evaluate the outer condition, then plug the real numbers into the inner one.
> Explanation: b < a is true. a + 2 <= b means 13 <= 9, which is false, so the inner else prints John.

## Q18 · single · hard
The code below is incorrectly indented. Applying the rule that an else pairs with the nearest unmatched if, what is printed?

```java
int x = 1, y = -1, z = 1;
if (x > 0)
    if (y > 0)
        System.out.println("x > 0 and y > 0");
else if (z > 0)
    System.out.println("x < 0 and z > 0");
```
- [ ] x > 0 and y > 0
- [ ] x < 0 and z < 0
- [x] x < 0 and z > 0
- [ ] No printout
> Hint: Ignore the indentation. Which if does the else actually pair with?
> Explanation: An else pairs with the nearest unmatched if, here if (y > 0). x > 0 is true, so the inner if runs; y > 0 is false, so its else-if checks z > 0, which is true. The message text says "x < 0" even though x is 1: the messages were written for the indentation, not for how Java really pairs the else. That mismatch is the bug this question is about.

## Q19 · single · easy
If the input is 7, what is the output?

```
If x less than 10
    Put "Tiny " to output
Else
    Put "Not tiny " to output
If x less than 100
    Put "Small " to output
```
- [ ] Tiny
- [x] Tiny Small
- [ ] Not tiny Small
- [ ] (No output)
> Hint: Is this one if-else chain or two separate decisions?
> Explanation: 7 < 10 prints "Tiny ". The second if is separate and 7 < 100 is true, so "Small " prints too.

## Q20 · single · medium
If the input is -5, what is the output?

```
If x less than 0
    Put "Low " to output
Else if x greater than 0
    Put "OK " to output
Else if x less than -3
    Put "Very low " to output
```
- [x] Low
- [ ] Low Very low
- [ ] (Runs, but no output)
- [ ] Error: missing else
> Hint: In an if / else-if chain, how many branches can run?
> Explanation: -5 < 0 is true, so "Low " prints and the rest of the chain is skipped, even though -5 < -3 is also true.

## Q21 · single · easy
If the input is 5, what is the output?

```java
int x = scnr.nextInt();
if (x < 10) {
    System.out.print("Live ");
}
else if (x < 20) {
    System.out.print("long ");
}
else if (x < 30) {
    System.out.print("and ");
}
System.out.print("prosper!");
```
- [ ] Live
- [ ] Live long
- [x] Live prosper!
- [ ] Error: missing else
> Hint: Which print is inside the chain, and which one comes after it?
> Explanation: 5 < 10 prints "Live " and skips the rest of the chain. "prosper!" is outside the chain and always prints.

## Q22 · multi · easy · on-exam
Which statements about if/else in Java are true? (Select all)
- [x] An else must be paired with a preceding if
- [x] Braces are optional when a branch has only one statement
- [ ] Every if must have an else
- [ ] A semicolon right after `if (cond)` is a syntax error
> Hint: Separate what Java requires from what is merely optional or allowed.
> Explanation: An else always belongs to an if, and braces may be omitted for a single statement. An else is optional. A semicolon after if (cond) compiles as an empty statement, which is a logic error, not a syntax error.

## Q23 · single · medium
If the input is 5, what is the output? (Note: two separate if statements.)

```java
int x = scnr.nextInt();
if (x < 10)
    System.out.print("A");
if (x < 20)
    System.out.print("B");
else
    System.out.print("C");
```
- [ ] A
- [x] AB
- [ ] AC
- [ ] ABC
> Hint: The else pairs only with the second if.
> Explanation: These are two separate if statements. 5 < 10 prints A, and 5 < 20 prints B, so the else is skipped.

## Q24 · single · easy
What is the final value of y?

```java
int x = 6;
int y = 2;
if (x < 10) {
    if (y < 5) {
        y = y + 1;
    }
    else {
        y = 7;
    }
}
else {
    y = y + 10;
}
```
- [x] 3
- [ ] 7
- [ ] 12
- [ ] 13
> Hint: Evaluate the outer condition first, then the inner one.
> Explanation: 6 < 10 is true and 2 < 5 is true, so y = 2 + 1 = 3.

## Q25 · single · medium
For what values of integer x will Branch 3 execute?

```
If x < 10 : Branch 1
Else If x > 9 : Branch 2
Else : Branch 3
```
- [ ] 10 or larger
- [ ] 10 only
- [ ] Values between 9 and 10
- [x] No values (never executes)
> Hint: Can an integer be neither less than 10 nor greater than 9?
> Explanation: Every integer is either < 10 or >= 10 (> 9), so Branch 1 or Branch 2 always runs and Branch 3 never does.

## Q26 · single · medium
For what values of x will "Medium" be output?

```
If x > 40: Output "Large"
Else If x > 20: Output "Medium"
Else If x > 10: Output "Small"
```
- [ ] Any x larger than 20
- [ ] Any x smaller than 40
- [x] Any x from 21 to 40
- [ ] Any x from 10 to 40
> Hint: A value only reaches the second test if the first test was false.
> Explanation: Values above 40 are caught by "Large" first. "Medium" covers x > 20 that is not > 40, which is 21 through 40.

## Q27 · single · medium
What value of x outputs "Junior"?

```java
if (x < 56) { /* "Sophomore" */ }
else if (x > 56) { /* "Senior" */ }
else { /* "Junior" */ }
```
- [x] 56
- [ ] 57 or larger
- [ ] 55 or 57
- [ ] No such value
> Hint: Which number is neither less than nor greater than 56?
> Explanation: Values below 56 and above 56 are caught by the first two branches, so only 56 reaches the else.

## Q28 · numeric · hard · on-exam
If the input is 5, what is the output?

```java
int x;
int z = 0;
x = scnr.nextInt();
if (x > 9)
    z = 3;
    z = z + 1;
System.out.print(z);
```
= 1
> Hint: Without braces, only the first statement after the if is controlled by it.
> Explanation: Without braces only z = 3 belongs to the if. 5 > 9 is false, so z = 3 is skipped, then z = z + 1 makes z = 1.

## Q29 · single · medium
What is x after this code?

```java
int x = 10;
switch (x) {
    case 10:
        x += 15;
    case 12:
        x -= 5;
        break;
    default:
        x *= 3;
}
```
- [ ] 5
- [x] 20
- [ ] 30
- [ ] 25
> Hint: Is there a break at the end of case 10?
> Explanation: case 10 matches and adds 15 (x = 25). There is no break, so execution falls into case 12: x = 20, then break.

## Q30 · numeric · medium
What is total after this code?

```java
int day = 3;
int total = 0;
switch (day) {
    case 1:  total += 10; break;
    case 3:  total += 30;
    case 4:  total += 40; break;
    default: total += 100;
}
```
= 70
> Hint: Start at the matching case and keep running statements until you hit a break.
> Explanation: case 3 adds 30 and has no break, so it falls into case 4, which adds 40 and breaks. total = 70.

## Q31 · single · medium
What is x after this code?

```java
int x = 120;
switch (x) {
    case 100:
        x = x + 15;
        break;
    case 120:
        x = x - 5;
        break;
    default:
        x = x * 3;
}
```
- [ ] 135
- [x] 115
- [ ] 130
- [ ] 360
> Hint: Find the matching case, then check whether it ends with break.
> Explanation: x is 120, so case 120 runs: x = 120 - 5 = 115, then break.

## Q32 · single · hard
What is printed?

```java
int code = 7;
switch (code % 3) {
    case 0:  System.out.print("zero ");
    case 1:  System.out.print("one ");
    case 2:  System.out.print("two ");
             break;
    default: System.out.print("other");
}
```
- [ ] one
- [x] one two
- [ ] one two other
- [ ] zero one two
> Hint: Work out 7 % 3 first, then follow the cases until a break.
> Explanation: 7 % 3 is 1, so execution starts at case 1, prints "one ", falls into case 2, prints "two ", then breaks.

## Q33 · single · easy
What is the output for x = 15?

```java
switch (x) {
    case 10:  System.out.print("First ");    break;
    case 20:  System.out.print("Second ");   break;
    default:  System.out.print("No match "); break;
}
```
- [ ] First
- [ ] Second
- [ ] First Second
- [x] No match
> Hint: What runs when the value matches none of the cases?
> Explanation: 15 matches no case, so the default case prints "No match".

## Q34 · single · hard · on-exam
What is numItems if myChar is 'X'?

```java
switch (myChar) {
    case 'W': numItems = 1;
    case 'X': numItems = 2;
    case 'Y': numItems = 3;
    case 'Z': numItems = 4;
}
```
- [ ] 2
- [ ] 3
- [x] 4
- [ ] 9
> Hint: With no break statements, execution keeps falling into every later case.
> Explanation: 'X' matches case 'X', and with no breaks execution falls through every later case. The last assignment sets numItems = 4.

## Q35 · single · easy
For what values of int x does the default case run?

```java
switch (x) {
    case 2: ... break;
    case 3: ... break;
    case 4: ... break;
    default: ...
}
```
- [ ] Only 5
- [ ] Only values greater than 4
- [x] Values that are not 2, 3, or 4
- [ ] Any value
> Hint: default is the switch's 'none of the above' case.
> Explanation: default runs whenever the value matches none of the listed cases, here anything other than 2, 3, or 4.

## Q36 · multi · easy
Which types can be used as the expression in a Java switch statement? (Select all)
- [x] int
- [x] char
- [x] String
- [ ] double
- [ ] boolean
> Hint: A switch matches exact values. Which of these types does Java let you use as case labels?
> Explanation: switch accepts int (and smaller integer types), char, String, and enum values. It does not accept double or boolean.

## Q37 · single · medium
What is printed when month is 4?

```java
switch (month) {
    case 12: case 1: case 2:
        System.out.print("Winter"); break;
    case 3: case 4: case 5:
        System.out.print("Spring"); break;
    default:
        System.out.print("Other");
}
```
- [ ] Winter
- [ ] Other
- [x] Spring
- [ ] SpringOther
> Hint: Several case labels can share one block of code.
> Explanation: Stacked case labels share one body: case 3, 4, and 5 all run the "Spring" print, then break.

## Q38 · single · medium
What is printed?

```java
String day = "Sat";
switch (day) {
    case "Sat":
    case "Sun":
        System.out.print("Weekend");
        break;
    default:
        System.out.print("Weekday");
}
```
- [ ] Weekday
- [x] Weekend
- [ ] WeekendWeekday
- [ ] Compile error: switch cannot use a String
> Hint: Can a switch compare text? Also notice that case "Sat" has no statements of its own.
> Explanation: Java allows switch on Strings. "Sat" matches, falls through the empty case "Sun" into the print, then breaks.

## Q39 · single · hard
What is printed when grade is 'B'?

```java
switch (grade) {
    case 'A': System.out.print("Great ");
    case 'B': System.out.print("Good ");
    case 'C': System.out.print("OK ");
              break;
    default:  System.out.print("Fail");
}
```
- [ ] Good
- [ ] Good OK Fail
- [x] Good OK
- [ ] Great Good OK
> Hint: Start at case 'B' and keep going until you reach a break.
> Explanation: Execution starts at case 'B', prints "Good ", falls into case 'C', prints "OK ", then breaks before default.

## Q40 · truefalse · easy · on-exam
True or False: the expression in a switch statement may be of type double.
- [ ] True
- [x] False
> Hint: Floating-point values are rarely exactly equal. Would matching them in a switch make sense?
> Explanation: A switch can use int, char, String, or enum values, but not double (or boolean).

## Q41 · single · easy
Which keyword ends a case so execution does not fall through to the next case?
- [ ] exit
- [ ] stop
- [x] break
- [ ] continue
> Hint: The same keyword also exits loops early.
> Explanation: break exits the switch so execution does not fall into the next case.

## Q42 · multi · hard
For which values of x does this code print "Even"? (Select all)

```java
switch (x % 2) {
    case 0:  System.out.print("Even"); break;
    default: System.out.print("Odd");
}
```
- [x] 4
- [x] 0
- [x] -2
- [ ] 7
- [ ] -3
> Hint: Work out x % 2 for each value. In Java, what sign does % give when x is negative?
> Explanation: x % 2 is 0 for 4, 0, and -2, so case 0 prints "Even". 7 % 2 is 1 and -3 % 2 is -1 in Java, so both go to default.

# Topic: Tracing while, do-while & for Loops

## Q43 · single · hard
What is r after this code?

```java
String s = "abc";
String r = "";
for (int i = 0; i < s.length(); i++) {
    r = s.charAt(i) + r;
}
```
- [x] "cba"
- [ ] "abc"
- [ ] "aabbcc"
- [ ] Compile error: cannot add a char and a String
> Hint: Trace r after each pass. Is the new character added to the front or the back?
> Explanation: Each char is put in front of r: "a", then "ba", then "cba".

## Q44 · single · easy
This is a control structure that causes a statement or group of statements to repeat.
- [ ] Body
- [x] Loop
- [ ] Block
- [ ] Prefix mode
> Hint: Which word describes code that runs again and again?
> Explanation: A loop repeats a statement or block of statements.

## Q45 · single · easy · on-exam
Each repetition of a loop is known as:
- [ ] A lap
- [ ] An execution
- [x] An iteration
- [ ] A cycle
> Hint: This word is also used for one round of a process in math.
> Explanation: Each pass through a loop body is called an iteration.

## Q46 · single · easy
An example of a post-test (exit-controlled) loop is a:
- [ ] Sentinel loop
- [ ] while loop
- [x] do-while loop
- [ ] for loop
> Hint: Which loop checks its condition after the body has already run?
> Explanation: do-while tests its condition after the body runs, so it is a post-test loop.

## Q47 · truefalse · easy
True or False: the body of a while loop may execute zero times.
- [x] True
- [ ] False
> Hint: What happens if the condition is false the very first time it is checked?
> Explanation: A while loop tests its condition first; if it is false at the start, the body never runs.

## Q48 · truefalse · easy
True or False: the while loop has two important parts: (1) a boolean expression tested for true or false, and (2) a statement or block repeated as long as the expression is true.
- [x] True
- [ ] False
> Hint: Think about the two things every while loop is made of.
> Explanation: Those are exactly the two parts: the condition, and the body that repeats while it is true.

## Q49 · single · easy
A loop that does not contain within itself a way to terminate is called a(n):
- [ ] for loop
- [ ] while loop
- [ ] do-while loop
- [x] Infinite loop
> Hint: If nothing ever makes the condition false, how long does the loop keep running?
> Explanation: A loop with no way to stop is an infinite loop.

## Q50 · single · easy
This is a value that signals when the end of a list of values has been reached.
- [x] Sentinel
- [ ] Final value
- [ ] End value
- [ ] Terminal value
> Hint: It's the special value a user types to say 'I'm done'.
> Explanation: A sentinel is a special value that marks the end of the input.

## Q51 · truefalse · easy · on-exam
True or False: a sentinel value should be a value that is not in the range of valid data values.
- [x] True
- [ ] False
> Hint: What would happen if the stop value could also be real data?
> Explanation: If the sentinel could be real data, the loop might stop too early, so pick a value outside the valid range.

## Q52 · single · medium
Which input value causes "Goodbye" to be output next?

```java
int x = scnr.nextInt();
while (x >= 0) {
    // Do something
    x = scnr.nextInt();
}
System.out.println("Goodbye");
```
- [x] -1
- [ ] 0
- [ ] 1
- [ ] No such value
> Hint: The loop keeps going while x >= 0. Which value makes that false?
> Explanation: The loop continues while x >= 0, so only a negative value such as -1 ends it.

## Q53 · single · medium
Which input for char c ends the loop and prints "Done"?

```java
char c = 'y';
while (c == 'y' || c == 'Y') {
    System.out.println("Enter y to continue: ");
    c = scnr.next().charAt(0);
}
System.out.println("Done");
```
- [ ] 'y' only
- [ ] 'Y' only
- [x] Any character other than 'y' or 'Y'
- [ ] No such value
> Hint: The loop continues while c is 'y' or 'Y'. What makes that whole condition false?
> Explanation: The loop continues while c is 'y' or 'Y', so any other character ends it.

## Q54 · multi · medium
Which loops print exactly `1 2 3 `? (Select all)
- [x] `int i = 1; while (i <= 3) { System.out.print(i + " "); i++; }`
- [x] `int i = 0; while (i < 3) { i++; System.out.print(i + " "); }`
- [ ] `int i = 1; do { System.out.print(i + " "); i++; } while (i < 3);`
- [ ] `int i = 1; while (i < 3) { System.out.print(i + " "); i++; }`
> Hint: Trace each loop and write down exactly what it prints. Watch < versus <=.
> Explanation: The first loop prints 1 to 3, and the second increments before printing, so it also prints 1 to 3. The last two stop at i < 3 and print only 1 2.

## Q55 · single · medium
What is the output if the input is 3 2 1 0?

```java
x = scnr.nextInt();
while (x > 0) {
    System.out.print(2 * x + " ");
}
```
- [ ] 6
- [ ] 6 4 2
- [ ] 6 4 2 0
- [x] 6 6 6 6 6 ... (infinite loop)
> Hint: Does anything inside the loop change x?
> Explanation: x is never updated inside the loop, so x > 0 stays true and 6 prints forever.

## Q56 · numeric · medium
How many times does the loop iterate if the input is 105 107 99 103?

```java
x = scnr.nextInt();
while (x > 100) {
    // Do something
    x = scnr.nextInt();
}
```
= 2
> Hint: Count the inputs that are greater than 100 before the first one that isn't.
> Explanation: 105 and 107 are > 100, so the body runs twice. The next input, 99, ends the loop.

## Q57 · single · easy · on-exam
What is an essential feature of `while (LoopExpression) { LoopBody }`?
- [x] The LoopExpression should be affected by the LoopBody
- [ ] The LoopExpression should not be affected by the LoopBody
- [ ] The LoopBody should get user input
- [ ] The LoopBody should update at least two variables
> Hint: What must happen inside the body for the loop to ever stop?
> Explanation: The body must change something the condition depends on, or the loop never ends.

## Q58 · single · medium
How many times does the loop body execute for the input -1 4 0 9?

```java
userNum = 3;
while (userNum > 0) {
    // Do something
    // Get userNum from input
}
```
- [ ] 0
- [x] 1
- [ ] 2
- [ ] 3
> Hint: userNum starts at 3. After the first pass, the next input is read. Is it > 0?
> Explanation: userNum starts at 3, so the body runs once. It then reads -1, and -1 > 0 is false.

## Q59 · single · medium
What is the output?

```java
int x = 18;
while (x > 0) {
    System.out.print(x + " ");
    x = x / 3;
}
```
- [ ] 6 2
- [ ] 6 2 0
- [x] 18 6 2
- [ ] 18 6 2 0
> Hint: Print first, then divide. Remember / on ints drops the decimal part.
> Explanation: 18 prints, then x = 6; 6 prints, then x = 2; 2 prints, then x = 0 and the loop stops.

## Q60 · multi · easy
Which statements about the do-while loop are true? (Select all)
- [x] Its body always runs at least once
- [x] It ends with a semicolon after `while (condition)`
- [ ] It tests its condition before the first iteration
- [ ] It cannot contain a break statement
> Hint: Think about when do-while checks its condition and how its syntax ends.
> Explanation: do-while is a post-test loop: the body runs first and the condition is checked after. Its syntax ends with `while (cond);`, and break works in any loop.

## Q61 · single · medium
What is x after this code?

```java
int x = 10, y = 20;
while (y < 100) {
    x += y;
}
```
- [ ] 110
- [ ] 210
- [ ] 90
- [x] This is an infinite loop
> Hint: Does anything inside the loop change y?
> Explanation: y is never changed inside the loop, so y < 100 stays true forever.

## Q62 · numeric · medium
What is sum after this code?

```java
int sum = 0;
int k = 1;
while (sum < 20) {
    sum += k;
    k += 2;
}
```
= 25
> Hint: Keep a table of sum and k after each pass. Check the condition before each new pass.
> Explanation: sum goes 1, 4, 9, 16, 25. At 25, sum < 20 is false, so the loop stops.

## Q63 · numeric · medium · on-exam
How many times does the loop body run?

```java
int x = 1;
while (x < 50) {
    x = x * 3;
}
```
= 4
> Hint: Count the passes: list x after each multiplication until x < 50 is false.
> Explanation: x goes 3, 9, 27, 81; the body runs 4 times, and 81 < 50 is false.

## Q64 · single · medium
How many times does this do-while loop body execute?

```java
int x = 11;
do {
    x += 20;
} while (x > 100);
```
- [ ] 4
- [ ] 5
- [ ] 0
- [x] 1
> Hint: A do-while body runs before the condition is checked even once.
> Explanation: A do-while body always runs once. x becomes 31, and 31 > 100 is false, so it stops.

## Q65 · single · medium
What is the output?

```java
int a = 10;
do {
    System.out.print(a + " ");
    a = a + 1;
} while (a < 15);
```
- [ ] 11 12 13 14
- [ ] 11 12 13 14 15
- [x] 10 11 12 13 14
- [ ] 10 11 12 13 14 15
> Hint: do-while prints before it tests. Which value is printed first?
> Explanation: a = 10 prints first because a do-while tests at the end. It continues through 14; at 15, a < 15 is false.

## Q66 · numeric · hard
What is sum after this code?

```java
int n = 4728;
int sum = 0;
while (n > 0) {
    sum += n % 10;
    n /= 10;
}
```
= 21
> Hint: n % 10 gives the last digit and n /= 10 removes it.
> Explanation: n % 10 takes the last digit and n /= 10 removes it, so the loop adds the digits: 8 + 2 + 7 + 4 = 21.

## Q67 · numeric · medium
How many times is "Welcome to Java" printed?

```java
int count = 0;
while (++count < 10)
    System.out.println("Welcome to Java");
```
= 9
> Hint: ++count adds 1 before the comparison. List the values that pass count < 10.
> Explanation: ++count adds 1 before each comparison, so the tests see count = 1, 2, ..., 10. The tests with 1 through 9 pass and print (9 times). When count reaches 10, 10 < 10 is false and the loop ends.

## Q68 · single · hard
In this code, what can be said about the loop condition?

```java
int number = keyboard.nextInt();
while (number < 100 && number > 500) {
    System.out.print("Enter another number: ");
    number = keyboard.nextInt();
}
```
- [ ] Numbers 100–500 end the loop
- [x] The boolean condition can never be true
- [ ] Numbers 100–499 end the loop
- [ ] Numbers less than 100 or greater than 500 keep it running
> Hint: Can one number be less than 100 and greater than 500 at the same time?
> Explanation: No number is both less than 100 and greater than 500, so the loop body never runs.

## Q69 · single · hard · on-exam
What is printed (each value on its own line)?

```java
int k = 0;
int n = 7;
while (k <= n) {
    if (k % 2 == 0)
        k = k + 3;
    else
        k = k + 1;
    System.out.println(k);
}
```
- [x] 3 4 7 8
- [ ] 3 4 7
- [ ] 0 3 4 7
- [ ] 3 6 9
> Hint: Trace k pass by pass. Each pass prints k after it changes.
> Explanation: k: 0 is even, +3 = 3; 3 is odd, +1 = 4; 4 is even, +3 = 7; 7 is odd, +1 = 8. At 8, 8 <= 7 is false.

## Q70 · single · hard
What is printed (each value on its own line)?

```java
int x = 3;
int y = 24;
do {
    y = y - 3;
    System.out.println(y);
    x = x + 2;
} while (2 * x <= y + 2);
```
- [ ] 21 18
- [ ] 24 21 18
- [x] 21 18 15
- [ ] 21 18 15 12
> Hint: Keep a table of x and y. Check 2 * x <= y + 2 at the end of each pass.
> Explanation: y = 21 (x = 5): 10 <= 23. y = 18 (x = 7): 14 <= 20. y = 15 (x = 9): 18 <= 17 is false, so it stops.

## Q71 · numeric · hard
What is printed?

```java
int a, x = 0, y = 0;
while (x < 10) {
    a = x * 3;
    y += a;
    x++;
}
System.out.print(y);
```
= 135
> Hint: y adds x * 3 for every x from 0 to 9.
> Explanation: y adds x * 3 for x = 0 to 9: 3 * 45 = 135.

## Q72 · numeric · hard
What is printed?

```java
int n = 1, p = 1;
do {
    p *= 2;
    n++;
} while (n <= 4);
System.out.print(p);
```
= 16
> Hint: Count how many times the body runs; each run doubles p.
> Explanation: The body doubles p for n = 1, 2, 3, 4: 2^4 = 16.

## Q73 · numeric · easy
How many times does this loop iterate?

```java
for (int i = 3; i <= 12; i += 3) {
    // Do something
}
```
= 4
> Hint: List the values i takes: start at 3 and add 3 while i <= 12.
> Explanation: i takes the values 3, 6, 9, 12, so the loop runs 4 times.

## Q74 · single · medium
What is the output if the input is 3 2 4 5?

```java
num = scnr.nextInt();
for (i = 0; i < num; ++i) {
    curr = scnr.nextInt();
    System.out.print(curr);
}
```
- [ ] 24
- [x] 245
- [ ] 324
- [ ] 3245
> Hint: The first input is not printed. What is it used for?
> Explanation: The first input (3) is the count, so the next three values 2, 4, 5 are printed with no spaces.

## Q75 · single · medium · on-exam
What is sum if the input is 2 5 7 3?

```java
x = scnr.nextInt();
sum = 0;
for (i = 0; i < x; ++i) {
    currValue = scnr.nextInt();
    sum += currValue;
}
```
- [ ] 5
- [ ] 10
- [x] 12
- [ ] 15
> Hint: The first input tells the loop how many more values to read.
> Explanation: The first input (2) is the count, so only 5 and 7 are added: 12.

## Q76 · single · easy
What is the output if count is 4?

```java
for (i = count; i > 0; --i) {
    System.out.print(i);
}
```
- [ ] 4
- [ ] 321
- [x] 4321
- [ ] 43210
> Hint: i starts at count and counts down while i > 0.
> Explanation: i starts at 4 and counts down while i > 0: 4321.

## Q77 · single · easy
What is the output?

```java
for (int n = 0; n < 10; n = n + 3) {
    System.out.print(n + " ");
}
```
- [ ] 0 1 2 3 4 5 6 7 8 9
- [ ] 1 4 7 10
- [x] 0 3 6 9
- [ ] 0 3 6 9 12
> Hint: n goes up by 3 each time. Stop as soon as n < 10 is false.
> Explanation: n goes 0, 3, 6, 9; the next value, 12, fails n < 10.

## Q78 · single · easy
What is printed?

```java
for (a = 0; a < 5; ++a)
    System.out.print(a + " ");
```
- [ ] 0 0 0 0 0
- [ ] 1 2 3 4 5
- [x] 0 1 2 3 4
- [ ] 0 1 2 3 4 5
> Hint: Which values does a take before a < 5 becomes false?
> Explanation: a goes 0 to 4; at a = 5, a < 5 is false.

## Q79 · single · medium
What is printed?

```java
for (int a = 1; a <= 10; a *= 3)
    System.out.print(a + " ");
```
- [ ] 1 3 9 27
- [x] 1 3 9
- [ ] 3 9
- [ ] 1 4 7 10
> Hint: a is multiplied by 3 each time. Stop when a <= 10 is false.
> Explanation: a goes 1, 3, 9; the next value, 27, fails a <= 10.

## Q80 · multi · medium
Which loops iterate exactly 5 times? (Select all)
- [x] `for (int i = 0; i < 5; i++)`
- [x] `for (int i = 1; i <= 5; i++)`
- [x] `for (int i = 10; i > 0; i -= 2)`
- [ ] `for (int i = 0; i <= 5; i++)`
- [ ] `for (int i = 5; i > 1; i--)`
> Hint: For each header, list the values of the loop variable and count them.
> Explanation: 0–4, 1–5, and 10, 8, 6, 4, 2 each give 5 passes. 0 through 5 gives 6 passes, and 5 down to 2 gives 4.

## Q81 · numeric · medium · on-exam
What is x after this code?

```java
int x = 10;
for (int y = 5; y < 20; y += 5)
    x += y;
```
= 40
> Hint: List the values of y, then add each one to x.
> Explanation: y takes the values 5, 10, 15, so x = 10 + 5 + 10 + 15 = 40.

## Q82 · numeric · hard
What is x after this code?

```java
int x = 1;
for (int y = 10; y > 0; y -= 3)
    x *= 2;
```
= 16
> Hint: List the values of y (subtract 3 each time while y > 0). Each one doubles x.
> Explanation: y takes the values 10, 7, 4, 1, so x doubles four times: 1 to 16.

## Q83 · single · medium
What is printed?

```java
for (int number = 5; number <= 15; number += 3)
    System.out.print(number + ", ");
```
- [x] 5, 8, 11, 14,
- [ ] 5, 6, 7, ..., 15,
- [ ] 5, 8, 11, 14, 17,
- [ ] This is an invalid for statement
> Hint: Start at 5 and add 3 each time; stop when the value passes 15.
> Explanation: number goes 5, 8, 11, 14; the next value, 17, fails number <= 15.

## Q84 · single · medium
In plain English, what does this code do?

```java
double sum = 0.0;
for (int n = 1, d = 30; n <= 30; n++, d--)
    sum += (double) n / (double) d;
```
- [x] It loops 30 times, totaling the ratio of each n/d
- [ ] It loops 31 times, totaling each n/d
- [ ] It fails with a divide-by-zero error
- [ ] It loops once, giving 1/30
> Hint: How many values does n take? Can d ever reach 0 while the loop runs?
> Explanation: n goes 1 to 30 (30 passes) while d goes 30 down to 1, so d is never 0.

## Q85 · truefalse · easy
True or False: in a for statement, the control variable can only be incremented.
- [ ] True
- [x] False
> Hint: Think of loops you've seen that count down or jump by more than 1.
> Explanation: The update can be anything: i--, i += 3, i *= 2, and so on.

## Q86 · single · medium
What is printed?

```java
int y = 0;
for (int i = 0; i < 10; ++i) {
    y += i;
}
System.out.println(y);
```
- [x] 45
- [ ] 12
- [ ] 11
- [ ] 13
- [ ] 10
> Hint: y adds every i from 0 up to 9.
> Explanation: 0 + 1 + ... + 9 = 45.

## Q87 · single · medium · on-exam
Which loops print "Welcome to Java" exactly 10 times?

```java
// A
for (int count = 1; count <= 10; count++) { System.out.println("Welcome to Java"); }
// B
for (int count = 0; count < 10; count++)  { System.out.println("Welcome to Java"); }
// C
for (int count = 1; count < 10; count++)  { System.out.println("Welcome to Java"); }
// D
for (int count = 0; count <= 10; count++) { System.out.println("Welcome to Java"); }
```
- [ ] ABC
- [ ] AC
- [ ] BC
- [ ] BD
- [x] AB
> Hint: Count how many values each loop variable takes. Watch the start value and < versus <=.
> Explanation: A (1 to 10) and B (0 to 9) each run 10 times. C runs 9 times and D runs 11 times.

## Q88 · numeric · medium
How many times is the println statement executed?

```java
for (int i = 1; i < 9; i++)
    for (int j = 0; j < 5; j++)
        System.out.println(i * j);
```
= 40
> Hint: Count the outer passes and the inner passes separately, then multiply.
> Explanation: The outer loop runs 8 times (1 to 8) and the inner loop 5 times (0 to 4): 8 * 5 = 40.

## Q89 · numeric · medium
What is steps after this code?

```java
int steps = 0;
for (int n = 0; n < 20; n += 6)
    steps++;
```
= 4
> Hint: List the values n takes before n < 20 becomes false.
> Explanation: n takes the values 0, 6, 12, 18, so steps is 4.

## Q90 · single · medium
What is the output if n is 3?

```java
for (int i = 1; i <= n; ++i) {
    int factorial = 1;
    factorial = factorial * i;
    System.out.print(factorial + " ");
}
```
- [ ] 1 1 1
- [x] 1 2 3
- [ ] 1 2 6
- [ ] Error: cannot use i inside the loop
> Hint: Where is factorial set back to 1?
> Explanation: factorial is reset to 1 every pass, so each pass prints 1 * i: 1 2 3.

## Q91 · single · medium
What is the output?

```java
for (rows = 0; rows < 2; ++rows) {
    for (columns = 0; columns < 3; ++columns) {
        System.out.print("x");
    }
    System.out.println();
}
```
- [ ] xxx xxx (one line)
- [ ] xx xx xx
- [ ] xx / xx / xx (three lines)
- [x] xxx / xxx (two lines)
> Hint: The inner loop prints x's; the println after it starts a new line.
> Explanation: Each row prints 3 x's followed by a newline, for 2 rows.

## Q92 · numeric · medium
How many x's are output?

```java
i = 1;
while (i <= 3) {
    j = 1;
    while (j <= i) {
        System.out.print("x");
        ++j;
    }
    System.out.println();
    ++i;
}
```
= 6
> Hint: On row i, the inner loop prints i x's.
> Explanation: Row i prints i x's: 1 + 2 + 3 = 6.

## Q93 · single · medium · on-exam
How many x's are output?

```java
for (row = 0; row < 2; ++row) {
    System.out.print("x");
    for (col = 0; col < 3; ++col) {
        // Do something
    }
}
```
- [ ] 1
- [x] 2
- [ ] 3
- [ ] 6
> Hint: Is the print inside the inner loop or only the outer one?
> Explanation: The print is in the outer loop only, which runs twice.

## Q94 · single · medium
What is the output?

```java
char letter1 = 'p';
char letter2;
while (letter1 <= 'q') {
    letter2 = 'x';
    while (letter2 <= 'y') {
        System.out.print("" + letter1 + letter2 + " ");
        ++letter2;
    }
    ++letter1;
}
```
- [ ] px
- [ ] px py
- [ ] qx qy
- [x] px py qx qy
> Hint: The outer loop picks the first letter, the inner loop the second.
> Explanation: letter1 goes p, q and letter2 goes x, y for each: px py qx qy.

## Q95 · numeric · medium
How many times is "Hello" printed?

```java
for (int i = 2; i <= 4; i++)
    for (int j = 2; j < 4; j++)
        System.out.println("Hello");
```
= 6
> Hint: Count the values of i and of j, then multiply.
> Explanation: i takes 3 values (2 to 4) and j takes 2 values (2 to 3): 3 * 2 = 6.

## Q96 · single · medium
What is printed?

```java
for (int i = 1; i < 3; i++) {
    for (int j = 1; j <= 3; j++) {
        System.out.print(i * 10 + j);
        System.out.print(" ");
    }
    System.out.println();
}
```
- [x] 11 12 13 / 21 22 23 (two lines)
- [ ] 11 21 12 22 13 23
- [ ] 11 12 13 14 / 21 22 23 24
- [ ] 1 2 3 / 2 4 6
> Hint: Each row prints i * 10 + j for j = 1, 2, 3, then a newline.
> Explanation: i = 1 prints 11 12 13, then a newline; i = 2 prints 21 22 23.

## Q97 · numeric · hard
What is count after this code?

```java
int count = 0;
for (int i = 1; i <= 5; i++)
    for (int j = i; j <= 5; j++)
        count++;
```
= 15
> Hint: For each i, the inner loop runs from j = i to 5. Count the passes per row.
> Explanation: The inner loop runs 5, 4, 3, 2, 1 times: 15.

## Q98 · single · medium
What is the output?

```java
for (int i = 10; i > 0; i -= 3)
    System.out.print(i + " ");
```
- [ ] 10 7 4
- [ ] 7 4 1
- [x] 10 7 4 1
- [ ] 10 7 4 1 -2
> Hint: Subtract 3 each time and stop once i > 0 is false.
> Explanation: i goes 10, 7, 4, 1; the next value, -2, fails i > 0.

## Q99 · single · medium · on-exam
What is the output?

```java
for (int i = 1; i <= 20; i *= 2)
    System.out.print(i + " ");
```
- [ ] 1 2 4 8
- [ ] 2 4 8 16
- [ ] 1 2 4 8 16 32
- [x] 1 2 4 8 16
> Hint: i doubles each pass. Stop when i <= 20 is false.
> Explanation: i doubles: 1, 2, 4, 8, 16. The next value, 32, fails i <= 20.

## Q100 · numeric · hard
What is count after this code?

```java
int count = 0;
for (int i = 0, j = 10; i < j; i++, j--)
    count++;
```
= 5
> Hint: List the pairs (i, j) and stop when i < j is false.
> Explanation: The pairs checked are (0, 10), (1, 9), (2, 8), (3, 7) and (4, 6); all pass i < j. Next is (5, 5), and 5 < 5 is false. So the body runs 5 times.

## Q101 · numeric · medium
What is sum after this code?

```java
int sum = 0;
for (int i = 1; i < 10; i += 2)
    sum += i;
```
= 25
> Hint: i takes the odd numbers below 10.
> Explanation: 1 + 3 + 5 + 7 + 9 = 25.

# Topic: Boolean Expressions (Relational & Logical Operators)

## Q102 · single · easy
Which expression determines whether x is less than or equal to y?
- [ ] `x =< y`
- [x] `x <= y`
- [ ] `x >= y`
- [ ] `x > y`
> Hint: Two of these are real Java operators but test the wrong relationship, and one isn't valid Java at all.
> Explanation: `<=` is Java's less-than-or-equal operator; `=<` is not a valid operator.

## Q103 · single · easy
Which is the "not equal" operator in Java?
- [ ] `<>`
- [ ] `NOT`
- [x] `!=`
- [ ] `*&`
> Hint: Two of these choices aren't Java syntax at all.
> Explanation: `!=` means "not equal"; `<>` and `NOT` are not Java operators.

## Q104 · single · easy
This type of operator determines whether a specific relationship exists between two values.
- [ ] Mathematical
- [ ] Unary
- [ ] Logical
- [x] Relational
> Hint: These operators describe how two values relate to each other.
> Explanation: Relational operators (`<`, `>`, `==`, `!=`, `<=`, `>=`) test a relationship between two values.

## Q105 · single · easy · on-exam
A Boolean expression is one that is either:
- [ ] x or y
- [ ] Positive or negative
- [x] true or false
- [ ] None of the above
> Hint: A boolean has only two possible values.
> Explanation: A boolean expression always evaluates to exactly one of two values: true or false.

## Q106 · single · easy
A flag variable may have the values:
- [ ] 0 or 1
- [ ] +1 or -1
- [ ] Any character
- [x] true or false
> Hint: A flag is a boolean variable.
> Explanation: A flag is a boolean variable, so its only possible values are true and false.

## Q107 · single · medium
Which expression evaluates to false if x is 0 and y is 10?
- [ ] `(x == 0) && (y == 10)`
- [x] `(x == 0) && (y == 20)`
- [ ] `(x == 0) || (y == 10)`
- [ ] `(x == 0) || (y == 20)`
> Hint: Evaluate each side with x = 0 and y = 10. && needs both sides true; || needs only one.
> Explanation: x == 0 is true but y == 20 is false, and true && false is false. The other three are true.

## Q108 · single · easy
Both must be true for a person to ride: (1) at least 5 years old, (2) taller than 36 inches. Which expression is true if a person can ride?
- [x] `(age >= 5) && (height > 36)`
- [ ] `(age >= 5) || (height > 36)`
- [ ] `(age > 5) && (height <= 36)`
- [ ] `(age > 5) || (height <= 36)`
> Hint: Both rules must hold. Turn 'at least' and 'taller than' into operators carefully.
> Explanation: Both conditions must hold, so they are joined with &&. "At least 5" is >= 5 and "taller than 36" is > 36.

## Q109 · single · medium
A restaurant gives a discount to children under 10 and to adults over 55. Which expression is true if a discount should be given?
- [ ] `(age < 10) && (age > 55)`
- [x] `(age < 10) || (age > 55)`
- [ ] `(age >= 10) && (age <= 55)`
- [ ] `(age >= 10) || (age <= 55)`
> Hint: Can one age be under 10 and over 55 at the same time?
> Explanation: A discount applies if either condition holds, so use ||. No age can be both < 10 and > 55, so && would never be true.

## Q110 · single · medium
Which expression is true exactly when x is between 50 and 100 inclusive?
- [ ] `(x >= 50) || (x <= 100)`
- [ ] `50 >= x <= 100`
- [ ] `50 <= x <= 100`
- [x] `(x >= 50) && (x <= 100)`
> Hint: 'Inclusive' means the end values count. Java can't chain comparisons like a <= x <= b.
> Explanation: Inclusive bounds need >= and <=, joined with && because both must hold. Java does not allow chained comparisons like 50 <= x <= 100.

## Q111 · single · medium · on-exam
Which expression decides whether x is NOT between 10 and 20 (exclusive)?
- [x] `!(10 < x && x < 20)`
- [ ] `!(x < 10 && x < 20)`
- [ ] `!(x < 10 || x < 20)`
- [ ] `!(x > 10 || x < 20)`
> Hint: First write an expression for 'between', then negate the whole thing.
> Explanation: (10 < x && x < 20) is true exactly when x is between 10 and 20, so negating it with ! gives "not between".

## Q112 · multi · medium
Given `int x = 4;` and `int y = 9;`, which expressions are true? (Select all)
- [x] `x < y && y < 10`
- [ ] `x > 3 && y > 10`
- [x] `!(x == y)`
- [x] `x % 2 == 0 || y % 2 == 0`
- [ ] `x + 5 > y`
> Hint: Plug in x = 4 and y = 9 and evaluate each expression one by one.
> Explanation: 4 < 9 and 9 < 10 are both true. 9 > 10 is false. 4 != 9, so !(x == y) is true. 4 is even, so the || is true. 4 + 5 > 9 is 9 > 9, which is false.

## Q113 · single · medium
A president served from 1885 to 1889 and from 1893 to 1897 (inclusive). Which expression detects a year x in office?
- [ ] `(x > 1885 && x < 1889) || (x > 1893 && x < 1897)`
- [x] `(x >= 1885 && x <= 1889) || (x >= 1893 && x <= 1897)`
- [ ] `(x >= 1885 && x <= 1889) && (x >= 1893 && x <= 1897)`
- [ ] `(x > 1885 && x <= 1889) || (x > 1893 && x <= 1897)`
> Hint: Inclusive ranges need >= and <=. Can one year be in both terms at once?
> Explanation: Each term must include both end years, so use >= and <=. The two terms are joined with || because a year can fall in either one.

## Q114 · single · medium
Which expression correctly evaluates 13 < num < 30?
- [ ] `(num < 13) && (num < 30)`
- [ ] `(num < 13) || (num < 30)`
- [x] `(num > 13) && (num < 30)`
- [ ] `(num > 13) || (num < 30)`
> Hint: Java has no chained comparisons, so split it into two tests joined by the right operator.
> Explanation: Java has no chained comparisons. 13 < num < 30 must be written as (num > 13) && (num < 30).

## Q115 · single · hard
Given x = 1, y = 2, z = 3, how is `(x == 5) || (y == 2) && (z == 5)` evaluated? Items in parentheses are evaluated first.
- [x] false OR (true AND false) → false OR false → false
- [ ] false OR (true AND false) → false OR true → true
- [ ] (false OR true) AND false → true AND false → false
- [ ] (false OR true) AND false → true AND false → true
> Hint: && is evaluated before ||.
> Explanation: && is evaluated before ||, so the AND part is grouped first: false || (true && false) = false || false = false.

## Q116 · single · hard
Given that `&&` has higher precedence than `||`, what is the value of: `true || (true && false) && (true || false)`?
- [x] true
- [ ] false
> Hint: Group the && parts first, then look at the value on the left of ||.
> Explanation: && binds tighter, so the expression is true || ((true && false) && (true || false)). Anything ORed with true is true.

## Q117 · single · medium · on-exam
Which is the correct boolean expression for: int x is between, but not including, 500 and 650, OR int y is not equal to 1000?
- [ ] `((x >= 500 && x <= 650) && (y != 1000))`
- [x] `((x > 500 && x < 650) || (y != 1000))`
- [ ] `((x < 500 && x > 650) || !(y == 1000))`
- [ ] `((x > 500 AND x < 650) OR !(y.equal(1000)))`
> Hint: 'Not including' means strict < and >. Which operator joins the two big parts?
> Explanation: "Between but not including" uses > and <, joined with &&. That whole part is then ORed with y != 1000.

## Q118 · single · medium
Which value of x causes short-circuit evaluation, so `y < 4` is NOT evaluated in `(x >= 7) && (y < 4)`?
- [x] 6
- [ ] 7
- [ ] 8
- [ ] No such value
> Hint: For &&, if the left side is false, the result is already decided.
> Explanation: If x >= 7 is false (x = 6), the whole && expression must be false, so Java skips y < 4.

## Q119 · single · medium
Which value of y causes short-circuit evaluation, so `z == 99` is NOT evaluated in `(y > 50) || (z == 99)`?
- [ ] 40
- [ ] 50
- [x] 60
- [ ] No such value
> Hint: For ||, if the left side is true, the result is already decided.
> Explanation: If y > 50 is true (y = 60), the whole || expression must be true, so Java skips z == 99.

## Q120 · single · hard
Fill in XXX so the code prints "Leap year" exactly for leap years (divisible by 4 but not by 100, unless divisible by 400).

```java
if (XXX)
    System.out.println("Leap year");
```
- [x] `(year % 4 == 0 && year % 100 != 0) || year % 400 == 0`
- [ ] `(year % 4 == 0 || year % 100 != 0) && year % 400 == 0`
- [ ] `year % 4 == 0 && year % 100 == 0`
- [ ] `year % 400 == 0 || year % 4 != 0`
> Hint: Check the rule with 2024, 1900 and 2000.
> Explanation: The rule is (divisible by 4 AND not by 100) OR divisible by 400. For example, 2024 and 2000 are leap years, but 1900 is not.

## Q121 · single · hard
Suppose x = 10 and y = 10. What is x after evaluating `(y > 10) || (x++ > 10)`?
- [ ] 10
- [ ] 9
- [x] 11
> Hint: Is y > 10 true? If not, Java must evaluate the right side too.
> Explanation: y > 10 is false, so Java must evaluate the right side; x++ runs and x becomes 11.

## Q122 · single · hard
What is x after this code?

```java
int x = 10;
boolean b = (x < 5) && (++x > 0);
```
- [x] 10
- [ ] 11
- [ ] 5
> Hint: Is x < 5 true? If not, does && need to look at the right side?
> Explanation: x < 5 is false, so && short-circuits and ++x never runs. x stays 10.

## Q123 · single · easy · on-exam
________ works like this: if the expression on the left side of `&&` is false, the expression on the right side is not checked.
- [ ] Reverse logic
- [x] Short-circuit evaluation
- [ ] Relational evaluation
- [ ] Boolean logic
> Hint: It's the name for skipping the right side when the left side decides the answer.
> Explanation: Short-circuit evaluation skips the right operand when the left operand already decides the result.

## Q124 · multi · hard
Which expressions always have the same value as `!(a || b)` for booleans a and b? (Select all)
- [x] `!a && !b`
- [ ] `!a || !b`
- [x] `!(b || a)`
- [ ] `a && b`
> Hint: De Morgan's law: the ! flips || into &&. Does the order of a and b matter?
> Explanation: By De Morgan's law, !(a || b) equals !a && !b. Swapping the operands of || does not change its value, so !(b || a) is also equal.

## Q125 · single · medium
hasFunds and recentlyUsed are booleans. Which branch runs when an account lacks funds AND has not been used recently?
- [x] `if (!hasFunds && !recentlyUsed)`
- [ ] `if (!hasFunds && recentlyUsed)`
- [ ] `if (hasFunds && !recentlyUsed)`
- [ ] `if (hasFunds && recentlyUsed)`
> Hint: 'Lacks funds' and 'not used recently' are both negations, and both must be true.
> Explanation: "Lacks funds" is !hasFunds and "not used recently" is !recentlyUsed; both must be true, so join them with &&.

## Q126 · single · easy
To quit, a user types 'q'; any other key continues. Which expression is true if the user should continue?
- [ ] `key == 'q'`
- [x] `key != 'q'`
- [ ] `(!key) == 'q'`
- [ ] `key == (!'q')`
> Hint: The user continues for every key except one.
> Explanation: The user continues for any key except 'q', so the test is key != 'q'.

## Q127 · single · easy
int x is 5 and int y is 7. What is boolean z after `z = (x > y);`?
- [ ] true
- [x] false
- [ ] Runtime error
- [ ] Syntax error
> Hint: Just evaluate 5 > 7.
> Explanation: 5 > 7 is false, so z is assigned false.

## Q128 · single · medium
Which operator is evaluated first in `x + y < y - z * 2`?
- [ ] `+`
- [ ] `<`
- [ ] `-`
- [x] `*`
> Hint: Arithmetic precedence: which comes first, * or + and -?
> Explanation: Multiplication has higher precedence than +, -, and <, so z * 2 is computed first.

## Q129 · single · medium · on-exam
Why should programmers avoid the comparison `x == 0.3` with double x?
- [x] 0.3 may not be represented exactly in floating point
- [ ] Doubles should not be compared with integers
- [ ] Variables should not be compared with literals
- [ ] The 0.3 should come first: `0.3 == x`
> Hint: Can every decimal number be stored exactly in binary?
> Explanation: Many decimal values such as 0.3 cannot be stored exactly in binary floating point, so == may fail.

## Q130 · single · medium
Which expression best determines whether double variable x is 74.7?
- [ ] `Math.abs(x - 74.7) != 0.0001`
- [ ] `Math.abs(x - 74.7) > 0.0001`
- [x] `Math.abs(x - 74.7) < 0.0001`
- [ ] `Math.abs(x - 74.7) == 0.0001`
> Hint: Two doubles are 'equal' when their difference is very small.
> Explanation: Compare doubles by checking that their difference is smaller than a tiny tolerance.

## Q131 · single · hard
Which expression is equivalent to `!(x > 5 && y < 3)`?
- [x] `x <= 5 || y >= 3`
- [ ] `x <= 5 && y >= 3`
- [ ] `x < 5 || y > 3`
- [ ] `!x > 5 || !y < 3`
> Hint: De Morgan's law: !(A && B) is !A || !B. Then flip each comparison.
> Explanation: De Morgan's law: !(A && B) equals !A || !B. !(x > 5) is x <= 5 and !(y < 3) is y >= 3.

## Q132 · single · hard
What are b and x after this code?

```java
int x = 5;
boolean b = (x > 3) && (x++ < 10) || (x == 100);
```
- [ ] b = true, x = 5
- [x] b = true, x = 6
- [ ] b = false, x = 6
- [ ] b = false, x = 5
> Hint: x++ uses the old value of x in the comparison, then adds 1. Also check whether || needs its right side.
> Explanation: x > 3 is true. x++ < 10 compares 5 < 10 (true), then x becomes 6. The || short-circuits, so b is true and x is 6.

## Q133 · single · easy
Which expression is true exactly when int n is odd?
- [ ] `n / 2 == 1`
- [ ] `n % 2 == 0`
- [x] `n % 2 != 0`
- [ ] `n % 1 == 0`
> Hint: What is the remainder when an odd number is divided by 2?
> Explanation: An odd number leaves a remainder when divided by 2, so n % 2 != 0. This also works for negative odd numbers.

## Q134 · multi · medium
Which expressions correctly test whether Strings a and b contain the same characters? (Select all)
- [x] `a.equals(b)`
- [x] `a.compareTo(b) == 0`
- [ ] `a == b`
- [ ] `a = b`
> Hint: Which ones compare contents, and which compare references or assign?
> Explanation: equals and compareTo compare contents. == compares references, which may differ even when the text is the same, and = is assignment.

## Q135 · single · medium · on-exam
str1 is "Hi" and str2 is "Hello". Which expression is true?
- [ ] `str1.compareTo(str2) < 0`
- [x] `str1.compareTo(str2) > 0`
- [ ] `str1.equals(str2)`
- [ ] Comparison not possible
> Hint: compareTo compares character by character. Both start with H, so compare the second letters.
> Explanation: Both start with H. 'i' comes after 'e' in Unicode order, so "Hi" is greater and compareTo returns a positive number.

## Q136 · single · medium
str1 and str2 are Strings. Which of these correctly test whether they have the same contents? (1) `str1 = str2` (2) `str1.equals(str2)` (3) `str1.compareTo(str2) == 0`
- [ ] 1, 2, and 3
- [ ] 3 only
- [ ] 2 only
- [x] 2 and 3
> Hint: One of these is assignment, not comparison.
> Explanation: = is assignment, not a comparison. equals() and compareTo() == 0 both compare contents.

## Q137 · single · medium
str is "Great". Which choice lists only expressions that are true?
- [x] `str.equals("Great")`
- [ ] `str.equals("Great")`, `str.equals("great")`
- [ ] `str.equals("Great")`, `str.equals("Great!")`
- [ ] `str.equals("Great")`, `str.equals("great")`, `str.equals("Great!")`
> Hint: equals is case-sensitive and must match exactly, punctuation included.
> Explanation: equals is case-sensitive and exact, so only "Great" matches; "great" and "Great!" do not.

## Q138 · single · easy
chr is a char variable. Which if statement is written correctly?
- [x] `if (chr == 'a')`
- [ ] `if (chr == "a")`
- [ ] `if (chr = "a")`
- [ ] `if (chr = 'a')`
> Hint: A char literal uses single quotes, and comparison uses ==.
> Explanation: Compare chars with == against a char literal in single quotes. "a" is a String, and = is assignment.

# Topic: Converting Between the Conditional (Ternary) Operator and if-else

## Q139 · numeric · medium
What is pay after these statements?

```java
int hours = 45;
double pay, payRate = 10.00;
pay = hours <= 40 ? hours * payRate
                  : 40 * payRate + (hours - 40) * payRate * 1.5;
```
= 475
> Hint: Is 45 <= 40? If not, use the expression after the colon.
> Explanation: 45 <= 40 is false, so pay = 40 * 10 + (45 - 40) * 10 * 1.5 = 400 + 75 = 475.0.

## Q140 · single · easy
Which if-else is equivalent to `max = (a > b) ? a : b;`?
- [x] `if (a > b) max = a; else max = b;`
- [ ] `if (a > b) max = b; else max = a;`
- [ ] `if (a < b) max = a; else max = b;`
- [ ] `max = a; if (a > b) max = b;`
> Hint: condition ? valueIfTrue : valueIfFalse.
> Explanation: condition ? x : y means "if condition then x, else y". When a > b, max gets a; otherwise it gets b.

## Q141 · single · medium
Which statement converts this if-else into a single conditional (ternary) statement?

```java
if (n % 2 == 0)
    label = "even";
else
    label = "odd";
```
- [x] `label = (n % 2 == 0) ? "even" : "odd";`
- [ ] `label = (n % 2 == 0) ? "odd" : "even";`
- [ ] `label = n % 2 == 0 : "even" ? "odd";`
- [ ] `(n % 2 == 0) ? label = "even" : label = "odd";`
> Hint: Order: condition, ?, value if true, :, value if false.
> Explanation: The condition goes first, then ?, the true value, :, and the false value. The whole expression is assigned to label.

## Q142 · single · medium
Which if-else is equivalent to `fee = (age >= 65) ? 5 : 12;`?
- [x] `if (age >= 65) fee = 5; else fee = 12;`
- [ ] `if (age > 65) fee = 5; else fee = 12;`
- [ ] `if (age >= 65) fee = 12; else fee = 5;`
- [ ] `if (age >= 65) fee = 5; fee = 12;`
> Hint: Keep the condition exactly as written. Which value goes with true?
> Explanation: The condition stays exactly age >= 65, and 5 is the true value. Without the else, the last choice always ends with fee = 12.

## Q143 · numeric · medium · on-exam
What is price after this code?

```java
int age = 16;
double price = (age < 12) ? 5.0 : (age < 18) ? 7.5 : 10.0;
```
= 7.5
> Hint: Check the first condition; if it is false, move on to the second ?:.
> Explanation: 16 < 12 is false, so the second ?: is evaluated. 16 < 18 is true, so price = 7.5.

## Q144 · single · hard
Which if-else chain is equivalent to this nested conditional?

```java
grade = (s >= 90) ? 'A' : (s >= 80) ? 'B' : 'C';
```
- [x] `if (s >= 90) grade = 'A'; else if (s >= 80) grade = 'B'; else grade = 'C';`
- [ ] `if (s >= 90) grade = 'A'; if (s >= 80) grade = 'B'; else grade = 'C';`
- [ ] `if (s >= 80) grade = 'B'; else if (s >= 90) grade = 'A'; else grade = 'C';`
- [ ] `if (s < 90) grade = 'A'; else if (s < 80) grade = 'B'; else grade = 'C';`
> Hint: The second ?: is only reached when the first condition is false.
> Explanation: The second conditional is only reached when s >= 90 is false, which is an else-if. In the second choice the separate if overwrites 'A' with 'B' (s = 95 gives 'B'). The third choice can never reach 'A'.

## Q145 · single · easy
Given x = 0, what is y after `y = (x > 0) ? 10 : -10;`?
- [ ] 0
- [x] -10
- [ ] 10
- [ ] 20
> Hint: Is 0 > 0?
> Explanation: 0 > 0 is false, so the value after the colon is used: y = -10.

## Q146 · multi · medium
Which statements correctly store the absolute value of int x in y? (Select all)
- [x] `y = (x < 0) ? -x : x;`
- [x] `if (x < 0) y = -x; else y = x;`
- [x] `y = (x >= 0) ? x : -x;`
- [ ] `y = (x < 0) ? x : -x;`
> Hint: Negative numbers must be negated and others kept as they are. Check each choice with x = -3 and x = 3.
> Explanation: Negative values must be negated and others kept. The first three do this (one as an if-else, two as conditionals with opposite conditions). The last one swaps the two values.

## Q147 · single · easy
If x is 50, what is y after `y = (x < 21) ? 100 : x;`?
- [ ] 'x'
- [ ] 21
- [x] 50
- [ ] 100
> Hint: Is 50 < 21? If not, which value is used?
> Explanation: 50 < 21 is false, so y gets the value after the colon, which is x (50).

## Q148 · numeric · medium
The conditional statement below is equivalent to an if-else. What is y?

```java
int x = 8;
int y = (x % 3 == 0) ? x / 3 : x * 2 + 1;
```
= 17
> Hint: Is 8 divisible by 3? Then pick the matching expression.
> Explanation: 8 % 3 is 2, so the condition is false and the else value is used: 8 * 2 + 1 = 17.

## Q149 · single · medium
What is ans after these statements?

```java
int y = 30;
double ans, val = 10.0;
ans = (y <= 40) ? y * val : val * 1.5;
```
- [ ] 315.0
- [ ] 15.0
- [x] 300.0
- [ ] 10.0
> Hint: Is 30 <= 40? Then calculate the chosen expression.
> Explanation: 30 <= 40 is true, so ans = 30 * 10.0 = 300.0.

## Q150 · single · hard
Which statement correctly replaces this if-else with a conditional expression?

```java
if (temp > 30)
    System.out.println("Hot");
else
    System.out.println("Mild");
```
- [x] `System.out.println((temp > 30) ? "Hot" : "Mild");`
- [ ] `(temp > 30) ? System.out.println("Hot") : System.out.println("Mild");`
- [ ] `System.out.println((temp > 30) ? "Mild" : "Hot");`
- [ ] `System.out.println((temp > 30) : "Hot" ? "Mild");`
> Hint: ?: produces a value. Can println be used as a value?
> Explanation: ?: produces a value, so it can go inside a single println. The second choice does not compile: println returns nothing (void), so it cannot be a value of ?:, and a ?: expression cannot stand alone as a statement. The third choice swaps "Hot" and "Mild", and the fourth has ? and : in the wrong order.

## Q151 · single · medium · on-exam
A restaurant serves breakfast before 11 am, then lunch. time ranges 0–23. Which XXX gives the correct meal in `mealString = XXX;`?
- [ ] `(time > 11) ? "Breakfast" : "Lunch"`
- [ ] `(time == 11) ? "Breakfast" : "Lunch"`
- [x] `(time < 11) ? "Breakfast" : "Lunch"`
- [ ] `(time != 11) ? "Breakfast" : "Lunch"`
> Hint: Breakfast is before 11, so which comparison picks it?
> Explanation: Breakfast is served when time < 11, so that condition chooses "Breakfast"; otherwise "Lunch".

## Q152 · single · medium
Which statement is equivalent to this if-else inside a method?

```java
if (a < b)
    return a;
else
    return b;
```
- [x] `return (a < b) ? a : b;`
- [ ] `return (a < b) ? b : a;`
- [ ] `return a < b ? a, b;`
- [ ] `(a < b) ? return a : return b;`
> Hint: return can't go inside ?:, but ?: can go inside a return.
> Explanation: Return the value of the conditional expression: a when a < b, otherwise b. return cannot appear inside the ?: operator.

## Q153 · numeric · hard
What is r after this code?

```java
int a = 7, b = 3;
int max = (a > b) ? a : b;
int r = (max % 2 == 0) ? max / 2 : max * 3 + 1;
```
= 22
> Hint: First find max, then check whether it is even or odd.
> Explanation: max = 7 because 7 > 3. 7 % 2 is 1 (odd), so r = 7 * 3 + 1 = 22.

## Q154 · single · medium
Which statement is equivalent to `if (score >= 60) result = "Pass"; else result = "Fail";`?
- [ ] `result = (score >= 60) ? "Fail" : "Pass";`
- [ ] `result = score >= 60 : "Pass" ? "Fail";`
- [ ] `result = (score < 60) ? "Pass" : "Fail";`
- [x] `result = (score >= 60) ? "Pass" : "Fail";`
> Hint: Keep the condition score >= 60 and put the value for true first.
> Explanation: condition ? valueIfTrue : valueIfFalse. Here score >= 60 gives "Pass", otherwise "Fail".

# Topic: Completing Branching & Looping Code

## Q155 · single · medium
Which expressions for XXX / YYY / ZZZ output "Great job" for scores above 90 and "Nice try" otherwise?

```java
if (XXX) {
    System.out.println(YYY);
}
else {
    System.out.println(ZZZ);
}
```
- [ ] score < 91 / "Great job" / "Nice try"
- [x] score < 91 / "Nice try" / "Great job"
- [ ] score > 90 / "Nice try" / "Great job"
- [ ] Not possible
> Hint: Test a score of 95 and a score of 90 with each choice.
> Explanation: score < 91 means score is 90 or below, which should print "Nice try". Otherwise (above 90) the else prints "Great job".

## Q156 · single · medium
Given year is positive, which XXX / YYY / ZZZ output the correct range?

```java
if (XXX) { System.out.println("1-100"); }
else if (YYY) { System.out.println("101-200"); }
else if (ZZZ) { System.out.println("201-300"); }
else { System.out.println("Other"); }
```
- [ ] year > 0 / year > 99 / year > 199
- [ ] year > 0 / year > 100 / year > 200
- [ ] year < 100 / year < 200 / year < 300
- [x] year < 101 / year < 201 / year < 301
> Hint: Test year = 100 and year = 150 with each choice.
> Explanation: Each test should check the upper limit of its range: year < 101 means 1–100, year < 201 means 101–200, and so on.

## Q157 · single · medium
Assume int x is 0 or greater. Which YYY / ZZZ output the ranges correctly?

```java
if (YYY) { /* "0-29" */ }
else if (ZZZ) { /* "30-39" */ }
else { /* "40+" */ }
```
- [ ] x < 29 / x >= 29
- [ ] x < 30 / x >= 30
- [x] x < 30 / x < 40
- [ ] x > 29 / x > 40
> Hint: The else-if only sees values that failed the first test.
> Explanation: x < 30 catches 0–29. The else-if only sees x >= 30, so x < 40 gives 30–39, and everything else is 40+.

## Q158 · single · medium · on-exam
Which XXX / YYY output "Pre-teen" (under 13) and "Teenager" (13 through 19)?

```java
if (XXX) { /* "Pre-teen" */ }
else if (YYY) { /* "Teenager" */ }
```
- [ ] age <= 13 / age > 13
- [ ] age < 13 / age < 19
- [x] age < 13 / age <= 19
- [ ] age >= 13 / age <= 19
> Hint: Test ages 12, 13 and 19 with each choice.
> Explanation: Pre-teen is age < 13. The else-if only sees 13 and up, so age <= 19 covers 13 through 19.

## Q159 · single · medium
Fill in XXX so the loop counts how many of the 10 inputs are negative.

```java
int negCount = 0;
for (int i = 0; i < 10; i++) {
    int v = scnr.nextInt();
    if (XXX)
        negCount++;
}
```
- [x] `v < 0`
- [ ] `v <= 0`
- [ ] `negCount < 0`
- [ ] `v > 0`
> Hint: Is 0 a negative number?
> Explanation: Negative means less than 0. v <= 0 would also count zeros.

## Q160 · single · hard
Which XXX outputs "Modern era" for every year 1980 and later?

```java
if (year < 2000) { /* "Past" */ }
else if (XXX) { /* "Modern era" */ }
```
- [ ] year > 1980
- [ ] year >= 1980
- [ ] year >= 2000
- [x] No such expression exists
> Hint: Where do the years 1980 to 1999 go first?
> Explanation: Every year below 2000, including 1980–1999, is already caught by the "Past" branch, so no later condition can reach them.

## Q161 · single · medium
Which XXX outputs two lowercase strings in alphabetical order?

```java
if (XXX) {
    System.out.println(firstStr + " " + secondStr);
}
else {
    System.out.println(secondStr + " " + firstStr);
}
```
- [ ] `firstStr.equals(secondStr)`
- [x] `firstStr.compareTo(secondStr) < 0`
- [ ] `firstStr.compareTo(secondStr) > 0`
- [ ] `!firstStr.equals(secondStr)`
> Hint: compareTo returns a negative number when the first string comes earlier alphabetically.
> Explanation: compareTo < 0 means firstStr comes first alphabetically, so print it first; otherwise print secondStr first.

## Q162 · single · medium
Which XXX / YYY output the sum of the input integers, stopping when -1 is input?

```
val = Get next input
XXX
While val is not -1
    YYY
    val = Get next input
Put sum to output
```
- [ ] sum = val / sum = val
- [ ] sum = val / sum = sum + val
- [x] sum = 0 / sum = sum + val
- [ ] sum = 0 / sum = val
> Hint: What should sum start at before anything is added?
> Explanation: sum must start at 0, and each value is added to the running total with sum = sum + val.

## Q163 · single · hard
Fill in XXX so the menu repeats until the user enters q or Q.

```java
char choice;
do {
    System.out.print("Choice: ");
    choice = scnr.next().charAt(0);
} while (XXX);
```
- [x] `choice != 'q' && choice != 'Q'`
- [ ] `choice != 'q' || choice != 'Q'`
- [ ] `choice == 'q' || choice == 'Q'`
- [ ] `choice == 'q' && choice == 'Q'`
> Hint: Keep looping while the choice is not q AND not Q. Try 'q' with each choice.
> Explanation: Keep looping while the choice is neither q nor Q, which needs &&. With ||, the condition is always true, because no char equals both.

## Q164 · single · medium · on-exam
Which XXX / YYY output the number of times 10 is input, stopping when 0 is input?

```
count = 0
val = Get next input
While val is not 0
    If val == 10
        XXX
    Else
        YYY
    val = Get next input
Put count to output
```
- [ ] count = count + 1 / count = 0
- [x] count = count + 1 / (nothing)
- [ ] count = count + val / (nothing)
- [ ] count = count + val / count = 0
> Hint: What should happen to count when the value isn't 10? Should it be erased?
> Explanation: Add 1 when the value is 10 and do nothing otherwise. Resetting count to 0 would erase earlier matches.

## Q165 · single · medium
Which XXX / YYY output the smallest non-negative input, stopping when a negative value is input?

```
val = Get next input
min = val
While val is not negative
    If XXX
        YYY
    val = Get next input
Put min to output
```
- [ ] val > 0 / min = val
- [ ] min < val / val = min
- [ ] val > min / val = min
- [x] val < min / min = val
> Hint: When should min change?
> Explanation: When a value is smaller than the current min, it becomes the new min.

## Q166 · single · medium
Which XXX / YYY loop as long as the input is an integer less than 100?

```java
w = scnr.nextInt();
while (XXX) {
    // Do something
    YYY;
}
```
- [x] w < 100 / w = scnr.nextInt()
- [ ] w >= 100 / (nothing)
- [ ] w < 100 / (nothing)
- [ ] w >= 100 / w = scnr.nextInt()
> Hint: The loop must read a new value each pass or it never ends.
> Explanation: Loop while w < 100, and read the next value at the end of each pass so the loop can end.

## Q167 · single · medium
The loop should sum all inputs, stopping at 0. For input 2 4 6 0, sum ends at 12. What are XXX / YYY / ZZZ?

```java
int sum;
int currVal;
XXX;
currVal = scnr.nextInt();
while (YYY) {
    ZZZ;
    currVal = scnr.nextInt();
}
```
- [x] sum = 0 / currVal != 0 / sum = sum + currVal
- [ ] sum = currVal / currVal == 0 / sum = currVal
- [ ] sum = 1 / currVal != 0 / sum = sum + 1
- [ ] sum = scnr.nextInt() / currVal == 0 / sum = scnr.nextInt()
> Hint: sum starts at 0, the loop stops at 0, and each pass adds the current value.
> Explanation: Start sum at 0, loop while currVal != 0, and add currVal to sum each pass.

## Q168 · single · medium
Fill in XXX so the loop prints the multiples of 7 from 1 to 50.

```java
for (int i = 1; i <= 50; i++) {
    if (XXX)
        System.out.print(i + " ");
}
```
- [x] `i % 7 == 0`
- [ ] `i / 7 == 0`
- [ ] `i % 7 == 1`
- [ ] `7 % i == 0`
> Hint: A multiple of 7 has a remainder of 0 when divided by 7.
> Explanation: A multiple of 7 leaves remainder 0 when divided by 7: 7, 14, ..., 49.

## Q169 · single · medium
Which XXX adds input values until a 0 is input?

```java
int number;
int sum = 0;
do {
    number = scnr.nextInt();
    sum = sum + number;
} while (XXX);
```
- [ ] `sum != 0`
- [ ] `number == 0`
- [x] `number != 0`
- [ ] `number > 0`
> Hint: Keep looping while the number just read is not the stop value.
> Explanation: Keep looping while the number just read is not 0.

## Q170 · single · medium · on-exam
Which XXX keeps prompting until a value greater than 10 is entered?

```java
do {
    System.out.println("Enter a number greater than 10:");
    userInput = scnr.nextInt();
} while XXX;
```
- [ ] `(!(userInput < 10))`
- [ ] `(userInput < 10)`
- [x] `(!(userInput > 10))`
- [ ] `(userInput > 10)`
> Hint: Repeat while the input is NOT what we want.
> Explanation: Repeat while the input is NOT greater than 10: !(userInput > 10). The loop exits once a value above 10 is entered.

## Q171 · single · medium
The loop should output 1 to n (for n = 5: 12345). What are XXX / YYY?

```java
n = scnr.nextInt();
for (XXX; i++) {
    System.out.print(YYY);
}
```
- [ ] i = 0; i < n / i
- [x] i = 0; i < n / i + 1
- [ ] i = 1; i < n / i
- [ ] i = 1; i < n / i + 1
> Hint: If i runs from 0 to n - 1, what must be printed to show 1 to n?
> Explanation: i runs 0 to n - 1, so printing i + 1 gives 1 through n.

## Q172 · single · medium
The program finds the largest of 10 integers (positive or negative). What should XXX be?

```java
for (i = 0; i < 10; ++i) {
    currValue = scnr.nextInt();
    if (i == 0) {          // First iteration
        XXX;
    }
    else if (currValue > maxSoFar) {
        maxSoFar = currValue;
    }
}
```
- [ ] `maxSoFar = 0`
- [x] `maxSoFar = currValue`
- [ ] `currValue = 0`
- [ ] `currValue = maxSoFar`
> Hint: What value should maxSoFar have after the first input, even if every input is negative?
> Explanation: On the first pass maxSoFar is set to the first value, which works even if every input is negative.

## Q173 · single · medium
Fill in XXX so the code prints the pattern shown (1, then 12, then 123, each on its own line).

```java
for (int r = 1; r <= 3; r++) {
    for (int c = 1; XXX; c++)
        System.out.print(c);
    System.out.println();
}
```
- [x] `c <= r`
- [ ] `c < r`
- [ ] `c <= 3`
- [ ] `c <= r + 1`
> Hint: Row r should print exactly r numbers.
> Explanation: Row r prints the numbers 1 through r, so the inner loop runs while c <= r.

## Q174 · single · medium
The program should output the even values from -10 to 10 inclusive. What should XXX be in `for (XXX) { System.out.print(i + " "); }`?
- [ ] `i = -10; i < 10; i = i + 2`
- [x] `i = -10; i <= 10; i = i + 2`
- [ ] `i = -10; (i * 2) < 10; ++i`
- [ ] `i = -10; (i * 2) <= 10; ++i`
> Hint: Include both -10 and 10, and step through the even numbers.
> Explanation: Start at -10, include 10 with <=, and step by 2.

## Q175 · single · medium
Which XXX outputs every character of inputWord in `for (XXX) { System.out.println(inputWord.charAt(i)); }`?
- [ ] `i = 0; i < (inputWord.length() - 1); ++i`
- [x] `i = 0; i < inputWord.length(); ++i`
- [ ] `i = 0; i < (inputWord.length() + 1); ++i`
- [ ] `i = 0; i <= inputWord.length(); ++i`
> Hint: Valid indices go from 0 up to length() - 1.
> Explanation: Valid indices are 0 to length() - 1, so loop while i < inputWord.length().

## Q176 · single · medium · on-exam
Which YYY prints str in reverse ("Oh my" → "ym hO") in `for (YYY) { System.out.print(str.charAt(i)); }`?
- [ ] `i = str.length(); i < 0; --i`
- [ ] `i = str.length(); i > 0; --i`
- [x] `i = str.length() - 1; i >= 0; --i`
- [ ] `i = str.length() + 1; i > 0; --i`
> Hint: What is the index of the last character?
> Explanation: Start at the last index, length() - 1, and count down to 0.

## Q177 · single · medium
Which XXX outputs only the values 1 through 3?

```java
for (i = 1; i < 10; i++) {
    System.out.print(i + " ");
    XXX {
        break;
    }
}
```
- [ ] `if (i != 3)`
- [x] `if (i == 3)`
- [ ] `if (i != 4)`
- [ ] `if (i == 4)`
> Hint: The print happens before the check. When should break happen?
> Explanation: Print first, then break when i == 3, so 1, 2, 3 are printed.

## Q178 · single · hard
In each pair below, only one statement is correct. The program should output: `50 40 30 20 10 40 30 20 10 30 20 10 20 10 10`. Which pair of statements produces this output?

```java
1A  for (int i = 50; i >= 10; i = i - 10)
1B  for (int i = 5; i > 0; i--)
    {
2A      for (int j = 1; j <= i; j++)
2B      for (int j = i; j >= 1; j--)
        {
            System.out.print(j * 10);
            System.out.print(" ");
        }
    }
```
- [ ] 1A and 2A
- [ ] 1A and 2B
- [ ] 1B and 2A
- [x] 1B and 2B
> Hint: Row 1 prints 5 values, row 2 prints 4. Which outer loop gives 5 rows, and which inner loop counts down?
> Explanation: 1B gives i = 5, 4, 3, 2, 1, and 2B counts j down from i, so each row prints i*10 down to 10.

# Topic: Converting Between while, do-while & for Loops

## Q179 · single · medium
Which for loop is equivalent to this while loop?

```java
int k = 10;
while (k > 0) {
    System.out.print(k + " ");
    k -= 2;
}
```
- [x] `for (int k = 10; k > 0; k -= 2) System.out.print(k + " ");`
- [ ] `for (int k = 10; k >= 0; k -= 2) System.out.print(k + " ");`
- [ ] `for (int k = 0; k < 10; k += 2) System.out.print(k + " ");`
- [ ] `for (int k = 10; k > 0; k--) System.out.print(k + " ");`
> Hint: Move the setup, the condition and the update into the for header without changing them.
> Explanation: The initialization, condition, and update move into the for header unchanged: k = 10; k > 0; k -= 2.

## Q180 · single · hard
A do-while loop is rewritten as a while loop with the same body and the same condition. When can the output change?
- [x] When the condition is false the very first time it is checked
- [ ] When the body contains a print statement
- [ ] When the loop runs more than once
- [ ] Never; the two are always equivalent
> Hint: What is different about the first pass of a do-while?
> Explanation: A do-while always runs its body once before testing. If the condition is false at the start, the do-while runs once and the while loop runs zero times.

## Q181 · multi · hard · on-exam
Which do-while loops print exactly the same output as `for (int i = 3; i < 12; i += 4) System.out.print(i + " ");`? (Select all)
- [x] `int i = 3; do { System.out.print(i + " "); i += 4; } while (i < 12);`
- [x] `int i = -1; do { i += 4; System.out.print(i + " "); } while (i < 11);`
- [ ] `int i = 3; do { i += 4; System.out.print(i + " "); } while (i < 12);`
- [ ] `int i = 3; do { System.out.print(i + " "); i += 4; } while (i < 16);`
> Hint: First write out what the for loop prints, then trace each do-while.
> Explanation: The for loop prints 3 7 11. The first two print 3 7 11. Updating before printing (third) prints 7 11 15, and i < 16 (fourth) prints 3 7 11 15.

## Q182 · numeric · medium
This for loop is rewritten as a while loop with i declared before the loop. After the while version finishes, what is the value of i?

```java
for (int i = 1; i <= 100; i *= 3)
    count++;
```
= 243
> Hint: Trace i: it is multiplied by 3 until i <= 100 is false. What value made it stop?
> Explanation: i takes the values 1, 3, 9, 27, 81, then 243. 243 <= 100 is false, so the loop stops with i = 243.

## Q183 · single · hard
Which do-while loop is equivalent to this while loop for every input, including a first value of -1?

```java
int age = scnr.nextInt();
while (age != -1) {
    total += age;
    age = scnr.nextInt();
}
```
- [x] `int age = scnr.nextInt(); if (age != -1) { do { total += age; age = scnr.nextInt(); } while (age != -1); }`
- [ ] `int age; do { age = scnr.nextInt(); total += age; } while (age != -1);`
- [ ] `int age = scnr.nextInt(); do { total += age; age = scnr.nextInt(); } while (age != -1);`
- [ ] `int age = scnr.nextInt(); do { total += age; } while (age != -1);`
> Hint: A do-while always runs once. What if the very first input is -1?
> Explanation: A do-while always runs once, so you need an if to protect against a first value of -1. The second and third choices add the sentinel -1 to total, and the last never reads new input.

## Q184 · single · medium
Which while loop produces the same output as this do-while loop?

```java
int n = 1;
do {
    System.out.print(n);
    n *= 2;
} while (n < 20);
```
- [x] `int n = 1; while (n < 20) { System.out.print(n); n *= 2; }`
- [ ] `int n = 2; while (n < 20) { System.out.print(n); n *= 2; }`
- [ ] `int n = 1; while (n < 20) { n *= 2; System.out.print(n); }`
- [ ] `int n = 1; while (n > 20) { System.out.print(n); n *= 2; }`
> Hint: Does n = 1 pass n < 20 the first time? If so, the while version behaves the same.
> Explanation: n starts at 1, which already passes n < 20, so a while loop with the same body and condition prints the same 1 2 4 8 16.

## Q185 · single · easy
When converting a for loop into a while loop, which part of the for header goes before the while statement?
- [x] The initialization
- [ ] The condition
- [ ] The update
- [ ] The loop body
> Hint: Which part runs only once, before any checking happens?
> Explanation: The initialization runs once before the loop, the condition goes in while (...), and the update goes at the end of the body.

## Q186 · single · hard
A student converted this for loop into the while loop below. Why does the while version never end?

```java
for (int i = 0; i < 5; i++) {
    if (i == 2) continue;
    sum += i;
}
// converted:
int i = 0;
while (i < 5) {
    if (i == 2) continue;
    sum += i;
    i++;
}
```
- [x] continue skips i++, so i stays 2 forever
- [ ] The condition should be i <= 5
- [ ] sum is never updated
- [ ] continue is not allowed in a while loop
> Hint: In the while version, where is i++? What does continue skip?
> Explanation: In a for loop, continue still runs the update i++. In the while version, the update is at the end of the body, so continue skips it and i never changes from 2.

## Q187 · single · easy · on-exam
Which while loop is equivalent to `for (int i = 0; i < 5; i++) System.out.print(i);`?
- [x] `int i = 0; while (i < 5) { System.out.print(i); i++; }`
- [ ] `int i = 0; while (i < 5) { i++; System.out.print(i); }`
- [ ] `int i = 0; while (i <= 5) { System.out.print(i); i++; }`
- [ ] `int i = 1; while (i < 5) { System.out.print(i); i++; }`
> Hint: Keep the same start, condition and order: print, then update.
> Explanation: Initialize before the loop, keep the same condition, and put the update at the end of the body. Updating first prints 1–5 instead of 0–4.

## Q188 · multi · hard
Which code prints exactly the same output as this do-while loop? (Select all)

```java
int i = 10;
do {
    System.out.print(i);
    i++;
} while (i < 5);
```
- [x] `int i = 10; System.out.print(i); i++; while (i < 5) { System.out.print(i); i++; }`
- [x] `for (int i = 10; i == 10; i++) System.out.print(i);`
- [ ] `int i = 10; while (i < 5) { System.out.print(i); i++; }`
- [ ] `for (int i = 10; i < 5; i++) System.out.print(i);`
> Hint: The do-while prints once, then 11 < 5 is false. Which choices also run exactly once?
> Explanation: The do-while prints 10 once, then 11 < 5 is false. Running the body once before a while copies that behavior, and the i == 10 loop also runs exactly once. The last two run zero times.

## Q189 · single · medium
Which loop is equivalent to this for loop?

```java
int i, sum = 0;
for (i = 2; i <= 30; i++) {
    sum += i;
    i++;
}
```
- [ ] `int i = 2, sum = 0; while (i <= 30) { sum += i; i++; }`
- [ ] `int i, sum = 0; for (i = 1; i <= 30; i++) { sum += i; i++; }`
- [x] `int i = 2, sum = 0; while (i <= 30) { sum += i; i += 2; }`
- [ ] `int i, sum = 0; do { i = 2; sum += i; i++; } while (i <= 30);`
> Hint: i is increased twice per pass in the original. How much does it grow each pass?
> Explanation: The body adds i and then increments i once, and the header increments it again, so i grows by 2 each pass.

# Topic: Identifying Errors in Code

## Q190 · single · medium
What is grade after this code?

```java
int score = 95;
String grade = "B";
if (score => 90)
    grade = "A";
```
- [ ] "A"
- [ ] "B"
- [ ] ""
- [x] No value, there is a syntax error
> Hint: Look closely at the comparison operator.
> Explanation: => is not a Java operator; greater-than-or-equal is written >=. The code does not compile.

## Q191 · single · easy
If you prematurely terminate an if statement with a semicolon, the compiler will:
- [ ] Assume you are placing a null statement there
- [ ] Not display an error message
- [x] All of the above
- [ ] None of the above
> Hint: Does Java complain about a semicolon right after if (...)?
> Explanation: Java treats the stray semicolon as an empty (null) statement and gives no error. That is why the bug is easy to miss.

## Q192 · single · easy
Which line has a compile error?

```java
1: int count = 0;
2: for (int i = 0; i < 5; i++) {
3:     count += i
4: }
```
- [x] Line 3
- [ ] Line 1
- [ ] Line 2
- [ ] Line 4
> Hint: Check each line for a missing piece of punctuation.
> Explanation: Line 3 is missing its semicolon.

## Q193 · single · medium · on-exam
What happens with this code?

```java
int y = 10;
if (y == 10) {
    int x = 30;
    x += y;
}
System.out.print("x = ");
System.out.print(x);
```
- [ ] x = 30
- [ ] x = 40
- [ ] x = 20
- [x] Compile error: x is not known outside the if block
> Hint: Where is x declared? Does it still exist after the closing brace?
> Explanation: x is declared inside the if block, so it does not exist after the closing brace. Using it there is a compile error.

## Q194 · single · hard
What is y's ending value?

```java
int x;
int y = 0;
x = scnr.nextInt();
if (x = 20) {
    y = 3;
}
```
- [ ] Always 0
- [ ] Always 20
- [ ] 3 when the input is 20, else 0
- [x] Compile error: Java will not allow `x = 20` as a condition
> Hint: An if condition must be a boolean. What type does x = 20 produce?
> Explanation: x = 20 is an assignment whose value is an int, and an if condition must be a boolean. The code does not compile.

## Q195 · single · medium
Which line has a compile error?

```java
1: int total = 0;
2: while (total < 10) {
3:     int step = 2;
4:     total += step;
5: }
6: System.out.println(step);
```
- [x] Line 6
- [ ] Line 3
- [ ] Line 4
- [ ] There is no error
> Hint: Where is step declared, and where is it used?
> Explanation: step is declared inside the loop body, so it is out of scope on line 6.

## Q196 · single · hard
str is "Cat". What is the result of `str.charAt(1) = "ab";`?
- [ ] str is "abt"
- [ ] str is "Catab"
- [ ] str is "Cab"
- [x] Compile error: charAt cannot be assigned
> Hint: Can a method call appear on the left side of =?
> Explanation: The left side of = must be a variable. str.charAt(1) is a method call that returns a char value, so it cannot be assigned to (and "ab" is a String, not a char). The code does not compile. To get different text, you build a new String instead.

## Q197 · truefalse · easy
True or False: a variable declared in the for loop header can be used after the loop exits.
- [ ] True
- [x] False
> Hint: Where does a variable declared in the for header stop existing?
> Explanation: A variable declared in the for header only exists inside the loop.

## Q198 · single · medium
This code is supposed to print the numbers 1 through 10. What is the error?

```java
int i = 1;
while (i < 10) {
    System.out.print(i + " ");
    i++;
}
```
- [x] The condition should be i <= 10, because the code stops at 9
- [ ] i should start at 0
- [ ] i++ should come before the print
- [ ] There is no error
> Hint: What is the last value printed with i < 10?
> Explanation: With i < 10 the loop prints 1 to 9. Changing the condition to i <= 10 includes 10. This is an off-by-one logic error.

## Q199 · truefalse · medium · on-exam
True or False: the following code compiles.

```java
for (int i = 0; i < 3; i++) {
    int sq = i * i;
}
System.out.println(sq);
```
- [ ] True
- [x] False
> Hint: Where is sq declared, and where is it used?
> Explanation: sq is declared inside the loop body, so it does not exist after the loop. This is a compile error.

## Q200 · single · medium
This code compiles but does not print "Welcome" even when the user types yes. What is the fix?

```java
String answer = scnr.next();
if (answer == "yes")
    System.out.println("Welcome");
```
- [x] Use `answer.equals("yes")` instead of `==`
- [ ] Replace "yes" with 'yes'
- [ ] Add a semicolon after the if condition
- [ ] Nothing is wrong with the code
> Hint: == compares whether two String variables refer to the same object, not their text.
> Explanation: == compares String references, not contents. Use equals() to compare the text.

## Q201 · single · medium
What is the output?

```java
public static void main(String[] args) {
    for (int i = 0; i < 3; ++i) {
        System.out.print(i);
    }
    System.out.print(i);
}
```
- [ ] 012
- [ ] 0122
- [ ] 0123
- [x] Error: i is not declared in this scope
> Hint: Where does i stop existing?
> Explanation: i is declared in the for header, so using it after the loop does not compile.

## Q202 · single · easy
Is `for ( ; ; );` valid Java code?
- [x] Yes
- [ ] No
> Hint: Which parts of a for header are optional?
> Explanation: All three parts of a for header are optional, and a missing condition means true. It compiles as an infinite loop.

## Q203 · multi · medium
Which variables can still be used after this loop? (Select all)

```java
int total = 0;
int count = 0;
for (int i = 0; i < 3; i++) {
    int sq = i * i;
    total += sq;
    count++;
}
```
- [x] total
- [x] count
- [ ] i
- [ ] sq
> Hint: Which variables were declared before the loop began?
> Explanation: total and count are declared before the loop, so they are still in scope after it. i belongs to the for header and sq to the loop body; both go out of scope when the loop ends.

## Q204 · single · hard
The code should print "One" when n is 1 and "Two" when n is 2, but for n = 1 it prints "OneTwo". What is the error?

```java
switch (n) {
    case 1: System.out.print("One");
    case 2: System.out.print("Two"); break;
}
```
- [x] case 1 is missing a break, so it falls through into case 2
- [ ] case 2 should not have a break
- [ ] A switch needs a default case
- [ ] n must be a String
> Hint: What happens at the end of a case with no break?
> Explanation: Without break, execution continues into the next case. Adding break after case 1's print fixes it.

## Q205 · single · easy · on-exam
A programmer must write a 500-line program. Which is most likely the best approach?
- [ ] Write 1 line, run and debug, repeat
- [x] Write 10–20 lines, run and debug, repeat
- [ ] Write 250 lines, run and debug, write 250 more
- [ ] Write all 500 lines, then run and debug
> Hint: Think about how easy it is to find a bug in a small amount of new code.
> Explanation: Incremental development with small, frequently tested steps finds errors early without wasting time.

## Q206 · single · hard
What is the output? (Note the semicolon after the for header.)

```java
int i;
for (i = 0; i < 5; i++);
System.out.print(i);
```
- [x] 5
- [ ] 01234
- [ ] 4
- [ ] Compile error
> Hint: What does the semicolon right after the for header do?
> Explanation: The semicolon is an empty loop body. The loop just counts i up to 5, then the print runs once.

## Q207 · multi · medium
Which lines contain an error (compile-time or runtime)? (Select all)

```java
1: int[] scores = new int[3];
2: scores[3] = 90;
3: int n = scores.length();
4: scores[0] = 85;
```
- [x] Line 2
- [x] Line 3
- [ ] Line 1
- [ ] Line 4
> Hint: Check each line for a bad index and for array syntax.
> Explanation: Line 2 uses index 3, but valid indices are 0–2 (runtime ArrayIndexOutOfBoundsException). Line 3 is a compile error, because arrays use length with no parentheses.

## Q208 · single · hard
What is the result of this code?

```java
final int ARRAY_SIZE = 5;
float[] x = float[ARRAY_SIZE];
for (int i = 1; i <= ARRAY_SIZE; i++) {
    x[i] = 10.0;
}
```
- [ ] All values are set to 10.0
- [x] There is a compilation error
- [ ] It compiles, then fails at runtime
- [ ] All values except the first are set to 10.0
> Hint: Look at how the array is created and at the type of 10.0.
> Explanation: float[ARRAY_SIZE] is missing the keyword new, and 10.0 is a double, which cannot be stored in a float without a cast (10.0f would work). The code does not compile. Even after those fixes, i = 5 would be out of bounds, because the valid indices are 0 to 4.

## Q209 · single · hard
What is the result of this code?

```java
int[] marks = { 90, 45, 67 };
for (int i = 0; i <= 3; i++)
    System.out.println(marks[i]);
```
- [ ] No output
- [ ] All marks print with no problems
- [x] The marks print, then an ArrayIndexOutOfBoundsException occurs
- [ ] Infinite loop
> Hint: How many elements are there, and what is the last index the loop uses?
> Explanation: Valid indices are 0–2. The loop goes to 3, so the marks print and then an ArrayIndexOutOfBoundsException occurs.

## Q210 · single · hard
What happens?

```java
int[] x = new int[5];
int i;
for (i = 0; i < x.length; i++)
    x[i] = i;
System.out.println(x[i]);
```
- [ ] Displays 0 1 2 3 4
- [ ] Displays 4
- [ ] Compile error: i is not defined
- [x] Runtime error: ArrayIndexOutOfBoundsException
> Hint: What is i after the loop finishes? Is that a valid index?
> Explanation: After the loop i equals 5, and x[5] is past the last index 4, so an exception is thrown.

## Q211 · single · medium · on-exam
This code should add 1 + 2 + ... + n, but for n = 4 it gives 6 instead of 10. Which fix is correct?

```java
int sum = 0;
for (int i = 1; i < n; i++)
    sum += i;
```
- [x] Change `i < n` to `i <= n`
- [ ] Start i at 0
- [ ] Start sum at 1
- [ ] Change `i++` to `++i`
> Hint: With i < n, is n itself ever added?
> Explanation: i < n stops at n - 1, so n itself is never added. Starting at 0 adds nothing extra, and ++i behaves the same as i++ here.

## Q212 · single · hard
What happens with this code?

```java
public static void show() {
    System.out.print(count);
}
public static void main(String[] args) {
    int count = 5;
    show();
}
```
- [x] Compile error: count is not visible inside show
- [ ] It prints 5
- [ ] It prints 0
- [ ] Runtime error
> Hint: Where is count declared? Can another method see it?
> Explanation: count is a local variable of main. show cannot see it, so the code does not compile; pass it as a parameter instead.

## Q213 · single · hard
What is wrong with this method?

```java
public static int half(double x) {
    return x / 2;
}
```
- [x] Compile error: a double cannot be returned as an int without a cast
- [ ] Nothing; it returns x / 2 rounded
- [ ] Runtime error when x is odd
- [ ] Compile error: double parameters are not allowed
> Hint: What type does x / 2 produce, and what type must the method return?
> Explanation: x / 2 is a double, and the return type is int. Java will not narrow a double to an int automatically, so it needs a cast such as (int) (x / 2).

## Q214 · single · medium
What is wrong with this method?

```java
public static int half(int n) {
    if (n > 0)
        return n / 2;
}
```
- [ ] It returns 0 for negative n
- [x] Compile error: missing return statement
- [ ] Runtime error
- [ ] Nothing is wrong
> Hint: What does the method return when n is 0 or negative?
> Explanation: When n <= 0 no return statement runs, so the compiler reports a missing return statement.

# Topic: Arrays: Declaring and Index Values

## Q215 · truefalse · easy
True or False: an array can hold values of several different data types at the same time.
- [ ] True
- [x] False
> Hint: Look at how an array is declared: one type for the whole array.
> Explanation: Every element of a Java array has the same type.

## Q216 · single · easy
The first element of an array always has what index?
- [ ] -1
- [ ] 1
- [x] 0
- [ ] None of these
> Hint: Java counts positions starting from the smallest non-negative number.
> Explanation: Array indices always start at 0.

## Q217 · single · easy · on-exam
What is the term for the number used to pinpoint a specific element within an array?
- [ ] Global unique identifier
- [ ] Element
- [x] Subscript (index)
- [ ] Argument
> Hint: It's the number in the square brackets.
> Explanation: The index (subscript) selects an element.

## Q218 · multi · easy
Which statements correctly create an int array with 4 elements? (Select all)
- [x] `int[] a = new int[4];`
- [x] `int[] a = {0, 0, 0, 0};`
- [x] `int a[] = new int[4];`
- [ ] `int[] a = new int(4);`
- [ ] `int[4] a;`
> Hint: Check each one for the brackets, the keyword new, and where the size is allowed to appear.
> Explanation: new int[4] and a 4-value initializer both create 4 elements, and int a[] is legal (older C-style) syntax. Parentheses are wrong, and a size cannot appear in the declared type.

## Q219 · truefalse · easy
True or False: Java limits the number of dimensions an array may have to 15.
- [ ] True
- [x] False
> Hint: Have you ever seen Java complain about the number of [ ] pairs?
> Explanation: There is no 15-dimension limit in Java. (Technically the JVM allows up to 255 dimensions, far more than any normal program uses.)

## Q220 · single · easy
Each array in Java has a public field named ________ that contains the number of elements.
- [ ] size
- [ ] capacity
- [ ] limit
- [x] length
> Hint: It's a field, so it has no parentheses.
> Explanation: Arrays have a length field (no parentheses).

## Q221 · multi · medium
Given `int[] v = {3, 6, 9};`, which expressions are true? (Select all)
- [x] `v.length == 3`
- [x] `v[v.length - 1] == 9`
- [ ] `v[3] == 9`
- [ ] `v.length() == 3`
> Hint: The last valid index is length - 1. Do arrays have a length() method?
> Explanation: length is 3 and the last index is 2, which holds 9. v[3] throws ArrayIndexOutOfBoundsException, and arrays have no length() method.

## Q222 · numeric · medium
What is x[8] after this code?

```java
final int SUB = 12;
int[] x = new int[SUB];
int y = 100;
for (int i = 0; i < SUB; i++) {
    x[i] = y;
    y += 10;
}
```
= 180
> Hint: Write a formula for x[i] in terms of i, then use i = 8.
> Explanation: x[i] = 100 + 10 * i, so x[8] = 180.

## Q223 · truefalse · easy · on-exam
True or False: to compare the contents of two arrays, you must compare their elements.
- [x] True
- [ ] False
> Hint: What does == compare for arrays?
> Explanation: == only compares references, so compare element by element (or use Arrays.equals).

## Q224 · single · medium
After this code, how is the content of value best described?

```java
int[] array1 = new int[25];
// ... code that fills array1
int value = array1[0];
for (int a = 1; a < array1.length; a++) {
    if (array1[a] < value)
        value = array1[a];
}
```
- [ ] The sum of the values
- [x] The lowest value
- [ ] The highest value
- [ ] The average of the values
> Hint: value is replaced whenever a smaller element is found.
> Explanation: value is replaced whenever a smaller element is found, so it ends as the smallest value.

## Q225 · single · medium
What is a after this code?

```java
int[] x = { 55, 33, 88, 22, 99, 11, 44, 66, 77 };
int a = 10;
if (x[2] > x[5])
    a = 5;
else
    a = 8;
```
- [ ] 8
- [ ] 10
- [x] 5
- [ ] Compile error: you cannot compare array elements
> Hint: Find x[2] and x[5] (counting from 0), then compare them.
> Explanation: x[2] = 88 and x[5] = 11, so 88 > 11 is true and a = 5.

## Q226 · single · medium
Given `String[] names = {"Ana", "Bo", "Cy"};`, which loop is valid?
- [ ] `for (int i = 0; i < names.length(); i++) System.out.println(names[i].length());`
- [x] `for (int i = 0; i < names.length; i++) System.out.println(names[i].length());`
- [ ] `for (int i = 0; i < names.length; i++) System.out.println(names[i].length);`
- [ ] `for (int i = 0; i < names.length(); i++) System.out.println(names[i].length);`
> Hint: Arrays use length as a field; Strings use length() as a method.
> Explanation: Arrays use .length (a field) and Strings use .length() (a method).

## Q227 · single · easy
By default, Java initializes the elements of a whole-number (int) array to:
- [x] 0
- [ ] 100
- [ ] 1
- [ ] -1
> Hint: What do numeric array elements hold before you assign anything?
> Explanation: Numeric array elements default to 0.

## Q228 · single · easy
How do you refer to the third element of an array named a?
- [ ] `a(2)`
- [x] `a[2]`
- [ ] `a[3]`
- [ ] `a(3)`
> Hint: The first element is a[0].
> Explanation: Indices start at 0, so the third element is a[2].

## Q229 · single · medium · on-exam
Which statement correctly initializes a String array?
- [ ] `String[] suit = { Clubs, Diamonds, Hearts, Spades };`
- [ ] `String[] suit; suit = { "Clubs", "Diamonds", "Hearts", "Spades" };`
- [x] `String[] suit = { "Clubs", "Diamonds", "Hearts", "Spades" };`
- [ ] None of these
> Hint: Strings need quotes, and an initializer list only works in the declaration itself.
> Explanation: An initializer list needs quoted Strings and must be part of the declaration statement.

## Q230 · single · easy
Array scorePerQuiz has 10 elements. Which assigns element 7 the value 8?
- [ ] `scorePerQuiz = 8;`
- [x] `scorePerQuiz[7] = 8;`
- [ ] `scorePerQuiz[0] = 8;`
- [ ] `scorePerQuiz[8] = 7;`
> Hint: Square brackets hold the index, and = sets the value.
> Explanation: Square brackets with index 7 select element 7.

## Q231 · single · easy
How many elements are in `double[] list = new double[5];`?
- [ ] 4
- [ ] 0
- [ ] 6
- [x] 5
> Hint: The number in new double[5] is the number of elements.
> Explanation: new double[5] creates exactly 5 elements.

## Q232 · single · easy
Which declaration is correct?
- [ ] `int a = new int[2];`
- [ ] `int a() = new int[2];`
- [ ] `int[] a = new int(2);`
- [x] `int[] a = new int[2];`
> Hint: The type needs [ ], and new uses square brackets for the size.
> Explanation: The type is int[], and new int[2] uses square brackets.

## Q233 · single · easy
What is `flags[1]` after `boolean[] flags = new boolean[3];`?
- [x] false
- [ ] true
- [ ] null
- [ ] 0
> Hint: What is the default value of a boolean?
> Explanation: boolean elements default to false.

## Q234 · single · medium
Given `int[] a = {1, 2, 3};`, what is stored in the variable a itself?
- [x] A memory address (a reference to the array)
- [ ] 1
- [ ] null
- [ ] The three numbers
> Hint: An array is an object. What does an object variable store?
> Explanation: An array variable holds a reference (memory address) to the array object.

## Q235 · single · hard · on-exam
What is the output?

```java
int[] list = {1, 2, 3, 4, 5, 6};
for (int i = 1; i < list.length; i++)
    list[i] = list[i - 1];
for (int i = 0; i < list.length; i++)
    System.out.print(list[i] + " ");
```
- [x] 1 1 1 1 1 1
- [ ] 2 3 4 5 6 6
- [ ] 2 3 4 5 6 1
- [ ] 1 2 3 4 5 6
> Hint: Each element copies the one before it, and that one was already changed.
> Explanation: Each element copies the one before it, which was already set to 1, so every element becomes 1.

## Q236 · single · medium
What is printed?

```java
double[] myList = {1, 5, 5, 5, 1};
double max = myList[0];
int indexOfMax = 0;
for (int i = 1; i < myList.length; i++) {
    if (myList[i] > max) {
        max = myList[i];
        indexOfMax = i;
    }
}
System.out.println(indexOfMax);
```
- [ ] 0
- [x] 1
- [ ] 2
- [ ] 3
> Hint: Does > update when it finds an equal value?
> Explanation: > only updates on a strictly bigger value, so the first 5 (index 1) is kept.

## Q237 · numeric · medium
What is idx after this code?

```java
int[] a = {4, 9, 2, 9, 1};
int idx = -1;
for (int i = 0; i < a.length; i++) {
    if (a[i] == 9)
        idx = i;
}
```
= 3
> Hint: idx is updated at every match, not just the first.
> Explanation: idx is updated at every 9, so it ends at the last match, index 3.

## Q238 · single · easy
Given `int[] a = {1, 2, 3};`, what is `a[0] - a[2]`?
- [x] -2
- [ ] -1
- [ ] 2
- [ ] 1
> Hint: a[0] is the first element and a[2] is the third.
> Explanation: a[0] - a[2] = 1 - 3 = -2.

## Q239 · truefalse · easy
True or False: declaring an array reference variable does not create an array.
- [x] True
- [ ] False
> Hint: Does writing int[] a; create any elements?
> Explanation: int[] a; only declares a reference; new or an initializer creates the array.

## Q240 · truefalse · easy
True or False: once an array is created, its size cannot be changed.
- [x] True
- [ ] False
> Hint: Can you change the length of an array after new?
> Explanation: An array's length is fixed when it is created.

## Q241 · single · hard · on-exam
What are x and y after this code?

```java
int[] x = {23, 55, 83, 19};
int[] y = {36, 78, 12, 24};
for (int a = 0; a < x.length; a++) {
    x[a] = y[a];
    y[a] = x[a];
}
```
- [ ] x = {23, 55, 83, 19} and y = {23, 55, 83, 19}
- [x] x = {36, 78, 12, 24} and y = {36, 78, 12, 24}
- [ ] x = {36, 78, 12, 24} and y = {23, 55, 83, 19}
- [ ] Compile error
> Hint: After x[a] = y[a], what value does x[a] hold when y[a] = x[a] runs?
> Explanation: x[a] gets y[a], then y[a] gets x[a], which is the same value. Both arrays end up holding y's original values.

## Q242 · single · medium
A program builds a 52-card deck from a 13-element `String[] rank` and a suit array. Which statement correctly declares and initializes the suit array?
- [x] `String[] suit = { "Clubs", "Diamonds", "Hearts", "Spades" };`
- [ ] `String[] suit; suit = { "Clubs", "Diamonds", "Hearts", "Spades" };`
> Hint: Where can an initializer list { ... } be used?
> Explanation: An initializer list can only be used in the same statement as the declaration.

## Q243 · single · medium
Given a 13-element `String[] rank` and a 4-element `String[] suit`, which statement correctly creates an array big enough for all 52 cards?
- [ ] `String[] deck = new String[suit * rank];`
- [x] `String[] deck = new String[suit.length * rank.length];`
> Hint: The size must be a number. What gives the number of elements in an array?
> Explanation: The size must be an int: suit.length * rank.length = 52. You cannot multiply two arrays.

## Q244 · single · hard
Which statement completes the loop so it fills `deck[0]` through `deck[51]` with Strings such as "Ace of Clubs"?

```java
int count = 0;
for (int i = 0; i < 13; i++) {
    for (int j = 0; j < 4; j++) {
        // missing statement
    }
}
```
- [x] `deck[count++] = rank[i] + " of " + suit[j];`
- [ ] `deck[++count] = rank[i] + " of " + suit[j];`
> Hint: The first card should go into index 0.
> Explanation: count++ uses index 0 first and ends at 51. ++count would skip index 0 and go out of bounds.

## Q245 · single · easy
Given `int[] arr = {4, 8, 15, 16, 23, 42};`, what is `arr[arr.length - 1]`?
- [ ] 23
- [x] 42
- [ ] 6
- [ ] Runtime error
> Hint: length - 1 is the last index.
> Explanation: length - 1 is the last index, which holds 42.

## Q246 · single · hard
What is printed?

```java
int[] a = {1, 2, 3};
int[] b = a;
b[0] = 99;
System.out.println(a[0]);
```
- [x] 99
- [ ] 1
- [ ] 0
- [ ] Compile error
> Hint: Does b = a copy the array or the reference?
> Explanation: b = a copies the reference, so a and b are the same array; changing b[0] changes a[0].

## Q247 · numeric · hard · on-exam
What is values[0] after this code?

```java
int[] values = new int[5];
for (int i = 1; i < 5; i++) {
    values[i] = i + values[i - 1];
}
values[0] = values[1] + values[4];
```
= 11
> Hint: Fill in values[1] to values[4] one at a time, then do the last line.
> Explanation: values becomes {0, 1, 3, 6, 10}. Then values[0] = values[1] + values[4] = 1 + 10 = 11.

## Q248 · single · medium
Given `int[] a = {1, 2, 3};` and `int[] b = {1, 2, 3};`, what is `a == b`?
- [ ] true
- [x] false
> Hint: What does == compare for arrays?
> Explanation: == compares references. These are two different arrays, so the result is false.

## Q249 · single · easy
What is total after this code?

```java
int[] nums = {3, 5, 7};
int total = 0;
for (int i = 0; i < nums.length; i++) {
    total += nums[i];
}
```
- [x] 15
- [ ] 10
- [ ] 7
- [ ] 3
> Hint: Add up the three elements.
> Explanation: 3 + 5 + 7 = 15.

## Q250 · numeric · medium
What is count after this code?

```java
int[] v = {2, 7, 4, 9, 6, 1};
int count = 0;
for (int i = 0; i < v.length; i++) {
    if (v[i] % 2 == 0)
        count++;
}
```
= 3
> Hint: Count the elements with remainder 0 when divided by 2.
> Explanation: The even values are 2, 4, and 6, so count is 3.

## Q251 · single · easy
What is the default value of each element in `char[] letters = new char[3];`?
- [x] '\u0000' (the null character)
- [ ] ' ' (a space)
- [ ] '0'
- [ ] null
> Hint: char is not a number type or an object. Its default is a special character.
> Explanation: Arrays get default values: 0 for numbers, false for boolean, and '\u0000' for char. null is only for object references.

## Q252 · single · hard
What is the output?

```java
int[] list = {1, 2, 3, 4, 5, 6};
for (int i = 0; i < list.length - 1; i++)
    list[i] = list[i + 1];
for (int i = 0; i < list.length; i++)
    System.out.print(list[i] + " ");
```
- [ ] 1 1 1 1 1 1
- [x] 2 3 4 5 6 6
- [ ] 2 3 4 5 6 1
- [ ] 1 2 3 4 5 6
> Hint: Each element takes its right neighbor's value. Does the last one change?
> Explanation: Each element takes the value of its right neighbor; the last element keeps 6.

## Q253 · single · medium · on-exam
Which loop header prints array list1 in reverse order (`System.out.print(list1[i] + " ");` is the body)?
- [ ] `for (int i = list1.length; i >= 0; i--)`
- [x] `for (int i = list1.length - 1; i >= 0; i--)`
- [ ] `for (int i = 0; i < list1.length; i++)`
- [ ] `for (int i = list1.length - 1; i > 0; i--)`
> Hint: Start at the last valid index and make sure index 0 is included.
> Explanation: Start at the last index, length - 1, and include index 0.

## Q254 · single · medium
After this code, what does pos hold?

```java
int pos = 0;
for (int i = 1; i < arr.length; i++) {
    if (arr[i] < arr[pos])
        pos = i;
}
```
- [ ] The index of the largest element
- [ ] The smallest value
- [x] The index of the (first) smallest element
- [ ] The number of elements
> Hint: pos stores an index and changes only when a strictly smaller value is found.
> Explanation: pos is updated whenever a smaller element is found, so it holds the index of the first smallest element.

## Q255 · single · easy
Which statement declares and initializes an array of five doubles?
- [x] `double[] d = {1.5, 2.0, 3.5, 4.0, 5.5};`
- [ ] `double d[5] = {1.5, 2.0, 3.5, 4.0, 5.5};`
- [ ] `double[5] d = {1.5, 2.0, 3.5, 4.0, 5.5};`
- [ ] `double d = {1.5, 2.0, 3.5, 4.0, 5.5};`
> Hint: Java doesn't put a size inside the brackets when you use an initializer list.
> Explanation: Use double[] with an initializer list; Java syntax does not put a size inside the brackets.

# Topic: break & continue

## Q256 · multi · easy
Which of these can be used to end a loop? (Select all)
- [x] Reading a sentinel value that makes the condition false
- [x] Setting a boolean flag to false
- [x] A break statement
- [ ] A continue statement
> Hint: Which of these makes the loop stop completely, and which only skips one pass?
> Explanation: Sentinels, flags, and break all end a loop. continue only skips to the next iteration.

## Q257 · single · hard
When does this loop terminate?

```java
int balance = 10;
while (true) {
    if (balance < 9) break;
    balance = balance - 9;
}
```
- [ ] When balance is 9
- [x] When balance is 1
- [ ] It is an infinite loop
- [ ] When the loop condition is false
> Hint: Trace balance: is it < 9 before the first subtraction? After it?
> Explanation: balance = 10 is not < 9, so 9 is subtracted (balance = 1). Next pass 1 < 9, so break exits.

## Q258 · numeric · hard
What is n after this code?

```java
int n = 50;
while (n > 1) {
    if (n % 7 == 0)
        break;
    n -= 4;
}
```
= 42
> Hint: Subtract 4 each time and check whether n is divisible by 7.
> Explanation: 50 % 7 and 46 % 7 are not 0, so n drops by 4 each time. At 42, 42 % 7 == 0 and break exits.

## Q259 · multi · hard · on-exam
Which statements about break and continue are true? (Select all)
- [x] break inside an inner loop exits only that inner loop
- [x] continue in a for loop still runs the update (such as i++)
- [ ] continue exits the loop completely
- [ ] break can only be used inside a switch
> Hint: break exits only the innermost loop. Where does continue jump to in a for loop?
> Explanation: break leaves only the innermost loop or switch. continue jumps to the update step of a for loop. continue does not exit the loop, and break also works in loops.

## Q260 · single · medium
What is the output?

```java
int num = 10;
while (num <= 15) {
    System.out.print(num + " ");
    if (num == 12) {
        break;
    }
    ++num;
}
System.out.print("Done");
```
- [ ] 10 Done
- [ ] 10 11 Done
- [x] 10 11 12 Done
- [ ] 10 11 12 13 14 15 Done
> Hint: Print happens before the break check.
> Explanation: 10 and 11 print. 12 prints, then break exits, then "Done" prints.

## Q261 · single · medium
What is the output?

```java
for (j = 0; j < 2; ++j) {
    for (k = 0; k < 4; ++k) {
        if (k == 2) {
            break;
        }
        System.out.print("" + j + k + " ");
    }
}
```
- [ ] 00 01 02
- [ ] 00 01 02 03
- [x] 00 01 10 11
- [ ] 00 01 02 10 11 12
> Hint: break only leaves the inner loop. The outer loop keeps going.
> Explanation: k == 2 breaks only the inner loop, so each j prints k = 0 and 1: 00 01 10 11.

## Q262 · single · medium
What is the output?

```java
for (i = 0; i <= 10; ++i) {
    if (i == 6)
        continue;
    else
        System.out.print(i + " ");
}
```
- [ ] 0 1 2 3 4 5
- [ ] 0 1 2 3 4 5 6
- [ ] 0 1 2 3 4 5 7 8 9
- [x] 0 1 2 3 4 5 7 8 9 10
> Hint: continue skips one value, not the rest of the loop.
> Explanation: continue skips the print only when i == 6; every other value 0 to 10 prints.

## Q263 · truefalse · easy
True or False: when the continue statement is encountered in a loop, the statements after it in the body are skipped and the loop moves to its next iteration.
- [x] True
- [ ] False
> Hint: Think about what continue does to the rest of the current pass.
> Explanation: continue skips the rest of the current pass and goes to the next iteration.

## Q264 · truefalse · easy
True or False: when the break statement is encountered in a loop, the remaining statements are skipped and the loop moves to its next iteration.
- [ ] True
- [x] False
> Hint: Does break move to the next pass or leave the loop?
> Explanation: break exits the loop completely; continue is the one that moves to the next iteration.

## Q265 · single · hard · on-exam
What is the output?

```java
for (int i = 0; i < 10; i++) {
    if (i % 3 == 0) continue;
    if (i == 8) break;
    System.out.print(i + " ");
}
```
- [x] 1 2 4 5 7
- [ ] 1 2 4 5 7 8
- [ ] 0 1 2 3 4 5 6 7
- [ ] 1 2 4 5 7 9
> Hint: Check the continue condition before the break condition on each pass.
> Explanation: Multiples of 3 (0, 3, 6) are skipped. At i = 8 the loop breaks before printing: 1 2 4 5 7.

## Q266 · single · hard
What is the output?

```java
for (int i = 1; i <= 3; i++) {
    for (int j = 1; j <= 3; j++) {
        if (j == i) break;
        System.out.print("" + i + j + " ");
    }
}
```
- [ ] 12 13 23
- [ ] 11 21 22 31 32 33
- [ ] 21 32
- [x] 21 31 32
> Hint: For each i, the inner loop stops as soon as j equals i.
> Explanation: Row 1 breaks right away. Row 2 prints 21, then breaks at j = 2. Row 3 prints 31 32.

## Q267 · numeric · medium
What is sum after this code?

```java
int sum = 0;
for (int i = 0; i < 5; i++) {
    if (i == 2) continue;
    sum += i;
}
```
= 8
> Hint: Which value of i is skipped?
> Explanation: i = 2 is skipped: 0 + 1 + 3 + 4 = 8.

# Topic: Tracing Method Calls

## Q268 · numeric · medium
What does `linearSearch(new int[]{4, 1, 6, 1}, 1)` return?

```java
public static int linearSearch(int[] list, int key) {
    for (int i = 0; i < list.length; i++) {
        if (key == list[i])
            return i;
    }
    return -1;
}
```
= 1
> Hint: The method returns as soon as it finds the first match.
> Explanation: Linear search returns the index of the first match. The first 1 is at index 1.

## Q269 · numeric · easy
What does `countMatches(new int[]{3, 7, 3, 3, 9}, 3)` return?

```java
public static int countMatches(int[] list, int key) {
    int count = 0;
    for (int i = 0; i < list.length; i++) {
        if (list[i] == key)
            count++;
    }
    return count;
}
```
= 3
> Hint: Count every element equal to the key.
> Explanation: The loop checks every element and counts each 3: indices 0, 2, and 3.

## Q270 · numeric · hard · on-exam
What is printed?

```java
public static int[] reverse(int[] list) {
    int[] result = new int[list.length];
    for (int i = 0, j = result.length - 1; i < list.length; i++, j--)
        result[j] = list[i];
    return result;
}
// in main:
int[] r = reverse(new int[]{1, 2, 3});
System.out.print(r[0] * 10 + r[2]);
```
= 31
> Hint: Work out the reversed array first, then the expression.
> Explanation: reverse returns {3, 2, 1}, so r[0] * 10 + r[2] = 30 + 1 = 31.

## Q271 · truefalse · easy
True or False: no two methods in the same program can have a local variable with the same name.
- [ ] True
- [x] False
> Hint: Are local variables shared between methods?
> Explanation: Local variables are scoped to their own method, so different methods can reuse a name.

## Q272 · multi · medium
Which statements about Java methods are true? (Select all)
- [x] A void method can use `return;` to exit early
- [x] Arguments are passed by value
- [ ] Local variables keep their values between calls
- [ ] A method can only be called from main
> Hint: Think about what return; does in a void method and how values reach parameters.
> Explanation: return; ends a void method early, and Java copies argument values into parameters. Locals are created fresh on each call, and any method can call another.

## Q273 · numeric · easy
What is the value of `Math.max(3, Math.min(10, 7))`?
= 7
> Hint: Work from the inside out.
> Explanation: Math.min(10, 7) is 7, and Math.max(3, 7) is 7.

## Q274 · single · hard
What happens with this program?

```java
public class Test {
    public static void main(String[] args) {
        System.out.println(xMethod(5, 500L));
    }
    public static int xMethod(int n, long l) {
        System.out.println("int, long");
        return n;
    }
    public static long xMethod(long n, long l) {
        System.out.println("long, long");
        return n;
    }
}
```
- [x] It displays "int, long" followed by 5
- [ ] It displays "long, long" followed by 5
- [ ] It does not compile: the call is ambiguous
- [ ] It runs but displays something else
> Hint: Which version's parameter types match (int, long) exactly?
> Explanation: (5, 500L) matches (int, long) exactly, so that version runs and prints "int, long", then 5.

## Q275 · single · easy
What is printed by `System.out.println(Math.pow(2, 3));`?
- [x] 8.0
- [ ] 8
- [ ] 6.0
- [ ] 9.0
> Hint: What type does Math.pow return?
> Explanation: Math.pow returns a double, so 2 to the power 3 prints as 8.0.

## Q276 · single · hard · on-exam
What is x after this code?

```java
public static int methodX(int num) {
    int newNum = num;
    newNum = newNum + 2;
    return newNum;
}
// in main:
int x = 12;
switch (x) {
    case 10: methodX(x / 2); break;
    case 12: methodX(x * 2); break;
    default: x *= 3; break;
}
```
- [ ] 8
- [ ] 26
- [ ] 36
- [x] 12
> Hint: Is the value returned by methodX stored anywhere?
> Explanation: methodX's return value is never stored, so x stays 12.

## Q277 · numeric · medium
What is the value of `Math.abs(-7) + Math.sqrt(16)`?
= 11
> Hint: Work out each part, then add them.
> Explanation: Math.abs(-7) is 7 and Math.sqrt(16) is 4.0, so the sum is 11.0.

## Q278 · single · medium
What is printed?

```java
public static void a() {
    System.out.print("A");
    b();
    System.out.print("C");
}
public static void b() {
    System.out.print("B");
}
// in main:
a();
System.out.print("D");
```
- [x] ABCD
- [ ] ACBD
- [ ] ABD
- [ ] DABC
> Hint: When a calls b, b finishes before a continues.
> Explanation: a prints A, calls b (which prints B), then continues with C. After a returns, main prints D.

## Q279 · numeric · medium
What is printed?

```java
public static int square(int n) {
    return n * n;
}
// in main:
System.out.print(square(3) + square(4));
```
= 25
> Hint: Call square on each number, then add the results.
> Explanation: square(3) + square(4) = 9 + 16 = 25.

## Q280 · single · medium
What is printed?

```java
public static void change(int x) {
    x = 100;
}
// in main:
int a = 5;
change(a);
System.out.print(a);
```
- [ ] 100
- [x] 5
- [ ] 0
- [ ] Compile error
> Hint: Does the method change a, or its own copy of the value?
> Explanation: Java passes primitives by value; the method changes its own copy, so a stays 5.

## Q281 · numeric · hard · on-exam
What is printed?

```java
public static void doubleAll(int[] v) {
    for (int i = 0; i < v.length; i++)
        v[i] *= 2;
}
// in main:
int[] nums = {1, 2, 3};
doubleAll(nums);
System.out.print(nums[2]);
```
= 6
> Hint: The method gets a copy of the reference, so it points to the same array.
> Explanation: The method receives a copy of the reference, so it changes the original array: nums[2] = 3 * 2 = 6.

## Q282 · numeric · hard
What is printed?

```java
public static int f(int n) {
    if (n > 10)
        return n - 10;
    return n * 2;
}
// in main:
System.out.print(f(f(7)));
```
= 4
> Hint: Work from the inside out: f(7) first, then f of that result.
> Explanation: f(7): 7 is not > 10, so 7 * 2 = 14. f(14): 14 > 10, so 14 - 10 = 4.

## Q283 · numeric · medium
What is printed?

```java
public static int sumTo(int n) {
    int s = 0;
    for (int i = 1; i <= n; i++)
        s += i;
    return s;
}
// in main:
System.out.print(sumTo(4) + sumTo(2));
```
= 13
> Hint: Call sumTo(4) and sumTo(2) separately, then add.
> Explanation: sumTo(4) = 1 + 2 + 3 + 4 = 10 and sumTo(2) = 3, so 10 + 3 = 13.

# Topic: Writing a Method Header from a Call

## Q284 · truefalse · easy
True or False: a value-returning method must have a return statement.
- [x] True
- [ ] False
> Hint: What happens if a method promises a value but never gives one?
> Explanation: A non-void method must return a value on every path.

## Q285 · single · easy
Which method header matches the call `double area = circleArea(2.5);`?
- [x] `public static double circleArea(double radius)`
- [ ] `public static void circleArea(double radius)`
- [ ] `public static double circleArea(int radius)`
- [ ] `public static circleArea(double radius)`
> Hint: The return type matches where the result is stored; the parameter matches the argument 2.5.
> Explanation: The result is stored in a double, so the return type is double, and 2.5 needs a double parameter. A void method cannot be assigned, and every header needs a return type.

## Q286 · single · medium · on-exam
printBox only prints a box and returns nothing. Which header matches the call `printBox(5, '*');`?
- [x] `public static void printBox(int size, char symbol)`
- [ ] `public static void printBox(char symbol, int size)`
- [ ] `public static void printBox(int size, symbol)`
- [ ] `public static void printBox(int size, String symbol)`
> Hint: Match the argument types and their order. Is '*' a char or a String?
> Explanation: The arguments are an int then a char, in that order, and every parameter needs a type. '*' is a char, not a String.

## Q287 · single · medium
age is an int. Which header matches the call `boolean ok = isValid(age, "CA");`?
- [x] `public static boolean isValid(int age, String state)`
- [ ] `public static boolean isValid(int age, char state)`
- [ ] `public static String isValid(int age, boolean state)`
- [ ] `public static void isValid(int age, String state)`
> Hint: The result goes into a boolean. What types are age and "CA"?
> Explanation: The result goes into a boolean, and the arguments are an int and a String ("CA" is in double quotes).

## Q288 · single · hard
scores is an int[]. Which header matches the call `int[] counts = tally(scores);`?
- [x] `public static int[] tally(int[] scores)`
- [ ] `public static int tally(int[] scores)`
- [ ] `public static int[] tally(int scores)`
- [ ] `public static int[] tally(int[])`
> Hint: Both the argument and the result are int arrays.
> Explanation: The method takes an int array and returns an int array. A parameter needs both a type and a name.

## Q289 · multi · medium
Which headers are valid overloads of `public static int add(int a, int b)`? (Select all)
- [x] `public static int add(int a, int b, int c)`
- [x] `public static double add(double a, double b)`
- [ ] `public static double add(int a, int b)`
- [ ] `public static int add(int x, int y)`
> Hint: An overload must differ in the number or the types of its parameters.
> Explanation: An overload needs a different parameter list: a different number or different types. Changing only the return type or the parameter names does not count.

## Q290 · single · medium
Which header matches the call `String msg = greet("Ana", 3);`?
- [x] `public static String greet(String name, int times)`
- [ ] `public static String greet(int times, String name)`
- [ ] `public static void greet(String name, int times)`
- [ ] `public static String greet(name, times)`
> Hint: Match the return type, then the argument types in order.
> Explanation: The return type is String, and the parameters must match the argument order: a String, then an int.

## Q291 · single · medium
Given the header `public static void showValue(int x)`, which is a valid call?
- [ ] `showValue(421324123L);`
- [x] `showValue(4321321);`
- [ ] `System.out.println(showValue(3.0));`
- [ ] `showValue(int x);`
> Hint: Which argument fits into an int parameter?
> Explanation: The argument must fit into an int. A long, a double, or a type written in the call is not allowed.

## Q292 · multi · hard · on-exam
Which method headers would allow the call `double r = ratio(7, 2);` to compile? (Select all)
- [x] `public static double ratio(int a, int b)`
- [x] `public static double ratio(double a, double b)`
- [x] `public static int ratio(int a, int b)`
- [ ] `public static String ratio(int a, int b)`
- [ ] `public static double ratio(int a)`
> Hint: int can widen to double automatically, in both arguments and return values.
> Explanation: int arguments can widen to double parameters, and an int return value can widen into a double variable. A String cannot be stored in a double, and a one-parameter method cannot take two arguments.

## Q293 · single · medium
Given `public static double min(double a, double b)`, which header is NOT a valid overload of min?
- [ ] `public static int min(int a, int b)`
- [ ] `public static double min(double a, double b, double c)`
- [x] `public static int min(double a, double b)`
- [ ] `public static double min(int a, double b)`
> Hint: Can two methods differ only in their return type?
> Explanation: Overloads must differ in their parameter lists. A different return type alone is not allowed.

## Q294 · single · easy
Which header matches the call `char g = letterGrade(87.5);`?
- [x] `public static char letterGrade(double score)`
- [ ] `public static String letterGrade(double score)`
- [ ] `public static char letterGrade(int score)`
- [ ] `public static char letterGrade(String score)`
> Hint: What type is 87.5, and what type is g?
> Explanation: The result is a char, and 87.5 is a double. A double cannot be passed to an int parameter without a cast.

## Q295 · single · easy
Which keyword marks a method that returns no value?
- [ ] null
- [x] void
- [ ] empty
- [ ] none
> Hint: Look at the header of the main method.
> Explanation: void means the method returns nothing.

## Q296 · single · medium
maxOf returns the largest of its arguments. Which header matches the call `System.out.println(maxOf(3, 9, 4));`?
- [x] `public static int maxOf(int a, int b, int c)`
- [ ] `public static void maxOf(int a, int b, int c)`
- [ ] `public static int maxOf(int a, int b)`
- [ ] `public static int maxOf(int[] a)`
> Hint: Count the arguments. println needs a value to print.
> Explanation: Three int arguments need three int parameters. println needs a value, so the method cannot be void.

## Q297 · single · medium
Which header is correct for a method that takes two ints and returns the larger one?
- [ ] `public static void max(int a, int b)`
- [ ] `public static max(int a, int b)`
- [x] `public static int max(int a, int b)`
- [ ] `public static int max(int a, b)`
> Hint: The return type comes before the name, and every parameter needs a type.
> Explanation: The return type comes before the name, and every parameter needs a type.

## Q298 · single · hard · on-exam
scores is a double[] and count is an int. displayResults prints a report and returns nothing. Which header matches the call `displayResults(scores, count);`?
- [x] `public static void displayResults(double[] scores, int count)`
- [ ] `public static void displayResults(double scores, int count)`
- [ ] `public static void displayResults(int count, double[] scores)`
- [ ] `public static double[] displayResults(double[] scores, int count)`
> Hint: Match the argument types in order. Does the method return anything?
> Explanation: The first argument is an array of doubles and the second an int, in that order. Since nothing is returned, the return type is void.

## Q299 · single · easy
The variables listed in a method header are called:
- [ ] Arguments
- [x] Parameters
- [ ] Constants
- [ ] Fields
> Hint: Header variables and call values have different names.
> Explanation: The variables in a method header are parameters; the values passed in a call are arguments.

## Q300 · single · easy
Which statement correctly calls a static method printLine that takes no arguments?
- [ ] `printLine;`
- [x] `printLine();`
- [ ] `call printLine();`
- [ ] `void printLine();`
> Hint: Every method call needs parentheses.
> Explanation: A method call needs parentheses, even when there are no arguments.
