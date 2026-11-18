# Architecture: the skeleton

Cramming will grow from one school's classes to many schools, more roles, more subjects, gradebooks, Canvas, and the schools' own storage and AI. This page is the skeleton all of that grows into. Anything new takes a slot that's already here, so adding it never means rebuilding what exists.

Three files work together:

- **This page:** the plan, in words.
- **`docs/architecture.json`:** the grid. It lists every module's layer, every stored path, the line budget of each file, and known debt.
- **`scripts/architecture.mjs`:** the check. It runs with `npm test` (and on GitHub before every publish) and fails, with a plain message, the moment the code leaves the grid.

## 1. Layers

Every file in `app/js` sits in exactly one layer. A file may only use the layers below it.

| Layer | Holds | May use | Today |
|---|---|---|---|
| **Router** | Reads the address and loads the right screen | Everything | `main.js` |
| **Views** | One file per screen; arranges the page and calls the layers below | Shell, adapters, core, other views | `views/*.js` |
| **Shell** | The app frame and shared interface: moving between screens, theme, toasts, the bell, the calculator | Adapters, core | `ui.js`, `nav.js`, `notify.js`, `calculator.js`, `report.js`, `colors.js` |
| **Adapters** | The only code that talks to the outside world | Core, other adapters | `cloud.js` (Firebase), `store.js` (browser storage), `data.js` (question files), `render.js` (Markdown and maths), `materials.js` (reading PDFs and slides), `java/` (the Java compiler) |
| **Core** | The rules, with no outside world: parsing, grading, planning, building | Core only | `parser.js`, `engine.js`, `timed.js`, `grades.js`, `canvas.js`, `studyplan.js`, `assignments-core.js`, `build/engine.js`, `roster.js`, `seb.js` |

Why it matters: the rules (core) can be tested completely and reused anywhere, including the server. The outside world (adapters) can be swapped without touching a screen. And screens never depend on the router, so screens can be added or removed freely.

The **connector** (`connector/`) is a separate program that runs on Cloudflare. It reuses the core (`build/engine.js`) and talks to Firestore with its own service account.

## 2. Plug points

Everything that may change provider goes through one adapter, so changing provider means writing one new adapter, not editing features.

| Plug point | Now | Later | Where it plugs in |
|---|---|---|---|
| **Identity:** who someone is | Google sign-in (Firebase Auth) | School single sign-on; LTI 1.3 launch from Canvas | `cloud.js` sign-in functions |
| **Data:** where records live | Cloud Firestore, plus browser storage for offline | A university's own database or storage, per institution | `cloud.js`, `store.js` |
| **AI** | The professor's or student's own AI, through the connector | A university's approved AI, billed per use | `connector/` |
| **LMS** | Canvas roster import and grade export files | LTI 1.3: roster sync, grade passback, deep links | `roster.js`, `canvas.js` |
| **Files** | None stored; text is read in the browser | Uploads in institution storage | `materials.js` |
| **Notifications** | The in-app bell | Email and phone reminders | `notify.js` |

**Rule:** a screen never names a provider. It calls `cloud.saveX()`, never Firestore; it checks "denied", never Firebase's `permission-denied`. That last rule is debt today (screens check Firebase codes 34 times); the check stops it growing, and it's paid off as screens are polished.

## 3. The data model: now and target

Everything stored falls into five groups. The target shape is reached by adding fields and paths, never by breaking old ones.

### Organisation: who teaches what, where

- **Now:** `classes/{class}`. Each class is one course offering, holding its sections, staff and settings.
- **Target:** institution → department → course → offering (a term) → section.
- **Path there:** add `institution`, `department`, `courseCode` and `term` fields to each class (additive, with defaults for existing classes). Then add `institutions/{id}` for school-wide settings (sign-in method, storage, AI, plan). A class keeps its ID throughout, so nothing that points at it breaks.

### People: who someone is, and their role in each class

- **Now:** `users`, `signins`, `admins`, `enrollments/{email}` and `rosters/{class}`; staff are listed on the class.
- **Target:** one **membership** per person per class, with a role: student, TA, professor, coordinator, admin (and later parent, linked to a student). Roles come from records, never from email patterns.
- **Path there:** write memberships alongside rosters (both kept in step), move the security rules to read memberships, then retire the old shape with a migration.

### Content: what students learn from

- **Now:** `exams`, `examFiles`, `assignmentSets`, `assignmentFiles`, `materials`, `materialText`, `builder`, `built`, `study`, `announcements`.
- **Target:** units with notes; a **question bank** with stable question IDs, types, tags, outcomes and difficulty; and **assessments** (practice sets, quizzes, exams, assignments) that point at bank questions. This is what unlocks exam versions, import and export (QTI), statistics per question, and course copy.
- **Path there:** give every question a stable ID now (the parser already numbers them) and keep it through edits. The bank grows from the questions sets already contain.

### Assessment: graded work and its keys

- **Now:** `tests`, `testKeys` (staff only), `testCodes`, `testExtra`.
- **Target:** the same split (what students see, what only staff see), plus **rubrics** and **versions**.

### Activity: what happened

- **Now:** `attempts`, `attemptArchive`, `testGrades`, `grades`, `summaries`, `code`, class `signins`, `reports`.
- **Target:** attempts with **responses** per question, **marks** (automatic, rubric or by hand), **regrade requests**, and a **gradebook** that combines them with weights. Answer groups and AI-suggested marks attach to responses later.

## 4. Growing without breaking

Every new thing follows this checklist. The check script enforces the parts marked ✓.

1. **Find its slot.** Which layer (✓)? Which data group? Which plug point, if it touches the outside world? If nothing fits, change this page first: that's a design decision, recorded in `DECISIONS.md`.
2. **Rules first, in core.** Write the rule as a pure function with tests before the screen.
3. **Register any new stored path** in `architecture.json`, with what it holds, its group, and `"since": 1` (✓). Every document in it carries `v` (its schema version).
4. **Write its security rule** in `firestore.rules`, and test it against the local copy of Firebase (✓ that the rule exists).
5. **Switch it per class.** New features can be turned on or off for a class (later per institution), so they can be tried with one class first.
6. **Keep files small.** Every file has a line budget (✓). When a file nears it, split it by job, for example `cloud.js` into `cloud/auth.js`, `cloud/classes.js`, `cloud/content.js`, `cloud/attempts.js`, `cloud/build.js`.
7. **Reachable or removed.** A new screen gets a route (✓). Unused code is deleted (`npm run audit`).
8. **Recorded.** `FEATURES.md`, `CHANGELOG.md`, and its flow on the system map.

## 5. Changing data safely (migrations)

- **Add, don't change.** New fields have defaults; old documents keep working without them.
- **Versioned documents.** New paths start at schema version 1 (`v: 1` in each document). Code reads every version it might meet.
- **A migration is a script,** in `scripts/migrations/NNN-name.mjs`, that runs once, can be run again safely, reports what it changed, and is tested on the local copy first.
- **Two steps for any rename or move:** write both shapes, switch readers to the new shape, then remove the old one in a later release.

## 6. Scale and cost

- **Count reads and writes.** Each screen notes what it reads. A student's page should cost a handful of reads, not one per question. Lists are read once and cached for the visit.
- **Free limits first.** Today everything stays inside free plans. When a school pays, the Data and AI plug points move that school to its own storage and AI, and the cost moves with it.
- **One institution's data never mixes with another's.** Once institutions exist, every path and rule is scoped to one.

## 7. Known debt (paid off while polishing)

| Debt | Fix | When |
|---|---|---|
| `engine.js` (core) reads browser storage | Pass progress in; rename it `review.js` | When practice is polished |
| Screens check Firebase error codes (34 places) | `cloud.js` returns plain reasons | Screen by screen, as each is polished |
| `cloud.js` is 1,376 lines | Split by job (see 4.6) | Before the next feature that touches it |
| `timed-admin.js` is 1,015 lines, `instructor.js` 802 | Split by tab | When the professor screens are polished |
| 48 unused or over-exported names | `npm run audit` | As each file is touched |
| Roles in rosters and on the class, not memberships | Memberships (section 3) | Before departments or high schools |

Fixed on 17 November 2026: screens imported helpers from the router (a loop). They now come from `nav.js`.

## The look

Every colour, font, size, space, corner and motion value is a token in `app/css/tokens.css`, loaded first on every page. Stylesheets use only `var(--cr-…)`. The architecture check (section 7) fails if a stylesheet writes a colour of its own or uses a token that doesn't exist; `app/css/app.css` is recorded as debt (`design.debt` in `architecture.json`) and may only lose colours until the design kit moves it onto the tokens. The rules for using the tokens are in `docs/DESIGN.md`. The same check counts four things in the code that should go through one place: inline styles, colours written in JavaScript, dates formatted outside `app/js/format.js`, and SVG drawn outside the icon set (`design.code` in `architecture.json`). Each count may only go down.

