# Scale: built for 20 million students

Cramming is built on the free and cheap plans now and grows by paying more, not by rebuilding. That only works if every feature is designed for the largest size from the first day. This page holds the rules; the FC check (docs/FC.md, step 6) applies them to every feature before it is built. Decided by Bhargav, 20 November 2026.

- **The test:** `npm run scale` simulates 20 million students for one exam-week day and checks every read and write against the published limits. Results: docs/SCALE-REPORT.md.
- **Every feature:** docs/SCALE-FEATURES.md gives each feature on the system map its pattern and where it stands.

## The five scale rules

1. **The database location is chosen once.** Firestore's location can never be changed. Cramming's must be a multi-region US location (nam5) for the 99.999% uptime promise. Check it in the Firebase console before real student data goes in.
2. **No crowded records.** One record takes about one change a second. Every person writes only their own records; nothing that many people change at once is a single record (no shared counters, no class-wide lists that students write to).
3. **The exam rush.** Everyone starts at the same second. Starting is one small write to the student's own record, the security rules make fewer than 10 lookups, and no timestamp that changes on every save is indexed.
4. **Small reads only.** A page reads what it shows. Lists come in pages of 50 with search; totals come from a summary record or a count query, never by reading every record.
5. **Outside limits are arranged ahead.** Sign-in, AI and email companies cap each customer. Raising a cap takes a request and up to two weeks, so it is done before each large school starts.

## The sixteen patterns

Every feature follows one of these. Its rule is what the FC check asks.

| Pattern | What it means | The rule |
|---|---|---|
| Own records | A person's own progress, settings, plans | Reads and writes only that person's records; practice saves at most once every 30 minutes |
| Shared content | Notes, questions, practice sets, course pages | Staff write rarely, students read; read once a visit and kept on the device; long text in parts under 1 MiB |
| Public pages | The landing page and help pages | Files from the CDN, no database |
| On the device | Display, offline, accessibility, languages | No server work at all |
| Everyone at once | Timed exams, deadlines | One record per student per exam; no indexed timestamps that change on every save; Start spread over a few seconds; rule lookups under 10; the biggest sitting tested live |
| Class totals | Dashboards, statistics, gradebook, reports | Never read every student when a page opens: the server keeps a summary record per class and section; student lists in pages of 50 |
| Staff work on many students | Grading, releasing, term rollover | One record per student per item; changes to many students run on the server in batches of 400, with progress shown |
| People lists | Rosters, admin lists, permissions | One record per person; pages of 50; search; counts by count query |
| Many writers | Discussions, votes, bookings | Every post, reply, vote and booking is its own record; counts kept by the server or split counters; a booking takes its one slot in a transaction |
| Live moments | Polls, live view, live class | A live channel per room (Cloudflare Durable Objects) holds the moment; the database saves the result once |
| Files | Uploads, recordings, scans | Uploaded straight from the device to Cloud Storage with a size limit; the record holds only the link; processing queued |
| AI | Tutor, building, AI grading | Only through the AI gateway: each school's provider and budget, a queue and limits; no AI key ever in the page |
| Messages out | Emails, notifications, reminders | Queued and sent in batches; at most one digest a person a day; easy to turn off |
| Running code and checks | Code runs, similarity checks | On the device where possible (Java runs in the browser today); server runs in a queue with a cap per school |
| School systems | SSO, LTI, rosters and grades from the school | Synced in the background with retries; a page never waits on the school's system; their limits respected |
| Operations | Backups, monitoring, reviews | Done by process, not traffic: daily backups, error alerts, status page |

## What the test found (20 November 2026)

The full table is in docs/SCALE-REPORT.md. At 20 million students in an exam-week day: about 1.1 billion reads and 120 million writes, a busiest second of about 13,000 writes and 105,000 reads, and about 1.4 million people signed in at the busiest time. The database handles all of this. These need fixing:

| # | Problem | When it bites | Fix | Cost |
|---|---|---|---|---|
| F1 | Exam attempts index timestamps that change on every save (`beatAt`, `startedAt`, `submittedAt`). An indexed timestamp caps a collection at 500 writes a second | One exam of about 5,000 or more students starting together | Stop indexing those three fields (a database setting); keep `stateKey`, which the Live tab needs | Free |
| F2 | Everyone waiting on the countdown page reloads at the same second | Large exams | Spread the reload over 0 to 5 seconds | Free |
| F3 | The professor's dashboard reads every student's summary for every practice set | Classes over a few hundred: 150,000 records for a 5,000-student class | A summary record per class and section, kept up to date by the server | Small, in Phase 2 |
| F4 | Admin pages read every user, class and sign-in, and admin sign-in loads every class | A few thousand users | Pages of 50, search and count queries | Free, before the second school |
| F5 | A class roster is one record | Full at about 9,300 students (1 MiB) | One record per student before classes over 5,000 | Free, Phase 4 |
| F6 | GitHub Pages allows 100 GB a month and no commercial software (SaaS) | The first paying school | Move the same files to Cloudflare Pages or Workers static assets | Free |
| F7 | Firebase allows 100 new accounts an hour from one network address; a first lecture on campus Wi-Fi shares one | The first day of any large class | Ask Firebase to raise it two weeks before each school starts, or use the school's sign-in (SSO). Also confirm with Firebase the 18,000 token exchanges a minute | Free (a request) |
| F8 | AI companies limit requests per customer; the test peaks at about 25,000 a minute | Phase 3 and later | The AI gateway: each school's own provider, per-school budgets, higher limits arranged ahead | Built with the AI gateway |

The fixes are not made yet: they wait for Bhargav's approval, like every build.

## The live test

The simulation shows where the design breaks; it does not send traffic to Google. Sending 20 million real users costs real money and Google asks to be warned first, so the live test checks the busiest moment instead:

1. A separate Firebase project, "cramming-loadtest", on the pay-as-you-go plan, with the same security rules and the same location.
2. A script starts the biggest sitting for real: 5,000 test students press Start within 20 seconds, save every 2 minutes for 50 minutes and submit, from several cloud machines.
3. It records how long each start and save took, and any errors. Pass: every start under 1 second, no errors.
4. Cost: about 150,000 writes and 300,000 reads, under $1 for the database plus the cloud machines for an hour.

It runs before the first exam of over 1,000 students, and again before each larger one. Then the number goes up: 10,000, 20,000.

## Sources

- [Firestore quotas and limits](https://firebase.google.com/docs/firestore/quotas)
- [Firestore best practices (hotspots, 500 writes a second with an indexed timestamp)](https://firebase.google.com/docs/firestore/best-practices)
- [Firebase Authentication limits](https://firebase.google.com/docs/auth/limits)
- [GitHub Pages limits](https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits)
