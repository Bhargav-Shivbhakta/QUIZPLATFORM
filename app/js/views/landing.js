// Landing page for signed-out visitors (#/). Written for professors, who bring a class; students
// find "Sign in" in the header. No database reads. Motion: one passive scroll listener (rAF) for
// the progress line; IntersectionObserver for reveals and for running the
// demos only while they're on screen. Everything stops for "Pause motion" and reduced motion.
import { ensureCss, header, footer } from './lp-shell.js';
import { mountSheet } from './lp-request.js';
import { readingDot, playHero } from './lp-hero.js';
import { nightSpot, repsSpot, guardSpot, mountScenes } from './lp-scenes.js'; import { liveMarkup, mountLive } from './lp-live.js'; import { mountPaging, glideTo } from './lp-paging.js'; import { subjectsMarkup, mountSubjects } from './lp-subjects.js';

const CHECK = '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 12l5 5L20 7" stroke="#fff" stroke-width="3.2"/></svg>';
const TICK = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 12l5 5L20 7" stroke="currentColor" stroke-width="2.2" style="color:var(--accent)"/></svg>';
const PLUS = '<svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><path d="M9 2v14M2 9h14" stroke="currentColor" stroke-width="2" stroke-linecap="round" style="color:var(--accent)"/></svg>';

const MARK = (size) => `<svg class="lp-mark" width="${size}" height="${size}" viewBox="0 0 28 28" aria-hidden="true"><circle class="m1" cx="9" cy="9" r="5.5"/><circle class="m2" cx="19" cy="9" r="5.5"/><circle class="m3" cx="19" cy="19" r="5.5"/><circle class="m4" cx="9" cy="19" r="5.5"/></svg>`;
const TASKS = [['Try 4 questions again', 3], ['Review 6 questions to keep them fresh', 3], ['Read Unit 4: The chain rule', 9]];
const BUILD = ['Read your materials', 'Draft the course map', 'You approve the map', 'Write notes and practice', 'Check every answer key twice', 'Ready for your review'];
// The worked solution for the practice question. Maths is typeset with KaTeX (loaded by the page).
const OPTIONS = [
  ['0.4', 'Almost. 0.4 divides by n; the formula divides by its square root:', String.raw`\dfrac{10}{25} = 0.4`],
  ['2', 'Correct. Here is the working:', ''],
  ['10', 'Almost. 10 is the standard deviation itself; the next step divides it by the square root of n.', String.raw`s = 10`],
  ['50', 'Almost. 50 multiplies by the square root of n; the formula divides by it:', String.raw`10 \times \sqrt{25} = 50`],
];
const WORK = [
  ['Write down what you know', String.raw`s = 10, \qquad n = 25`],
  ['Use the formula for the standard error of the mean', String.raw`SE = \dfrac{s}{\sqrt{n}}`],
  ['Put in the numbers', String.raw`SE = \dfrac{10}{\sqrt{25}}`],
  ['Simplify', String.raw`\sqrt{25} = 5 \quad\Longrightarrow\quad SE = \dfrac{10}{5} = 2`],
];
const tex = (src) => {
  try { if (window.katex) return window.katex.renderToString(src, { displayMode: true, throwOnError: false, output: 'html' }); } catch (e) { /* fall through */ }
  return `<span class="lp-math-plain">${src.replace(/\\(dfrac|frac)\{([^}]*)\}\{([^}]*)\}/g, '($2) / ($3)').replace(/\\sqrt\{([^}]*)\}/g, '√$1').replace(/\\(qquad|quad)/g, '  ').replace(/\\times/g, '×').replace(/\\Longrightarrow/g, '⇒').replace(/[{}\\]/g, '')}</span>`;
};
const FAQ = [
  ['Do I have to pay for the AI?', 'No. Build my course runs on your own Claude, ChatGPT or Gemini account. A large course can be built in parts to stay within free plan limits.'],
  ['How much of my time does it take?', 'You upload your materials and approve the course map, and the AI drafts the rest. Your time goes into reviewing, which you can do one unit at a time.'],
  ['Can I use questions I already have?', 'Yes. Upload a question file and Cramming checks it, shows you any problems, and publishes only when you say so.'],
  ['Does it work with Canvas?', 'Rosters come from a Canvas export, and scores export in the file Canvas imports. A direct Canvas connection is on our roadmap.'],
  ['Where does student data go?', "Into Cramming's database on Google Firebase, readable only by the student and the staff of their class. Student work is never sent to an AI."],
  ['Which courses does it suit?', 'Any course where students learn by answering questions: multiple choice, true or false, numbers, short and written answers. Computer science, mathematics and statistics get extra tools: equations, number answers and Java programming with automatic tests.'],
];
const points = (list) => list.map(([h, p], i) => `<div class="reveal" style="--d:${i * 0.08}s"><h3>${h}</h3><p>${p}</p></div>`).join('');
const pts = (list) => `<ul class="lp-pts">${list.map(([h, p]) => `<li><i aria-hidden="true"></i><div><b>${h}</b><span>${p}</span></div></li>`).join('')}</ul>`;
const task = ([t, m]) => `<div class="lp-task"><span class="mark">${CHECK}</span><span class="text">${t}</span><span class="mins">${m} min</span><span class="go" aria-hidden="true">Start</span></div>`;

function markup() {
  return `<div class="lp js-anim">
  ${header(true)}
  <section class="wrap lp-center lp-hero lp-intro" aria-labelledby="lp-h1">
    <div class="lp-hero-top">
    ${MARK(56)}
    <h1 id="lp-h1" data-title="Cramming · Small reps. Top grades."><span class="lp-name">Cramming<sup class="tm" aria-hidden="true">™</sup></span> <span class="lp-tag"><span>Small reps.</span> <span>Top grades.<sup class="tm" aria-hidden="true">™</sup></span></span></h1>
    <p class="lp-lead">Cramming turns an educator's own materials into a few minutes of practice each day. Every student gets a clear plan to follow, so they walk into the exam feeling ready.</p>
    <div class="ctas"><span class="lp-perch"><button type="button" class="lp-btn big" data-request>Request access</button>${readingDot()}</span><a class="lp-link" href="#/" data-jump="problem">See how it works ›</a></div>
    </div>
  </section>

  <section id="problem" class="wrap sec lp-fit" aria-labelledby="pb-h">
    <div class="lp-split-head reveal">
      <div class="stack">
        <p class="lp-eyebrow">The challenge</p>
        <h2 id="pb-h" class="h2">Most studying happens the night before.</h2>
      </div>
      ${nightSpot()}
    </div>
    <div class="points">${points([
      ['Studying starts late', 'Most students start the night before the exam and try to cover every unit in a few hours.'],
      ['Feedback arrives after the exam results', 'Students find out which concepts they misunderstood once the exam results are out, and that is also when educators first see which concepts the class needs more time on.'],
      ['Every student learns differently', 'In a large lecture, each student has their own pace and pattern, so drafting personalized practice for every one of them can be challenging.'],
    ])}</div>
    <p class="lp-lead lp-turn reveal">Cramming solves all three, starting from the materials the educator already has.</p>
  </section>

  <section id="solution" class="wrap sec" aria-labelledby="so-h">
    <div class="lp-split-head reveal">
      <div class="stack">
        <p class="lp-eyebrow">How Cramming helps</p>
        <h2 id="so-h" class="h2">Students learn best with practice every day.</h2>
      </div>
      ${repsSpot()}
    </div>
    <div class="points">${points([
      ['A little practice every day', 'Each student practices for a few minutes a day, from the first week of class, so exam night becomes a final review.'],
      ['Feedback with every answer', 'Students see the answer and the full working as soon as they try a question, weeks before the exam.'],
      ['Practice for each student', "Each student's practice follows their own answers and pace, so every student in a large lecture gets a plan of their own."],
    ])}</div>
  </section>

  <section id="students" class="wrap sec" aria-labelledby="st-h">
    <div class="lp-center stack reveal">
      <p class="lp-eyebrow">For students</p>
      <h2 id="st-h" class="h2 lp-h-big">A clear plan for every student, every day.</h2>
    </div>
    <div class="lp-stage">
      <div class="lp-shot">
        <div class="lp-glow" aria-hidden="true"></div>
        <div class="lp-window" role="img" aria-label="Example: a student's Today screen for a calculus class. Three tasks get done one by one, and readiness for the chain rule grows from 41 to 74 percent.">
          <div class="lp-winbar" aria-hidden="true"><i></i><i></i><i></i><span>cramming.net</span></div>
          <div class="lp-today" aria-hidden="true">
            <div class="main">
              <div><p class="meta">Tuesday · MATH 150 · Midterm in 12 days</p><p class="title" data-today-title>Today, about 15 minutes</p></div>
              <div class="lp-tasks" data-tasks>${TASKS.map(task).join('')}</div>
            </div>
            <div class="side">
              <div class="lp-note"><small>A note from Ms. Harper</small><span>The chain rule is the key to Friday's quiz. Read Unit 4, then try a few reps.</span></div>
              <div class="lp-note">
                <small>How ready you are</small>
                <div class="lp-meter"><span>Limits</span><span>86% · Solid</span></div><div class="lp-track"><b class="ink" style="--w:86%"></b></div>
                <div class="lp-meter"><span>The chain rule</span><span data-chain-label>41% · Getting there</span></div><div class="lp-track"><b data-chain style="--w:41%"></b></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="lp-phone" aria-hidden="true"><div class="screen"><div class="notch"></div><p class="m">MATH 150</p><p class="t" data-today-title>Today, about 15 minutes</p><div class="lp-tasks" data-tasks>${TASKS.map(task).join('')}</div></div></div>
    </div>
    <ul class="lp-ticks">${['From the educator\'s own materials', 'Planned for each student', 'About 15 minutes a day'].map((t) => `<li><i>${CHECK}</i>${t}</li>`).join('')}</ul>
  </section>

  <section class="lp-dark lp-fit" aria-labelledby="pr-h">
    <div class="wrap">
      <div class="lp-center stack reveal">
        <p class="lp-eyebrow">Practice · try it</p>
        <h2 id="pr-h" class="h2">Practice that teaches.</h2>
        <p class="lp-lead">Every answer is explained the moment it's given, so each attempt becomes the next thing learned. Try this one.</p>
      </div>
      <div class="lp-q reveal" data-q>
        <div class="top"><span>STAT 119 · Sampling</span><span>Question 3 of 10</span></div>
        <p class="stem" id="q-stem">A sample of 25 students has a standard deviation of 10 points. What is the standard error of the mean?</p>
        <div class="opts" role="group" aria-labelledby="q-stem">${OPTIONS.map(([v]) => `<button type="button" class="lp-opt" data-opt="${v}"><span>${v}</span><em></em></button>`).join('')}</div>
        <div data-q-out><p class="lp-hint">Choose an answer.</p></div>
      </div>
    </div>
  </section>

  <section id="professors" class="wrap sec lp-fit" aria-labelledby="pf-h">
    <div class="lp-panel split reveal">
      <div class="stack">
        <p class="lp-eyebrow">For educators</p>
        <h2 id="pf-h" class="h2 lp-h-mid">Your materials in. A complete course out.</h2>
        <p class="lp-lead">Upload your slides, notes and past exams. Cramming makes notes, practice and quizzes for every unit, checks every answer key twice, then waits for your review. Students see it once you publish.</p>
        <ul class="lp-checks">${['Built from the materials you upload', 'Edit anything before you publish', 'Works with Claude, ChatGPT or Gemini, on your own account'].map((t) => `<li>${TICK}${t}</li>`).join('')}</ul>
      </div>
      <div class="card lp-build" data-build role="img" aria-label="Example of Build my course: steps from reading the materials to ready for review, completing one after another.">
        <div class="head" aria-hidden="true"><b>Build my course · MATH 150</b><span data-build-pct>0%</span></div>
        <div class="lp-track" aria-hidden="true"><b data-build-bar style="--w:0%"></b></div>
        <div aria-hidden="true">${BUILD.map((s) => `<div class="lp-step"><span class="mark">${CHECK}</span><span>${s}</span></div>`).join('')}</div>
      </div>
    </div>
  </section>

  <section id="subjects" class="wrap sec lp-fit" aria-labelledby="sb-h">
    ${subjectsMarkup()}
  </section>

  <section class="wrap sec lp-fit" aria-label="Course tutor and class dashboard">
    <div class="lp-duo">
    <div class="stack reveal lp-duo-col">
      <p class="lp-eyebrow">For students · Course tutor</p>
      <h2 id="tu-h" class="h2 lp-h-mid">Help that stays inside the course.</h2>
      <p class="lp-lead">Students connect the AI they already use. It reads only the units the educator has opened, and pauses during quizzes and exams.</p>
      <div class="card lp-chat lp-lift" role="img" aria-label="Example chat: a student asks the tutor for a quiz answer while the quiz is open. The tutor leaves the quiz to the student and offers to go through the topic from the unit notes once the quiz closes.">
        <small>MATH 150 tutor · Quiz 3 is open</small>
        <div class="me">Can you just give me the answer to question 2 on Quiz 3?</div>
        <div class="ai">Quiz 3 is open right now, so this one is yours. When it closes, I'll walk you through the chain rule using your Unit 4 notes.</div>
      </div>
    </div>
    <div class="stack reveal lp-duo-col">
      <p class="lp-eyebrow">For educators · Class dashboard</p>
      <h2 id="da-h" class="h2 lp-h-mid">See what to reteach, early.</h2>
      <p class="lp-lead">The hardest questions and who is yet to begin, so the next lecture can clear up a concept well before the midterm.</p>
      <div class="card lp-dash lp-lift" role="img" aria-label="Example class dashboard: the two hardest questions this week, 36 and 59 percent correct, and 9 students yet to begin the quiz.">
        <div class="head" aria-hidden="true"><b>MATH 150 · This week</b><span>142 students</span></div>
        <div aria-hidden="true" style="display:flex;flex-direction:column;gap:14px">
          <small style="font-size:13px;color:var(--ink-3)">Hardest this week</small>
          <div class="lp-row"><span>Q7 · The chain rule, nested functions</span><b>36% correct</b></div><div class="lp-track"><b style="--w:36%"></b></div>
          <div class="lp-row"><span>Q3 · Limits at infinity</span><b>59% correct</b></div><div class="lp-track"><b style="--w:59%;opacity:.55"></b></div>
          <div class="alert">9 students are yet to begin Quiz 3.</div>
        </div>
      </div>
    </div>
    </div>
  </section>

  <section class="wrap sec lp-fit" aria-labelledby="ex-h">
    <div class="lp-pair">
      <div class="stack reveal">
        <p class="lp-eyebrow">Graded exams</p>
        <h2 id="ex-h" class="h2 lp-h-mid">Exams you can trust.</h2>
        <p class="lp-lead">Run quizzes and exams in the room or online, and watch the whole class live.</p>
        ${pts([
          ['Access codes', 'Students begin when the educator shares the code on the projector.'],
          ['Lockdown', 'Works with Safe Exam Browser, and notes when a student leaves the exam.'],
          ['Fair timing', 'Timed by the server, with extra time for students who have accommodations.'],
          ['Straight to your gradebook', 'Scores export as a spreadsheet your learning platform imports, with a ready-made file for Canvas.'],
        ])}
      </div>
      <div class="reveal">${liveMarkup()}</div>
    </div>
  </section>

  <section class="wrap sec" aria-labelledby="sr-h">
    <div class="split lp-sr">
    <div class="stack reveal">
      <p class="lp-eyebrow">The science · Spaced review</p>
      <h2 id="sr-h" class="h2 lp-h-mid">Learn it once. Keep it for the exam.</h2>
      <p class="lp-lead">We forget fast at first, then more slowly. Reviewing after growing gaps is one of the best-tested ways to remember, and Cramming sets the gaps for each student: a day, then three, then a week, then sixteen days. When a question needs another try, its gaps start again.</p>
    </div>
    <figure class="card lp-curve reveal">
      <p class="axis">How much you remember</p>
      <div class="scroll" tabindex="0"><svg viewBox="0 0 800 270" role="img" aria-label="Two memory curves over a month. Without review, memory keeps falling. With reviews on day 1, 4, 11 and 27, it climbs back each time and falls more slowly after each review.">
        <line class="base" x1="0" y1="250" x2="800" y2="250" stroke-width="1.5"/>
        <path class="without" d="M0 20 C120 170 300 222 800 238" fill="none" stroke-width="3" stroke-dasharray="7 8" stroke-linecap="round"/>
        <path class="with" d="M0 20 C10 50 20 64 27 72 L27 24 C60 56 90 70 107 78 L107 24 C170 56 240 72 293 80 L293 24 C450 48 620 60 720 66 L720 22 C750 25 780 28 800 30" fill="none" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>
        ${[[27, 24], [107, 24], [293, 24], [720, 22]].map(([x, y]) => `<circle class="lp-ring" cx="${x}" cy="${y}" r="7"/><circle class="lp-dot" cx="${x}" cy="${y}" r="6"/>`).join('')}
      </svg></div>
      <figcaption class="legend"><span style="display:flex;flex-wrap:wrap;gap:10px 28px"><span><i class="sw"></i>With Cramming's reviews on day 1, 4, 11 and 27</span><span><i class="sw dash"></i>Without review</span></span><span>Day 1 → Day 30. An illustration, not measured data.</span></figcaption>
      <p class="research">The research: the forgetting curve, first measured by Ebbinghaus in 1885 and replicated by <a href="https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0120644" target="_blank" rel="noopener">Murre and Dros (2015)</a>. Spaced practice beats massed practice across hundreds of experiments (Cepeda and colleagues, 2006, <em>Psychological Bulletin</em>). A review of study methods by Dunlosky and colleagues (2013) rated spaced practice and practice testing the two most useful techniques.</p>
    </figure>
    </div>
  </section>

  <section class="lp-band lp-fit" aria-labelledby="tr-h">
    <div class="wrap lp-pair">
      <div class="stack reveal">
        <p class="lp-eyebrow">Privacy and access</p>
        <h2 id="tr-h" class="h2 lp-h-mid">Safe for students. Ready for your school.</h2>
        ${pts([
          ['School accounts only', 'Only students on a class roster sign in, with their school account.'],
          ['Student work stays private', "Students' answers and scores are never sent to an AI. The AI sees only the educator's course materials."],
          ['Scores stay with staff', 'Educators and TAs see exam scores; each student sees theirs once the educator releases them.'],
          ['Accessible', 'Keyboard and screen reader support, light and dark mode, and extra time built into the timer.'],
        ])}
      </div>
      ${guardSpot()}
    </div>
  </section>






  <section id="faq" class="wrap sec lp-faq" aria-labelledby="fq-h">
    <h2 id="fq-h" class="h2 reveal lp-fq-h">Questions professors ask.</h2>
    <div class="list">${FAQ.map(([q, a]) => `<details class="reveal"><summary><span>${q}</span>${PLUS}</summary><p>${a}</p></details>`).join('')}</div>
  </section>

  <section class="wrap lp-center lp-end" aria-labelledby="en-h">
    <span class="reveal">${MARK(44)}</span>
    <h2 id="en-h" class="h2 reveal">Bring Cramming to your class.</h2>
    <p class="lp-lead reveal">We're setting up a small number of courses by hand this term. Tell us about yours, and we'll build the first one with you.</p>
    <button type="button" class="lp-btn big reveal" data-request>Request access</button>
    <p class="lp-small">Free during early access. Student? <a href="#/signin">Sign in with your school account ›</a></p>
  </section>
  ${footer()}
  <button type="button" class="lp-pause" data-pause aria-pressed="false"><svg width="11" height="11" viewBox="0 0 12 12" aria-hidden="true" data-pause-icon><rect x="2" y="1.5" width="2.6" height="9" rx=".8"/><rect x="7.4" y="1.5" width="2.6" height="9" rx=".8"/></svg><span>Pause motion</span></button>
  <div class="lp-mobile-cta"><button type="button" class="lp-btn" data-request>Request access</button></div>
</div>`;
}

export async function render(main, params = {}, query = {}) {
  await ensureCss();
  document.body.classList.add('landing-mode');
  document.title = 'Cramming · Small reps. Top grades.';
  main.innerHTML = markup();
  const lp = main.querySelector('.lp');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let paused = reduce;
  const offs = [mountSheet(lp)];

  // the opening: the logo, the name, the tagline, then the Dot's walk to Request access (lp-hero.js)
  if (!reduce) offs.push(playHero(lp.querySelector('.lp-intro'), lp));
  offs.push(mountScenes(lp, reduce), mountPaging(lp, reduce), mountLive(lp, reduce)); mountSubjects(lp);

  // reveals
  const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { rootMargin: '0px 0px -6% 0px', threshold: 0.1 });
  lp.querySelectorAll('.reveal').forEach((el) => io.observe(el));
  offs.push(() => io.disconnect());

  // scroll-linked: the progress line under the header
  const bar = lp.querySelector('.lp-progress'), screens = [...lp.querySelectorAll(':scope > section')];
  let ticking = false;
  const frame = () => {
    ticking = false;
    const vh = innerHeight, max = document.documentElement.scrollHeight - vh;
    bar.style.transform = `scaleX(${max > 0 ? Math.min(1, scrollY / max).toFixed(4) : 0})`;
    if (!reduce) screens.forEach((sc) => { // the screen being left stays sharp until its bottom passes 60% of the window, then blurs (fully at 10%)
      const r = sc.getBoundingClientRect(), out = r.top < 0 ? Math.min(1, Math.max(0, (0.6 - r.bottom / vh) / 0.5)) : 0;
      if (out > 0.005) sc.style.setProperty('--out', out.toFixed(3)); else sc.style.removeProperty('--out');
    });
  };
  const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(frame); } };
  addEventListener('scroll', onScroll, { passive: true });
  addEventListener('resize', onScroll, { passive: true });
  offs.push(() => { removeEventListener('scroll', onScroll); removeEventListener('resize', onScroll); });
  frame();

  // demos: Today checks off tasks, Build my course completes steps. They run only on screen.
  const todayTitles = lp.querySelectorAll('[data-today-title]'), taskLists = lp.querySelectorAll('[data-tasks]');
  const chains = lp.querySelectorAll('[data-chain]'), chainLabels = lp.querySelectorAll('[data-chain-label]');
  const steps = [...lp.querySelectorAll('.lp-step')], pct = lp.querySelector('[data-build-pct]'), buildBar = lp.querySelector('[data-build-bar]');
  let k = 0;
  const paint = () => {
    const t = k % 10, done = t >= 6 ? 3 : t >= 4 ? 2 : t >= 2 ? 1 : 0;
    const left = TASKS.slice(done).reduce((n, x) => n + x[1], 0);
    todayTitles.forEach((el) => (el.textContent = done === 3 ? 'Done for today' : `Today, about ${left} minutes`));
    taskLists.forEach((list) => [...list.children].forEach((row, i) => { row.classList.toggle('done', i < done); row.classList.toggle('next', i === done); }));
    const c = [41, 52, 63, 74][done];
    chains.forEach((el) => el.style.setProperty('--w', c + '%')); chainLabels.forEach((el) => (el.textContent = `${c}% · ${c >= 75 ? 'Solid' : 'Getting there'}`)); // readiness: the number and its word
    const b = Math.min(k % 9, 6);
    steps.forEach((s, i) => { s.classList.toggle('done', i < b); s.classList.toggle('now', i === b); });
    pct.textContent = b === 6 ? 'Ready' : Math.round((b / 6) * 100) + '%';
    buildBar.style.setProperty('--w', Math.round((b / 6) * 100) + '%');
  };
  const STILL = 33; // with motion off or paused: the plan with one task done, the course built
  if (reduce) k = STILL;
  paint();
  const visible = new Set();
  const vio = new IntersectionObserver((es) => es.forEach((e) => (e.isIntersecting ? visible.add(e.target) : visible.delete(e.target))));
  [lp.querySelector('.lp-stage'), lp.querySelector('[data-build]')].forEach((el) => vio.observe(el));
  const timer = setInterval(() => { if (!paused && visible.size) { k++; paint(); } }, 1300);
  offs.push(() => { clearInterval(timer); vio.disconnect(); });

  // the practice question
  const q = lp.querySelector('[data-q]'), out = q.querySelector('[data-q-out]');
  const showQ = (pick) => {
    q.querySelectorAll('[data-opt]').forEach((b) => {
      const v = b.dataset.opt, right = v === '2';
      b.disabled = pick !== null;
      b.classList.toggle('right', pick !== null && right);
      b.classList.toggle('wrong', pick === v && !right);
      b.querySelector('em').textContent = pick !== null && right ? 'Correct' : pick === v ? 'Your answer' : '';
    });
    const [, verdict, slip] = OPTIONS.find((o) => o[0] === pick) || [];
    out.innerHTML = pick === null ? '<p class="lp-hint">Choose an answer.</p>' : `<div class="lp-explain" role="status">
      <p class="lp-verdict ${pick === '2' ? 'ok' : 'no'}">${verdict}</p>
      ${slip ? `<div class="lp-slip">${tex(slip)}</div><p class="lp-sub">The working:</p>` : ''}
      <ol class="lp-work">${WORK.map(([label, m], i) => `<li style="--i:${i}"><span class="lp-work-n" aria-hidden="true">${i + 1}</span><div><p>${label}</p>${tex(m)}</div></li>`).join('')}</ol>
      <p class="lp-why"><strong>Why it matters:</strong> the error shrinks with the square root of the sample size, so four times as many students only halves it. That's why larger studies are more precise, but each extra student helps a little less.</p>
      <button type="button" data-q-again>Try again</button></div>`;
    // wide maths scrolls sideways on a phone; a scrolling area must be reachable by keyboard
    out.querySelectorAll('.katex-display, .lp-slip').forEach((el) => { if (el.scrollWidth > el.clientWidth + 1) el.tabIndex = 0; });
    // keep the reader where they are: move focus without scrolling the page
    if (pick === null) q.querySelector('[data-opt]').focus({ preventScroll: true });
    else { const v = out.querySelector('.lp-verdict'); v.tabIndex = -1; v.focus({ preventScroll: true }); }
  };
  q.addEventListener('click', (e) => {
    const o = e.target.closest('[data-opt]');
    if (o && !o.disabled) showQ(o.dataset.opt);
    if (e.target.closest('[data-q-again]')) {
      // the working collapses: keep the question exactly where it was on screen
      const top = q.getBoundingClientRect().top;
      showQ(null);
      scrollBy(0, q.getBoundingClientRect().top - top);
      glideTo(q.closest('section'), paused); // then back up to the question
    }
  });

  // section links glide; the pause button stops every animation
  const onClick = (e) => {
    const j = e.target.closest('[data-jump]'), top = e.target.closest('[data-top]');
    if (j) { e.preventDefault(); const el = lp.querySelector('#' + j.dataset.jump); if (el) glideTo(el, paused); }
    else if (top) { e.preventDefault(); glideTo(lp, paused); }
    const p = e.target.closest('[data-pause]');
    if (p) {
      paused = !paused;
      lp.classList.toggle('paused', paused);
      if (paused) { k = STILL; paint(); } // a still that tells the story, not a frame caught mid-way
      p.setAttribute('aria-pressed', String(paused));
      p.querySelector('span').textContent = paused ? 'Play motion' : 'Pause motion';
      p.querySelector('[data-pause-icon]').innerHTML = paused ? '<path d="M3 1.5v9l7.5-4.5z"/>' : '<rect x="2" y="1.5" width="2.6" height="9" rx=".8"/><rect x="7.4" y="1.5" width="2.6" height="9" rx=".8"/>';
      frame();
    }
  };
  lp.addEventListener('click', onClick);
  if (reduce) { lp.classList.add('paused'); const p = lp.querySelector('[data-pause]'); p.hidden = true; }
  if (query.to) { const el = lp.querySelector('#' + CSS.escape(query.to)); if (el) setTimeout(() => glideTo(el, paused), 150); }

  return () => { offs.forEach((f) => f()); document.body.classList.remove('landing-mode'); };
}
