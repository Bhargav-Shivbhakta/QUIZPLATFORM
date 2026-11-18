# Changelog

One entry for every upload to the live site, newest first. Each entry says what changed for people and how it was tested. Uploads made before this file existed weren't recorded.

## Not yet released: sign-in and the rules register

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
