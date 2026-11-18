# Changelog

One entry for every upload to the live site, newest first. Each entry says what changed for people and how it was tested. Uploads made before this file existed weren't recorded.

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
