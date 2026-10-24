import { getExam } from '../data.js';
import * as store from '../store.js';
import { esc, ring, meter, toneFor, plural, icon } from '../ui.js';
import { readiness, topicMastery, dueIds, mistakeIds } from '../engine.js';

export async function render(main, { id }) {
  const exam = await getExam(id);
  if (!exam) {
    main.innerHTML = `<section class="page narrow empty-state"><h1>Exam not found</h1><p>It may have been removed or renamed.</p><a class="btn primary" href="#/">See all exams</a></section>`;
    return;
  }
  const stats = store.getStats(exam.id);
  const attempts = store.getAttempts(exam.id);
  const saved = store.getSaved(exam.id);
  const ready = readiness(exam, stats, attempts);
  const topics = topicMastery(exam, stats);
  const due = dueIds(exam, stats).length;
  const unseen = exam.questions.filter((q) => !stats[q.id]?.seen).length;
  const missed = mistakeIds(exam, stats).length;
  const onExam = exam.questions.filter((q) => q.onExam).length;
  const realCount = onExam || exam.questions.length;
  const e = encodeURIComponent(exam.id);

  const smartSub = due ? `${plural(due, 'question')} due for review` : unseen ? `${unseen} you haven't tried yet` : 'Everything is up to date';

  main.innerHTML = `
    <section class="page exam-hub">
      <nav class="crumbs"><a href="#/">Exams</a></nav>
      <header class="hub-head">
        <div>
          ${exam.course ? `<p class="course">${esc(exam.course)}</p>` : ''}
          <h1>${esc(exam.title)}</h1>
          <p class="muted">${plural(exam.questions.length, 'question')} across ${plural(exam.topics.length, 'topic')}${exam.preview ? ' · Preview from your file' : ''}</p>
        </div>
        <a class="hub-ready" href="#/progress/${e}" aria-label="Quiz readiness ${ready.score}%. See progress">
          ${ring(ready.score, { size: 96, stroke: 9, label: ready.score + '%', tone: toneFor(ready.score / 100) })}
          <span><span class="muted small">Quiz readiness</span><strong>${esc(ready.label)}</strong><span class="muted">See my progress</span></span>
        </a>
      </header>

      <div class="mode-primary">
        <a class="mode-card exam" href="#/start/${e}/exam">
          <span class="mode-name">Take the real exam</span>
          <span class="mode-sub">The actual ${plural(realCount, 'question')}${exam.timeLimit ? `, ${exam.timeLimit} minutes` : ''}. Scored at the end.</span>
        </a>
        <a class="mode-card mock" href="#/start/${e}/mock">
          <span class="mode-name">Mock exam</span>
          <span class="mode-sub">A new ${realCount}-question exam each time, same topic mix${exam.timeLimit ? `, ${exam.timeLimit} minutes` : ''}.</span>
        </a>
        <a class="mode-card smart" href="#/start/${e}/smart">
          <span class="mode-name">Smart review</span>
          <span class="mode-sub">${esc(smartSub)}. Focuses on what you're most likely to forget.</span>
        </a>
      </div>

      ${exam.assignmentCount ? (() => {
        const prog = store.getAsgProgress(exam.id);
        const done = Object.values(prog).filter((x) => x.done).length;
        return `<a class="code-card" href="#/assignments/${e}">
          <span class="code-card-icon" aria-hidden="true">{ }</span>
          <span class="code-card-text"><span class="mode-name">Programming assignments</span>
          <span class="mode-sub">${plural(exam.assignmentCount, 'Java program')} to write and test right in your browser${done ? ` · ${done} of ${exam.assignmentCount} done` : ''}</span></span>
          ${done ? `<span class="code-card-meter">${meter(done / exam.assignmentCount, { tone: done === exam.assignmentCount ? 'good' : '' })}</span>` : ''}
          ${icon('right')}
        </a>`;
      })() : ''}

      <div class="mode-grid">
        <a class="mode-card" href="#/start/${e}/topic"><span class="mode-name">Practice by topic</span><span class="mode-sub">Choose one or more topics</span></a>
        <a class="mode-card" href="#/start/${e}/bank"><span class="mode-name">Full question bank</span><span class="mode-sub">All ${exam.questions.length}, shuffled</span></a>
        <a class="mode-card" href="#/start/${e}/custom"><span class="mode-name">Custom exam</span><span class="mode-sub">Your topics, length and timer</span></a>
        <a class="mode-card ${missed ? '' : 'disabled'}" href="${missed ? `#/start/${e}/mistakes` : '#'}" ${missed ? '' : 'aria-disabled="true" tabindex="-1"'}><span class="mode-name">My mistakes</span><span class="mode-sub">${missed ? plural(missed, 'question') + ' to fix' : 'Nothing yet'}</span></a>
        <a class="mode-card ${saved.length ? '' : 'disabled'}" href="${saved.length ? `#/start/${e}/saved` : '#'}" ${saved.length ? '' : 'aria-disabled="true" tabindex="-1"'}><span class="mode-name">Saved questions</span><span class="mode-sub">${saved.length ? plural(saved.length, 'question') : 'Star questions to save them'}</span></a>
        <a class="mode-card" href="#/cards/${e}"><span class="mode-name">Flashcards</span><span class="mode-sub">Flip through answers fast</span></a>
        <a class="mode-card" href="#/browse/${e}"><span class="mode-name">Browse all questions</span><span class="mode-sub">Search, read answers, add notes</span></a>
        <a class="mode-card" href="#/progress/${e}"><span class="mode-name">My progress</span><span class="mode-sub">${attempts.length ? plural(attempts.length, 'attempt') + ' so far' : 'Scores and weak spots'}</span></a>
      </div>

      <h2 class="section-title">Topics</h2>
      <ul class="topic-list">
        ${topics.map((t) => `
          <li>
            <div class="topic-info">
              <span class="topic-name">${esc(t.name)}</span>
              <span class="muted small">${t.seen}/${t.count} tried${t.accuracy != null ? ` · ${Math.round(t.accuracy * 100)}% correct` : ''}${t.due ? ` · ${t.due} due` : ''}</span>
            </div>
            <div class="topic-meter" title="Mastery ${Math.round(t.mastery * 100)}%">${meter(t.mastery, { tone: t.seen ? toneFor(t.mastery) : 'muted' })}</div>
            <a class="btn small" href="#/start/${e}/topic?topic=${encodeURIComponent(t.name)}">Practice</a>
          </li>`).join('')}
      </ul>
    </section>`;

  main.querySelectorAll('.mode-card.disabled').forEach((a) => a.addEventListener('click', (ev) => ev.preventDefault()));
}
