// Loads programming assignments from <exam folder>/assignments/<name>/ and checks them.
//
//   assignments/01-movie-ticket/
//     assignment.md          instructions (front matter + Markdown; a "## Hints" section becomes step-by-step hints)
//     MovieTicket.java       starter code students begin with
//     tests/<name>.in/.out   input and exact expected output for each test
//     checks.txt             optional:  require:<regex>  # label   /   forbid:<regex>  # label
//     solution/*.java        your reference solution: used to verify the tests, NEVER published
import fs from 'node:fs';
import path from 'node:path';
import { runTests, formatErrors } from '../app/js/java/index.js';

function frontMatter(text) {
  const m = text.replace(/\r\n?/g, '\n').match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!m) return { meta: {}, body: text };
  const meta = {};
  for (const line of m[1].split('\n')) {
    const kv = line.match(/^\s*([A-Za-z_][\w-]*)\s*:\s*(.*?)\s*$/);
    if (kv) meta[kv[1].toLowerCase()] = kv[2].replace(/\s+#.*$/, '').replace(/^["']|["']$/g, '');
  }
  return { meta, body: m[2] };
}

export function loadAssignments(examDir) {
  const dir = path.join(examDir, 'assignments');
  const out = { assignments: [], errors: [], warnings: [] };
  if (!fs.existsSync(dir)) return out;
  const folders = fs.readdirSync(dir, { withFileTypes: true }).filter((d) => d.isDirectory() && !d.name.startsWith('_') && !d.name.startsWith('.')).map((d) => d.name).sort();
  const slugs = new Set();
  for (const name of folders) {
    const adir = path.join(dir, name);
    const rel = path.relative(path.dirname(path.dirname(examDir)), adir);
    const problem = (msg) => out.errors.push(`${rel}: ${msg}`);
    const mdPath = path.join(adir, 'assignment.md');
    if (!fs.existsSync(mdPath)) { problem('missing assignment.md'); continue; }
    const { meta, body } = frontMatter(fs.readFileSync(mdPath, 'utf8'));
    const javaFiles = fs.readdirSync(adir).filter((f) => f.endsWith('.java'));
    const cls = meta.class || (javaFiles.length === 1 ? javaFiles[0].slice(0, -5) : null);
    if (!cls) { problem('add "class: ClassName" to assignment.md (or keep exactly one starter .java file)'); continue; }
    const starterPath = path.join(adir, cls + '.java');
    if (!fs.existsSync(starterPath)) { problem(`starter file ${cls}.java not found`); continue; }
    const starter = fs.readFileSync(starterPath, 'utf8');

    // tests
    const tdir = path.join(adir, 'tests');
    const tests = [];
    if (fs.existsSync(tdir)) {
      for (const f of fs.readdirSync(tdir).filter((x) => x.endsWith('.in')).sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))) {
        const tname = f.slice(0, -3);
        const outFile = path.join(tdir, tname + '.out');
        if (!fs.existsSync(outFile)) { problem(`tests/${tname}.in has no matching tests/${tname}.out`); continue; }
        tests.push({ name: tname, input: fs.readFileSync(path.join(tdir, f), 'utf8'), output: fs.readFileSync(outFile, 'utf8') });
      }
    }
    if (!tests.length) out.warnings.push(`${rel}: no tests (students can still run their code)`);
    const samples = (meta.sample_tests || '').split(',').map((s) => s.trim()).filter(Boolean);
    for (const s of samples) if (!tests.some((t) => t.name === s)) problem(`sample_tests lists "${s}", but tests/${s}.in doesn't exist`);
    const sampleSet = new Set(samples.length ? samples : tests.slice(0, 2).map((t) => t.name));
    tests.forEach((t) => { t.sample = sampleSet.has(t.name); });

    // structure checks
    const checks = [];
    const cfile = path.join(adir, 'checks.txt');
    if (fs.existsSync(cfile)) {
      fs.readFileSync(cfile, 'utf8').split('\n').forEach((line, i) => {
        const l = line.trim();
        if (!l || l.startsWith('#')) return;
        const m = l.match(/^(require|forbid)\s*:\s*(.+?)(?:\s+#\s+(.+))?$/);
        if (!m) { problem(`checks.txt line ${i + 1}: expected  require:<regex>  or  forbid:<regex>`); return; }
        try { new RegExp(m[2]); } catch { problem(`checks.txt line ${i + 1}: invalid regular expression ${m[2]}`); return; }
        checks.push({ kind: m[1], pattern: m[2], label: m[3] || `${m[1] === 'require' ? 'Uses' : 'Does not use'} ${m[2]}` });
      });
    }

    // hints: bullets under "## Hints"
    let instructions = body.trim();
    let hints = [];
    const hm = instructions.match(/\n##\s+Hints\s*\n([\s\S]*?)(?=\n##\s|$)/i);
    if (hm) {
      hints = hm[1].split(/\n(?=- )/).map((h) => h.replace(/^- /, '').trim()).filter(Boolean);
      instructions = (instructions.slice(0, hm.index) + instructions.slice(hm.index + hm[0].length)).trim();
    }

    // verify the reference solution passes every test and check
    const solPath = path.join(adir, 'solution', cls + '.java');
    let verified = false;
    if (fs.existsSync(solPath)) {
      const sol = fs.readFileSync(solPath, 'utf8');
      const r = runTests(sol, { className: cls, tests, checks }, { timeLimitMs: 10000 });
      if (r.compileErrors) problem(`the reference solution doesn't compile in the browser runner:\n${formatErrors(r.compileErrors, sol, cls + '.java')}`);
      else {
        for (const t of r.results.filter((x) => !x.passed)) problem(`the reference solution fails test "${t.name}"${t.timedOut ? ' (time limit)' : ''}. Check tests/${t.name}.out.\n      expected: ${JSON.stringify(t.expected.slice(0, 200))}\n      got:      ${JSON.stringify(t.actual.slice(0, 200))}${t.stderr ? '\n      error:    ' + t.stderr.split('\n')[0] : ''}`);
        for (const c of r.structure.filter((x) => !x.passed)) problem(`the reference solution fails the requirement "${c.label}" (${c.kind}:${c.pattern})`);
        verified = r.results.every((x) => x.passed) && r.structure.every((x) => x.passed);
      }
    } else out.warnings.push(`${rel}: no solution/${cls}.java, so the tests can't be verified automatically`);

    const slug = name.replace(/^\d+[-_ ]*/, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || name;
    if (slugs.has(slug)) problem(`two assignments would both be called "${slug}"`);
    slugs.add(slug);
    out.assignments.push({
      slug,
      folder: name,
      title: meta.title || cls,
      cls,
      order: Number(meta.order) || out.assignments.length + 1,
      difficulty: ['easy', 'medium', 'hard'].includes(meta.difficulty) ? meta.difficulty : 'medium',
      estimate: meta.estimate || '',
      topics: (meta.topics || '').split(',').map((s) => s.trim()).filter(Boolean),
      instructions,
      hints,
      starter,
      tests,
      checks,
      verified,
    });
  }
  out.assignments.sort((a, b) => a.order - b.order || a.title.localeCompare(b.title));
  return out;
}
