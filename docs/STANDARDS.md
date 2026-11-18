# How we build Cramming

Two people build Cramming: the founder and Claude. These files are the record. If something isn't written here, it didn't happen.

| File | What it holds | When it changes |
|---|---|---|
| `docs/STANDARDS.md` | This page: the bar, the rules for code and testing, how work moves | Rarely, and only by decision |
| `docs/DESIGN.md`, `app/css/tokens.css` and the "Cramming Design System" artifact | The look: every colour, font, size and part, and the rules for using them | Before any new screen; a value changes in all three at once |
| `docs/ARCHITECTURE.md` and `docs/architecture.json` | The skeleton: layers, plug points, the data model now and target, and the grid every file and stored path sits in | When a new kind of thing is added (a decision first) |
| `docs/FEATURES.md` | Every feature: who uses it, its state, its files, its tests | Every time a feature changes state |
| `docs/CHANGELOG.md` | Every release: what changed, how it was tested | Every upload to the live site |
| `docs/DECISIONS.md` | Every decision that shapes the product, and why | When we decide something we'd otherwise forget |
| `docs/ISSUES.md` | Every problem found, its cause and its fix | The moment a problem is found, and again when it's fixed |
| System map (whiteboard) | The architecture, the roadmap, and a flow map for each feature: every screen, every button, where it leads, and any gap | Every time a flow changes |

## Flow checks

Every feature gets a flow map: start screen → each button or link → where it leads → the task finished. We walk every path and ask whether everything needed to finish the task is there. A missing button, a dead end, a confusing label or wrong data is recorded in `ISSUES.md` and marked on the map in orange until it's fixed.

## The bar

We ship few features, and each one is the finest of its kind. A feature is **finished** only when all of these are true:

1. A real professor and real students have used it on a real course.
2. It works on a phone and a laptop, in light and dark mode.
3. It's complete by keyboard and screen reader, and the automated accessibility check (axe) shows nothing.
4. Its empty, loading and error states are designed and written.
5. Every word has been reviewed: plain, kind, specific.
6. It stays inside the free limits with a full class (reads, writes and AI use counted).
7. It opens in under a second on a school laptop.
8. Every rule it follows has an automated test, and every test passes.
9. It has no unused or duplicate code (see below).
10. It fits the grid: `npm test` includes the architecture check, and it passes.
11. It uses the design: only the tokens in `app/css/tokens.css` and the parts in `docs/DESIGN.md`.

The six standards behind this list: **usability, accessibility, experience, the look, authenticity, optimisation.** Authenticity means students see only their professor's material, AI output is labelled, and a person makes every decision that matters.

## Feature states

Each feature in `FEATURES.md` is in exactly one state:

- **Planned:** agreed, not started.
- **Building:** being written.
- **Built, not uploaded:** finished and tested on the local copy, waiting for the founder's upload.
- **Live, unpolished:** on the site but not yet at the bar.
- **Polishing:** being brought to the bar now.
- **Finished:** meets every point of the bar.
- **Retired:** removed; the code is deleted, not commented out.

## How work moves

One piece at a time, in this order: the landing page, then students, then professors, then admins, then what runs behind it. For each piece:

1. **Plan:** say what changes and what "done" looks like, before any code.
2. **Build:** on the working branch, in small commits that each do one thing.
3. **Test:** run `npm test` (logic and the architecture check), the browser checks (screens), and axe (accessibility). All must pass.
4. **Independent review** for anything high-stakes (security rules, grading, a whole student or professor flow): a separate agent that didn't write the code reviews and tests it before release.
5. **Record:** update `FEATURES.md`, and add a `CHANGELOG.md` entry.
6. **Release:** the founder releases. Claude doesn't commit or push; it hands over a zip of the changed files (never the private `exams/` folder or the founder's `app/config.js`) with a list of what changed, and the founder uploads it to `main`. GitHub builds, checks and publishes; the founder checks the live site. Claude pushes only when the founder asks for that release.

## Rules for code

- **No dead code.** No unused functions, exports, files, styles or commented-out blocks. `npm run audit` lists anything nothing uses, and its list must be empty before a release.
- **One way to do each thing.** Before writing a helper, look for one that already exists.
- **One file per job, named for that job.** A screen lives in `app/js/views/`, shared logic in `app/js/`, the connector in `connector/`.
- **Rules live in pure functions** (no page, no database) so they can be tested. Screens stay thin.
- **Every database read and write is counted** and noted in the file that makes it.
- **No secrets, rosters or student data in the repository.**

## Rules for testing

- Every rule gets a test that runs on every change: grading, dates, permissions, plans, limits.
- Every bug fixed gets a test that would have caught it.
- Coverage is measured and written in `FEATURES.md`. The aim: all shared logic close to 100%, and every screen covered by a browser check.
- Security rules are tested against a local copy of Firebase before they're published.

## Screen checks (planned; built with the design kit)

Every screen gets reference pictures kept with the project, so a change that alters a screen nobody meant to touch is caught.

- **What:** `npm run screens` opens every screen in a real browser (Playwright) at three sizes: laptop light (1366×768), laptop dark, and phone dark (390×844). It saves a picture of each and runs axe on each.
- **Against what:** a local copy of Firebase (the mock server, moved from Claude's scratch space into `tests/mock/`) seeded with made-up classes and students, and only the public `exams/_template` set. No real student data or private exams, ever.
- **Pass or fail:** each picture is compared with its reference in `tests/screens/`. More than a sliver of difference fails, and the report shows before, after and the difference side by side. Any axe finding fails.
- **Updating a reference:** only on purpose, with `npm run screens -- --update`, and the changed pictures are reviewed before release.
- **When:** before every release, and on every screen moved to the kit. It runs locally first; it joins the GitHub build once it's quick and steady.
- **Covered first:** landing, sign-in, policy pages, the request sheet, then each screen as it moves onto the kit. The screen inventory on the whiteboard shows which are covered.
