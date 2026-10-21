import { gradeQuestion, isAnswered } from './parser.js';
import * as store from './store.js';

export const MODES = {
  topic:   { label: 'Topic practice',      feedback: 'instant', timer: false },
  bank:    { label: 'Full question bank',  feedback: 'instant', timer: false },
  exam:    { label: 'Real exam',           feedback: 'end',     timer: true  },
  custom:  { label: 'Custom exam',         feedback: 'end',     timer: true  },
  smart:   { label: 'Smart review',        feedback: 'instant', timer: false },
  mistakes:{ label: 'My mistakes',         feedback: 'instant', timer: false },
  saved:   { label: 'Saved questions',     feedback: 'instant', timer: false },
  retry:   { label: 'Retry',               feedback: 'instant', timer: false },
};

// Spaced repetition (Leitner boxes 1–5). Box 0 = never answered.
const DAY = 86400000;
const BOX_INTERVAL = [0, 10 * 60000, 1 * DAY, 3 * DAY, 7 * DAY, 16 * DAY];

export const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);

export function shuffle(arr, rand = Math.random) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function qStat(stats, qid) {
  return stats[qid] || { seen: 0, right: 0, wrong: 0, box: 0, due: 0, last: 0, streak: 0, lastCorrect: null };
}

export function isDue(s, now = Date.now()) { return s.box > 0 && s.due <= now; }

export function mistakeIds(exam, stats) {
  return exam.questions.filter((q) => { const s = stats[q.id]; return s && s.lastCorrect === false; }).map((q) => q.id);
}

export function dueIds(exam, stats, now = Date.now()) {
  return exam.questions.filter((q) => isDue(qStat(stats, q.id), now)).map((q) => q.id);
}

// Picks questions for smart review: due first (weakest box first), then never-seen, then lowest mastery.
export function smartPick(exam, stats, count) {
  const now = Date.now();
  const scored = exam.questions.map((q) => {
    const s = qStat(stats, q.id);
    let pri;
    if (isDue(s, now)) pri = 0 + s.box * 0.1 + Math.random() * 0.05;
    else if (s.box === 0) pri = 1 + Math.random() * 0.5;
    else pri = 2 + s.box + (s.due - now) / (30 * DAY) + Math.random() * 0.2;
    return { id: q.id, pri };
  });
  return scored.sort((a, b) => a.pri - b.pri).slice(0, count).map((x) => x.id);
}

/**
 * opts: { topics, count, difficulties, types, source: all|unseen|missed|saved, ids, timeLimitMin,
 *         feedback, shuffleQuestions, shuffleChoices }
 */
export function buildSession(exam, mode, opts = {}) {
  const settings = store.getSettings();
  const stats = store.getStats(exam.id);
  const saved = new Set(store.getSaved(exam.id));
  const m = MODES[mode] || MODES.custom;
  let pool = exam.questions;
  let ordered = false;

  if (mode === 'exam') {
    const onExam = pool.filter((q) => q.onExam);
    pool = onExam.length ? onExam : pool;
    ordered = true;
  } else if (opts.ids?.length) {
    pool = opts.ids.map((id) => exam.byId.get(id)).filter(Boolean);
  } else if (mode === 'smart') {
    pool = smartPick(exam, stats, opts.count || 20).map((id) => exam.byId.get(id));
    ordered = true;
  } else if (mode === 'mistakes') {
    const ids = new Set(mistakeIds(exam, stats));
    pool = pool.filter((q) => ids.has(q.id));
  } else if (mode === 'saved') {
    pool = pool.filter((q) => saved.has(q.id));
  }

  if (mode !== 'exam' && mode !== 'smart') {
    if (opts.topics?.length) pool = pool.filter((q) => opts.topics.includes(q.topic));
    if (opts.difficulties?.length) pool = pool.filter((q) => opts.difficulties.includes(q.difficulty));
    if (opts.types?.length) pool = pool.filter((q) => opts.types.includes(q.type));
    if (opts.source === 'unseen') pool = pool.filter((q) => !stats[q.id]?.seen);
    else if (opts.source === 'missed') pool = pool.filter((q) => stats[q.id]?.lastCorrect === false);
    else if (opts.source === 'saved') pool = pool.filter((q) => saved.has(q.id));
  }

  let ids = pool.map((q) => q.id);
  const shuffleQs = opts.shuffleQuestions ?? !ordered;
  if (shuffleQs) ids = shuffle(ids);
  if (opts.count && opts.count < ids.length) ids = ids.slice(0, opts.count);

  const shuffleChoices = mode === 'exam' ? false : (opts.shuffleChoices ?? (settings.shuffleChoices && exam.shuffleChoices !== false));
  const choiceOrder = {};
  for (const id of ids) {
    const q = exam.byId.get(id);
    if (!q.options) continue;
    const idx = q.options.map((_, i) => i);
    // never shuffle True/False or "all/none of the above" style lists
    const fixed = q.type === 'truefalse' || q.options.some((o) => /\b(all|none|both|neither) of (the|these)\b|\bA and B\b/i.test(o.text));
    choiceOrder[id] = shuffleChoices && !fixed ? shuffle(idx) : idx;
  }

  let timeLimitMin = opts.timeLimitMin;
  if (timeLimitMin === undefined) timeLimitMin = mode === 'exam' ? exam.timeLimit : null;

  return {
    id: uid(),
    examId: exam.id,
    examTitle: exam.title,
    mode,
    label: opts.label || m.label,
    feedback: opts.feedback || (mode === 'exam' ? 'end' : m.feedback === 'instant' ? settings.feedback : m.feedback),
    questionIds: ids,
    choiceOrder,
    answers: {},
    checked: {},
    hintsUsed: {},
    flags: {},
    struck: {},
    times: {},
    current: 0,
    startedAt: Date.now(),
    elapsedMs: 0,
    timeLimitSec: timeLimitMin ? Math.round(timeLimitMin * 60) : null,
    paused: false,
    canPause: mode !== 'exam',
    opts: { ...opts },
  };
}

export function gradeSession(exam, session) {
  const results = {};
  let earned = 0, total = 0, correct = 0, answered = 0;
  for (const id of session.questionIds) {
    const q = exam.byId.get(id);
    if (!q) continue;
    const value = session.answers[id];
    const ok = gradeQuestion(q, value);
    const pts = q.points || 1;
    total += pts;
    if (ok) { earned += pts; correct++; }
    if (isAnswered(q, value)) answered++;
    results[id] = { correct: ok, answered: isAnswered(q, value), points: pts };
  }
  return {
    results,
    score: { earned, total, correct, answered, count: session.questionIds.length, pct: total ? Math.round((earned / total) * 1000) / 10 : 0 },
  };
}

// Update a single question's spaced-repetition record
export function recordAnswer(stats, qid, correct, now = Date.now()) {
  const s = { ...qStat(stats, qid) };
  s.seen += 1;
  s.last = now;
  s.lastCorrect = correct;
  if (correct) { s.right += 1; s.streak += 1; s.box = Math.min(5, Math.max(1, s.box + 1)); }
  else { s.wrong += 1; s.streak = 0; s.box = 1; }
  s.due = now + BOX_INTERVAL[s.box];
  stats[qid] = s;
  return s;
}

// Called once when a session is submitted. Returns the saved attempt.
export function finishSession(exam, session) {
  const { results, score } = gradeSession(exam, session);
  const stats = store.getStats(exam.id);
  const now = Date.now();
  for (const id of session.questionIds) {
    const r = results[id];
    // instant-feedback questions were already recorded when checked
    if (r.answered && !session.checked[id]) recordAnswer(stats, id, r.correct, now);
  }
  store.saveStats(exam.id, stats);

  const attempt = {
    id: session.id,
    examId: exam.id,
    mode: session.mode,
    label: session.label,
    feedback: session.feedback,
    startedAt: session.startedAt,
    finishedAt: now,
    durationMs: session.elapsedMs,
    timeLimitSec: session.timeLimitSec,
    timedOut: !!session.timedOut,
    questionIds: session.questionIds,
    choiceOrder: session.choiceOrder,
    answers: session.answers,
    flags: session.flags,
    times: session.times,
    hintsUsed: session.hintsUsed,
    opts: session.opts,
    results,
    score,
  };
  store.addAttempt(exam.id, attempt);
  store.logActivity(0, Object.values(results).filter((r) => r.answered).length - Object.keys(session.checked).length);
  store.clearSession();
  return attempt;
}

// ---------- analytics ----------
export function topicMastery(exam, stats) {
  const out = exam.topics.map((t) => ({ name: t.name, count: t.count, seen: 0, right: 0, wrong: 0, mastery: 0, due: 0 }));
  const by = new Map(out.map((t) => [t.name, t]));
  const now = Date.now();
  for (const q of exam.questions) {
    const t = by.get(q.topic);
    if (!t) continue;
    const s = qStat(stats, q.id);
    if (s.seen) t.seen++;
    t.right += s.right;
    t.wrong += s.wrong;
    t.mastery += s.box / 5;
    if (isDue(s, now)) t.due++;
  }
  for (const t of out) {
    t.mastery = t.count ? t.mastery / t.count : 0;
    t.accuracy = t.right + t.wrong ? t.right / (t.right + t.wrong) : null;
  }
  return out;
}

// A 0–100 estimate combining coverage, mastery and recent full-exam performance.
export function readiness(exam, stats, attempts) {
  const qs = exam.questions;
  if (!qs.length) return { score: 0, label: 'Not started', parts: {} };
  let mastery = 0, seen = 0;
  for (const q of qs) { const s = qStat(stats, q.id); mastery += s.box / 5; if (s.seen) seen++; }
  mastery /= qs.length;
  const coverage = seen / qs.length;
  const examLike = attempts.filter((a) => (a.mode === 'exam' || a.mode === 'custom' || a.mode === 'bank') && a.score.count >= 5).slice(-3);
  const recent = examLike.length ? examLike.reduce((s, a) => s + a.score.pct, 0) / examLike.length / 100 : null;
  let score = recent == null ? mastery * 0.8 + coverage * 0.2 : mastery * 0.5 + recent * 0.35 + coverage * 0.15;
  score = Math.round(score * 100);
  const label = !seen ? 'Not started' : score >= 85 ? 'Ready' : score >= 65 ? 'Almost there' : score >= 40 ? 'Getting there' : 'Just starting';
  return { score, label, parts: { mastery, coverage, recent } };
}

export function missedRanking(exam, stats, limit = 10) {
  return exam.questions
    .map((q) => ({ q, s: qStat(stats, q.id) }))
    .filter((x) => x.s.wrong > 0)
    .sort((a, b) => (b.s.wrong / b.s.seen) - (a.s.wrong / a.s.seen) || b.s.wrong - a.s.wrong)
    .slice(0, limit);
}

export function streakDays(activity) {
  let n = 0;
  const d = new Date();
  const key = (x) => x.toLocaleDateString('en-CA');
  if (!activity[key(d)]) d.setDate(d.getDate() - 1); // today not studied yet: count from yesterday
  while (activity[key(d)]) { n++; d.setDate(d.getDate() - 1); }
  return n;
}

export function fmtDuration(ms, { short = false } = {}) {
  const s = Math.max(0, Math.round(ms / 1000));
  const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), sec = s % 60;
  if (short) return h ? `${h}h ${m}m` : m ? `${m}m ${sec}s` : `${sec}s`;
  const pad = (x) => String(x).padStart(2, '0');
  return h ? `${h}:${pad(m)}:${pad(sec)}` : `${m}:${pad(sec)}`;
}

export function fmtDate(ts) {
  const d = new Date(ts);
  const today = new Date();
  const sameDay = d.toDateString() === today.toDateString();
  const y = new Date(today); y.setDate(today.getDate() - 1);
  const time = d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  if (sameDay) return `Today, ${time}`;
  if (d.toDateString() === y.toDateString()) return `Yesterday, ${time}`;
  return d.toLocaleDateString([], { month: 'short', day: 'numeric' }) + `, ${time}`;
}
