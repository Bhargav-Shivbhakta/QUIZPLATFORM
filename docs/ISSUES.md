# Issues

Every problem found in Cramming, from anyone, newest first. Each issue stays here until it's fixed and the fix is tested, then moves to **Fixed** with the commit that fixed it.

For each issue: what happened, where (screen and steps), the cause once known, and the fix. Every fix adds a test or a flow check that would have caught it.

## Open

### I-2. A new practice set (Midterm 3) shows 300 questions from Midterm 2

- **Reported:** 17 November 2026, by the founder.
- **Where:** Professor › class › Practice. A practice set for Midterm 3 was created, and it shows the 300 questions of the Midterm 2 practice set.
- **Cause:** not yet known, because the code alone doesn't show it. Each set's questions are saved under its own ID (`classes/{class}/examFiles/{examId}`), and a new set's ID comes from its name, so two sets shouldn't share questions. Likely causes to check:
  1. The question file uploaded for Midterm 3 was the Midterm 2 file. The name box fills itself from the file's title, which hides the mix-up.
  2. Midterm 3 was made by renaming the Midterm 2 set. **Rename** changes only the name students see, not the questions.
  3. A stale copy of Midterm 2 is being shown.
- **Next:** repeat the exact steps on the local copy of the site. The founder to say how Midterm 3 was created (Add a practice set, or Rename) and which file was chosen.
- **Fix, whatever the cause:** before publishing, show which file was chosen and its first questions, and warn when a file matches another set in the class.

### I-1. Programming practice can't be created or uploaded where you'd expect

- **Reported:** 17 November 2026, by the founder.
- **Where:** Professor › class › Practice.
- **What happens:**
  1. **Add a practice set** only accepts a question file (.md). There's no way to start a practice set with only programming assignments (a .zip).
  2. Assignments can only be added to a set that already exists, using its **Add assignments** button.
  3. That opens a panel at the bottom of the page, below every set, so it reads as a separate menu.
  4. The panel has no button called "Upload". It has **Choose .zip** and **Choose a folder**, and a **Publish assignments** button that stays greyed out until every reference solution passes its tests. When the zip has no solutions, or a solution fails, it doesn't say clearly why Publish is unavailable.
- **Cause:** a design gap in `app/js/views/content.js`: the panel is drawn after the list (`data-panel`), and creating a set requires a .md.
- **Fix:**
  - One **Add a practice set** that accepts a question file, an assignments .zip, or both.
  - The panel opens directly under the button that opened it.
  - Plain labels: **Upload .zip**, then **Publish**.
  - A clear line saying what's stopping Publish.
  - A flow check that creates a programming-only set from start to finish.

## Fixed

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

