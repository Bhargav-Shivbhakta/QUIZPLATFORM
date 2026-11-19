// One class, for students: four tabs (DECISIONS › Student navigation).
// Study plan: the units on the way to the next exam, today's stop, and graded work as flags; its line
//   traces down to today's stop each time the tab opens (DESIGN › Motion).
// Practice: question sets and coding practice. Notes: the units' notes. Graded work: exams, quizzes,
//   assignments and scores. The pages they open (practice, flashcards, coding, notes) are today's screens.
import * as cloud from '../cloud.js';
import * as store from '../store.js';
import { esc, icon, plural, confirmDialog } from '../ui.js';
import { daysUntil } from '../today.js';
import { weekday, dateTime, time } from '../format.js';
import { buddy, motionLevel } from '../buddy.js';
import { classColor } from '../stshell.js';
import { classData, clearClassData, redrawAfterFirstSync } from './st-data.js';
import { resumeBanner } from './home.js';
import { announcementBanners, bindAnnouncements } from './announce.js';

const TABS = [['plan', 'Study plan'], ['practice', 'Practice'], ['notes', 'Notes'], ['graded', 'Graded work']];
const e = encodeURIComponent;
const word = (w) => `<span class="st-word st-word-${w === 'Solid' ? 'solid' : w === 'Getting there' ? 'there' : 'none'}">${esc(w)}</span>`;

export async function render(main, { classId }, query = {}) {
  const cls = cloud.myClasses().find((c) => c.id === classId);
  if (!cls) { main.innerHTML = '<section class="st-page"><h1>Class not found</h1><p>You\'re not on the roster for this class.</p><p><a class="st-btn" href="#/">Go to Today</a></p></section>'; return; }
  await cloud.freshClassContent();
  clearClassData();
  const [d, ann] = await Promise.all([classData(cls), announcementBanners(cls.id, { staff: false }).catch(() => '')]);
  const tab = TABS.some(([k]) => k === query.tab) ? query.tab : 'plan';
  const cc = classColor(cls);
  const body = tab === 'plan' ? planTab(d) : tab === 'practice' ? practiceTab(d) : tab === 'notes' ? notesTab(d) : gradedTab(d);
  main.innerHTML = `
    <section class="st-page st-class cc-${cc}">
      <header class="st-chead"><div><p class="st-muted st-small">${esc([cls.term, cls.section ? `Section ${cls.section}` : ''].filter(Boolean).join(' · '))}</p>
        <h1><span class="st-cdot" aria-hidden="true"></span>${esc(cls.course ? `${cls.course} · ${cls.name}` : cls.name)}</h1></div>
        ${d.tools.tutor ? `<a class="st-btn st-btn-ghost st-sm" href="#/mystudy/${e(cls.id)}">${icon('sparkle')} Ask the tutor</a>` : ''}</header>
      ${ann}
      <nav class="st-tabs-c" aria-label="${esc(cls.course || cls.name)}">${TABS.map(([k, l]) => `<a href="#/class/${e(cls.id)}${k === 'plan' ? '' : `?tab=${k}`}" ${k === tab ? 'aria-current="page"' : ''}>${l}</a>`).join('')}</nav>
      ${body}
    </section>`;
  bindAnnouncements(main);
  if (tab === 'plan') trace(main);
  main.addEventListener('click', async (ev) => {
    if (!ev.target.closest('[data-discard]')) return;
    const ok = await confirmDialog({ title: 'Discard this quiz?', body: '<p>Your answers in the unfinished quiz will be lost. Your saved progress stays.</p>', confirm: 'Discard', danger: true });
    if (ok) { store.clearSession(); main.querySelector('.resume-banner')?.remove(); }
  });
  return redrawAfterFirstSync();
}

// ---------- Study plan ----------
function planTab(d) {
  const { cls, now } = d;
  const nodes = [];
  const later = [];
  if (d.units.length) {
    d.openUnits.forEach((u, i) => {
      const isCur = i === d.openUnits.length - 1, read = !!store.get(`read:${cls.id}:${u.id}`, 0);
      if (!isCur) nodes.push({ kind: read ? 'done' : 'past', n: u.n, title: `Unit ${u.n} · ${u.title}`, meta: read ? 'Notes read' : 'Notes not read yet', href: `#/study/${e(cls.id)}/${e(u.id)}` });
      else nodes.push({ kind: 'unit', n: u.n, title: `Unit ${u.n} · ${u.title}`, meta: 'This week', href: `#/study/${e(cls.id)}/${e(u.id)}` });
    });
    d.units.filter((u) => u.opensAt > now).forEach((u) => later.push({ kind: 'later', n: u.n, at: u.opensAt, title: `Unit ${u.n} · ${u.title}`, meta: `Opens ${weekday(u.opensAt)}` }));
  } else {
    d.sets.forEach((s, i) => nodes.push({ kind: s.word === 'Solid' ? 'done' : 'past', n: i + 1, title: s.title, meta: `${s.score}% · ${s.word}`, href: `#/exam/${e(s.id)}` }));
    d.coding.filter((c) => c.onlyCoding).forEach((c) => nodes.push({ kind: c.done === c.total ? 'done' : 'past', n: nodes.length + 1, title: c.title, meta: `${c.done} of ${c.total} coding assignments done`, href: `#/exam/${e(c.id)}` }));
  }
  d.graded.filter((g) => (g.until || g.at) > now).forEach((g) => later.push({ kind: 'exam', at: g.at, title: g.title, meta: `${g.kindLabel} · ${dateTime(g.at)}`, href: g.href }));
  d.dates.filter((x) => daysUntil(x.at, now) >= 0 && !d.graded.some((g) => daysUntil(g.at, x.at) === 0)).forEach((x) => later.push({ kind: 'exam', at: x.at, title: x.title, meta: weekday(x.at) }));
  later.sort((a, b) => a.at - b.at);
  const open = d.tasks.filter((t) => !t.done), mins = open.reduce((n, t) => n + t.minutes, 0);
  const todayNode = { kind: open.length ? 'now' : 'fin', title: open.length ? `Today · ${mins} minutes` : 'Today · done', meta: open.length ? open.map((t) => t.title).join(' · ') : 'Nothing waiting. Practise anything you like.', href: open[0]?.href, mins };
  const all = [...nodes, todayNode, ...later];
  const first = !store.get(`seenPlan:${cls.id}`, false); store.set(`seenPlan:${cls.id}`, true);
  const bubble = (x) => (x.kind === 'done' || x.kind === 'fin' ? icon('check') : x.kind === 'exam' ? icon('flag') : x.kind === 'now' ? String(x.mins) : esc(String(x.n ?? '')));
  const ready = d.sets.length ? `<section class="st-card"><h2>How ready you are</h2><p class="st-big-num">${d.ready}% <span>${esc(d.word)}</span></p>
      <ul class="st-bars">${d.sets.flatMap((s) => s.topics).filter((t) => t.count).sort((a, b) => (a.seen ? a.mastery : 2) - (b.seen ? b.mastery : 2)).slice(0, 5).map((t) => `<li><span class="st-bar-h"><span>${esc(t.name)}</span><span class="st-muted st-small">${t.seen ? `${Math.round(t.mastery * 100)}%` : 'Not started'}</span></span><span class="st-bar"><i data-w="${Math.round(t.mastery * 100)}"></i></span></li>`).join('')}</ul></section>` : '';
  return `${resumeBanner()}<div class="st-cols">
    <section class="st-card" aria-labelledby="plan-h"><h2 id="plan-h" class="sr-only">Study plan</h2><div class="st-plan-wrap" data-plan><span class="st-trace" aria-hidden="true"></span><ol class="st-plan">
      ${all.map((x) => `<li class="st-node ${x.kind} ${x.kind === 'now' && first ? 'pulse' : ''}"><span class="st-bubble" aria-hidden="true">${bubble(x)}</span>
        <div class="st-node-body"><h3>${x.href && x.kind !== 'now' ? `<a href="${x.href}">${esc(x.title)}</a>` : esc(x.title)}</h3><p class="st-muted st-small">${esc(x.meta)}</p>
        ${x.kind === 'now' ? `<a class="st-btn st-sm" href="${x.href}">Start</a>` : x.kind === 'fin' ? `<a class="st-btn st-btn-ghost st-sm" href="#/class/${e(cls.id)}?tab=practice">Practise more</a>` : ''}</div></li>`).join('')}
    </ol></div></section>
    <div class="st-stack">${ready}${!d.units.length && !d.sets.length && !d.coding.length ? `<section class="st-card st-empty">${buddy('calm', { size: 72 })}<h3>Nothing here yet</h3><p class="st-muted">Your professor hasn't opened any practice or notes for this class yet.</p></section>` : ''}</div></div>`;
}
// The line traces down to today's stop (or the last done stop) each time the tab opens.
function trace(main) {
  const plan = main.querySelector('[data-plan]'), line = plan?.querySelector('.st-trace');
  const end = plan?.querySelector('.st-node.now, .st-node.fin'), first = plan?.querySelector('.st-node');
  if (!line || !end || !first || end === first) return;
  const top = first.offsetTop + 24, h = end.offsetTop + 24 - top;
  line.style.top = `${top}px`; line.style.height = `${Math.max(0, h)}px`;
  const m = motionLevel();
  line.classList.add(m === 'none' ? 'still' : m === 'soft' ? 'go soft' : 'go');
  main.querySelectorAll('.st-bar i[data-w]').forEach((i) => { i.style.width = `${i.dataset.w}%`; });
}

// ---------- Practice ----------
function practiceTab(d) {
  const { cls } = d;
  const qs = d.sets.map((s) => `<li class="st-row"><div class="st-grow"><a class="st-row-title" href="#/exam/${e(s.id)}">${esc(s.title)}</a><span class="st-muted st-small">${plural(s.questions, 'question')}${s.mistakes ? ` · ${plural(s.mistakes, 'mistake')} to fix` : ''}${s.due ? ` · ${s.due} coming back` : ''}</span></div>
      <span class="st-ready">${s.seen ? `${s.score}% · ` : ''}${word(s.word)}</span>
      <span class="st-row-acts"><a class="st-btn st-sm" href="#/exam/${e(s.id)}">Practise</a><a class="st-btn st-btn-ghost st-sm" href="#/cards/${e(s.id)}">Flashcards</a>${s.questions >= 5 ? `<a class="st-btn st-btn-ghost st-sm" href="#/start/${e(s.id)}/exam">Practice test</a>` : ''}</span></li>`).join('');
  const code = d.coding.map((c) => `<li class="st-row"><div class="st-grow"><a class="st-row-title" href="#/${c.onlyCoding ? 'exam' : 'assignments'}/${e(c.id)}">${esc(c.onlyCoding ? c.title : `${c.title}: coding`)}</a><span class="st-muted st-small">${plural(c.total, 'coding assignment')} · ${c.done} done</span></div>
      <span class="st-ready">${c.done === c.total ? word('Solid') : c.started ? word('Getting there') : word('Not started')}</span>
      <span class="st-row-acts"><a class="st-btn st-sm" href="#/${c.onlyCoding ? 'exam' : 'assignments'}/${e(c.id)}">${c.started ? 'Continue' : 'Start coding'}</a></span></li>`).join('');
  return `${resumeBanner()}
    ${qs ? `<section class="st-card"><h2>Question sets</h2><ul class="st-rows">${qs}</ul></section>` : ''}
    ${code ? `<section class="st-card"><h2>Coding practice</h2><ul class="st-rows">${code}</ul></section>` : ''}
    ${!qs && !code ? `<section class="st-card st-empty">${buddy('calm', { size: 72 })}<h3>No practice open right now</h3><p class="st-muted">Your professor will open the next set. Nothing here counts toward your grade.</p></section>` : '<p class="st-muted st-small">Practice never counts toward your grade. Try it as often as you like.</p>'}`;
}

// ---------- Notes ----------
function notesTab(d) {
  const { cls, now } = d;
  if (!d.units.length) return `<section class="st-card st-empty">${buddy('read', { size: 72 })}<h3>No notes yet</h3><p class="st-muted">Notes for each unit appear here when your professor adds them.</p></section>`;
  return `<section class="st-card"><ul class="st-rows">${d.units.map((u) => {
    const open = u.opensAt <= now, read = !!store.get(`read:${cls.id}:${u.id}`, 0);
    return `<li class="st-row ${open ? '' : 'later'}"><div class="st-grow">${open ? `<a class="st-row-title" href="#/study/${e(cls.id)}/${e(u.id)}">Unit ${u.n} · ${esc(u.title)}</a>` : `<span class="st-row-title">Unit ${u.n} · ${esc(u.title)}</span>`}</div>
      <span class="st-muted st-small">${open ? (read ? 'Read' : 'Not read yet') : `Opens ${weekday(u.opensAt)}`}</span></li>`;
  }).join('')}</ul></section>`;
}

// ---------- Graded work ----------
function gradedTab(d) {
  const { now } = d;
  const open = d.graded.filter((g) => g.at <= now && now < g.until), soon = d.graded.filter((g) => g.at > now), past = d.graded.filter((g) => g.until && g.until <= now).reverse();
  const row = (g, label, primary) => `<li class="st-row"><div class="st-grow"><a class="st-row-title" href="${g.href}">${esc(g.title)}</a><span class="st-muted st-small">${esc(g.kindLabel)} · ${primary === 'open' ? `open now, closes ${time(g.until)}` : primary === 'soon' ? `opens ${dateTime(g.at)}` : `closed ${dateTime(g.until)}`}${g.minutes ? ` · ${g.minutes} minutes` : ''}${g.requireCode && primary !== 'past' ? ' · access code given in class' : ''}</span></div>
    <a class="st-btn ${primary === 'open' ? '' : 'st-btn-ghost'} st-sm" href="${g.href}">${label}</a></li>`;
  if (!d.graded.length) return `<section class="st-card st-empty">${buddy('calm', { size: 72 })}<h3>No graded work yet</h3><p class="st-muted">Exams, quizzes and assignments appear here when your professor posts them.</p></section>`;
  return `${open.length ? `<section class="st-card"><h2>Open now</h2><ul class="st-rows">${open.map((g) => row(g, `Start ${g.kindLabel.toLowerCase()}`, 'open')).join('')}</ul></section>` : ''}
    ${soon.length ? `<section class="st-card"><h2>Coming up</h2><ul class="st-rows">${soon.map((g) => row(g, 'Details', 'soon')).join('')}</ul></section>` : ''}
    ${past.length ? `<section class="st-card"><h2>Done</h2><ul class="st-rows">${past.map((g) => row(g, g.released ? 'See score' : 'Details', 'past')).join('')}</ul></section>` : ''}
    <p class="st-muted st-small">Graded work counts toward your grade: one attempt, timed, full screen.</p>`;
}
