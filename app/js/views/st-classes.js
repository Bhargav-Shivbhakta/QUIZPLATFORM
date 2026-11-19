// Your classes (the Classes tab on phones; on laptops each class is in the left bar).
// A student with one class goes straight into it.
import * as cloud from '../cloud.js';
import { esc, plural } from '../ui.js';
import { nextExam, daysUntil } from '../today.js';
import { classColor } from '../stshell.js';
import { classData, clearClassData } from './st-data.js';

export async function render(main) {
  const mine = cloud.myClasses();
  if (mine.length === 1) { location.replace(`#/class/${encodeURIComponent(mine[0].id)}`); return; }
  clearClassData();
  const data = (await Promise.all(mine.map((c) => classData(c).catch(() => null)))).filter(Boolean);
  const now = cloud.trueNow();
  main.innerHTML = `
    <section class="st-page">
      <header class="st-hello"><div><p class="st-muted">${esc(mine[0]?.term || '')}</p><h1>Your classes</h1></div></header>
      <div class="st-ccards">${data.map((d) => {
        const x = nextExam([...d.graded, ...d.dates], now), n = x ? daysUntil(x.at, now) : null;
        return `<a class="st-ccard cc-${classColor(d.cls)}" href="#/class/${encodeURIComponent(d.cls.id)}"><span class="st-stripe" aria-hidden="true"></span>
          <span class="st-muted st-small">${esc([d.cls.term, d.cls.section ? `Section ${d.cls.section}` : ''].filter(Boolean).join(' · '))}</span>
          <span class="st-ccard-title">${esc(d.cls.course || d.cls.name)}</span><span class="st-muted">${esc(d.cls.course ? d.cls.name : '')}</span>
          <span class="st-ccard-row"><span>${x ? `${esc(x.title)} ${n === 0 ? '<b>today</b>' : `in <b>${plural(n, 'day')}</b>`}` : 'No exam scheduled'}</span>${d.sets.length ? `<span class="st-pill">${d.ready}% · ${esc(d.word)}</span>` : ''}</span></a>`;
      }).join('')}</div>
      <p class="st-muted st-small">Classes come from your school's roster. Missing one? Ask your professor to add you.</p>
    </section>`;
}
