// The scale test: simulates 20 million students using Cramming for one exam-week day and checks
// every way the app touches the database against Firestore's, Firebase Auth's and the host's
// published limits. Run: npm run scale   (or: node scripts/scale.mjs --students 5000000)
//
// What it is: every one of the students is simulated (their time zone, whether they study today,
// when, how many saves, whether they sit an exam and when they press Start), and every read and
// write is counted second by second, as the app's code actually makes them (cloud.js, take.js).
// What it is not: it does not send traffic to Google. It shows where the design would break; the
// live test (docs/SCALE.md, "The live test") confirms the busiest moment against a real database.
//
// Writes docs/SCALE-REPORT.md.

import { writeFileSync } from 'node:fs';

const arg = (name, dflt) => { const i = process.argv.indexOf('--' + name); return i > 0 ? Number(process.argv[i + 1]) : dflt; };

// ---- The population (planning guesses, all in one place) ----
const P = {
  students: arg('students', 20_000_000),
  classesPerStudent: 5,
  avgClassSize: 60,
  biggestClass: arg('biggest', 5000),           // the largest single lecture we plan for
  activeToday: 0.5,                              // share of students who open Cramming on a given day
  sessionsPerActive: 1.6,
  examToday: 0.12,                               // exam week: share of students sitting a timed exam today
  examMinutes: 50,
  aiPerActive: 1.5,                              // AI requests per active student a day
  emailsPerStudentDay: 0.7,                      // reminders (Phase 3)
  zones: [ // US-weighted, as in our launch plan
    { name: 'Eastern', utc: -5, share: 0.47 }, { name: 'Central', utc: -6, share: 0.29 },
    { name: 'Mountain', utc: -7, share: 0.07 }, { name: 'Pacific', utc: -8, share: 0.17 },
  ],
  // When students study, by local hour (0-23): evenings are the busiest
  studyCurve: [1, .5, .3, .1, .1, .1, .3, .8, 1.5, 2, 2.2, 2.4, 2.6, 2.8, 3, 3.2, 3.5, 4, 4.5, 5.5, 6.5, 6.5, 5, 3],
  // When timed exams start, by local hour
  examStarts: { 8: .15, 9: .2, 10: .15, 11: .15, 12: .05, 13: .1, 14: .1, 15: .05, 16: .03, 18: .02 },
};

// ---- What the app does, per action (from the code, November 2026) ----
const A = {
  open: { reads: 2 + 5 * (1 + 8) },                // admins + enrollment, then each class and its exam list (cloud.js load)
  content: { reads: 3 },                           // practice sets opened per session (examFiles)
  practiceSave: { writes: 2, per: 1 },             // own progress + own class summary; at most one per 30 minutes (GAP_MS)
  examStart: { writes: 1, reads: 2 + 6 },          // start + read back, and about 6 lookups in the security rules (startOk)
  examSave: { writes: 1, reads: 3, every: 120 },   // every 2 minutes (SAVE_EVERY), rules lookups
  examSubmit: { writes: 1, reads: 3 },
};

// ---- Published limits (sources in docs/SCALE.md) ----
const L = {
  docMiB: 1_048_576,
  monotonicIndexWritesPerSec: 500,  // a collection with a sequentially increasing indexed field
  rulesLookups: 10,                 // get()/exists() per single-document request
  accountsPerIpHour: 100,           // Firebase Auth: new accounts per IP address per hour
  tokenExchangesPerMin: 18_000,     // Firebase Auth: per project
  pagesBandwidthGB: 100,            // GitHub Pages soft limit per month
};

// ---- A repeatable random source ----
let seed = 20261120;
const rnd = () => { seed |= 0; seed = (seed + 0x6D2B79F5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
const pick = (weights) => { const tot = weights.reduce((s, w) => s + w, 0); let r = rnd() * tot; for (let i = 0; i < weights.length; i++) { r -= weights[i]; if (r <= 0) return i; } return weights.length - 1; };
const poisson = (mean) => { let k = 0, p = Math.exp(-mean), s = p; const u = rnd(); while (u > s && k < 50) { k++; p *= mean / k; s += p; } return k; };

// ---- Simulate every student, second by second (one UTC day) ----
const DAY = 86400;
const reads = new Float64Array(DAY), writes = new Float64Array(DAY), opens = new Float64Array(DAY), ai = new Float64Array(DAY);
const zoneW = P.zones.map((z) => z.share);
const examHours = Object.keys(P.examStarts).map(Number), examW = Object.values(P.examStarts);
const add = (arr, t, n) => { arr[((Math.floor(t) % DAY) + DAY) % DAY] += n; };
// When a waiting student presses Start after the exam opens: the countdown page reloads at the
// opening second (take.js), and they read the rules first: 3 to 25 seconds; latecomers trickle in.
const startDelay = () => (rnd() < 0.7 ? 3 + rnd() * 22 : 25 + -Math.log(1 - rnd()) * 90);

const t0 = Date.now();
let activeN = 0, examN = 0, saves = 0;
for (let s = 0; s < P.students; s++) {
  const z = P.zones[pick(zoneW)];
  const offset = -z.utc * 3600;                       // local hour h happens at UTC second h*3600 + offset
  if (rnd() < P.activeToday) {
    activeN++;
    const sessions = Math.max(1, poisson(P.sessionsPerActive));
    for (let k = 0; k < sessions; k++) {
      const t = pick(P.studyCurve) * 3600 + rnd() * 3600 + offset;
      add(opens, t, 1); add(reads, t, A.open.reads + A.content.reads);
      const minutes = 10 + -Math.log(1 - rnd()) * 25;
      const n = Math.min(1 + Math.floor(minutes / 30), 3);   // at most one save every 30 minutes
      for (let j = 0; j < n; j++) { add(writes, t + 60 + j * 1800, A.practiceSave.writes); saves++; }
    }
    const nAi = poisson(P.aiPerActive);
    for (let j = 0; j < nAi; j++) add(ai, pick(P.studyCurve) * 3600 + rnd() * 3600 + offset, 1);
  }
  if (rnd() < P.examToday) {
    examN++;
    const start = examHours[pick(examW)] * 3600 + offset + startDelay();
    add(writes, start, A.examStart.writes); add(reads, start, A.examStart.reads);
    for (let k = A.examSave.every; k < P.examMinutes * 60; k += A.examSave.every) { const ts = start + k + rnd() * 5; add(writes, ts, A.examSave.writes); add(reads, ts, A.examSave.reads); }
    add(writes, start + P.examMinutes * 60, A.examSubmit.writes); add(reads, start + P.examMinutes * 60, A.examSubmit.reads);
  }
}
const simSeconds = (Date.now() - t0) / 1000;

const peak = (arr) => { let m = 0, at = 0; arr.forEach((v, i) => { if (v > m) { m = v; at = i; } }); return { v: m, at }; };
const sum = (arr) => arr.reduce((s, v) => s + v, 0);
const peakMin = (arr) => { let m = 0; for (let i = 0; i < DAY; i += 60) { let s = 0; for (let j = i; j < i + 60; j++) s += arr[j]; m = Math.max(m, s); } return m; };
const utc = (sec) => `${String(Math.floor(sec / 3600)).padStart(2, '0')}:${String(Math.floor(sec % 3600 / 60)).padStart(2, '0')} UTC`;

// ---- The biggest single exam: every seat simulated (one class's attempts collection) ----
const seats = P.biggestClass, perSec = new Float64Array(3600 * 2);
for (let i = 0; i < seats; i++) {
  const st = startDelay();
  perSec[Math.floor(st)] += 1;                                                // start
  for (let k = 120; k < P.examMinutes * 60; k += 120) perSec[Math.floor(st + k + rnd() * 5)] += 1; // saves (beatAt is indexed)
  perSec[Math.floor(st + P.examMinutes * 60)] += 1;
}
const bigPeak = peak(perSec).v;
// the same exam if every student had pressed Start in the same second (worst case)
const bigWorst = seats;

// ---- Single-document and per-person limits ----
const rosterBytes = (n) => 64 + n * 112;           // a roster entry: email, name, ID, section, role
const rosterMax = Math.floor((L.docMiB - 64) / 112);
const dashboardReads = P.biggestClass * 30;        // the professor's dashboard reads every student x practice set
const classes = Math.round(P.students * P.classesPerStudent / P.avgClassSize);
const professors = Math.round(classes / 2.5);

// ---- Auth ----
const lectureOnOneNetwork = 300;                   // a first-week lecture on campus Wi-Fi, sharing one address
const onlineAtPeak = peakMin(opens) * 45;          // sessions last about 45 minutes
const refreshPerMin = Math.round(onlineAtPeak / 60); // each signed-in browser renews its sign-in token hourly

// ---- Cost for the day, then a month ----
const dayReads = sum(reads), dayWrites = sum(writes);
const freeR = 50_000, freeW = 20_000;
const costDay = Math.max(0, dayReads - freeR) / 1e5 * 0.03 + Math.max(0, dayWrites - freeW) / 1e5 * 0.09;
const aiDay = sum(ai), aiCost = aiDay * (2000 * 0.10 + 500 * 0.50) / 1e6;

// ---- Verdicts ----
const fmt = (n) => Math.round(n).toLocaleString('en-US');
const rows = [];
const check = (area, what, result, limit, status, fix) => rows.push({ area, what, result, limit, status, fix });

check('Database, whole site', 'Peak writes per second (exam week)', fmt(peak(writes).v) + ' at ' + utc(peak(writes).at), 'No fixed limit; traffic must grow gradually', 'Pass', 'Grow by school, not all at once; warn Google before a very large launch');
check('Database, whole site', 'Peak reads per second', fmt(peak(reads).v) + ' at ' + utc(peak(reads).at), 'No fixed limit', 'Pass', '');
check('Database, one record', 'Most writes to one record per second', '1 or less: every student writes only their own records', 'About 1 a second', 'Pass', 'Keep it so: never a shared counter (scale rule 2)');
check('Exam rush', `Biggest exam (${fmt(seats)} seats): writes per second into its attempts`, fmt(bigPeak) + ' at peak', fmt(L.monotonicIndexWritesPerSec) + ' a second when a timestamp is indexed', bigPeak > L.monotonicIndexWritesPerSec * 0.6 ? 'Watch' : 'Pass', 'Stop indexing beatAt, startedAt and submittedAt (free); spread the countdown reload over 0 to 5 seconds');
check('Exam rush', 'Same exam if everyone pressed Start in one second', fmt(bigWorst), fmt(L.monotonicIndexWritesPerSec) + ' a second', bigWorst > L.monotonicIndexWritesPerSec ? 'Fail' : 'Pass', 'The same two fixes; then the limit no longer applies');
check('Exam rush', 'Security-rule lookups when starting an exam', 'About 6', fmt(L.rulesLookups) + ' per request', 'Pass', 'Every new exam rule must keep the total under 10');
check('Records too big', `Class roster (one record) for ${fmt(P.biggestClass)} students`, `${Math.round(rosterBytes(P.biggestClass) / 1024)} KB; full at ${fmt(rosterMax)} students`, '1 MiB per record', P.biggestClass > rosterMax * 0.5 ? 'Watch' : 'Pass', 'One record per student (rosters/{class}/people/{email}) before classes over 5,000');
check('Big reads', `Professor dashboard, ${fmt(P.biggestClass)}-student class`, `${fmt(dashboardReads)} records each time it opens`, 'Works, but slow and costly above ~10,000', 'Fail', 'A summary record per class and section, updated by the server; the dashboard reads a handful');
check('Big reads', 'Admin pages: every user, every class, every sign-in', `${fmt(P.students)} users and ${fmt(classes)} classes read on one page`, 'A browser handles a few thousand', 'Fail', 'Pages of 50, search, and counts from the database (count queries)');
check('Big reads', 'Admin sign-in loads every class', `${fmt(classes)} classes`, 'Same', 'Fail', 'Load the admin\'s list only when the page needs it, a page at a time');
check('Sign-in', `New accounts from one campus network (a ${lectureOnOneNetwork}-seat first lecture)`, `${lectureOnOneNetwork} in a few minutes`, fmt(L.accountsPerIpHour) + ' an hour per address', 'Fail', 'Ask Firebase to raise it two weeks before each school starts, or sign in through the school (SSO); confirm whether Google sign-in counts');
check('Sign-in', 'Sign-in renewals per minute at the busiest time', `About ${fmt(refreshPerMin)}`, fmt(L.tokenExchangesPerMin) + ' a minute per project (meaning to confirm with Firebase)', refreshPerMin > L.tokenExchangesPerMin ? 'Watch' : 'Pass', 'Confirm with Firebase what counts; Identity Platform raises limits on request');
check('Hosting', 'GitHub Pages for a paid product', `${fmt(peakMin(opens))} app opens a minute`, '100 GB a month; no commercial software (SaaS)', 'Fail', 'Move to Cloudflare Pages or Workers static assets before the first school pays (same files, free plan, no bandwidth limit)');
check('AI', 'AI requests per minute at the busiest time', fmt(peakMin(ai)), 'Each AI company sets a limit per customer', 'Watch', 'Arrange higher limits before each large school; bring-your-own AI spreads the load');

// ---- The report ----
const lines = [];
lines.push('# Scale report', '');
lines.push(`Generated by \`npm run scale\` on ${new Date().toISOString().slice(0, 10)}. Every one of ${fmt(P.students)} students was simulated for one exam-week day (${simSeconds.toFixed(1)} seconds of computing). This checks the design against published limits; it does not send traffic to Google.`, '');
lines.push('## The day in numbers', '');
lines.push('| Measure | Result |', '|---|---|');
lines.push(`| Students who opened Cramming | ${fmt(activeN)} |`);
lines.push(`| Students who sat a timed exam | ${fmt(examN)} |`);
lines.push(`| Classes, professors (estimated) | ${fmt(classes)}, ${fmt(professors)} |`);
lines.push(`| Database reads in the day | ${fmt(dayReads)} |`);
lines.push(`| Database writes in the day | ${fmt(dayWrites)} |`);
lines.push(`| Busiest second: writes | ${fmt(peak(writes).v)} at ${utc(peak(writes).at)} |`);
lines.push(`| Busiest second: reads | ${fmt(peak(reads).v)} at ${utc(peak(reads).at)} |`);
lines.push(`| Signed in at the busiest time | About ${fmt(onlineAtPeak)} |`);
lines.push(`| AI requests in the day | ${fmt(aiDay)} |`);
lines.push(`| Database cost for the day, 30 days | $${fmt(costDay)}, $${fmt(costDay * 30)} (exam week every day: the top of the range) |`);
lines.push(`| AI cost for the day on Haiku 5.5, 30 days | $${fmt(aiCost)}, $${fmt(aiCost * 30)} |`, '');
lines.push('## Checks', '');
lines.push('| Area | What | Result | Limit | Verdict | Fix |', '|---|---|---|---|---|---|');
for (const r of rows) lines.push(`| ${r.area} | ${r.what} | ${r.result} | ${r.limit} | **${r.status}** | ${r.fix} |`);
lines.push('', '## Assumptions', '');
lines.push(`${fmt(P.classesPerStudent)} classes a student, ${P.avgClassSize} students in an average class, biggest class ${fmt(P.biggestClass)}. ${Math.round(P.activeToday * 100)}% open Cramming on the day, ${Math.round(P.examToday * 100)}% sit a ${P.examMinutes}-minute exam (exam week). Time zones: ${P.zones.map((z) => `${z.name} ${Math.round(z.share * 100)}%`).join(', ')}. Reads and writes per action follow the code as of November 2026; change them at the top of scripts/scale.mjs when the code changes.`);
writeFileSync(new URL('../docs/SCALE-REPORT.md', import.meta.url), lines.join('\n') + '\n');

console.log(`Simulated ${fmt(P.students)} students in ${simSeconds.toFixed(1)} s`);
for (const r of rows) console.log(`${r.status.padEnd(5)} ${r.area}: ${r.what} -> ${r.result}`);
console.log('Report: docs/SCALE-REPORT.md');
