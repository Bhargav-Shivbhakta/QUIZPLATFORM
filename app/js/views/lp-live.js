// The landing page's Graded exams screen: the live exam view an educator watches during a midterm
// (the Live tab, views/timed-admin.js): the access code for the projector, the time left, who is
// working, who has submitted, a student who left the exam once and a student with extra time.
// It plays a short loop while on screen; with reduced motion or Pause motion it holds still.

const ROWS = [ // name, status, note
  ['Ava Reyes', 'Working', ''],
  ['Leo Martin', 'Working', ''],
  ['Mia Tran', 'Working', '+15 min extra time'],
  ['Sam Kim', 'Submitted', 'at 10:31'],
  ['Noah Patel', 'Working', ''],
];

export function liveMarkup() {
  return `<div class="card lp-live" data-live role="img" aria-label="Example live exam view: access code 4729 on the projector, 38 minutes left, 136 students working, 4 submitted and 2 yet to begin. One student has left the exam window once; another has 15 minutes of extra time.">
    <div class="lv-head" aria-hidden="true"><b>MATH 150 · Midterm 1</b><span class="lv-live"><i></i>Live</span></div>
    <div class="lv-top" aria-hidden="true">
      <div class="lv-code"><small>Access code</small><b>4729</b><span>On the projector</span></div>
      <div class="lv-time"><small>Time left</small><b data-lv-time>38:12</b><span>Timed by the server</span></div>
    </div>
    <div class="lv-counts" aria-hidden="true"><span><b data-lv-n="working">136</b> working</span><span><b data-lv-n="done">4</b> submitted</span><span><b>2</b> yet to begin</span></div>
    <ul class="lv-rows" aria-hidden="true">${ROWS.map(([n, s, note], i) => `<li data-lv-row="${i}"><span class="lv-name">${n}</span><span class="lv-note">${note}</span><span class="lv-st ${s === 'Submitted' ? 'done' : ''}">${s}</span></li>`).join('')}</ul>
  </div>`;
}

// Plays the view while it is on screen. Returns a function that stops it.
export function mountLive(lp, reduce) {
  const box = lp.querySelector('[data-live]');
  if (!box) return () => {};
  const time = box.querySelector('[data-lv-time]'), working = box.querySelector('[data-lv-n="working"]'), done = box.querySelector('[data-lv-n="done"]');
  const leo = box.querySelector('[data-lv-row="1"]'), noah = box.querySelector('[data-lv-row="4"]');
  const set = (t) => { // t: seconds into the loop
    const left = 38 * 60 + 12 - t;
    time.textContent = `${Math.floor(left / 60)}:${String(left % 60).padStart(2, '0')}`;
    const flagged = t >= 3, submitted = t >= 7;
    leo.classList.toggle('flag', flagged);
    leo.querySelector('.lv-note').textContent = flagged ? 'Left the exam window once' : '';
    noah.querySelector('.lv-st').textContent = submitted ? 'Submitted' : 'Working';
    noah.querySelector('.lv-st').classList.toggle('done', submitted);
    noah.querySelector('.lv-note').textContent = submitted ? 'at 10:32' : '';
    working.textContent = String(136 - submitted); done.textContent = String(4 + submitted);
  };
  if (reduce) { set(8); return () => {}; }
  let t = 0, timer = 0;
  const tick = () => { if (lp.classList.contains('paused')) return; t = (t + 1) % 12; set(t); };
  const io = new IntersectionObserver(([e]) => { clearInterval(timer); if (e.isIntersecting) { set(t); timer = setInterval(tick, 1000); } }, { threshold: 0.4 });
  io.observe(box);
  return () => { io.disconnect(); clearInterval(timer); };
}
