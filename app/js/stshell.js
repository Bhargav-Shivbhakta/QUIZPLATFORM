// The student frame (DESIGN › Navigation): Today, the classes, Progress and Settings.
// Laptops get a bar on the left (slim on tablets); phones get tabs at the bottom.
// Every size has a top bar: the one way up (back) on the left, Messages (the bell) on the right.
// Your initials open a small account menu (who you are, Sign out). Staff and admins keep the old top bar.
// The frame is drawn once and stays; pages swap inside #main, and the highlight glides to the place.
import * as cloud from './cloud.js';
import * as store from './store.js';
import { esc, icon, logoMark, toast, confirmDialog } from './ui.js';
import { motionLevel } from './buddy.js';
import { badgeFor, backFor, classTitle } from './navmap.js';
import { getManifest } from './data.js';

// Students only: on at least one roster, teaching none, not an admin.
export function isStudentMode() {
  if (!cloud.enabled || !cloud.currentUser() || cloud.isAdmin()) return false;
  const mine = cloud.myClasses();
  return mine.length > 0 && !mine.some((c) => cloud.isStaffRole(c.role));
}
export const classColor = (c) => (c?.color && /^[a-z]+$/.test(c.color) ? c.color : 'blue');
const LOGO = logoMark('st-logo-mark');

function who() {
  const u = cloud.currentUser();
  const name = u.displayName || u.email;
  const initials = name.split(/[\s@.]+/).filter(Boolean).slice(0, 2).map((x) => x[0].toUpperCase()).join('');
  return { u, name, avatar: u.photoURL ? `<img src="${esc(u.photoURL)}" alt="" referrerpolicy="no-referrer">` : esc(initials) };
}

export function mountShell() {
  document.documentElement.dataset.motion = motionLevel();
  document.body.classList.add('st');
  const { u, name, avatar } = who(), mine = cloud.myClasses();
  const slim = store.get('sideSlim', false), several = mine.length > 1;
  unmountShell(true);
  const brand = `<a class="st-brand" href="#/" title="Today. Double-click to refresh" aria-label="Cramming, Today">${LOGO}<span>Cramming</span></a>`;
  const me = (cls) => `<button type="button" class="st-me ${cls}" data-st-menu aria-haspopup="menu" aria-expanded="false" aria-label="Account: ${esc(name)}"><span class="st-avatar">${avatar}</span><span class="st-lbl">${esc(u.displayName || u.email)}<span class="st-sub">${esc(u.email)}</span></span></button>`;
  // after the "Skip to content" link, which must stay the first thing on the page
  const skip = document.querySelector('body > .skip');
  (skip || document.body).insertAdjacentHTML(skip ? 'afterend' : 'afterbegin', `
    <aside class="st-side ${slim ? 'slim' : ''}" id="st-side" aria-label="Cramming">
      <div class="st-side-top">${brand}
        <button type="button" class="st-collapse" data-st-slim aria-expanded="${!slim}" aria-label="${slim ? 'Show labels' : 'Hide labels'}">${icon('left')}</button></div>
      <nav class="st-nav" aria-label="Main"><span class="st-ind" aria-hidden="true"></span>
        <a class="st-item" href="#/" data-st="today" title="Today">${icon('sun')}<span class="st-lbl">Today</span></a>
        <p class="st-label"><span>${several ? 'Classes' : 'Your class'}</span></p>
        ${mine.map((c) => `<a class="st-item st-cls cc-${classColor(c)}" href="#/class/${encodeURIComponent(c.id)}" data-st="class:${esc(c.id)}" title="${esc(classTitle(c))}"><span class="st-badge" aria-hidden="true">${esc(badgeFor(c.course, c.name))}</span><span class="st-lbl">${esc(c.course || c.name)}<span class="st-sub">${esc(c.course && classTitle(c) !== c.name ? c.name : c.term || '')}</span></span></a>`).join('')}
        <p class="st-label"><span>You</span></p>
        <a class="st-item" href="#/progress" data-st="progress" title="Progress">${icon('chart')}<span class="st-lbl">Progress</span></a>
        <a class="st-item" href="#/settings" data-st="settings" title="Settings">${icon('settings')}<span class="st-lbl">Settings</span></a>
      </nav>
      <div class="st-side-foot">${me('st-me-side')}</div>
    </aside>
    <header class="st-top" id="st-top">
      <div class="st-top-left">${brand.replace('class="st-brand"', 'class="st-brand st-brand-top"')}<a class="st-back" href="#/" hidden>${icon('left')}<span></span></a></div>
      <div class="st-top-right"><div class="st-bell" data-bell-host></div>${me('st-me-top')}</div>
    </header>
    <div class="st-menu" id="st-menu" role="menu" aria-label="Account" hidden>
      <div class="st-menu-who"><span class="st-avatar">${avatar}</span><span><strong>${esc(u.displayName || '')}</strong><span class="st-sub">${esc(u.email)}</span></span></div>
      <button type="button" role="menuitem" class="st-menu-item" data-st-signout>${icon('logout')} Sign out</button>
    </div>
    <nav class="st-tabs" id="st-tabs" aria-label="Main"><span class="st-tind" aria-hidden="true"></span>
      <a href="#/" data-st="today">${icon('sun')}<span>Today</span></a>
      <a href="${several ? '#/classes' : `#/class/${encodeURIComponent(mine[0].id)}`}" data-st="classes">${icon('book')}<span>${several ? 'Classes' : 'Class'}</span></a>
      <a href="#/progress" data-st="progress">${icon('chart')}<span>Progress</span></a>
      <a href="#/settings" data-st="settings">${icon('settings')}<span>Settings</span></a>
    </nav>`);
  document.querySelector('[data-st-slim]').addEventListener('click', (e) => {
    const side = document.getElementById('st-side'), on = !side.classList.contains('slim');
    side.classList.toggle('slim', on); store.set('sideSlim', on);
    e.currentTarget.setAttribute('aria-expanded', String(!on));
    e.currentTarget.setAttribute('aria-label', on ? 'Show labels' : 'Hide labels');
    glide(false);
  });
  document.querySelectorAll('.st-brand').forEach((b) => b.addEventListener('dblclick', (e) => { e.preventDefault(); refreshApp(b); }));
  document.querySelectorAll('[data-st-menu]').forEach((b) => b.addEventListener('click', (e) => { e.stopPropagation(); toggleMenu(b); }));
  document.querySelector('[data-st-signout]').addEventListener('click', async () => {
    toggleMenu(null);
    if (await confirmDialog({ title: 'Sign out?', body: '<p>Your progress is saved to your account. It is removed from this browser, so the next person on this device starts fresh.</p>', confirm: 'Sign out' })) await cloud.signOut();
  });
  addEventListener('resize', onResize);
  document.addEventListener('click', closeMenuOutside);
  document.addEventListener('keydown', menuKeys);
}
export function unmountShell(keepClass) {
  for (const id of ['st-side', 'st-top', 'st-tabs', 'st-menu']) document.getElementById(id)?.remove();
  removeEventListener('resize', onResize);
  document.removeEventListener('click', closeMenuOutside);
  document.removeEventListener('keydown', menuKeys);
  if (!keepClass) document.body.classList.remove('st');
}
let rt;
function onResize() { clearTimeout(rt); rt = setTimeout(() => glide(false), 120); }

// ---------- the account menu ----------
let menuFrom = null;
function toggleMenu(btn) {
  const menu = document.getElementById('st-menu'); if (!menu) return;
  const open = !!btn && (menu.hidden || menuFrom !== btn);
  document.querySelectorAll('[data-st-menu]').forEach((b) => b.setAttribute('aria-expanded', String(open && b === btn)));
  menu.hidden = !open;
  if (!open) { menuFrom?.focus({ preventScroll: true }); menuFrom = null; return; }
  menuFrom = btn;
  const r = btn.getBoundingClientRect(), up = r.top > innerHeight / 2;
  menu.style.left = `${Math.max(8, Math.min(innerWidth - menu.offsetWidth - 8, up ? r.left : r.right - menu.offsetWidth))}px`;
  menu.style.top = up ? 'auto' : `${r.bottom + 8}px`;
  menu.style.bottom = up ? `${innerHeight - r.top + 8}px` : 'auto';
  menu.querySelector('[role="menuitem"]').focus({ preventScroll: true });
}
function closeMenuOutside(e) { const m = document.getElementById('st-menu'); if (m && !m.hidden && !m.contains(e.target)) toggleMenu(null); }
function menuKeys(e) { const m = document.getElementById('st-menu'); if (e.key === 'Escape' && m && !m.hidden) toggleMenu(null); }

// ---------- double-click the logo: refresh ----------
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

// ---------- where you are ----------
let current = 'today';
export async function setPlace({ path, params = {}, query = {} }) {
  const mine = cloud.myClasses();
  let key = '';
  if (path === '/' || path === '') key = 'today';
  else if (path === '/progress' || /^\/(progress|results)\//.test(path)) key = 'progress';
  else if (path === '/classes') key = 'classes';
  else if (path === '/settings') key = 'settings';
  const cid = params.classId || (params.id ? cloud.classForExam(params.id)?.id : null) || query.class;
  if (!key && cid && mine.some((c) => c.id === cid)) key = `class:${cid}`;
  current = key;
  document.querySelectorAll('[data-st]').forEach((a) => {
    const on = a.dataset.st === key || (a.dataset.st === 'classes' && (key === 'classes' || key.startsWith('class:')));
    if (on) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
  });
  glide(true);
  // the one way up (DESIGN › Navigation)
  const exams = await getManifest().then((m) => m.exams).catch(() => []);
  const set = params.id ? exams.find((x) => x.id === params.id) : null;
  const cls = cid ? mine.find((c) => c.id === cid) : null;
  const back = backFor(path, { ...params, className: cls ? cls.course || cls.name : '', setTitle: set?.title }, {
    classOf: (id) => cloud.classForExam(id), several: mine.length > 1,
    codingOnly: (id) => { const x = exams.find((y) => y.id === id); return !!x && !x.questionCount && x.assignmentCount > 0; },
  });
  const a = document.querySelector('.st-back');
  if (!a) return;
  a.hidden = !back;
  document.getElementById('st-top')?.classList.toggle('has-back', !!back);
  if (back) { a.href = back.href; a.querySelector('span').textContent = back.label; a.setAttribute('aria-label', `Back to ${back.label}`); }
}
// The highlight glides to the current place (the same gesture everywhere).
function glide(animate) {
  const move = (ind, cur, how) => {
    if (!ind) return;
    ind.classList.toggle('on', !!cur);
    if (!cur) return;
    if (!animate) ind.style.transition = 'none';
    how(ind, cur);
    if (!animate) { void ind.offsetHeight; ind.style.transition = ''; }
  };
  move(document.querySelector('.st-ind'), document.querySelector('.st-nav [aria-current="page"]'), (ind, cur) => { ind.style.transform = `translateY(${cur.offsetTop}px)`; ind.style.height = `${cur.offsetHeight}px`; });
  move(document.querySelector('.st-tind'), document.querySelector('.st-tabs [aria-current="page"]'), (ind, cur) => { ind.style.transform = `translateX(${cur.offsetLeft}px)`; ind.style.width = `${cur.offsetWidth}px`; });
}
export const place = () => current;

// What the morning hop needs: the logo's dot and the Today place that are visible right now.
export function hopTargets() {
  const seen = (el) => el && el.getClientRects().length > 0 && getComputedStyle(el).visibility !== 'hidden' && getComputedStyle(el).display !== 'none';
  const dots = [...document.querySelectorAll('.st-brand .logo-dot')].filter((d) => seen(d.closest('.st-brand')));
  const today = [...document.querySelectorAll('[data-st="today"]')].filter(seen);
  return { logo: dots[0] || null, today: today[0]?.querySelector('svg') || today[0] || null };
}
