# Design

How Cramming looks, sounds and moves. Every new screen or feature starts here. The look is **Clear**, chosen on 17 November 2026: cool white and near-black, one blue, set in Inter.

Three places hold the design, and they always agree:

| Where | What it holds | Who reads it |
|---|---|---|
| `app/css/tokens.css` | Every colour, font, size, space, corner, shadow and motion value, in light and dark | The code. Every stylesheet uses these and nothing else |
| `docs/DESIGN.md` (this file) | When and how to use each one, the parts, the words | Anyone building a screen |
| The Design System artifact ["Cramming Design System"](https://claude.ai/artifact/Kpn36zV5wgjeaf754V3cJf) | The same tokens and parts, shown live | Anyone who wants to see it |

Change a value in `tokens.css` first, then update this file and the artifact in the same change. `npm test` fails if a stylesheet writes a colour of its own or uses a token that doesn't exist.

## Principles

1. **One clear next step per screen.** One primary button. Everything else is secondary or a link.
2. **Practice feels like practice.** Timers, answer sheets and Finish buttons appear only in graded or timed work the student chose.
3. **Feedback at once.** An answer is checked and explained within 400 ms, with no page jump.
4. **Show progress that is real:** questions done today, topic readiness, days to the exam. Never invented points.
5. **Calm, not loud.** No fake urgency, guilt, confetti storms or leaderboards of grades. See the research doc "Cramming: Designing a Study App Students Return To".
6. **Everyone can use it:** keyboard, screen reader, phone, light and dark, 200% zoom.

## Colour

Use the token, never the hex. Light and dark values switch automatically.

| Token | Light | Dark | Use for |
|---|---|---|---|
| `--cr-bg` | `#FBFBFC` | `#0B0B0D` | The page |
| `--cr-surface` | `#FFFFFF` | `#17181B` | Cards, sheets, inputs |
| `--cr-soft` / `--cr-soft-2` | `#F1F2F5` / `#F4F5F8` | `#141518` / `#1E1F23` | Quiet fills: code, progress track, hover |
| `--cr-ink` | `#1C1D21` | `#F2F2F4` | Main text |
| `--cr-ink-2` | `#5B5D66` | `#A9ABB3` | Secondary text, descriptions |
| `--cr-ink-3` | `#6B6D76` | `#9A9CA4` | Hints, timestamps (still passes 4.5:1) |
| `--cr-line` / `--cr-line-2` | `#E6E7EB` / `#DADCE2` | `#2A2B30` / `#34353B` | Dividers / input and card borders |
| `--cr-accent` | `#2443C4` | `#6E8BFF` | The one action colour: primary buttons, links, focus, progress |
| `--cr-accent-ink` | `#FFFFFF` | `#0B0B0D` | Text on the accent |
| `--cr-accent-soft` | `#EEF1FC` | `#1C2340` | Selected and "New" backgrounds |
| `--cr-right` / `-soft` | `#15703A` / `#EAF6EE` | `#4ADE80` / `#132A1C` | A right answer, done |
| `--cr-wrong` / `-soft` | `#C2410C` / `#FDF0E8` | `#FB923C` / `#2E1D12` | A wrong answer (orange, never red: a mistake isn't danger) |
| `--cr-warn` / `-soft` | `#A15C07` / `#FDF4E3` | `#F5B544` / `#2D2410` | Something needs attention soon |
| `--cr-danger` | `#B4441A` | `#F28B6B` | Errors, and destructive actions such as Delete |
| `--cr-badge` | `#C7361F` | `#C7361F` | The count dot on Admin and the bell |
| `--cr-band-*` | dark in both themes | | Dark sections on the landing page and product pictures |

Rules:
- **One accent.** Blue means "you can act here". Don't use it for decoration.
- **Meaning colours mean one thing.** Green is right or done, orange is wrong, amber is attention, the danger colour is errors and Delete. Never use them for decoration, and always pair them with a word or icon so colour isn't the only signal.
- **Contrast:** text at least 4.5:1 against its background, large text and icons 3:1. Every pair in the table passes.
- **Class colours** (each class's own colour chosen by its professor) appear only as a small dot or stripe that identifies the class, never as a background for text.

## Type

Inter for everything. JetBrains Mono for code, plain-text maths and numbers that line up. KaTeX for typeset maths.

| Token | Size | Use for |
|---|---|---|
| `--cr-text-display` | 40 to 72 px | Landing page headlines only |
| `--cr-text-3xl` | 44 px | A page's main heading on large screens |
| `--cr-text-2xl` | 32 px | Page heading |
| `--cr-text-xl` | 24 px | Section heading, card title |
| `--cr-text-lg` | 20 px | Question text, lead paragraph |
| `--cr-text-md` | 17 px | Body text (the default) |
| `--cr-text-sm` | 15 px | Secondary text, buttons, table cells |
| `--cr-text-xs` | 13 px | Labels, timestamps, captions (the smallest allowed) |

Rules:
- Weights: 400 for text, 500 for labels, 600 for buttons and headings, 700 for page headings and the display size.
- Headings: tight letter spacing (`--cr-tracking-tight`), `text-wrap: balance`, line height `--cr-leading-tight`.
- Body: line height `--cr-leading` (1.5), lines no wider than about 70 characters.
- Sentence case everywhere ("Request access", not "Request Access"). No uppercase labels.
- Numbers in tables and timers use `font-variant-numeric: tabular-nums`.

## Space, corners, shadow

- **Space** comes in steps of 4px: `--cr-space-1` (4) to `--cr-space-16` (64). Use `gap` on flex and grid, not margins between siblings.
- **Corners:** `--cr-radius-sm` (8) for small chips and code, `--cr-radius` (12) for inputs and options, `--cr-radius-lg` (16) for cards, `--cr-radius-xl` (24) for sheets and dialogs, `--cr-radius-pill` for buttons and status pills.
- **Shadow** only on things that float above the page: sheets, menus, the product pictures. Cards on the page use a border, not a shadow.
- **Touch targets** at least `--cr-tap` (44px) high.

## Motion

- Ease: `--cr-ease`. Durations: `--cr-fast` (150 ms) for hover and press, `--cr-base` (250 ms) for things opening and closing, `--cr-slow` (450 ms) for sections arriving.
- Motion explains: something appears where it came from, a check pops when an answer is right, progress fills. Nothing moves just to move. No tilt, parallax or scroll-jacking.
- The page never jumps on its own. Move focus with `{ preventScroll: true }` and keep what the reader was looking at in place.
- Everything respects "reduce motion": it still works, with no movement.
- **Two levels, the student's choice** (Settings › Motion): **Full** (the default) and **Soft**. The screens are identical; Soft keeps only the quiet movements (pages fading in, the highlight gliding to what you picked, rings and bars filling, the Study plan line) and drops the rest. Reduce motion on the device beats both.
- **What Full adds, and how often:** the screen you open grows out of what you tapped (the countdown card opens into practice; a class card into its page); the morning tick of the countdown and the ring climbing from yesterday's readiness (once a day); green spreading from where you tapped a right answer and the tick drawing itself; the working writing itself out line by line after a wrong answer; a sweep along the progress bar for three right in a row (once per set); numbers counting up and today's dot dropping into the week at the end of a set; confetti for the weekly goal (once a week); the slow glow behind the countdown.
- **The Study plan line** traces down to today's stop each time the tab opens (0.9 s in Full, 0.55 s in Soft). It shows where you are, so it plays every time.
- Two things may move on their own, and only on Today: the glow behind the countdown (very slow, Full only) and the study buddy idling beside the greeting. Nothing else moves unless something changed.
- **Exams have no motion at all**, at either level: nothing that could distract or differ between students.

## The study buddy

Every student has a study buddy that cheers them on at a few moments. The default is **the Dot**: the filled blue dot of the Cramming logo, come to life. Students can switch to **the Flame**, or turn the buddy off, in Settings › Study buddy. The mockup "Student Navigation Mockup" shows every moment working.

**Rules**

1. **One home.** The buddy lives beside the greeting on Today. Only there does it idle: it breathes, blinks, its eyes follow the pointer, and a tap makes it squish, wink, spin or show a heart (at most once every 2 seconds).
2. **Moments, not decoration.** Anywhere else it appears only for a moment from the list below, then leaves. At most one appearance per screen.
3. **Rationed.** The morning hop once a day; the weekly goal once a week; "three in a row" once per set.
4. **Never guilt.** It celebrates and encourages. It never sulks, nags, looks sad at the student, or mentions a missed day or a streak.
5. **Never in the way.** It never covers a question, an answer or a button, never makes anyone wait, and a tap skips it.
6. **Never in exams, never for staff.** No buddy in graded work, in exam mode, or on professor, TA or admin screens.
7. **Decorative to screen readers.** The buddy is `aria-hidden`; whatever it "says" is ordinary text on the screen.
8. **Students choose.** Dot (default), Flame or off, kept with their settings. With motion off or reduced, the buddy still appears, standing still.

**Moments**

| Moment | When | What happens | Limit |
|---|---|---|---|
| Morning hello | First open of the day, on Today | Full: the Dot hops out of the logo, lands on the Today tab, then jumps beside the greeting and waves; the countdown then ticks over. Soft: it is simply there | Once a day |
| Tap | Any time, beside the greeting | Squish, wink, spin or a heart | Every 2 seconds at most |
| Three in a row | Practice, third right answer in a row | Pops in at the corner: "Three in a row!" | Once per set |
| Done for today | End of the day's set; Today afterwards | Happy, "Nice work" | Once a day |
| Weekly goal | The set that reaches the weekly goal | A flip, with confetti in the class colours | Once a week |
| Reading along | Notes with nothing open yet; the tutor waiting | Glasses on | Per screen |
| Exam day | On Today before an exam (never inside it) | Headband on: "You've prepared for this." | Once that day |
| Nothing here yet | Empty lists | Calm, eyes closed | Per screen |
| Thinking | Only when loading takes over a second | Bounces like a loading dot | While loading |
| Late night | After midnight, on Today | Sleepy: "Sleep helps it stick. See you tomorrow." | Once a night |
| Something broke | Error screens | "That's on us, not you. Try again." | Per error |

**Adding a feature.** Use a moment from the table. A new moment needs, before it ships: a mood drawn for every buddy (Dot and Flame), a limit, its words checked against the word list, and a row in this table. The drawings are SVG, built from the logo's shapes and the tokens, with no text inside.

**Words.** In the product it is "your study buddy", "the Dot" and "the Flame". Never "mascot", "pet" or "avatar".

## Icons

One set, drawn one way, in `app/js/ui.js`: call `icon('name')`. Screens don't draw their own.

- **Drawing:** a 24px grid, 1.8px line in `currentColor`, round ends and corners, no fill. The icon takes the colour of the text beside it.
- **Sizes:** 16px beside small text, 20px (the default) beside body text and in buttons, 24px on its own.
- **Meaning:** an icon goes with a word, except a few universal ones on their own (close, search, menu, back). An icon-only button has an `aria-label` ("Close"); a decorative icon has `aria-hidden="true"`.
- **The set today (41):** flag, plus, mail, edit, bell, link, eye, lock, star, calc, clock, pause, play, left, right, grid, x, copy, up, down, check, bulb, keyboard, settings, home, strike, note, upload, download, search, shuffle, trash, chart, users, book, code, target, flame, sparkle, megaphone, report.
- **One icon, one meaning.** For example, `flag` is "flag for review" in an exam; "report a problem" uses `report`, never a second flag.
- **Adding one:** draw it on the same grid and line, add it to the set in `ui.js`, list it here and in the design system, then use it.
- **Not icons, so drawn on their own:** the Cramming logo, the Google sign-in mark (its maker's rules), charts, and the exam watermark.
- **To move into the set:** the hand-drawn icons on the landing page, the sign-in doors and the Request access close button (17 drawings in screens today), as those screens move to the kit.

## Page templates

Every screen uses one of four templates. A screen doesn't invent its own width, header or spacing.

| Template | Width | Has | Use for |
|---|---|---|---|
| **Reading** | `--cr-width-read` (720px) | Page header, one column | Notes, settings, forms, results, sign-in, empty and error pages |
| **Work** | `--cr-width-work` (1120px) | Page header, cards in a grid of 1 to 3 columns | Class home, Today, a list of sets, Build my course |
| **Wide** | `--cr-width-wide` (1320px) | Page header, optional side menu (`flex-wrap`, it stacks on a phone), tables | Professor dashboard, analytics, graded work setup, the admin console |
| **Focus** | Full screen, content at reading width | No site menu: a slim top bar with Exit, the set or exam name, and progress | Practice sets, practice tests, exams, flashcards, the code editor |

**The page header**, the same on every template except Focus:
1. Optional back link ("‹ MATH 150") in `cr-ink-2`.
2. A context line in `cr-ink-2`, 13px: "MATH 150 · Fall 2026".
3. The title, `--cr-text-2xl` (32px), one per page, as `<h1>`.
4. Optional one-line description in `cr-ink-2`.
5. Actions on the right on a laptop, under the title on a phone; at most one primary.

**Spacing:** side gutter `--cr-gutter`; header to content `--cr-space-8`; between sections `--cr-space-10`; between cards `--cr-space-6`.

**Breakpoints**, the only four: phone below 640px, tablet 640 to 1023px, laptop 1024px and up, large 1440px and up. Navigation is the top bar on a laptop and the tab bar on a phone. Today the app uses six different breakpoints; they collapse to these as screens move to the templates.

## Parts

Build every screen from these. Before making a new part, check this list. A new part is added here and to the Design System artifact before it ships.

| Part | Looks like | Rules |
|---|---|---|
| Primary button | Accent fill, accent-ink text, pill, 44px tall | One per screen. A verb: "Start", "Save", "Send request" |
| Secondary button | Surface, `--cr-line-2` border, ink text | For the other actions |
| Quiet button | Underlined text, no box | Skip, Cancel, Not now |
| Danger button | Danger text and border; filled only inside its confirmation | Always asks first, and says what will be lost |
| Card | Surface, `--cr-line` border, `--cr-radius-lg`, 24 to 28px padding | Only to separate one object from others |
| Input | Surface, `--cr-line-2` border, `--cr-radius`, 16px text, label above | Error message under it, in danger colour, saying how to fix it |
| Choice chips | Pills; selected = accent-soft fill, accent border, a tick | Real checkboxes or radios underneath |
| Status pill | Small pill: New (accent-soft), done (right-soft), attention (warn-soft), neutral (soft) | A word, never colour alone |
| Answer option | `--cr-radius` box, 50px tall; right = right border and fill with "Correct"; wrong = wrong border and fill with "Not this one" | The explanation appears under the options, without moving the page |
| Progress bar | 8px track in soft, accent fill | Always with a label: "7 of 10 done" |
| Sheet / dialog | Surface, `--cr-radius-xl`, scrim behind | Title, close button, Escape closes, focus returns to the opener |
| Toast | Small, bottom, disappears after a few seconds | Says what happened in past tense: "Saved" |
| Empty state | A sentence saying what will appear and one button to start | Never zeros or a blank box |

## The kit: the parts in code

The parts above are built once, in code, and screens only put them together. This is what stops screens drifting apart. The kit is built with the first student screens (Today, practice, results) and grows one part at a time; nothing here exists until a screen needs it.

- **Where:** `app/js/kit.js` (the shell layer, beside `ui.js`, whose toast, dialog and icon helpers move in) and `app/css/kit.css`, which uses only `--cr-` tokens. Class names start with `k-`.
- **Shape:** each part is a function that takes plain values and returns HTML, the way screens are written today. Text is escaped inside the part, so a screen can't forget to.
- **Tests:** each part has unit tests for its markup: a label on every control, `aria-` attributes, escaped text, the right element (`<button>`, `<a href>`).
- **Each part is shown** in the design system with a live preview, and listed here.

| Function | Makes | Notes |
|---|---|---|
| `page({ template, back, context, title, description, actions, body })` | A whole page in one of the four templates, with the standard header | `template`: `read`, `work`, `wide`, `focus` |
| `button({ label, kind, href, icon, attrs })` | A button or a link styled as one | `kind`: `primary`, `secondary`, `quiet`, `danger` |
| `card({ context, title, body, actions })` | A card | |
| `empty({ title, body, action })` | An empty state | |
| `pill({ label, tone })` | A status pill | `tone`: `new`, `done`, `attention`, `neutral` |
| `progress({ value, max, label })` | A labelled progress bar | |
| `field({ label, name, type, value, hint, error })`, `choices({ legend, name, options, multiple })` | Form fields and choice chips | Error text tied to its field |
| `answer({ text, state })` | An answer option | `state`: `waiting`, `right`, `wrong` |
| `table({ columns, rows })` | A table that becomes labelled rows on a phone | |
| `toast(msg, { tone, undo })`, `confirm({ title, body, action, danger })` | Toasts and confirmations (moved from `ui.js`) | |
| `reason(error)` (in `cloud.js`) | One plain sentence for any database error | Replaces the 34 checks in screens |

**Moving a screen onto the kit:** rebuild it from kit parts and a template, delete its old styles from `app/css/app.css` (the colour count in `architecture.json` goes down), check it in light, dark and phone with axe, and mark it on the screen inventory.

## Behaviour

One way to do each common thing. The helpers live in `app/js/ui.js` today and move into the kit.

| Situation | What happens | How |
|---|---|---|
| **Saving** | The button says what it does ("Save changes"), shows "Saving…" and can't be pressed twice, then a toast in the past tense: "Saved" | `toast('Saved', 'good')` |
| **Something went wrong** | A plain sentence saying what failed and what to do, next to where it happened; a toast only when there's no better place. Nothing already typed is lost | `toast(msg, 'bad')`, or an inline error under the field |
| **Deleting** | Always asks first, naming the thing and what goes with it ("Delete MATH 150? Its 3 practice sets and 120 attempts go too."). The confirm button is the danger button and says the action: "Delete class" | `confirmDialog({ danger: true, confirm: 'Delete class' })` |
| **Undo instead of asking** | For small, common actions that are easy to reverse (archive, mark done), act at once and offer "Undo" in the toast for 6 seconds | Toast with an Undo button (in the kit) |
| **Loading** | Under 0.4 s: show nothing. Longer: a quiet "Loading…" line where the content will appear, with `aria-busy="true"` on the area. Never a full-page spinner | The page shell |
| **Empty** | Says what will appear and how to make the first one, with one button | Empty state part |
| **Leaving with unsaved work** | Asks before leaving; graded work warns and keeps the answers | The nav guard in `nav.js` |
| **Sheets and dialogs** | Open over a dimmed page; Escape and the close button close them; Tab stays inside; focus starts on the first field and returns to what opened it | `modal()`, the request sheet |
| **Focus** | Every control shows a 2px accent ring with the keyboard. When a page opens, focus goes to its heading. Focus moves with `{ preventScroll: true }` so the page never jumps | |
| **Forms** | Check a field when the person leaves it or presses Send, not while typing. Put the first error's message under its field and move focus there | |
| **Keyboard** | Enter sends a form; Escape closes; in practice 1 to 4 pick an answer and Enter goes on; shortcuts are shown next to the button they press | |
| **Live numbers** | Clocks and counts update in place without moving anything; screen readers hear only changes that matter (time almost up) | `aria-live="polite"` |
| **Copy** | "Copy" changes to "Copied" for 2 seconds | |

Database errors become plain reasons in one place (`cloud.js`), not in each screen. Today screens check "permission-denied" 34 times; that goes when the kit arrives.

## Words

- Plain, kind, specific. Say what happens: the button says "Send request"; the toast says "Request sent".
- Write for the person on the screen: "your class", "your students".
- Errors say what went wrong and how to fix it, without blame or apology.
- No jargon: "spaced review", not "SRS"; "sign in", not "authenticate".
- US spelling: practice, color (in text), center.
- Numbers as digits: "4 min", "12 days".

### The word list

One name for each thing, on every screen, in every email and in help text. Code may keep older names (`instructor`, `timed`) where data depends on them; the words people see follow this list. Today the app mixes "instructor" (100 times), "professor" (88) and "teacher" (51); each screen is brought in line when it moves to the new look.

**People**

| Say | Means | Don't say |
|---|---|---|
| professor | The person who runs a course. A school set up as a high school says **teacher** instead, everywhere | instructor, faculty, lecturer (except on the Request access role list) |
| TA | A teaching assistant, limited to their sections. Spell out "teaching assistant" once on a form | assistant, grader |
| course staff | Professors and TAs together | instructors, team |
| student | Anyone taking the class | learner, user, pupil |
| admin | Runs Cramming for a school or the platform | administrator, superuser |

**Courses**

| Say | Means | Don't say |
|---|---|---|
| course | The subject, like MATH 150 | |
| class | One term of a course, with its own list of students: "MATH 150, Fall 2026" | course offering, cohort |
| section | A group inside a class: "Section 02" | group, lab (unless it is one) |
| roster | The list of students in a class | class list, enrollment |
| unit | A week or chapter of material: "Unit 4: The chain rule" | module, chapter, week |
| topic | A skill that questions are tagged with: "Limits" | tag, category, concept |

**Studying**

| Say | Means | Don't say |
|---|---|---|
| Today | The short plan for today | daily plan, my study |
| study plan | A class's units on the way to its next exam, with today's stop: the first tab of a class | path, roadmap, module, syllabus |
| study buddy | The Dot (or the Flame) that cheers a student on at a few moments | mascot, pet, avatar |
| practice | Anything ungraded. A "set" is one short run of questions: "a 10-question set" | drill, exercise |
| question bank | All the practice questions for a class or exam | question set, pool |
| review | Questions coming back before you forget them | spaced review, smart review, SRS (except once, to explain it) |
| mistakes | Questions you got wrong, waiting to be redone | mistake notebook, wrong answers |
| practice test | Timed and ungraded, like the real exam | mock exam, timed test, random practice test |
| flashcards | Question on the front, answer on the back | cards, deck |
| notes | Study notes for a unit | study pages, lesson, reading |
| readiness | How ready you are for a topic or exam: a percentage with its word, always together: "62% · Getting there". The words are Solid, Getting there, Not started | score, level, mastery (and never a percentage without its word) |
| the tutor | The AI that answers only from the course | chatbot, assistant, AI helper |

**Graded work**

| Say | Means | Don't say |
|---|---|---|
| graded work | Anything that counts toward a grade | assessments, timed work |
| quiz / exam | Graded, timed, usually one attempt | test (for graded work), assessment |
| coding assignment | A graded program with tests | programming assignment, lab, project |
| attempt | One go at graded work | submission, try |
| access code | The code a professor reads out to start an exam | password, PIN |

**Actions**

| Say | Means | Don't say |
|---|---|---|
| sign in / sign out | | log in, log out, login |
| release | Make practice or notes open to students on a date | unlock, open up |
| publish | Make something the professor built visible | post, push, go live |
| request access | Ask to use Cramming | sign up, register, apply |
| save | Keep a change | submit (except graded work), apply |
| delete | Remove for good, after asking | remove (unless it can be undone), erase |

## Dates, times and numbers

Every date, time and number on screen goes through `app/js/format.js`. Screens never call `toLocaleString` or build a date by hand. Dates show in the viewer's own language and time zone, and the year appears only when it isn't this year.

| Function | Shows | Use for |
|---|---|---|
| `day(x)` | Nov 17 | Short dates in lists and charts, ranges ("Nov 17 to Nov 23") |
| `weekday(x)` | Tue, Nov 17 | A due date or a day in a plan |
| `longDay(x)` | Tuesday, Nov 17 | A page's heading date ("Today, Tuesday, Nov 17") |
| `dateTime(x)` | Tue, Nov 17, 5:02 PM | When something opens, closes or was sent |
| `time(x)` | 5:02 PM | A time on the same day |
| `clock(x)` | 5:02:07 PM | A live clock during an exam |
| `dayKey(x)` | 2026-11-17 | Keys and file names only, never for reading |
| `number(n)` | 1,234 | Counts; shows "–" when there is nothing |

Rules:
- A date-only value ("2026-11-17") is read as noon that day, so it never slips a day in another time zone.
- Durations are short and plain: "4 min", "1 h 20 min", "12 days". Relative days: "today", "tomorrow", "in 3 days", "yesterday".
- Percentages are whole numbers ("80%"); show a fraction instead when it's clearer ("7 of 10").
- Exam windows and deadlines that must match a school's clock name the time zone once on the page ("Times are Pacific").

## Beyond the screen

Everything that carries the Cramming name follows this file, not only the app.

- **Emails** (when an email service is added): plain layout on `cr-bg`, one column at most 600px wide, Inter with a system fallback, one accent button, the word list, and a footer saying why the person got it and how to stop. Plain-text version always.
- **Files people download** (Canvas grades, rosters, backups): named `cramming-<what>-<class>-<dayKey>.csv`, columns in sentence case, dates as `dayKey`. Today two downloads use older names (`exam-practice-progress-…`, `<class>-<exam>-students-…`); they change when their screens move.
- **Printed and PDF pages** (exam keys, Safe Exam Browser instructions): black text on white, Inter, the logo once at the top.
- **The browser tab:** the title is "<Page> · Cramming"; the icon is the Cramming mark on `cr-accent`.
- **Social and link previews:** the landing headline and the logo on `cr-band-bg`.
- **The screen inventory** on the whiteboard ("Cramming System Map") lists every screen, its template, and whether it's on the new look. Update it whenever a screen moves.

## Checklist for a new screen

1. Uses only `--cr-` tokens, kit parts, `format.js` for dates and numbers, and the icon set. `npm test` fails on a new colour, inline style, hand-formatted date or hand-drawn icon.
2. One primary button. Clear title. A real empty, loading and error state.
3. Works by keyboard, with visible focus and labels on every control.
4. Checked on a phone and a laptop, in light and dark mode, and axe shows nothing.
5. Nothing moves the page by itself; reduce motion is respected; motion follows DESIGN › Motion (Full and Soft), and the study buddy only appears at a moment from its table.
6. Every word read aloud once.
