# Changelog

One entry for every upload to the live site, newest first. Each entry says what changed for people and how it was tested. Uploads made before this file existed weren't recorded.

## 19 November 2026: one screen per scroll, and uploads always load whole

- **Uploads always load whole.** Every file the site loads now carries a version tag that changes with each release. Once a browser has the new page, it fetches all the new files together, never a mix of old and new. The page itself can still be up to 10 minutes old after an upload (GitHub's limit); a refresh shows it at once. See I-14.
- **One small scroll, one screen:** a light trackpad swipe or one turn of the wheel glides to the next screen, and screens settle into place under the header. Long screens scroll normally to their end first. The header's links glide smoothly to their screens.
- **A reading zone before the blur:** the screen you're leaving stays sharp until it is mostly scrolled away, then blurs.
- **The opening fills large screens:** the name, tagline and line scale with the window's height and sit at the optical centre, so there are no empty bands above and below.
- **Header:** more room between the links, and Request access set apart from Sign in.
- **Screen 3:** the Dot now waters a little plant under the "This week" card (the card sits on top). Each watering ticks a day and grows a leaf; on the seventh day, about 5 seconds in, the plant blooms with an "A" at its heart.
- **Screen 4, For students:** new heading "A clear plan for every student, every day." with no line under it; the paragraphs are replaced by one line of three ticks (From the educator's own materials · Planned for each student · About 15 minutes a day). The preview's plan is now about 15 minutes (3 + 3 + 9), Ms. Harper's note says "Friday's quiz", and the whole screen fits one window. The browser window keeps its full size; the phone (the same simple design as before, a little smaller) now overlaps the window's right edge on laptops and larger screens (before, only on very wide screens), and hides below 1240 px wide where it would run off the screen.
- **Screen 2 words:** "Most students start the night before the exam and try to cover every unit in a few hours." and "Students find out which concepts they misunderstood once the exam results are out, and that is also when educators first see which concepts the class needs more time on."
- **Tested:** all automated tests; paging timed in the browser on a small laptop, laptop and large screen (one swipe moves exactly one screen, both ways, long screens scroll to their end first); header links land each screen under the header; the whole app with version tags (sign-in, admin, landing); phone; no errors.

## 19 November 2026: the landing page's story, screens 2 and 3

The landing page now tells one story in order: the opening, **the challenge**, **how Cramming helps**, then the product.
- **Screen 2, The challenge:** "Most studying happens the night before." in large type, with the Dot on the right: sitting on a stack of titled books (Biology, Statistics, Calculus), holding an open book, worried but cute, while its thought bubble reads "6 units to go" and the hours count down from 6. Three points: studying starts late, feedback arrives after the exam results, every student learns differently. It ends: "Cramming solves all three, starting from the materials the educator already has."
- **Screen 3, How Cramming helps:** "Students learn best with practice every day." with the Dot doing reps on the app's own "This week" card: each rep ticks a day, and a full week earns an "A". Three answers, one for each challenge: a little practice every day, feedback with every answer, practice for each student.
- **The Today preview moved** from under the opening to the For students screen; the opening now fills the window on its own.
- **One screen at a time:** every screen fills the window with its content centred, so the next one appears only when you scroll; the screen you're leaving blurs and fades with the scroll (not with reduced motion).
- **Soft motion:** the points rise in one by one and the line above each draws from the left. The Dot's movement runs only while its screen is on show; Pause motion and reduced motion show the finished scenes.
- **The opening's bounce is calmer:** a real arc between the words, a light squash, the words nudge a few pixels, a softer press on Request access.
- **Words:** the preview's tasks read "Try 4 questions again" and "Review 6 questions to keep them fresh"; the educator's note is from "Ms. Harper"; readiness shows its number and word ("41% · Getting there"); the practice question says "Almost." and "Your answer" (DESIGN › Words: affirmative, whole sentences).
- **Fixed:** a hidden "Start" label in the preview failed the colour check in dark mode; the sideways-scrolling memory chart and long formulas on phones could not be reached by keyboard.
- **New check:** the tests now fail if any file in the app can't load (a broken file stops the whole page).
- **Tested:** all automated tests; laptop, small laptop and phone, light and dark, and reduced motion: no errors, axe clean on the whole page, no sideways scrolling, headings on three lines.

## 18 November 2026: the landing page's opening, polished (screen 1 locked)

- The logo's blue moves round its four circles more slowly (about 0.6 s per circle), and the Dot springs out the moment the blue gets back to its circle, with no pause.
- The Dot bounces off "Cramming" and "Top" like a ball, and each word dips as it's hit; landing on **Request access**, its legs come out and press the button.
- The reading glasses are bold orange frames with a light lens, and appear only once it sits down to read.
- **Tested:** all automated tests; the sequence timed in the browser (one step every 0.62 s, the Dot out at the same moment as the last step); laptop and phone, light and dark; Pause motion mid-way shows the finished scene; no errors.

## 18 November 2026: the new tagline and the landing page's first screen

- **New tagline: "Small reps. Top grades.™"** It replaces "Cram the right way." in the landing headline, the browser tab, the footer trademark line and the description search engines show.
- **The first screen opens with the name:** the logo's blue goes once round its four circles, **Cramming** rises and "Small reps. Top grades." flips up under it.
- **The Dot is on the landing page:** as the blue gets back round the logo, the Dot springs out of it, bounces off "Cramming" and off "Top" like a ball (each word dips as it's hit), and lands on **Request access**: its legs come out and press the button. Then it puts on its orange reading glasses, opens a little laptop with the Cramming logo and reads (about 7 seconds, once). Reduced motion and Pause motion show the finished scene.
- **Fixed:** clicking **Pause motion** on the landing page caused an error (I-12).
- The small line "Practice, plans and exams for any course" is gone; the description now says what the product does in one go.
- **Tested:** all automated tests; laptop and phone, light and dark, and with reduced motion: no errors, axe clean on the first screen, the tab reads "Cramming · Small reps. Top grades."

## 18 November 2026: fix for the Study plan with Soft motion

- With **Motion: Soft** in Settings, opening a class showed "Failed to execute 'add' on 'DOMTokenList'" and the Study plan line didn't draw. Fixed (I-11).
- **Tested:** a new automated test fails on any class name with a space given to `classList` anywhere in the app (it caught the old line); in the browser, Soft and Full both open the Study plan with no error.

## 18 November 2026: one navigation, a new Settings page

Students only.
- **Settings is in the bar** under Progress (and is the fourth tab on phones). Your initials now open a small menu with your name, email and **Sign out**.
- **The bell is top right** on every page.
- **Every page has a back link** top left that names where it goes ("‹ Classes", "‹ CS150", "‹ Midterm 2 Practice"); the old breadcrumbs are gone for students.
- **The slim bar shows course numbers** (150, 210) so two CS classes look different. Classes are named without repeating the course ("CS 210 Data Structures").
- **Double-click the logo to refresh**: checks for new class content and saves waiting progress, at most once a minute ("Up to date", then "Already up to date").
- **A new Settings page**: your account and classes, Save now, Sign out; Studying (study buddy, weekly goal, show answers, shuffle, ask before submitting); Appearance (theme, text size, motion, easier reading, high contrast); Your data (backup, restore, start a set over, erase). Changes save at once. **Weekly goal** (2 to 5 days) is new and Today's "This week" follows it.
- A real gear icon for Settings (it looked like Today's sun) and a sign-out icon.
- New classes made without a Course get it from their name ("CS 210 Data Structures" → CS210).
- **Tested:** all automated tests (navigation rules: badges, class names, back links and the architecture check; three classes on a laptop, a tablet and a phone, light and dark: every place and an old page opened with no errors, no sideways scrolling, axe clean; account menu opens and closes with Escape; double-click refresh read 10 documents the first time and none the second; each setting saved and applied (goal 5 shows "0 of 5 days" on Today).

## 18 November 2026: students see professors' changes within a minute

- Student pages (Today, a class, Classes, Progress) fetch the class's latest practice sets when what they have is more than a minute old. Before, a student with Cramming open kept seeing a set as it was when they signed in, for up to 10 minutes (seen with Midterm 3 Practice still showing 300 questions after they were removed).
- **Tested:** all automated tests; on the local copy, a student with the class open saw the 300 questions, the professor removed them, and the student's next click a minute later showed only the coding practice, with their code and test results kept.

## 18 November 2026: the new student navigation (step 1)

Students only. Professors, TAs and admins see no change. Exams are untouched.
- **A new frame:** a bar on the left on laptops (slim on tablets) with Today, each class by name and Progress, plus Messages and Settings at the bottom; on phones, three tabs at the bottom and a small top bar. A highlight glides to the current place.
- **Today**, for all classes at once (with a filter per class): the nearest exam as a countdown, readiness as a number with its word ("62% · Getting there"), one Start button for today's set with what's in it, This week (goal: 3 days) and Coming up. Today redraws once when saved progress arrives from the account.
- **Each class has four tabs:** Study plan (units on the way to the exam, today's stop, graded work as flags; the line traces down to today's stop when it opens), Practice (question sets with Practise, Flashcards and Practice test; coding practice), Notes and Graded work. **Classes** (phones) and **Progress** (readiness per class, mistakes to fix, recent sets) are new pages.
- **The study buddy:** the Dot hops out of the logo onto Today on the first visit of each day, sits beside the greeting (tap it; its eyes follow the pointer) and appears on empty pages. Settings has **Study buddy** (Dot, Flame or off) and **Motion** (Full or Soft); reduce motion on the device turns motion off.
- Today's existing screens (practice sets, flashcards, coding, notes, results, settings) open inside the new frame unchanged; they move onto the new look one by one, starting with Today's set.
- **Tested:** all 71 automated tests (7 new for Today's rules) and the architecture check; a student with one class and with two, on laptop and phone, light and dark: every new page opened with no errors, no sideways scrolling, and axe clean; a professor still gets the old frame.

## 18 November 2026: coding practice, and the student design written down

- **Coding practice is its own kind of practice set** (I-1, I-2). Add a practice set asks: Questions (.md) or Coding (.zip). A coding set needs no question file. Sets can have both; Remove questions turns a mixed set into coding practice (do this on Midterm 3 Practice). Students open a coding set straight onto its assignments: no flashcards, practice tests or quiz readiness. Practice is no longer called "exam" on the Practice page.
- **The student design, written down** (no change to the site): `docs/DESIGN.md` now has two levels of motion (Full and Soft) and a new section, **The study buddy**: the Dot (default) and the Flame, its rules and its moments, and how a new feature adds one. The word list gains "study plan" and "study buddy".
- `RULES.md`: four new design rules (D-25 to D-28), 62 in all. `docs/DECISIONS.md`: the student navigation decisions, readiness shown as a number with its word, and going live in stages.
- **Tested:** all 64 automated tests and the architecture check; the full professor and student flow on the local copy, with screenshots.

## 18 November 2026: blank site on older Safari (urgent fix)

- **The site loads again on older Macs.** On Safari before 16.4, and in Safe Exam Browser on those Macs, www.cramming.net stayed on a dark, empty screen. Two lines of the maths formatting used code that older Safari can't read; they're rewritten (see I-6).
- If a browser ever can't run Cramming, students now see a plain message saying what to do, not a blank screen.
- `npm test` now fails on code that Safari 15 can't run (rule C-11).
- **Tested:** 66 automated tests and the architecture check (shown to catch the old lines); the new lines matched the old ones on 400,000 random inputs; the built site loads in a browser, and a copy broken on purpose shows the message.

## 18 November 2026: sign-in and the rules register

- **Sign in** is one clean panel instead of two "I'm a student / I teach" cards: "Sign in to Cramming", one Continue with Google button, a line for anyone who can't get in, and Request access for professors whose course isn't on Cramming yet. Same look as the landing page.
- **`RULES.md`** at the top of the project: read first, every rule (57) with an ID, where it's written and how it's checked, and the steps to add or change a rule.
- **Tested:** 66 automated tests and the architecture check (hand-drawn icons down from 17 to 15); sign-in at laptop light and dark and phone, axe clean, Request access opens, nothing scrolls sideways.

## 18 November 2026: the design foundation

Uploaded in two parts: the tokens and the first rules (commit `380257e`), then the full rules, dates and numbers, and the code checks.

- One look for all of Cramming, "Clear" (Inter, cool white and near-black, one blue). Every value now lives in `app/css/tokens.css`, loaded on every page.
- The landing, sign-in and policy pages and the Request access sheet read their colours from the tokens. Screenshots before and after match (light, dark, phone). Error text in the sheet is now readable in dark mode, and the code font (JetBrains Mono) now actually loads.
- `docs/DESIGN.md`: the rules for colour, type, space, corners, motion, the parts and the words. The "Cramming Design System" artifact shows the same.
- `npm test` now fails if a stylesheet writes its own colour or uses a token that doesn't exist. The signed-in app's stylesheet is recorded as debt (293 colours) and can only go down.
- `DESIGN.md` also holds the word list (one name for each thing), dates and numbers, icons, the four page templates and breakpoints, behaviour (saving, deleting, errors, loading, focus, keyboard), the plan for the parts kit in code, and rules for emails, downloads and print.
- **Dates and numbers** now come from one place, `app/js/format.js`, on every screen (20 files moved onto it). The year shows only when it isn't this year. Some screens change slightly: the exam page says "Tue, Nov 17, 5:02 PM" instead of "Tuesday, Nov 17, 5:02 PM", and Access requests no longer shows the year for this year's requests.
- `npm test` also counts four things in the code that should go through one place (inline styles 36, colours in code 18, dates formatted by hand 1, hand-drawn icons 17); each may only go down.
- Page width tokens added to `tokens.css`. The screen inventory (33 screens, 4 on the new look) is on the system map whiteboard.
- **Tested:** 66 automated tests (4 new for dates and numbers) and the architecture check; the checks were shown to catch a stray colour, a missing token, a hand-formatted date and a colour in code; every colour pair in `DESIGN.md` measured at 4.5:1 or better; all 20 signed-in screens opened as a student and as an admin on the local copy with no errors and no broken dates.

## 17 November 2026: landing fixes

- The product picture at the top no longer tilts while scrolling.
- "Cramming fixes all three…" is centred.
- Answering the practice question no longer jumps the page; "Try again" keeps the question in place.
- **Tested:** 62 automated tests; browser checks at three sizes (see I-5).

## 17 November 2026: spam check on Request access

- Requests now go through the connector instead of straight to the database, and the database refuses visitors' writes. The connector checks every field and allows **3 requests a day per network, 2 per email, and 40 for the whole site**. Past that, the form says so and suggests trying tomorrow (or emailing, once `contactEmail` is set).
- Network addresses and emails are never stored, only a keyed hash inside one day's counter (`accessLimits`, closed to the site).
- **Tested:** 62 automated tests (4 new for the connector: saving, details once, the three limits, bots and bad input) and the architecture check; browser checks of both steps and the "too many" message at laptop and phone size; an independent review, whose fixes were made (IPv6 counted per network, the site counter written last, oversized requests refused early).
- **Outside GitHub, in this order:** paste the new `worker.js` into Cloudflare and deploy, then publish the new `firestore.rules`. Until the Worker is updated, Request access shows "didn't send".

## 17 November 2026: landing refinements

**Request access, in two steps**
- Step 1: name, school email, school, role (professor or lecturer, TA, department chair or coordinator, high school teacher, other) and the course. That alone is a complete request.
- Step 2, optional: department, class size, sections, term start, first exam, what they'd use first, what they use today, what material they have, another way to reach them, how they heard of us, notes. "Skip for now" is always there.
- The rules check every field, allow the details only once and only within 30 minutes, and refuse anything else.

**Admin › Access requests** (its own page, `#/requests`)
- Each request has a status (New, Contacted, Set up, Not a fit) and a note, with who changed it and when. Nothing is deleted.
- Filters by status, with counts. A red count on **Admin** shows how many are still New, on the top bar and the phone tab bar.
- Linked from Platform overview and Manage classes. The old list and its "Handled" (delete) button are gone.

**The landing page tells a story**
- New section after the hero: "Most studying happens the night before", with the three problems Cramming fixes. "See how it works" goes there.
- Order: problem, professors (Build my course), students (Today), practice, spaced review, tutor, dashboard, exams, subjects, three steps, privacy, questions.

**Sign in, with two doors**
- `#/signin` now uses the landing design: "I'm a student" and "I teach" (sign in, or request access). No school name in the wording.

**Tested:** 59 automated tests, plus the architecture check. Browser checks at 1366×768 light and 390×844 dark: story order, both request steps, errors, skip, reopen, sign-in doors, admin page, status change, the count on Admin, and eight security-rule cases on the local copy (bad role, extra field, details twice, visitor setting a status or reading, admin setting an unknown status: all refused). axe clean on every screen. An independent review of the rules found no hole that exposes data; its two small fixes were made, and the open spam risk is I-4.

**Outside GitHub:** publish the new `firestore.rules` in Firebase. Until then, new requests fail to send and the admin page can't save a status.

## 17 November 2026: live

Published in two steps: the founder uploaded the landing page and everything before it, then Claude pushed the skeleton straight to `main` (commit `96494a6`, build green).

**The skeleton**
- `docs/ARCHITECTURE.md`, `docs/architecture.json` and `scripts/architecture.mjs`: the plan, the grid, and a check that runs with every build.
- Screens no longer import the router; `nav.js` holds moving between screens and the theme.
- Removed `app/js/java/suggest.js`, an old file nothing used.
- **Tested** on a branch built on top of `main`: unit tests and the architecture check; class setup from admin to professor dashboard; landing page at five sizes plus phone, axe clean; policy pages, sign-in, access requests, theme, exam lock.

**The front door (17 November 2026)**
- New landing page at cramming.net for visitors who aren't signed in. It's written for professors and shows a working product demo, a practice question you can try, how it starts, privacy, and questions professors ask. Sign-in moved to `#/signin`.
- Motion: sections glide in as you scroll, the product tilts upright, cards drift, and a progress line runs under the header. One "Pause motion" button stops it all, and it's off for people who ask their device for reduced motion.
- **Request access** opens a panel over the page. Requests are saved in Firestore, and admins see them under Admin › Classes › Access requests, with a "Handled" button.
- Draft policy pages: Privacy, Terms of use, How we use AI, Accessibility. They need a lawyer's review before launch.
- **Tested:** browser checks at 1280×720, 1366×768, 1440×900 (dark), 1920×1080 and phone (light and dark). The hero and the top of the product fit on screen, nothing scrolls sideways, every section revealed, the sheet opened without moving the page, empty and real requests worked, and axe found no problems. Policy pages, sign-in, protected pages and the admin list were also checked.
- **Outside GitHub:** `contactEmail` in `app/config.js`, and the new `firestore.rules` published in Firebase (it adds `accessRequests`).

**For professors**
- Build my course: set up the course, upload materials, connect your own AI (Claude, ChatGPT or Gemini), approve the course map, watch the build, then review, edit and publish. Options: build in parts, three chats (builder, checker, fresh eyes).
- Switch study pages, My study and the tutor on or off for a class.
- Release dates for practice.

**For students**
- Study pages, one per unit, opening on the unit's first day.
- My study: today's short list, the mistake notebook, a week plan, and how ready you are.
- Ask the tutor: a link for your own AI that answers only from your professor's open units, and never during graded work.

**Behind it**
- A Cloudflare Worker for the builder and tutor connectors.
- Security rules for builds, study pages and tutor links.

**Tested:** 53 automated tests. Browser checks with axe ran against a local copy of the site, and a real Claude chat completed a full demo build. Not yet tried on real Firebase, with ChatGPT or Gemini, or on a full-size course.

**Outside GitHub:** publish `firestore.rules`, paste `worker.js` into Cloudflare, add `connectorUrl` to `app/config.js`, and add the `SERVICE_ACCOUNT` secret in Cloudflare.
