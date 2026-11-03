// Instructor dashboard: how every signed-in student is doing on one exam.
// Only accounts listed in firestore.rules can read this data; everyone else gets "not allowed".
import { getManifest, getAssignments, getExam } from '../data.js';
import * as cloud from '../cloud.js';
import { esc, icon, meter, toneFor, plural, modal, toast } from '../ui.js';
import { fmtDate } from '../engine.js';
import { REASON_LABEL } from '../report.js';

const pct = (x) => (x == null ? '–' : Math.round(x * 100) + '%');
const DAY = 86400000;
const ago = (ts) => {
  if (!ts) return 'Never';
  const d = Math.floor((Date.now() - ts) / DAY);
  return d <= 0 ? fmtDate(ts) : d === 1 ? 'Yesterday' : `${d} days ago`;
};
const median = (xs) => { const a = xs.filter((x) => x != null).sort((p, q) => p - q); if (!a.length) return null; const m = a.length >> 1; return a.length % 2 ? a[m] : (a[m - 1] + a[m]) / 2; };

const COLS = [
  { key: 'name', label: 'Student', sort: (s) => (s.name || s.email || '').toLowerCase() },
  { key: 'section', label: 'Section', sort: (s) => s.section || '' },
  { key: 'lastActive', label: 'Last active', sort: (s) => s.lastActive || 0 },
  { key: 'seen', label: 'Questions tried', sort: (s) => s.seen || 0 },
  { key: 'accuracy', label: 'Accuracy', sort: (s) => s.accuracy ?? -1 },
  { key: 'readiness', label: 'Quiz readiness', sort: (s) => s.readiness ?? -1 },
  { key: 'realExamBest', label: 'Best timed test', sort: (s) => s.realExamBest ?? -1 },
  { key: 'asgDone', label: 'Assignments', sort: (s) => s.asgDone || 0 },
];

export async function render(main, params = {}, query = {}) {
  if (!cloud.enabled) {
    main.innerHTML = `<section class="page narrow empty-state"><h1>Instructor dashboard</h1><p>Student sign-in is turned off, so there is no student data to show. See "Student sign-in" in the README to turn it on.</p></section>`;
    return;
  }
  const allExams = (await getManifest()).exams.filter((e) => !e.preview);
  const classes = cloud.isAdmin() ? await cloud.listClasses().catch(() => []) : cloud.teachingClasses();
  if (!classes.length) {
    main.innerHTML = `<section class="page narrow empty-state"><h1>No classes to show</h1><p>You aren't listed as an instructor for any class yet. ${cloud.isAdmin() ? '<a href="#/admin">Create a class</a> first.' : 'Ask the site admin to add your email to your class.'}</p></section>`;
    return;
  }
  const remembered = (k) => { try { return sessionStorage.getItem('qp1:instructor-' + k); } catch { return null; } };
  const remember = (k, v) => { try { sessionStorage.setItem('qp1:instructor-' + k, v); } catch {} };
  let classId = [query.class, remembered('class')].find((x) => classes.some((c) => c.id === x)) || classes[0].id;
  const cls = () => classes.find((c) => c.id === classId);
  const examsOf = () => (cls().exams || []).map((id) => allExams.find((e) => e.id === id)).filter(Boolean);
  let examId = null;
  const pickExam = () => { const ex = examsOf(); const r = remembered('exam'); examId = ex.some((e) => e.id === r) ? r : (ex.find((e) => e.active && !e.archived) || ex[0])?.id || null; };
  pickExam();
  let roster = [];
  let section = '';
  let rows = [];
  let reports = [];
  let anns = [];
  let examData = null;
  let showResolved = false;
  let asgList = [];
  let sortKey = 'name', sortDir = 1, filter = '', only = 'all';
  section = remembered('section') || '';
  let grouped = remembered('grouped') !== 'no'; // students listed under a heading per section
  let allSums = [];          // this class's summaries for every exam (the drawer shows them all)
  let grades = null;         // uploaded real exam scores, read the first time a student panel opens
  let open = '';             // email of the student shown in the side panel

  main.innerHTML = `
    <section class="page instructor">
      <header class="inst-head">
        <div>
          <p class="eyebrow">Instructor</p>
          <h1>Class dashboard</h1>
          <p class="muted">Updates when students leave the site after studying, and after quizzes and assignment test runs (at most every 10 minutes). Only staff of this class can see it.</p>
        </div>
        <div class="row">
          <label class="field inline"><span class="sr-only">Class</span>
            <select data-class>${classes.map((c) => `<option value="${esc(c.id)}" ${c.id === classId ? 'selected' : ''}>${esc(c.name)}</option>`).join('')}</select>
          </label>
          <label class="field inline"><span class="sr-only">Exam</span><select data-exam></select></label>
          <a class="btn" data-analytics-link href="#/analytics?class=${encodeURIComponent(classId)}">${icon('chart')} Exam analytics</a>
          <a class="btn" data-content-link href="#/content/${encodeURIComponent(classId)}">${icon('upload')} Exams & assignments</a>
          <button class="btn" data-refresh>${icon('shuffle')} Refresh</button>
          <button class="btn" data-csv>${icon('download')} CSV</button>
        </div>
      </header>
      <div data-body><p class="muted">Loading student data…</p></div>
    </section>`;
  const body = main.querySelector('[data-body]');
  const fillExams = () => {
    main.querySelector('[data-exam]').innerHTML = examsOf().map((e) => `<option value="${esc(e.id)}" ${e.id === examId ? 'selected' : ''}>${esc(e.title)}</option>`).join('') || '<option>No exams</option>';
  };
  fillExams();
  // TAs only see the sections the admin assigned them (instructors and admins see everything)
  const mySections = () => { const c = cls(); return !cloud.isAdmin() && c.role === 'ta' && (c.sections || []).length ? c.sections : null; };
  const inSection = (r) => {
    const secs = (r.section || '').split(', ').filter(Boolean);
    const allowed = mySections();
    if (allowed && !secs.some((x) => allowed.includes(x))) return false;
    return !section || secs.includes(section);
  };
  // in any section this person may see (ignores the chosen tab)
  const inSectionAll = (r) => { const allowed = mySections(); const secs = (r.section || '').split(', ').filter(Boolean); return !allowed || secs.some((x) => allowed.includes(x)); };
  // the student list with a heading before each section (when grouping), keeping the chosen sort inside each section
  const withHeadings = (list) => {
    if (!grouped || section || sectionList().length < 2) return list;
    const groups = new Map();
    for (const r of list) { const k = firstSection(r) || 'No section'; if (!groups.has(k)) groups.set(k, []); groups.get(k).push(r); }
    return [...groups.keys()].sort((a, b) => a.localeCompare(b, undefined, { numeric: true })).flatMap((k) => [{ heading: k, count: groups.get(k).length }, ...groups.get(k)]);
  };
  const started = () => rows.filter((r) => !r.never && !r.signedInOnly && inSection(r));
  const enrolled = () => rows.filter((r) => !r.dropped && inSection(r));

  async function load() {
    body.innerHTML = '<p class="muted loading-line">Loading student data…</p>';
    try {
      if (!examId) { body.innerHTML = '<div class="empty-state"><h2>This class has no exams yet</h2></div>'; return; }
      let sums;
      [sums, roster, asgList, reports] = await Promise.all([cloud.classSummaries(classId), cloud.getRoster(classId), getAssignments(examId).catch(() => []), cloud.classReports(classId).catch(() => [])]);
      reports = reports.filter((x) => x.examId === examId).sort((a, b) => b.createdAt - a.createdAt);
      anns = await cloud.listAnnouncements(classId, { fresh: true }).catch(() => []);
      examData = await getExam(examId).catch(() => null);
      allSums = sums;
      sums = sums.filter((x) => x.examId === examId);
      const students = roster.filter((p) => !p.role || p.role === 'student');
      const byEmail = new Map(students.map((p) => [p.email, p]));
      // a summary with no practice in it means "signed in, not started yet"
      const studied = (x) => (x.seen || 0) > 0 || (x.attempts || 0) > 0 || (x.asgDone || 0) > 0 || Object.values(x.asg || {}).some((a) => (a.attempts || 0) > 0 || (a.best || 0) > 0);
      rows = sums.map((x) => { const p = byEmail.get(x.email); return { ...x, name: p?.name || x.name, redId: p?.redId || '', section: p?.section || x.section || '', dropped: !p, signedInOnly: !studied(x) }; });
      const have = new Set(rows.map((r) => r.email));
      for (const p of students) if (!have.has(p.email)) rows.push({ uid: null, email: p.email, name: p.name, redId: p.redId, section: p.section, never: true });
    } catch (e) {
      body.innerHTML = e?.code === 'permission-denied'
        ? `<div class="empty-state"><h2>You're not an instructor for this class</h2><p>Ask the site admin to add your email to this class on the Admin page.</p></div>`
        : `<div class="empty-state"><h2>Couldn't load student data</h2><p>${esc(e?.message || String(e))}</p></div>`;
      return;
    }
    paint();
    if (open) detail(open);
  }

  function overview() {
    const rows = started();
    const now = Date.now();
    const active7 = rows.filter((r) => r.lastActive && now - r.lastActive < 7 * DAY).length;
    const total = rows[0]?.totalQuestions || 0;
    const asgTotal = asgList.length;
    const tile = (big, label, sub = '') => `<div class="stat-tile"><strong>${big}</strong><span>${label}</span>${sub ? `<span class="muted small">${sub}</span>` : ''}</div>`;
    return `<div class="stat-tiles">
      ${(() => { const notIn = enrolled().filter((r) => r.never).length, waiting = enrolled().filter((r) => r.signedInOnly).length; return tile(`${rows.filter((r) => !r.dropped).length}<span class="of"> / ${enrolled().length}</span>`, 'students have started', `${notIn} not signed in yet${waiting ? ` · ${waiting} signed in, not started` : ''}`); })()}
      ${tile(active7, 'active in the last 7 days', enrolled().length ? pct(active7 / enrolled().length) + ' of the class' : '')}
      ${tile(median(rows.map((r) => r.readiness)) ?? '–', 'median quiz readiness', 'out of 100')}
      ${tile(Math.round(median(rows.map((r) => r.seen)) ?? 0), 'median questions tried', total ? `of ${total}` : '')}
      ${asgTotal ? tile(pct(rows.length ? rows.reduce((s, r) => s + (r.asgDone || 0), 0) / (rows.length * asgTotal) : null), 'assignments completed', `${asgTotal} assignments`) : ''}
    </div>`;
  }

  function topics() {
    const rows = started();
    const denom = enrolled().length;
    const by = new Map();
    for (const r of rows) for (const t of r.topics || []) {
      const x = by.get(t.name) || { name: t.name, right: 0, wrong: 0, tried: 0, mastery: 0, n: 0 };
      x.right += t.right; x.wrong += t.wrong; x.mastery += t.mastery; x.n++;
      if (t.seen) x.tried++;
      by.set(t.name, x);
    }
    const list = [...by.values()].map((t) => ({ ...t, acc: t.right + t.wrong ? t.right / (t.right + t.wrong) : null, mastery: t.n ? t.mastery / t.n : 0 }))
      .sort((a, b) => (a.acc ?? 2) - (b.acc ?? 2));
    if (!list.length) return '';
    return `<h2 class="section-title">Topics, weakest first</h2>
      <p class="muted section-sub">Class accuracy on each topic's questions, and how many students have tried it.</p>
      <ul class="inst-topics">${list.map((t, i) => `
        <li ${i >= 5 ? 'data-extra hidden' : ''}><span class="t-name">${esc(t.name)}</span>
          <span class="t-bar">${meter(t.acc ?? 0, { tone: t.acc == null ? 'muted' : toneFor(t.acc) })}</span>
          <span class="t-num">${pct(t.acc)}</span>
          <span class="muted small t-tried">${t.tried}/${denom} tried</span></li>`).join('')}</ul>
      ${list.length > 5 ? `<button class="btn small show-all" data-show-all>Show all ${list.length} topics</button>` : ''}`;
  }

  function assignments() {
    const rows = started();
    const denom = enrolled().length;
    if (!asgList.length) return '';
    return `<h2 class="section-title">Programming assignments</h2>
      <ul class="inst-topics">${asgList.map((a, i) => {
        const st = rows.map((r) => r.asg?.[a.slug]).filter(Boolean);
        const done = st.filter((x) => x.done).length;
        const started = st.length;
        const avgH = st.length ? st.reduce((s, x) => s + (x.hints || 0), 0) / st.length : 0; const hints = Number.isInteger(avgH) ? String(avgH) : avgH.toFixed(1);
        return `<li ${i >= 5 ? 'data-extra hidden' : ''}><span class="t-name">${esc(a.title)}</span>
          <span class="t-bar">${meter(denom ? done / denom : 0, { tone: 'good' })}</span>
          <span class="t-num">${done}/${denom}</span>
          <span class="muted small t-tried">${started} started · ${hints} hints avg</span></li>`;
      }).join('')}</ul>
      ${asgList.length > 5 ? `<button class="btn small show-all" data-show-all>Show all ${asgList.length} assignments</button>` : ''}`;
  }

  function annSection() {
    return `<details class="ann-admin" ${anns.some((a) => !a.expired) ? '' : 'open'}>
      <summary><strong>Announcements</strong> <span class="muted small">${anns.filter((a) => !a.expired).length} showing to students</span></summary>
      <form class="ann-form" data-ann-form>
        <label class="field"><span>New announcement for ${esc(cls().name)}</span><textarea name="text" rows="2" maxlength="500" placeholder="Exam room changed to GMCS 333" required></textarea></label>
        <div class="row"><label class="field inline"><span>Show until <span class="muted">(optional)</span></span><input type="date" name="until"></label><button class="btn primary" type="submit">${icon('megaphone')} Post</button></div>
      </form>
      ${anns.length ? `<ul class="ann-list">${anns.map((a) => `<li class="${a.expired ? 'expired' : ''}"><div><p>${esc(a.text)}</p><span class="muted small">${esc(a.author || '')} · ${esc(fmtDate(a.createdAt))}${a.until ? ` · until ${esc(a.until)}` : ''}${a.expired ? ' · expired' : ''}</span></div><button class="btn small danger-outline" data-del-ann="${esc(a.id)}">${icon('trash')}<span class="sr-only">Delete announcement</span></button></li>`).join('')}</ul>` : ''}
    </details>`;
  }

  function missedSection() {
    const rs = started();
    const agg = new Map();
    for (const r of rs) for (const [qid, [right, wrong, last]] of Object.entries(r.qs || {})) {
      const a = agg.get(qid) || { qid, tried: 0, wrongNow: 0, everWrong: 0 };
      a.tried++; if (!last) a.wrongNow++; if (wrong) a.everWrong++;
      agg.set(qid, a);
    }
    const minTried = Math.max(2, Math.ceil(rs.length * 0.1));
    const list = [...agg.values()].filter((a) => a.tried >= minTried && a.wrongNow > 0)
      .sort((a, b) => b.wrongNow / b.tried - a.wrongNow / a.tried || b.tried - a.tried).slice(0, 8);
    if (!list.length) return '';
    const strip = (t) => String(t || '').replace(/```[\s\S]*?```/g, ' [code] ').replace(/[`*_#>]/g, '').replace(/\s+/g, ' ').trim().slice(0, 120);
    const e = encodeURIComponent(examId);
    return `<h2 class="section-title">Most-missed questions</h2>
      <p class="muted section-sub">Questions most students currently get wrong (their latest answer), among those who tried them. Good candidates to go over in class.</p>
      <ol class="missed-list">${list.map((a) => { const q = examData?.byId.get(a.qid); return `
        <li><div class="missed-main"><p><strong>${esc(a.qid)}</strong>${q ? ` · <span class="muted small">${esc(q.topic)}</span>` : ''}</p><p class="small">${esc(q ? strip(q.text) : '(question removed)')}</p></div>
          <div class="missed-stat"><strong>${Math.round((a.wrongNow / a.tried) * 100)}%</strong><span class="muted small">${a.wrongNow} of ${a.tried} wrong</span></div>
          ${q ? `<a class="btn small" href="#/browse/${e}?q=${encodeURIComponent(a.qid)}">View</a>` : ''}</li>`; }).join('')}</ol>`;
  }

  function reportsSection() {
    const mine = reports.filter((x) => { const allowed = mySections(); return (!allowed || allowed.includes(x.section)) && (!section || x.section === section); });
    if (!mine.length) return '';
    const open = mine.filter((x) => x.status !== 'resolved');
    const list = showResolved ? mine : open;
    const strip = (t) => String(t || '').replace(/```[\s\S]*?```/g, ' [code] ').replace(/[`*_#>]/g, '').replace(/\s+/g, ' ').trim().slice(0, 140);
    return `<h2 class="section-title">Question reports <span class="count-badge ${open.length ? 'bad' : ''}">${open.length} open</span></h2>
      <p class="muted section-sub">Students flag questions they think are wrong or unclear.${mine.length > open.length ? ` <button class="link-btn" data-toggle-resolved>${showResolved ? 'Hide' : 'Show'} ${mine.length - open.length} resolved</button>` : ''}</p>
      ${list.length ? `<ul class="report-list">${list.map((x) => `
        <li class="${x.status === 'resolved' ? 'resolved' : ''}">
          <div class="report-main">
            <p><strong>${esc(x.qid)}</strong> · <span class="pill ${x.reason === 'answer' ? 'bad' : 'ok'}">${esc(REASON_LABEL[x.reason] || x.reason)}</span></p>
            <p class="muted small">${esc(strip(x.text))}</p>
            ${x.note ? `<blockquote>${esc(x.note)}</blockquote>` : ''}
            <p class="muted small">${esc(x.name || x.email)}${x.section ? ` · ${esc(x.section)}` : ''} · ${esc(fmtDate(x.createdAt))}${x.status === 'resolved' ? ` · resolved by ${esc(x.resolvedBy || '')}` : ''}</p>
          </div>
          <button class="btn small" data-resolve="${esc(x.id)}" data-to="${x.status === 'resolved' ? 'open' : 'resolved'}">${x.status === 'resolved' ? 'Reopen' : `${icon('check')} Resolved`}</button>
        </li>`).join('')}</ul>` : '<p class="muted">No open reports. Nice.</p>'}`;
  }

  function visibleRows() {
    const q = filter.trim().toLowerCase();
    const now = Date.now();
    let list = rows.filter((r) => inSection(r) && (!q || (r.name || '').toLowerCase().includes(q) || (r.email || '').includes(q) || (r.redId || '').includes(q)));
    if (only === 'never') list = list.filter((r) => r.never || r.signedInOnly);
    if (only === 'inactive') list = list.filter((r) => !r.never && !r.signedInOnly && (!r.lastActive || now - r.lastActive >= 7 * DAY));
    if (only === 'low') list = list.filter((r) => !r.never && !r.signedInOnly && (r.readiness ?? 0) < 40);
    const col = COLS.find((c) => c.key === sortKey);
    const byName = (a, b) => (a.name || a.email || '').localeCompare(b.name || b.email || '');
    // ties (same section, same score…) fall back to the student's name, so the order never looks random
    const cmp = (x, y) => (typeof x === 'string' && typeof y === 'string' ? x.localeCompare(y, undefined, { numeric: true, sensitivity: 'base' }) : x < y ? -1 : x > y ? 1 : 0); // "Section 5" before "Section 10"
    return list.sort((a, b) => cmp(col.sort(a), col.sort(b)) * sortDir || byName(a, b));
  }
  const firstSection = (r) => (r.section || '').split(', ').filter(Boolean)[0] || '';
  const sectionList = () => { const allowed = mySections(); return [...new Set(rows.flatMap((r) => (r.section || '').split(', ').filter(Boolean)))].filter((x) => !allowed || allowed.includes(x)).sort((a, b) => a.localeCompare(b, undefined, { numeric: true })); };

  // One line per section: how far along each section is (only sections this person may see)
  function sectionStats() {
    const now = Date.now();
    return sectionList().map((sec) => {
      const inSec = rows.filter((r) => !r.dropped && (r.section || '').split(', ').includes(sec));
      const st = inSec.filter((r) => !r.never && !r.signedInOnly);
      const right = st.reduce((n, r) => n + (r.right || 0), 0), wrong = st.reduce((n, r) => n + (r.wrong || 0), 0);
      return {
        sec, total: inSec.length,
        notIn: inSec.filter((r) => r.never).length,
        started: st.length,
        active: st.filter((r) => r.lastActive && now - r.lastActive < 7 * DAY).length,
        readiness: median(st.map((r) => r.readiness)),
        accuracy: right + wrong ? right / (right + wrong) : null,
        asg: asgList.length && st.length ? st.reduce((n, r) => n + (r.asgDone || 0), 0) / (st.length * asgList.length) : null,
      };
    });
  }
  function sectionCompare() {
    const stats = sectionStats();
    if (section || stats.length < 2) return '';
    const best = (key) => Math.max(...stats.map((x) => x[key] ?? -1));
    const mark = (x, key, txt) => (stats.length > 2 && x[key] != null && x[key] === best(key) ? `<strong>${txt}</strong>` : txt);
    return `
      <h2 class="section-title">Sections</h2>
      <div class="table-wrap inst-table-wrap sec-compare-wrap" tabindex="0" role="region" aria-label="Sections compared">
        <table class="inst-table sec-compare">
          <thead><tr><th scope="col">Section</th><th scope="col">Students</th><th scope="col">Not signed in</th><th scope="col">Started</th><th scope="col">Active (7 days)</th><th scope="col">Median readiness</th><th scope="col">Accuracy</th>${asgList.length ? '<th scope="col">Assignments done</th>' : ''}</tr></thead>
          <tbody>${stats.map((x) => `<tr>
            <td><button class="link-btn" data-section-tab="${esc(x.sec)}">${esc(x.sec)}</button></td>
            <td data-label="Students">${x.total}</td>
            <td data-label="Not signed in">${x.notIn ? `<span class="pill bad">${x.notIn}</span>` : '0'}</td>
            <td data-label="Started"><span>${x.started} <span class="muted small">(${pct(x.total ? x.started / x.total : null)})</span></span></td>
            <td data-label="Active (7 days)"><span>${mark(x, 'active', String(x.active))} <span class="muted small">(${pct(x.total ? x.active / x.total : null)})</span></span></td>
            <td data-label="Median readiness">${x.readiness == null ? '–' : mark(x, 'readiness', String(Math.round(x.readiness)))}</td>
            <td data-label="Accuracy"><span class="pill ${toneFor(x.accuracy)}">${pct(x.accuracy)}</span></td>
            ${asgList.length ? `<td data-label="Assignments done">${pct(x.asg)}</td>` : ''}
          </tr>`).join('')}</tbody>
        </table>
      </div>
      <p class="muted small sec-compare-note">Click a section to see only its students. Readiness and accuracy count students who have started.</p>`;
  }

  function table() {
    const list = visibleRows();
    return `
      <h2 class="section-title">Students</h2>
      <div class="inst-tools">
        <input type="search" placeholder="Search name, email or RedID" value="${esc(filter)}" data-filter aria-label="Search students">
        <label class="field inline sort-pick"><span>Sort by</span><select data-sort-select>${COLS.map((c) => `<option value="${c.key}" ${c.key === sortKey ? 'selected' : ''}>${c.label}</option>`).join('')}</select></label>
        <div class="seg" role="tablist" aria-label="Show">
          ${[['all', 'Everyone'], ['never', 'Not started'], ['inactive', 'Inactive 7+ days'], ['low', 'Readiness under 40']].map(([k, l]) => `<button role="tab" data-only="${k}" aria-selected="${only === k}">${l}</button>`).join('')}
        </div>
        ${!section && sectionList().length > 1 ? `<label class="check group-toggle"><input type="checkbox" data-group ${grouped ? 'checked' : ''}><span>Group by section</span></label>` : ''}
      </div>
      <div class="table-wrap inst-table-wrap">
        <table class="inst-table">
          <thead><tr>${COLS.map((c) => `<th scope="col" aria-sort="${sortKey === c.key ? (sortDir > 0 ? 'ascending' : 'descending') : 'none'}"><button data-sort="${c.key}">${c.label}${sortKey === c.key ? (sortDir > 0 ? ' ▲' : ' ▼') : ''}</button></th>`).join('')}</tr></thead>
          <tbody>
            ${withHeadings(list).map((r) => r.heading ? `<tr class="sec-row"><th colspan="${COLS.length}" scope="colgroup">${esc(r.heading)} <span class="muted small">· ${plural(r.count, 'student')}</span></th></tr>` : `
              <tr class="${open === r.email ? 'is-open' : ''}" data-row="${esc(r.email)}">
                <td><button class="link-btn" data-student="${esc(r.email)}" aria-expanded="${open === r.email}">${esc(r.name || r.email)}</button><span class="muted small block">${esc(r.email)}${r.redId ? ' · ' + esc(r.redId) : ''}${r.dropped ? ' · <span class="bad">not on roster</span>' : ''}</span></td>
                <td data-label="Section">${esc(r.section || '–')}</td>
                <td data-label="Last active">${r.never ? '<span class="muted">Not signed in yet</span>' : r.signedInOnly ? `<span class="muted">Signed in${r.updatedAt ? ' ' + esc(ago(r.updatedAt).replace(/^[A-Z]/, (c) => c.toLowerCase())) : ''} · not started</span>` : ago(r.lastActive)}</td>
                <td data-label="Tried">${r.seen || 0}${r.totalQuestions ? ` <span class="muted small">/ ${r.totalQuestions}</span>` : ''}</td>
                <td data-label="Accuracy"><span class="pill ${toneFor(r.accuracy)}">${pct(r.accuracy)}</span></td>
                <td data-label="Readiness">${r.readiness ?? '–'}</td>
                <td data-label="Best timed test">${r.realExamBest != null ? r.realExamBest + '%' : '–'}</td>
                <td data-label="Assignments">${r.asgDone || 0}${asgList.length ? ` <span class="muted small">/ ${asgList.length}</span>` : ''}</td>
              </tr>`).join('') || `<tr><td colspan="${COLS.length}" class="muted">No students match.</td></tr>`}
          </tbody>
        </table>
      </div>`;
  }

  function paint() {
    const allowed = mySections();
    const sections = [...new Set(rows.flatMap((r) => (r.section || '').split(', ').filter(Boolean)))].filter((x) => !allowed || allowed.includes(x)).sort();
    const taNote = allowed ? `<p class="ta-note">${icon('note')}<span>You're a TA for ${allowed.length > 1 ? 'sections' : 'section'} <strong>${allowed.map(esc).join(', ')}</strong>, so you see those students only.</span></p>` : '';
    if (section && !sections.includes(section)) section = '';
    const count = (sec) => rows.filter((r) => !r.dropped && (!sec ? inSectionAll(r) : (r.section || '').split(', ').includes(sec))).length;
    const sectionPicker = taNote + (sections.length > 1 ? `<div class="sec-tabs" role="tablist" aria-label="Section">
        ${[['', allowed ? 'All my sections' : 'All sections'], ...sections.map((x) => [x, x])].map(([v, l]) => `<button role="tab" data-section-tab="${esc(v)}" aria-selected="${v === section}">${esc(l)} <span class="sec-count">${count(v)}</span></button>`).join('')}
      </div>` : '');
    const csvBtn = main.querySelector('[data-csv]');
    if (csvBtn) csvBtn.innerHTML = `${icon('download')} CSV${section ? ' · ' + esc(section) : ''}`;
    if (!rows.length) {
      body.innerHTML = `<div data-anns>${annSection()}</div><div class="empty-state"><h2>No students yet</h2><p>Upload this class's roster on the Admin page. Students appear here once they're on the roster.</p></div>`;
      return;
    }
    if (open && !rows.some((r) => r.email === open)) closeDrawer();
    body.innerHTML = sectionPicker + `<div data-anns>${annSection()}</div>` + overview() + sectionCompare() + `<div data-reports>${reportsSection()}</div>` + (started().length ? topics() + missedSection() + assignments() : '<p class="muted">Nobody has started this exam yet. Topic and assignment results show up once students begin.</p>') + `<div data-table>${table()}</div>`;
  }
  const repaintTable = () => { const t = body.querySelector('[data-table]'); if (t) { const had = document.activeElement?.matches('[data-filter]'); t.innerHTML = table(); if (had) { const f = t.querySelector('[data-filter]'); f.focus(); f.setSelectionRange(f.value.length, f.value.length); } } };

  // ---------- one student, in a panel on the right ----------
  const qText = (q) => { const t = Array.isArray(q?.body) ? q.body.join(' ') : String(q?.body || ''); return t.replace(/```[\s\S]*?```/g, ' [code] ').replace(/[`*_#>]/g, '').replace(/\s+/g, ' ').trim(); };
  const shortDay = (d) => new Date(d + 'T12:00:00').toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  async function loadGrades() {
    if (grades) return grades;
    try { grades = { list: await cloud.listGrades(classId) }; }
    catch (e) { grades = { list: [], error: e?.code === 'permission-denied' ? 'Publish the latest firestore.rules to see exam scores here.' : "Couldn't load exam scores." }; }
    return grades;
  }
  function drawerEl() {
    let d = main.querySelector('[data-drawer]');
    if (!d) {
      d = document.createElement('aside');
      d.className = 'stu-drawer'; d.dataset.drawer = ''; d.setAttribute('aria-labelledby', 'stu-drawer-title'); d.tabIndex = -1;
      main.querySelector('.page.instructor').appendChild(d);
    }
    // sit below the site's top bar so the menu stays usable
    const bar = document.querySelector('.topbar');
    d.style.top = (bar && getComputedStyle(bar).display !== 'none' ? Math.max(0, bar.getBoundingClientRect().height) : 0) + 'px';
    const tabs = document.querySelector('.tabbar');
    d.style.bottom = (tabs && getComputedStyle(tabs).display !== 'none' ? tabs.getBoundingClientRect().height : 0) + 'px';
    return d;
  }
  function closeDrawer() {
    const was = open; open = '';
    main.querySelector('[data-drawer]')?.remove();
    main.querySelector('.page.instructor')?.classList.remove('has-drawer');
    body.querySelectorAll('tr.is-open').forEach((t) => t.classList.remove('is-open'));
    body.querySelectorAll('[data-student][aria-expanded="true"]').forEach((b) => b.setAttribute('aria-expanded', 'false'));
    body.querySelector(`[data-student="${CSS.escape(was)}"]`)?.focus();
  }
  async function detail(email) {
    const r = rows.find((x) => x.email === email);
    if (!r) return;
    open = email;
    body.querySelectorAll('tr.is-open').forEach((t) => t.classList.remove('is-open'));
    body.querySelector(`tr[data-row="${CSS.escape(email)}"]`)?.classList.add('is-open');
    body.querySelectorAll('[data-student]').forEach((b) => b.setAttribute('aria-expanded', String(b.dataset.student === email)));
    main.querySelector('.page.instructor').classList.add('has-drawer');
    const d = drawerEl();
    d.innerHTML = drawerHead(r) + '<div class="stu-body"><p class="muted loading-line">Loading…</p></div>';
    d.focus({ preventScroll: true });
    const g = await loadGrades();
    if (open !== email) return; // another student was opened meanwhile
    d.querySelector('.stu-body').innerHTML = drawerBody(r, g);
    const c = d.querySelector('.stu-body');
    c.scrollTop = 0;
  }
  function drawerHead(r) {
    const list = visibleRows();
    const i = list.findIndex((x) => x.email === r.email);
    const prev = i > 0 ? list[i - 1] : null, next = i >= 0 && i < list.length - 1 ? list[i + 1] : null;
    const status = r.never ? '<span class="pill">Never signed in</span>' : r.signedInOnly ? '<span class="pill">Signed in · not started</span>' : `<span class="muted">Last active ${esc(ago(r.lastActive).replace(/^[A-Z]/, (c) => c.toLowerCase()))}</span>`;
    return `
      <div class="stu-head">
        <div class="stu-nav">
          <button class="icon-btn" data-stu-go="${esc(prev?.email || '')}" ${prev ? '' : 'disabled'} aria-label="Previous student">${icon('left')}</button>
          <span class="muted small">${i >= 0 ? `${i + 1} of ${list.length}` : ''}</span>
          <button class="icon-btn" data-stu-go="${esc(next?.email || '')}" ${next ? '' : 'disabled'} aria-label="Next student">${icon('right')}</button>
          <button class="icon-btn" data-stu-close aria-label="Close student details">${icon('x')}</button>
        </div>
        <h2 id="stu-drawer-title">${esc(r.name || r.email)}</h2>
        <p class="muted small">${esc(r.email)}${r.redId ? ' · RedID ' + esc(r.redId) : ''}${r.section ? ' · ' + esc(r.section) : ''}${r.dropped ? ' · <span class="bad">not on roster</span>' : ''}</p>
        <p class="small">${status}</p>
      </div>`;
  }
  function drawerBody(r, g) {
    const out = [];
    // 1. real exam scores, each exam against the one before it
    const sets = g.list || [];
    const mine = sets.map((set) => { const x = (set.scores || []).find((y) => String(y.email).toLowerCase() === r.email.toLowerCase()); return { set, score: x?.score ?? null, pct: x ? (x.score / (set.maxPoints || 100)) * 100 : null }; });
    const r1 = (x) => (Math.round(x * 10) / 10).toString();
    const sign = (x) => (x > 0 ? '+' : '') + r1(x);
    let examHtml;
    if (g.error) examHtml = `<p class="muted small">${esc(g.error)}</p>`;
    else if (!sets.length) examHtml = `<p class="muted small">No exam scores uploaded yet. Upload them on <a href="#/analytics?class=${encodeURIComponent(classId)}">Exam analytics</a>.</p>`;
    else {
      const scored = mine.filter((m) => m.pct != null);
      const steps = [];
      for (let k = 1; k < scored.length; k++) steps.push({ from: scored[k - 1], to: scored[k], d: scored[k].pct - scored[k - 1].pct });
      examHtml = `
        <ul class="stu-exams">${mine.map((m) => `
          <li><span class="stu-ex-name">${esc(m.set.name)}${m.set.date ? `<span class="muted small block">${esc(m.set.date)}</span>` : ''}</span>
            <span class="stu-ex-bar">${m.pct == null ? '' : `<span style="width:${Math.max(0, Math.min(100, m.pct))}%"></span>`}</span>
            <span class="stu-ex-num">${m.pct == null ? '<span class="muted">no score</span>' : `<strong>${r1(m.pct)}%</strong><span class="muted small block">${r1(m.score)} / ${r1(m.set.maxPoints)}</span>`}</span></li>`).join('')}</ul>
        ${steps.map((st) => `<p class="stu-change ${st.d >= 0 ? 'good' : 'bad'}"><span class="stu-arrow" aria-hidden="true">${st.d >= 0 ? '▲' : '▼'}</span><span><strong>${esc(st.from.set.name)} → ${esc(st.to.set.name)}: ${sign(st.d)} points</strong> <span class="muted">(${r1(st.from.pct)}% → ${r1(st.to.pct)}%)</span></span></p>`).join('')}
        ${scored.length < 2 && sets.length > 1 ? '<p class="muted small">This student needs a score on two exams to show a change.</p>' : ''}`;
    }
    out.push(`<section><h3>Exam scores</h3>${examHtml}</section>`);

    // 2. practice on the exam chosen at the top of the dashboard
    const ex = allExams.find((e) => e.id === examId);
    const solved = Object.values(r.qs || {}).filter((q) => (q?.[0] || 0) > 0).length;
    if (r.never) out.push(`<section><h3>Practice</h3><p class="muted">This student has never signed in, so there's no practice to show.</p></section>`);
    else {
      out.push(`<section><h3>Practice on ${esc(ex?.title || 'this exam')}</h3>
        ${r.signedInOnly ? '<p class="muted small">Signed in but hasn\'t practised this exam yet.</p>' : ''}
        <div class="stat-tiles small stu-tiles">
          <div class="stat-tile"><strong>${r.seen || 0}${r.totalQuestions ? `<span class="of">/${r.totalQuestions}</span>` : ''}</strong><span>questions tried</span></div>
          <div class="stat-tile"><strong>${solved}</strong><span>questions solved</span></div>
          <div class="stat-tile"><strong>${pct(r.accuracy)}</strong><span>accuracy${r.right || r.wrong ? ` (${r.right || 0} right, ${r.wrong || 0} wrong)` : ''}</span></div>
          <div class="stat-tile"><strong>${r.readiness ?? '–'}</strong><span>quiz readiness${r.readinessLabel ? ' · ' + esc(r.readinessLabel) : ''}</span></div>
          <div class="stat-tile"><strong>${r.attempts || 0}</strong><span>quizzes finished</span></div>
          <div class="stat-tile"><strong>${r.realExamBest != null ? r.realExamBest + '%' : '–'}</strong><span>best timed test${r.realExamLast != null ? ` (last ${r.realExamLast}%)` : ''}</span></div>
        </div></section>`);
      // activity
      const days = (r.days || []).slice().sort();
      const now = Date.now(), strip = [];
      for (let k = 27; k >= 0; k--) strip.push(new Date(now - k * DAY).toLocaleDateString('en-CA'));
      const on = new Set(days);
      out.push(`<section><h3>Activity</h3>
        <p class="small">${days.length ? `Studied on <strong>${plural(days.length, 'day')}</strong> in the last 60 days · last ${esc(shortDay(days[days.length - 1]))}${r.lastQuiz ? ` · last quiz ${esc(fmtDate(r.lastQuiz))}` : ''}` : '<span class="muted">No study days recorded yet.</span>'}</p>
        <div class="stu-days" role="img" aria-label="Last 4 weeks: studied on ${strip.filter((x) => on.has(x)).length} of 28 days">${strip.map((x) => `<span class="${on.has(x) ? 'on' : ''}" title="${esc(shortDay(x))}${on.has(x) ? ' · studied' : ''}"></span>`).join('')}</div>
        <p class="muted small stu-days-cap"><span>4 weeks ago</span><span>today</span></p></section>`);
    }

    // 3. every exam of the class
    const per = examsOf().map((e) => ({ e, x: allSums.find((y) => y.examId === e.id && String(y.email).toLowerCase() === r.email.toLowerCase()) }));
    if (per.length > 1) out.push(`<section><h3>All exams in this class</h3><div class="table-wrap" tabindex="0" role="region" aria-label="Practice on every exam"><table class="inst-table compact">
      <thead><tr><th scope="col">Exam</th><th scope="col">Tried</th><th scope="col">Solved</th><th scope="col">Accuracy</th><th scope="col">Readiness</th><th scope="col">Timed test</th></tr></thead>
      <tbody>${per.map(({ e, x }) => `<tr${e.id === examId ? ' class="is-open"' : ''}><th scope="row">${esc(e.title)}</th><td data-label="Tried">${x ? `${x.seen || 0}${x.totalQuestions ? `<span class="muted small">/${x.totalQuestions}</span>` : ''}` : '–'}</td><td data-label="Solved">${x ? Object.values(x.qs || {}).filter((q) => (q?.[0] || 0) > 0).length : '–'}</td><td data-label="Accuracy">${x ? pct(x.accuracy) : '–'}</td><td data-label="Readiness">${x?.readiness ?? '–'}</td><td data-label="Timed test">${x?.realExamBest != null ? x.realExamBest + '%' : '–'}</td></tr>`).join('')}</tbody></table></div></section>`);

    if (r.never) return out.join('');
    // 4. topics
    if ((r.topics || []).length) out.push(`<section><h3>Topics</h3><ul class="inst-topics">${r.topics.map((t) => { const acc = t.right + t.wrong ? t.right / (t.right + t.wrong) : null; return `<li><span class="t-name">${esc(t.name)}</span><span class="t-bar">${meter(acc ?? 0, { tone: acc == null ? 'muted' : toneFor(acc) })}</span><span class="t-num">${pct(acc)}</span><span class="muted small t-tried">${t.seen}/${t.count} tried</span></li>`; }).join('')}</ul></section>`);
    // 5. questions this student keeps getting wrong
    const qs = Object.entries(r.qs || {}).map(([id, v]) => ({ id, right: v?.[0] || 0, wrong: v?.[1] || 0, lastRight: v?.[2] === 1 }));
    const struggling = qs.filter((q) => !q.lastRight || q.wrong > q.right).sort((a, b) => (a.lastRight - b.lastRight) || (b.wrong - a.wrong)).slice(0, 8);
    if (struggling.length) out.push(`<section><h3>Questions to go over with them</h3><p class="muted small">Answered wrong last time, or wrong more often than right.</p><ul class="stu-missed">${struggling.map((q) => { const Q = examData?.questions?.find((x) => x.id === q.id); return `<li><span class="stu-qid">${esc(q.id)}</span><span>${esc((qText(Q) || Q?.topic || '').slice(0, 110))}${qText(Q).length > 110 ? '…' : ''}${Q?.topic ? `<span class="muted small block">${esc(Q.topic)}</span>` : ''}</span><span class="small nowrap"><span class="bad">${q.wrong} wrong</span> · ${q.right} right</span></li>`; }).join('')}</ul></section>`);
    // 6. assignments and code
    if (asgList.length) {
      const asgRows = asgList.map((a) => {
        const st = r.asg?.[a.slug];
        const total = a.tests.length + a.checks.length;
        return `<tr><th scope="row">${esc(a.title)}</th><td data-label="Best">${!st ? '<span class="muted">Not started</span>' : st.done ? `<span class="pill good">Done</span>` : `${st.best}/${st.total || total}`}</td><td data-label="Test runs">${st ? st.attempts : 0}</td><td data-label="Hints">${st ? st.hints : 0}</td><td>${st ? `<button class="link-btn" data-code="${esc(a.slug)}">View code</button>` : ''}</td></tr>`;
      }).join('');
      out.push(`<section><h3>Assignments <span class="muted small">${r.asgDone || 0} of ${asgList.length} done</span></h3><div class="table-wrap" tabindex="0" role="region" aria-label="Assignments"><table class="inst-table compact"><thead><tr><th scope="col">Assignment</th><th scope="col">Best</th><th scope="col">Test runs</th><th scope="col">Hints</th><th scope="col"><span class="sr-only">Code</span></th></tr></thead><tbody>${asgRows}</tbody></table></div><div data-code-view></div></section>`);
    }
    return out.join('');
  }
  async function showCode(b) {
    const r = rows.find((x) => x.email === open);
    const view = main.querySelector('[data-drawer] [data-code-view]');
    if (!r || !view) return;
    view.innerHTML = '<p class="muted">Loading code…</p>';
    try {
      // the code comes with the student's summary (older summaries keep it in a separate record)
      const d = r.codes ? r : await cloud.studentCode(classId, r.uid, examId);
      const code = d?.codes?.[b.dataset.code];
      const a = asgList.find((x) => x.slug === b.dataset.code);
      view.innerHTML = code == null ? '<p class="muted">No saved code for this assignment.</p>'
        : `<h4>${esc(a?.title || b.dataset.code)} <span class="muted small">${d.codeAt?.[b.dataset.code] ? 'saved ' + esc(fmtDate(d.codeAt[b.dataset.code])) : ''}</span></h4><pre class="code-view" tabindex="0"><code class="language-java">${esc(code)}</code></pre>`;
      const c = view.querySelector('code');
      if (c && window.hljs) window.hljs.highlightElement(c);
      view.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    } catch (e) {
      view.innerHTML = `<p class="bad">Couldn't load the code: ${esc(e?.message || e)}</p>`;
    }
  }

  function csv() {
    const head = ['Name', 'Email', 'RedID', 'Section', 'Signed in', 'Last active', 'Questions tried', 'Total questions', 'Accuracy %', 'Quiz readiness', 'Quizzes finished', 'Best timed test %', 'Last timed test %', 'Assignments done',
      ...asgList.map((a) => `${a.title} (best)`)];
    const cell = (v) => { const s = v == null ? '' : String(v); return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s; };
    const lines = [head.map(cell).join(',')];
    for (const r of visibleRows()) {
      lines.push([r.name, r.email, r.redId || '', r.section || '', r.never ? 'no' : 'yes', r.lastActive ? new Date(r.lastActive).toISOString() : '', r.seen || 0, r.totalQuestions || '', r.accuracy == null ? '' : Math.round(r.accuracy * 100),
        r.readiness ?? '', r.attempts || 0, r.realExamBest ?? '', r.realExamLast ?? '', r.asgDone || 0,
        ...asgList.map((a) => { const s = r.asg?.[a.slug]; return s ? (s.done ? 'done' : `${s.best}/${s.total}`) : ''; })].map(cell).join(','));
    }
    const blob = new Blob([lines.join('\n')], { type: 'text/csv' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${classId}-${examId}${section ? '-' + section.replace(/[^\w-]+/g, '_') : ''}-students-${new Date().toLocaleDateString('en-CA')}.csv`;
    document.body.appendChild(link); link.click(); link.remove();
    setTimeout(() => URL.revokeObjectURL(link.href), 2000);
    toast('CSV downloaded');
  }

  main.addEventListener('click', (ev) => {
    const b = ev.target.closest('button');
    if (!b) return;
    if (b.dataset.sectionTab != null) { section = b.dataset.sectionTab; remember('section', section); paint(); body.querySelector('.sec-tabs [aria-selected="true"]')?.focus(); return; }
    if (b.dataset.sort) { if (sortKey === b.dataset.sort) sortDir = -sortDir; else { sortKey = b.dataset.sort; sortDir = b.dataset.sort === 'name' || b.dataset.sort === 'section' ? 1 : -1; } repaintTable(); }
    else if (b.dataset.only) { only = b.dataset.only; repaintTable(); }
    else if (b.dataset.student) { if (open === b.dataset.student && main.querySelector('[data-drawer]')) closeDrawer(); else detail(b.dataset.student); }
    else if (b.dataset.stuGo) detail(b.dataset.stuGo);
    else if ('stuClose' in b.dataset) closeDrawer();
    else if (b.dataset.code) showCode(b);
    else if ('refresh' in b.dataset) { grades = null; load(); }
    else if (b.dataset.delAnn) {
      b.disabled = true;
      cloud.deleteAnnouncement(classId, b.dataset.delAnn).then(async () => { anns = await cloud.listAnnouncements(classId, { fresh: true }); body.querySelector('[data-anns]').innerHTML = annSection(); toast('Announcement deleted'); })
        .catch((e) => { toast("Couldn't delete: " + (e?.message || e), 'bad'); b.disabled = false; });
    }
    else if ('toggleResolved' in b.dataset) { showResolved = !showResolved; body.querySelector('[data-reports]').innerHTML = reportsSection(); }
    else if (b.dataset.resolve) {
      b.disabled = true;
      cloud.setReportStatus(classId, b.dataset.resolve, b.dataset.to).then(() => {
        const r = reports.find((x) => x.id === b.dataset.resolve);
        if (r) { r.status = b.dataset.to; r.resolvedBy = cloud.currentUser().email; }
        body.querySelector('[data-reports]').innerHTML = reportsSection();
      }).catch((e) => { toast("Couldn't update: " + (e?.message || e), 'bad'); b.disabled = false; });
    }
    else if ('showAll' in b.dataset) { b.previousElementSibling.querySelectorAll('[data-extra]').forEach((li) => (li.hidden = false)); b.remove(); }
    else if ('csv' in b.dataset) { if (rows.length) csv(); else toast('No student data to download yet'); }
  });
  main.addEventListener('dblclick', (ev) => {
    const tr = ev.target.closest('tr[data-row]');
    if (tr && !ev.target.closest('button, a, input, select')) { window.getSelection?.()?.removeAllRanges(); detail(tr.dataset.row); }
  });
  main.addEventListener('keydown', (ev) => { if (ev.key === 'Escape' && open && !document.querySelector('.modal-back')) { ev.preventDefault(); closeDrawer(); } });
  main.addEventListener('submit', async (ev) => {
    if (!ev.target.matches('[data-ann-form]')) return;
    ev.preventDefault();
    const f = ev.target, text = f.text.value.trim();
    if (!text) return;
    const btn = f.querySelector('[type=submit]'); btn.disabled = true;
    try {
      await cloud.postAnnouncement(classId, { text, until: f.until.value });
      anns = await cloud.listAnnouncements(classId, { fresh: true });
      body.querySelector('[data-anns]').innerHTML = annSection();
      body.querySelector('.ann-admin').open = true;
      toast('Announcement posted. Students see it on the class page.', 'good');
    } catch (e) { toast("Couldn't post: " + (e?.code === 'permission-denied' ? 'only this class\'s instructors can post.' : e?.message || e), 'bad'); btn.disabled = false; }
  });
  main.addEventListener('input', (ev) => { if (ev.target.matches('[data-filter]')) { filter = ev.target.value; repaintTable(); } });
  main.querySelector('[data-exam]').addEventListener('change', (ev) => {
    examId = ev.target.value;
    remember('exam', examId);
    load();
  });
  main.querySelector('[data-class]').addEventListener('change', (ev) => {
    classId = ev.target.value;
    remember('class', classId);
    grades = null; if (open) closeDrawer();
    main.querySelector('[data-content-link]').href = `#/content/${encodeURIComponent(classId)}`;
    main.querySelector('[data-analytics-link]').href = `#/analytics?class=${encodeURIComponent(classId)}`;
    section = '';
    pickExam(); fillExams();
    load();
  });
  main.addEventListener('change', (ev) => {
    if (ev.target.matches('[data-group]')) { grouped = ev.target.checked; remember('grouped', grouped ? 'yes' : 'no'); repaintTable(); }
    if (ev.target.matches('[data-sort-select]')) { sortKey = ev.target.value; sortDir = sortKey === 'name' || sortKey === 'section' ? 1 : -1; repaintTable(); }
  });
  await load();
}
