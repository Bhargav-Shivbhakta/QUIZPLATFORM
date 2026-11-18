// Moving between screens, for screens and the router alike (screens never import the router).
// A timed exam locks navigation: { hash, blocked() } or null.
import * as store from './store.js';

let navGuard = null;
export function setNavGuard(g) { navGuard = g; }
export function getNavGuard() { return navGuard; }

// Go to a screen; the same address again reloads it (the router listens for hashchange).
export function go(hash) {
  if (location.hash === hash) window.dispatchEvent(new HashChangeEvent('hashchange'));
  else location.hash = hash;
}

// The reader's settings applied to the page: theme, text size, reading font, contrast.
export function applyTheme() {
  const s = store.getSettings();
  const root = document.documentElement;
  if (s.theme === 'system') delete root.dataset.theme; else root.dataset.theme = s.theme;
  root.dataset.size = s.textSize;
  root.dataset.font = s.readFont || 'standard';
  root.dataset.contrast = s.contrast || 'normal';
  if (s.readFont === 'easy' && !document.getElementById('font-easy')) {
    const l = document.createElement('link');
    l.id = 'font-easy'; l.rel = 'stylesheet';
    l.href = 'https://fonts.googleapis.com/css2?family=Lexend:wght@400;600;700&display=swap';
    document.head.appendChild(l);
  }
  const dark = s.theme === 'dark' || (s.theme === 'system' && matchMedia('(prefers-color-scheme: dark)').matches);
  const l = document.getElementById('hl-light'), d = document.getElementById('hl-dark');
  if (l && d) { l.disabled = dark; d.disabled = !dark; }
}
