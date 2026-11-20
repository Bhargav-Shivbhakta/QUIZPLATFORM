// The study buddy (DESIGN › The study buddy): the Dot (default) or the Flame, drawn in SVG from the
// tokens (colours come from classes in student.css, so nothing here writes a colour), plus what it does:
// a tap reaction, eyes that follow the pointer, and the morning hop from the logo to Today.
// The buddy is decorative: every SVG is aria-hidden and whatever it "says" is ordinary text on the page.
import * as store from './store.js';

const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
// Students choose in Settings. 'off' hides the buddy; 'soft' keeps only the quiet motion.
export const buddyKind = () => { const k = store.getSettings().buddy; return k === 'flame' || k === 'off' ? k : 'dot'; };
export const motionLevel = () => (reduced() ? 'none' : store.getSettings().motion === 'soft' ? 'soft' : 'full');

let gid = 0;
function eyes(cx, cy, mood, sp, light) {
  const L = cx - sp, R = cx + sp, k = light ? 'bd-stroke-light' : 'bd-stroke-ink';
  if (['happy', 'cheer', 'love'].includes(mood)) return `<g class="${k}" fill="none" stroke-width="3.4" stroke-linecap="round"><path d="M${L - 5} ${cy + 2} Q${L} ${cy - 5} ${L + 5} ${cy + 2}"/><path d="M${R - 5} ${cy + 2} Q${R} ${cy - 5} ${R + 5} ${cy + 2}"/></g>`;
  if (mood === 'calm' || mood === 'sleepy') return `<g class="${k}" fill="none" stroke-width="3" stroke-linecap="round"><path d="M${L - 5} ${cy} Q${L} ${cy + 4} ${L + 5} ${cy}"/><path d="M${R - 5} ${cy} Q${R} ${cy + 4} ${R + 5} ${cy}"/></g>`;
  const up = mood === 'think' ? -2.2 : 0, side = mood === 'think' ? 1.6 : 1;
  if (light) return `<g class="bd-blink"><ellipse class="bd-white" cx="${L}" cy="${cy}" rx="6.2" ry="7.2"/><ellipse class="bd-white" cx="${R}" cy="${cy}" rx="6.2" ry="7.2"/><g class="bd-pupils"><ellipse class="bd-pupil" cx="${L + side}" cy="${cy + 1.2 + up}" rx="3.3" ry="4.1"/><ellipse class="bd-pupil" cx="${R + side}" cy="${cy + 1.2 + up}" rx="3.3" ry="4.1"/><circle class="bd-white" cx="${L + side + 1.3}" cy="${cy - 0.8 + up}" r="1.3"/><circle class="bd-white" cx="${R + side + 1.3}" cy="${cy - 0.8 + up}" r="1.3"/></g></g>`;
  return `<g class="bd-blink"><g class="bd-pupils"><ellipse class="bd-ink" cx="${L}" cy="${cy + up}" rx="3.7" ry="4.9"/><ellipse class="bd-ink" cx="${R}" cy="${cy + up}" rx="3.7" ry="4.9"/><circle class="bd-white" cx="${L + 1.2}" cy="${cy - 1.6 + up}" r="1.2"/><circle class="bd-white" cx="${R + 1.2}" cy="${cy - 1.6 + up}" r="1.2"/></g></g>`;
}
function mouth(cx, cy, mood, light) {
  const k = light ? 'bd-stroke-light' : 'bd-stroke-ink';
  if (mood === 'cheer' || mood === 'love') return `<path class="${light ? 'bd-mouth' : 'bd-ink'}" d="M${cx - 7} ${cy - 1} Q${cx} ${cy} ${cx + 7} ${cy - 1} Q${cx + 6} ${cy + 9} ${cx} ${cy + 9} Q${cx - 6} ${cy + 9} ${cx - 7} ${cy - 1} Z"/><path class="bd-tongue" d="M${cx - 3.5} ${cy + 6.5} Q${cx} ${cy + 4} ${cx + 3.5} ${cy + 6.5}"/>`;
  if (mood === 'happy') return `<path class="${k}" fill="none" stroke-width="3.2" stroke-linecap="round" d="M${cx - 6.5} ${cy} Q${cx} ${cy + 7} ${cx + 6.5} ${cy}"/>`;
  if (mood === 'oops') return `<path class="${k}" fill="none" stroke-width="2.8" stroke-linecap="round" d="M${cx - 5} ${cy + 3} Q${cx - 2.5} ${cy} ${cx} ${cy + 3} Q${cx + 2.5} ${cy + 6} ${cx + 5} ${cy + 3}"/>`;
  if (['calm', 'sleepy', 'think', 'focus', 'read'].includes(mood)) return `<path class="${k}" fill="none" stroke-width="2.8" stroke-linecap="round" d="M${cx - 3} ${cy + 1} Q${cx} ${cy + 3} ${cx + 3} ${cy + 1}"/>`;
  return `<path class="${k}" fill="none" stroke-width="3" stroke-linecap="round" d="M${cx - 5} ${cy} Q${cx} ${cy + 5} ${cx + 5} ${cy}"/>`;
}
const cheeks = (y) => `<ellipse class="bd-blush" cx="31" cy="${y}" rx="4.6" ry="2.6"/><ellipse class="bd-blush" cx="69" cy="${y}" rx="4.6" ry="2.6"/>`;
const star = (x, y, s) => `<path class="bd-spark" d="M${x} ${y - s} Q${x} ${y} ${x + s} ${y} Q${x} ${y} ${x} ${y + s} Q${x} ${y} ${x - s} ${y} Q${x} ${y} ${x} ${y - s} Z"/>`;
function props(mood, top) {
  if (mood === 'cheer') return `<g>${star(12, 26, 7)}${star(90, 18, 6)}${star(94, 56, 4.5)}${star(8, 64, 4)}</g>`;
  if (mood === 'think') return `<g class="bd-think"><circle class="bd-soft-ink" cx="76" cy="${top + 2}" r="3"/><circle class="bd-soft-ink" cx="85" cy="${top - 4}" r="3"/><circle class="bd-soft-ink" cx="94" cy="${top - 10}" r="3"/></g>`;
  if (mood === 'sleepy') return `<g class="bd-zz"><path class="bd-soft-stroke" fill="none" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" d="M74 ${top} h8 l-8 9 h8 M86 ${top - 12} h6 l-6 7 h6"/></g>`;
  if (mood === 'love') return `<path class="bd-heart" d="M50 ${top - 2} C46 ${top - 8} 38 ${top - 5} 40 ${top + 1} C41 ${top + 5} 47 ${top + 8} 50 ${top + 11} C53 ${top + 8} 59 ${top + 5} 60 ${top + 1} C62 ${top - 5} 54 ${top - 8} 50 ${top - 2} Z"/>`;
  return '';
}
function dotSvg(mood) {
  const glasses = mood === 'read' ? '<g class="bd-stroke-pupil" fill="none" stroke-width="2.4"><circle cx="38.5" cy="55" r="8.5"/><circle cx="61.5" cy="55" r="8.5"/><path d="M47 55h6"/></g>' : '';
  const band = mood === 'focus' ? '<path class="bd-heart" d="M19 46 Q50 36 81 46 L81 53 Q50 43 19 53 Z"/><path class="bd-heart" d="M81 47 l9 -5 l-1 9 Z"/>' : '';
  const drop = mood === 'oops' ? '<path class="bd-drop" d="M80 40 q4 6 0 9 q-4 -3 0 -9 Z"/>' : '';
  const e = mood === 'read' || mood === 'focus' ? 'hello' : mood;
  return `<ellipse class="bd-shadow" cx="50" cy="94" rx="21" ry="3.6"/><g class="bd-body"><circle class="bd-dot" cx="50" cy="59" r="32"/><ellipse class="bd-shine" cx="37" cy="41" rx="9" ry="5.5" transform="rotate(-32 37 41)"/>${band}${eyes(50, 55, e, 11.5, true)}${glasses}${cheeks(67)}${mouth(50, 70, mood, true)}${drop}</g>${props(mood, 22)}`;
}
function flameSvg(mood, id) {
  const e = mood === 'read' || mood === 'focus' ? 'hello' : mood;
  return `<defs><linearGradient id="flg${id}" x1="0" y1="0" x2="0" y2="1"><stop class="fl-top" offset="0"/><stop class="fl-bottom" offset="1"/></linearGradient><radialGradient id="fll${id}"><stop class="fl-glow-in" offset="0"/><stop class="fl-glow-out" offset="1"/></radialGradient></defs>
    <circle class="fl-glow" cx="50" cy="60" r="48" fill="url(#fll${id})"/><ellipse class="bd-shadow" cx="50" cy="95" rx="19" ry="3.2"/>
    <g class="bd-body"><path d="M50 6 C58 22 81 36 81 62 C81 81 67 92 50 92 C33 92 19 81 19 62 C19 47 29 39 35 28 C38 37 42 41 46 41 C43 29 45 17 50 6 Z" fill="url(#flg${id})"/>
    <path class="fl-core" d="M50 46 C57 55 66 62 66 73 C66 83 59 89 50 89 C41 89 34 83 34 73 C34 64 43 57 50 46 Z"/>${eyes(50, 66, e, 9.5, false)}${mouth(50, 77, mood, false)}</g>${props(mood, 30)}`;
}

// mood: hello | happy | cheer | love | calm | sleepy | think | read | focus | oops
// opts.cls: extra classes, e.g. 'bd-idle' (breathes and blinks), 'bd-arrive', 'bd-follow', 'bd-tap'
export function buddy(mood = 'hello', { size = 64, cls = '', kind = buddyKind() } = {}) {
  if (kind === 'off') return '';
  const inner = kind === 'flame' ? flameSvg(mood, ++gid) : dotSvg(mood);
  return `<svg class="bd bd-${kind} ${cls}" width="${size}" height="${size}" viewBox="0 0 100 100" aria-hidden="true" focusable="false">${inner}</svg>`;
}

// Tap: squish, a heart, or a spin; at most once every 2 seconds (DESIGN › The study buddy).
let lastTap = 0;
export function tap(el) {
  if (motionLevel() !== 'full' || Date.now() - lastTap < 2000) return;
  lastTap = Date.now();
  const pick = ['bd-boop', 'bd-boop', 'bd-spin', 'love'][Math.floor(Math.random() * 4)];
  if (pick === 'love') {
    const r = el.getBoundingClientRect(), h = document.createElement('span');
    h.className = 'bd-heart-pop'; h.textContent = '♥'; h.setAttribute('aria-hidden', 'true');
    const z = (document.body.currentCSSZoom || 1); // big monitors zoom the page (tokens.css)
    h.style.left = `${(r.left + r.width / 2 + scrollX) / z - 7}px`; h.style.top = `${(r.top + scrollY) / z - 6}px`;
    document.body.appendChild(h); setTimeout(() => h.remove(), 1000);
    el.classList.add('bd-boop');
  } else el.classList.add(pick);
  setTimeout(() => el.classList.remove('bd-boop', 'bd-spin'), 900);
}

// Eyes follow the pointer, for the buddy on Today only (it is its one home).
export function follow(root) {
  if (motionLevel() !== 'full' || !matchMedia('(hover: hover)').matches) return () => {};
  const move = (e) => {
    const m = root.querySelector('.bd-follow'); if (!m) return;
    const r = m.getBoundingClientRect(), dx = e.clientX - (r.left + r.width / 2), dy = e.clientY - (r.top + r.height / 2);
    const len = Math.hypot(dx, dy) || 1, k = Math.min(1, len / 300);
    m.querySelectorAll('.bd-pupils').forEach((p) => { p.style.transform = `translate(${(dx / len) * 2.6 * k}px, ${(dy / len) * 2.2 * k}px)`; });
  };
  document.addEventListener('pointermove', move);
  return () => document.removeEventListener('pointermove', move);
}

// The morning hop: the Dot leaves the logo, lands on Today, then jumps beside the greeting.
// from, via, to: elements. Calls done() when it has landed (or at once when it can't play).
export function hop(from, via, to, done) {
  const can = from && via && to && motionLevel() === 'full' && buddyKind() === 'dot' && typeof document.body.animate === 'function';
  if (!can) { done(); return; }
  const z = (document.body.currentCSSZoom || 1); // big monitors zoom the page (tokens.css)
  const c = (el) => { const r = el.getBoundingClientRect(); return [(r.left + r.width / 2) / z, (r.top + r.height / 2) / z, r.width / z]; };
  const [x0, y0, w0] = c(from), [x1, y1] = c(via), [x2, y2, w2] = c(to);
  if (!w0 || !w2) { done(); return; }
  const fly = document.createElement('div'); fly.className = 'bd-flyer'; fly.innerHTML = buddy('hello', { size: 60, kind: 'dot' });
  document.body.appendChild(fly);
  const at = (x, y, sx, sy = sx) => `translate(${x - 30}px, ${y - 30}px) scale(${sx}, ${sy})`;
  const s0 = w0 / 38, s1 = 0.62, s2 = w2 / 60;
  from.classList.add('bd-logo-gone');
  const anim = fly.animate([
    { transform: at(x0, y0, s0), opacity: 0, offset: 0 },
    { transform: at(x0, y0, s0 * 1.6), opacity: 1, offset: 0.1 },
    { transform: at((x0 + x1) / 2 + 20, Math.min(y0, y1) - 60, 0.5), offset: 0.3 },
    { transform: at(x1, y1, s1 * 1.25, s1 * 0.78), offset: 0.44 },
    { transform: at(x1, y1, s1), offset: 0.52 },
    { transform: at((x1 + x2) / 2, Math.min(y1, y2) - 70, 0.85 * s2), offset: 0.74 },
    { transform: at(x2, y2, s2 * 1.14, s2 * 0.86), offset: 0.9 },
    { transform: at(x2, y2, s2), opacity: 1, offset: 1 },
  ], { duration: 2000, easing: 'ease-in-out', fill: 'forwards' });
  const end = () => { fly.remove(); from.classList.remove('bd-logo-gone'); from.classList.add('bd-logo-grow'); done(); };
  anim.onfinish = end; anim.oncancel = end;
}
