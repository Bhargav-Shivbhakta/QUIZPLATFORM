// The landing page's Subjects screen (DESIGN › Landing page): the subjects on the left; pick one and a
// question made for it appears on the right, to try. Each is a real question type Cramming has today,
// drawn the way an educator's own notes and diagrams would appear. Wrong answers say "Almost." and
// explain; every question can be tried again. Colours come from classes in landing.css.

const tex = (src) => {
  try { if (window.katex) return window.katex.renderToString(src, { throwOnError: false, output: 'html' }); } catch (e) { /* plain text below */ }
  return `<code>${src}</code>`;
};
// a multiple-choice row: [label, correct?, what it says when chosen]
const opts = (list) => `<div class="sj-opts">${list.map(([t, ok, note]) => `<button type="button" class="sj-opt" data-ok="${ok ? 1 : 0}" data-note="${note}">${t}</button>`).join('')}</div>`;
const card = (tag, prompt, body) => `<p class="sj-tag">${tag}</p><p class="sj-q">${prompt}</p>${body}<div class="sj-foot"><p class="sj-out" role="status" aria-live="polite"></p><button type="button" class="sj-again" hidden>Try again</button></div>`;

// ---- the drawings (labelled like a figure in the educator's notes)
const CELL = `<svg class="sj-art" viewBox="0 0 320 200" role="img" aria-label="Diagram of an animal cell with its parts unlabelled; an arrow points to one part.">
  <ellipse class="sj-cell" cx="160" cy="100" rx="138" ry="84"/>
  <path class="sj-er" d="M214 62 q12 8 2 18 t2 18 t-2 18 t2 18"/>
  <circle class="sj-nuc" cx="172" cy="96" r="34"/><circle class="sj-nucleolus" cx="180" cy="90" r="11"/>
  <g transform="translate(84 128) rotate(-18)"><ellipse class="sj-mito" rx="27" ry="12"/><path class="sj-cristae" d="M-19 0 q4 -8 8 0 t8 0 t8 0 t8 0"/></g>
  <g transform="translate(246 140) rotate(24)"><ellipse class="sj-mito" rx="20" ry="9"/><path class="sj-cristae" d="M-13 0 q3 -6 6 0 t6 0 t6 0"/></g>
  <g class="sj-golgi" transform="translate(98 50)"><path d="M0 0 q22 -12 44 0"/><path d="M3 8 q19 -10 38 0"/><path d="M6 16 q16 -8 32 0"/></g>
  ${[[60, 80], [70, 92], [132, 150], [146, 160], [230, 74], [262, 102], [118, 104], [206, 150]].map(([x, y]) => `<circle class="sj-ribo" cx="${x}" cy="${y}" r="2.4"/>`).join('')}
  <g class="sj-pointer" data-pointer></g>
</svg>`;
const BIO = [ // the part, where the arrow starts and ends, and three names to choose from
  { from: [20, 188], to: [78, 132], label: 'Mitochondrion', opts: [['Mitochondrion', 1, 'Correct. The mitochondrion makes most of the cell&#39;s energy, as ATP.'], ['Nucleus', 0, 'Almost. The nucleus is the large round part that holds the DNA.'], ['Golgi apparatus', 0, 'Almost. The Golgi is the stack of curved sacs that packages proteins.']] },
  { from: [300, 14], to: [196, 74], label: 'Nucleus', opts: [['Ribosome', 0, 'Almost. Ribosomes are the tiny dots that build proteins.'], ['Nucleus', 1, 'Correct. The nucleus holds the cell&#39;s DNA.'], ['Vacuole', 0, 'Almost. Vacuoles store water and nutrients; this large round part holds the DNA.']] },
  { from: [24, 14], to: [102, 46], label: 'Golgi apparatus', opts: [['Endoplasmic reticulum', 0, 'Almost. The ER is the folded membrane winding beside the nucleus.'], ['Golgi apparatus', 1, 'Correct. The Golgi packages proteins and sends them on.'], ['Lysosome', 0, 'Almost. Lysosomes are small round sacs that break down waste; these stacked, curved sacs are the Golgi.']] },
];
const SD = `<svg class="sj-art" viewBox="0 0 320 200" role="img" aria-label="Supply and demand graph with a price ceiling drawn below the equilibrium price.">
  <path class="sj-axis" d="M40 20 V180 H300"/><text class="sj-lbl" x="30" y="16">Price</text><text class="sj-lbl" x="300" y="196" text-anchor="end">Quantity</text>
  <path class="sj-dem" d="M48 34 L288 184"/><text class="sj-lbl sj-dem-l" x="290" y="176">D</text>
  <path class="sj-sup" d="M48 176 L288 26"/><text class="sj-lbl sj-sup-l" x="290" y="30">S</text>
  <path class="sj-guide" d="M40 105 H164"/><text class="sj-lbl" x="34" y="109" text-anchor="end">P*</text>
  <path class="sj-ceiling" d="M40 140 H300"/><text class="sj-lbl sj-ceiling-l" x="298" y="134" text-anchor="end">Price ceiling</text>
  <g class="sj-show"><path class="sj-gap" d="M106 140 H218"/><path class="sj-guide" d="M106 140 V180 M218 140 V180"/><text class="sj-lbl" x="106" y="194" text-anchor="middle">Qs</text><text class="sj-lbl" x="218" y="194" text-anchor="middle">Qd</text><text class="sj-gap-l" x="162" y="132" text-anchor="middle">Shortage</text></g>
</svg>`;
const CIRCUIT = `<svg class="sj-art" viewBox="0 0 320 200" role="img" aria-label="A circuit: a 12 volt battery and a 4 ohm resistor in a loop, with an ammeter.">
  <path class="sj-wire" d="M70 88 V44 H136 M196 44 H250 V86 M250 114 V156 H70 V112"/>
  <path class="sj-flow sj-show" d="M70 88 V44 H250 V156 H70 Z"/>
  <path class="sj-plate" d="M54 94 H86"/><path class="sj-plate-s" d="M62 106 H78"/><text class="sj-lbl sj-big" x="40" y="104" text-anchor="end">12 V</text>
  <path class="sj-wire" d="M136 44 l5 -9 l10 18 l10 -18 l10 18 l10 -18 l10 18 l5 -9"/><text class="sj-lbl sj-big" x="166" y="24" text-anchor="middle">4 Ω</text>
  <circle class="sj-meter" cx="250" cy="100" r="14"/><text class="sj-lbl sj-big" x="250" y="105" text-anchor="middle">A</text><text class="sj-lbl sj-big sj-amp" x="272" y="105" data-win="3 A">?</text>
</svg>`;
const AREA = (() => {
  const X = (x) => 40 + x * 200, Y = (y) => 166 - y * 34, pts = (a, b) => Array.from({ length: 25 }, (_, i) => a + ((b - a) * i) / 24).map((x) => `${X(x).toFixed(1)} ${Y(3 * x * x).toFixed(1)}`);
  return `<svg class="sj-art" viewBox="0 0 320 180" role="img" aria-label="Graph of y equals 3 x squared, with the area under it from 0 to 1 shaded.">
  <path class="sj-area" d="M${X(0)} ${Y(0)} L${pts(0, 1).join(' L')} L${X(1)} ${Y(0)} Z"/>
  <path class="sj-axis" d="M40 14 V166 H300"/><path class="sj-curve" d="M${pts(0, 1.2).join(' L')}"/>
  ${[0, 1].map((x) => `<text class="sj-lbl" x="${X(x)}" y="178" text-anchor="middle">${x}</text>`).join('')}<text class="sj-lbl" x="${X(1.2) + 4}" y="22">y = 3x²</text>
  <text class="sj-big sj-area-l" x="${X(0.72)}" y="150" text-anchor="middle" data-win="Area = 1">Area = ?</text>
</svg>`;
})();
const DOTS = [4, 5, 5, 6, 6, 6, 7, 7, 8, 30], xOf = (v) => 24 + v * 8.7;
const PLOT = `<svg class="sj-art" viewBox="0 0 320 170" role="img" aria-label="Dot plot of ten quiz scores, nine between 4 and 8 and one at 30.">
  <path class="sj-axis" d="M20 130 H304"/>${[0, 10, 20, 30].map((v) => `<text class="sj-lbl" x="${xOf(v)}" y="148" text-anchor="middle">${v}</text>`).join('')}
  ${DOTS.map((v, i) => `<circle class="sj-dot${v === 30 ? ' sj-out-dot' : ''}" cx="${xOf(v)}" cy="${120 - 13 * DOTS.slice(0, i).filter((w) => w === v).length}" r="5.5"/>`).join('')}
  <g class="sj-show"><path class="sj-med" d="M${xOf(6)} 40 V130"/><text class="sj-lbl sj-med-l" x="${xOf(6) - 4}" y="34" text-anchor="end">Median 6</text>
  <path class="sj-mean" d="M${xOf(8.4)} 54 V130"/><text class="sj-lbl sj-mean-l" x="${xOf(8.4) + 4}" y="50">Mean 8.4</text></g>
</svg>`;
const BALL = `<svg class="sj-art" viewBox="0 0 320 150" role="img" aria-label="A 2 kilogram ball rolling at 3 metres per second.">
  <path class="sj-axis" d="M20 128 H300"/><path class="sj-speed" d="M40 88 h34 M30 102 h44 M44 116 h30"/>
  <g class="sj-roll"><circle class="sj-ball" cx="110" cy="102" r="26"/><text class="sj-ball-t" x="110" y="107" text-anchor="middle">2 kg</text>
  <path class="sj-arrow" d="M146 102 H196 m-10 -8 l10 8 l-10 8"/><text class="sj-lbl sj-big" x="204" y="107">3 m/s</text></g>
</svg>`;
const WEEK = `<svg class="sj-art" viewBox="0 0 320 112" role="img" aria-label="Two study plans with the same total time: a short session each day, or one long session the night before the exam.">
  ${['M', 'T', 'W', 'T', 'F'].map((d, i) => `<text class="sj-lbl" x="${108 + i * 44}" y="14" text-anchor="middle">${d}</text>`).join('')}
  <text class="sj-lbl" x="4" y="46">Spaced</text>${[0, 1, 2, 3, 4].map((i) => `<rect class="sj-blk" x="${90 + i * 44}" y="28" width="38" height="26" rx="6"/><text class="sj-blk-t" x="${109 + i * 44}" y="45" text-anchor="middle">20 min</text>`).join('')}
  <text class="sj-lbl" x="4" y="94">Night before</text><rect class="sj-blk sj-blk-late" x="224" y="76" width="88" height="26" rx="6"/><text class="sj-blk-t" x="268" y="93" text-anchor="middle">100 min</text>
</svg>`;

// ---- the subjects: name, the tag on the card, and the question
const S = [
  { id: 'cs', name: 'Computer science', html: () => card('CS 150 · Loops', 'Fill the blank so <code>sum(n)</code> adds the numbers 1 to n, then run the tests.', `
    <pre class="sj-code"><span class="sj-k">int</span> sum(<span class="sj-k">int</span> n) {
  <span class="sj-k">int</span> total = <span class="sj-n">0</span>;
  <span class="sj-k">for</span> (<span class="sj-k">int</span> i = <span class="sj-n">1</span>; i &lt;= n; i++) {
    total += <button type="button" class="sj-blank" data-blank aria-label="The blank: choose below">&nbsp;?&nbsp;</button>;
  }
  <span class="sj-k">return</span> total;
}</pre>
    <div class="sj-row"><span class="sj-chips">${['n', 'i', '1'].map((v) => `<button type="button" class="sj-chip" data-fill="${v}">${v}</button>`).join('')}</span><button type="button" class="sj-run" data-run disabled>Run tests</button></div>
    <ul class="sj-tests">${[1, 3, 5, 0].map((n) => `<li data-n="${n}"><i></i><code>sum(${n})</code> <span>is ${n * (n + 1) / 2}</span></li>`).join('')}</ul>`) },
  { id: 'math', name: 'Mathematics', html: () => card('MATH 150 · Integrals', `Evaluate ${tex(String.raw`\int_0^1 3x^2\,dx`)}`, `
    ${AREA}<form class="sj-row sj-num" data-num="1"><label class="sr-only" for="sj-m">Your answer</label><input id="sj-m" inputmode="decimal" autocomplete="off" placeholder="Your answer"><button type="submit" class="sj-run">Check</button></form>
    <div class="sj-win sj-show">${tex(String.raw`\int_0^1 3x^2\,dx = \Big[x^3\Big]_0^1 = 1 - 0 = 1`)}</div>`),
    note: ['Correct. The shaded area is exactly 1.', 'Almost. The antiderivative of 3x² is x³; evaluate it from 0 to 1.'] },
  { id: 'stats', name: 'Statistics', html: () => card('STAT 119 · Center and spread', 'One score is 30. Which measure barely moves because of it?', PLOT + opts([['Mean', 0, 'Almost. The mean is pulled up to 8.4 by the 30.'], ['Median', 1, 'Correct. The median stays at 6: it depends on the middle, not the extremes.'], ['Range', 0, 'Almost. The range jumps to 26 because of the 30.']])) },
  { id: 'phys', name: 'Physics', html: () => card('PHYS 195 · Energy', 'What is the ball&#39;s kinetic energy?', BALL + opts([['6 J', 0, 'Almost. 6 is the momentum, mv. Kinetic energy is ½mv².'], ['9 J', 1, 'Correct. KE = ½mv² = ½ × 2 × 3² = 9 J.'], ['18 J', 0, 'Almost. Remember the ½ in ½mv².']])) },
  { id: 'chem', name: 'Chemistry', html: () => card('CHEM 200 · Reactions', 'Hydrogen burns in oxygen to make water. Balance the equation.', `
    <div class="sj-eq">${[['H', '<sub>2</sub>'], ['O', '<sub>2</sub>'], ['H', '<sub>2</sub>O']].map(([a, b], i) => `<span class="sj-co"><button type="button" data-co="${i}" data-d="-1" aria-label="Fewer">−</button><b data-cv="${i}">1</b><button type="button" data-co="${i}" data-d="1" aria-label="More">+</button></span><span class="sj-f">${a}${b}</span>${i === 0 ? '<span class="sj-op">+</span>' : i === 1 ? '<span class="sj-op">→</span>' : ''}`).join('')}</div>
    <div class="sj-atoms"><span data-atom="H"></span><span data-atom="O"></span></div>`) },
  { id: 'bio', name: 'Biology', html: () => card('BIO 101 · The cell <span class="sj-step" data-step>Part 1 of 3</span>', 'What is the part the arrow points to?', CELL + '<div data-bio-opts></div>') },
  { id: 'econ', name: 'Economics', html: () => card('ECON 101 · Markets', 'A price ceiling is set below the equilibrium price. What follows?', SD + opts([['A shortage', 1, 'Correct. At the capped price, buyers want Qd but sellers offer only Qs.'], ['A surplus', 0, 'Almost. A surplus follows a price floor above equilibrium.'], ['No change', 0, 'Almost. A ceiling below P* changes both quantities.']])) },
  { id: 'psych', name: 'Psychology', html: () => card('PSY 101 · Memory', 'True or false: the same study time spread over five days beats doing it all the night before.', WEEK + opts([['True', 1, 'Correct. This is the spacing effect, one of the best-replicated findings on learning.'], ['False', 0, 'Almost. Spreading practice out wins across hundreds of experiments.']])) },
  { id: 'eng', name: 'Engineering', html: () => card('EE 210 · Circuits', 'What current does the ammeter read?', CIRCUIT + opts([['0.33 A', 0, 'Almost. Current is voltage divided by resistance: 12 ÷ 4.'], ['3 A', 1, 'Correct. I = V ÷ R = 12 ÷ 4 = 3 A.'], ['48 A', 0, 'Almost. Divide the voltage by the resistance.']])) },
  { id: 'bus', name: 'Business', html: () => card('ACCT 201 · The balance sheet', 'Select all the current assets, then check.', `
    <div class="sj-opts sj-multi">${[['Cash', 1], ['Inventory', 1], ['Accounts receivable', 1], ['Equipment', 0]].map(([t, ok]) => `<button type="button" class="sj-opt" aria-pressed="false" data-ok="${ok}">${t}</button>`).join('')}</div>
    <button type="button" class="sj-run" data-check>Check</button>`) },
  { id: 'more', name: 'And more', html: () => card('HIST 110 · Written answer', 'Explain one cause of the First World War. <span class="sj-who">Marked by the educator and TAs</span>', `
    <blockquote class="sj-essay">The alliance system turned a regional conflict into a world war: when Austria-Hungary declared war on Serbia, Russia, Germany, France and Britain were drawn in by their treaties within a week.</blockquote>
    <div class="sj-row"><span class="sj-lbl-t">Your mark, out of 5</span><span class="sj-chips" role="group" aria-label="Mark out of 5">${[0, 1, 2, 3, 4, 5].map((n) => `<button type="button" class="sj-chip" data-mark="${n}">${n}</button>`).join('')}</span></div>`) },
];

export function subjectsMarkup() {
  return `<div class="lp-subj">
    <div class="stack reveal lp-subj-text">
      <p class="lp-eyebrow">Subjects</p>
      <h2 id="sb-h" class="h2 lp-h-mid">Made for your subject.</h2>
      <p class="lp-lead">If it can be asked as a question, it works on Cramming, from code that runs to diagrams from the educator's own notes. Pick a subject and try one.</p>
      <ul class="lp-chips sj-pick" aria-label="Subjects">${S.map((s, i) => `<li><button type="button" data-subj="${s.id}" aria-pressed="${i === 0}">${s.name}</button></li>`).join('')}</ul>
    </div>
    <div class="card sj-card reveal" data-sj-card aria-label="A question to try"></div>
  </div>`;
}

// shows a subject's question and wires it up. Returns nothing to clean up: everything lives in the card.
export function mountSubjects(root) {
  const box = root.querySelector('[data-sj-card]');
  if (!box) return;
  let current = S[0];
  const show = (s) => {
    current = s;
    root.querySelectorAll('[data-subj]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.subj === s.id)));
    box.dataset.sj = s.id;
    box.classList.remove('solved');
    box.innerHTML = s.html();
    if (s.id === 'chem') chem(box);
    if (s.id === 'bio') bio(box, 0);
  };
  const out = (t, ok) => {
    const o = box.querySelector('.sj-out');
    o.textContent = t; o.className = `sj-out ${ok ? 'ok' : 'no'}`;
    box.classList.toggle('solved', !!ok);
    box.querySelector('.sj-again').hidden = false;
    if (ok) box.querySelectorAll('[data-win]').forEach((el) => (el.textContent = el.dataset.win));
  };
  // chemistry: the atoms on each side update with every press
  const chem = (c) => {
    const v = [...c.querySelectorAll('[data-cv]')].map((b) => Number(b.textContent));
    const H = [2 * v[0], 2 * v[2]], O = [2 * v[1], v[2]], even = H[0] === H[1] && O[0] === O[1];
    c.querySelector('[data-atom="H"]').textContent = `H: ${H[0]} on the left, ${H[1]} on the right`;
    c.querySelector('[data-atom="O"]').textContent = `O: ${O[0]} on the left, ${O[1]} on the right`;
    c.querySelectorAll('[data-atom]').forEach((el, i) => el.classList.toggle('ok', i === 0 ? H[0] === H[1] : O[0] === O[1]));
    if (even) out(v.join(',') === '2,1,2' ? 'Balanced. 2H₂ + O₂ → 2H₂O.' : `Balanced. The smallest whole numbers are 2, 1 and 2.`, true);
    else { box.classList.remove('solved'); const o = c.querySelector('.sj-out'); o.textContent = ''; }
  };
  // biology: three parts, one after another
  const bio = (c, k) => {
    const p = BIO[k], [x1, y1] = p.from, [x2, y2] = p.to, left = x1 < 160;
    c.querySelector('[data-step]').textContent = `Part ${k + 1} of ${BIO.length}`;
    c.querySelector('[data-pointer]').innerHTML = `<path class="sj-ptr" d="M${x1} ${y1} L${x2} ${y2}"/><circle class="sj-ptr-end" cx="${x2}" cy="${y2}" r="4"/><circle class="sj-ptr-dot" cx="${x1}" cy="${y1}" r="10"/><text class="sj-ptr-q" x="${x1}" y="${y1 + 4.5}" text-anchor="middle">?</text><text class="sj-ptr-name" x="${x1 + (left ? 14 : -14)}" y="${y1 + 4.5}" text-anchor="${left ? 'start' : 'end'}">${p.label}</text>`;
    c.querySelector('[data-bio-opts]').innerHTML = opts(p.opts);
    c.dataset.k = k;
  };
  box.addEventListener('click', (e) => {
    const t = e.target.closest('button'); if (!t) return;
    if (t.matches('.sj-again')) { // biology moves on to the next part once one is named; everything else starts over
      const k = Number(box.dataset.k || 0), next = box.classList.contains('solved') ? (k + 1) % BIO.length : k;
      show(current); if (current.id === 'bio') bio(box, next); return;
    }
    if (t.dataset.mark) {
      box.querySelectorAll('[data-mark]').forEach((b) => b.classList.toggle('on', b === t));
      return out(`Marked ${t.dataset.mark} of 5. The student sees it when you release the grades.`, true);
    }
    if (t.matches('.sj-multi .sj-opt')) { t.setAttribute('aria-pressed', String(t.getAttribute('aria-pressed') !== 'true')); return; }
    if (t.matches('[data-check]')) {
      const picks = [...box.querySelectorAll('.sj-multi .sj-opt')], ok = picks.every((b) => (b.getAttribute('aria-pressed') === 'true') === (b.dataset.ok === '1'));
      picks.forEach((b) => b.classList.toggle('right', ok && b.dataset.ok === '1'));
      return out(ok ? 'Correct. Each is cash, or turns into cash within a year.' : 'Almost. Current assets turn into cash within a year; equipment is used for many years.', ok);
    }
    if (t.matches('.sj-opt')) {
      const ok = t.dataset.ok === '1';
      box.querySelectorAll('.sj-opts .sj-opt').forEach((b) => { b.disabled = true; b.classList.toggle('right', ok && b === t); b.classList.toggle('wrong', !ok && b === t); });
      out(t.dataset.note.replace(/&#39;/g, "'"), ok);
      if (current.id === 'bio' && ok) box.querySelector('.sj-again').textContent = Number(box.dataset.k) < BIO.length - 1 ? 'Next part' : 'Start again';
      return;
    }
    if (t.matches('[data-fill]')) {
      box.querySelector('[data-blank]').textContent = t.dataset.fill;
      box.querySelectorAll('[data-fill]').forEach((b) => b.classList.toggle('on', b === t));
      box.querySelector('[data-run]').disabled = false;
      box.querySelectorAll('.sj-tests li').forEach((li) => { li.className = ''; li.querySelector('span').textContent = `is ${(Number(li.dataset.n) * (Number(li.dataset.n) + 1)) / 2}`; });
      return;
    }
    if (t.matches('[data-run]')) {
      const v = box.querySelector('[data-blank]').textContent.trim(), lis = [...box.querySelectorAll('.sj-tests li')];
      const sum = (n) => { let s = 0; for (let i = 1; i <= n; i++) s += v === 'i' ? i : v === 'n' ? n : 1; return s; };
      let pass = 0;
      t.disabled = true;
      lis.forEach((li, i) => setTimeout(() => {
        const n = Number(li.dataset.n), good = sum(n) === (n * (n + 1)) / 2; pass += good;
        li.className = good ? 'pass' : 'fail';
        li.querySelector('span').textContent = good ? `is ${(n * (n + 1)) / 2}` : `gave ${sum(n)}, expected ${(n * (n + 1)) / 2}`;
        if (i === lis.length - 1) { t.disabled = false; out(pass === 4 ? '4 of 4 tests pass.' : `${pass} of 4 tests pass. Choose another value to try again.`, pass === 4); }
      }, 260 * (i + 1)));
      return;
    }
    if (t.dataset.co) {
      const b = box.querySelector(`[data-cv="${t.dataset.co}"]`);
      b.textContent = String(Math.min(6, Math.max(1, Number(b.textContent) + Number(t.dataset.d))));
      chem(box);
    }
  });
  box.addEventListener('submit', (e) => {
    e.preventDefault();
    const raw = String(e.target.querySelector('input').value).replace(',', '.').trim();
    if (!raw) return;
    const ok = Number(raw) === Number(e.target.dataset.num);
    out(current.note[ok ? 0 : 1], ok);
  });
  root.addEventListener('click', (e) => { const b = e.target.closest('[data-subj]'); if (b) show(S.find((s) => s.id === b.dataset.subj)); });
  show(S[0]);
}
