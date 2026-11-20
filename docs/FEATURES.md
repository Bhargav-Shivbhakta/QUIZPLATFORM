# Features

Every feature, and the one state it's in (states are defined in `STANDARDS.md`). Last checked against the code on 17 November 2026.

**Tests** says what checks the feature automatically today. "None" means nothing does yet, and it can't be **Finished** until something does.

## Starting point, 17 November 2026

- Tests pass: 53 (59 after the landing refinements).
- Coverage: about 22% of lines overall. The shared logic that is tested is mostly 90% or more (build engine, connector, parser, Canvas, study plan). The screens (`app/js/views/`), `cloud.js`, `ui.js` and `main.js` have no tests in the project. They were checked by hand and with browser scripts that live outside the project.
- `npm run audit` lists 48 exports. Eight are used nowhere: `calculatorOpen`, `classExamEntries`, `savesLeftToday`, `getAccessCode`, `getBuilt`, `checkJava`, `runProgram`, `isRef`. The other 40 are used only inside their own file and just need `export` removed. Each is fixed while its feature is polished, and the list must be empty before launch.
- Naming tangle: two files are both called `engine.js`. `app/js/engine.js` is spaced repetition, and `app/js/build/engine.js` is Build my course. Rename the first to `review.js` when practice is polished.

## Site

| Feature | State | Files | Tests |
|---|---|---|---|
| Landing page (one screen at a time: opening, the challenge, how Cramming helps, for students, practice, for educators, subjects with a question to try for each, course tutor and dashboard, graded exams with a live exam view, the science, privacy, questions, the end) | Live, unpolished | `views/landing.js`, `views/lp-shell.js`, `views/lp-hero.js`, `views/lp-scenes.js`, `views/lp-paging.js`, `views/lp-subjects.js`, `views/lp-live.js`, `css/landing.css` | Browser checks at 6 sizes, axe clean |
| Request access in two steps (who you are; optional course details), through the connector with daily limits | Live, unpolished | `views/lp-request.js`, `requests.js`, `cloud.js`, `connector/access.mjs`, `firestore.rules` | 9 unit tests; browser checks; rules on the local copy; two independent reviews |
| Admin › Access requests: statuses (New, Contacted, Set up, Not a fit), notes, no deleting, red count on Admin | Live, unpolished | `views/admin-requests.js`, `requests.js`, `main.js` | Unit tests; browser checks; axe clean |
| Privacy, Terms, How we use AI, Accessibility pages (drafts; rewritten after phase 1, see below) | Live, unpolished | `views/policy.js` | Browser checks, axe clean |
| Sign-in page (#/signin): one panel in the landing design, Continue with Google, and Request access for new courses | Live, unpolished | `views/signin.js`, `main.js` | Browser checks, axe clean |

## Students

| Feature | State | Files | Tests |
|---|---|---|---|
| **Student frame (bar locked 19 Nov):** one left bar on laptops: fixed logo (one click back, two clicks refresh, once a minute), a middle that slides from Today + your classes to a class card (switch class) + Ready, Learn, Practice, Graded work, and your name at the foot opening Me (My progress, Settings, Sign out) over a blurred page; collapses to a rail (handle or ⌘ + \, remembered) with subject-over-number badges; tablets always the rail; phones keep four bottom tabs and the top bar; bell top right; Search, Inbox, Calendar and Grades hidden until built; exams and practice full screen | New, step 1 + navigation rules | `stshell.js`, `navmap.js`, `css/student.css`, `views/st-class.js` | Unit tests (navmap), browser renders at 1440, 900 and 390 |
| **Today (new):** one Today for all classes, class filters, the countdown, readiness as number and word, Start today's set, This week, Coming up | New, step 1 | `views/st-today.js`, `views/st-data.js`, `today.js` | 7 unit tests; browser checks |
| **Class page (new):** Study plan (with the tracing line), Practice, Notes, Graded work; Classes list on phones; Progress page | New, step 1 | `views/st-class.js`, `views/st-classes.js`, `views/st-progress.js` | Browser checks |
| **Study buddy (new):** the Dot (default) or the Flame or off; morning hop from the logo, tap, eyes follow; Settings: Study buddy and Motion (Full, Soft) | New, step 1 | `buddy.js`, `views/settings.js` | Browser checks |
| **To do: the Dot's introduction** for new students (it says hello, explains what it does, offers Dot, Flame or off), and **arms and legs across the app** as named poses (wave, thumbs up, clap, read, sleep, sit; tucked in at small sizes). Planned with the Today's set deep dive | Planned | `buddy.js`, `views/st-today.js` | — |
| Sign in and pick classes | Live, unpolished | `views/signin.js`, `views/subjects.js`, `views/classes.js` | None |
| Class home with Next up | Live, unpolished | `views/home.js`, `views/nextup.js` | None |
| Practice question sets | Live, unpolished | `views/quiz.js`, `views/browse.js`, `parser.js`, `engine.js` | Parser |
| Questions come back before you forget (spaced review) | Live, unpolished | `engine.js`, `store.js` | Partly |
| Flashcards | Live, unpolished | `views/flashcards.js` | None |
| Results after a quiz | Live, unpolished | `views/results.js` | None |
| Timed and random practice tests | Live, unpolished | `views/exam.js`, `views/quiz.js` | None |
| Graded exams, quizzes and assignments (timed, one attempt) | Live, unpolished | `views/take.js`, `timed.js` | None |
| Code editor (CodeMirror 6) | Live, unpolished | `java/editor.js` | None |
| Coding assignments (Java editor, run, tests); a practice set can be coding only | Live, unpolished | `views/code.js`, `views/assignments.js`, `assignments-core.js`, `java/` | Java compiler, assignments |
| Study pages by unit | Live, unpolished | `views/study.js` | Through the build engine |
| My study: today, mistake notebook, week plan | Live, unpolished | `views/mystudy.js`, `studyplan.js` | Study plan |
| Progress | Live, unpolished | `views/progress.js` | None |
| Notification bell | Live, unpolished | `notify.js` | None |
| Report a problem with a question | Live, unpolished | `report.js` | None |
| Scientific calculator | Live, unpolished | `calculator.js` | None |
| Ask the tutor (their own AI, course only) | Live, unpolished | `connector/tutor.mjs`, `views/mystudy.js` | Tutor connector |
| Settings, students: account, studying (buddy, weekly goal, answers, shuffle, confirm), appearance, data | New design | `views/st-settings.js`, `store.js` | Browser checks, axe |
| Settings, staff: dark mode, backup | Live, unpolished | `views/settings.js`, `store.js` | None |

## Professors and TAs

| Feature | State | Files | Tests |
|---|---|---|---|
| Build my course (five steps) | Live, unpolished | `views/builder.js`, `views/build-run.js`, `views/build-review.js`, `build/engine.js`, `connector/` | Engine, connector, Worker |
| Course materials read in the browser | Live, unpolished | `materials.js` | Partly |
| Practice sets: questions (.md), coding (.zip) or both; Remove questions | Live, unpolished | `views/content.js`, `views/content-coding.js` | Parser; browser flow (I-1) |
| Check a question file, preview as a student | Live, unpolished | `views/author.js` | Parser |
| Release dates for practice | Live, unpolished | `views/content.js`, `cloud.js` | None |
| Graded work: exam, quiz or assignment; setup, extra time, preview | Live, unpolished | `views/timed-admin.js`, `timed.js` | None |
| Rules per section (time limit, access code), turn on or off | Live, unpolished | `views/timed-admin.js` | None |
| Live tab: who is working, access code on a projector | Live, unpolished | `views/timed-admin.js` | None |
| Leave warnings and the AI-tools notice | Live, unpolished | `views/take.js` | None |
| New attempt for a student (earlier score kept) | Live, unpolished | `views/timed-admin.js` | None |
| Safe Exam Browser file | Live, unpolished | `seb.js` | None |
| Instructor dashboard for each exam | Live, unpolished | `views/instructor.js` | None |
| Exam analytics from real scores | Live, unpolished | `views/analytics.js`, `grades.js` | Partly |
| Canvas grade export | Live, unpolished | `canvas.js` | Canvas |
| Announcements | Live, unpolished | `views/announce.js` | None |
| Most-missed and similar questions | Live, unpolished | `views/instructor.js` | None |
| Sign-in tracking (signed in, not started) | Live, unpolished | `views/instructor.js` | None |
| TAs limited to their sections | Live, unpolished | `views/instructor.js`, `firestore.rules` | None |
| Instructors add, edit and remove their students | Live, unpolished | `views/instructor.js` | None |
| Student problem reports | Live, unpolished | `report.js`, `views/instructor.js` | None |
| Study pages and tutor on or off | Live, unpolished | `views/mystudy.js`, `views/classes.js`, `cloud.js` | None |

## Admins

| Feature | State | Files | Tests |
|---|---|---|---|
| Create classes, assign instructors | Live, unpolished | `views/admin.js` | None |
| Upload Canvas rosters | Live, unpolished | `views/admin.js`, `roster.js` | None |
| Platform overview | Live, unpolished | `views/overview.js` | None |
| First-time setup | Live, unpolished | `views/setup.js` | None |

## Behind it

| Part | State | Files | Tests |
|---|---|---|---|
| Website on GitHub Pages | Live, unpolished | `scripts/build.mjs`, `.github/` | Build check |
| Firebase sign-in and data | Live, unpolished | `cloud.js` | None |
| Security rules | Live, unpolished | `firestore.rules` | None; needs tests against a local copy of Firebase |
| Java compiler and runner in the browser | Live, unpolished | `java/` | Partly |
| Maths display (KaTeX) | Live, unpolished | `render.js` | None |
| Cloudflare Worker: builder and tutor connectors | Live, unpolished | `connector/` | Yes |

## Planned

- **Phase 1 (now): finish what exists.** Every existing feature, journey by journey, made flawless on the new look (tokens, kit, `DESIGN.md`). **When phase 1 is done:** rewrite Privacy, Terms of use, How we use AI and Accessibility (`views/policy.js`) so they describe exactly what the finished product collects, shows and does, run the accessibility audit the Accessibility page promises, then have a lawyer review all four before launch.

The order and the phases are on the system map whiteboard ("Cramming System Map"). A feature moves into a table above when work on it starts.

- **Launch (month one):** Build my course, Study, Practice (maths answer entry, fresh numbers), Exams (with a grades page), My study. Before launch: the new design everywhere, a privacy policy and terms, how we use AI, an accessibility audit, error monitoring, server backups, free-limit guards, a security review, a copyright stance, and an SDSU pilot. **Brand protection:** ™ on Cramming and Small reps. Top grades. (the tagline from 18 November 2026; Cram the right way. is retired), and an evidence folder of first-use dates and dated screenshots. The trademark filing for the name and logo (classes 41 and 42, $700) waits until schools pay. A copyright registration of the code is optional, and must disclose the AI-written parts. The steps are in the Claude Doc "Cramming: Trademark and Copyright Guide".
- **More programming languages, in the browser (free, private):** Python first, then JavaScript and SQL, then C and C++. The landing page says these are on the way (19 November 2026). Every other language (LeetCode style) needs a server to run code safely, so it waits for server labs, once schools pay.
- **AI across the platform, in stages (DECISIONS, 19 November 2026):** now, bring your own AI; next, free Cloudflare Workers AI on course material only ("Explain it another way", saved answers, a daily cap, labelled, on or off per course); once schools pay, AI for students (hints, in-app tutor, study coach) and educators (question drafting, suggested grading, class insights) through the school's AI or a paid API under a data agreement, with the landing page and policies rewritten first.
- **Phase 2, grading and gradebook:** rubrics, comment bank, answer groups, anonymous grading, split grading, TA progress, regrade requests, per-question statistics, exam versions, full gradebook, student grades page, extensions, Python in the browser, copied-code check, code playback and paste limits, participation credit.
- **Phase 3, teach and connect:** Ask my professor and office hours, a Q&A board, messaging, early warning, reminders, a calendar, difficulty levels, retries never lower a score, course copy, a tagged question bank, quiz import and export, version history, co-teachers and TA permissions, view as student, an installable app with offline use, search, bookmarks and notes.
- **Phase 4, schools and high schools:** a school and department layer, coordinators, high school teachers, under-13 privacy, a parent view, district admin, standards mapping, term rollover, usage reports, data retention, a FERPA agreement, a VPAT, a help centre, Spanish, and pricing.
- **Expansion, once schools pay:** LTI 1.3, school single sign-on, AI-suggested grading, handwriting, file and photo uploads, platform-run AI hints, server labs, university AI and storage, and a Claude directory listing.
