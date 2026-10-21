import * as store from '../store.js';
import { getManifest } from '../data.js';
import { esc, icon, toast, confirmDialog } from '../ui.js';
import { applyTheme } from '../main.js';

export async function render(main) {
  const s = store.getSettings();
  let exams = [];
  try { exams = (await getManifest()).exams.filter((e) => !e.preview); } catch {}

  const radio = (name, value, label, cur) => `<label class="chip"><input type="radio" name="${name}" value="${value}" ${cur === value ? 'checked' : ''}><span>${label}</span></label>`;

  main.innerHTML = `
    <section class="page narrow settings">
      <h1>Settings</h1>
      <form class="setup-form" data-prefs>
        <fieldset><legend>Theme</legend><div class="chip-row">
          ${radio('theme', 'system', 'Match my device', s.theme)}${radio('theme', 'light', 'Light', s.theme)}${radio('theme', 'dark', 'Dark', s.theme)}
        </div></fieldset>
        <fieldset><legend>Text size</legend><div class="chip-row">
          ${radio('textSize', 's', 'Small', s.textSize)}${radio('textSize', 'm', 'Medium', s.textSize)}${radio('textSize', 'l', 'Large', s.textSize)}
        </div></fieldset>
        <fieldset><legend>In practice modes, show answers</legend><div class="chip-row">
          ${radio('feedback', 'instant', 'After each question', s.feedback)}${radio('feedback', 'end', 'At the end', s.feedback)}
        </div></fieldset>
        <fieldset><legend>Quiz options</legend>
          <label class="check"><input type="checkbox" name="shuffleChoices" ${s.shuffleChoices ? 'checked' : ''}><span>Shuffle answer choices in practice (the real exam keeps the original order)</span></label>
          <label class="check"><input type="checkbox" name="confirmSubmit" ${s.confirmSubmit ? 'checked' : ''}><span>Ask before submitting even when every question is answered</span></label>
        </fieldset>
      </form>

      <h2 class="section-title">Your data</h2>
      <p class="muted">Everything is stored only in this browser on this device (about ${store.storageUsedKB()} KB). To study on another device, export here and import there. Clearing your browser data erases it.</p>
      <div class="data-actions">
        <div class="data-row">
          <div><strong>Export progress</strong><span class="muted small">Downloads a small file with your scores, history, saved questions and notes.</span></div>
          <button class="btn" data-export>${icon('download')} Export</button>
        </div>
        <div class="data-row">
          <div><strong>Import progress</strong><span class="muted small">Merges a progress file into this browser. Nothing here is lost.</span></div>
          <label class="btn">${icon('upload')} Import<input type="file" accept=".json,application/json" data-import hidden></label>
        </div>
        ${exams.map((e) => `
        <div class="data-row">
          <div><strong>Reset ${esc(e.title)}</strong><span class="muted small">Clears your scores, history and saved questions for this exam only.</span></div>
          <button class="btn danger-outline" data-reset="${esc(e.id)}" data-title="${esc(e.title)}">Reset</button>
        </div>`).join('')}
        <div class="data-row">
          <div><strong>Erase everything</strong><span class="muted small">Removes all progress and settings from this browser.</span></div>
          <button class="btn danger-outline" data-wipe>${icon('trash')} Erase</button>
        </div>
      </div>
    </section>`;

  main.querySelector('[data-prefs]').addEventListener('change', (ev) => {
    const f = ev.currentTarget;
    store.saveSettings({
      theme: f.theme.value, textSize: f.textSize.value, feedback: f.feedback.value,
      shuffleChoices: f.shuffleChoices.checked, confirmSubmit: f.confirmSubmit.checked,
    });
    applyTheme();
    toast('Settings saved');
  });

  main.querySelector('[data-export]').onclick = () => {
    const blob = new Blob([JSON.stringify(store.exportAll())], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `exam-practice-progress-${new Date().toLocaleDateString('en-CA')}.json`;
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 2000);
    toast('Progress exported');
  };
  main.querySelector('[data-import]').onchange = async (ev) => {
    const file = ev.target.files[0];
    if (!file) return;
    try {
      const n = store.importAll(JSON.parse(await file.text()));
      applyTheme();
      toast(`Progress imported (${n} item${n === 1 ? '' : 's'} merged)`, 'good');
    } catch (e) {
      toast(e instanceof SyntaxError ? "That file couldn't be read. Choose a progress file exported from this site." : e.message, 'bad');
    }
    ev.target.value = '';
  };
  main.querySelectorAll('[data-reset]').forEach((b) => (b.onclick = async () => {
    if (await confirmDialog({ title: `Reset ${b.dataset.title}?`, body: '<p>Your scores, history, saved questions and notes for this exam will be erased from this browser. This can\'t be undone. Export first if you want a backup.</p>', confirm: 'Reset', danger: true })) {
      store.resetExam(b.dataset.reset);
      toast(`${b.dataset.title} reset`);
      render(main);
    }
  }));
  main.querySelector('[data-wipe]').onclick = async () => {
    if (await confirmDialog({ title: 'Erase everything?', body: '<p>All progress, history and settings for every exam will be erased from this browser. This can\'t be undone.</p>', confirm: 'Erase everything', danger: true })) {
      store.resetEverything();
      applyTheme();
      toast('Everything erased');
      render(main);
    }
  };
}
