// npm test runs this after the unit tests. It checks the code against the grid in docs/architecture.json:
//   1. every module sits in one layer, and imports only the layers it may;
//   2. only cloud.js loads Firebase;
//   3. every stored path the code uses is registered, and covered by firestore.rules;
//   4. every screen in views/ is reachable from the router or another screen;
//   5. no file grows past its line budget;
//   6. known debt doesn't grow;
//   7. colours come only from the design tokens (app/css/tokens.css), and every token used exists;
//   8. no code older Safari can't read (one such line stops the whole site from starting there).
// It fails with a plain message saying what to change. See docs/ARCHITECTURE.md.
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const grid = JSON.parse(fs.readFileSync(path.join(root, 'docs/architecture.json'), 'utf8'));
const rel = (p) => path.relative(root, p).split(path.sep).join('/');
const read = (p) => fs.readFileSync(path.join(root, p), 'utf8');
const problems = [];
const notes = [];

// ---- the files and their layers
const walk = (dir) => fs.readdirSync(path.join(root, dir), { withFileTypes: true }).flatMap((d) => {
  const p = `${dir}/${d.name}`;
  return d.isDirectory() ? walk(p) : /\.js$/.test(d.name) ? [p] : [];
});
const files = walk('app/js');
const matches = (file, pattern) => (pattern.endsWith('/*') ? file.startsWith(pattern.slice(0, -1)) : file === pattern);
const layerOf = (file) => Object.entries(grid.layers).find(([, l]) => l.files.some((p) => matches(file, p)))?.[0];

for (const f of files) if (!layerOf(f)) problems.push(`${f} isn't in any layer. Add it to "layers" in docs/architecture.json (core, adapters, shell or views).`);
for (const [name, l] of Object.entries(grid.layers)) {
  for (const p of l.files) if (!p.endsWith('/*') && !files.includes(p)) problems.push(`docs/architecture.json lists ${p} in "${name}", but the file doesn't exist. Remove it from the list.`);
}

// ---- 1, 2. imports
const debtImports = new Set(grid.debt.imports.map((d) => `${d.from} -> ${d.to}`));
const usedDebt = new Set();
for (const f of files) {
  const src = read(f), from = layerOf(f);
  for (const [, spec] of src.matchAll(/(?:import\s[^'"]*?from\s*|import\s*\(\s*)['"]([^'"]+)['"]/g)) {
    if (!spec.startsWith('.')) continue;
    const target = rel(path.resolve(path.join(root, path.dirname(f)), spec));
    if (target.includes('vendor/firebase') && f !== 'app/js/cloud.js') problems.push(`${f} loads Firebase. Only app/js/cloud.js may; call a function in cloud.js instead.`);
    if (!target.startsWith('app/js/') || target === 'app/config.js') continue;
    const to = layerOf(target);
    if (!to || !from || grid.layers[from].mayImport.includes(to)) continue;
    const key = `${f} -> ${target}`;
    if (debtImports.has(key)) { usedDebt.add(key); continue; }
    problems.push(`${f} (${from}) imports ${target} (${to}). A ${from} file may only import: ${grid.layers[from].mayImport.join(', ')}. Move the logic down a layer, or pass the data in.`);
  }
  if (from === 'core' && /\b(document|localStorage|sessionStorage|fetch)\s*[.(]/.test(src)) problems.push(`${f} is core but uses the page, storage or the network. Core files must be pure; move that part to an adapter.`);
}
for (const d of grid.debt.imports) {
  const key = `${d.from} -> ${d.to}`;
  if (usedDebt.has(key)) notes.push(`Debt: ${key}. ${d.why} Fix: ${d.fix}`);
  else problems.push(`The debt "${key}" is fixed. Remove it from "debt.imports" in docs/architecture.json.`);
}

// ---- 3. stored paths
const cloud = read('app/js/cloud.js');
const rules = read('firestore.rules');
const used = { topLevel: new Set(), classSub: new Set() };
for (const [, name] of cloud.matchAll(/(?:doc|collection)\(fb\.db,\s*'([A-Za-z]+)'/g)) used.topLevel.add(name);
for (const [, name] of cloud.matchAll(/'classes',\s*[^,'()]+,\s*'([A-Za-z]+)'/g)) used.classSub.add(name);
for (const [, name] of cloud.matchAll(/tdoc\([^,]+,\s*'([A-Za-z]+)'/g)) used.classSub.add(name);
const ruled = new Set([...rules.matchAll(/match \/([A-Za-z]+)\/\{/g)].map((m) => m[1]));
for (const scope of ['topLevel', 'classSub']) {
  const where = scope === 'topLevel' ? 'a top-level collection' : 'a collection inside classes/{class}';
  for (const name of used[scope]) {
    if (!grid.data[scope][name]) problems.push(`cloud.js stores data in "${name}" (${where}), which isn't registered. Add it to data.${scope} in docs/architecture.json, with what it holds, its group and "since": 1.`);
  }
  for (const [name, d] of Object.entries(grid.data[scope])) {
    if (!ruled.has(name) && !(scope === 'classSub' && /match \/\{kind\}\//.test(rules))) problems.push(`"${name}" is registered but firestore.rules has no "match /${name}/{…}". Every stored path needs a rule.`);
    if (typeof d.since !== 'number') problems.push(`data.${scope}.${name} needs a "since" schema version.`);
  }
}

// ---- 4. screens are reachable
const main = read('app/js/main.js');
const views = files.filter((f) => f.startsWith('app/js/views/'));
for (const v of views) {
  const name = path.basename(v);
  const fromRouter = main.includes(`./views/${name}`);
  const fromView = views.some((o) => o !== v && read(o).includes(`./${name}`));
  if (!fromRouter && !fromView) problems.push(`${v} can't be reached: no route in main.js and no screen imports it. Add a route, or delete the file.`);
}

// ---- 5. line budgets
for (const f of files) {
  const lines = read(f).split('\n').length;
  const budget = grid.budgets.files[f] ?? grid.budgets.default;
  if (lines > budget) problems.push(`${f} has ${lines} lines, over its budget of ${budget}. Split it by job (see docs/ARCHITECTURE.md, "Growing without breaking") instead of raising the budget.`);
  else if (lines > budget * 0.95) notes.push(`${f} is near its budget (${lines} of ${budget} lines). Plan the split.`);
}
for (const f of Object.keys(grid.budgets.files)) if (!files.includes(f)) problems.push(`docs/architecture.json has a budget for ${f}, which no longer exists. Remove it.`);

// ---- 6. debt that must not grow
const codes = views.reduce((n, v) => n + (read(v).match(/permission-denied/g) || []).length, 0);
const cap = grid.debt.firebaseErrorCodesInViews.max;
if (codes > cap) problems.push(`Screens check Firebase error codes ${codes} times (limit ${cap}). Don't add more: ${grid.debt.firebaseErrorCodesInViews.fix}`);
else if (codes < cap) problems.push(`Screens now check Firebase error codes only ${codes} times. Lower debt.firebaseErrorCodesInViews.max to ${codes} so it can't creep back.`);
else notes.push(`Debt: screens check Firebase error codes ${codes} times. Fix: ${grid.debt.firebaseErrorCodesInViews.fix}`);

for (const n of notes) console.log(`  note  ${n}`);
// ---- 7. design tokens: no stylesheet writes its own colours
{
  const d = grid.design;
  const stripComments = (css) => css.replace(/\/\*[\s\S]*?\*\//g, '');
  const tokensCss = stripComments(read(d.tokens));
  const defined = new Set([...tokensCss.matchAll(/(--cr-[a-z0-9-]+)\s*:/g)].map((m) => m[1]));
  const literalsIn = (css) => stripComments(css).split(/[;{}]/).filter((seg) => {
    const i = seg.indexOf(':');
    return i >= 0 && /#[0-9a-fA-F]{3,8}\b|\brgba?\(|\bhsla?\(/.test(seg.slice(i + 1));
  }).length;
  const sheets = fs.readdirSync(path.join(root, 'app/css')).filter((f) => f.endsWith('.css')).map((f) => `app/css/${f}`);
  const scan = [...sheets, ...files];
  for (const f of scan) {
    for (const m of read(f).matchAll(/var\((--cr-[a-z0-9-]+)/g)) {
      if (!defined.has(m[1])) problems.push(`${f} uses ${m[1]}, which isn't in ${d.tokens}. Use an existing token, or add it there (and to docs/DESIGN.md).`);
    }
  }
  for (const f of sheets) {
    if (f === d.tokens) continue;
    const n = literalsIn(read(f));
    const debt = d.debt[f];
    if (!debt) { if (n) problems.push(`${f} writes ${n} colour ${n === 1 ? 'value' : 'values'} of its own. Use the tokens in ${d.tokens} instead (see docs/DESIGN.md).`); continue; }
    if (n > debt.max) problems.push(`${f} writes ${n} colours of its own (limit ${debt.max}). Don't add more: use the tokens in ${d.tokens}.`);
    else if (n < debt.max) problems.push(`${f} now writes only ${n} colours of its own. Lower design.debt["${f}"].max to ${n} in docs/architecture.json so it can't creep back.`);
    else notes.push(`Debt: ${f} writes ${n} colours of its own. Fix: ${debt.fix}`);
  }
  for (const f of Object.keys(d.debt)) if (!sheets.includes(f)) problems.push(`docs/architecture.json lists design debt for ${f}, which doesn't exist. Remove it.`);

  // The same idea in the code: things DESIGN.md says go through one place. Each may only go down.
  const RULES = {
    inlineStyles: { re: /\bstyle="/g, skip: [], what: 'inline styles', fix: 'use kit parts and classes in app/css (DESIGN.md, The kit)' },
    jsColours: { re: /#[0-9a-fA-F]{6}\b|#[0-9a-fA-F]{3}\b(?![\w-])|\brgba?\(/g, skip: [], what: 'colours written in code', fix: 'use a class or a --cr- token' },
    dateCalls: { re: /\.toLocale(?:Date|Time)?String\(|Intl\.DateTimeFormat/g, skip: ['app/js/format.js'], what: 'dates formatted outside format.js', fix: 'use app/js/format.js (DESIGN.md, Dates, times and numbers)' },
    drawnIcons: { re: /<svg\b/g, skip: ['app/js/ui.js', 'app/js/buddy.js', 'app/js/views/lp-hero.js', 'app/js/views/lp-scenes.js', 'app/js/views/lp-subjects.js'], // buddy.js, lp-hero.js: the study buddy is an illustration, like the logo
    what: 'SVG drawings outside the icon set', fix: "use icon('name'); logos, charts and the watermark are allowed" },
  };
  for (const [key, r] of Object.entries(RULES)) {
    const n = files.filter((f) => !r.skip.includes(f)).reduce((sum, f) => sum + (read(f).match(r.re) || []).length, 0);
    const lim = d.code?.[key];
    if (!lim) { problems.push(`docs/architecture.json has no design.code.${key}. Add {"max": ${n}}.`); continue; }
    if (n > lim.max) problems.push(`The code has ${n} ${r.what} (limit ${lim.max}). Don't add more: ${r.fix}.`);
    else if (n < lim.max) problems.push(`The code now has only ${n} ${r.what}. Lower design.code.${key}.max to ${n} in docs/architecture.json so it can't creep back.`);
    else if (n) notes.push(`Debt: ${n} ${r.what}. Fix: ${r.fix}.`);
  }
}

// ---- 8. older browsers
// Students use school-issued and older Macs. A file Safari can't parse stops every page from loading
// (the site stays blank), so code must run on Safari 15 and later. These are the parts that can't.
{
  const TOO_NEW = [
    { re: /\(\?<[=!]/, what: 'a regex lookbehind, (?<= or (?<! (Safari 16.4+)', fix: 'match the character instead, or check it in the callback' },
    { re: /\bstatic\s*\{/, what: 'a class static block (Safari 16.4+)', fix: 'set it after the class' },
    { re: /\/[dgimsuy]*v[dgimsuy]*\.(?:test|exec)\b|new RegExp\([^)]*,\s*['"][a-z]*v/, what: 'a regex v flag (Safari 17+)', fix: 'use the u flag' },
    { re: /\.(?:toSorted|toReversed|toSpliced|findLast|findLastIndex)\(|\bstructuredClone\(|Object\.groupBy|Promise\.withResolvers|Array\.fromAsync/, what: 'a method Safari 15 lacks', fix: 'use the older form ([...a].sort(), a slice and loop, JSON copy)' },
    { re: /[\w)\]]\.at\(-?\d/, what: 'Array.at (Safari 15.4+)', fix: 'use a[a.length - 1]' },
  ];
  for (const f of files) {
    const lines = read(f).split('\n');
    lines.forEach((line, i) => {
      if (/^\s*\/\//.test(line)) return;
      for (const t of TOO_NEW) if (t.re.test(line)) problems.push(`${f}:${i + 1} uses ${t.what}. Older Safari can't run it and the site would stay blank: ${t.fix}.`);
    });
  }
}

if (problems.length) {
  console.log(`\nArchitecture: ${problems.length} problem${problems.length > 1 ? 's' : ''}\n`);
  for (const p of problems) console.log(`  ✗ ${p}`);
  process.exit(1);
}
console.log(`Architecture: ${files.length} files in their layers, ${used.topLevel.size + used.classSub.size} stored paths registered and ruled, ${views.length} screens reachable, colours from the tokens, nothing older Safari can't run, all within budget.`);
