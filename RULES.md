# Rules

Read this before changing anything in Cramming, whoever you are: the founder, a developer, or an AI assistant in a new conversation. It lists every rule the project follows, where each one is written in full, and how it's checked.

## Before you change anything

1. **Read** `docs/STANDARDS.md` (how work moves and the bar), `docs/DESIGN.md` (the look, the words, behaviour) and `docs/ARCHITECTURE.md` (where code goes). Check `docs/ISSUES.md` for known problems.
2. **Never put on GitHub:** the `exams/` folder (except `exams/_template`), solutions, hidden tests, the founder's `app/config.js`, rosters, student data, or any key or secret.
3. **Releases are the founder's.** Don't commit or push. Hand over a zip of the changed files with a list of what changed. Push only when the founder asks.
4. **Run `npm test`** before handing anything over. It must pass, including the architecture and design checks.
5. **Record:** a feature changing state goes in `docs/FEATURES.md`, a release in `docs/CHANGELOG.md`, a problem in `docs/ISSUES.md`, a decision in `docs/DECISIONS.md`, a changed flow on the system map whiteboard.
6. **A new rule, or a change to one,** follows "Changing a rule" at the end of this file.

## The register

**Checked:** *Automatic* means `npm test` fails when the rule is broken. *Review* means a person or an independent review checks it before release. *Not yet* means it's written down but nothing checks it yet: these are a to-do list.

### Working (S)

| ID | Rule | Written in | Checked |
|---|---|---|---|
| S-1 | One piece of work at a time, in the agreed order: landing, students, professors, admins, behind it; journey by journey | STANDARDS › How work moves | Review |
| S-2 | Plan, build, test, review, record, release, in that order | STANDARDS › How work moves | Review |
| S-3 | Anything high-stakes (security rules, grading, a whole student or professor flow) gets an independent review before release | STANDARDS › How work moves | Review |
| S-4 | The founder releases; hand over zips, never push unasked | STANDARDS › How work moves; DECISIONS 17 Nov | Review |
| S-5 | A feature is Finished only when it meets all 11 points of the bar | STANDARDS › The bar | Review |
| S-6 | Every feature is in exactly one state in FEATURES.md | STANDARDS › Feature states | Review |
| S-7 | Every problem found goes in ISSUES.md at once, and again when fixed | STANDARDS, ISSUES | Review |
| S-8 | Every flow has a map on the whiteboard; gaps are marked until fixed | STANDARDS › Flow checks | Review |
| S-9 | Policy pages are rewritten after phase 1, then reviewed by a lawyer before launch | DECISIONS 18 Nov; FEATURES › Planned | Not yet |

### Code (C)

| ID | Rule | Written in | Checked |
|---|---|---|---|
| C-1 | Every file sits in one layer and imports only what its layer may | ARCHITECTURE; architecture.json | Automatic |
| C-2 | Every stored path is registered and has a security rule | ARCHITECTURE; architecture.json | Automatic |
| C-3 | Every screen is reachable from the router | ARCHITECTURE | Automatic |
| C-4 | Every file stays within its size budget | architecture.json › budgets | Automatic |
| C-5 | Known debt only goes down | architecture.json › debt | Automatic |
| C-6 | No dead code: nothing unused, no commented-out blocks | STANDARDS › Rules for code | Automatic (`npm run audit`, 45 left) |
| C-7 | One way to do each thing; look for a helper before writing one | STANDARDS › Rules for code | Review |
| C-8 | Rules live in pure functions so they can be tested; screens stay thin | STANDARDS › Rules for code | Review |
| C-9 | Every database read and write is counted and noted in the file that makes it | STANDARDS › Rules for code | Review |
| C-10 | Database errors become plain reasons in one place (`cloud.js`) | DESIGN › Behaviour | Automatic (debt: 34 left) |
| C-11 | Code runs on Safari 15 and later: no regex lookbehind, static blocks, `.at()`, `findLast` and the like (one such line blanks the whole site there) | ISSUES › I-6 | Automatic (architecture check 8) |

### Testing (T)

| ID | Rule | Written in | Checked |
|---|---|---|---|
| T-1 | Every rule in code has an automated test | STANDARDS › Rules for testing | Review |
| T-2 | Every bug fixed gets a test that would have caught it | STANDARDS › Rules for testing | Review |
| T-3 | Security rules are tested on a local copy of Firebase before publishing | STANDARDS › Rules for testing | Review |
| T-4 | Every screen is checked at laptop, laptop dark and phone, with axe | STANDARDS › The bar; Screen checks | Review (automatic once screen checks are built) |
| T-5 | Saved reference screenshots catch unintended changes | STANDARDS › Screen checks | Not yet |
| T-6 | Tests use made-up data and `exams/_template` only | STANDARDS › Screen checks | Review |

### Design (D)

| ID | Rule | Written in | Checked |
|---|---|---|---|
| D-1 | Colours only from the tokens in `app/css/tokens.css` | DESIGN › Colour | Automatic (app.css debt: 293) |
| D-2 | Every token used exists | DESIGN; tokens.css | Automatic |
| D-3 | Text at least 4.5:1, large text and icons 3:1, in both themes | DESIGN › Colour | Review |
| D-4 | One accent; meaning colours mean one thing and always come with a word | DESIGN › Colour | Review |
| D-5 | Inter for text, JetBrains Mono for code; sizes only from the type scale; sentence case | DESIGN › Type | Review |
| D-6 | Space in 4px steps; corners, shadows and touch targets (44px) from the tokens | DESIGN › Space | Review |
| D-7 | Motion explains; nothing moves the page by itself; reduce motion respected | DESIGN › Motion | Review |
| D-8 | One icon set; no hand-drawn icons in screens | DESIGN › Icons | Automatic (debt: 15) |
| D-9 | Every screen uses one of the four templates and the standard header | DESIGN › Page templates | Not yet (inventory on whiteboard) |
| D-10 | Four breakpoints only: 640, 1024, 1440 | DESIGN › Page templates | Not yet |
| D-11 | Screens are built from the kit's parts | DESIGN › The kit | Not yet (kit not built) |
| D-12 | No inline styles in screens | DESIGN › The kit | Automatic (debt: 36) |
| D-13 | No colours written in code | DESIGN › Colour | Automatic (debt: 18) |
| D-14 | One primary button per screen | DESIGN › Principles, Parts | Review |
| D-15 | Every delete asks first and names what goes | DESIGN › Behaviour | Review |
| D-16 | Saving, errors, loading, empty states, dialogs, focus and the keyboard work one way everywhere | DESIGN › Behaviour | Review |
| D-17 | Practice feels like practice: no timer or answer sheet unless the student chose a timed test | DESIGN › Principles | Review |
| D-18 | No fake urgency, guilt, endless feeds or leaderboards of grades | DESIGN › Principles; research doc | Review |
| D-19 | Every word: plain, kind, specific; errors say how to fix it | DESIGN › Words | Review |
| D-20 | One name for each thing, from the word list | DESIGN › Word list | Review |
| D-21 | Dates, times and numbers only through `app/js/format.js` | DESIGN › Dates, times and numbers | Automatic (1 allowed) |
| D-22 | Emails, downloads, print, the tab and link previews follow the design | DESIGN › Beyond the screen | Review |
| D-23 | A design change updates tokens.css, DESIGN.md and the Design System page together | DESIGN (top) | Review |
| D-24 | The screen inventory on the whiteboard is updated when a screen moves | DESIGN › Beyond the screen | Review |
| D-25 | Students choose Full or Soft motion; big moments are rationed (daily, weekly, per set); exams have no motion | DESIGN › Motion | Review |
| D-26 | The study buddy appears only at a moment from its table, within its limit; never in exams or on staff screens; never guilt | DESIGN › The study buddy | Review |
| D-27 | A new buddy moment ships with a mood for every buddy, a limit and a row in the table | DESIGN › The study buddy | Review |
| D-28 | Students have four places: Today, Classes, Progress, Settings. Bottom tabs on phones, a left bar on laptops and tablets; no other layout | DECISIONS › Student navigation | Review |
| D-29 | Every page that isn't a place has exactly one back link, top left, to the page it belongs to, from `backFor()`; a new route adds a line and a test there | DESIGN › Navigation | Automatic (tests) + review |
| D-30 | The account menu holds only who you are and Sign out; settings live on the Settings page; the bell is top right on every frame page | DESIGN › Navigation | Review |
| D-31 | Classes are named with `classTitle()` and badged with `badgeFor()` (the course number), never by hand | DESIGN › Navigation | Automatic (tests) + review |
| D-32 | Refreshing by the logo is limited to once a minute and never reads more than an ordinary visit | DESIGN › Navigation | Review |
| D-33 | Links go to pages, buttons do things; addresses are lowercase nouns that never change meaning | DESIGN › Navigation | Review |
| D-34 | Settings save the moment they change and say "Saved"; no Save button on a settings page | DESIGN › Behaviour | Review |

### Privacy and security (P)

| ID | Rule | Written in | Checked |
|---|---|---|---|
| P-1 | No secrets, rosters or student data in the repository | STANDARDS › Rules for code | Review |
| P-2 | Exams, solutions and hidden tests never go on GitHub | This file | Review |
| P-3 | The founder's `app/config.js` is never overwritten on GitHub | This file | Review |
| P-4 | Student data never goes into AI chats | This file | Review |
| P-5 | The Firebase service key lives only as a Cloudflare secret | This file; connector/worker.mjs | Review |
| P-6 | Students see only their professor's material; AI output is labelled; people make every decision that matters | STANDARDS › The bar (authenticity) | Review |
| P-7 | Visitors can't write to the database directly; public forms go through the connector with limits | firestore.rules; connector/access.mjs | Automatic |
| P-8 | Addresses and emails used for limits are stored only as keyed hashes | connector/access.mjs | Automatic |

## Changing a rule

Rules are added when a new feature needs something not covered, a mistake shows a gap, or the founder decides something. A change or a removal goes the same way, never silently.

1. Write the rule in full in its home file (STANDARDS, DESIGN or ARCHITECTURE); write it once and link to it elsewhere.
2. Add or update its line here with the next free ID in its group. IDs are never reused.
3. Record the decision and why in `docs/DECISIONS.md`.
4. Add an automatic check if one is possible; otherwise mark it Review or Not yet.
5. Count code that already breaks it as debt that can only go down, so the build stays green.
6. If it's about the look, update the Design System page too.
7. Add a line to `docs/CHANGELOG.md`.

A retired rule stays here, struck through, with the date and the reason.

At the end of every journey, go through this register once: was anything broken, was anything missing, can a Review rule become Automatic, is anything out of date?
