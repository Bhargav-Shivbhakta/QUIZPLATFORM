// Everything a student does is saved in their own browser (localStorage).
// Nothing is ever sent anywhere.

const PREFIX = 'qp1:';
let memoryFallback = {};
let storageOk = true;
try {
  const k = PREFIX + '__test';
  localStorage.setItem(k, '1');
  localStorage.removeItem(k);
} catch {
  storageOk = false;
}

export const storageAvailable = () => storageOk;

function rawGet(key) {
  try { return storageOk ? localStorage.getItem(PREFIX + key) : memoryFallback[key] ?? null; } catch { return null; }
}
function rawSet(key, value) {
  try {
    if (storageOk) localStorage.setItem(PREFIX + key, value);
    else memoryFallback[key] = value;
    return true;
  } catch (e) {
    console.warn('Could not save', key, e);
    window.dispatchEvent(new CustomEvent('qp:storage-full'));
    return false;
  }
}
function rawRemove(key) {
  try { if (storageOk) localStorage.removeItem(PREFIX + key); else delete memoryFallback[key]; } catch {}
}

export function get(key, fallback) {
  const v = rawGet(key);
  if (v == null) return fallback;
  try { return JSON.parse(v); } catch { return fallback; }
}
export function set(key, value) { return rawSet(key, JSON.stringify(value)); }
export function remove(key) { rawRemove(key); }

// ---------- settings ----------
const DEFAULT_SETTINGS = {
  theme: 'system',        // system | light | dark
  textSize: 'm',          // s | m | l
  feedback: 'instant',    // instant | end   (practice default)
  shuffleChoices: true,
  confirmSubmit: true,
  showTimer: true,
  subjects: null,         // courses the student picked; null = not chosen yet
  subjectsSeen: null,     // courses that existed when they last chose (to flag new ones)
  editorFont: 'm',        // code editor text size
};
export function getSettings() { return { ...DEFAULT_SETTINGS, ...get('settings', {}) }; }
export function saveSettings(patch) { const s = { ...getSettings(), ...patch }; set('settings', s); return s; }

// ---------- per-exam data ----------
export const attemptsKey = (examId) => `attempts:${examId}`;
export const statsKey = (examId) => `qstats:${examId}`;
export const savedKey = (examId) => `saved:${examId}`;
export const notesKey = (examId) => `notes:${examId}`;

export function getAttempts(examId) { return get(attemptsKey(examId), []); }
export function addAttempt(examId, attempt) {
  const list = getAttempts(examId);
  list.push(attempt);
  while (list.length > 150) list.shift();
  if (!set(attemptsKey(examId), list)) {
    // storage full: drop the oldest detailed records and try again
    const slim = list.map((a, i) => (i < list.length - 30 ? { ...a, answers: undefined, times: undefined } : a));
    set(attemptsKey(examId), slim);
  }
}
export function getAttempt(examId, id) { return getAttempts(examId).find((a) => a.id === id); }

export function getStats(examId) { return get(statsKey(examId), {}); }
export function saveStats(examId, stats) { set(statsKey(examId), stats); }

export function getSaved(examId) { return get(savedKey(examId), []); }
export function toggleSaved(examId, qid) {
  const s = new Set(getSaved(examId));
  if (s.has(qid)) s.delete(qid); else s.add(qid);
  set(savedKey(examId), [...s]);
  return s.has(qid);
}

export function getNotes(examId) { return get(notesKey(examId), {}); }
export function saveNote(examId, qid, text) {
  const n = getNotes(examId);
  if (text && text.trim()) n[qid] = text; else delete n[qid];
  set(notesKey(examId), n);
}

// ---------- programming assignments ----------
export const asgKey = (examId) => `asg:${examId}`;
export const codeKey = (examId, slug) => `code:${examId}:${slug}`;
export function getAsgProgress(examId) { return get(asgKey(examId), {}); }
export function saveAsgProgress(examId, slug, patch) {
  const all = getAsgProgress(examId);
  const cur = all[slug] || { attempts: 0, best: 0, total: 0, done: false, hints: 0 };
  all[slug] = { ...cur, ...patch, updated: Date.now() };
  set(asgKey(examId), all);
  return all[slug];
}
export function recordTestRun(examId, slug, passed, total) {
  const cur = getAsgProgress(examId)[slug] || {};
  const done = !!cur.done || (total > 0 && passed === total);
  return saveAsgProgress(examId, slug, { attempts: (cur.attempts || 0) + 1, last: passed, total, best: Math.max(cur.best || 0, passed), done, doneAt: !cur.done && done ? Date.now() : cur.doneAt });
}
export function getCode(examId, slug) { const v = rawGet(codeKey(examId, slug)); return v == null ? null : v; }
export function saveCode(examId, slug, code) { return rawSet(codeKey(examId, slug), code); }
export function clearCode(examId, slug) { rawRemove(codeKey(examId, slug)); }

// ---------- in-progress session ----------
export function getSession() { return get('session', null); }
export function saveSession(s) { set('session', s); }
export function clearSession() { remove('session'); }

// ---------- activity log (for streaks / study time) ----------
export function logActivity(ms, answered) {
  const day = new Date().toLocaleDateString('en-CA');
  const log = get('activity', {});
  const d = log[day] || { ms: 0, answered: 0 };
  d.ms += Math.max(0, ms | 0);
  d.answered += answered | 0;
  log[day] = d;
  set('activity', log);
}
export function getActivity() { return get('activity', {}); }

// ---------- export / import ----------
export function exportAll() {
  const data = {};
  if (storageOk) {
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && k.startsWith(PREFIX)) data[k.slice(PREFIX.length)] = localStorage.getItem(k);
    }
  } else Object.assign(data, memoryFallback);
  return { app: 'quiz-platform', version: 1, exportedAt: new Date().toISOString(), data };
}

export function importAll(payload) {
  if (!payload || payload.app !== 'quiz-platform' || typeof payload.data !== 'object') {
    throw new Error("This file isn't a progress file from this site.");
  }
  let merged = 0;
  for (const [key, raw] of Object.entries(payload.data)) {
    if (key === 'session') continue;
    if (key.startsWith('code:')) {
      if (rawGet(key) == null) { rawSet(key, raw); merged++; }
      continue;
    }
    let incoming;
    try { incoming = JSON.parse(raw); } catch { continue; }
    const current = get(key, undefined);
    let next = incoming;
    if (current !== undefined) {
      if (key.startsWith('attempts:')) {
        const byId = new Map(current.map((a) => [a.id, a]));
        for (const a of incoming) if (!byId.has(a.id)) byId.set(a.id, a);
        next = [...byId.values()].sort((a, b) => a.startedAt - b.startedAt);
      } else if (key.startsWith('qstats:')) {
        next = { ...current };
        for (const [qid, s] of Object.entries(incoming)) {
          if (!next[qid] || (s.last || 0) > (next[qid].last || 0)) next[qid] = s;
        }
      } else if (key.startsWith('saved:')) {
        next = [...new Set([...current, ...incoming])];
      } else if (key === 'activity') {
        next = { ...current };
        for (const [day, d] of Object.entries(incoming)) {
          const c = next[day];
          next[day] = c ? { ms: Math.max(c.ms, d.ms), answered: Math.max(c.answered, d.answered) } : d;
        }
      } else if (key.startsWith('asg:')) {
        next = { ...current };
        for (const [slug, a] of Object.entries(incoming)) {
          const c = next[slug];
          next[slug] = !c ? a : { ...c, best: Math.max(c.best || 0, a.best || 0), done: !!(c.done || a.done), attempts: Math.max(c.attempts || 0, a.attempts || 0), hints: Math.max(c.hints || 0, a.hints || 0) };
        }
      } else if (key.startsWith('code:')) {
        next = current; // keep the code already on this device
      } else if (key.startsWith('notes:')) {
        next = { ...incoming, ...current };
      } else if (key === 'settings') {
        next = current;
      }
    }
    set(key, next);
    merged++;
  }
  return merged;
}

export function resetExam(examId) {
  for (const k of [attemptsKey(examId), statsKey(examId), savedKey(examId), notesKey(examId), asgKey(examId)]) remove(k);
  if (storageOk) {
    const codeKeys = [];
    for (let i = 0; i < localStorage.length; i++) { const k = localStorage.key(i); if (k && k.startsWith(PREFIX + `code:${examId}:`)) codeKeys.push(k); }
    codeKeys.forEach((k) => localStorage.removeItem(k));
  }
  const s = getSession();
  if (s && s.examId === examId) clearSession();
}

export function resetEverything() {
  if (storageOk) {
    const keys = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && k.startsWith(PREFIX)) keys.push(k);
    }
    keys.forEach((k) => localStorage.removeItem(k));
  }
  memoryFallback = {};
}

export function storageUsedKB() {
  let n = 0;
  if (!storageOk) return 0;
  for (let i = 0; i < localStorage.length; i++) {
    const k = localStorage.key(i);
    if (k && k.startsWith(PREFIX)) n += k.length + (localStorage.getItem(k) || '').length;
  }
  return Math.round((n * 2) / 1024);
}
