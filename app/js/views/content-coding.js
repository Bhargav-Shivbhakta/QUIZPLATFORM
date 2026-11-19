// Coding practice on the Practice page: a .zip (or folder) of programming assignments, checked in the
// browser (each reference solution runs against its tests) before anything is published. Used by
// content.js for a new coding-only practice set and for adding coding to an existing set.
import * as cloud from '../cloud.js';
import { readAssignments, solutionProblems, publicAssignments } from '../assignments-core.js';
import { testJava } from '../java/client.js';
import { formatErrors } from '../java/index.js';
import { esc, icon, plural, toast } from '../ui.js';

let jszip = null;
export function loadJSZip() {
  if (window.JSZip) return Promise.resolve(window.JSZip);
  return jszip ||= new Promise((res, rej) => {
    const s = document.createElement('script');
    s.src = 'vendor/jszip.min.js';
    s.onload = () => res(window.JSZip);
    s.onerror = () => rej(new Error("Couldn't load the zip reader."));
    document.head.appendChild(s);
  });
}
export function download(name, blob) {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob); a.download = name;
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 2000);
}

// A practice set with no questions has this as its question file: just its name.
export const emptySource = (title) => `---\ntitle: ${String(title).replace(/\n/g, ' ')}\n---\n`;
const wanted = (path) => /\.(md|java|in|out|txt)$/i.test(path) && !/(^|\/)(__MACOSX|\.)/.test(path);

// ctx: { main, classId, exam (the set, or null for a new one), slugId(title), onDone() }
export function codingPanel(ctx) {
  let check = null, fileName = '';
  const isNew = !ctx.exam;

  function html() {
    const e = ctx.exam;
    return `
      <section class="upload-panel">
        <h2>${isNew ? 'Add coding practice' : `Coding assignments for ${esc(e.title)}`}</h2>
        <p class="muted small">Choose a .zip with one folder per assignment (assignment.md, the starter .java file, tests/*.in and *.out, optional checks.txt, and solution/ with your reference solution). Each solution is run against its tests here before anything is published. Solutions are never shown to students.${e?.assignmentCount ? ' This replaces the current assignments; students keep the code they wrote.' : ''}</p>
        ${isNew ? '<label class="field"><span>Name students see</span><input data-asg-title maxlength="80" placeholder="For example: Midterm 3 Coding Practice"></label>' : ''}
        <div class="dropzone" data-drop="asg">
          <p class="drop-hint">${icon('upload')} <strong>Drag the .zip or the assignments folder here</strong> <span class="muted">or</span></p>
          <div class="row center"><label class="btn">${icon('upload')} Upload .zip<input type="file" accept=".zip,application/zip" data-zip hidden></label><label class="btn">Choose a folder<input type="file" webkitdirectory directory multiple data-asg-folder hidden></label></div>
          <p class="muted small drop-name" data-asg-name>${esc(fileName)}</p>
        </div>
        ${e?.assignmentCount ? `<p class="small"><button class="link-btn" data-dl-zip="${esc(e.id)}">Download the current ones as a starting point</button></p>` : ''}
        <div data-asg-result aria-live="polite"></div>
        <p class="small muted" data-asg-why role="status" aria-live="polite"></p>
        <div class="row end upload-actions"><button class="btn" data-cancel>Cancel</button><button class="btn primary" data-publish-asg disabled>${icon('check')} Publish</button></div>
      </section>`;
  }

  // Publish is only possible when every solution passes; say plainly what is stopping it.
  function why() {
    const c = check, title = ctx.main.querySelector('[data-asg-title]')?.value.trim();
    if (!c) return isNew && !title ? 'Name the set, then upload the .zip.' : 'Upload the .zip to check it.';
    if (c.error) return 'Fix the problem above, then upload the .zip again.';
    if (!c.result || c.running) return 'Checking… Publish unlocks when every reference solution has passed its tests.';
    if (!c.result.assignments.length) return 'No assignments were found, so there is nothing to publish.';
    if (c.result.errors.length) return 'Publish is off until the problems above are fixed.';
    const failing = c.result.assignments.filter((a) => c.problems.get(a.slug)?.length).length;
    if (failing) return `Publish is off: ${plural(failing, 'reference solution')} ${failing === 1 ? "doesn't" : "don't"} pass ${failing === 1 ? 'its' : 'their'} tests yet.`;
    if (isNew && !title) return 'Name the set to publish it.';
    return '';
  }
  function show() {
    const box = ctx.main.querySelector('[data-asg-result]'), btn = ctx.main.querySelector('[data-publish-asg]');
    if (!box) return;
    const c = check;
    const say = (t) => { const w = ctx.main.querySelector('[data-asg-why]'); if (w) w.textContent = t; };
    if (!c) { box.innerHTML = ''; btn.disabled = true; say(why()); return; }
    if (c.error) { box.innerHTML = `<p class="bad">Couldn't read ${esc(fileName || 'that')}: ${esc(c.error)}</p>`; btn.disabled = true; say(why()); return; }
    if (!c.result) { box.innerHTML = '<p class="muted">Reading the zip…</p>'; btn.disabled = true; say(why()); return; }
    const r = c.result;
    const failing = [...c.problems.values()].some((p) => p.length);
    const ok = !c.running && !r.errors.length && !failing && r.assignments.length > 0;
    box.innerHTML = `
      <div class="parse-result ${ok ? 'pr-good' : c.running ? '' : 'pr-bad'}">
        <p><strong>${c.running ? `Checking reference solutions… ${c.done} of ${r.assignments.length}` : ok ? `${icon('check')} ${plural(r.assignments.length, 'assignment')} ready` : !r.assignments.length ? `${icon('x')} No assignments found` : `${icon('x')} Fix the problems below, then upload the .zip again`}</strong></p>
        ${!r.assignments.length && !c.running ? '<p class="small">Each assignment needs its own folder with an assignment.md file inside.</p>' : ''}
        <ul class="asg-check">${r.assignments.map((a) => { const p = c.problems.get(a.slug); return `
          <li><span class="asg-check-icon ${p ? (p.length ? 'bad' : 'good') : a.solution == null ? 'warn' : ''}">${p ? (p.length ? icon('x') : icon('check')) : a.solution == null ? '!' : '…'}</span>
            <span><strong>${esc(a.title)}</strong> <span class="muted small">${plural(a.tests.length, 'test')}${a.checks.length ? ` + ${plural(a.checks.length, 'requirement')}` : ''}${a.solution == null ? ' · no solution, tests not verified' : p && !p.length ? ' · solution passes everything' : ''}</span>
            ${p && p.length ? `<pre class="small">${esc(p.join('\n'))}</pre>` : ''}</span></li>`; }).join('')}</ul>
        ${r.errors.length ? `<ul class="issue-list bad">${r.errors.map((e) => `<li>${esc(e)}</li>`).join('')}</ul>` : ''}
        ${r.warnings.length ? `<details><summary>${plural(r.warnings.length, 'warning')}</summary><ul class="issue-list">${r.warnings.map((w) => `<li>${esc(w)}</li>`).join('')}</ul></details>` : ''}
      </div>`;
    const blocked = why();
    btn.disabled = !ok || !!blocked;
    say(blocked);
  }
  async function run(name, read) {
    fileName = name; check = { running: true, problems: new Map(), done: 0 }; show();
    try {
      const files = await read();
      const result = readAssignments(files);
      check = { result, files, problems: new Map(), done: 0, running: true }; show();
      for (const a of result.assignments) {
        if (a.solution != null) {
          const r = await testJava(a.solution, { className: a.cls, tests: a.tests.map(({ name: n, input, output }) => ({ name: n, input, output })), checks: a.checks }, a.cls + '.java');
          check.problems.set(a.slug, r.killed ? ['the reference solution ran too long (infinite loop?)'] : solutionProblems(a, r, formatErrors));
        }
        check.done++; show();
      }
      check.running = false;
    } catch (e) { check = { error: e?.message || String(e) }; }
    show();
  }
  function useZip(f) {
    if (!/\.zip$/i.test(f.name)) { toast(`"${f.name}" isn't a .zip. Upload a .zip, or the assignments folder itself.`, 'bad'); return; }
    ctx.main.querySelector('[data-asg-name]').textContent = f.name;
    return run(f.name, async () => {
      const zip = await (await loadJSZip()).loadAsync(f);
      const files = new Map();
      for (const z of Object.values(zip.files).filter((z) => !z.dir && wanted(z.name))) files.set(z.name.replace(/\\/g, '/'), await z.async('string'));
      return files;
    });
  }
  // a folder: [{ path, file }]
  function useFolder(name, list) {
    ctx.main.querySelector('[data-asg-name]').textContent = name;
    return run(name, async () => {
      const files = new Map();
      for (const { path, file } of list) if (wanted(path)) files.set(path.replace(/\\/g, '/'), await file.text());
      if (!files.size) throw new Error('that folder has no assignment files in it (assignment.md, .java, tests/*.in and *.out)');
      return files;
    });
  }
  async function publish(all) {
    const btn = ctx.main.querySelector('[data-publish-asg]');
    let examId = ctx.exam?.id;
    const title = isNew ? ctx.main.querySelector('[data-asg-title]').value.trim() : ctx.exam.title;
    if (isNew) {
      examId = ctx.slugId(title);
      if (all.some((e) => e.id === examId)) { toast(`This class already has a practice set called "${title}". Choose another name.`, 'bad'); return; }
    }
    btn.disabled = true; btn.textContent = 'Publishing…';
    try {
      if (isNew) await cloud.saveExam(ctx.classId, { examId, meta: { title }, source: emptySource(title), counts: { questions: 0, onExam: 0, topics: [] } });
      const files = [...check.files.entries()].map(([path, text]) => ({ path, text }));
      await cloud.saveAssignments(ctx.classId, examId, { assignments: publicAssignments(check.result.assignments), files });
      toast(isNew ? `${title} published with ${plural(check.result.assignments.length, 'coding assignment')}.` : `${plural(check.result.assignments.length, 'assignment')} published`, 'good');
      ctx.onDone();
    } catch (e) {
      toast("Couldn't publish: " + (e?.message || e) + '. Check you are an instructor for this class, then try again.', 'bad');
      btn.disabled = false; btn.innerHTML = `${icon('check')} Publish`;
    }
  }
  return { html, show, useZip, useFolder, publish };
}
