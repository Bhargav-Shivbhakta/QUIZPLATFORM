import config from '../../config.js';
import { getManifest, getExam } from '../data.js';
import * as store from '../store.js';
import { esc, ring, plural, toneFor, confirmDialog } from '../ui.js';
import { readiness, fmtDate, MODES } from '../engine.js';

function countdown(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr + 'T00:00:00');
  if (isNaN(d)) return '';
  const days = Math.ceil((d - new Date(new Date().toDateString())) / 86400000);
  if (days < 0) return '';
  if (days === 0) return 'Exam is today';
  return `Exam in ${plural(days, 'day')}`;
}

export async function render(main) {
  const manifest = await getManifest();
  const exams = manifest.exams;
  const session = store.getSession();

  if (!exams.length) {
    main.innerHTML = `<section class="page narrow empty-state"><h1>No exams yet</h1><p>Exams appear here once they're added to the site.</p></section>`;
    return;
  }

  const current = exams.filter((e) => !e.archived && !e.preview);
  const featured = current[0];
  const others = current.slice(1);
  const archived = exams.filter((e) => e.archived);
  const previews = exams.filter((e) => e.preview);

  // readiness for the featured exam needs its questions
  let featuredReady = null;
  try {
    const ex = await getExam(featured.id);
    featuredReady = readiness(ex, store.getStats(ex.id), store.getAttempts(ex.id));
  } catch {}

  const resume = session ? `
    <div class="resume-banner" role="region" aria-label="Unfinished quiz">
      <div>
        <strong>You have an unfinished ${esc(MODES[session.mode]?.label.toLowerCase() || 'quiz')}</strong>
        <span class="muted">${esc(session.examTitle)} · ${Object.keys(session.answers).length} of ${session.questionIds.length} answered · started ${esc(fmtDate(session.startedAt))}</span>
      </div>
      <div class="row">
        <button class="btn" data-discard>Discard</button>
        <a class="btn primary" href="#/quiz">Resume</a>
      </div>
    </div>` : '';

  const card = (e, big = false) => {
    const attempts = store.getAttempts(e.id);
    const last = attempts[attempts.length - 1];
    const best = attempts.filter((a) => a.mode === 'exam').reduce((m, a) => Math.max(m, a.score.pct), -1);
    return `
    <a class="exam-card ${big ? 'big' : ''}" href="#/exam/${encodeURIComponent(e.id)}">
      <div class="exam-card-main">
        ${e.course ? `<p class="course">${esc(e.course)}</p>` : ''}
        <h2>${esc(e.title)}</h2>
        ${e.description ? `<p class="desc">${esc(e.description)}</p>` : ''}
        <p class="facts">${plural(e.questionCount, 'question')}, ${plural(e.topics.length, 'topic')}${e.onExamCount ? `, real exam has ${e.onExamCount}${e.timeLimit ? ` in ${e.timeLimit} min` : ''}` : ''}</p>
        ${countdown(e.examDate) ? `<p class="countdown">${esc(countdown(e.examDate))}</p>` : ''}
        ${last ? `<p class="last">Last studied ${esc(fmtDate(last.finishedAt))}${best >= 0 ? ` · Best real exam ${best}%` : ''}</p>` : ''}
      </div>
      ${big && featuredReady ? `<div class="exam-card-side">${ring(featuredReady.score, { size: 116, label: featuredReady.score + '%', sub: featuredReady.label, tone: toneFor(featuredReady.score / 100) })}<span class="ring-caption">Readiness</span></div>` : ''}
      <span class="exam-card-go">${big ? 'Start studying' : 'Open'}</span>
    </a>`;
  };

  main.innerHTML = `
    <section class="page home">
      <header class="home-head">
        <h1>${esc(config.siteName)}</h1>
        ${config.tagline ? `<p class="tagline">${esc(config.tagline)}</p>` : ''}
      </header>
      ${resume}
      ${card(featured, true)}
      ${others.length ? `<h2 class="section-title">Other exams</h2><div class="exam-grid">${others.map((e) => card(e)).join('')}</div>` : ''}
      ${archived.length ? `<h2 class="section-title">Past exams</h2><p class="muted section-sub">Still available for practice.</p><div class="exam-grid">${archived.map((e) => card(e)).join('')}</div>` : ''}
      ${previews.length ? `<h2 class="section-title">Previews</h2><p class="muted section-sub">Loaded from a file on this device. Not published.</p><div class="exam-grid">${previews.map((e) => card(e)).join('')}</div>` : ''}
    </section>`;

  main.querySelector('[data-discard]')?.addEventListener('click', async () => {
    const ok = await confirmDialog({ title: 'Discard this quiz?', body: '<p>Your answers in the unfinished quiz will be lost. Your saved progress stays.</p>', confirm: 'Discard', danger: true });
    if (ok) { store.clearSession(); render(main); }
  });
}
