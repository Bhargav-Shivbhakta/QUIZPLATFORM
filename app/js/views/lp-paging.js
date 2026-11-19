// The landing page moves one screen at a time (DESIGN › Landing page): one small turn of the wheel or
// one light trackpad swipe glides to the next screen; the swipe's leftover momentum is ignored, so a
// screen never skips. A screen taller than the window scrolls normally until its end, then pages on.
// Keyboard, scrollbar and touch keep the browser's own scrolling (CSS snaps them into place).
// Off with reduced motion and with Pause motion: the page then scrolls freely.

const HEAD = 53, NUDGE = 24, QUIET = 160, GLIDE = 700, SLACK = 32; // SLACK: a screen this much taller still pages

export function mountPaging(lp, reduce) {
  if (reduce) return () => {};
  const screens = [...lp.querySelectorAll(':scope > section')];
  let busy = false, free = false, settleAt = 0, last = 0, acc = 0;
  const go = (top) => scrollTo({ top: Math.max(0, Math.round(scrollY + top - HEAD)), behavior: 'smooth' });

  const onWheel = (e) => {
    if (e.ctrlKey || Math.abs(e.deltaX) > Math.abs(e.deltaY) || lp.classList.contains('paused')) return;
    const now = e.timeStamp, gap = now - last;
    last = now;
    if (free && gap < QUIET) return; // a swipe that began inside a tall screen stays a normal scroll
    free = false;
    if (busy) { // still gliding, or the swipe's momentum is still arriving
      if (now > settleAt && gap >= QUIET) busy = false;
      else { e.preventDefault(); return; }
    }
    const vh = innerHeight, fit = vh - HEAD + SLACK;
    let i = screens.length - 1;
    while (i >= 0 && screens[i].getBoundingClientRect().top > HEAD + 2) i--;
    if (i < 0) return;
    const r = screens[i].getBoundingClientRect(), down = e.deltaY > 0;
    if (down ? r.height > fit && r.bottom > vh + 2 : r.top < HEAD - 2 && r.height > fit) { free = true; return; } // inside a tall screen
    let target;
    if (!down && r.top < HEAD - 2) target = r.top; // back to the top of this screen
    else {
      const next = screens[i + (down ? 1 : -1)];
      if (!next) return; // past the last screen: the footer scrolls normally
      const n = next.getBoundingClientRect();
      target = !down && n.height > fit ? n.bottom - vh + HEAD : n.top; // a tall screen above: arrive at its end
    }
    e.preventDefault();
    if (gap > 200) acc = 0;
    acc += e.deltaY * (e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? vh : 1);
    if (Math.abs(acc) < NUDGE) return;
    acc = 0; busy = true; settleAt = now + GLIDE;
    go(target);
  };
  addEventListener('wheel', onWheel, { passive: false });
  return () => removeEventListener('wheel', onWheel);
}
