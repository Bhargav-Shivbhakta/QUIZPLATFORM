// Admin: create classes, choose their exams and instructors, upload Canvas rosters.
import { getManifest } from '../data.js';
import * as cloud from '../cloud.js';
import { esc, icon, plural, toast, confirmDialog } from '../ui.js';
import { fmtDate } from '../engine.js';
import { parseRoster, classIdFrom } from '../roster.js';

export async function render(main, params = {}, query = {}) {
  if (!cloud.enabled || !cloud.isAdmin()) {
    main.innerHTML = `<section class="page narrow empty-state"><h1>Admins only</h1><p>Only site admins can manage classes. Admins are listed in <code>firestore.rules</code> (see the README).</p><a class="btn primary" href="#/">Go home</a></section>`;
    return;
  }
  const manifest = await getManifest();
  const exams = manifest.exams.filter((e) => !e.preview);
  let classes = [];
  try { classes = await cloud.listClasses(); } catch (e) {
    main.innerHTML = `<section class="page narrow empty-state"><h1>Couldn't load classes</h1><p>${esc(e?.message || e)}</p></section>`;
    return;
  }
  if (query.edit) {
    const cls = query.edit === 'new' ? null : classes.find((c) => c.id === query.edit);
    return editor(main, cls, exams, classes);
  }
  const examTitle = (id) => { const e = exams.find((x) => x.id === id); return e ? (e.course ? e.course + ' · ' : '') + e.title : id + ' (missing)'; };
  main.innerHTML = `
    <section class="page admin">
      <header class="inst-head">
        <div>
          <p class="eyebrow">Admin</p>
          <h1>Classes and rosters</h1>
          <p class="muted">Only students on a class roster can use the site, and they see only their classes' exams.</p>
        </div>
        <a class="btn primary" href="#/admin?edit=new">${icon('note')} New class</a>
      </header>
      ${classes.length ? `<div class="class-admin-list">
        ${classes.map((c) => `
          <article class="class-admin">
            <div class="class-admin-main">
              <h2>${esc(c.name)}</h2>
              <p class="muted small">${esc([c.course, c.term].filter(Boolean).join(' · '))}${c.updatedAt ? ` · roster updated ${esc(fmtDate(c.updatedAt))}` : ''}</p>
              <p><strong>${plural(c.studentCount || 0, 'student')}</strong> · ${(c.exams || []).map((id) => esc(examTitle(id))).join(', ') || '<span class="bad">no exams chosen</span>'}</p>
              <p class="muted small">Instructors: ${(c.instructors || []).map(esc).join(', ') || 'none'}</p>
            </div>
            <div class="row">
              <a class="btn" href="#/instructor?class=${encodeURIComponent(c.id)}">${icon('grid')} Dashboard</a>
              <a class="btn" href="#/admin?edit=${encodeURIComponent(c.id)}">Edit / new roster</a>
              <button class="btn danger-outline" data-delete="${esc(c.id)}" data-name="${esc(c.name)}">${icon('trash')}<span class="sr-only">Delete ${esc(c.name)}</span></button>
            </div>
          </article>`).join('')}
      </div>` : `<div class="empty-state"><h2>No classes yet</h2><p>Create a class, pick its exams and upload the Canvas roster. Students on the roster can then sign in.</p></div>`}
    </section>`;
  main.querySelectorAll('[data-delete]').forEach((b) => (b.onclick = async () => {
    const ok = await confirmDialog({ title: `Delete ${b.dataset.name}?`, body: '<p>Students on this roster lose access to the class right away. Their own saved progress is kept, and you can re-create the class later.</p>', confirm: 'Delete class', danger: true });
    if (!ok) return;
    b.disabled = true;
    try { await cloud.deleteClass(b.dataset.delete); toast('Class deleted'); await cloud.refreshAccess(); render(main, params, {}); }
    catch (e) { toast("Couldn't delete: " + (e?.message || e), 'bad'); b.disabled = false; }
  }));
}

async function editor(main, cls, exams, classes) {
  const isNew = !cls;
  let current = [];
  if (!isNew) { try { current = await cloud.getRoster(cls.id); } catch {} }
  let parsed = null;
  const courses = [...new Set(exams.map((e) => e.course || ''))];
  main.innerHTML = `
    <section class="page narrow admin-edit">
      <nav class="crumbs"><a href="#/admin">Classes</a></nav>
      <h1>${isNew ? 'New class' : `Edit ${esc(cls.name)}`}</h1>
      <form class="setup-form" data-form novalidate>
        <fieldset><legend>Class</legend>
          <label class="field"><span>Class name</span><input name="name" required maxlength="80" placeholder="CS150 Fall 2026" value="${esc(cls?.name || '')}"></label>
          <p class="muted small" data-id-note>${isNew ? 'Class ID: <code data-id>…</code>' : `Class ID: <code>${esc(cls.id)}</code> (can't change)`}</p>
          <label class="field"><span>Term <span class="muted">(optional)</span></span><input name="term" maxlength="40" placeholder="Fall 2026" value="${esc(cls?.term || '')}"></label>
        </fieldset>
        <fieldset><legend>Exams in this class</legend>
          ${courses.map((c) => `<p class="muted small exam-group">${esc(c || 'Other exams')}</p><div class="chip-row">${exams.filter((e) => (e.course || '') === c).map((e) => `
            <label class="chip"><input type="checkbox" name="exam" value="${esc(e.id)}" ${cls?.exams?.includes(e.id) ? 'checked' : ''}><span>${esc(e.title)}${e.archived ? ' (past)' : ''}</span></label>`).join('')}</div>`).join('')}
        </fieldset>
        <fieldset><legend>Instructors</legend>
          <p class="muted small fieldset-help">Teachers and TAs in the roster are added automatically. Add anyone else here, one email per line.</p>
          <textarea name="instructors" rows="2" placeholder="professor@sdsu.edu">${esc((cls?.instructors || []).filter((e) => !current.some((p) => p.email === e && p.role === 'instructor')).join('\n'))}</textarea>
        </fieldset>
        <fieldset><legend>Roster</legend>
          ${!isNew ? `<p class="small">Current roster: <strong>${plural(current.filter((p) => p.role !== 'instructor').length, 'student')}</strong>${current.some((p) => p.role === 'instructor') ? ` and ${plural(current.filter((p) => p.role === 'instructor').length, 'instructor')}` : ''}. Upload a new roster to replace it, or leave this empty to keep it.</p>` : ''}
          <p class="muted small fieldset-help">In Canvas, open the course's <strong>People</strong> page, select the whole table and copy it, then paste below. A CSV file works too (for example a Gradebook export). It needs a Name column and a Login ID or Email column.</p>
          <div class="row"><label class="btn">${icon('upload')} Choose CSV file<input type="file" accept=".csv,.tsv,.txt,text/csv,text/plain" data-file hidden></label><span class="muted small" data-file-name></span></div>
          <textarea name="paste" rows="5" placeholder="…or paste the roster table here" spellcheck="false"></textarea>
          <div data-preview aria-live="polite"></div>
        </fieldset>
        <p class="form-error bad small" data-err role="alert" hidden></p>
        <div class="row"><a class="btn" href="#/admin">Cancel</a><button class="btn primary big" type="submit">${isNew ? 'Create class' : 'Save changes'}</button></div>
      </form>
    </section>`;
  const form = main.querySelector('[data-form]');
  const err = main.querySelector('[data-err]');
  const preview = main.querySelector('[data-preview]');
  const idEl = main.querySelector('[data-id]');
  const showErr = (m) => { err.textContent = m; err.hidden = !m; if (m) err.scrollIntoView({ block: 'nearest', behavior: 'smooth' }); };
  const updId = () => { if (idEl) idEl.textContent = classIdFrom(form.name.value) || '…'; };
  form.name.addEventListener('input', updId); updId();
  form.addEventListener('change', () => showErr(''));

  function showPreview(text) {
    if (!text.trim()) { parsed = null; preview.innerHTML = ''; return; }
    parsed = parseRoster(text, cloud.domain);
    if (parsed.error) { preview.innerHTML = `<p class="bad small">${esc(parsed.error)}</p>`; return; }
    const students = parsed.people.filter((p) => p.role !== 'instructor');
    const staff = parsed.people.filter((p) => p.role === 'instructor');
    const sections = [...new Set(students.flatMap((p) => p.section.split(', ').filter(Boolean)))];
    const removed = current.filter((p) => !parsed.people.some((q) => q.email === p.email));
    const added = parsed.people.filter((p) => !current.some((q) => q.email === p.email));
    preview.innerHTML = `
      <div class="roster-preview">
        <p><strong>${plural(students.length, 'student')}</strong>${staff.length ? ` and <strong>${plural(staff.length, 'instructor')}</strong> (${staff.map((p) => esc(p.name || p.email)).join(', ')})` : ''} found${sections.length ? ` in ${plural(sections.length, 'section')}` : ''}.
        ${!isNew ? `<br><span class="small">${added.length} new, ${removed.length} will lose access${removed.length ? `: ${removed.slice(0, 5).map((p) => esc(p.name || p.email)).join(', ')}${removed.length > 5 ? '…' : ''}` : ''}.</span>` : ''}</p>
        <p class="muted small">Columns used: ${Object.entries(parsed.columns).map(([k, v]) => `${esc(v)} → ${k === 'login' ? 'email' : k === 'redId' ? 'RedID' : k}`).join(', ')}</p>
        <div class="table-wrap"><table class="inst-table compact">
          <thead><tr><th>Name</th><th>Email (used to sign in)</th><th>RedID</th><th>Section</th><th>Role</th></tr></thead>
          <tbody>${parsed.people.slice(0, 8).map((p) => `<tr><td>${esc(p.name)}</td><td>${esc(p.email)}</td><td>${esc(p.redId)}</td><td>${esc(p.section)}</td><td>${p.role}</td></tr>`).join('')}
          ${parsed.people.length > 8 ? `<tr><td colspan="5" class="muted">…and ${parsed.people.length - 8} more</td></tr>` : ''}</tbody>
        </table></div>
        ${parsed.skipped.length ? `<details class="skipped" open><summary class="bad">${plural(parsed.skipped.length, 'row')} skipped</summary><ul>${parsed.skipped.map((s) => `<li><span class="muted">Line ${s.line}:</span> ${esc(s.text)} <strong>(${esc(s.reason)})</strong></li>`).join('')}</ul></details>` : ''}
        <p class="muted small">Check that the emails look right: they must match the SDSU account each student signs in with.</p>
      </div>`;
  }
  form.paste.addEventListener('input', () => showPreview(form.paste.value));
  main.querySelector('[data-file]').addEventListener('change', async (ev) => {
    const f = ev.target.files[0];
    if (!f) return;
    if (/\.xlsx?$/i.test(f.name)) { showErr('That is an Excel file. In Excel choose File → Save As → CSV, then choose the CSV here.'); return; }
    main.querySelector('[data-file-name]').textContent = f.name;
    form.paste.value = await f.text();
    showPreview(form.paste.value);
  });

  form.addEventListener('submit', async (ev) => {
    ev.preventDefault();
    showErr('');
    const name = form.name.value.trim();
    const id = isNew ? classIdFrom(name) : cls.id;
    const examIds = [...form.querySelectorAll('input[name=exam]:checked')].map((i) => i.value);
    const instructors = form.instructors.value.split(/[\s,;]+/).map((x) => x.trim().toLowerCase()).filter(Boolean);
    const badInstr = instructors.filter((x) => !x.endsWith('@' + cloud.domain));
    if (!name) return showErr('Give the class a name, for example "CS150 Fall 2026".');
    if (isNew && classes.some((c) => c.id === id)) return showErr(`A class with the ID "${id}" already exists. Use a different name or edit that class.`);
    if (!examIds.length) return showErr('Choose at least one exam for this class.');
    if (badInstr.length) return showErr(`Instructor emails must end in @${cloud.domain}: ${badInstr.join(', ')}`);
    if (parsed?.error) return showErr(parsed.error);
    const people = parsed ? parsed.people : current;
    if (isNew && !people.length) return showErr('Add the roster: paste the Canvas People table or choose a CSV file.');
    const exam0 = (await getManifest()).exams.find((e) => e.id === examIds[0]);
    const btn = form.querySelector('[type=submit]');
    btn.disabled = true; btn.textContent = 'Saving…';
    try {
      const r = await cloud.saveClass({ id, name, course: exam0?.course || '', term: form.term.value.trim(), exams: examIds, instructors, people });
      await cloud.refreshAccess();
      toast(`${name} saved: ${plural(r.total, 'person', 'people')} on the roster${!isNew ? `, ${r.added} added, ${r.removed} removed` : ''}`, 'good');
      location.hash = '#/admin';
    } catch (e) {
      console.error(e);
      showErr("Couldn't save: " + (e?.code === 'permission-denied' ? 'your account is not an admin in firestore.rules.' : e?.message || e));
      btn.disabled = false; btn.textContent = isNew ? 'Create class' : 'Save changes';
    }
  });
}
