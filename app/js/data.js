// Loads the exam list and exam files produced by the build.

let manifestPromise = null;
const examCache = new Map();
const previewExams = new Map(); // exams loaded from the "Check a question file" page

export async function getManifest() {
  if (!manifestPromise) {
    manifestPromise = fetch('data/exams.json', { cache: 'no-cache' }).then((r) => {
      if (!r.ok) throw new Error(`Couldn't load the exam list (HTTP ${r.status}).`);
      return r.json();
    }).catch((e) => { manifestPromise = null; throw e; });
  }
  const m = await manifestPromise;
  const previews = [...previewExams.values()].map((e) => ({
    id: e.id, title: e.title, course: 'Preview (not published)', description: e.description,
    active: false, archived: false, preview: true, questionCount: e.questions.length,
    onExamCount: e.questions.filter((q) => q.onExam).length, topics: e.topics, timeLimit: e.timeLimit, passMark: e.passMark,
  }));
  return { ...m, exams: [...m.exams, ...previews] };
}

export async function getExam(id) {
  if (previewExams.has(id)) return previewExams.get(id);
  if (examCache.has(id)) return examCache.get(id);
  const m = await getManifest();
  const entry = m.exams.find((e) => e.id === id);
  if (!entry) return null;
  const p = fetch(`data/${encodeURIComponent(id)}.json?v=${entry.hash}`).then((r) => {
    if (!r.ok) throw new Error(`Couldn't load this exam (HTTP ${r.status}).`);
    return r.json();
  }).then(indexExam);
  examCache.set(id, p);
  try { return await p; } catch (e) { examCache.delete(id); throw e; }
}

function indexExam(exam) {
  exam.byId = new Map(exam.questions.map((q) => [q.id, q]));
  return exam;
}

export function addPreviewExam(parsed, name) {
  const id = 'preview-' + (name || 'file').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  const exam = indexExam({ id, ...parsed.meta, preview: true, topics: parsed.topics, questions: parsed.questions });
  previewExams.set(id, exam);
  return exam;
}

// Programming assignments for an exam (loaded only when needed)
const asgCache = new Map();
export async function getAssignments(id) {
  if (asgCache.has(id)) return asgCache.get(id);
  const m = await getManifest();
  const entry = m.exams.find((e) => e.id === id);
  if (!entry || !entry.assignmentCount) return [];
  const p = fetch(`data/${encodeURIComponent(id)}.assignments.json?v=${entry.assignmentsHash}`).then((r) => {
    if (!r.ok) throw new Error(`Couldn't load the assignments (HTTP ${r.status}).`);
    return r.json();
  }).then((d) => d.assignments);
  asgCache.set(id, p);
  try { return await p; } catch (e) { asgCache.delete(id); throw e; }
}
