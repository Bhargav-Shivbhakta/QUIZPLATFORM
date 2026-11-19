// The Dot on the landing page's screens 2 and 3 (DESIGN › The study buddy: The night before, Daily reps).
// Spot illustrations: one character, a few props, a soft circle behind, nothing else.
// Screen 2: on a stack of titled books, worried over an open book; its thought bubble counts the hours
// down while the units stay at 6. Screen 3: watering a little plant under the app's own "This week"
// card; each watering ticks a day and grows a leaf, and on the seventh it blooms with an "A".
// Same body, ring and limbs as the opening (lp-hero.js). Colours come from classes in landing.css and
// student.css. Decorative (aria-hidden): the headings say it in words. Movement runs only while a
// scene is on screen, and not at all with reduced motion or Pause motion.

const face = {
  stressed: '<path class="bd-stroke-light" fill="none" stroke-width="2.6" stroke-linecap="round" d="M99 74.5 Q103.5 71.5 108.5 69.5 M129.5 69.5 Q134.5 71.5 139 74.5"/><ellipse class="bd-white" cx="107" cy="83" rx="7.6" ry="8.6"/><ellipse class="bd-white" cx="131" cy="83" rx="7.6" ry="8.6"/><g class="lp-pupils"><ellipse class="bd-pupil" cx="107" cy="82" rx="5" ry="5.8"/><ellipse class="bd-pupil" cx="131" cy="82" rx="5" ry="5.8"/><circle class="bd-white" cx="109" cy="79.5" r="2"/><circle class="bd-white" cx="133" cy="79.5" r="2"/><circle class="bd-white" cx="105.5" cy="85" r="1"/><circle class="bd-white" cx="129.5" cy="85" r="1"/></g><path class="bd-stroke-light" fill="none" stroke-width="2.4" stroke-linecap="round" d="M114 100.5 Q119 97 124 100.5"/><ellipse class="bd-blush lp-blush-up" cx="98" cy="95" rx="5.4" ry="3"/><ellipse class="bd-blush lp-blush-up" cx="140" cy="95" rx="5.4" ry="3"/>',
  happy: '<ellipse class="bd-white" cx="108" cy="80" rx="6" ry="7"/><ellipse class="bd-white" cx="130" cy="80" rx="6" ry="7"/><ellipse class="bd-pupil" cx="109" cy="82" rx="3.2" ry="4"/><ellipse class="bd-pupil" cx="131" cy="82" rx="3.2" ry="4"/><path class="bd-stroke-light" fill="none" stroke-width="3" stroke-linecap="round" d="M112 96 Q119 102 126 96"/>',
};
const body = (mood) => `<circle class="bd-dot" cx="119" cy="86" r="28"/><ellipse class="bd-shine" cx="108" cy="70" rx="8" ry="4.6" transform="rotate(-32 108 70)"/>${face[mood]}<ellipse class="bd-blush" cx="100" cy="94" rx="4.2" ry="2.3"/><ellipse class="bd-blush" cx="138" cy="94" rx="4.2" ry="2.3"/>`;
// A stack of three titled books. k scales the width; titles centre on the spine, or sit at its left
// end ('start') when something rests on the right end.
const books = (x, y, k = 1, align = 'middle') => {
  const w = (n) => Math.round(n * k), at = (cx) => (align === 'start' ? `x="${x + 8}" text-anchor="start"` : `x="${cx}" text-anchor="middle"`);
  return `<g class="lp-stack">
      <rect class="lp-book-a" x="${x}" y="${y + 22}" width="${w(66)}" height="13" rx="2.5"/><text class="lp-spine" ${at(x + w(33))} y="${y + 31.5}">CALCULUS</text>
      <rect class="lp-book-b" x="${x + w(4)}" y="${y + 10}" width="${w(58)}" height="12" rx="2.5"/><text class="lp-spine" ${at(x + w(33))} y="${y + 19}">STATISTICS</text>
      <rect class="lp-book-c" x="${x - 2}" y="${y}" width="${w(62)}" height="10" rx="2.5"/><text class="lp-spine" ${at(x + w(33) - 3)} y="${y + 7.8}">BIOLOGY</text></g>`;
};


// Screen 2: the night before.
export function nightSpot() {
  return `<svg class="lp-scene lp-spot lp-spot-night" viewBox="0 0 260 224" width="260" height="224" aria-hidden="true" focusable="false">
    <circle class="lp-spot-bg" cx="140" cy="118" r="96"/>
    <path class="lp-moon" d="M196 40 a13 13 0 1 0 10 22 a10 10 0 1 1 -10 -22z"/>
    <circle class="lp-star lp-star-0" cx="222" cy="78" r="2"/><circle class="lp-star lp-star-1" cx="176" cy="34" r="1.8"/><circle class="lp-star lp-star-2" cx="232" cy="46" r="1.6"/>
    ${books(80, 160, 1.6, 'start')}
    <path class="lp-limb-leg" d="M159 156 L157 177 M171 156 L173 177"/><path class="lp-limb-leg" d="M150 178 h8 M172 178 h8"/>
    <g class="lp-bob"><g transform="translate(46 44)">${body('stressed')}<path class="lp-sweat" d="M143 66 q-4 6 0 9 q4 -3 0 -9z"/></g>
      <path class="lp-limb" d="M139 134 Q132 148 144 156 M191 134 Q198 148 186 156"/>
      <path class="lp-page" d="M140 158 L165 152 L165 164 L142 168 Z M190 158 L165 152 L165 164 L188 168 Z"/><path class="lp-page lp-flip" d="M190 158 L165 152 L165 164 L188 168 Z"/></g>
    <g class="lp-bubble"><circle class="lp-bub" cx="150" cy="100" r="3"/><circle class="lp-bub" cx="138" cy="93" r="4.6"/>
      <rect class="lp-bub" x="18" y="40" width="110" height="46" rx="20"/>
      <text class="lp-bub-units" x="73" y="59" text-anchor="middle">6 units to go</text>
      <text class="lp-bub-hours lp-hours" x="73" y="76" text-anchor="middle">6 hours left</text></g>
  </svg>`;
}

// Screen 3: the Dot waters a little plant under the app's own "This week" card. Each watering ticks a
// day and the plant grows a leaf; on the seventh it blooms, with an "A" at the heart of the flower.
const LEAVES = [[1, 154], [-1, 145], [1, 136], [-1, 127], [1, 118], [-1, 109]];
export function repsSpot() {
  const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  const petals = [0, 72, 144, 216, 288].map((a) => `<circle cx="${(176 + 12 * Math.sin((a * Math.PI) / 180)).toFixed(1)}" cy="${(90 - 12 * Math.cos((a * Math.PI) / 180)).toFixed(1)}" r="8.5"/>`).join('');
  return `<svg class="lp-scene lp-spot lp-scene-reps" viewBox="0 0 260 224" width="260" height="224" aria-hidden="true" focusable="false">
    <circle class="lp-spot-bg" cx="130" cy="122" r="96"/>
    <rect class="lp-ui-card" x="34" y="10" width="192" height="56" rx="14"/>
    <text class="lp-ui-title" x="50" y="30">This week</text><text class="lp-ui-meta lp-week-count" x="210" y="30" text-anchor="end">0 of 7 days</text>
    <g class="lp-week">${days.map((d, i) => `<g class="lp-day" transform="translate(${56 + i * 24.7} 47)"><circle r="8.5"/><path d="M-3.5 0 l2.5 2.6 l4.5 -5"/></g>`).join('')}</g>
    <path class="lp-stem" d="M176 166 V94" pathLength="100"/>
    ${LEAVES.map(([side, y]) => `<path class="lp-leaf" d="M176 ${y} q${side * 10} -11 ${side * 21} -3 q${side * -8} 9 ${side * -21} 3z"/>`).join('')}
    <g class="lp-flower"><g class="lp-petals">${petals}</g><circle class="lp-heart" cx="176" cy="90" r="10"/><text class="lp-heart-a" x="176" y="94.5" text-anchor="middle">A</text></g>
    <rect class="lp-pot-rim" x="152" y="164" width="48" height="9" rx="3"/><path class="lp-pot" d="M156 173 H196 L191 202 H161 Z"/>
    <g class="lp-drops"><ellipse cx="166" cy="148" rx="1.8" ry="2.6"/><ellipse cx="170" cy="152" rx="1.8" ry="2.6"/><ellipse cx="163" cy="155" rx="1.8" ry="2.6"/></g>
    <g class="lp-grow-dot"><path class="lp-limb-leg" d="M86 170 L84 196 M98 170 L100 196"/><path class="lp-limb-leg" d="M77 197 h8 M99 197 h8"/>
      <path class="lp-limb" d="M72 150 Q64 162 70 172"/>
      <g transform="translate(92 148) scale(.82) translate(-119 -86)">${body('happy')}</g>
      <path class="lp-limb" d="M112 148 Q122 152 128 144"/></g>
    <g class="lp-can"><path class="lp-can-body" d="M124 133 h22 v17 a3 3 0 0 1 -3 3 h-16 a3 3 0 0 1 -3 -3z"/><path class="lp-can-spout" d="M146 140 L161 128"/><path class="lp-can-handle" d="M126 133 q9 -12 18 0"/></g>
  </svg>`;
}

// Plays each scene while it is on screen. The plant: one watering every 0.65 s, each ticking a day and
// growing the plant; after seven it blooms with its "A" for 2.6 s, then the week starts again.
export function mountScenes(lp, reduce) {
  const scenes = [...lp.querySelectorAll('.lp-scene')];
  const reps = lp.querySelector('.lp-scene-reps'), days = reps ? [...reps.querySelectorAll('.lp-day')] : [], count = reps?.querySelector('.lp-week-count');
  const leaves = reps ? [...reps.querySelectorAll('.lp-leaf')] : [], stem = reps?.querySelector('.lp-stem');
  const show = (n) => {
    days.forEach((d, i) => d.classList.toggle('on', i < n));
    leaves.forEach((l, i) => l.classList.toggle('on', i < n));
    if (stem) stem.style.strokeDashoffset = String(100 - (n >= 7 ? 100 : 16 + n * 12));
    if (count) count.textContent = `${n} of 7 days`;
  };
  if (reduce || !scenes.length || !('IntersectionObserver' in window)) {
    show(7); reps?.classList.add('won');
    return () => {};
  }
  show(0);
  // the thought bubble: the hours run down from 6 to 1 while the units stay at 6, then start again
  const hours = [...lp.querySelectorAll('.lp-hours')];
  let h = 6;
  const clock = setInterval(() => {
    if (lp.classList.contains('paused') || !hours.some((el) => el.closest('.lp-scene.playing'))) return;
    h = h <= 1 ? 6 : h - 1;
    hours.forEach((el) => { el.textContent = `${h} hour${h === 1 ? '' : 's'} left`; el.classList.remove('lp-tick'); void el.getBBox(); el.classList.add('lp-tick'); });
  }, 2600);
  let n = 0, timer = 0, grow = 0;
  const tick = () => {
    if (lp.classList.contains('paused')) return;
    n = (n + 1) % 12; // 1–7: a watering each; 8: bloom; 9–11: the bloom stays; 0: a fresh week
    if (n === 0) { reps.classList.remove('won'); show(0); return; }
    if (n <= 7) {
      reps.classList.remove('pour'); void reps.getBBox(); reps.classList.add('pour'); // tilt the can once
      clearTimeout(grow); const d = n; grow = setTimeout(() => show(d), 420); // the plant grows as the water lands
    }
    if (n === 8) { reps.classList.remove('pour'); reps.classList.add('won'); }
  };
  const io = new IntersectionObserver((es) => es.forEach((e) => {
    e.target.classList.toggle('playing', e.isIntersecting);
    if (e.target === reps) { clearInterval(timer); if (e.isIntersecting) { tick(); timer = setInterval(tick, 650); } }
  }), { threshold: 0.4 });
  scenes.forEach((s) => io.observe(s));
  return () => { io.disconnect(); clearInterval(timer); clearTimeout(grow); clearInterval(clock); };
}
