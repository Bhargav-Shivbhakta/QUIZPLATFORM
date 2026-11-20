// Exam integrity checks that need the browser (the rules themselves are in timed.js, so they're tested):
// the graphics chip's name (to spot virtual machines), writing and AI helpers that add their own parts
// to the page (Grammarly, LanguageTool, AI sidebars), and a second screen.
// A page can't see everything (a phone, an AI app running outside the browser, remote control software
// the browser can't tell apart), so these are one layer: Safe Exam Browser and the person in the room
// are the others.
import { gpuKind, vmHints, HELPERS, EXTENSION_URL } from './timed.js';

// The graphics chip's name as the browser reports it ('' if it won't say)
let renderer = null; // asked once: each question makes a new graphics context, and browsers allow only a few
export function gpuRenderer() {
  if (renderer != null) return renderer;
  try {
    const c = document.createElement('canvas');
    const gl = c.getContext('webgl') || c.getContext('experimental-webgl');
    if (!gl) return (renderer = '');
    const ext = gl.getExtension('WEBGL_debug_renderer_info');
    renderer = String((ext && gl.getParameter(ext.UNMASKED_RENDERER_WEBGL)) || gl.getParameter(gl.RENDERER) || '');
    gl.getExtension('WEBGL_lose_context')?.loseContext();
    return renderer;
  } catch { return (renderer = ''); }
}
export const machineKind = () => gpuKind(gpuRenderer());
// The weaker signs (for the professor only)
export const machineHints = () => vmHints({ webdriver: navigator.webdriver === true, gpu: machineKind(), cores: navigator.hardwareConcurrency || 0, memory: navigator.deviceMemory || 0, width: screen.width, height: screen.height, touch: navigator.maxTouchPoints || 0 });

// Names of the helpers found on this page right now (each name once)
export function findHelpers(doc = document) {
  const found = new Set();
  const roots = [doc.documentElement, doc.body].filter(Boolean);
  for (const [sign, name] of HELPERS) {
    const [kind, what] = [sign.slice(0, sign.indexOf(':')), sign.slice(sign.indexOf(':') + 1)];
    try {
      if (kind === 'attr' && roots.some((r) => r.hasAttribute(what))) found.add(name);
      else if (kind === 'tag' && doc.getElementsByTagName(what).length) found.add(name);
      else if (kind === 'any' && doc.querySelector(what)) found.add(name);
    } catch { /* a selector this browser doesn't know */ }
  }
  // any frame, picture, style or script an add-on put on the page
  for (const el of doc.querySelectorAll('iframe[src], img[src], link[href], script[src], embed[src], object[data]')) {
    if (EXTENSION_URL.test(el.getAttribute('src') || el.getAttribute('href') || el.getAttribute('data') || '')) { found.add('a browser add-on'); break; }
  }
  return [...found];
}

// Calls onFound(names) when a helper shows up later (once per name). Returns a function that stops watching.
export function watchHelpers(onFound) {
  const seen = new Set(findHelpers());
  let t = 0;
  const look = () => { t = 0; const fresh = findHelpers().filter((n) => !seen.has(n)); fresh.forEach((n) => seen.add(n)); if (fresh.length) onFound(fresh); };
  const mo = new MutationObserver(() => { if (!t) t = setTimeout(look, 300); });
  mo.observe(document.documentElement, { childList: true, subtree: true, attributes: true, attributeFilter: ['data-gr-ext-installed', 'data-new-gr-c-s-check-loaded', 'data-lt-installed'] });
  return () => { mo.disconnect(); clearTimeout(t); };
}

// A second screen, where the browser can tell (Chrome and Edge can; Safari and Firefox don't say).
export const secondScreen = () => (typeof screen !== 'undefined' && screen.isExtended === true);
// Calls onChange(extended) when a screen is plugged in or out (where the browser reports it)
export function watchScreens(onChange) {
  const s = typeof screen !== 'undefined' ? screen : null;
  if (!s || typeof s.addEventListener !== 'function') return () => {};
  const fn = () => onChange(secondScreen());
  s.addEventListener('change', fn);
  return () => s.removeEventListener('change', fn);
}
