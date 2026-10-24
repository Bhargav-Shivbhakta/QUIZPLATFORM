// Instructor dashboard: how every signed-in student is doing on one exam.
// Only accounts listed in firestore.rules can read this data; everyone else gets "not allowed".
import { getManifest, getAssignments } from '../data.js';
import * as cloud from '../cloud.js';
import { esc, icon, meter, toneFor, plural, modal, toast } from '../ui.js';
import { fmtDate } from '../engine.js';

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
  { key: 'realExamBest', label: 'Best real exam', sort: (s) => s.realExamBest ?? -1 },
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
  let asgList = [];
  let sortKey = 'name', sortDir = 1, filter = '', only = 'all';

  main.innerHTML = `
    <section class="page instructor">
      <header class="inst-head">
        <div>
          <p class="eyebrow">Instructor</p>
          <h1>Class dashboard</h1>
          <p class="muted">Updates within a couple of minutes of students studying. Only you can see this page.</p>
        </div>
        <div class="row">
          <label class="field inline"><span class="sr-only">Class</span>
            <select data-class>${classes.map((c) => `<option value="${esc(c.id)}" ${c.id === classId ? 'selected' : ''}>${esc(c.name)}</option>`).join('')}</select>
          </label>
          <label class="field inline"><span class="sr-only">Exam</span><select data-exam></select></label>
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
  const inSection = (r) => !section || (r.section || '').split(', ').includes(section);
  const started = () => rows.filter((r) => !r.never && inSection(r));
  const enrolled = () => rows.filter((r) => !r.dropped && inSection(r));

  async function load() {
    body.innerHTML = '<p class="muted loading-line">Loading student data…</p>';
    try {
      if (!examId) { body.innerHTML = '<div class="empty-state"><h2>This class has no exams yet</h2></div>'; return; }
      let sums;
      [sums, roster, asgList] = await Promise.all([cloud.classSummaries(classId), cloud.getRoster(classId), getAssignments(examId).catch(() => [])]);
      sums = sums.filter((x) => x.examId === examId);
      const students = roster.filter((p) => p.role !== 'instructor');
      const byEmail = new Map(students.map((p) => [p.email, p]));
      rows = sums.map((x) => { const p = byEmail.get(x.email); return { ...x, name: p?.name || x.name, redId: p?.redId || '', section: p?.section || x.section || '', dropped: !p }; });
      const have = new Set(rows.map((r) => r.email));
      for (const p of students) if (!have.has(p.email)) rows.push({ uid: null, email: p.email, name: p.name, redId: p.redId, section: p.section, never: true });
    } catch (e) {
      body.innerHTML = e?.code === 'permission-denied'
        ? `<div class="empty-state"><h2>You're not an instructor for this class</h2><p>Ask the site admin to add your email to this class on the Admin page.</p></div>`
        : `<div class="empty-state"><h2>Couldn't load student data</h2><p>${esc(e?.message || String(e))}</p></div>`;
      return;
    }
    paint();
  }

  function overview() {
    const rows = started();
    const now = Date.now();
    const active7 = rows.filter((r) => r.lastActive && now - r.lastActive < 7 * DAY).length;
    const total = rows[0]?.totalQuestions || 0;
    const asgTotal = asgList.length;
    const tile = (big, label, sub = '') => `<div class="stat-tile"><strong>${big}</strong><span>${label}</span>${sub ? `<span class="muted small">${sub}</span>` : ''}</div>`;
    return `<div class="stat-tiles">
      ${tile(`${rows.length}<span class="of"> / ${enrolled().length}</span>`, 'students have started', `${Math.max(0, enrolled().length - rows.filter((r) => !r.dropped).length)} haven't signed in yet`)}
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
      <ul class="inst-topics">${list.map((t) => `
        <li><span class="t-name">${esc(t.name)}</span>
          <span class="t-bar">${meter(t.acc ?? 0, { tone: t.acc == null ? 'muted' : toneFor(t.acc) })}</span>
          <span class="t-num">${pct(t.acc)}</span>
          <span class="muted small t-tried">${t.tried}/${denom} tried</span></li>`).join('')}</ul>`;
  }

  function assignments() {
    const rows = started();
    const denom = enrolled().length;
    if (!asgList.length) return '';
    return `<h2 class="section-title">Programming assignments</h2>
      <ul class="inst-topics">${asgList.map((a) => {
        const st = rows.map((r) => r.asg?.[a.slug]).filter(Boolean);
        const done = st.filter((x) => x.done).length;
        const started = st.length;
        const avgH = st.length ? st.reduce((s, x) => s + (x.hints || 0), 0) / st.length : 0; const hints = Number.isInteger(avgH) ? String(avgH) : avgH.toFixed(1);
        return `<li><span class="t-name">${esc(a.title)}</span>
          <span class="t-bar">${meter(denom ? done / denom : 0, { tone: 'good' })}</span>
          <span class="t-num">${done}/${denom}</span>
          <span class="muted small t-tried">${started} started · ${hints} hints avg</span></li>`;
      }).join('')}</ul>`;
  }

  function visibleRows() {
    const q = filter.trim().toLowerCase();
    const now = Date.now();
    let list = rows.filter((r) => inSection(r) && (!q || (r.name || '').toLowerCase().includes(q) || (r.email || '').includes(q) || (r.redId || '').includes(q)));
    if (only === 'never') list = list.filter((r) => r.never);
    if (only === 'inactive') list = list.filter((r) => !r.never && (!r.lastActive || now - r.lastActive >= 7 * DAY));
    if (only === 'low') list = list.filter((r) => !r.never && (r.readiness ?? 0) < 40);
    const col = COLS.find((c) => c.key === sortKey);
    return list.sort((a, b) => { const x = col.sort(a), y = col.sort(b); return (x < y ? -1 : x > y ? 1 : 0) * sortDir; });
  }

  function table() {
    const list = visibleRows();
    return `
      <h2 class="section-title">Students</h2>
      <div class="inst-tools">
        <input type="search" placeholder="Search name, email or RedID" value="${esc(filter)}" data-filter aria-label="Search students">
        <div class="seg" role="tablist" aria-label="Show">
          ${[['all', 'Everyone'], ['never', 'Not started'], ['inactive', 'Inactive 7+ days'], ['low', 'Readiness under 40']].map(([k, l]) => `<button role="tab" data-only="${k}" aria-selected="${only === k}">${l}</button>`).join('')}
        </div>
      </div>
      <div class="table-wrap inst-table-wrap">
        <table class="inst-table">
          <thead><tr>${COLS.map((c) => `<th scope="col" aria-sort="${sortKey === c.key ? (sortDir > 0 ? 'ascending' : 'descending') : 'none'}"><button data-sort="${c.key}">${c.label}${sortKey === c.key ? (sortDir > 0 ? ' ▲' : ' ▼') : ''}</button></th>`).join('')}</tr></thead>
          <tbody>
            ${list.map((r) => `
              <tr>
                <td>${r.never ? `<strong>${esc(r.name || r.email)}</strong>` : `<button class="link-btn" data-student="${esc(r.uid)}">${esc(r.name || r.email)}</button>`}<span class="muted small block">${esc(r.email)}${r.redId ? ' · ' + esc(r.redId) : ''}${r.dropped ? ' · <span class="bad">not on roster</span>' : ''}</span></td>
                <td>${esc(r.section || '–')}</td>
                <td>${r.never ? '<span class="muted">Never signed in</span>' : ago(r.lastActive)}</td>
                <td>${r.seen || 0}${r.totalQuestions ? ` <span class="muted small">/ ${r.totalQuestions}</span>` : ''}</td>
                <td><span class="pill ${toneFor(r.accuracy)}">${pct(r.accuracy)}</span></td>
                <td>${r.readiness ?? '–'}</td>
                <td>${r.realExamBest != null ? r.realExamBest + '%' : '–'}</td>
                <td>${r.asgDone || 0}${asgList.length ? ` <span class="muted small">/ ${asgList.length}</span>` : ''}</td>
              </tr>`).join('') || `<tr><td colspan="${COLS.length}" class="muted">No students match.</td></tr>`}
          </tbody>
        </table>
      </div>`;
  }

  function paint() {
    const sections = [...new Set(rows.flatMap((r) => (r.section || '').split(', ').filter(Boolean)))].sort();
    const sectionPicker = sections.length > 1 ? `<label class="field inline section-pick"><span>Section</span><select data-section><option value="">All sections</option>${sections.map((x) => `<option ${x === section ? 'selected' : ''}>${esc(x)}</option>`).join('')}</select></label>` : '';
    if (!rows.length) {
      body.innerHTML = `<div class="empty-state"><h2>No students yet</h2><p>Upload this class's roster on the Admin page. Students appear here once they're on the roster.</p></div>`;
      return;
    }
    body.innerHTML = sectionPicker + overview() + (started().length ? topics() + assignments() : '<p class="muted">Nobody has started this exam yet. Topic and assignment results show up once students begin.</p>') + `<div data-table>${table()}</div>`;
  }
  const repaintTable = () => { const t = body.querySelector('[data-table]'); if (t) { const had = document.activeElement?.matches('[data-filter]'); t.innerHTML = table(); if (had) { const f = t.querySelector('[data-filter]'); f.focus(); f.setSelectionRange(f.value.length, f.value.length); } } };

  function detail(uid) {
    const r = rows.find((x) => x.uid === uid);
    if (!r) return;
    const asgRows = asgList.map((a) => {
      const s = r.asg?.[a.slug];
      const total = a.tests.length + a.checks.length;
      return `<tr><td>${esc(a.title)}</td><td>${!s ? '<span class="muted">Not started</span>' : s.done ? `<span class="pill good">Done</span>` : `${s.best}/${s.total || total}`}</td><td>${s ? s.attempts : 0}</td><td>${s ? s.hints : 0}</td><td>${s ? `<button class="link-btn" data-code="${esc(a.slug)}">View code</button>` : ''}</td></tr>`;
    }).join('');
    const m = modal({
      title: r.name || r.email,
      wide: true,
      body: `
        <p class="muted">${esc(r.email)} · last active ${esc(ago(r.lastActive))} · ${plural(r.attempts || 0, 'quiz', 'quizzes')} finished</p>
        <div class="stat-tiles small">
          <div class="stat-tile"><strong>${r.seen || 0}${r.totalQuestions ? `/${r.totalQuestions}` : ''}</strong><span>questions tried</span></div>
          <div class="stat-tile"><strong>${pct(r.accuracy)}</strong><span>accuracy</span></div>
          <div class="stat-tile"><strong>${r.readiness ?? '–'}</strong><span>quiz readiness</span></div>
          <div class="stat-tile"><strong>${r.realExamBest != null ? r.realExamBest + '%' : '–'}</strong><span>best real exam${r.realExamLast != null ? ` (last ${r.realExamLast}%)` : ''}</span></div>
        </div>
        ${(r.topics || []).length ? `<h3>Topics</h3><ul class="inst-topics">${r.topics.map((t) => { const acc = t.right + t.wrong ? t.right / (t.right + t.wrong) : null; return `<li><span class="t-name">${esc(t.name)}</span><span class="t-bar">${meter(acc ?? 0, { tone: acc == null ? 'muted' : toneFor(acc) })}</span><span class="t-num">${pct(acc)}</span><span class="muted small t-tried">${t.seen}/${t.count} tried</span></li>`; }).join('')}</ul>` : ''}
        ${asgList.length ? `<h3>Assignments</h3><div class="table-wrap"><table class="inst-table compact"><thead><tr><th>Assignment</th><th>Best</th><th>Test runs</th><th>Hints</th><th></th></tr></thead><tbody>${asgRows}</tbody></table></div>
        <div data-code-view></div>` : ''}`,
    });
    m.el.addEventListener('click', async (ev) => {
      const b = ev.target.closest('[data-code]');
      if (!b) return;
      const view = m.el.querySelector('[data-code-view]');
      view.innerHTML = '<p class="muted">Loading code…</p>';
      try {
        const d = await cloud.studentCode(classId, r.uid, examId);
        const code = d?.codes?.[b.dataset.code];
        const a = asgList.find((x) => x.slug === b.dataset.code);
        view.innerHTML = code == null ? '<p class="muted">No saved code for this assignment.</p>'
          : `<h3>${esc(a?.title || b.dataset.code)} <span class="muted small">${d.codeAt?.[b.dataset.code] ? 'saved ' + esc(fmtDate(d.codeAt[b.dataset.code])) : ''}</span></h3><pre class="code-view" tabindex="0"><code class="language-java">${esc(code)}</code></pre>`;
        const c = view.querySelector('code');
        if (c && window.hljs) window.hljs.highlightElement(c);
        view.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      } catch (e) {
        view.innerHTML = `<p class="bad">Couldn't load the code: ${esc(e?.message || e)}</p>`;
      }
    });
  }

  function csv() {
    const head = ['Name', 'Email', 'RedID', 'Section', 'Signed in', 'Last active', 'Questions tried', 'Total questions', 'Accuracy %', 'Quiz readiness', 'Quizzes finished', 'Best real exam %', 'Last real exam %', 'Assignments done',
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
    link.download = `${classId}-${examId}-students-${new Date().toLocaleDateString('en-CA')}.csv`;
    document.body.appendChild(link); link.click(); link.remove();
    setTimeout(() => URL.revokeObjectURL(link.href), 2000);
    toast('CSV downloaded');
  }

  main.addEventListener('click', (ev) => {
    const b = ev.target.closest('button');
    if (!b) return;
    if (b.dataset.sort) { if (sortKey === b.dataset.sort) sortDir = -sortDir; else { sortKey = b.dataset.sort; sortDir = b.dataset.sort === 'name' ? 1 : -1; } repaintTable(); }
    else if (b.dataset.only) { only = b.dataset.only; repaintTable(); }
    else if (b.dataset.student) detail(b.dataset.student);
    else if ('refresh' in b.dataset) load();
    else if ('csv' in b.dataset) { if (rows.length) csv(); else toast('No student data to download yet'); }
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
    section = '';
    pickExam(); fillExams();
    load();
  });
  main.addEventListener('change', (ev) => { if (ev.target.matches('[data-section]')) { section = ev.target.value; paint(); } });
  await load();
}
