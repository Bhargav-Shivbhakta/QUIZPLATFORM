// The landing page moves one screen at a time (DESIGN › Landing page): one small turn of the wheel, one
// light trackpad swipe, or the arrow, Page and space keys glide to the next screen. The glide starts
// fast and lands softly (about 0.6 s). A swipe's leftover momentum is ignored, so a screen never skips,
// but a new swipe is recognised at once, even mid-glide, and the next screen follows straight after.
// A screen taller than the window scrolls normally until its end, then pages on. Touch and the scrollbar
// keep the browser's own scrolling (CSS snaps them into place).
// Off with reduced motion and with Pause motion: the page then scrolls freely.

const HEAD = 53, NUDGE = 12, QUIET = 120, DUR = 620, SLACK = 32; // SLACK: a screen this much taller still pages
const ease = (t) => 1 - Math.pow(1 - t, 4); // quick start, soft landing

export function mountPaging(lp, reduce) {
  if (reduce) return () => {};
  const screens = [...lp.querySelectorAll(':scope > section')], root = document.documentElement.style;
  let gliding = false, blocking = false, free = false, pending = 0, last = 0, lastAbs = 0, acc = 0, raf = 0;

  // where one step up or down goes: a number (the screen's top, from the top of the window), 'free'
  // (inside a tall screen: scroll normally) or null (nothing further: scroll normally)
  const target = (down) => {
    const vh = innerHeight, fit = vh - HEAD + SLACK;
    let i = screens.length - 1;
    while (i >= 0 && screens[i].getBoundingClientRect().top > HEAD + 2) i--;
    if (i < 0) return null;
    const r = screens[i].getBoundingClientRect();
    if (down ? r.height > fit && r.bottom > vh + 2 : r.top < HEAD - 2 && r.height > fit) return 'free';
    if (!down && r.top < HEAD - 2) return r.top; // back to the top of this screen
    const next = screens[i + (down ? 1 : -1)];
    if (!next) return null; // past the last screen: the footer scrolls normally
    const n = next.getBoundingClientRect();
    return !down && n.height > fit ? n.bottom - vh + HEAD : n.top; // a tall screen above: arrive at its end
  };
  const glide = (top) => {
    const from = scrollY, dist = Math.max(0, Math.round(scrollY + top - HEAD)) - from;
    if (!dist) return;
    gliding = blocking = true; root.scrollSnapType = 'none'; // snapping would catch every frame
    const t0 = performance.now();
    const step = (now) => {
      const t = Math.min(1, (now - t0) / DUR);
      scrollTo(0, from + dist * ease(t));
      if (t < 1) { raf = requestAnimationFrame(step); return; }
      gliding = false; root.scrollSnapType = '';
      if (pending) { const t2 = target(pending > 0); pending = 0; if (typeof t2 === 'number') glide(t2); }
    };
    raf = requestAnimationFrame(step);
  };

  const onWheel = (e) => {
    if (e.ctrlKey || Math.abs(e.deltaX) > Math.abs(e.deltaY) || lp.classList.contains('paused')) return;
    const unit = e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? innerHeight : 1, d = Math.abs(e.deltaY) * unit;
    const now = e.timeStamp, gap = now - last, fresh = gap >= QUIET || d > lastAbs * 1.6 + 8; // a new swipe, not momentum
    last = now; lastAbs = d;
    if (free) { if (!fresh) return; free = false; } // a swipe that began inside a tall screen stays a normal scroll
    if (gliding) { e.preventDefault(); if (fresh) pending = e.deltaY > 0 ? 1 : -1; return; }
    if (blocking) { if (!fresh) { e.preventDefault(); return; } blocking = false; }
    const t = target(e.deltaY > 0);
    if (t === null) return;
    if (t === 'free') { free = true; return; }
    e.preventDefault();
    if (gap > 200) acc = 0;
    acc += e.deltaY * unit;
    if (Math.abs(acc) < NUDGE) return;
    acc = 0;
    glide(t);
  };
  const onKey = (e) => {
    if (e.defaultPrevented || e.altKey || e.ctrlKey || e.metaKey || lp.classList.contains('paused')) return;
    const k = e.key, el = document.activeElement;
    const down = k === 'ArrowDown' || k === 'PageDown' || (k === ' ' && !e.shiftKey), up = k === 'ArrowUp' || k === 'PageUp' || (k === ' ' && e.shiftKey);
    if (!down && !up) return;
    if (el && el.closest('input, textarea, select, [contenteditable], dialog')) return; // typing and forms keep their keys
    if (k === ' ' && el && el.closest('button, a, summary, label')) return; // space presses buttons
    const t = target(down);
    if (t === null || t === 'free') return;
    e.preventDefault();
    if (gliding) { pending = down ? 1 : -1; return; }
    glide(t);
  };
  addEventListener('wheel', onWheel, { passive: false });
  addEventListener('keydown', onKey);
  return () => { removeEventListener('wheel', onWheel); removeEventListener('keydown', onKey); cancelAnimationFrame(raf); root.scrollSnapType = ''; };
}
