import config from '../config.js';
import * as store from './store.js';
import { esc, toast } from './ui.js';
import { closeCalculator } from './calculator.js';

const routes = [
  { re: /^\/?$/, view: () => import('./views/home.js'), nav: 'home' },
  { re: /^\/exam\/([^/]+)$/, keys: ['id'], view: () => import('./views/exam.js'), nav: 'home' },
  { re: /^\/start\/([^/]+)\/([^/]+)$/, keys: ['id', 'mode'], view: () => import('./views/setup.js'), nav: 'home' },
  { re: /^\/quiz$/, view: () => import('./views/quiz.js'), nav: 'home', focus: true },
  { re: /^\/results\/([^/]+)\/([^/]+)$/, keys: ['id', 'attempt'], view: () => import('./views/results.js'), nav: 'home' },
  { re: /^\/progress\/([^/]+)$/, keys: ['id'], view: () => import('./views/progress.js'), nav: 'home' },
  { re: /^\/browse\/([^/]+)$/, keys: ['id'], view: () => import('./views/browse.js'), nav: 'home' },
  { re: /^\/cards\/([^/]+)$/, keys: ['id'], view: () => import('./views/flashcards.js'), nav: 'home' },
  { re: /^\/settings$/, view: () => import('./views/settings.js'), nav: 'settings' },
  { re: /^\/author$/, view: () => import('./views/author.js'), nav: 'author' },
];

let cleanup = null;
let renderToken = 0;

export function go(hash) {
  if (location.hash === hash) route();
  else location.hash = hash;
}

function parseHash() {
  const raw = location.hash.replace(/^#/, '') || '/';
  const [path, qs] = raw.split('?');
  const query = Object.fromEntries(new URLSearchParams(qs || ''));
  return { path, query };
}

async function route() {
  const token = ++renderToken;
  const { path, query } = parseHash();
  if (cleanup) { try { cleanup(); } catch (e) { console.error(e); } cleanup = null; }
  // fresh container each time so no event listeners leak between pages
  const old = document.getElementById('main');
  const main = old.cloneNode(false);
  old.replaceWith(main);
  closeCalculator();
  const r = routes.find((x) => x.re.test(path));
  document.body.classList.toggle('focus-mode', !!r?.focus);
  document.querySelectorAll('[data-nav]').forEach((a) => a.classList.toggle('active', a.dataset.nav === r?.nav));
  if (!r) {
    main.innerHTML = `<section class="page narrow empty-state"><h1>Page not found</h1><p>This link doesn't match anything here.</p><a class="btn primary" href="#/">Go to exams</a></section>`;
    return;
  }
  const m = path.match(r.re);
  const params = {};
  (r.keys || []).forEach((k, i) => (params[k] = decodeURIComponent(m[i + 1])));
  try {
    const mod = await r.view();
    if (token !== renderToken) return;
    main.innerHTML = '';
    const result = await mod.render(main, params, query);
    if (token !== renderToken) { if (typeof result === 'function') result(); return; }
    cleanup = typeof result === 'function' ? result : null;
    if (!query.keepScroll) window.scrollTo(0, 0);
    const h1 = main.querySelector('h1');
    document.title = (h1 ? h1.textContent.trim() + ' · ' : '') + config.siteName;
  } catch (e) {
    console.error(e);
    if (token !== renderToken) return;
    main.innerHTML = `<section class="page narrow empty-state"><h1>Something went wrong</h1>
      <p>${esc(e.message || String(e))}</p>
      <p class="muted">If this keeps happening, try reloading the page.</p>
      <div class="row"><button class="btn primary" onclick="location.reload()">Reload</button><a class="btn" href="#/">Go to exams</a></div></section>`;
  }
}

export function applyTheme() {
  const s = store.getSettings();
  const root = document.documentElement;
  if (s.theme === 'system') delete root.dataset.theme; else root.dataset.theme = s.theme;
  root.dataset.size = s.textSize;
  const dark = s.theme === 'dark' || (s.theme === 'system' && matchMedia('(prefers-color-scheme: dark)').matches);
  const l = document.getElementById('hl-light'), d = document.getElementById('hl-dark');
  if (l && d) { l.disabled = dark; d.disabled = !dark; }
}

function init() {
  document.getElementById('site-name').textContent = config.siteName;
  const foot = document.getElementById('sitefoot');
  foot.innerHTML = `<span>${esc(config.footer)}</span><a href="#/author">For instructors: check a question file</a>`;
  applyTheme();
  matchMedia('(prefers-color-scheme: dark)').addEventListener?.('change', applyTheme);
  window.addEventListener('hashchange', route);
  window.addEventListener('qp:storage-full', () => toast("Your browser's storage is full. Export your progress in Settings, then clear old data.", 'bad'));
  if (!store.storageAvailable()) {
    setTimeout(() => toast("This browser is blocking saving (private mode?). Progress won't be kept after you close the tab.", 'bad'), 600);
  }
  route();
}

init();
