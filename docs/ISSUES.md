# Issues

Every problem found in Cramming, from anyone, newest first. Each issue stays here until it's fixed and the fix is tested, then moves to **Fixed** with the commit that fixed it.

For each issue: what happened, where (screen and steps), the cause once known, and the fix. Every fix adds a test or a flow check that would have caught it.

## Open

### I-15. Question styles shown on the landing page that the app doesn't have yet

- **What:** the Subjects screen shows two question styles a visitor can try that educators can't make yet: balancing an equation with + and − buttons (chemistry), and naming the part of a diagram an arrow points to (biology, images from the educator's notes).
- **Decision (19 November 2026):** keep them on the page. Build them, with subject-specific question styles for every subject, when the educators' side is updated.

Found in the navigation audit (18 November 2026). None blocks students; each is fixed in the journey step that owns the screen.

### I-13. Negative words and "mistakes" in what people read

- **What:** the new rules (DESIGN › Words, D-35 and D-36) ask for whole, affirmative sentences and "attempts" / "to try again" instead of "mistakes". The landing page has about 35 negative words, and the student screens say "mistake(s)" 16 times ("Mistakes to fix", "Fix them", "My mistakes").
- **Fix:** the landing page screen by screen (from screen 2); the student screens with the Today's set deep dive.

### I-7. Words that break the word list on older screens

- **What:** "Quiz readiness" (7 places; the word is "readiness"), "Smart review" and "Random practice test" on the practice set page, and "programming assignment" (14), "Java program" (6) and "Coding assignments" for ungraded coding practice (the words are "coding assignment" for graded and "coding practice" for ungraded).
- **Where:** `exam.js`, `progress.js`, `home.js`, `assignments.js`, staff screens.
- **Fix:** with the practice journey step (practice set page) and the staff journeys.

### I-8. Breadcrumbs on 16 old screens

- **What:** staff pages and the old student pages still draw their own "crumbs" line. Students no longer see them (the frame's back link replaces them), but staff do, and the trail and the back link can disagree.
- **Fix:** each screen drops its crumbs when it moves onto the page header; staff get the frame's back link with their journeys.

### I-9. Error and loading wording isn't one pattern

- **What:** "Couldn't load…" (17), "Couldn't save…" (16), plus "Something went wrong", "Failed to fetch" and "Error:" in a few places; loading lines vary ("Loading…", "Loading the numbers for every class…"). Screens also check Firebase error codes 34 times.
- **Fix:** the kit's error and loading parts (DESIGN › Behaviour), with `cloud.js` turning errors into plain reasons.

### I-10. Classes whose course was guessed from their name

- **What:** a class saved without a Course field got the first word of its name as its course ("CS" for "CS 210 Data Structures", "Intro" for "Intro to Programming"), so titles read "Intro · Intro to Programming".
- **Fixed for new classes:** the admin form now takes "CS210" from a name like "CS 210 Data Structures". Existing classes are shown without the repeat (`classTitle()`) and their badges use the number from the name.
- **To do (founder, optional):** Admin › each class › fill in **Course** (for example CS150) for classes made without it.

## Fixed

### I-14. A new upload didn't show on the live site (fixed)

- **What:** after the 19 November upload, the live landing page still showed the old screens 2 and 3, although GitHub had the new files and the publish check had passed.
- **Cause:** GitHub Pages lets browsers keep each file for 10 minutes, and the file names never change, so browsers kept the old copies (and could mix old and new files).
- **Fix:** the build (`scripts/build.mjs`, `stampVersions`) adds a version tag made from the files' contents to every script, style sheet and import (`main.js?v=…`), so each release has new addresses and the page always loads its own matching files. The page itself (index.html) can still be kept for up to 10 minutes, which GitHub Pages doesn't let us change; a refresh shows the new one. Checked: every relative import in the built site is tagged, and the whole app runs with the tags.

### I-12. Pause motion on the landing page caused an error

- **Found:** 18 November 2026, while testing the new first screen.
- **What:** clicking **Pause motion** threw "lastT is not defined" (a leftover from an earlier version of the scroll code), so the button's label changed but the error reached the console and the error reporter.
- **Fixed:** 18 November 2026. The leftover line is gone; the browser check now clicks Pause motion and expects no errors.

### I-11. "Failed to execute 'add' on 'DOMTokenList'" when Motion is Soft

- **Reported:** 18 November 2026, by the founder (error message on screen).
- **What:** with **Motion: Soft** in Settings, opening a class's Study plan showed the error "The token provided ('go soft') contains HTML space characters" and the line didn't draw.
- **Cause:** `st-class.js` passed two class names as one ("go soft") to `classList.add`, which browsers refuse. Full motion passed one name, so the first tests (all on Full) missed it.
- **Fixed:** 18 November 2026. Each name is passed on its own. A new automated test fails on any class name with a space passed to `classList` anywhere in the app.
- **Tested:** the new test fails on the old line and passes on the fix; in the browser, Soft and Full both open the Study plan with no error.

### I-1. Programming practice can't be created or uploaded where you'd expect

- **Reported:** 17 November 2026, by the founder (with screenshots on 18 November).
- **What:** **Add a practice set** only accepted a question file (.md), so a coding-only set couldn't be made. Coding could only be added to a set that already had questions, from a panel below the whole list. Students then saw every set as a question set: flashcards, timed tests and Smart review, even when the set was meant for coding. The page also called practice "exam" (Delete exam).
- **Cause:** `app/js/views/content.js` built every set from a .md; the student pages (`exam.js`, `home.js`, `nextup.js`) assumed every set has questions.
- **Fixed:** 18 November 2026. **Add a practice set** asks first: **Questions** (a .md) or **Coding** (a .zip). A coding set needs only a name and the .zip; **Upload .zip** checks every reference solution, and a line under the panel says exactly what is stopping Publish. A set can have both kinds; **Add questions** and **Add coding** add the other kind, and **Remove questions** turns a mixed set into coding practice. Students open a coding set straight onto its assignments, with no flashcards, practice tests or "quiz readiness"; its card says "Coding practice: 50 programming assignments" and Next up points to the next assignment. Practice is no longer called "exam" on the page. The coding upload moved into `views/content-coding.js`.
- **Tested:** on the local copy with the fake Firebase: a professor made a coding-only set and a questions set, added coding to the second, removed its questions; a .zip given to the questions panel is refused with a clear message; a student saw both as coding practice and no flashcards link.

### I-2. A new practice set (Midterm 3) shows 300 questions from Midterm 2

- **Reported:** 17 November 2026, by the founder.
- **Cause:** found with I-1. A coding-only set couldn't be created, so Midterm 3 Practice was created with a question file (Midterm 2's, 300 questions in 11 topics) and the 50 coding assignments were added to it.
- **Fixed:** 18 November 2026, with I-1. **To do once the upload is live (founder):** Professor › CS 150 › Practice › Midterm 3 Practice › **Remove questions**. The 50 coding assignments stay; students' code is kept.

### I-6. The site stays blank on some Macs (older Safari), including during an exam

- **Found:** 18 November 2026, by the founder: on some MacBooks in Safari, www.cramming.net showed only a dark, empty screen, also while a test was running.
- **What:** nothing loaded at all on Safari older than 16.4 (Macs that haven't been updated since early 2023, or can't be). Safe Exam Browser on those Macs uses the same engine, so exams were hit too. Chrome and current Safari were fine.
- **Cause:** two lines in `app/js/render.js` (the formatting for maths) used a regex "lookbehind", added in the 17 November upload. Older Safari can't read that, so it rejects the whole file. Every page loads that file, so the site never started and stayed on its empty loading screen.
- **Fixed:** 18 November 2026. Both lines rewritten without lookbehind; 400,000 random inputs give exactly the same result as before. If the site ever can't start in a browser again, it now says so in plain words ("This browser can't open Cramming…", with how to update Safari and a line for Safe Exam Browser) instead of a blank screen. `npm test` now fails on code that Safari 15 can't run (lookbehind, static blocks, the regex v flag, `.at()`, `findLast`, `structuredClone` and similar); shown to catch the old lines on the live code.
- **Still to check:** a Mac with Safari 15 or 16.0–16.3, after upload. Students on Macs older than that (macOS Mojave and earlier, Safari 14) may still have problems; a current Chrome works there.

### I-5. Landing page: tilted product, off-centre line, page jumping in the practice question

- **Found:** 17 November 2026, by the founder.
- **What:** the product picture at the top was tilted in 3D while scrolling; "Cramming fixes all three…" sat left of centre; answering the practice question jumped the page down to "Try again".
- **Cause:** a scroll-linked tilt; a general `.lp p { margin: 0 }` rule beat the centring rule; focus was moved to the "Try again" button, and the browser scrolls to whatever gets focus.
- **Fixed:** 17 November 2026. The tilt is removed (the picture stays flat); the centring rule is now specific enough; focus moves without scrolling, and "Try again" keeps the question where it was on screen. Checked at 1332×800 dark, 1920×1080 light and 390×844 dark: page doesn't move on answer or retry, the line is centred to the pixel.

### I-4. Request access could be flooded by a script

- **Found:** 17 November 2026, by the independent review of the new request rules.
- **Where:** `accessRequests` in `firestore.rules`. Anyone may create a request without signing in. The hidden form field stops simple bots, but a script can write to Firestore directly and create any number of requests (each under about 4 KB). The email in a request isn't verified.
- **Risk now:** low. The page is new and not advertised; a flood would cost free-tier writes and clutter Admin › Access requests, not expose data.
- **Fix:** turn on Firebase App Check (reCAPTCHA) for Firestore, or send requests through the Cloudflare Worker with a limit per address. Treat every email as unverified until we reply. Do it before the site is promoted.
- **Fixed:** 17 November 2026. Visitors can no longer write requests to Firestore at all. Requests go through the connector (`connector/access.mjs`), which checks every field and allows 3 a day per network (IPv6 counted by its /64), 2 a day per email, and 40 a day for the whole site. Addresses and emails are kept only as keyed hashes inside one day's counter. Tested by 4 unit tests and a browser check of the "too many" message; reviewed independently.
- **Still open, small:** one person on many networks could use up the 40 a day; Cloudflare Turnstile on step 1 would stop that. Old daily counters aren't deleted yet (a Firestore TTL policy would). Set `contactEmail` so the "too many" message offers an email.

### I-3. Landing page on large screens: capital-letter labels, jerky scrolling, phone covering a card

- **Reported:** 17 November 2026, by the founder, from the live site on a large screen in dark mode.
- **Causes:**
  - Landing class names (`eyebrow`, `lead`, `row`, `bar`, `dot`, `ring`, `small`, `center`) were also used by the app's own styles, so app rules (such as capital letters) leaked in.
  - Two motions fought over the same cards: a scroll drift and the reveal.
  - A large blurred glow was redrawn on every scroll frame.
  - The phone was placed over the window's edge.
- **Fix:** every landing class now starts with `lp-`. The scroll drift is removed; there's one reveal (shorter and lighter), and the hero tilt is applied directly to the element. The glow is static, with no blur filter. The phone sits outside the window and shows only on screens 1640px or wider. On wide screens the page grows to 1200px.
- **Tested:** 1280, 1366, 1440 (dark), 1920 and 2548 wide, plus a phone. Nothing scrolls sideways, all 37 reveals run, axe is clean, the phone never overlaps the window, and the frame times stayed smooth while scrolling.

