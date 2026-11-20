// The exam screen's device checks and integrity watchers (used by take.js).
// Before the start: a second screen, a virtual machine, a writing or AI helper on the page, a phone
// (when not allowed) or a missing Safe Exam Browser each stop the exam from starting, and they are checked
// again at the moment Start is pressed. During the exam they are only reported to the professor.
import { icon } from '../ui.js';
import { machineKind, machineHints, gpuRenderer, findHelpers, watchHelpers, secondScreen, watchScreens } from '../integrity.js';

// What this device looks like right now
export function deviceNow(dev) {
  return { ...dev, extended: secondScreen(), machine: machineKind(), hints: machineHints(), gpu: gpuRenderer().slice(0, 120), helpers: findHelpers() };
}

// The checks shown before the start: [kind, html], kind 'good' | 'bad' (stops the start) | 'warn'
export function deviceChecks(t, d) {
  const items = [];
  if (t.requireSEB) items.push(d.seb ? ['good', 'Safe Exam Browser: ready'] : ['bad', 'This exam must be taken in <strong>Safe Exam Browser</strong>. Install it free from <a href="https://safeexambrowser.org/download_en.html" target="_blank" rel="noopener">safeexambrowser.org</a> and open the exam from it, as your professor explains.']);
  if (!t.allowPhones && d.phone) items.push(['bad', 'Phones can\'t be used for this exam. Use a laptop, desktop or iPad.']);
  if (d.extended) items.push(['bad', 'A <strong>second screen</strong> is connected. Unplug it (or turn off screen mirroring and extending), then press Check again.']);
  if (d.machine === 'vm' && !d.seb) items.push(['bad', 'This looks like a <strong>virtual machine</strong> or a remote desktop. Take the exam on your own computer directly.']);
  if (d.helpers.length) items.push(['bad', `A writing or AI helper is on this page: <strong>${d.helpers.join(', ')}</strong>. Open the exam in a <strong>private window</strong> (add-ons are off there; sign in again), or turn the add-on off completely in your browser's extensions, then press Check again.`]);
  if (!t.requireSEB && !document.fullscreenEnabled && !document.webkitFullscreenEnabled) items.push(['warn', 'This browser can\'t go full screen. Chrome, Edge, Firefox or Safari on a computer work best.']);
  if (!items.some((x) => x[0] !== 'good')) items.push(['good', 'This device is ready.']);
  return items;
}
export const blocked = (items) => items.some(([k]) => k === 'bad');
export const checksList = (items, preview) => `<ul class="dev-checks" data-checks>${items.map(([k, h]) => `<li class="${k}">${icon(k === 'good' ? 'check' : 'x')}<span>${h}</span></li>`).join('')}</ul>
  ${blocked(items) ? `<p class="small"><button type="button" class="btn small" data-recheck>${icon('shuffle')} Check again</button>${preview ? ' <span class="muted">Preview: you can start anyway; students can\'t.</span>' : ''}</p>` : ''}`;

// During the exam: report helpers, a second screen and code dropped in by a tool. flag(type, detail)
// records one event for the professor. Returns a function that stops watching.
export function watchExam(flag) {
  const stops = [];
  stops.push(watchHelpers((names) => flag('helper-detected', names.join(', '))));
  stops.push(watchScreens((ext) => { if (ext) flag('second-screen', ''); }));
  return () => stops.forEach((f) => f());
}
// The editor refuses code dropped in at once; this turns refusals into at most one event per 15 seconds
export function insertReporter(flag, notice) {
  let last = 0, count = 0;
  return (n) => {
    count++;
    notice('Code can only be typed during the exam. Pasted or inserted code is blocked.');
    if (Date.now() - last > 15000) { last = Date.now(); flag('insert-blocked', `${n} characters at once${count > 1 ? `, ${count} times so far` : ''}`); }
  };
}

// ---- The exit code: after finishing, the student types the code shown in the room. Their answers are
// already in; the code only shows the professor they finished there (missing codes are flagged, not scored).
export const needsExit = (t, a, preview) => !preview && !!t?.requireExit && !!a && a.status !== 'open' && !a.exitAt;
export const exitBox = (W) => `<form class="take-code exit-code" data-exit novalidate>
    <p><strong>One last step: the exit code.</strong> Your answers are already saved. Type the exit code your professor shows in the room to finish.</p>
    <label class="field"><span>Exit code</span><input data-exit-code autocomplete="off" autocapitalize="characters" spellcheck="false" maxlength="12" inputmode="text" aria-describedby="exit-err"></label>
    <p class="bad small" id="exit-err" data-exit-err role="alert"></p>
    <p><button class="btn primary" data-exit-go>${icon('check')} Finish the ${W}</button></p>
  </form>`;
// submit(code) saves it (throws when the code is wrong); done() redraws the finished screen
export function bindExit(root, { submit, done, norm }) {
  const form = root.querySelector('[data-exit]'); if (!form) return;
  const input = form.querySelector('[data-exit-code]'), err = form.querySelector('[data-exit-err]'), go = form.querySelector('[data-exit-go]');
  input.focus();
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const code = norm(input.value);
    if (code.length < 4) { err.textContent = 'Type the exit code your professor shows (4 or more letters and numbers).'; return; }
    go.disabled = true; err.textContent = '';
    try { await submit(code); done(); }
    catch (x) { go.disabled = false; err.textContent = x?.message === 'wrong-code' ? "That code didn't work. Check it with your professor and try again." : x?.message === 'not-submitted' ? "Your submission hasn't reached the server yet, so the code can't be saved. Tell your professor now." : "Couldn't save it. Check your internet and try again."; input.select(); }
  });
}
