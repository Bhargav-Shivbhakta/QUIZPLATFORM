// Today, for students (DECISIONS › Student navigation): the nearest exam as a countdown, how ready they
// are (number and word), one Start button for today's short set, this week, and what's coming up.
// One Today for all classes, with a filter per class; a student with one class sees no filters.
import * as cloud from '../cloud.js';
import * as store from '../store.js';
import { esc, icon, plural, confirmDialog, bigRing } from '../ui.js';
export { bigRing };
import { nextExam, comingUp, daysUntil, weekDays, todaySummary, hopDue } from '../today.js';
import { dayKey, weekday, time, longDay } from '../format.js';
import { buddy, buddyKind, motionLevel, tap, follow, hop } from '../buddy.js';
import { hopTargets, classColor } from '../stshell.js';
import { codeParts } from '../navmap.js';
import { classData, examItems, clearClassData, redrawAfterFirstSync } from './st-data.js';
import { resumeBanner } from './home.js';
// the class code as the bar shows it ("CS 150", whatever spacing the record has)
const codeOf = (c) => codeParts(c.course, c.name).code || c.course || c.name || '';


export function fillRings(root, delayMs = 0) {
  const go = () => root.querySelectorAll('.st-ring-fill[data-off]').forEach((el) => { el.style.strokeDashoffset = el.dataset.off; });
  if (motionLevel() === 'none') { go(); return; }
  setTimeout(() => requestAnimationFrame(() => requestAnimationFrame(go)), delayMs);
}
const greeting = (h) => (h < 12 ? 'Good morning' : h < 18 ? 'Good afternoon' : 'Good evening');

export async function render(main, params, query = {}) {
  await cloud.freshClassContent();
  clearClassData();
  const mine = cloud.myClasses();
  const all = await Promise.all(mine.map((c) => classData(c).catch(() => null)));
  const data = all.filter(Boolean);
  const filter = data.some((d) => d.cls.id === query.c) ? query.c : 'all';
  const shown = filter === 'all' ? data : data.filter((d) => d.cls.id === filter);
  const now = cloud.trueNow();
  const items = examItems(shown);
  const exam = nextExam(items, now);
  const examData = exam ? shown.find((d) => d.cls.id === exam.classId) : shown[0];
  const after = comingUp(items, now, 6).filter((x) => x !== exam);
  // work on the class whose exam is nearest first
  const order = [...shown].sort((a, b) => (a.cls.id === exam?.classId ? -1 : b.cls.id === exam?.classId ? 1 : 0));
  const sum = todaySummary(order.map((d) => ({ classId: d.cls.id, tasks: d.tasks })));
  const fresh = shown.reduce((n, d) => n + d.tasks.filter((t) => !t.done && ['read', 'practice', 'new', 'code'].includes(t.key)).length, 0);
  const mistakes = shown.reduce((n, d) => n + d.mistakes, 0), due = shown.reduce((n, d) => n + d.due, 0);
  const today = dayKey(now), firstName = (cloud.currentUser().displayName || '').split(' ')[0];
  const hopNow = hopDue(store.get('buddyHop', ''), today) && buddyKind() === 'dot' && motionLevel() === 'full';
  const kind = buddyKind();
  const cc = classColor(examData?.cls);

  const filters = data.length > 1 ? `<div class="st-filters" role="group" aria-label="Show">${[['all', 'All classes']].concat(data.map((d) => [d.cls.id, codeOf(d.cls)])).map(([id, label]) => `<a class="st-chip ${id === 'all' ? '' : `cc-${classColor(data.find((d) => d.cls.id === id).cls)}`}" href="#/${id === 'all' ? '' : `?c=${encodeURIComponent(id)}`}" aria-current="${filter === id ? 'true' : 'false'}">${id === 'all' ? '' : '<span class="st-cdot" aria-hidden="true"></span>'}${esc(label)}</a>`).join('')}</div>` : '';

  // the countdown, or today's minutes when no exam is coming
  let big = '', unit = '', eyebrow = '', when = '';
  if (exam) {
    const n = daysUntil(exam.at, now), open = exam.until && exam.at <= now && now < exam.until;
    eyebrow = `<span class="st-cdot cc-${classColor(examData?.cls)}" aria-hidden="true"></span>${esc(examData ? codeOf(examData.cls) : '')} · ${esc(exam.title)}`;
    if (open) { big = 'Now'; unit = 'open'; when = `Closes ${time(exam.until)}`; }
    else if (n === 0) { big = 'Today'; unit = ''; when = exam.kind === 'date' ? 'Good luck.' : `At ${time(exam.at)}`; }
    else { big = String(n); unit = n === 1 ? 'day to go' : 'days to go'; when = exam.kind === 'date' ? weekday(exam.at, new Date(now)) : `${weekday(exam.at, new Date(now))} at ${time(exam.at)}`; }
  } else if (sum.left) { eyebrow = 'Today'; big = String(sum.minutes); unit = 'minutes'; when = 'No exam scheduled yet.'; }
  const rolled = hopNow && exam && /^\d+$/.test(big) ? `<b class="st-roll go"><span class="st-reel"><span>${Number(big) + 1}</span><span>${big}</span></span></b>` : `<b>${esc(big)}</b>`;
  const chips = [mistakes ? `<span class="st-hchip"><b>${mistakes}</b> to fix</span>` : '', due ? `<span class="st-hchip"><b>${due}</b> coming back</span>` : '', fresh ? `<span class="st-hchip"><b>${fresh}</b> new</span>` : ''].join('');
  const start = sum.first ? `<a class="st-btn st-btn-light" href="${sum.first.href}">Start today's ${sum.minutes} minutes</a>` : '';
  const practiceMore = shown[0] ? `<a class="st-btn st-btn-light" href="#/class/${encodeURIComponent(shown[0].cls.id)}?tab=practice">Practice more</a>` : '';
  const openExam = exam && exam.until && exam.at <= now && now < exam.until ? `<a class="st-btn st-btn-ghost" href="${exam.href}">Go to ${esc(exam.title)}</a>` : '';
  const hero = sum.done
    ? `<section class="st-hero cc-${cc}" aria-label="Today">
        <div class="st-hero-main"><p class="st-eyebrow">${icon('check')} Done for today</p><div class="st-big st-big-done">${buddy('happy', { size: 60, cls: 'bd-idle' })}<b>Nice work${firstName ? `, ${esc(firstName)}` : ''}.</b></div>
          <p class="st-when">${exam ? `${esc(exam.title)} ${big === 'Today' || big === 'Now' ? 'is today' : `is in ${big} ${Number(big) === 1 ? 'day' : 'days'}`}. ` : ''}Tomorrow's set is ready in the morning.</p></div>
        ${examData && examData.sets.length ? bigRing(examData.ready, examData.word, cc) : ''}
        <div class="st-go">${practiceMore}${openExam}</div></section>`
    : exam || sum.left ? `<section class="st-hero cc-${cc}" aria-label="${exam ? `${esc(exam.title)} countdown` : 'Today'}">
        <div class="st-hero-main"><p class="st-eyebrow">${eyebrow}</p><div class="st-big">${rolled}${unit ? `<span>${esc(unit)}</span>` : ''}</div><p class="st-when">${esc(when)}</p></div>
        ${examData && examData.sets.length ? bigRing(examData.ready, examData.word, cc) : ''}
        ${after[0] && exam ? `<p class="st-then"><span class="st-cdot cc-${classColor(data.find((d) => d.cls.id === after[0].classId)?.cls)}" aria-hidden="true"></span>Then <b>${esc(after[0].title)}</b> · ${esc(weekday(after[0].at, new Date(now)))}</p>` : ''}
        <div class="st-go">${start || practiceMore}${openExam}${chips ? `<div class="st-hchips">${chips}</div>` : ''}</div></section>`
    : `<section class="st-hero cc-${cc}" aria-label="Today"><div class="st-hero-main"><p class="st-eyebrow">Today</p><div class="st-big st-big-done">${buddy('calm', { size: 56, cls: 'bd-idle' })}<b>You're up to date.</b></div><p class="st-when">Nothing is waiting. Practice anything you like, or come back when the next unit opens.</p></div><div class="st-go">${practiceMore}</div></section>`;

  const week = weekDays(store.getActivity(), now, dayKey);
  const GOAL = Math.min(5, Math.max(2, Number(store.getSettings().weekGoal) || 3));
  const daysDone = week.filter((d) => d.done).length;
  const coming = comingUp(examItems(data), now, 5);
  const resume = resumeBanner();

  main.innerHTML = `
    <section class="st-page st-today">
      <header class="st-hello">${sum.done ? '' : buddy('hello', { size: 60, cls: `bd-idle bd-follow bd-tap ${hopNow ? 'bd-wait' : 'bd-arrive'}` })}
        <div><p class="st-muted">${esc(longDay(now, new Date(now)))}</p><h1>${greeting(new Date(now).getHours())}${firstName ? `, ${esc(firstName)}` : ''}</h1></div></header>
      ${resume}
      ${filters}
      ${!data.length ? '<section class="st-card"><p>Your classes couldn\'t load. Check your connection, then reload the page.</p></section>' : ''}
      <div class="st-cols">${hero}
        <div class="st-stack">
          <section class="st-card" aria-labelledby="wk-h"><div class="st-card-head"><h2 id="wk-h">This week</h2><span class="st-muted st-small">${daysDone} of ${GOAL} days${daysDone >= GOAL ? ' · goal reached' : ''}</span></div>
            <ol class="st-week">${week.map((d) => `<li class="${d.done ? 'done' : ''} ${d.today ? 'today' : ''}"><span class="st-wdot" aria-hidden="true">${d.done ? icon('check') : ''}</span><span class="st-wl" aria-hidden="true">${d.letter}</span><span class="sr-only">${d.done ? 'studied' : d.future ? 'still to come' : 'not studied'}</span></li>`).join('')}</ol>
            <p class="st-muted st-small">${daysDone >= GOAL ? 'Goal reached. Anything more is a bonus.' : `Study on ${plural(GOAL - daysDone, 'more day')} this week to reach your goal.`}</p></section>
          <section class="st-card" aria-labelledby="cu-h"><h2 id="cu-h">Coming up</h2>
            ${coming.length ? `<ul class="st-list">${coming.map((x) => { const d = data.find((y) => y.cls.id === x.classId); return `<li><span><span class="st-cdot cc-${classColor(d?.cls)}" aria-hidden="true"></span>${esc(x.title)}${data.length > 1 ? ` <span class="st-muted st-small">${esc(d ? codeOf(d.cls) : '')}</span>` : ''}</span><span class="st-muted st-small">${esc(weekday(x.at, new Date(now)))}</span></li>`; }).join('')}</ul>` : '<p class="st-muted">Nothing scheduled yet. Exams and quizzes appear here when your professor sets them.</p>'}</section>
        </div></div>
    </section>`;

  fillRings(main, hopNow ? 2100 : 0);
  main.querySelector('.st-roll .st-reel')?.addEventListener('animationend', (e) => e.target.closest('.st-roll').classList.remove('go'));
  const me = main.querySelector('.st-hello .bd');
  if (hopNow && me) {
    const t = hopTargets();
    store.set('buddyHop', today);
    hop(t.logo, t.today, me, () => me.classList.remove('bd-wait'));
  } else if (me && hopDue(store.get('buddyHop', ''), today)) store.set('buddyHop', today);
  main.addEventListener('click', async (e) => {
    const b = e.target.closest('.bd-tap'); if (b) { tap(b); return; }
    if (e.target.closest('[data-discard]')) {
      const ok = await confirmDialog({ title: 'Discard this quiz?', body: '<p>Your answers in the unfinished quiz will be lost. Your saved progress stays.</p>', confirm: 'Discard', danger: true });
      if (ok) { store.clearSession(); main.querySelector('.resume-banner')?.remove(); }
    }
  });
  const stopSync = redrawAfterFirstSync();
  const stopFollow = kind && kind !== 'off' ? follow(main) : () => {};
  return () => { stopSync(); stopFollow(); };
}
