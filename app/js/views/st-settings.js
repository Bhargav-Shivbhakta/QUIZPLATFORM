// Settings, for students (DESIGN › Parts: rows with a label on the left and one control on the right).
// Every change saves at once and says so quietly; nothing needs a Save button.
// Same settings as before (store.js), plus the study buddy, motion and the weekly goal.
import * as store from '../store.js';
import * as cloud from '../cloud.js';
import { getManifest } from '../data.js';
import { esc, icon, toast, confirmDialog } from '../ui.js';
import { applyTheme } from '../nav.js';
import { fmtDate } from '../engine.js';
import { dayKey } from '../format.js';
import { buddy } from '../buddy.js';
import { mountShell, setPlace, classColor } from '../stshell.js';
import { mountBell } from '../notify.js';
import { badgeFor, classTitle } from '../navmap.js';
import { isReviewer, preview, setPreview } from '../navfc.js';

// one choice from a few: a segmented control (a radio group)
const seg = (name, cur, opts, label) => `<div class="ss-seg" role="radiogroup" aria-label="${esc(label)}">${opts.map(([v, l]) => `<label><input type="radio" name="${name}" value="${v}" ${String(cur) === String(v) ? 'checked' : ''}><span>${esc(l)}</span></label>`).join('')}</div>`;
const sw = (name, on, label) => `<label class="ss-switch"><input type="checkbox" role="switch" name="${name}" ${on ? 'checked' : ''} aria-label="${esc(label)}"><span aria-hidden="true"></span></label>`;
const row = (title, help, control, id = '') => `<div class="ss-row" ${id ? `id="${id}"` : ''}><div class="ss-text"><span class="ss-title">${title}</span>${help ? `<span class="ss-help">${help}</span>` : ''}</div><div class="ss-control">${control}</div></div>`;

export async function render(main) {
  const s = store.getSettings(), u = cloud.currentUser(), mine = cloud.myClasses();
  const sets = await getManifest().then((m) => m.exams.filter((e) => !e.preview && cloud.canSeeExam(e.id) && mine.some((c) => (c.exams || []).includes(e.id)))).catch(() => []);
  const name = u.displayName || u.email, initials = name.split(/[\s@.]+/).filter(Boolean).slice(0, 2).map((x) => x[0].toUpperCase()).join('');
  main.innerHTML = `
    <section class="st-page st-settings">
      <header class="st-hello"><div><h1>Settings</h1></div><p class="ss-saved st-muted st-small" data-saved role="status" aria-live="polite"></p></header>

      <section class="st-card ss-card" aria-labelledby="ss-acc">
        <h2 id="ss-acc" class="sr-only">Your account</h2>
        <div class="ss-account"><span class="st-avatar ss-avatar">${u.photoURL ? `<img src="${esc(u.photoURL)}" alt="" referrerpolicy="no-referrer">` : esc(initials)}</span>
          <div class="ss-who"><strong>${esc(u.displayName || u.email)}</strong><span class="st-muted">${esc(u.email)}</span><span class="ss-sync st-small" data-sync></span></div>
          <span class="ss-acts"><button type="button" class="st-btn st-btn-ghost st-sm" data-sync-now>${icon('upload')} Save now</button><button type="button" class="st-btn st-btn-ghost st-sm" data-signout>Sign out</button></span></div>
        <ul class="ss-classes" aria-label="Your classes">${mine.map((c) => `<li class="cc-${classColor(c)}"><span class="st-badge" aria-hidden="true">${esc(badgeFor(c.course, c.name))}</span><span class="ss-cn">${esc(classTitle(c))}${c.section ? `<span class="st-muted st-small">Section ${esc(c.section)}</span>` : ''}</span></li>`).join('')}</ul>
      </section>

      <form class="ss-form" data-prefs>
        <section class="st-card ss-card" aria-labelledby="ss-study"><h2 id="ss-study">Studying</h2>
          <div class="ss-row ss-row-wide"><div class="ss-text"><span class="ss-title">Study buddy</span><span class="ss-help">Cheers you on at a few moments. Never in exams.</span></div>
            <div class="ss-buddies" role="radiogroup" aria-label="Study buddy">${[['dot', 'The Dot'], ['flame', 'The Flame'], ['off', 'Off']].map(([v, l]) => `<label class="ss-buddy"><input type="radio" name="buddy" value="${v}" ${(s.buddy || 'dot') === v ? 'checked' : ''}><span>${v === 'off' ? '<i class="ss-none" aria-hidden="true">–</i>' : buddy('happy', { size: 48, kind: v })}${l}</span></label>`).join('')}</div></div>
          ${row('Weekly goal', 'Days a week you aim to study.', seg('weekGoal', s.weekGoal || 3, [[2, '2'], [3, '3'], [4, '4'], [5, '5']], 'Weekly goal, days'))}
          ${row('Show answers', 'In practice. Practice tests always show them at the end.', seg('feedback', s.feedback, [['instant', 'After each question'], ['end', 'At the end']], 'Show answers'))}
          ${row('Shuffle answer choices', 'Timed practice tests keep the original order.', sw('shuffleChoices', s.shuffleChoices, 'Shuffle answer choices'))}
          ${row('Ask before submitting', 'Even when every question is answered.', sw('confirmSubmit', s.confirmSubmit, 'Ask before submitting'))}
        </section>

        <section class="st-card ss-card" aria-labelledby="ss-look"><h2 id="ss-look">Appearance</h2>
          ${row('Theme', '', seg('theme', s.theme, [['system', 'Device'], ['light', 'Light'], ['dark', 'Dark']], 'Theme'))}
          ${row('Text size', '', seg('textSize', s.textSize, [['s', 'Small'], ['m', 'Medium'], ['l', 'Large']], 'Text size'))}
          ${row('Motion', 'Soft keeps every screen the same, with quieter movement. Reduce motion on your device turns it off.', seg('motion', s.motion || 'full', [['full', 'Full'], ['soft', 'Soft']], 'Motion'))}
          ${row('Easier reading', 'The Lexend font with wider spacing, which many readers with dyslexia find easier.', sw('easyRead', s.readFont === 'easy', 'Easier reading'))}
          ${row('High contrast', '', sw('highContrast', s.contrast === 'high', 'High contrast'))}
        </section>
      </form>

      ${isReviewer() ? `<section class="st-card ss-card" aria-labelledby="ss-fc"><h2 id="ss-fc">Finished bar</h2>
        ${row('Show the finished bar', 'Every place Cramming will have, including the ones not built yet. Only reviewers have this.', sw('fcBar', preview(), 'Show the finished bar'))}
      </section>` : ''}

      <section class="st-card ss-card" aria-labelledby="ss-data"><h2 id="ss-data">Your data</h2>
        <p class="st-muted st-small ss-intro">Your progress and code are saved to your school account, so you can sign in on any device. Your professor can see them.</p>
        ${row('Download a backup', 'Your scores, history, saved questions, notes and code, as one file.', `<button type="button" class="st-btn st-btn-ghost st-sm" data-export>${icon('download')} Download</button>`)}
        ${row('Restore a backup', 'Adds a backup file to this device. Nothing here is lost.', `<label class="st-btn st-btn-ghost st-sm">${icon('upload')} Choose file<input type="file" accept=".json,application/json" data-import hidden></label>`)}
        ${sets.length ? row('Start a practice set over', 'Clears your scores, history and code for one set.', `<span class="ss-reset"><label class="sr-only" for="ss-set">Practice set</label><select id="ss-set" data-reset-set>${sets.map((e) => `<option value="${esc(e.id)}">${esc(e.title)}</option>`).join('')}</select><button type="button" class="st-btn st-btn-ghost st-sm ss-danger" data-reset>Start over</button></span>`) : ''}
        ${row('Erase everything', 'All your progress and code, from your account and this device.', '<button type="button" class="st-btn st-btn-ghost st-sm ss-danger" data-wipe>Erase</button>')}
      </section>
    </section>`;

  const saved = main.querySelector('[data-saved]');
  let st;
  const say = (t) => { saved.textContent = t; clearTimeout(st); st = setTimeout(() => { saved.textContent = ''; }, 2500); };
  const syncEl = main.querySelector('[data-sync]');
  const paintSync = () => {
    const x = cloud.syncState();
    syncEl.className = `ss-sync st-small ${x.error ? 'ss-bad' : 'ss-good'}`;
    syncEl.textContent = x.error ? x.error : x.pending ? 'Saving soon…' : x.lastSynced ? `Saved to your account ${Date.now() - x.lastSynced < 60000 ? 'just now' : fmtDate(x.lastSynced)}` : 'Connected';
  };
  paintSync();
  window.addEventListener('qp:sync', paintSync);
  const tick = setInterval(paintSync, 30000);

  main.querySelector('[data-prefs]').addEventListener('change', (ev) => {
    const f = ev.currentTarget;
    store.saveSettings({
      buddy: f.buddy.value, weekGoal: Number(f.weekGoal.value), feedback: f.feedback.value, shuffleChoices: f.shuffleChoices.checked, confirmSubmit: f.confirmSubmit.checked,
      theme: f.theme.value, textSize: f.textSize.value, motion: f.motion.value, readFont: f.easyRead.checked ? 'easy' : 'standard', contrast: f.highContrast.checked ? 'high' : 'normal',
    });
    applyTheme();
    if (['buddy', 'motion'].includes(ev.target.name)) { mountShell(); mountBell(); setPlace({ path: '/settings' }); }
    say('Saved');
  });
  main.addEventListener('click', async (ev) => {
    const b = ev.target.closest('button'); if (!b) return;
    if ('syncNow' in b.dataset) { b.disabled = true; try { await cloud.flush(); } finally { b.disabled = false; } paintSync(); say(cloud.syncState().error ? '' : 'Saved to your account'); return; }
    if ('signout' in b.dataset) {
      if (await confirmDialog({ title: 'Sign out?', body: '<p>Your progress is saved to your account. It is removed from this browser, so the next person on this device starts fresh.</p>', confirm: 'Sign out' })) await cloud.signOut();
      return;
    }
    if ('export' in b.dataset) {
      const a = document.createElement('a');
      a.href = URL.createObjectURL(new Blob([JSON.stringify(store.exportAll())], { type: 'application/json' }));
      a.download = `cramming-progress-${dayKey()}.json`;
      document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(a.href), 2000);
      say('Backup downloaded'); return;
    }
    if ('reset' in b.dataset) {
      const sel = main.querySelector('[data-reset-set]'), title = sel.selectedOptions[0].textContent;
      if (await confirmDialog({ title: `Start ${title} over?`, body: `<p>Your scores, history, saved questions, notes and code for ${esc(title)} are erased from your account and this device. This can't be undone. Download a backup first if you want one.</p>`, confirm: 'Start over', danger: true })) { store.resetExam(sel.value); toast(`${title} starts fresh`); }
      return;
    }
    if ('wipe' in b.dataset) {
      if (await confirmDialog({ title: 'Erase everything?', body: '<p>All your progress, history, code and settings are erased from your account and this device. This can\'t be undone.</p>', confirm: 'Erase everything', danger: true })) { store.resetEverything(); applyTheme(); toast('Everything erased'); window.dispatchEvent(new HashChangeEvent('hashchange')); }
    }
  });
  main.querySelector('[name="fcBar"]')?.addEventListener('change', (ev) => {
    setPreview(ev.target.checked);
    mountShell(); mountBell(); setPlace({ path: '/settings' });
    toast(ev.target.checked ? 'The finished bar is on' : 'The finished bar is off');
  });
  main.querySelector('[data-import]').addEventListener('change', async (ev) => {
    const file = ev.target.files[0]; if (!file) return;
    try { const n = store.importAll(JSON.parse(await file.text())); applyTheme(); toast(`Backup restored (${n} item${n === 1 ? '' : 's'})`, 'good'); }
    catch (e) { toast(e instanceof SyntaxError ? "That file couldn't be read. Choose a backup downloaded from Cramming." : e.message, 'bad'); }
    ev.target.value = '';
  });
  return () => { window.removeEventListener('qp:sync', paintSync); clearInterval(tick); };
}
