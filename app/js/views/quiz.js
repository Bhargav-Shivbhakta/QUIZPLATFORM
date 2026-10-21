import { getExam } from '../data.js';
import * as store from '../store.js';
import { esc, icon, modal, toast, plural, modalOpen, $, $$ } from '../ui.js';
import { md, highlight } from '../render.js';
import { gradeQuestion, isAnswered, correctAnswerLabel, TYPE_LABELS } from '../parser.js';
import { finishSession, recordAnswer, fmtDuration } from '../engine.js';
import { toggleCalculator, closeCalculator } from '../calculator.js';
import { go } from '../main.js';

const LETTERS = 'ABCDEFGHIJKLMNOP';

export async function render(main) {
  let s = store.getSession();
  if (!s) {
    main.innerHTML = `<section class="page narrow empty-state"><h1>No quiz in progress</h1><p>Pick an exam and a study mode to start one.</p><a class="btn primary" href="#/">Go to exams</a></section>`;
    return;
  }
  const exam = await getExam(s.examId);
  if (!exam) {
    main.innerHTML = `<section class="page narrow empty-state"><h1>This quiz's exam is no longer available</h1><p>It may have been removed from the site.</p><button class="btn primary" data-discard>Discard quiz</button></section>`;
    main.querySelector('[data-discard]').onclick = () => { store.clearSession(); go('#/'); };
    return;
  }
  // drop any questions that were removed from the exam since the quiz started
  s.questionIds = s.questionIds.filter((id) => exam.byId.has(id));
  if (!s.questionIds.length) { store.clearSession(); go('#/'); return; }
  s.current = Math.min(s.current, s.questionIds.length - 1);
  s.paused = false; // never resume into a paused state without the overlay

  const instant = s.feedback === 'instant';
  const savedSet = new Set(store.getSaved(exam.id));
  const N = s.questionIds.length;

  main.innerHTML = `
    <div class="quiz ${instant ? 'instant' : 'end-mode'}">
      <div class="quiz-bar">
        <div class="quiz-bar-left">
          <button class="icon-btn" data-exit aria-label="Save and exit" title="Save and exit">${icon('left')}</button>
          <div class="quiz-title"><strong>${esc(s.label)}</strong><span>${esc(exam.title)}</span></div>
        </div>
        <div class="quiz-bar-right">
          <div class="timer" data-timer role="timer" aria-live="off"><span class="timer-icon">${icon('clock')}</span><span data-time>0:00</span></div>
          ${s.canPause ? `<button class="icon-btn" data-pause aria-label="Pause (P)" title="Pause (P)">${icon('pause')}</button>` : ''}
          <button class="icon-btn" data-calc aria-label="Calculator (C)" title="Calculator (C)">${icon('calc')}</button>
          <button class="icon-btn" data-keys aria-label="Keyboard shortcuts (?)" title="Keyboard shortcuts (?)">${icon('keyboard')}</button>
          <button class="icon-btn sheet-toggle" data-sheet-toggle aria-label="Answer sheet (G)" title="Answer sheet (G)">${icon('grid')}</button>
          <button class="btn primary small" data-submit>${instant ? 'Finish' : 'Submit'}</button>
        </div>
      </div>
      <div class="quiz-progress" aria-hidden="true"><span></span></div>
      <div class="quiz-body">
        <div class="quiz-main">
          <article class="qcard" data-qcard aria-live="polite"></article>
          <div class="quiz-nav">
            <button class="btn" data-prev>${icon('left')}<span>Previous</span></button>
            <span class="quiz-count" data-count></span>
            <button class="btn primary" data-next><span>Next</span>${icon('right')}</button>
          </div>
        </div>
        <aside class="sheet" data-sheet aria-label="Answer sheet">
          <div class="sheet-head"><h2>Answer sheet</h2><button class="icon-btn small sheet-close" data-sheet-toggle aria-label="Close answer sheet">${icon('x')}</button></div>
          <div class="sheet-grid" data-grid role="list"></div>
          <dl class="sheet-legend">
            <div><dt><span class="bub filled"></span></dt><dd>Answered</dd></div>
            <div><dt><span class="bub"></span></dt><dd>Not answered</dd></div>
            <div><dt><span class="bub flagged"></span></dt><dd>Flagged</dd></div>
            ${instant ? '<div><dt><span class="bub right"></span></dt><dd>Correct</dd></div><div><dt><span class="bub wrong"></span></dt><dd>Wrong</dd></div>' : ''}
          </dl>
          <p class="sheet-summary" data-summary></p>
        </aside>
      </div>
      <div class="pause-overlay" data-overlay hidden>
        <div><h2>Paused</h2><p>The timer is stopped and the question is hidden.</p><button class="btn primary big" data-resume>${icon('play')} Resume</button></div>
      </div>
    </div>`;

  const card = $('[data-qcard]', main);
  const grid = $('[data-grid]', main);
  const timeEl = $('[data-time]', main);
  const timerEl = $('[data-timer]', main);
  const progressBar = $('.quiz-progress span', main);
  const sheet = $('[data-sheet]', main);

  const qid = () => s.questionIds[s.current];
  const q = () => exam.byId.get(qid());
  const save = () => store.saveSession(s);

  // ---------- rendering ----------
  function renderGrid() {
    grid.innerHTML = s.questionIds.map((id, i) => {
      const qq = exam.byId.get(id);
      const ans = isAnswered(qq, s.answers[id]);
      let cls = ans ? 'filled' : '';
      if (instant && s.checked[id]) cls = gradeQuestion(qq, s.answers[id]) ? 'right' : 'wrong';
      if (s.flags[id]) cls += ' flagged';
      if (i === s.current) cls += ' current';
      return `<button class="bub ${cls}" data-jump="${i}" role="listitem" aria-label="Question ${i + 1}${ans ? ', answered' : ''}${s.flags[id] ? ', flagged' : ''}">${i + 1}</button>`;
    }).join('');
    const answered = s.questionIds.filter((id) => isAnswered(exam.byId.get(id), s.answers[id])).length;
    const flagged = s.questionIds.filter((id) => s.flags[id]).length;
    $('[data-summary]', main).textContent = `${answered} of ${N} answered${flagged ? ` · ${flagged} flagged` : ''}`;
    progressBar.style.width = `${(answered / N) * 100}%`;
  }

  function optionRow(qq, displayIdx, origIdx, locked) {
    const id = qid();
    const v = s.answers[id];
    const selected = qq.type === 'multi' ? (v || []).includes(origIdx) : v === origIdx;
    const struck = (s.struck[id] || []).includes(origIdx);
    let state = '';
    if (locked) {
      const o = qq.options[origIdx];
      if (o.correct) state = 'is-correct';
      else if (selected) state = 'is-wrong';
    }
    return `
      <li class="opt ${selected ? 'selected' : ''} ${struck ? 'struck' : ''} ${state}">
        <button class="opt-btn" data-opt="${origIdx}" ${locked ? 'disabled' : ''} role="${qq.type === 'multi' ? 'checkbox' : 'radio'}" aria-checked="${selected}">
          <span class="bubble ${qq.type === 'multi' ? 'square' : ''}" aria-hidden="true">${LETTERS[displayIdx]}</span>
          <span class="opt-text">${md(qq.options[origIdx].text, { inline: !qq.options[origIdx].text.includes('\n') })}</span>
          ${locked && qq.options[origIdx].correct ? `<span class="opt-mark">${icon('check')}</span>` : ''}
          ${locked && selected && !qq.options[origIdx].correct ? `<span class="opt-mark">${icon('x')}</span>` : ''}
        </button>
        ${locked ? '' : `<button class="strike-btn" data-strike="${origIdx}" aria-label="Cross out choice ${LETTERS[displayIdx]}" title="Cross out">${icon('strike')}</button>`}
      </li>`;
  }

  function feedbackBlock(qq) {
    const ok = gradeQuestion(qq, s.answers[qid()]);
    const showAnswer = qq.type === 'numeric' || qq.type === 'text';
    return `
      <div class="feedback ${ok ? 'good' : 'bad'}" role="status">
        <p class="verdict">${ok ? icon('check') + ' Correct' : icon('x') + ' Not quite'}</p>
        ${showAnswer && !ok ? `<p class="accepted">Correct answer: <strong>${md(correctAnswerLabel(qq), { inline: true })}</strong></p>` : ''}
        ${qq.explanation ? `<div class="explanation prose">${md(qq.explanation)}</div>` : ''}
      </div>`;
  }

  function renderCard() {
    const qq = q();
    const id = qq.id;
    const locked = instant && !!s.checked[id];
    const order = s.choiceOrder[id] || (qq.options || []).map((_, i) => i);
    const multiCount = qq.type === 'multi' ? qq.options.filter((o) => o.correct).length : 0;
    const typed = qq.type === 'numeric' || qq.type === 'text';
    const hintShown = s.hintsUsed[id];

    card.innerHTML = `
      <header class="qhead">
        <span class="qnum">Question ${s.current + 1} <span class="muted">of ${N}</span></span>
        <span class="qmeta"><span class="tag">${esc(qq.topic)}</span><span class="tag diff-${qq.difficulty}">${qq.difficulty}</span>${qq.points !== 1 ? `<span class="tag">${qq.points} pts</span>` : ''}</span>
        <span class="qtools">
          <button class="tool ${s.flags[id] ? 'on' : ''}" data-flag aria-pressed="${!!s.flags[id]}" title="Flag for review (F)">${icon('flag')}<span>${s.flags[id] ? 'Flagged' : 'Flag'}</span></button>
          <button class="tool ${savedSet.has(id) ? 'on star' : ''}" data-save aria-pressed="${savedSet.has(id)}" title="Save to study later (S)">${icon('star')}<span>${savedSet.has(id) ? 'Saved' : 'Save'}</span></button>
        </span>
      </header>
      <div class="qtext prose">${md(qq.text)}</div>
      <p class="qtype">${esc(TYPE_LABELS[qq.type] || '')}${qq.type === 'multi' && instant ? ` (${multiCount} correct)` : ''}</p>
      ${typed ? `
        <div class="typed ${locked ? (gradeQuestion(qq, s.answers[id]) ? 'is-correct' : 'is-wrong') : ''}">
          <input class="typed-input" data-typed type="${qq.type === 'numeric' ? 'text' : 'text'}" inputmode="${qq.type === 'numeric' ? 'decimal' : 'text'}"
            autocomplete="off" spellcheck="false" aria-label="Your answer" placeholder="${qq.type === 'numeric' ? 'Type a number' : 'Type your answer'}"
            value="${esc(s.answers[id] ?? '')}" ${locked ? 'disabled' : ''}>
          ${qq.type === 'numeric' ? '<span class="muted small">Decimals, negatives and fractions like 1/4 are fine.</span>' : '<span class="muted small">Not case sensitive.</span>'}
        </div>` : `
        <ol class="opts ${qq.type === 'multi' ? 'multi' : ''}" role="${qq.type === 'multi' ? 'group' : 'radiogroup'}" aria-label="Answer choices">
          ${order.map((orig, di) => optionRow(qq, di, orig, locked)).join('')}
        </ol>`}
      ${qq.hint && !locked && s.mode !== 'exam' ? (hintShown
        ? `<div class="hint prose">${icon('bulb')}<div>${md(qq.hint)}</div></div>`
        : `<button class="link-btn hint-btn" data-hint>${icon('bulb')} Show hint (H)</button>`) : ''}
      ${locked ? feedbackBlock(qq) : ''}`;
    highlight(card);

    $('[data-count]', main).textContent = `${s.current + 1} / ${N}`;
    $('[data-prev]', main).disabled = s.current === 0;
    const next = $('[data-next]', main);
    const answered = isAnswered(qq, s.answers[id]);
    if (instant && !locked) {
      next.innerHTML = answered ? `<span>Check answer</span>${icon('check')}` : `<span>Skip</span>${icon('right')}`;
      next.classList.toggle('primary', answered);
    } else {
      const last = s.current === N - 1;
      next.innerHTML = last ? `<span>${instant ? 'Finish' : 'Review and submit'}</span>${icon('check')}` : `<span>Next</span>${icon('right')}`;
      next.classList.add('primary');
    }
    renderGrid();
  }

  // ---------- actions ----------
  function selectOption(orig) {
    const qq = q();
    const id = qq.id;
    if (instant && s.checked[id]) return;
    if (qq.type === 'multi') {
      const cur = new Set(s.answers[id] || []);
      if (cur.has(orig)) cur.delete(orig); else cur.add(orig);
      s.answers[id] = [...cur];
      if (!s.answers[id].length) delete s.answers[id];
    } else {
      s.answers[id] = orig;
    }
    // choosing a crossed-out option un-crosses it
    if (s.struck[id]?.includes(orig)) s.struck[id] = s.struck[id].filter((x) => x !== orig);
    save();
    renderCard();
    const btn = card.querySelector(`[data-opt="${orig}"]`);
    btn?.focus({ preventScroll: true });
  }

  function toggleStrike(orig) {
    const id = qid();
    const cur = new Set(s.struck[id] || []);
    if (cur.has(orig)) cur.delete(orig); else cur.add(orig);
    s.struck[id] = [...cur];
    save();
    renderCard();
  }

  function check() {
    const qq = q();
    if (!isAnswered(qq, s.answers[qq.id]) || s.checked[qq.id]) return false;
    s.checked[qq.id] = true;
    const stats = store.getStats(exam.id);
    recordAnswer(stats, qq.id, gradeQuestion(qq, s.answers[qq.id]));
    store.saveStats(exam.id, stats);
    store.logActivity(0, 1);
    save();
    renderCard();
    card.querySelector('.feedback')?.scrollIntoView({ block: 'nearest', behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
    return true;
  }

  function goTo(i) {
    if (i < 0 || i >= N) return;
    s.current = i;
    save();
    renderCard();
    sheet.classList.remove('open');
    card.scrollIntoView({ block: 'start', behavior: 'auto' });
    window.scrollTo({ top: 0 });
  }

  function next() {
    const qq = q();
    if (instant && !s.checked[qq.id] && isAnswered(qq, s.answers[qq.id])) { check(); return; }
    if (s.current < N - 1) goTo(s.current + 1);
    else openSubmit();
  }

  function toggleFlag() { const id = qid(); if (s.flags[id]) delete s.flags[id]; else s.flags[id] = true; save(); renderCard(); }
  function toggleSave() {
    const on = store.toggleSaved(exam.id, qid());
    if (on) savedSet.add(qid()); else savedSet.delete(qid());
    toast(on ? 'Saved. Find it under Saved questions.' : 'Removed from saved questions.');
    renderCard();
  }
  function showHint() { const qq = q(); if (!qq.hint || s.mode === 'exam') return; s.hintsUsed[qq.id] = true; save(); renderCard(); }

  // ---------- timer ----------
  let lastTick = performance.now();
  let activityMs = 0;
  let warned5 = false, warned1 = false, submitting = false;
  function tick() {
    const now = performance.now();
    const dt = Math.min(5000, now - lastTick); // ignore long sleeps (laptop closed)
    lastTick = now;
    if (!s.paused) {
      s.elapsedMs += dt;
      s.times[qid()] = (s.times[qid()] || 0) + dt;
      activityMs += dt;
    }
    paintTime();
    if (s.timeLimitSec) {
      const left = s.timeLimitSec - s.elapsedMs / 1000;
      if (left <= 300 && !warned5 && s.timeLimitSec > 600) { warned5 = true; toast('5 minutes left'); }
      if (left <= 60 && !warned1) { warned1 = true; toast('1 minute left', 'bad'); }
      if (left <= 0 && !submitting) {
        s.timedOut = true;
        toast("Time's up. Your answers were submitted.", 'bad');
        submit();
      }
    }
  }
  function paintTime() {
    if (s.timeLimitSec) {
      const left = Math.max(0, s.timeLimitSec * 1000 - s.elapsedMs);
      timeEl.textContent = fmtDuration(left);
      timerEl.classList.toggle('low', left <= 5 * 60000);
      timerEl.classList.toggle('critical', left <= 60000);
      timerEl.title = 'Time left';
    } else {
      timeEl.textContent = fmtDuration(s.elapsedMs);
      timerEl.title = 'Time spent';
    }
  }
  const interval = setInterval(tick, 1000);
  const autosave = setInterval(() => { save(); if (activityMs > 0) { store.logActivity(activityMs, 0); activityMs = 0; } }, 10000);

  function setPaused(p) {
    if (!s.canPause) return;
    s.paused = p;
    $('[data-overlay]', main).hidden = !p;
    if (p) { closeCalculator(); $('[data-resume]', main).focus(); }
    lastTick = performance.now();
    save();
  }

  // ---------- submit ----------
  function openSubmit() {
    const unanswered = s.questionIds.map((id, i) => ({ id, i })).filter(({ id }) => !isAnswered(exam.byId.get(id), s.answers[id]));
    const flagged = s.questionIds.map((id, i) => ({ id, i })).filter(({ id }) => s.flags[id]);
    if (!unanswered.length && !flagged.length && !store.getSettings().confirmSubmit) { submit(); return; }
    const list = (arr) => arr.map(({ i }) => `<button class="bub small-bub" data-goto="${i}">${i + 1}</button>`).join('');
    const body = document.createElement('div');
    body.innerHTML = `
      <p>${unanswered.length ? `You've answered ${N - unanswered.length} of ${N} questions.` : `You've answered all ${N} questions.`}${s.timeLimitSec ? ` ${fmtDuration(Math.max(0, s.timeLimitSec * 1000 - s.elapsedMs))} left.` : ''}</p>
      ${unanswered.length ? `<p class="submit-label">Not answered (${unanswered.length}), counted as wrong:</p><div class="bub-row">${list(unanswered)}</div>` : ''}
      ${flagged.length ? `<p class="submit-label">Flagged for review (${flagged.length}):</p><div class="bub-row">${list(flagged)}</div>` : ''}`;
    const m = modal({
      title: instant ? 'Finish this quiz?' : 'Submit your answers?',
      body,
      actions: [
        { label: 'Keep working' },
        { label: instant ? 'Finish' : 'Submit', kind: 'primary', onClick: () => submit() },
      ],
    });
    body.querySelectorAll('[data-goto]').forEach((b) => (b.onclick = () => { m.close(); goTo(Number(b.dataset.goto)); }));
  }

  function submit() {
    if (submitting) return;
    submitting = true;
    clearInterval(interval);
    clearInterval(autosave);
    if (activityMs > 0) store.logActivity(activityMs, 0);
    activityMs = 0;
    const attempt = finishSession(exam, s);
    s = null;
    go(`#/results/${encodeURIComponent(exam.id)}/${attempt.id}`);
  }

  // ---------- events ----------
  main.addEventListener('click', (e) => {
    const t = e.target.closest('button, a');
    if (!t || !s) return;
    if (t.dataset.opt !== undefined) {
      if (e.altKey) return toggleStrike(Number(t.dataset.opt));
      return selectOption(Number(t.dataset.opt));
    }
    if (t.dataset.strike !== undefined) return toggleStrike(Number(t.dataset.strike));
    if (t.dataset.jump !== undefined) return goTo(Number(t.dataset.jump));
    if ('flag' in t.dataset) return toggleFlag();
    if ('save' in t.dataset) return toggleSave();
    if ('hint' in t.dataset) return showHint();
    if ('prev' in t.dataset) return goTo(s.current - 1);
    if ('next' in t.dataset) return next();
    if ('submit' in t.dataset) return openSubmit();
    if ('pause' in t.dataset) return setPaused(true);
    if ('resume' in t.dataset) return setPaused(false);
    if ('calc' in t.dataset) return toggleCalculator();
    if ('keys' in t.dataset) return showShortcuts();
    if ('sheetToggle' in t.dataset) return sheet.classList.toggle('open');
    if ('exit' in t.dataset) { save(); toast('Saved. Resume it from the home screen.'); go(`#/exam/${encodeURIComponent(exam.id)}`); }
  });
  main.addEventListener('contextmenu', (e) => {
    const b = e.target.closest('[data-opt]');
    if (b && !b.disabled) { e.preventDefault(); toggleStrike(Number(b.dataset.opt)); }
  });
  main.addEventListener('input', (e) => {
    if (e.target.matches('[data-typed]')) {
      const v = e.target.value;
      if (v.trim()) s.answers[qid()] = v; else delete s.answers[qid()];
      save();
      renderGrid();
      const qq = q();
      const nextBtn = $('[data-next]', main);
      if (instant && !s.checked[qq.id]) {
        const a = isAnswered(qq, s.answers[qq.id]);
        nextBtn.innerHTML = a ? `<span>Check answer</span>${icon('check')}` : `<span>Skip</span>${icon('right')}`;
        nextBtn.classList.toggle('primary', a);
      }
    }
  });

  function onKey(e) {
    if (!s || modalOpen()) return;
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    const inField = e.target.matches('input, textarea, select');
    if (inField) {
      if (e.key === 'Enter' && e.target.matches('[data-typed]')) { e.preventDefault(); next(); }
      return;
    }
    if (s.paused) { if (e.key === 'p' || e.key === 'P' || e.key === 'Enter') { e.preventDefault(); setPaused(false); } return; }
    const k = e.key;
    const qq = q();
    if (/^[1-9]$/.test(k) && qq.options) {
      const order = s.choiceOrder[qq.id] || qq.options.map((_, i) => i);
      const orig = order[Number(k) - 1];
      if (orig !== undefined) { e.preventDefault(); selectOption(orig); }
      return;
    }
    switch (k) {
      case 'ArrowRight': case 'j': e.preventDefault(); if (s.current < N - 1) goTo(s.current + 1); break;
      case 'ArrowLeft': case 'k': e.preventDefault(); goTo(s.current - 1); break;
      case 'Enter': if (!e.target.closest('button')) { e.preventDefault(); next(); } break;
      case 'f': case 'F': toggleFlag(); break;
      case 's': case 'S': toggleSave(); break;
      case 'h': case 'H': showHint(); break;
      case 'c': case 'C': e.preventDefault(); toggleCalculator(); break;
      case 'p': case 'P': setPaused(true); break;
      case 'g': case 'G': sheet.classList.toggle('open'); break;
      case '?': showShortcuts(); break;
      case 't': case 'T': { const inp = card.querySelector('[data-typed]'); if (inp) { e.preventDefault(); inp.focus(); } break; }
    }
  }
  document.addEventListener('keydown', onKey);

  function showShortcuts() {
    const rows = [
      ['1 – 9', 'Choose answer A, B, C…'],
      ['Enter', instant ? 'Check answer, then go to the next question' : 'Next question'],
      ['← / →', 'Previous / next question'],
      ['F', 'Flag for review'],
      ['S', 'Save question to study later'],
      ['H', 'Show hint (practice only)'],
      ['T', 'Jump to the answer box'],
      ['C', 'Calculator'],
      ...(s.canPause ? [['P', 'Pause']] : []),
      ['G', 'Answer sheet (on small screens)'],
      ['Right-click or Alt+click', 'Cross out a choice'],
    ];
    modal({ title: 'Keyboard shortcuts', body: `<dl class="shortcuts">${rows.map(([a, b]) => `<div><dt><kbd>${esc(a)}</kbd></dt><dd>${esc(b)}</dd></div>`).join('')}</dl>` });
  }

  const onVis = () => { if (document.visibilityState === 'hidden' && s) save(); lastTick = performance.now(); };
  document.addEventListener('visibilitychange', onVis);
  const onUnload = () => { if (s) save(); };
  window.addEventListener('pagehide', onUnload);

  renderCard();
  paintTime();

  return () => {
    clearInterval(interval);
    clearInterval(autosave);
    document.removeEventListener('keydown', onKey);
    document.removeEventListener('visibilitychange', onVis);
    window.removeEventListener('pagehide', onUnload);
    closeCalculator();
    if (activityMs > 0) store.logActivity(activityMs, 0);
    if (s) save();
  };
}
