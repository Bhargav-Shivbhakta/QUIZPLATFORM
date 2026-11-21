// The FC preview's pages (navfc.js). Students never see these: they appear only after ?fc=1.
//  #/fc        the finished bar: every place, section and Me item, with how many features live in each
//  #/fc/<key>  one place or Me item that isn't built yet: what it is for and every feature that will live there
// A class section that isn't built opens inside the class page (st-class.js calls planBody).
import { esc, icon } from '../ui.js';
import { PLACES, SEARCH, SECTIONS, ME, findItem, preview } from '../navfc.js';
import { FEATURES } from '../fcfeatures.js';

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
  const list = FEATURES[key] || [];
  if (!list.length) return '<p class="st-muted">No features from the system map yet.</p>';
  if (!switches.length || !list.some((x) => x[2])) return `<ul class="st-list fc-list">${list.map(([f, st]) => `<li><span>${esc(f)}</span>${tag(st)}</li>`).join('')}</ul>`;
  const groups = switches.map((s) => [s, list.filter((x) => (x[2] || switches[0]) === s)]);
  return groups.filter(([, l]) => l.length).map(([s, l]) => `<h3 class="fc-sub">${esc(s)}</h3><ul class="st-list fc-list">${l.map(([f, st]) => `<li><span>${esc(f)}</span>${tag(st)}</li>`).join('')}</ul>`).join('');
}

// The body of a plan page: used here and inside the class page for a section that isn't built.
export function planBody(item) {
  const list = FEATURES[item.key] || [];
  return `
    <div class="fc-plan">
      <p class="fc-note">${icon('eye')} ${item.every ? 'FC preview: the features that live across the app.' : `FC preview. Students don't see this until its first feature ships (${esc(item.phase)}).`}</p>
      <p class="fc-what">${esc(item.what || '')}</p>
      ${item.only ? `<p class="st-muted st-small">${esc(item.only)}.</p>` : ''}
      ${item.switches ? `<div class="fc-switch" aria-label="Switches at the top of this page">${item.switches.map((s, i) => `<span ${i === 0 ? 'class="on"' : ''}>${esc(s)}</span>`).join('')}</div>` : ''}
      <section class="st-card"><div class="st-card-head"><h2>What will live here</h2><span class="st-muted st-small">${list.length} ${list.length === 1 ? 'feature' : 'features'}, ${builtOf(list)} built</span></div>
        ${featureList(item.key, item.switches)}</section>
    </div>`;
}

const card = (item, href, sub = '') => {
  const list = FEATURES[item.key] || [];
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
  const every = EVERYWHERE.find(([k]) => k === params.key);
  const item = params.key ? findItem(params.key) || (every && { key: every[0], label: every[1], icon: 'grid', every: true, what: every[2] }) : null;
  if (params.key) {
    main.innerHTML = item ? `<section class="st-page fc-page"><header><p class="st-muted st-small">The finished bar</p><h1>${icon(item.icon)} ${esc(item.label)}</h1></header>${planBody(item)}</section>`
      : `<section class="st-page"><h1>Not part of the bar</h1><p><a class="st-btn" href="#/fc">See the finished bar</a></p></section>`;
    return;
  }
  const total = Object.values(FEATURES).reduce((s, l) => s + l.length, 0), built = Object.values(FEATURES).reduce((s, l) => s + builtOf(l), 0);
  const href = (x) => (x.key === 'today' ? '#/' : x.ready && x.href ? x.href : `#/fc/${x.key}`);
  main.innerHTML = `
    <section class="st-page fc-page">
      <header><h1>The finished bar</h1><p class="st-muted">Every place a student will have when Cramming is finished: ${total} features, ${built} built. Places that aren't built open their plan. Students see only what is built.</p></header>
      <section aria-labelledby="fc-places"><h2 id="fc-places" class="fc-h">Places</h2><div class="fc-grid">${[...PLACES, SEARCH].map((x) => card(x, href(x))).join('')}</div></section>
      <section aria-labelledby="fc-class"><h2 id="fc-class" class="fc-h">In every class</h2><div class="fc-grid">${SECTIONS.map((x) => card(x, x.ready ? '#/classes' : `#/fc/${x.key}`)).join('')}</div></section>
      <section aria-labelledby="fc-me"><h2 id="fc-me" class="fc-h">Me</h2><div class="fc-grid">${ME.map((x) => card(x, href(x))).join('')}</div></section>
      <section aria-labelledby="fc-all"><h2 id="fc-all" class="fc-h">Everywhere</h2><div class="fc-grid">${EVERYWHERE.map(([k, l, s]) => card({ key: k, label: l, icon: 'grid', ready: false, phase: 'Across the app' }, `#/fc/${k}`, s)).join('')}</div></section>
      <p class="st-muted st-small">Turn the preview off: add ?fc=0 to any address, or use Turn off at the foot of the bar.</p>
    </section>`;
}
