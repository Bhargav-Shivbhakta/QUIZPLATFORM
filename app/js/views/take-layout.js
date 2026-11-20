// The exam screen's layout for coding questions (used by take.js): the question list on the left folds to a
// slim strip, the problem can be hidden, the line between problem and code can be dragged, and the code box
// can be made taller or shorter from its bottom corner. Each choice is remembered on this device.
// The code side scrolls on its own, so the Run output and its errors are always reachable.
import { icon } from '../ui.js';

const KEY = 'qp1:timed:layout';
const read = () => { try { return JSON.parse(localStorage.getItem(KEY) || '{}') || {}; } catch { return {}; } };
const write = (v) => { try { localStorage.setItem(KEY, JSON.stringify({ ...read(), ...v })); } catch {} };

export const navToggle = () => `<button type="button" class="exam-fold" data-fold-nav aria-expanded="true" title="Fold the question list">${icon('left')}<span class="sr-only">Fold the question list</span></button>`;
export const problemToggle = () => `<button class="tool" type="button" data-fold-problem aria-expanded="true" title="Hide or show the problem">${icon('note')}<span data-fold-label>Hide problem</span></button>`;
// Bigger or smaller question text (the problem, examples and choices), for anyone who needs it
export const textSize = () => `<span class="tool-group q-size" role="group" aria-label="Question text size"><button type="button" class="btn small" data-qsize="-1" title="Smaller question text" aria-label="Smaller question text">A−</button><button type="button" class="btn small" data-qsize="1" title="Bigger question text" aria-label="Bigger question text">A+</button></span>`;
const SIZES = [0.9, 1, 1.15, 1.3, 1.5, 1.75, 2];
export const gutter = () => '<div class="exam-gutter" data-gutter role="separator" aria-orientation="vertical" aria-label="Drag to resize the problem and the code" tabindex="0"></div>';

// shell: the exam's [data-shell]; returns a function to call after each question is drawn
export function bindLayout(shell, { onResize } = {}) {
  const body = shell.querySelector('.exam-body');
  const apply = () => {
    const s = read();
    body.classList.toggle('nav-slim', !!s.navSlim);
    shell.classList.toggle('problem-hidden', !!s.problemHidden);
    if (s.split) shell.style.setProperty('--split', `${s.split}%`);
    if (s.edh) shell.style.setProperty('--edh', `${s.edh}px`);
    shell.style.setProperty('--q-scale', String(SIZES[s.qsize ?? 1] ?? 1));
    shell.querySelectorAll('[data-fold-nav]').forEach((b) => { b.setAttribute('aria-expanded', String(!s.navSlim)); b.innerHTML = icon(s.navSlim ? 'right' : 'left') + `<span class="sr-only">${s.navSlim ? 'Open' : 'Fold'} the question list</span>`; });
    shell.querySelectorAll('[data-fold-problem]').forEach((b) => { b.setAttribute('aria-expanded', String(!s.problemHidden)); b.querySelector('[data-fold-label]').textContent = s.problemHidden ? 'Show problem' : 'Hide problem'; });
  };
  shell.addEventListener('click', (e) => {
    if (e.target.closest('[data-fold-nav]')) { write({ navSlim: !read().navSlim }); apply(); onResize?.(); }
    else if (e.target.closest('[data-fold-problem]')) { write({ problemHidden: !read().problemHidden }); apply(); onResize?.(); }
    else if (e.target.closest('[data-qsize]')) { const i = Math.max(0, Math.min(SIZES.length - 1, (read().qsize ?? 1) + Number(e.target.closest('[data-qsize]').dataset.qsize))); write({ qsize: i }); apply(); }
  });
  // drag the line between problem and code (or use the arrow keys on it)
  const setSplit = (pct) => { const v = Math.round(Math.max(20, Math.min(70, pct))); shell.style.setProperty('--split', `${v}%`); write({ split: v }); };
  shell.addEventListener('pointerdown', (e) => {
    const g = e.target.closest('[data-gutter]'); if (!g) return;
    e.preventDefault();
    const split = g.parentElement, box = split.getBoundingClientRect();
    g.setPointerCapture(e.pointerId);
    const move = (ev) => setSplit(((ev.clientX - box.left) / box.width) * 100);
    const up = () => { g.removeEventListener('pointermove', move); g.removeEventListener('pointerup', up); onResize?.(); };
    g.addEventListener('pointermove', move); g.addEventListener('pointerup', up);
  });
  shell.addEventListener('keydown', (e) => {
    if (!e.target.matches?.('[data-gutter]') || !['ArrowLeft', 'ArrowRight'].includes(e.key)) return;
    e.preventDefault(); setSplit((read().split || 42) + (e.key === 'ArrowLeft' ? -3 : 3)); onResize?.();
  });
  apply();
  // after each question is drawn: remember the code box height when it's dragged from its corner
  return () => {
    apply();
    const wrap = shell.querySelector('.exam-code .cm-host');
    if (!wrap) return;
    wrap.addEventListener('pointerdown', () => {
      const h0 = wrap.offsetHeight;
      window.addEventListener('pointerup', () => { const h = wrap.offsetHeight; if (h !== h0 && h >= 160) { write({ edh: h }); shell.style.setProperty('--edh', `${h}px`); onResize?.(); } }, { once: true });
    });
  };
}
// After Run: bring the output (and any errors) into view inside the code side
export function showOutput(out) { out?.scrollIntoView({ block: 'nearest', behavior: 'smooth' }); }
