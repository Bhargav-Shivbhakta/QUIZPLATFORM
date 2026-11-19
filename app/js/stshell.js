// The student frame (DECISIONS › Student navigation): three places, Today, the classes, Progress.
// Laptops get a bar on the left (slim on tablets), phones get tabs at the bottom and a small top bar.
// Messages (the bell) and the account sit with it. Staff and admins keep the old top bar for now.
// The frame is drawn once and stays; pages swap inside #main, and the highlight glides to the place.
import * as cloud from './cloud.js';
import * as store from './store.js';
import { esc, icon, logoMark } from './ui.js';
import { motionLevel } from './buddy.js';

// Students only: on at least one roster, teaching none, not an admin.
export function isStudentMode() {
  if (!cloud.enabled || !cloud.currentUser() || cloud.isAdmin()) return false;
  const mine = cloud.myClasses();
  return mine.length > 0 && !mine.some((c) => cloud.isStaffRole(c.role));
}
const short = (c) => (String(c.course || c.name || '?').match(/[A-Za-z]+/)?.[0] || '?').slice(0, 2).toUpperCase();
export const classColor = (c) => (c?.color && /^[a-z]+$/.test(c.color) ? c.color : 'blue');
const LOGO = logoMark('st-logo-mark');

export function mountShell() {
  document.documentElement.dataset.motion = motionLevel();
  document.body.classList.add('st');
  const u = cloud.currentUser(), mine = cloud.myClasses();
  const name = u.displayName || u.email, first = (u.displayName || '').split(' ')[0] || '';
  const initials = name.split(/[\s@.]+/).filter(Boolean).slice(0, 2).map((x) => x[0].toUpperCase()).join('');
  const avatar = u.photoURL ? `<img src="${esc(u.photoURL)}" alt="" referrerpolicy="no-referrer">` : esc(initials);
  const slim = store.get('sideSlim', false);
  const several = mine.length > 1;
  unmountShell(true);
  // after the "Skip to content" link, which must stay the first thing on the page
  const skip = document.querySelector('body > .skip');
  (skip || document.body).insertAdjacentHTML(skip ? 'afterend' : 'afterbegin', `
    <aside class="st-side ${slim ? 'slim' : ''}" id="st-side" aria-label="Cramming">
      <div class="st-side-top"><a class="st-brand" href="#/" aria-label="Cramming, Today">${LOGO}<span>Cramming</span></a>
        <button type="button" class="st-collapse" data-st-slim aria-expanded="${!slim}" aria-label="${slim ? 'Show labels' : 'Hide labels'}">${icon('left')}</button></div>
      <nav class="st-nav" aria-label="Main"><span class="st-ind" aria-hidden="true"></span>
        <a class="st-item" href="#/" data-st="today" title="Today">${icon('sun')}<span class="st-lbl">Today</span></a>
        <p class="st-label"><span>${several ? 'Classes' : 'Your class'}</span></p>
        ${mine.map((c) => `<a class="st-item st-cls cc-${classColor(c)}" href="#/class/${encodeURIComponent(c.id)}" data-st="class:${esc(c.id)}" title="${esc(c.name)}"><span class="st-badge" aria-hidden="true">${esc(short(c))}</span><span class="st-lbl">${esc(c.course || c.name)}<span class="st-sub">${esc(c.course ? c.name : c.term || '')}</span></span></a>`).join('')}
        <p class="st-label"><span>You</span></p>
        <a class="st-item" href="#/progress" data-st="progress" title="Progress">${icon('chart')}<span class="st-lbl">Progress</span></a>
      </nav>
      <div class="st-side-foot"></div>
    </aside>
    <header class="st-top" id="st-top"><a class="st-brand" href="#/" aria-label="Cramming, Today">${LOGO}<span>Cramming</span></a><a class="st-back" href="#/classes" hidden>${icon('left')} Classes</a></header>
    <nav class="st-util" id="st-util" aria-label="Messages and account"><div class="st-bell" data-bell-host></div>
      <a class="st-me" href="#/settings" data-st="settings" title="Settings and sign out" aria-label="${esc(first || name)}: settings and sign out"><span class="st-avatar">${avatar}</span><span class="st-lbl">${esc(u.displayName || u.email)}<span class="st-sub">Settings, sign out</span></span></a></nav>
    <nav class="st-tabs" id="st-tabs" aria-label="Main"><span class="st-tind" aria-hidden="true"></span>
      <a href="#/" data-st="today">${icon('sun')}<span>Today</span></a>
      <a href="${several ? '#/classes' : `#/class/${encodeURIComponent(mine[0].id)}`}" data-st="classes">${icon('book')}<span>${several ? 'Classes' : 'Class'}</span></a>
      <a href="#/progress" data-st="progress">${icon('chart')}<span>Progress</span></a>
    </nav>`);
  document.querySelector('[data-st-slim]').addEventListener('click', (e) => {
    const side = document.getElementById('st-side'), on = !side.classList.contains('slim');
    side.classList.toggle('slim', on); store.set('sideSlim', on);
    e.currentTarget.setAttribute('aria-expanded', String(!on));
    e.currentTarget.setAttribute('aria-label', on ? 'Show labels' : 'Hide labels');
    glide(false);
  });
  addEventListener('resize', onResize);
}
export function unmountShell(keepClass) {
  for (const id of ['st-side', 'st-top', 'st-util', 'st-tabs']) document.getElementById(id)?.remove();
  removeEventListener('resize', onResize);
  if (!keepClass) document.body.classList.remove('st');
}
let rt;
function onResize() { clearTimeout(rt); rt = setTimeout(() => glide(false), 120); }

// Which place a page belongs to. Pages of one class (practice, notes, coding) light up that class.
let current = 'today';
export function setPlace({ path, params = {}, query = {} }) {
  const mine = cloud.myClasses();
  let key = '';
  if (path === '/' || path === '') key = 'today';
  else if (path === '/progress' || /^\/progress\//.test(path) || /^\/results\//.test(path)) key = 'progress';
  else if (path === '/classes') key = 'classes';
  else if (path === '/settings') key = 'settings';
  const cid = params.classId || (params.id ? cloud.classForExam(params.id)?.id : null) || query.class;
  if (!key && cid && mine.some((c) => c.id === cid)) key = `class:${cid}`;
  current = key;
  document.querySelectorAll('[data-st]').forEach((a) => {
    const on = a.dataset.st === key || (a.dataset.st === 'classes' && (key === 'classes' || key.startsWith('class:')));
    if (on) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
  });
  // phones: inside a class, the top bar offers the way back to the list of classes
  const back = document.querySelector('.st-back');
  if (back) { const show = key.startsWith('class:') && mine.length > 1; back.hidden = !show; document.querySelector('#st-top .st-brand').hidden = show; }
  glide(true);
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
  const seen = (el) => el && el.getClientRects().length > 0 && getComputedStyle(el).visibility !== 'hidden';
  const dots = [...document.querySelectorAll('.st-brand .logo-dot')].filter((d) => seen(d.closest('.st-brand')));
  const today = [...document.querySelectorAll('[data-st="today"]')].filter(seen);
  return { logo: dots[0] || null, today: today[0]?.querySelector('svg') || today[0] || null };
}
