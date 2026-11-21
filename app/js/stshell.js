// The student frame (DESIGN › Navigation, locked 19 Nov). One bar on the left with three parts:
//  - fixed top: the logo. One click goes back (inside a class: to all your classes; elsewhere: to Today),
//    a double click refreshes. Search joins it here once search is built.
//  - a middle that slides: the main list (Today, your classes) and, inside a class, that class's list
//    (a class card that switches class, then Ready, Learn, Practice, Graded work).
//  - fixed foot: your name, which opens the Me panel over a blurred page.
// The bar collapses to a rail (the round handle or ⌘ + \); in the rail a class shows its subject over its
// number ("CS" over "150"). Tablets always get the rail; phones get tabs at the bottom and a top bar.
// Every FC place and section is listed in navfc.js; the ones not built yet (Inbox, Calendar, Search, Grades,
// Q&A...) stay hidden until they ship, except in the FC preview (?fc=1), where they open their plan pages.
// Staff and admins have the same bar (it was a trial until 20 November 2026): it holds Today, the classes they teach, Admin (site admins only) and, inside a class, its
// sections, each opening the screen that does that job today. Taking and running exams is never touched.
import * as cloud from './cloud.js';
import * as store from './store.js';
import { esc, icon, logoMark, toast, confirmDialog } from './ui.js';
import { motionLevel } from './buddy.js';
import { backFor, classTitle, codeParts, className } from './navmap.js';
const nameOf = className;
import { getManifest } from './data.js';
import { mountBell } from './notify.js';
import { PLACES, SEARCH, SECTIONS as FC_SECTIONS, ME, STAFF_PLACES, STAFF_SEARCH, ADMIN_PLACES, STAFF_SECTIONS, STAFF_ME, shown, preview, setViewer, setPreview } from './navfc.js';

// Students only: on at least one roster, teaching none, not an admin.
export function isStudentMode() {
  if (!cloud.enabled || !cloud.currentUser() || cloud.isAdmin()) return false;
  const mine = cloud.myClasses();
  return mine.length > 0 && !mine.some((c) => cloud.isStaffRole(c.role));
}
// Staff and admins: everyone has the new bar since 20 November 2026 (it was a trial before).
export const isStaffFrame = () => !!(cloud.enabled && cloud.currentUser() && !isStudentMode() && cloud.isInstructor());
export const frameOn = () => isStudentMode() || isStaffFrame();
export const classColor = (c) => (c?.color && /^[a-z]+$/.test(c.color) ? c.color : 'blue');
const LOGO = logoMark('st-logo-mark');
const e = encodeURIComponent;

// A class's sections, in order: [tab in st-class.js, label, icon]. The full FC list is in navfc.js; the bar
// shows the built ones (all of them in the FC preview).
const sectionsNow = () => shown(FC_SECTIONS).map((x) => [x.key, x.label, x.icon]);
// Where a place or Me item goes: its screen when built, its plan page (FC preview) when not.
const hrefOf = (x) => (x.key === 'today' ? '#/' : x.ready ? x.href : `#/fc/${x.key}`);
// A class's sections for staff: [key, label, icon, href], from navfc.js. A built one opens the screen
// that does that job today; one that isn't built (reviewers only) opens its plan, inside the class.
const staffHref = (id) => ({ overview: `#/instructor?class=${e(id)}&tab=progress`, build: `#/build/${e(id)}`, spractice: `#/content/${e(id)}`, sgraded: `#/timed/${e(id)}`, insights: `#/instructor?class=${e(id)}&tab=scores`, people: `#/instructor?class=${e(id)}&tab=students`, csettings: `#/admin?edit=${e(id)}` });
const staffSections = (id) => shown(STAFF_SECTIONS)
  .filter((x) => !x.who || cloud.isAdmin() || (x.who === 'lead' && cloud.leadsClass(id)))
  .map((x) => [x.key, x.label, x.icon, x.ready ? staffHref(id)[x.key] : `#/fc/${x.key}?class=${e(id)}`]);
const adminPlaces = () => shown(ADMIN_PLACES).map((x) => [x.key, x.label, x.icon, x.ready ? x.href : `#/fc/${x.key}`]);
function staffSectionOf(path, query) {
  if (path.startsWith('/fc/')) return path.slice(4);
  if (path.startsWith('/build/')) return 'build';
  if (path.startsWith('/content/')) return 'spractice';
  if (path.startsWith('/timed/')) return 'sgraded';
  if (path === '/admin') return 'csettings';
  return { progress: 'overview', announce: 'overview', questions: 'spractice', timed: 'sgraded', scores: 'insights', students: 'people' }[query.tab] || 'overview';
}
// Which section a page inside a class belongs to.
function sectionOf(path, query) {
  if (staff) return staffSectionOf(path, query);
  if (/^\/class\//.test(path)) return sectionsNow().some(([k]) => k === query.tab) ? query.tab : 'plan';
  if (/^\/(study|mystudy)\//.test(path)) return 'notes';
  if (/^\/(exam|cards|browse|start|assignments)\//.test(path)) return 'practice';
  return 'graded';
}

function who() {
  const u = cloud.currentUser();
  const name = u.displayName || u.email;
  const initials = name.split(/[\s@.]+/).filter(Boolean).slice(0, 2).map((x) => x[0].toUpperCase()).join('');
  return { u, name, avatar: u.photoURL ? `<img src="${esc(u.photoURL)}" alt="" referrerpolicy="no-referrer">` : esc(initials) };
}
// The badge: subject over number, white on the class colour.
const badge = (c) => { const p = codeParts(c.course, c.name); return `<span class="st-badge" aria-hidden="true"><b>${esc(p.subject || '?')}</b>${p.number ? `<b>${esc(p.number)}</b>` : ''}</span>`; };

const codeOf = (c) => codeParts(c.course, c.name).code;

let staff = false;
// admins see every class (loaded once, in the background), not only the ones they teach
let allClasses = null, lastPlace = null;
const myList = () => (staff ? (cloud.isAdmin() && allClasses ? allClasses : cloud.teachingClasses()) : cloud.myClasses());
// The code on top (what students call the class), the full name under it on up to two lines: nothing cut off.
const classRow = (c) => { const code = codeOf(c), nm = nameOf(c); return `<a class="st-item st-cls cc-${classColor(c)}" href="${classHref(c)}" data-st="class:${esc(c.id)}" title="${esc(classTitle(c))}"><span class="st-cstripe" aria-hidden="true"></span>${badge(c)}<span class="st-ctext">${code ? `<span class="st-code">${esc(code)}</span>` : ''}<span class="st-lbl">${esc(nm)}</span></span></a>`; };
function loadAllClasses() {
  if (!staff || !cloud.isAdmin()) return;
  cloud.listClasses().then((list) => {
    allClasses = list;
    const box = document.querySelector('[data-st-classes]'); if (!box) return;
    box.innerHTML = `<p class="st-label"><span>All classes</span></p>${list.map(classRow).join('')}`;
    shownClass = null;
    if (lastPlace) setPlace(lastPlace);
  }).catch(() => {});
}
const classHref = (c) => (staff ? `#/instructor?class=${e(c.id)}&tab=progress` : `#/class/${e(c.id)}`);
export function mountShell() {
  document.documentElement.dataset.motion = motionLevel();
  staff = !isStudentMode();
  document.body.classList.add('st');
  document.body.classList.toggle('st-staff', staff);
  const { u, name, avatar } = who(), mine = myList();
  setViewer(u.email);
  const slim = store.get('sideSlim', false), several = mine.length > 1;
  unmountShell(true);
  const me = (cls) => `<button type="button" class="st-me ${cls}" data-st-me aria-haspopup="dialog" aria-expanded="false" aria-label="You: ${esc(name)}" title="${esc(name)}"><span class="st-avatar">${avatar}</span><span class="st-lbl">${esc(name)}</span></button>`;
  const skip = document.querySelector('body > .skip'); // "Skip to content" must stay first on the page
  (skip || document.body).insertAdjacentHTML(skip ? 'afterend' : 'afterbegin', `
    <aside class="st-side ${slim ? 'slim' : ''}" id="st-side" aria-label="Cramming">
      <button type="button" class="st-handle" data-st-slim aria-expanded="${!slim}" aria-label="${slim ? 'Open the bar' : 'Collapse the bar'}" title="${slim ? 'Open the bar' : 'Collapse the bar'} (⌘ + \\)">${icon(slim ? 'right' : 'left')}</button>
      <div class="st-side-top"><button type="button" class="st-brand" data-st-logo>${LOGO}<span>Cramming</span></button>
        ${shown([staff ? STAFF_SEARCH : SEARCH]).map((x) => `<a class="st-item st-search" href="${hrefOf(x)}" data-st="${x.key}" title="Search (⌘ K)">${icon('search')}<span class="st-lbl">Search</span><kbd class="st-kbd">⌘ K</kbd></a>`).join('')}</div>
      <div class="st-slide"><div class="st-track">
        <nav class="st-pane st-pane-main" aria-label="Main">
          ${shown(staff ? STAFF_PLACES : PLACES).map((x) => `<a class="st-item" href="${hrefOf(x)}" data-st="${x.key}" title="${x.label}">${icon(x.icon)}<span class="st-lbl">${x.label}</span></a>`).join('')}
          <div data-st-classes>${mine.length ? `<p class="st-label"><span>${staff ? (cloud.isAdmin() ? 'All classes' : 'Teaching') : several ? 'Your classes' : 'Your class'}</span></p>` : ''}
          ${mine.map(classRow).join('')}</div>
          ${staff && cloud.isAdmin() ? `<p class="st-label"><span>Admin</span></p>${adminPlaces().map(([k, l, ic, h]) => `<a class="st-item" href="${h}" data-st="${k}" title="${l}">${icon(ic)}<span class="st-lbl">${l}</span></a>`).join('')}` : ''}
        </nav>
        <nav class="st-pane st-pane-class" aria-label="This class" inert></nav>
      </div></div>
      <div class="st-side-foot">${preview() ? `<div class="st-fcbar"><a href="#/fc" data-st="fc">${icon('eye')}<span class="st-lbl">FC preview</span></a><button type="button" class="st-fcoff" data-st-fcoff title="Turn the FC preview off">Turn off</button></div>` : ''}${me('st-me-side')}</div>
    </aside>
    <header class="st-top" id="st-top">
      <div class="st-top-left"><a class="st-brand st-brand-top" href="#/" aria-label="Cramming, Today">${LOGO}<span>Cramming</span></a><a class="st-back" href="#/" hidden>${icon('left')}<span></span></a></div>
      <div class="st-top-right"><div class="st-bell" data-bell-host></div>${me('st-me-top')}</div>
    </header>
    <div class="st-mepanel" id="st-mepanel" hidden>
      <button type="button" class="st-scrim" data-st-close tabindex="-1" aria-label="Close"></button>
      <section class="st-medlg" role="dialog" aria-modal="true" aria-labelledby="st-me-name">
        <div class="st-menu-who"><span class="st-avatar">${avatar}</span><span><strong id="st-me-name">${esc(u.displayName || name)}</strong><span class="st-sub">${esc(u.email)}</span></span></div>
        ${shown(staff ? STAFF_ME : ME).map((x) => `<a class="st-menu-item" href="${hrefOf(x)}" data-st-go>${icon(x.icon)} ${x.label}</a>`).join('')}
        <button type="button" class="st-menu-item" data-st-signout>${icon('logout')} Sign out</button>
        <button type="button" class="st-btn st-btn-ghost st-sm st-me-close" data-st-close>Close</button>
      </section>
    </div>
    <nav class="st-tabs" id="st-tabs" aria-label="Main"><span class="st-tind" aria-hidden="true"></span>
      <a href="#/" data-st="today">${icon('sun')}<span>Today</span></a>
      ${staff ? `<a href="#/instructor" data-st="classes">${icon('book')}<span>Teaching</span></a>${cloud.isAdmin() ? `<a href="#/overview" data-st="a-overview">${icon('users')}<span>Admin</span></a>` : ''}`
    : `<a href="${several ? '#/classes' : `#/class/${e(mine[0].id)}`}" data-st="classes">${icon('book')}<span>${several ? 'Classes' : 'Class'}</span></a>
      <a href="#/progress" data-st="progress">${icon('chart')}<span>Progress</span></a>`}
      <a href="#/settings" data-st="settings">${icon('settings')}<span>Settings</span></a>
    </nav>`);
  shownClass = null;
  loadAllClasses();
  const side = document.getElementById('st-side');
  side.querySelector('[data-st-slim]').addEventListener('click', () => setSlim(!side.classList.contains('slim')));
  const logo = side.querySelector('[data-st-logo]');
  // e.detail counts the clicks: the second click of a double click does nothing, the dblclick refreshes
  logo.addEventListener('click', (ev) => { if (ev.detail < 2) logoBack(); });
  logo.addEventListener('dblclick', () => refreshApp(logo));
  document.querySelector('.st-brand-top').addEventListener('dblclick', (ev) => { ev.preventDefault(); refreshApp(ev.currentTarget); });
  side.querySelector('.st-pane-class').addEventListener('click', onClassPane);
  side.querySelector('[data-st-fcoff]')?.addEventListener('click', () => { setPreview(false); mountShell(); mountBell(); location.hash = '#/'; toast('The finished bar is off. Turn it on again in Settings.'); });
  document.querySelectorAll('[data-st-me]').forEach((b) => b.addEventListener('click', () => openMe(b)));
  const panel = document.getElementById('st-mepanel');
  panel.addEventListener('click', (ev) => { if (ev.target.closest('[data-st-close], [data-st-go]')) closeMe(); });
  panel.querySelector('[data-st-signout]').addEventListener('click', async () => {
    closeMe();
    if (await confirmDialog({ title: 'Sign out?', body: '<p>Your progress is saved to your account. It is removed from this browser, so the next person on this device starts fresh.</p>', confirm: 'Sign out' })) await cloud.signOut();
  });
  addEventListener('resize', onResize);
  document.addEventListener('keydown', keys);
}
export function unmountShell(keepClass) {
  for (const id of ['st-side', 'st-top', 'st-tabs', 'st-mepanel', 'st-menu']) document.getElementById(id)?.remove();
  removeEventListener('resize', onResize);
  document.removeEventListener('keydown', keys);
  document.body.classList.remove('st-me-open');
  if (!keepClass) document.body.classList.remove('st');
}
let rt;
function onResize() { clearTimeout(rt); rt = setTimeout(() => glide(false), 120); }

// ---------- collapse: the round handle or ⌘ + \ (laptops; tablets always have the rail) ----------
function setSlim(on) {
  const side = document.getElementById('st-side'); if (!side) return;
  side.classList.toggle('slim', on); store.set('sideSlim', on);
  const h = side.querySelector('[data-st-slim]'), say = on ? 'Open the bar' : 'Collapse the bar';
  h.setAttribute('aria-expanded', String(!on)); h.setAttribute('aria-label', say); h.title = `${say} (⌘ + \\)`;
  h.innerHTML = icon(on ? 'right' : 'left');
  closeSwitcher();
}
function keys(ev) {
  if (ev.key === 'Escape') { if (!document.getElementById('st-mepanel')?.hidden) { closeMe(); return; } closeSwitcher(true); }
  if (ev.key === 'Tab' && document.body.classList.contains('st-me-open')) trap(ev);
  if (ev.key === '\\' && (ev.metaKey || ev.ctrlKey) && innerWidth >= 1024 && !document.body.matches('.focus-mode, .exam-locked')) {
    ev.preventDefault(); setSlim(!document.getElementById('st-side')?.classList.contains('slim'));
  }
}

// ---------- the logo: one click back, two clicks refresh ----------
function logoBack() {
  const side = document.getElementById('st-side');
  if (side?.classList.contains('in-class')) { showPane(false); side.querySelector('.st-pane-main [aria-current]')?.focus({ preventScroll: true }); return; }
  if (location.hash.replace(/^#/, '') !== '/') location.hash = '#/';
}
// Fetches the latest classes and practice sets and saves anything waiting, at most once a minute, so it
// can never run up the database's reads and writes (a full page reload costs about ten times more).
let lastRefresh = 0;
async function refreshApp(brand) {
  if (Date.now() - lastRefresh < 60000) { toast('Already up to date'); return; }
  lastRefresh = Date.now();
  brand.classList.add('st-refreshing');
  try {
    await cloud.freshClassContent(0);
    if (cloud.syncState().pending) await cloud.flush();
    window.dispatchEvent(new HashChangeEvent('hashchange'));
    toast('Up to date');
  } catch { toast("Couldn't refresh. Check your connection and try again.", 'bad'); lastRefresh = 0; }
  finally { setTimeout(() => brand.classList.remove('st-refreshing'), 600); }
}

// ---------- the middle: which list shows ----------
function showPane(inClass) {
  const side = document.getElementById('st-side'); if (!side) return;
  side.classList.toggle('in-class', inClass);
  side.querySelector('.st-pane-main').inert = inClass;
  side.querySelector('.st-pane-class').inert = !inClass;
  const logo = side.querySelector('[data-st-logo]');
  logo.title = `${inClass ? 'All your classes' : 'Today'}. Double-click to refresh`;
  logo.setAttribute('aria-label', inClass ? 'Cramming: back to all your classes' : 'Cramming: Today');
  if (!inClass) closeSwitcher();
}
let shownClass = null;
function drawClassPane(cls) {
  const pane = document.querySelector('.st-pane-class'); if (!pane) return;
  shownClass = cls.id;
  const others = myList().filter((c) => c.id !== cls.id);
  pane.setAttribute('aria-label', nameOf(cls));
  pane.innerHTML = `
    <button type="button" class="st-classcard cc-${classColor(cls)}" data-st-switch aria-expanded="false" ${others.length ? 'aria-controls="st-switch"' : 'disabled'} title="${esc(classTitle(cls))}${others.length ? ': switch class' : ''}">
      <span class="st-cstripe" aria-hidden="true"></span>${badge(cls)}<span class="st-lbl"><b>${esc(nameOf(cls))}</b><span class="st-sub">${esc([codeOf(cls), cls.term].filter(Boolean).join(', '))}</span></span>${others.length ? icon('chev', 'st-chev') : ''}</button>
    ${others.length ? `<div class="st-switch" id="st-switch" hidden><p class="st-switch-h">Switch to</p>${others.map((c) => `<a class="st-switch-item cc-${classColor(c)}" href="${classHref(c)}" title="${esc(classTitle(c))}"><span class="st-cstripe" aria-hidden="true"></span>${badge(c)}<span class="st-ctext">${codeOf(c) ? `<span class="st-code">${esc(codeOf(c))}</span>` : ''}<span class="st-lbl">${esc(nameOf(c))}</span></span></a>`).join('')}</div>` : ''}
    <span class="st-gap" aria-hidden="true"></span>
    ${(staff ? staffSections(cls.id) : sectionsNow().map(([k, l, ic]) => [k, l, ic, `#/class/${e(cls.id)}${k === 'plan' ? '' : `?tab=${k}`}`])).map(([k, l, ic, h]) => `<a class="st-item" href="${h}" data-sec="${k}" title="${l}">${icon(ic)}<span class="st-lbl">${l}</span></a>`).join('')}`;
}
function onClassPane(ev) {
  const sw = ev.target.closest('[data-st-switch]');
  if (sw) { const list = document.getElementById('st-switch'); if (list) { list.hidden = !list.hidden; sw.setAttribute('aria-expanded', String(!list.hidden)); } return; }
  if (ev.target.closest('.st-switch-item')) closeSwitcher();
}
function closeSwitcher(focus) {
  const list = document.getElementById('st-switch'); if (!list || list.hidden) return;
  list.hidden = true;
  const sw = document.querySelector('[data-st-switch]'); sw?.setAttribute('aria-expanded', 'false');
  if (focus) sw?.focus({ preventScroll: true });
}

// ---------- Me: a panel over a blurred page; nothing else works until it closes ----------
let meFrom = null;
function openMe(btn) {
  const panel = document.getElementById('st-mepanel'); if (!panel) return;
  meFrom = btn;
  panel.classList.toggle('from-top', btn.classList.contains('st-me-top'));
  panel.hidden = false;
  document.body.classList.add('st-me-open');
  for (const id of ['main', 'st-side', 'st-top', 'st-tabs']) { const el = document.getElementById(id); if (el) el.inert = true; }
  btn.setAttribute('aria-expanded', 'true');
  panel.querySelector('.st-menu-item').focus({ preventScroll: true });
}
function closeMe() {
  const panel = document.getElementById('st-mepanel'); if (!panel || panel.hidden) return;
  panel.hidden = true;
  document.body.classList.remove('st-me-open');
  for (const id of ['main', 'st-side', 'st-top', 'st-tabs']) { const el = document.getElementById(id); if (el) el.inert = false; }
  meFrom?.setAttribute('aria-expanded', 'false');
  meFrom?.focus({ preventScroll: true }); meFrom = null;
}
function trap(ev) {
  const items = [...document.querySelectorAll('#st-mepanel .st-medlg a, #st-mepanel .st-medlg button')];
  const first = items[0], last = items[items.length - 1];
  if (ev.shiftKey && document.activeElement === first) { ev.preventDefault(); last.focus(); }
  else if (!ev.shiftKey && document.activeElement === last) { ev.preventDefault(); first.focus(); }
}

// ---------- where you are ----------
let current = 'today';
export async function setPlace({ path, params = {}, query = {} }) {
  lastPlace = { path, params, query };
  const mine = myList();
  let key = '';
  if (path === '/' || path === '') key = 'today';
  else if (staff && path === '/overview') key = 'a-overview';
  else if (staff && path === '/requests') key = 'a-requests';
  else if (staff && path === '/admin' && !query.edit) key = 'a-classes';
  else if (staff && path === '/instructor' && !query.class) key = 'classes';
  else if (path === '/progress' || /^\/(progress|results)\//.test(path)) key = 'progress';
  else if (path === '/classes') key = 'classes';
  else if (path === '/settings') key = 'settings';
  else if (path === '/fc') key = 'fc';
  else if (/^\/fc\//.test(path)) key = query.class ? '' : path.slice(4); // a class section's plan stays in the class
  const cid = params.classId || (params.id ? cloud.classForExam(params.id)?.id : null) || query.class || (staff ? query.edit : null);
  const cls = cid ? mine.find((c) => c.id === cid) : null;
  if (!key && cls) key = `class:${cid}`;
  current = key;
  if (cls && shownClass !== cls.id) drawClassPane(cls);
  showPane(!!cls && key.startsWith('class:'));
  const sec = cls ? sectionOf(path, query) : '';
  document.querySelectorAll('[data-sec]').forEach((a) => { if (a.dataset.sec === sec) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current'); });
  document.querySelectorAll('[data-st]').forEach((a) => {
    const on = a.dataset.st === key || (a.dataset.st === 'classes' && (key === 'classes' || key.startsWith('class:')));
    if (on) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
  });
  closeMe();
  glide(true);
  // the one way up (DESIGN › Navigation)
  const exams = await getManifest().then((m) => m.exams).catch(() => []);
  const set = params.id ? exams.find((x) => x.id === params.id) : null;
  // staff screens keep their own breadcrumbs, so the top bar shows no back link for them
  const back = staff ? null : backFor(path, { ...params, className: cls ? cls.course || cls.name : '', setTitle: set?.title }, {
    classOf: (id) => cloud.classForExam(id), several: mine.length > 1,
    codingOnly: (id) => { const x = exams.find((y) => y.id === id); return !!x && !x.questionCount && x.assignmentCount > 0; },
  });
  const a = document.querySelector('.st-back');
  if (!a) return;
  a.hidden = !back;
  // a class's own pages need no back link on laptops and tablets: the bar is already there
  document.getElementById('st-top')?.classList.toggle('in-bar', /^\/class\/[^/]+$/.test(path));
  document.getElementById('st-top')?.classList.toggle('has-back', !!back);
  if (back) { a.href = back.href; a.querySelector('span').textContent = back.label; a.setAttribute('aria-label', `Back to ${back.label}`); }
}
// The phone tabs' highlight glides to the current place.
function glide(animate) {
  const ind = document.querySelector('.st-tind'), cur = document.querySelector('.st-tabs [aria-current="page"]');
  if (!ind) return;
  ind.classList.toggle('on', !!cur);
  if (!cur) return;
  if (!animate) ind.style.transition = 'none';
  ind.style.transform = `translateX(${cur.offsetLeft}px)`; ind.style.width = `${cur.offsetWidth}px`;
  if (!animate) { void ind.offsetHeight; ind.style.transition = ''; }
}
export const place = () => current;

// What the morning hop needs: the logo's dot and the Today place that are visible right now.
export function hopTargets() {
  const seen = (el) => el && el.getClientRects().length > 0 && getComputedStyle(el).visibility !== 'hidden' && getComputedStyle(el).display !== 'none';
  const dots = [...document.querySelectorAll('.st-brand .logo-dot')].filter((d) => seen(d.closest('.st-brand')));
  const today = [...document.querySelectorAll('[data-st="today"]')].filter(seen);
  return { logo: dots[0] || null, today: today[0]?.querySelector('svg') || today[0] || null };
}
