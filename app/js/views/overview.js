// Admin: how the whole platform is doing, across every class.
// Reads: one per class (roster), one per student per exam (summaries), one per report, and one
// per person who has signed in. The result is kept for 10 minutes so moving around the site
// doesn't read it all again; "Refresh" reads it fresh.
import * as cloud from '../cloud.js';
import { esc, icon, plural } from '../ui.js';
import { CLASS_COLORS } from '../colors.js';

const DAY = 86400000;
const CACHE_MS = 10 * 60 * 1000;
let cache = null; // { at, data }

const dayKey = (t) => new Date(t).toLocaleDateString('en-CA'); // YYYY-MM-DD in the viewer's time zone
const pct = (n, d) => (d ? Math.round((n / d) * 100) + '%' : '–');
const num = (n) => (n == null ? '–' : Number(n).toLocaleString());
const swatch = (c) => (CLASS_COLORS.find((x) => x.id === c.color) || CLASS_COLORS[0]).swatch;
function daysTo(d) { if (!d) return null; const t = new Date(d + 'T00:00:00'); if (isNaN(t)) return null; const n = Math.ceil((t - new Date(new Date().toDateString())) / DAY); return n >= 0 ? n : null; }

async function loadData() {
  const classes = await cloud.listClasses();
  const [perClass, users] = await Promise.all([
    Promise.all(classes.map(async (c) => {
      const [roster, summaries, reports] = await Promise.all([
        cloud.getRoster(c.id).catch(() => []),
        cloud.classSummaries(c.id).catch(() => []),
        cloud.classReports(c.id).catch(() => []),
      ]);
      return { cls: c, roster, summaries, reports };
    })),
    cloud.listUsers().catch(() => null), // null: couldn't read (older rules); "signed in" falls back to "started"
  ]);
  return { classes: perClass, users, at: Date.now() };
}

// Turn raw class data into the numbers on the page
function compute(data) {
  const today = dayKey(Date.now());
  const since7 = dayKey(Date.now() - 6 * DAY);
  const since30 = dayKey(Date.now() - 29 * DAY);
  const signedIn = data.users ? new Set(data.users.map((u) => u.email)) : null;
  const all = new Map(); // email -> { days:Set, lastActive }
  let quizzes = 0, answered = 0, asgDone = 0;
  const rows = data.classes.map(({ cls, roster, summaries, reports }) => {
    const students = roster.filter((p) => !p.role || p.role === 'student');
    const emails = new Set(students.map((p) => String(p.email || '').toLowerCase()));
    const examIds = new Set(cls.exams || []);
    const mine = summaries.filter((s) => emails.has(String(s.email || '').toLowerCase()) && examIds.has(s.examId));
    const per = new Map(); // email -> activity in this class
    let right = 0, wrong = 0, cQuizzes = 0, cAsg = 0;
    const readiness = [];
    for (const s of mine) {
      const email = String(s.email).toLowerCase();
      const days = new Set(s.days || (s.lastActive ? [dayKey(s.lastActive)] : []));
      const p = per.get(email) || { days: new Set(), lastActive: 0 };
      days.forEach((d) => p.days.add(d));
      p.lastActive = Math.max(p.lastActive, s.lastActive || 0);
      per.set(email, p);
      const g = all.get(email) || { days: new Set(), lastActive: 0 };
      days.forEach((d) => g.days.add(d));
      g.lastActive = Math.max(g.lastActive, s.lastActive || 0);
      all.set(email, g);
      right += s.right || 0; wrong += s.wrong || 0;
      cQuizzes += s.attempts || 0; cAsg += s.asgDone || 0;
      if (s.readiness != null && (s.seen || 0) > 0) readiness.push(s.readiness);
    }
    quizzes += cQuizzes; answered += right + wrong; asgDone += cAsg;
    const activeSince = (since) => [...per.values()].filter((p) => [...p.days].some((d) => d >= since)).length;
    const next = (cls.exams || []).map((id) => ({ id, n: daysTo(cls.examDates?.[id]) })).filter((x) => x.n != null).sort((a, b) => a.n - b.n)[0];
    return {
      cls,
      students: emails.size,
      signedIn: signedIn ? [...emails].filter((e) => signedIn.has(e)).length : null,
      started: per.size,
      active7: activeSince(since7),
      readiness: readiness.length ? Math.round(readiness.reduce((a, b) => a + b, 0) / readiness.length) : null,
      accuracy: right + wrong ? right / (right + wrong) : null,
      asgDone: cAsg,
      openReports: reports.filter((r) => r.status === 'open').length,
      nextExam: next || null,
    };
  });
  // everyone on any roster, counted once
  const everyone = new Set();
  data.classes.forEach(({ roster }) => roster.filter((p) => !p.role || p.role === 'student').forEach((p) => everyone.add(String(p.email || '').toLowerCase())));
  const actives = [...all.entries()].filter(([e]) => everyone.has(e)).map(([, v]) => v);
  const activeOn = (pred) => actives.filter((a) => [...a.days].some(pred)).length;
  // daily active students, last 30 days
  const series = [];
  for (let i = 29; i >= 0; i--) {
    const d = dayKey(Date.now() - i * DAY);
    series.push({ day: d, count: actives.filter((a) => a.days.has(d)).length });
  }
  return {
    totals: {
      students: everyone.size,
      signedIn: signedIn ? [...everyone].filter((e) => signedIn.has(e)).length : null,
      started: actives.length,
      today: activeOn((d) => d === today),
      week: activeOn((d) => d >= since7),
      month: activeOn((d) => d >= since30),
      quizzes, answered, asgDone,
    },
    series,
    rows,
  };
}

function chart(series, width = 720) {
  // drawn at the size it is shown, so the text stays readable on phones
  const W = Math.round(Math.max(300, Math.min(760, width))), H = W < 480 ? 200 : 220, padL = 34, padR = 8, padT = 12, padB = 28;
  const max = Math.max(1, ...series.map((s) => s.count));
  const step = max <= 5 ? 1 : Math.ceil(max / 4 / 5) * 5 || 1;
  const top = Math.ceil(max / step) * step;
  const iw = W - padL - padR, ih = H - padT - padB;
  const bw = iw / series.length;
  const y = (v) => padT + ih - (v / top) * ih;
  const ticks = [];
  for (let v = 0; v <= top; v += step) ticks.push(v);
  const fmt = (d) => new Date(d + 'T12:00:00').toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  const label = (d) => new Date(d + 'T12:00:00').toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
  return `
    <svg class="ov-chart" viewBox="0 0 ${W} ${H}" role="img" aria-label="Students active each day for the last 30 days. Highest: ${max} on ${esc(label(series.reduce((a, b) => (b.count > a.count ? b : a)).day))}.">
      ${ticks.map((v) => `<line class="ov-grid" x1="${padL}" x2="${W - padR}" y1="${y(v)}" y2="${y(v)}"/><text class="ov-tick" x="${padL - 6}" y="${y(v) + 4}" text-anchor="end">${v}</text>`).join('')}
      ${series.map((s, i) => {
        const x = padL + i * bw + 1, w = Math.max(2, bw - 2), h = (s.count / top) * ih;
        const r = Math.min(4, w / 2, h);
        const bar = h > 0 ? `<path class="ov-bar" d="M${x},${padT + ih} V${padT + ih - h + r} Q${x},${padT + ih - h} ${x + r},${padT + ih - h} H${x + w - r} Q${x + w},${padT + ih - h} ${x + w},${padT + ih - h + r} V${padT + ih} Z"/>` : '';
        return `<g class="ov-col" data-tip="${esc(label(s.day))}: ${s.count} ${s.count === 1 ? 'student' : 'students'}" >${bar}<rect class="ov-hit" x="${padL + i * bw}" y="${padT}" width="${bw}" height="${ih}"/></g>`;
      }).join('')}
      <line class="ov-axis" x1="${padL}" x2="${W - padR}" y1="${padT + ih}" y2="${padT + ih}"/>
      ${series.map((s, i) => ((series.length - 1 - i) % 7 === 0) ? `<text class="ov-tick" x="${padL + i * bw + bw / 2}" y="${H - 8}" text-anchor="middle">${esc(i === series.length - 1 ? 'Today' : fmt(s.day))}</text>` : '').join('')}
    </svg>
    <div class="ov-tip" role="status" aria-live="polite" hidden></div>`;
}

export async function render(main, params = {}, query = {}) {
  if (!cloud.enabled || !cloud.isAdmin()) {
    main.innerHTML = `<section class="page narrow empty-state"><h1>Admins only</h1><p>Only site admins can see the platform overview.</p><a class="btn primary" href="#/">Go home</a></section>`;
    return;
  }
  main.innerHTML = `
    <section class="page overview">
      <header class="inst-head">
        <div>
          <p class="eyebrow">Admin</p>
          <h1>Platform overview</h1>
          <p class="muted" data-updated>Every class, all in one place.</p>
        </div>
        <div class="row">
          <a class="btn" href="#/admin">${icon('users')} Manage classes</a>
          <button class="btn" data-refresh>${icon('shuffle')} Refresh</button>
        </div>
      </header>
      <div data-body><p class="muted loading-line">Loading the numbers for every class…</p></div>
    </section>`;
  const body = main.querySelector('[data-body]');

  async function show(fresh) {
    let data;
    try {
      if (!fresh && cache && Date.now() - cache.at < CACHE_MS) data = cache.data;
      else { data = await loadData(); cache = { at: Date.now(), data }; }
    } catch (e) {
      console.error(e);
      body.innerHTML = `<div class="empty-state"><p class="bad">Couldn't load the numbers: ${esc(e?.code === 'permission-denied' ? 'your account is not an admin in firestore.rules (publish the latest rules).' : e?.message || e)}</p><button class="btn" data-refresh>Try again</button></div>`;
      return;
    }
    if (!main.isConnected) return;
    const { totals: t, series, rows } = compute(data);
    main.querySelector('[data-updated]').textContent = `Every class, all in one place. Numbers as of ${new Date(data.at).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}; they fill in as students finish studying.`;
    if (!rows.length) {
      body.innerHTML = `<div class="empty-state"><h2>No classes yet</h2><p>Create a class and upload its roster to start seeing numbers here.</p><a class="btn primary" href="#/admin?edit=new">New class</a></div>`;
      return;
    }
    const tile = (value, label, sub = '') => `<div class="stat-tile"><strong>${value}</strong><span>${label}</span>${sub ? `<span class="muted small">${sub}</span>` : ''}</div>`;
    body.innerHTML = `
      <div class="ov-tiles">
        ${tile(num(t.students), 'students on rosters', plural(rows.length, 'class', 'classes'))}
        ${t.signedIn != null ? tile(num(t.signedIn), 'have signed in', pct(t.signedIn, t.students) + ' of students') : tile(num(t.started), 'have started practising', pct(t.started, t.students) + ' of students')}
        ${tile(num(t.today), 'active today')}
        ${tile(num(t.week), 'active this week', pct(t.week, t.students) + ' of students')}
        ${tile(num(t.month), 'active in the last 30 days')}
        ${tile(num(t.quizzes), 'quizzes finished')}
        ${tile(num(t.answered), 'questions answered')}
        ${tile(num(t.asgDone), 'assignments completed')}
      </div>

      <section class="ov-panel">
        <h2>Students active each day</h2>
        <p class="muted small">Last 30 days, all classes. A student counts on a day they answered questions, finished a quiz or worked on an assignment.</p>
        <div class="ov-chart-wrap">${chart(series, body.clientWidth - (innerWidth <= 640 ? 34 : 46))}</div>
        <details class="ov-table-toggle"><summary>Show as a table</summary>
          <div class="table-wrap" tabindex="0" role="region" aria-label="Students active each day, as a table"><table class="inst-table compact"><thead><tr><th>Day</th><th>Active students</th></tr></thead>
          <tbody>${[...series].reverse().map((s) => `<tr><td>${esc(new Date(s.day + 'T12:00:00').toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' }))}</td><td>${s.count}</td></tr>`).join('')}</tbody></table></div>
        </details>
      </section>

      <section class="ov-panel">
        <h2>Classes</h2>
        <div class="table-wrap ov-classes"><table class="inst-table">
          <thead><tr><th>Class</th><th>Students</th><th>${t.signedIn != null ? 'Signed in' : 'Started'}</th><th>Active this week</th><th title="Average quiz readiness, out of 100">Readiness</th><th title="Average accuracy">Accuracy</th><th title="Assignments completed">Assignments</th><th title="Open question reports">Reports</th><th>Next exam</th></tr></thead>
          <tbody>${rows.map((r) => `
            <tr>
              <td><span class="class-dot" style="--sw:${swatch(r.cls)}"></span><a class="ov-class-link" href="#/instructor?class=${encodeURIComponent(r.cls.id)}" title="Open the class dashboard">${esc(r.cls.name)}</a></td>
              <td data-label="Students">${num(r.students)}</td>
              <td data-label="${t.signedIn != null ? 'Signed in' : 'Started'}"><span>${r.signedIn != null ? `${num(r.signedIn)} <span class="muted small">(${pct(r.signedIn, r.students)})</span>` : `${num(r.started)} <span class="muted small">(${pct(r.started, r.students)})</span>`}</span></td>
              <td data-label="Active this week"><span>${num(r.active7)} <span class="muted small">(${pct(r.active7, r.students)})</span></span></td>
              <td data-label="Avg quiz readiness (of 100)">${r.readiness ?? '–'}</td>
              <td data-label="Avg accuracy">${r.accuracy == null ? '–' : Math.round(r.accuracy * 100) + '%'}</td>
              <td data-label="Assignments completed">${num(r.asgDone)}</td>
              <td data-label="Open question reports">${r.openReports ? `<span class="tag warn-tag">${r.openReports}</span>` : '0'}</td>
              <td data-label="Next exam">${r.nextExam ? (r.nextExam.n === 0 ? 'Today' : `in ${plural(r.nextExam.n, 'day')}`) : '<span class="muted">–</span>'}</td>
            </tr>`).join('')}
          </tbody></table></div>
        <p class="muted small">Click a class to open its dashboard. Readiness (out of 100) and accuracy average the students who have started. Active days are counted in each student's own time zone.</p>
      </section>`;
    bindChart();
  }

  function bindChart() {
    const wrap = main.querySelector('.ov-chart-wrap');
    if (!wrap) return;
    const tip = wrap.querySelector('.ov-tip');
    const showTip = (g) => {
      tip.textContent = g.dataset.tip;
      tip.hidden = false;
      const r = g.getBoundingClientRect(), w = wrap.getBoundingClientRect();
      const left = Math.min(Math.max(r.left - w.left + r.width / 2, 70), w.width - 70);
      tip.style.left = left + 'px';
      wrap.querySelectorAll('.ov-col.on').forEach((x) => x.classList.remove('on'));
      g.classList.add('on');
    };
    const hide = () => { tip.hidden = true; wrap.querySelectorAll('.ov-col.on').forEach((x) => x.classList.remove('on')); };
    wrap.addEventListener('pointerover', (e) => { const g = e.target.closest('.ov-col'); if (g) showTip(g); });
    wrap.addEventListener('pointerleave', hide);
  }

  main.addEventListener('click', (ev) => {
    if (ev.target.closest('[data-refresh]')) {
      body.innerHTML = '<p class="muted loading-line">Loading the numbers for every class…</p>';
      show(true);
    }
  });
  await show(false);
}
