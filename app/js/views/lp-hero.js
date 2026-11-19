// The landing page's opening (DESIGN › The study buddy › Welcome). The logo's blue goes once round its
// four circles; the Dot pops out of it, lands on "Cramming", hops onto "Top", then sits on Request access,
// pulls its reading glasses down and reads on a little laptop. Once per visit.
// Without .play (reduced motion, Pause motion, no JS) the finished scene is simply there.
// Colours come from classes in landing.css and student.css; nothing here writes a colour.

const SEAT = 80, H = 120; // the Dot's seat (where it sits on a ledge), in its own 120-unit box

// The Dot sitting with a laptop: legs over the ledge, glasses, the lid (with the four-dot logo) in front.
export function readingDot() {
  return `<svg class="lp-dot" width="72" height="72" viewBox="0 0 120 120" aria-hidden="true" focusable="false">
    <g class="lp-legs"><path d="M50 76 L47 100"/><path d="M70 76 L73 100"/><ellipse cx="45" cy="102" rx="6" ry="3.6"/><ellipse cx="75" cy="102" rx="6" ry="3.6"/></g>
    <g class="lp-body">
      <circle class="bd-dot" cx="60" cy="50" r="30"/><ellipse class="bd-shine" cx="48" cy="33" rx="8.5" ry="5" transform="rotate(-32 48 33)"/>
      <g class="lp-eyes"><ellipse class="bd-white" cx="49" cy="47" rx="6" ry="7"/><ellipse class="bd-white" cx="71" cy="47" rx="6" ry="7"/>
        <g class="lp-pupils"><ellipse class="bd-pupil" cx="50" cy="49" rx="3.2" ry="4"/><ellipse class="bd-pupil" cx="72" cy="49" rx="3.2" ry="4"/></g></g>
      <ellipse class="bd-blush" cx="40" cy="60" rx="4.4" ry="2.4"/><ellipse class="bd-blush" cx="80" cy="60" rx="4.4" ry="2.4"/>
      <path class="bd-stroke-light" fill="none" stroke-width="3" stroke-linecap="round" d="M54 62 Q60 67 66 62"/>
      <g class="lp-glasses"><path class="lp-temple" d="M38 44 L31 41 M82 44 L89 41"/><rect class="lp-lens" x="38" y="38" width="21" height="17" rx="6"/><rect class="lp-lens" x="61" y="38" width="21" height="17" rx="6"/><path class="lp-temple" d="M59 45 Q60 42.5 61 45"/><path class="lp-glare" d="M42 43 l5 -2.6 M65 43 l5 -2.6"/></g>
    </g>
    <g class="lp-arms"><path class="lp-arm-down" d="M32 56 Q24 66 28 78"/><path class="lp-arm-down" d="M88 56 Q96 66 92 78"/>
      <path class="lp-arm-type" d="M33 58 Q30 72 42 77"/><path class="lp-arm-type" d="M87 58 Q90 72 78 77"/></g>
    <g class="lp-laptop"><rect class="lp-lid" x="38" y="58" width="44" height="22" rx="3"/>
      <g class="lp-lid-logo"><circle cx="57.5" cy="66.5" r="2"/><circle class="on" cx="62.5" cy="66.5" r="2"/><circle cx="62.5" cy="71.5" r="2"/><circle cx="57.5" cy="71.5" r="2"/></g>
      <rect class="lp-base" x="33" y="79" width="54" height="4" rx="2"/></g>
  </svg>`;
}

const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const centre = (r) => ({ x: r.left + r.width / 2, y: r.top + r.height / 2 });
// The top of one letter in a heading, so the Dot can stand on it.
function letterTop(el, word, i = 0) {
  const node = [...el.childNodes].find((n) => n.nodeType === 3 && n.textContent.includes(word)) || el.firstChild;
  const at = node.textContent.indexOf(word) + i, r = document.createRange();
  r.setStart(node, at); r.setEnd(node, at + 1);
  const b = r.getBoundingClientRect();
  return { x: b.left + b.width / 2, y: b.top + b.height * 0.2 };
}

// hero: the .lp-intro section; lp: the page (for Pause motion). Returns a function that stops it.
export function playHero(hero, lp) {
  const dot = hero.querySelector('.lp-dot'), circles = [...hero.querySelectorAll('.lp-mark circle')];
  let stopped = false;
  const finish = () => {
    stopped = true;
    hero.classList.remove('play');
    delete dot.dataset.pose; // the finished scene: sitting and reading
    dot.getAnimations().forEach((a) => a.cancel());
    circles.forEach((c, i) => c.classList.toggle('on', i === 1));
  };
  const onPause = () => { if (lp.classList.contains('paused')) finish(); };
  const mo = new MutationObserver(onPause);
  mo.observe(lp, { attributes: true, attributeFilter: ['class'] });
  if (typeof dot.animate !== 'function') { finish(); return () => mo.disconnect(); }

  hero.classList.add('play');
  dot.dataset.pose = 'ball';
  // where the Dot's seat is when it sits on the button; every hop is measured from there
  // (measured once, before the Dot moves: during a hop its box is wherever the hop has taken it)
  let home = null;
  const seat = () => { if (!home) { const r = dot.getBoundingClientRect(); home = { x: r.left + r.width / 2, y: r.top + (r.height * SEAT) / H, h: r.height }; } return home; };
  const to = (p) => { const s = seat(); return `translate(${(p.x - s.x).toFixed(1)}px, ${(p.y - s.y).toFixed(1)}px)`; };
  // a hop is a real arc: steady sideways, rising and falling like a thrown ball, with a light stretch on
  // take-off and a light squash on touching down (DESIGN › Motion: playful, never cartoonish)
  const hop = (a, b, ms, peak) => {
    const n = 10, frames = [];
    for (let i = 0; i <= n; i++) {
      const t = i / n, x = a.x + (b.x - a.x) * t, y = a.y + (b.y - a.y) * t - peak * 4 * t * (1 - t);
      const sx = i === 0 ? 1.06 : i === 1 ? 0.97 : i === n ? 1.06 : 1, sy = i === 0 ? 0.94 : i === 1 ? 1.03 : i === n ? 0.94 : 1;
      frames.push({ transform: `${to({ x, y })} scale(${sx}, ${sy})` });
    }
    return dot.animate(frames, { duration: ms, easing: 'cubic-bezier(.45,.05,.55,.95)', fill: 'forwards' }).finished;
  };

  // hitting a word: the Dot squashes against it like a ball and the word dips, then the next hop springs off
  const hit = (word, p) => {
    if (stopped) return Promise.resolve();
    word.animate([{ transform: 'none' }, { transform: 'translateY(3px)', offset: 0.3 }, { transform: 'translateY(-1px)', offset: 0.7 }, { transform: 'none' }], { duration: 420, easing: 'cubic-bezier(.3,.7,.4,1)' });
    return dot.animate([{ transform: `${to(p)} scale(1.06, .94)` }, { transform: `${to({ x: p.x, y: p.y + 3 })} scale(1.1, .9)` }], { duration: 90, easing: 'ease-out', fill: 'forwards' }).finished;
  };

  (async () => {
    try {
    // 1. the blue goes once round the logo and stops on its own circle (top right)
    for (const i of [1, 2, 3, 0]) {
      if (stopped) return;
      circles.forEach((c, k) => c.classList.toggle('on', k === i));
      await wait(620);
    }
    if (stopped) return;
    // back on its own circle, and the Dot springs out of it in the same moment
    circles.forEach((c, k) => c.classList.toggle('on', k === 1));
    // 2. out of the logo, down onto "Cramming" (standing on its i)
    const s = seat(), from = centre(circles[1].getBoundingClientRect());
    const start = { x: from.x, y: from.y + (s.h * (SEAT - 50)) / H };
    const onName = letterTop(hero.querySelector('.lp-name'), 'Cramming', 5);
    const tag = hero.querySelector('.lp-tag > span + span');
    const onTop = letterTop(tag, 'Top', 1);
    dot.dataset.pose = 'ball';
    dot.animate([{ transform: `${to(start)} scale(.3)`, opacity: 0 }, { transform: `${to(start)} scale(1)`, opacity: 1 }], { duration: 220, fill: 'forwards', easing: 'ease-out' });
    await wait(200);
    if (stopped) return;
    await hop(start, onName, 620, 56);
    await hit(hero.querySelector('.lp-name'), onName);
    if (stopped) return;
    // 3. up onto "Top"
    await hop({ x: onName.x, y: onName.y + 3 }, onTop, 560, 44);
    await hit(tag, onTop);
    if (stopped) return;
    // 4. down onto Request access: it lands, its legs come out and press the button
    await hop({ x: onTop.x, y: onTop.y + 3 }, { x: s.x, y: s.y }, 620, 48);
    if (stopped) return;
    dot.dataset.pose = 'sit';
    dot.getAnimations().forEach((a) => a.cancel());
    await wait(120);
    const btn = hero.querySelector('.lp-perch .lp-btn'), press = { duration: 420, easing: 'cubic-bezier(.3,.7,.4,1)' };
    btn.animate([{ transform: 'none' }, { transform: 'translateY(2px) scale(.985)', offset: 0.35 }, { transform: 'none' }], press);
    await dot.animate([{ transform: 'none' }, { transform: 'translateY(2px) scale(1.04, .96)', offset: 0.35 }, { transform: 'translateY(-1px)', offset: 0.7 }, { transform: 'none' }], press).finished;
    await wait(250);
    if (stopped) return;
    // 5. glasses down, laptop open, reading
    dot.dataset.pose = 'glasses';
    await wait(450);
    if (stopped) return;
    dot.dataset.pose = 'read';
    hero.classList.remove('play');
    } catch (e) { finish(); } // a hop cancelled by Pause motion or leaving the page
  })();
  return () => { stopped = true; mo.disconnect(); };
}
