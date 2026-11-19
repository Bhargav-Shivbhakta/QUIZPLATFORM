// Everything the student pages (Today, a class, Progress) need about one class, gathered once:
// practice sets with what this student has done, today's tasks, graded work, units and readiness.
// Rules live in today.js, studyplan.js and engine.js; this file only collects.
import * as cloud from '../cloud.js';
import * as store from '../store.js';
import { getManifest, getExam } from '../data.js';
import { mistakeIds, dueIds, readiness, topicMastery } from '../engine.js';
import { todayTasks } from '../studyplan.js';
import { forSection, kindOf, KINDS } from '../timed.js';
import { readinessWord } from '../today.js';
import { dayKey } from '../format.js';
import { studyUnits } from './classes.js';
import { toolsOf } from './mystudy.js';

const cache = new Map(); // classId -> Promise (one load per page view of Today and its class pages)
export function clearClassData() { cache.clear(); }

export function classData(cls) {
  if (!cache.has(cls.id)) cache.set(cls.id, load(cls).catch((e) => { cache.delete(cls.id); throw e; }));
  return cache.get(cls.id);
}

async function load(cls) {
  const [manifest, doc] = await Promise.all([getManifest(), cloud.getClass(cls.id).catch(() => null)]);
  const byId = new Map(manifest.exams.map((e) => [e.id, e]));
  const now = cloud.trueNow();
  const ids = (doc?.exams || cls.exams || []).filter((id) => cloud.canSeeExam(id));
  const metas = ids.map((id) => byId.get(id)).filter(Boolean).map((e) => ({ ...e, state: cloud.practiceState(cls, e.id) })).filter((e) => !e.state.closed && !e.state.off && !e.state.notYet);
  const exams = await Promise.all(metas.map((m) => getExam(m.id).catch(() => null)));
  const sets = [], coding = [];
  metas.forEach((meta, i) => {
    const ex = exams[i];
    if (meta.assignmentCount) {
      const prog = store.getAsgProgress(meta.id);
      coding.push({ id: meta.id, title: meta.title, total: meta.assignmentCount, done: Object.values(prog).filter((x) => x.done).length, started: Object.values(prog).some((x) => x.attempts), onlyCoding: !ex?.questions?.length });
    }
    if (!ex?.questions?.length) return;
    const stats = store.getStats(ex.id), attempts = store.getAttempts(ex.id);
    const r = readiness(ex, stats, attempts), seen = ex.questions.filter((q) => stats[q.id]?.seen).length;
    sets.push({ id: ex.id, title: meta.title, exam: ex, stats, meta, mistakes: mistakeIds(ex, stats).length, due: dueIds(ex, stats).length, questions: ex.questions.length, seen, score: r.score, word: readinessWord(r.score, seen > 0), attempts, topics: topicMastery(ex, stats) });
  });

  const units = studyUnits(doc?.study);
  const openUnits = units.filter((u) => u.opensAt <= now);
  const cur = openUnits[openUnits.length - 1] || null;
  const curExam = cur ? `${cls.id}--unit-${cur.n}` : null;
  const unit = cur ? { id: cur.id, n: cur.n, title: cur.title, read: !!store.get(`read:${cls.id}:${cur.id}`, 0), examId: sets.some((s) => s.id === curExam) ? curExam : null } : null;
  const answeredToday = store.getActivity()[dayKey()]?.answered || 0;
  const tasks = todayTasks({ classId: cls.id, sets, unit, answeredToday });
  // coding practice counts as today's work when nothing else is waiting
  const openCoding = coding.find((c) => c.done < c.total);
  if (!tasks.length && openCoding) tasks.push({ key: 'code', title: `${openCoding.started ? 'Keep going with' : 'Start'} ${openCoding.title}`, why: `${openCoding.done} of ${openCoding.total} coding assignments done.`, minutes: 20, href: `#/exam/${encodeURIComponent(openCoding.id)}`, done: false });

  // graded work for this student's section, and exam dates the professor set on practice sets
  const graded = Object.entries(doc?.timed || {}).map(([id, t]) => forSection({ id, ...t }, cls.section ?? ''))
    .filter((t) => t && t.status === 'published' && !t.disabled && t.opensAt)
    .map((t) => ({ classId: cls.id, id: t.id, title: t.title, at: Number(t.opensAt), until: Number(t.closesAt) || 0, kind: kindOf(t), kindLabel: KINDS[kindOf(t)].label, released: !!t.released, minutes: t.durationMin, requireCode: !!t.requireCode, href: `#/take/${encodeURIComponent(cls.id)}/${encodeURIComponent(t.id)}` }))
    .sort((a, b) => a.at - b.at);
  const dates = Object.entries(cls.examDates || doc?.examDates || {}).map(([eid, d]) => ({ classId: cls.id, title: (byId.get(eid)?.title || 'Exam').replace(/\s*practice\s*$/i, ''), at: new Date(`${d}T00:00:00`).getTime(), kind: 'date' })).filter((x) => !Number.isNaN(x.at));

  // readiness for the class: questions weigh each set, as on My study
  const totals = sets.reduce((a, s) => { a.score += s.score * s.questions; a.q += s.questions; a.seen += s.seen; return a; }, { score: 0, q: 0, seen: 0 });
  const ready = totals.q ? Math.round(totals.score / totals.q) : 0;
  return {
    cls, doc, now, sets, coding, units, openUnits, unit, tasks, graded, dates, tools: toolsOf(doc),
    ready, word: readinessWord(ready, totals.seen > 0), seen: totals.seen,
    mistakes: sets.reduce((n, s) => n + s.mistakes, 0), due: sets.reduce((n, s) => n + s.due, 0),
  };
}

// Graded work and exam dates of several classes, for the countdown and Coming up
export const examItems = (list) => list.flatMap((d) => [...d.graded, ...d.dates]);

// Progress saved to the account arrives a moment after sign-in. A page drawn before that redraws once
// when it lands, so its numbers are never stale. Returns the cleanup for the router.
export function redrawAfterFirstSync() {
  if (!cloud.enabled || cloud.syncState().lastSynced) return () => {};
  const on = () => { if (!cloud.syncState().lastSynced) return; off(); window.dispatchEvent(new HashChangeEvent('hashchange')); };
  const off = () => window.removeEventListener('qp:sync', on);
  window.addEventListener('qp:sync', on);
  return off;
}

