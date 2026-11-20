# FC: Final Cramming

**FC** is Cramming when it is finished: every feature on the system map, through Phase 4 and the expansion items (high schools, parents, districts, Canvas and LTI, many schools, paid AI). We build one piece at a time, but every piece is designed for FC, so nothing has to be rewired later. Decided by Bhargav, 20 November 2026.

## The FC check: before building anything

No screen, card, rule or data field is built until it passes these five steps, written down here.

1. **Every FC feature that touches it.** Go through the system map (all four journeys, every status) and list each feature that adds to it, feeds it or changes it.
2. **Every scenario.** Walk through each group below and write the cases that apply.
   - **People:** a student, a professor, a TA, an admin, a parent (P4), a high school student (P4), someone who teaches one class and takes another.
   - **How many:** one class, six classes, a class with no practice, a class with no exams.
   - **The content's shape:** with and without dates, units, topics, exams; cumulative finals; two sittings; extra time; extensions; section times.
   - **Time:** before the term, a normal day, the night before an exam, an exam open right now, after a missed week, after the final, between terms.
   - **Phases:** what Phases 2, 3 and 4 and the expansion add.
   - **Devices and people's needs:** phone, big monitor, offline, screen reader, keyboard, Spanish, reduced motion.
3. **Covered or a gap.** Mark each case. A gap gets a fix in the design or the data, not a note for later.
4. **Fixed slots.** Where FC adds something later, the design keeps a place for it now (a category, a field, a card that stays hidden), so adding it later never moves the rest.
5. **Approval.** Bhargav approves the check. Then only the launch parts are built.

## Check 1: Today (20 November 2026)

### What feeds Today in FC

Today's plan, Coming up, the next exam and readiness, Recent grades, Recent feedback (P2 rubric comments, regrade replies), From your professor (announcements; P3 replies to your questions), New in your classes, This week. Later: office hours and events (P3), the calendar (P3), reminders and emails (P3), the catch-up plan (P3), difficulty levels (P3), Canvas and LTI due dates (expansion), parents (P4), standards instead of topics (P4), Spanish.

### The content rules (each card has one source)

| Card | Source | If something is missing |
|---|---|---|
| Today's plan | The student's attempts, the review schedule, the open unit, practice tagged for an exam | No unit dates: sets in their order in the class |
| Coming up | Every item with a date for this student: graded work, practice with a due date, exams, events (P3), Canvas dates (expansion) | Practice without a due date never appears; it lives in the plan |
| Next exam and readiness | Graded work marked as an exam, and the topics it covers | Topics not set: everything since the last exam; a final covers everything |
| Recent grades | Released results | Not released: nothing |
| Recent feedback | Comments from graders (P2) | None: hidden |
| From your professor | Announcements; replies to your questions (P3) | None for 7 days: hidden |
| New in your classes | Notes and practice that opened since the last visit | Nothing new: hidden |
| This week | Days with at least one answer | Always shown |

When publishing practice the professor answers: **What is it for?** (This week's unit · Review for an exam, which one · Extra, anytime) and **When does it open?** Every exam lists the topics it covers.

### Scenarios

| # | Scenario | Covered? | How |
|---|---|---|---|
| 1 | One class | Yes | The plan and lists come from one class; the class code still shows |
| 2 | Six or more classes | Yes | The plan holds at most 4 tasks, at most 2 from one class; Coming up shows 4 and Show more |
| 3 | A class with no practice | Yes | It adds deadlines, grades and its exam; the plan skips it |
| 4 | A class with no exams (project course) | Yes | No exam card for it; the plan follows its units |
| 5 | Practice with no due date and no unit | Yes | Tagged Extra: it enters the plan only through review after the first try |
| 6 | Practice for an exam with no exam date yet | Yes | Treated as this week's unit until the date exists |
| 7 | A cumulative final | Yes | Covers everything; the card shows the 3 topics to practice next and "All topics" |
| 8 | Two exams in one week | Yes | The second appears as a second row on the exam card |
| 9 | Two sittings (rolled over to another day) | Yes | Only the student's own sitting shows; after taking one, the other disappears (built 20 Nov) |
| 10 | Section times | Yes | Every date is the student's own section's time |
| 11 | Extra time, testing centre | Fixed | The exam card shows the student's own length ("75 + 25 min") and where they take it |
| 12 | An extension for one student (P2) | Fixed | One rule: every date on Today is "my date" (section, extension, sitting, accommodation), worked out in one place |
| 13 | An exam open right now | Fixed | A new moment: Today leads with "Midterm 2 is open. Start", everything else smaller |
| 14 | Unfinished work (a practice set halfway, a coding draft) | Fixed | The plan's first task becomes "Continue Lab 10 (saved)" |
| 15 | A missed deadline | Fixed | It leaves Coming up quietly, with no red, and Today offers "Talk to Prof. Patel about Lab 9" (their email or office hours now; Ask my professor in P3). After a missed week the catch-up plan takes over |
| 16 | Before the term starts | Fixed | "Your classes start Monday, January 20", what opens first, and the first task once something opens |
| 17 | After the final, between terms | Fixed | "Your term is complete", the grades, and optional review of each class |
| 18 | Teaches one class, takes another | Fixed | Work and school accounts are separate, so one account has one role and Today never mixes them. Where a school gives one person a single account, Cramming issues its own login for the TA role |
| 19 | The professor doesn't want readiness estimates shown | Fixed | The professor decides: a class setting, show readiness (on by default); off hides it for that class |
| 20 | A student who prefers not to see scores on Today | Fixed | Both: the score shows by default, and Settings has "Show scores on Today" for students who prefer "Quiz 9 graded" |
| 21 | New student, nothing done | Yes | The welcome moment and one first task |
| 22 | Done for today | Yes | The done moment, what comes back tomorrow, Practice more |
| 23 | Office hours and events (P3) | Yes | A kind in Coming up; nothing else changes |
| 24 | Replies to your questions (P3) | Yes | Join From your professor |
| 25 | Calendar (P3) | Yes | Coming up is the first 4 of the same list |
| 26 | Reminders and emails (P3) | Yes | They say the same thing as Today and link to it |
| 27 | Canvas or LTI due dates (expansion) | Fixed | FC works fully on its own; Canvas or another LTI system is a link, not a part. When linked, its dates are the source: Cramming takes them, checks again after every change there, and when a date moves Today says so ("Lab 10 moved to Monday"). Marked "from Canvas" |
| 28 | Parent view (P4) | Fixed | Parents see Coming up, Recent grades and the professor's notes; never the plan or attempts |
| 29 | High school standards (P4) | Fixed | Readiness reads "topics" or "standards" from the class; the card doesn't change |
| 30 | Grade changed after a regrade (P2) | Yes | The grade updates and says "Updated" |
| 31 | Graded work turned off by the professor | Yes | It disappears from every card |
| 32 | A professor trying Today as a student | Yes | Shows their class as a student would; nothing is saved |
| 33 | Phone | Yes | One column: briefing, plan, Coming up, exam, grades, feedback, professor, week |
| 34 | Offline | Fixed | Today shows the last plan saved on this device and says so |
| 35 | Screen reader, keyboard | Yes | Reading order matches the order on screen; every card has a heading |
| 36 | Spanish | Yes | Every word comes from the word list |
| 37 | Another time zone | Yes | Dates in the student's zone; exam windows name the school's zone |

### Slots kept for the Dot (it comes back after the screens, as one layer)

The Dot never changes the layout. It may appear only in three places, built now:
1. **Beside the greeting**, in the free space to the right of the heading, at a fixed size. The heading never moves; off means nothing shows.
2. **The picture spot in each moment** (Done for today, the welcome, Exam passed): a 64 × 64 spot that holds a simple check or icon until the Dot replaces it at the same size.
3. **Over the page, briefly**, like a toast: it takes no space, so nothing moves.

Each moment sends one named signal (plan done, topic solid, exam passed, first visit, back after a break). Nothing listens until the Dot is built. The Dot never appears in practice questions or exams.

### Result

Passed, 20 November 2026. Bhargav approved the fixes for all thirteen gaps and settled the open question (20). The launch build includes every rule above and keeps empty slots for the later phases.
