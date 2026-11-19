// Progress, for students: how ready they are in each class (number and word), what to fix, recent sets.
// Detailed charts for one practice set stay on #/progress/<set>.
import * as cloud from '../cloud.js';
import * as store from '../store.js';
import { esc, plural } from '../ui.js';
import { weekDays } from '../today.js';
import { dayKey, weekday } from '../format.js';
import { MODES } from '../engine.js';
import { buddy } from '../buddy.js';
import { classColor } from '../stshell.js';
import { classData, clearClassData, redrawAfterFirstSync } from './st-data.js';

const e = encodeURIComponent;
export async function render(main) {
  clearClassData();
  const data = (await Promise.all(cloud.myClasses().map((c) => classData(c).catch(() => null)))).filter(Boolean);
  const activity = store.getActivity(), now = cloud.trueNow();
  const answered = Object.values(activity).reduce((n, a) => n + (a.answered || 0), 0);
  const days = weekDays(activity, now, dayKey).filter((d) => d.done).length;
  const fixes = data.flatMap((d) => d.sets.filter((s) => s.mistakes).map((s) => ({ d, s })));
  const recent = data.flatMap((d) => d.sets.flatMap((s) => s.attempts.map((a) => ({ d, s, a })))).sort((x, y) => (y.a.finishedAt || 0) - (x.a.finishedAt || 0)).slice(0, 6);
  main.innerHTML = `
    <section class="st-page st-progress">
      <header class="st-hello"><div><p class="st-muted">${esc(cloud.myClasses()[0]?.term || '')}</p><h1>Your progress</h1></div></header>
      <div class="st-stats"><div class="st-stat"><b>${answered}</b><span>questions answered</span></div><div class="st-stat"><b>${days}</b><span>days this week</span></div><div class="st-stat"><b>${fixes.reduce((n, x) => n + x.s.mistakes, 0)}</b><span>mistakes to fix</span></div></div>
      <div class="st-grid">${data.map((d) => `<section class="st-card cc-${classColor(d.cls)}"><h2><span class="st-cdot" aria-hidden="true"></span>${esc(d.cls.course || d.cls.name)}</h2>
        ${d.sets.length ? `<p class="st-big-num">${d.ready}% <span>${esc(d.word)}</span></p><ul class="st-bars">${d.sets.map((s) => `<li><span class="st-bar-h"><a href="#/progress/${e(s.id)}">${esc(s.title)}</a><span class="st-muted st-small">${s.seen ? `${s.score}% · ` : ''}${esc(s.word)}</span></span><span class="st-bar"><i data-w="${s.score}"></i></span></li>`).join('')}</ul>` : ''}
        ${d.coding.map((c) => `<p class="st-small">${esc(c.title)}: ${c.done} of ${plural(c.total, 'coding assignment')} done</p>`).join('')}
        ${!d.sets.length && !d.coding.length ? '<p class="st-muted">Nothing to show yet.</p>' : ''}</section>`).join('')}</div>
      <div class="st-grid">
        <section class="st-card" aria-labelledby="mis-h"><h2 id="mis-h">Mistakes</h2>
          ${fixes.length ? `<ul class="st-rows">${fixes.map(({ d, s }) => `<li class="st-row"><div class="st-grow"><span class="st-row-title">${esc(s.title)}</span><span class="st-muted st-small">${esc(d.cls.course || d.cls.name)} · ${plural(s.mistakes, 'question')}</span></div><a class="st-btn st-btn-ghost st-sm" href="#/start/${e(s.id)}/mistakes">Fix them</a></li>`).join('')}</ul>`
            : `<div class="st-empty">${buddy('happy', { size: 64 })}<p class="st-muted">Nothing to fix. Every question you've tried, you last got right.</p></div>`}</section>
        <section class="st-card" aria-labelledby="rec-h"><h2 id="rec-h">Recent sets</h2>
          ${recent.length ? `<ul class="st-rows">${recent.map(({ s, a }) => `<li class="st-row"><div class="st-grow"><a class="st-row-title" href="#/results/${e(s.id)}/${e(a.id)}">${esc(MODES[a.mode]?.label || 'Practice')} · ${esc(s.title)}</a><span class="st-muted st-small">${esc(weekday(a.finishedAt))}</span></div><span class="st-muted st-small">${a.score ? `${a.score.correct ?? ''}${a.score.count ? ` of ${a.score.count}` : ''} right` : ''}</span></li>`).join('')}</ul>`
            : '<p class="st-muted">Sets you finish appear here.</p>'}</section>
      </div>
    </section>`;
  requestAnimationFrame(() => main.querySelectorAll('.st-bar i[data-w]').forEach((i) => { i.style.width = `${i.dataset.w}%`; }));
  return redrawAfterFirstSync();
}
