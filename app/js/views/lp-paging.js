// The landing page moves one screen at a time (DESIGN › Landing page): one turn of the wheel, one
// trackpad swipe, or the arrow, Page and space keys move exactly one screen. The glide starts fast and
// lands softly (about 0.6 s). One swipe is one screen: its momentum, which keeps arriving for a second
// or more, is ignored; a second screen needs a second swipe (the deltas pick up again) or a pause.
// Every glide on the page goes through glideTo here, so nothing else can start a second one meanwhile
// (the header links, Try again on the practice question).
// A screen taller than the window scrolls normally until its end and stops there; the next swipe pages on. Touch and the
// scrollbar keep the browser's own scrolling (CSS snaps them into place).
// Pause motion: screens still move one at a time, instantly. Reduced motion: the page scrolls freely.

const HEAD = 53, NUDGE = 14, QUIET = 220, DUR = 620, SLACK = 32; // SLACK: a screen this much taller still pages
const ease = (t) => 1 - Math.pow(1 - t, 4); // quick start, soft landing
const state = { gliding: false, until: 0, raf: 0 };

// Glides the page so y (a page position) sits under the header. instant: jump (Pause motion).
export function glideToY(y, instant = false) {
  const root = document.documentElement.style, from = scrollY, to = Math.max(0, Math.round(y)), dist = to - from;
  cancelAnimationFrame(state.raf);
  if (Math.abs(dist) < 2) return;
  if (instant) { root.scrollSnapType = 'none'; scrollTo(0, to); requestAnimationFrame(() => (root.scrollSnapType = '')); state.until = performance.now() + 300; return; }
  const dur = Math.min(1200, DUR + Math.max(0, Math.abs(dist) - innerHeight) * 0.08), t0 = performance.now();
  state.gliding = true; state.until = t0 + dur; root.scrollSnapType = 'none'; // snapping would catch every frame
  const step = (now) => {
    const t = Math.min(1, (now - t0) / dur);
    scrollTo(0, from + dist * ease(t));
    if (t < 1) { state.raf = requestAnimationFrame(step); return; }
    state.gliding = false; state.until = performance.now(); root.scrollSnapType = '';
  };
  state.raf = requestAnimationFrame(step);
}
export const glideTo = (el, instant = false) => glideToY(el.getBoundingClientRect().top + scrollY - HEAD, instant);

export function mountPaging(lp, reduce) {
  if (reduce) return () => {};
  const screens = [...lp.querySelectorAll(':scope > section')];
  const still = () => lp.classList.contains('paused');
  let blocking = false, free = null, last = 0, acc = 0, recent = [], peak = 0, fell = false;

  // where one step up or down goes: a number (a page position), 'free' (inside a tall screen: scroll
  // normally) or null (nothing further: scroll normally)
  let here = null; // the screen target() last looked at
  const target = (down) => {
    const vh = innerHeight, fit = vh - HEAD + SLACK;
    let i = screens.length - 1;
    while (i >= 0 && screens[i].getBoundingClientRect().top > HEAD + 2) i--;
    if (i < 0) return null;
    here = screens[i];
    const r = here.getBoundingClientRect();
    if (down ? r.height > fit && r.bottom > vh + 2 : r.top < HEAD - 2 && r.height > fit) return 'free';
    if (!down && r.top < HEAD - 2) return scrollY + r.top - HEAD; // back to the top of this screen
    const next = screens[i + (down ? 1 : -1)];
    if (!next) return null; // past the last screen: the footer scrolls normally
    const n = next.getBoundingClientRect();
    return scrollY + (!down && n.height > fit ? n.bottom - vh : n.top - HEAD); // a tall screen above: arrive at its end
  };
  const hold = (e, dy) => { // keeps a normal scroll inside the free screen
    const r = free.getBoundingClientRect(), room = dy > 0 ? Math.max(0, r.bottom - innerHeight) : Math.min(0, r.top - HEAD);
    if (dy > 0 ? dy <= room : dy >= room) return;
    e.preventDefault();
    if (Math.abs(room) >= 1) scrollBy(0, room);
  };
  const go = (y) => { blocking = true; peak = 0; fell = false; glideToY(y, still()); };

  const onWheel = (e) => {
    if (e.ctrlKey || Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;
    const unit = e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? innerHeight : 1, d = Math.abs(e.deltaY) * unit, now = e.timeStamp, gap = now - last;
    last = now;
    // a new swipe, not the last one's momentum: after a pause, or when the deltas clearly pick up again
    recent = gap > QUIET ? [d] : [...recent.slice(-7), d];
    // (the swipe that moved the page must first die down, so its own build-up never counts as a second swipe)
    peak = Math.max(peak, d); if (d < peak * 0.5) fell = true;
    const before = recent.slice(0, -3), lately = recent.slice(-3), avg = (a) => a.reduce((s, x) => s + x, 0) / a.length;
    const fresh = gap > QUIET || (fell && before.length >= 3 && avg(lately) > avg(before) * 2 && d > 24);
    // a swipe that began inside a tall screen (the practice question with its explanation open) scrolls
    // normally, but stops at that screen's end (or top): reading on never carries into the next screen
    if (free) { if (!fresh) { hold(e, e.deltaY * unit); return; } free = null; }
    if (state.gliding || performance.now() < state.until) { e.preventDefault(); return; } // mid-glide: nothing else starts
    if (blocking) { if (!fresh) { e.preventDefault(); return; } blocking = false; }
    const t = target(e.deltaY > 0);
    if (t === null) return;
    if (t === 'free') { free = here; hold(e, e.deltaY * unit); return; }
    e.preventDefault();
    if (gap > 200) acc = 0;
    acc += e.deltaY * unit;
    if (Math.abs(acc) < NUDGE) return;
    acc = 0;
    go(t);
  };
  const onKey = (e) => {
    if (e.defaultPrevented || e.altKey || e.ctrlKey || e.metaKey) return;
    const k = e.key, el = document.activeElement;
    const down = k === 'ArrowDown' || k === 'PageDown' || (k === ' ' && !e.shiftKey), up = k === 'ArrowUp' || k === 'PageUp' || (k === ' ' && e.shiftKey);
    if (!down && !up) return;
    if (el && el.closest('input, textarea, select, [contenteditable], dialog')) return; // typing and forms keep their keys
    if (k === ' ' && el && el.closest('button, a, summary, label')) return; // space presses buttons
    const t = target(down);
    if (t === null || t === 'free') return;
    e.preventDefault();
    if (state.gliding) return;
    go(t);
  };
  addEventListener('wheel', onWheel, { passive: false });
  addEventListener('keydown', onKey);
  return () => { removeEventListener('wheel', onWheel); removeEventListener('keydown', onKey); cancelAnimationFrame(state.raf); document.documentElement.style.scrollSnapType = ''; };
}
