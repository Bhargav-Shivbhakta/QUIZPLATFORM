// The FC preview's pages (navfc.js). Only the reviewer accounts ever see these. Students and staff each
// see their own finished bar: the student one in the student frame, the staff one for professors and admins.
//  #/fc        the finished bar: every place, section and Me item, with how many features live in each
//  #/fc/<key>  one place or Me item that isn't built yet: what it is for and every feature that will live there
// A class section that isn't built opens inside the class page (st-class.js calls planBody).
import { esc, icon } from '../ui.js';
import * as cloud from '../cloud.js';
import { PLACES, SEARCH, SECTIONS, ME, STAFF_PLACES, STAFF_SEARCH, ADMIN_PLACES, STAFF_SECTIONS, STAFF_ME, findItem, preview } from '../navfc.js';
import { FEATURES as STUDENT, STAFF } from '../fcfeatures.js';
import { isStudentMode } from '../stshell.js';

// which finished bar this person reviews: students' or staff's
const staffView = () => !isStudentMode();
const data = () => (staffView() ? STAFF : STUDENT);

const STATUS = { have: ['Built', 'fc-have'], partly: ['Partly built', 'fc-partly'], planned: ['Planned', 'fc-planned'], no: ['Not yet', 'fc-no'] };
const tag = (st) => `<span class="fc-tag ${STATUS[st][1]}">${STATUS[st][0]}</span>`;
const builtOf = (list) => list.filter(([, st]) => st === 'have').length;

// Features that live everywhere rather than in one place
const EVERYWHERE = [
  ['question', 'Inside every question', 'Answer types, report a problem, ask my professor.'],
  ['tutor', 'The tutor, in Learn and Practice', 'Never in graded work.'],
  ['frame', 'The bar itself', 'The frame on every page.'],
  ['phone', 'Phone and offline', 'The same places as tabs; works without a connection.'],
  ['me', 'Me panel', 'Your name at the foot of the bar.'],
];

// The list of features for one home; Practice groups them by its switches.
function featureList(key, switches = []) {
  const list = data()[key] || [];
  if (!list.length) return '<p class="st-muted">No features from the system map yet.</p>';
  if (!switches.length || !list.some((x) => x[2])) return `<ul class="st-list fc-list">${list.map(([f, st]) => `<li><span>${esc(f)}</span>${tag(st)}</li>`).join('')}</ul>`;
  const groups = switches.map((s) => [s, list.filter((x) => (x[2] || switches[0]) === s)]);
  return groups.filter(([, l]) => l.length).map(([s, l]) => `<h3 class="fc-sub">${esc(s)}</h3><ul class="st-list fc-list">${l.map(([f, st]) => `<li><span>${esc(f)}</span>${tag(st)}</li>`).join('')}</ul>`).join('');
}

// The body of a plan page: used here and inside the class page for a section that isn't built.
export function planBody(item) {
  const list = data()[item.key] || [];
  return `
    <div class="fc-plan">
      <p class="fc-note">${icon('eye')} ${item.every ? 'FC preview: the features that live across the app.' : `FC preview. Only reviewers see this until its first feature ships (${esc(item.phase)}).`}</p>
      <p class="fc-what">${esc(item.what || '')}</p>
      ${item.only ? `<p class="st-muted st-small">${esc(item.only)}.</p>` : ''}
      ${item.switches ? `<div class="fc-switch" aria-label="Switches at the top of this page">${item.switches.map((s, i) => `<span ${i === 0 ? 'class="on"' : ''}>${esc(s)}</span>`).join('')}</div>` : ''}
      <section class="st-card"><div class="st-card-head"><h2>What will live here</h2><span class="st-muted st-small">${list.length} ${list.length === 1 ? 'feature' : 'features'}, ${builtOf(list)} built</span></div>
        ${featureList(item.key, item.switches)}</section>
    </div>`;
}

const card = (item, href, sub = '') => {
  const list = data()[item.key] || [];
  return `<a class="st-card fc-card" href="${href}">
    <span class="fc-card-top">${icon(item.icon)}<b>${esc(item.label)}</b>${item.ready ? '<span class="fc-tag fc-have">Built</span>' : `<span class="fc-tag fc-planned">${esc(item.phase)}</span>`}</span>
    <span class="st-muted st-small">${esc(sub || item.what || '')}</span>
    <span class="fc-count">${list.length ? `${list.length} ${list.length === 1 ? 'feature' : 'features'}, ${builtOf(list)} built` : 'Nothing on the system map yet'}</span></a>`;
};

export async function render(main, params = {}) {
  if (!preview()) {
    main.innerHTML = `<section class="st-page"><h1>Page not found</h1><p>This link doesn't match anything here.</p><p><a class="st-btn" href="#/">Go to Today</a></p></section>`;
    return;
  }
  const every = (staffView() ? [['s-frame', 'The bar itself', 'The frame on every page.']] : EVERYWHERE).find(([k]) => k === params.key);
  const item = params.key ? findItem(params.key, staffView()) || (every && { key: every[0], label: every[1], icon: 'grid', every: true, what: every[2] }) : null;
  if (params.key) {
    main.innerHTML = item ? `<section class="st-page fc-page"><header><p class="st-muted st-small">The finished bar</p><h1>${icon(item.icon)} ${esc(item.label)}</h1></header>${planBody(item)}</section>`
      : `<section class="st-page"><h1>Not part of the bar</h1><p><a class="st-btn" href="#/fc">See the finished bar</a></p></section>`;
    return;
  }
  const all = Object.values(data()), total = all.reduce((s, l) => s + l.length, 0), built = all.reduce((s, l) => s + builtOf(l), 0);
  const href = (x) => (x.key === 'today' ? '#/' : x.ready && x.href ? x.href : `#/fc/${x.key}`);
  const grid = (id, title, cards) => `<section aria-labelledby="fc-${id}"><h2 id="fc-${id}" class="fc-h">${title}</h2><div class="fc-grid">${cards}</div></section>`;
  const staffMap = () => [
    grid('places', 'Places', [...STAFF_PLACES, STAFF_SEARCH].map((x) => card(x, href(x))).join('')),
    cloud.isAdmin() ? grid('admin', 'Admin', ADMIN_PLACES.map((x) => card(x, href(x))).join('')) : '',
    grid('class', 'In every class', STAFF_SECTIONS.map((x) => card(x, x.ready ? '#/instructor' : `#/fc/${x.key}`)).join('')),
    grid('me', 'Me', STAFF_ME.map((x) => card(x, href(x))).join('')),
    grid('all', 'Everywhere', card({ key: 's-frame', label: 'The bar itself', icon: 'grid', ready: false, phase: 'Across the app' }, '#/fc/s-frame', 'The frame on every page.')),
  ].join('');
  const studentMap = () => [
    grid('places', 'Places', [...PLACES, SEARCH].map((x) => card(x, href(x))).join('')),
    grid('class', 'In every class', SECTIONS.map((x) => card(x, x.ready ? '#/classes' : `#/fc/${x.key}`)).join('')),
    grid('me', 'Me', ME.map((x) => card(x, href(x))).join('')),
    grid('all', 'Everywhere', EVERYWHERE.map(([k, l, sub]) => card({ key: k, label: l, icon: 'grid', ready: false, phase: 'Across the app' }, `#/fc/${k}`, sub)).join('')),
  ].join('');
  main.innerHTML = `
    <section class="st-page fc-page">
      <header><h1>The finished bar</h1><p class="st-muted">Every place ${staffView() ? 'a professor or admin' : 'a student'} will have when Cramming is finished: ${total} features, ${built} built. Places that aren't built open their plan. Only reviewers see the ones not built yet.</p></header>
      ${staffView() ? staffMap() : studentMap()}
      <p class="st-muted st-small">Turn the preview off: add ?fc=0 to any address, or use Turn off at the foot of the bar.</p>
    </section>`;
}
