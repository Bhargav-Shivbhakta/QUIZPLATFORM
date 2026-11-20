# Changelog

One entry for every upload to the live site, newest first. Each entry says what changed for people and how it was tested. Uploads made before this file existed weren't recorded.

## 20 November 2026: pages fill the screen

- **Wide pages get more columns, not wider cards.** Stretching the cards only moved the empty space inside them, so each page now adds columns as it gets wider and every card stays close to the size of what's in it. The pages measure their own width, so this works with the big-monitor zoom.
  - **Today:** the hero, This week and Coming up sit in three columns.
  - **Ready:** two columns.
  - **Graded work:** Coming up, Done and the side cards sit side by side.
- **Student pages** now fill the space beside the bar, starting right next to it, instead of a 1120 px column centred with empty strips on both sides. They stop at 1760 px. The side column on Graded work grows with the page (320 to 420 px).
- **Staff and practice pages** widen from 1100 to 1480 px, and the practice screen from 1180 to 1480 px. Reading pages keep their narrow column.
- **Today › Coming up:** a space now separates the title from the course ("Midterm 2 CS150", not "Midterm 2CS150").
- **Tested:** rendered at 2560 × 1267, 2196 × 1270, 1440 × 900 and 390 × 844 with no sideways scroll or script errors.

## 20 November 2026 (exam day): exam integrity, exit code, two sittings, question picking, coding screen, admin access

Built for Midterm 3 (Friday sitting at 11:15 AM, then each section's regular day). Two parts need **the new `firestore.rules` published** before they work for students: the exit code and the two-sittings rule.

- **Can't start until the device is ready:** a second screen, a virtual machine, a writing or AI helper on the page (Grammarly, LanguageTool, QuillBot, Monica, Sider and others), a phone (when not allowed) or a missing Safe Exam Browser stops the start. Each is checked when the page opens, on "Check again", when a screen is plugged in, and again at the moment Start is pressed. The message tells students how to fix it (for helpers: a private window, where add-ons are off).
- **During the exam (reported, never ends it):** a helper appearing, a second screen being connected, or code dropped into the editor. Each shows in the live view's Device column and in the student's timeline.
- **Possible virtual machines are flagged for the professor:** weaker signs that fit a VM or a remote-controlled browser are shown in the live view's Device column as "Check this device: …". They never block a student, because each also fits some real computers. The signs: a browser driven by a program, no graphics chip, 2 or fewer processor cores, 2 GB or less memory, a typical VM screen size (800 × 600, 1024 × 768, 1152 × 864). A clear VM graphics name still blocks the start.
- **Code can only be typed:** the exam's code editor refuses any change that adds more than 3 letters or symbols at once (a paste that got through, an AI helper, a script). Undo, redo, Alt+arrow line moves, copying a line (Shift+Alt+arrow), auto-indent, closing brackets and Reset still work. Grammarly, LanguageTool, spell-check and writing suggestions are turned off on every exam input.
- **Exit code:** on the Live tab, the professor turns on "Ask for an exit code after finishing" and shows it on the projector near the end. After submitting (or when time runs out, or the exam ends), the student types it, up to 30 minutes after the exam closes for them (or 30 minutes after they finished, if that is later). Their answers count either way. If their submission never reached the server, they're told to tell the professor instead of "wrong code". Anyone without it is marked **No exit code** in red in Live, in Results and in the CSV, so a leaked access code alone isn't enough. The code is staff-only; the security rules check it. "Let back in" clears it, so the student enters it again after finishing.
- **Two sittings:** in an exam's Settings › Rules, "Two sittings?" picks the other sitting. A student who started that one can't start this one; the screen tells them their earlier sitting is the one that counts. The security rules check it too.
- **Rolling over between the two sittings:**
  - On the regular exam, students who took the Friday sitting show as "Took Midterm 3 (Friday)", not "Not started" or "Absent", with their own filter card.
  - On the Friday exam, once it closes, students who didn't take it show as "Rolled over to <the regular exam>", not "Didn't take it".
  - Students who took Friday no longer see the regular sitting on their class page or Today.
  - Students who missed Friday are told, on the Friday exam's page, that they take it at their section's time.
- **Pick the questions on the paper:** the exam editor has a Give tick box for each question. Upload 10, tick 3. Only ticked questions reach students and count in the total; unticked ones stay in the staff-only answer key for later. Locked once anyone has started.
- **Coding exam screen:**
  - The question list folds to a slim strip of numbers.
  - "Hide problem" gives the code the whole width.
  - The line between problem and code can be dragged (or moved with the arrow keys).
  - The code box resizes from its bottom corner.
  - The code side scrolls on its own, and Run brings the output and any errors into view.
  - These choices are remembered on the device.
- **Admins:** with the new bar on, an admin sees every class under "All classes", with Build and Class settings in each.
- **Professor pages:** a class with no practice sets now still opens Students, Graded work and Announcements (it used to show only "This class has no exams yet"). Graded work in the bar opens the class's graded-work list. The class picker hides when the bar shows the classes.
- **Fixed before release:** an error that would have stopped every exam's start page ("Cannot access 'checksHtml' before initialization"), found in the browser test.
- **Tested:**
  - Automated: 78 tests (3 new: virtual-machine names, typed versus dropped-in code, event names) and the architecture check pass.
  - In the browser: a student with Grammarly and a second screen can't start (even when Start is forced); typing works and a tool's insert is refused; a wrong exit code is refused and the right one accepted; ticking 4 of 5 questions saves 4 with the 5th in the key; the two-sittings choice and the exit-code setting survive a save; fold, drag, hide and Run work; admin and professor pages render in the new bar.
  - Reviewed independently: no blockers. Fixed from the review:
    - "Check again" now clears a second screen once it's unplugged.
    - Copying a line is allowed.
    - The exit-code window runs to the exam's close.
    - A submission that didn't arrive gets its own message.
    - The graphics check runs once.
    - Saving an exam keeps its exit-code setting.
    - Changing the access code offline can't wipe the exit code.
  - Known limit: Grammarly and LanguageTool may mark every page while installed, so students who have them should open the exam in a private window (the message says so).

## 20 November 2026: the new bar for professors and admins, as a trial (off by default)

- **Settings › Navigation (trial):** professors, TAs and admins can tick "Try the new left bar". It's saved in that browser only and is off until ticked, so nobody's screens change on upload. Unticking it brings the old top bar back.
- **The bar for staff:** Today, then "Teaching" (your classes), then Admin for site admins (Platform overview, Access requests, Classes and rosters). Opening a class slides to its sections, and each opens the screen that does that job today:
  - Overview: Class progress
  - Build: Build my course
  - Practice: practice sets
  - Graded work: graded work and the live view
  - Insights: exam scores
  - People: students
  - Class settings: edit class, admins only
  TAs don't see Build. Staff screens keep their own breadcrumbs. Phones get Today, Teaching, Admin and Settings as tabs.
- **Exams are safe:** taking an exam, the live view and every exam rule are untouched. The new bar hides on full-screen pages, as it does for students.
- **Big-monitor zoom is now off on exam, practice and coding screens**, so code editors and timers behave exactly as before at every screen size.
- **Tested:** 75 tests and the architecture check pass. Rendered as an instructor and admin with the trial on and off, and checked that the exam and practice screens have no zoom at 2560 px.

## 20 November 2026: Graded work uses the screen

- **Class pages:** the heading is now the class's own name ("Introductory Computer Programming"), with the code, term and section in the small line above it ("CS 150 · Fall 2026 · Section 02"). It used to repeat the code and read "Section Section 02".
- **Graded work:** on screens 1100 px and wider, the lists sit beside two cards instead of leaving half the screen empty:
  - **At a glance:** how many are open now, coming up, done and scored, how many are still being graded, and what's next.
  - **How graded work works:** one attempt, timed (the clock keeps going if you leave), full screen.
  On phones the two cards follow the lists.
- **Tested:** rendered at 2196 × 1270, 1440 × 900 and 390 × 844 with no sideways scroll or script errors. 75 tests and the architecture check pass.

## 20 November 2026: big monitors and clean class names

- **Big monitors:** the app now grows with the screen instead of staying laptop-sized in the middle. From 1700 px wide everything (the bar, text, cards, buttons) scales up: 1.12× at 1700 px, 1.25× at 2000, 1.4× at 2400 (a 1440p monitor) and 1.75× at 3200 (a 4K monitor without scaling). Laptops don't change. The landing, sign-in and policy pages already scale with the screen, so they're left alone. Full-screen layouts (practice, the coding screen, exam editors, dialogs) still fit exactly, and tooltips, the calculator drag, the Dot's hop and the heart are measured correctly at every scale.
- **Class names in the bar:** the course code and section are taken off the front, because the code already shows on the right. "CS150 (Introductory Computer Programming)" shows as "Introductory Computer Programming", and "CS160-01:Intermediate Computer Programming" shows as "Intermediate Computer Programming".
- **Tested:** rendered at 2560 × 1267, 1920 × 1080 and 1440 × 900 with no extra scrolling and no script errors. 75 tests and the architecture check pass.

## 20 November 2026: the last screen matches the first

- **Landing, last screen:** "Bring Cramming to your class." now sits at the same scale as the opening screen instead of reading like a footer. The logo, the headline (up to 116 px), the lead and the button are larger, and "Small reps. Top grades.™" is in the brand blue, like the opening tagline.
- **Tested:** fits on one screen with no sideways scroll at 1440 × 900, 1280 × 720, 1024 × 640, 768 × 1024, 390 × 844 and 360 × 640. 75 tests and the architecture check pass.

## 19 November 2026: the new student bar

- **One bar, three parts (DESIGN › Navigation).** The logo stays at the top, your name stays at the bottom, and only the middle moves. It shows Today and your classes; open a class and it slides over to that class's card and its four sections: Ready, Learn, Practice and Graded work.
- **The logo goes back.** One click inside a class slides back to your classes; anywhere else it opens Today. A double click refreshes, at most once a minute, as before.
- **Switch class from the class card.** Click the card at the top of a class to see your other classes under "Switch to".
- **Your name opens Me.** It now opens a panel over a blurred page with My progress, Settings and Sign out. Nothing behind it works until you close it (Close, Escape or a click outside), and focus goes back to your name.
- **Collapse.** The round handle on the bar's edge, or ⌘ + \ (Ctrl + \ on Windows), shrinks it to a rail of icons and remembers your choice. In the rail each class shows its subject over its number ("CS" over "150"), so MATH 150 and CS 150 never look alike. Tablets always get the rail.
- **Class pages:** the tabs are renamed to match the bar (Study plan → Ready, Notes → Learn), in the bar's order. On laptops and tablets they live only in the bar; phones still show them at the top of the page. "Practise" is now spelled "Practice" everywhere a student sees it.
- **Not shown yet:** Search, Inbox, Calendar and Grades are planned for this bar and stay hidden until they work. Progress and Settings moved from the bar into Me. Phones keep their bottom tabs for now.
- **Tested:** 75 tests and the architecture check pass. Rendered at 1440, 900 and 390 wide with the switcher open, the bar collapsed, back from a class, and Me open; no script errors.

## 19 November 2026: clearer words, a real chemistry question, the Dot at the door

- **Screen 1:** the lead now ends "so they go into the exam prepared" (it said "walk into the exam feeling ready", which not every student does).
- **Screen 3:** the third point now says "every student, even in a large lecture, gets a plan of their own", so small classes are included too.
- **Subjects:** the line under the heading is now "Code that runs, equations to balance, diagrams to label. Each subject gets questions in its own form." (it promised that anything works). A small bold line, "Pick a subject and try a question.", sits above the subject buttons.
- **Chemistry:** the balancing question (high-school level, and its counters didn't say whether it was balanced) is replaced by a titration curve: acetic acid titrated with sodium hydroxide, three marked points, "At which point does the pH equal the pKa?". The curve is calculated from the chemistry (25 mL of 0.10 M acetic acid, pKa 4.76, 0.10 M NaOH): A ≈ 2.9, B = 4.76, C ≈ 8.7. Each wrong point explains why.
- **Psychology:** the timing now agrees. The question says the test is a week later, and the chart had labelled the second group "Night before", stretched across two days. The groups are now Spaced (20 minutes, Monday to Friday) and Massed (100 minutes on Friday), with the same test a week later. The second option is now "The score on the test".
- **Privacy and access:** the Dot now checks who comes in at a locked door, instead of standing still (DESIGN › the Dot: "At the door").
- **And more (Subjects):** the history card now shows that written answers are graded by hand: "Graded by hand" in its tag, "Grade it yourself, out of 5.", and on grading, which answers grade themselves and that students see the grade on release.
- **Class dashboard:** the line under "See what to reteach, early." is now a whole sentence: "See which questions your class finds hardest and who is yet to start, so you can reteach a concept in the next lecture, well before the midterm."
- **For educators:** "Works with Claude or ChatGPT, on your own account" (Gemini's custom connectors aren't open to most accounts yet).
- **Questions educators ask** (was "Questions professors ask"), every answer checked against the app: no promise that the AI is free on every plan; Cramming builds the notes, practice and quizzes; preview as a student; "Does it work with our learning platform?" replaces the Canvas-only question; student data names everyone who can read it (including the school's Cramming admins) and says university storage is on the roadmap; courses list the question types that exist today (no equation tools yet), with Java now and Python, JavaScript, SQL and C++ on the way.
- **The end:** the tagline, "Small reps. Top grades.™", now returns as a quiet line above "Bring Cramming to your class.", and the lead is shorter: "We're setting up a few courses by hand this term."
- **Sign-in page centred again.** The landing page's one-screen rule (`.lp > section` stacks its content in a column) had pushed the sign-in card to the left on wide windows; `.lp > section.lp-signin` centres it. Its note now says "your educator".
- **Professors' live exam table fixed.** Its rows had broken into wrapping pieces: the table used the class names `st-row` and `st-pill`, which the new student screens (student.css, loaded after app.css) also use, for a wrapping flex row and a coloured pill. The table now uses its own names (`live-row`, `live-pill`, `lv-*`). The status no longer doubles up ("Ended: Ended by the professor" is now "Ended by staff"). Lesson: `st-` names belong to the student screens only.
- Tested: every card and the scene at 1440×900 and on a phone (no overlapping words), each answer right and wrong, the paused still. Full check of the whole page at 390×844, 820×1180, 1275×696, 1440×900, 1536×864 and 1920×1080, light and dark: every screen fits, no sideways scroll or clipped text, no script errors, axe clean; one swipe per screen down all 13 screens, back up, and paused. The sign-in page at 1800 wide and the live table rendered with the real stylesheets. 75 tests pass.

## 19 November 2026: room to read the explanation

- **The practice explanation can be read in full.** After an answer, the explanation makes the practice screen taller than the window. Scrolling down now moves through it normally and stops at the end of the screen (Try again in view), even with a strong swipe; the next swipe moves on to the next screen. Scrolling up stops at the question the same way. Every other screen still moves one swipe, one screen. Tested at 1440×900 and 1275×696 with a gentle swipe, a strong swipe, mouse-wheel notches, scrolling back up and Try again.

## 19 November 2026: one swipe, one screen; Try again stays put; a meaningful pause; stronger subject questions

- **One swipe moves exactly one screen.** A trackpad swipe keeps sending momentum for a second or more, and an uneven tail was being read as a second swipe, so the page moved two screens. A second screen now needs a second swipe: the first must die down and the deltas pick up again, or there must be a short pause. A spinning mouse wheel also moves one screen per spin. Tested with realistic swipes (a build-up and a long, uneven tail), two swipes close together, a spinning wheel and a single notch.
- **Try again on the practice question stays on the question.** Its glide back up and the paging were separate, so the small scroll a trackpad click makes counted as a swipe and moved on to the next screen. Every glide on the page (the header links, Try again, paging) now goes through one place (`glideTo` in `views/lp-paging.js`), and nothing else starts while one is running.
- **Pause motion shows a meaningful still.** Paused, screen 3's plant shows the full week in bloom, the For students plan shows one task done, and Build my course shows the course ready (before, they froze wherever they were: a bare sprout, 0%, nothing ticked). Screens still move one at a time while paused, instantly instead of gliding.
- **Stronger subject questions,** at the level a university course sets:
  - Mathematics: the area under one arch of sin x (2), drawn and shaded.
  - Physics: how high a 2 kg block sliding at 3 m/s rises up a frictionless ramp (h = v² ÷ 2g ≈ 0.46 m; the mass cancels).
  - Chemistry: balance the combustion of propane, C₃H₈ + 5O₂ → 3CO₂ + 4H₂O, with live carbon, hydrogen and oxygen counts.
  - Psychology: research methods: the independent variable in a spacing study.
  - Engineering: two resistors in parallel (4 Ω and 12 Ω across 12 V: 4 A), with current flowing through both branches.
  - Business: the current ratio from a balance sheet (90 ÷ 60 = 1.5).
  - Every wrong option names the real slip (for example, 12 ÷ 16 treats the resistors as if in series).

## 19 November 2026: one type scale, quicker paging, and every screen fits

- **One type scale on every screen:** every screen's heading is the same size (up to 68 px, scaling with the window), every lead line the same (up to 20 px), every point title 18 px and every point 16 px. Before, sizes drifted from screen to screen (Privacy and Graded exams had become smaller).
- **Every screen fits one window** at 1275 × 696, 1280 × 800, 1440 × 900, 1536 × 864 and 1920 × 1080: on short windows the cards scale a little, and the side-by-side screens keep tighter padding.
- **Quicker paging:** the glide between screens now starts fast and lands softly (about 0.6 s, was about 0.7 s plus a pause). A new swipe is recognised at once, even mid-glide, and the next screen follows straight after; the arrow, Page and space keys page too (not while typing, and space still presses buttons).
- **Graded exams:** "Straight to Canvas" is now "Straight to your gradebook: scores export as a spreadsheet your learning platform imports, with a ready-made file for Canvas."
- **Words:** the course tutor's line is shorter ("Students connect the AI they already use. It reads only the units the educator has opened, and pauses during quizzes and exams."), the class dashboard heading is "See what to reteach, early.", and the practice line says "each attempt" instead of "a mistake".
- **Tested:** all automated tests; paging timed in the browser (single swipes, two quick swipes, one wheel notch, keys); every screen measured at the five sizes above.

## 19 November 2026: exams and privacy side by side, and a clearer story order

- **New order:** opening → the challenge → how Cramming helps → for students → practice → for educators → subjects → course tutor and class dashboard → graded exams → the science (spaced review) → privacy and access → questions → the end. Students first, then educators, then why it works and why it is safe.
- **Graded exams** is side by side: the words and four short points on the left; on the right, the live exam view an educator watches during a midterm: the access code for the projector, the time left counting down, how many are working, submitted or yet to begin, a student who left the exam window once, and a student with 15 minutes of extra time. It plays while on screen and holds still with reduced motion or Pause motion. (`views/lp-live.js`)
- **Privacy and access** is side by side, with the Dot standing guard on the right: a shield in hand and a padlock that clicks shut.
- **Words:** "educator" throughout both screens, and "Student work stays private" in place of "No student work in AI".
- Spaced review's eyebrow is now "The science · Spaced review".
- New ISSUES entry I-15: the chemistry balancing buttons and the biology diagram question on the Subjects screen get built, with question styles for every subject, when the educators' side is updated.
- **Tested:** all automated tests; both screens in light and dark, at laptop, small laptop and phone sizes; each fits one window on laptops; no errors.

## 19 November 2026: the Subjects screen, a question to try for every subject

- **Subjects is now side by side and interactive.** Left: the heading, one line and the subjects as buttons. Right: a question made for the chosen subject, drawn the way an educator's own notes would appear, which a visitor can answer:
  - Computer science: fill the blank in a Java loop, then run four tests; a failing test says what it gave and what it expected.
  - Mathematics: evaluate an integral, typed as a number, with the area drawn under y = 3x²; the area and the working appear.
  - Statistics: a dot plot with an outlier; which measure barely moves (the mean and median then appear on the plot).
  - Physics: the kinetic energy of a rolling ball (the 6 J slip is named as the momentum).
  - Chemistry: balance 2H₂ + O₂ → 2H₂O with plus and minus buttons; the atom counts update live.
  - Biology: a labelled-diagram question: an arrow points at a part of a cell (mitochondrion, then nucleus, then Golgi), choose its name from three.
  - Economics: a price ceiling on a supply and demand graph; the shortage appears.
  - Psychology: true or false on the spacing effect, with the same total time drawn both ways (5 × 20 min, or 100 min the night before).
  - Engineering: Ohm's law on a drawn circuit; current flows once answered.
  - Business: select all the current assets.
  - And more: a written answer the visitor marks out of 5, as educators and TAs do (rubrics come in phase 2, so none is shown).
- Wrong answers say "Almost." and explain; every question has Try again. The four old points under the subjects are gone: each question now shows its own type.
- New file `app/js/views/lp-subjects.js` (an illustration file, like `lp-scenes.js`, so its drawings are on the drawn-icons skip list).
- **Checked for accuracy:** every answer, number, diagram and explanation checked (the median and mean of the dot plot, the equilibrium and shortage on the graph, conventional current direction, the parts of the cell, the WWI dates).
- **Tested:** all automated tests; each subject answered in the browser, in light and dark at laptop, small laptop and phone sizes; the screen fits one window on laptops; no errors.

## 19 November 2026: one screen per scroll, and uploads always load whole

- **Uploads always load whole.** Every file the site loads now carries a version tag that changes with each release. Once a browser has the new page, it fetches all the new files together, never a mix of old and new. The page itself can still be up to 10 minutes old after an upload (GitHub's limit); a refresh shows it at once. See I-14.
- **One small scroll, one screen:** a light trackpad swipe or one turn of the wheel glides to the next screen, and screens settle into place under the header. Long screens scroll normally to their end first. The header's links glide smoothly to their screens.
- **A reading zone before the blur:** the screen you're leaving stays sharp until it is mostly scrolled away, then blurs.
- **The opening fills large screens:** the name, tagline and line scale with the window's height and sit at the optical centre, so there are no empty bands above and below.
- **Header:** more room between the links, and Request access set apart from Sign in.
- **Screen 3:** the Dot now waters a little plant under the "This week" card (the card sits on top). Each watering ticks a day and grows a leaf; on the seventh day, about 5 seconds in, the plant blooms with an "A" at its heart.
- **Screen 4, For students:** new heading "A clear plan for every student, every day." with no line under it; the paragraphs are replaced by one line of three ticks (From the educator's own materials · Planned for each student · About 15 minutes a day). The preview's plan is now about 15 minutes (3 + 3 + 9), Ms. Harper's note says "Friday's quiz", and the whole screen fits one window. The browser window keeps its full size; the phone (the same simple design as before, a little smaller) now overlaps the window's right edge on laptops and larger screens (before, only on very wide screens), and hides below 1240 px wide where it would run off the screen.
- **New order after the practice question:** For professors (your materials in, a complete course out) now comes straight after the practice question, then one side-by-side screen pairing the students' AI tutor with the professors' class dashboard, then Spaced review (now side by side: words left, the memory curve right).
- **Words on screens 6 to 8:** "For educators" instead of "For professors". Screen 6 now reads "Cramming makes notes, practice and quizzes for every unit, checks every answer key twice, then waits for your review. Students see it once you publish." Screen 7: "Help that stays inside the course." (course tutor) beside "See what to reteach, weeks before the exam." (class dashboard, now showing how many answered correctly); the tutor's reply is affirmative ("this one is yours"). Screen 8: "When a question needs another try, its gaps start again."
- **Removed "How it starts"** (three steps): the For educators screen already shows the steps.
- **Small laptops:** screens 6 and 7 now fit one window.
- **Try again** on the practice question now glides back up to the question, instead of leaving the reader near the next screen.
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
