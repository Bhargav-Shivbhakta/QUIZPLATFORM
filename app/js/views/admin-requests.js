// Admin › Access requests: everything sent from "Request access" on the public pages. Nothing is
// deleted; each request gets a status (New, Contacted, Set up, Not a fit) and a note, so whoever
// picks it up next can see where it stands. One read per request when the page opens; one write
// per save.
import * as cloud from '../cloud.js';
import { esc, icon, toast } from '../ui.js';
import { STATUSES, LIMITS, statusOf, statusLabel, countNew } from '../requests.js';
import { dateTime as when } from '../format.js';

const tone = { new: 'ok', contacted: '', setup: 'good', nofit: 'bad' };
const why = (e) => (e?.code === 'permission-denied' ? 'publish the latest firestore.rules in Firebase.' : e?.message || e);
const tell = (list) => window.dispatchEvent(new CustomEvent('requests-changed', { detail: countNew(list) }));

function details(d = {}) {
  const rows = [
    ['Department', d.department], ['Students', d.students], ['Sections', d.sections],
    ['Term starts', d.start], ['First exam', d.firstExam],
    ['Would use first', d.wants?.join(', ')], ['Uses today', d.uses?.join(', ')], ['Has', d.has?.join(', ')],
    ['Other contact', d.contact], ['Heard about us', d.heard], ['Notes', d.notes],
  ].filter(([, v]) => v);
  if (!rows.length) return '<p class="muted small">No course details yet (step 2 was skipped).</p>';
  return `<dl class="req-details">${rows.map(([k, v]) => `<div><dt>${k}</dt><dd>${esc(v)}</dd></div>`).join('')}</dl>`;
}

function card(r) {
  const s = statusOf(r);
  return `<li class="content-item req" data-id="${esc(r.id)}">
    <div class="content-main">
      <h2>${esc(r.name)} <span class="pill ${tone[s]}">${statusLabel(s)}</span></h2>
      <p class="small">${esc(r.role || 'Role not given')} · ${esc(r.school)} · <strong>${esc(r.course)}</strong>${r.size ? ` · ${esc(r.size)} students` : ''}</p>
      <p class="small"><a href="mailto:${esc(r.email)}">${esc(r.email)}</a> · sent ${esc(when(r.createdAt))}</p>
      ${details(r.details)}
      <form class="req-track" data-track>
        <label class="field"><span>Status</span><select name="status">${STATUSES.map(([k, l]) => `<option value="${k}" ${k === s ? 'selected' : ''}>${l}</option>`).join('')}</select></label>
        <label class="field"><span>Note</span><textarea name="note" rows="2" maxlength="${LIMITS.note}" placeholder="What happened, and what's next">${esc(r.note || '')}</textarea></label>
        <div class="row"><button class="btn small primary" type="submit">${icon('check')} Save</button>
          ${r.statusAt ? `<span class="muted small">Last updated by ${esc(r.statusBy || 'an admin')}, ${esc(when(r.statusAt))}</span>` : ''}</div>
      </form>
    </div>
  </li>`;
}

export async function render(main) {
  if (!cloud.enabled || !cloud.isAdmin()) {
    main.innerHTML = '<section class="page narrow empty-state"><h1>Admins only</h1><p>Only site admins can see access requests.</p><a class="btn primary" href="#/">Go home</a></section>';
    return;
  }
  main.innerHTML = `<section class="page admin">
    <header class="inst-head">
      <div><p class="eyebrow">Admin</p><h1>Access requests</h1>
        <p class="muted">Sent from "Request access" on cramming.net. Nothing is deleted: give each one a status and a note so everyone knows where it stands.</p></div>
      <div class="row"><a class="btn" href="#/overview">${icon('chart')} Platform overview</a><a class="btn" href="#/admin">${icon('users')} Manage classes</a></div>
    </header>
    <div data-list aria-busy="true"><p class="muted">Loading requests…</p></div>
  </section>`;
  const box = main.querySelector('[data-list]');
  let list;
  try { list = await cloud.listAccessRequests(); } catch (e) {
    box.removeAttribute('aria-busy');
    box.innerHTML = `<div class="empty-state"><p class="bad">Couldn't load requests: ${esc(why(e))}</p></div>`;
    return;
  }
  let filter = countNew(list) ? 'new' : 'all';
  const draw = () => {
    box.removeAttribute('aria-busy');
    const n = (k) => (k === 'all' ? list.length : list.filter((r) => statusOf(r) === k).length);
    const shown = filter === 'all' ? list : list.filter((r) => statusOf(r) === filter);
    const empty = !list.length ? 'No requests yet. When a professor uses Request access on cramming.net, it appears here.'
      : `Nothing is ${statusLabel(filter).toLowerCase()} right now.`;
    box.innerHTML = `<div class="seg" role="group" aria-label="Show requests">${[...STATUSES, ['all', 'All']].map(([k, l]) => `<button type="button" data-filter="${k}" aria-pressed="${k === filter}">${l}<span>${n(k)}</span></button>`).join('')}</div>
      ${shown.length ? `<ul class="content-list req-list">${shown.map(card).join('')}</ul>` : `<p class="muted req-empty">${empty}</p>`}`;
  };
  draw();
  tell(list);

  box.addEventListener('click', (e) => {
    const b = e.target.closest('[data-filter]');
    if (!b) return;
    filter = b.dataset.filter;
    draw();
    box.querySelector(`[data-filter="${filter}"]`).focus();
  });
  box.addEventListener('submit', async (e) => {
    e.preventDefault();
    const form = e.target;
    const id = form.closest('[data-id]').dataset.id;
    const r = list.find((x) => x.id === id);
    const status = form.status.value;
    const note = form.note.value.trim().slice(0, LIMITS.note);
    const btn = form.querySelector('[type="submit"]');
    btn.disabled = true;
    try {
      await cloud.setAccessStatus(id, status, note);
      Object.assign(r, { status, note, statusAt: Date.now(), statusBy: (cloud.currentUser()?.email || '').toLowerCase() });
      draw();
      tell(list);
      toast(`${r.name}: ${statusLabel(status)}`, 'good');
      (box.querySelector(`[data-id="${CSS.escape(id)}"] select`) || box.querySelector(`[data-filter="${filter}"]`)).focus();
    } catch (err) {
      btn.disabled = false;
      toast("Couldn't save: " + why(err), 'bad');
    }
  });
}
