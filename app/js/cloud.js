// Student sign-in and saving progress to the student's account (Firebase).
//
// The site still works from localStorage. When sign-in is on, this module:
//  - signs students in with Google, allowing only the school's email domain
//  - on sign-in, copies the student's saved progress down and merges it with this device
//  - copies changes back up, a few times a minute at most, to stay inside the free quota
//  - writes a small summary per exam that the instructor dashboard reads
//
// Firestore layout (see firestore.rules):
//   users/{uid}                     name, email, settings, lastSeen
//   users/{uid}/exams/{examId}      the raw progress for one exam (attempts, stats, saved, notes, assignments)
//   users/{uid}/summaries/{examId}  small summary for the instructor dashboard
//   users/{uid}/code/{examId}       assignment code for one exam
import config from '../config.js';
import * as store from './store.js';
import { getExam, getManifest } from './data.js';
import { readiness, topicMastery } from './engine.js';

const fbc = config.firebase || {};
export const enabled = !!(fbc.apiKey && fbc.projectId);
export const domain = String(config.allowedEmailDomain || '').replace(/^@/, '').toLowerCase();

const EXAM_KEY = /^(attempts|qstats|saved|notes|asg):(.+)$/;
const CODE_KEY = /^code:([^:]+):(.+)$/;
const SOON_MS = 4000;        // after finishing a quiz or running tests
const LATER_MS = 90 * 1000;  // everything else (answers, typing)

let fb = null;               // loaded Firebase modules + instances
let user = null;
let instructor = null;       // null = unknown, true/false once checked
let authError = '';
let readyResolve;
const ready = new Promise((r) => (readyResolve = r));
const dirtyExams = new Set();
const dirtyCode = new Set();
let dirtyUser = false;
let timer = null;
let timerAt = 0;
let flushing = null;
let lastSynced = 0;
let syncError = '';

export const whenReady = () => ready;
export const currentUser = () => user;
export const isInstructor = () => instructor === true;
export const lastError = () => authError;
export const syncState = () => ({ lastSynced, pending: dirtyExams.size + dirtyCode.size + (dirtyUser ? 1 : 0), error: syncError });
const emit = () => window.dispatchEvent(new CustomEvent('qp:auth'));
const emitSync = () => window.dispatchEvent(new CustomEvent('qp:sync'));

export function allowedEmail(email) {
  return !!email && (!domain || String(email).toLowerCase().endsWith('@' + domain));
}

async function load() {
  if (fb) return fb;
  const [app, auth, fs] = await Promise.all([
    import('../vendor/firebase/firebase-app.js'),
    import('../vendor/firebase/firebase-auth.js'),
    import('../vendor/firebase/firebase-firestore-lite.js'),
  ]);
  const a = app.initializeApp({ apiKey: fbc.apiKey, authDomain: fbc.authDomain, projectId: fbc.projectId, appId: fbc.appId });
  fb = { ...auth, ...fs, auth: auth.getAuth(a), db: fs.getFirestore(a) };
  return fb;
}

// ---------------------------------------------------------------- auth
export async function init() {
  if (!enabled) { readyResolve(); return; }
  try {
    await load();
  } catch (e) {
    console.error(e);
    authError = "Couldn't reach the sign-in service. Check your internet connection and reload the page.";
    readyResolve();
    return;
  }
  let first = true;
  fb.onAuthStateChanged(fb.auth, async (u) => {
    if (u && !(allowedEmail(u.email) && u.emailVerified)) {
      authError = `Please sign in with your ${config.schoolName || ''} account (an email ending in @${domain}). You chose ${u.email || 'a different account'}.`.replace('  ', ' ');
      await fb.signOut(fb.auth).catch(() => {});
      return;
    }
    const prev = user;
    user = u || null;
    instructor = null;
    if (user) {
      authError = '';
      try { await afterSignIn(user); } catch (e) { console.error(e); syncError = 'Your saved progress could not be loaded. It will retry automatically.'; }
      checkInstructor();
    } else if (prev) {
      wipeLocal();
    }
    if (first) { first = false; readyResolve(); }
    emit();
  });
  window.addEventListener('qp:changed', (e) => markDirty(e.detail));
  window.addEventListener('qp:reset-exam', (e) => { if (user) resetExamCloud(e.detail); });
  window.addEventListener('qp:erase-all', () => { if (user) eraseAllCloud(); });
  document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'hidden') flush(); });
  window.addEventListener('pagehide', () => flush());
  window.addEventListener('online', () => schedule(SOON_MS));
}

export async function signIn() {
  await load();
  authError = '';
  const p = new fb.GoogleAuthProvider();
  // Shows only school accounts in Google's account chooser (the check above still applies)
  p.setCustomParameters({ hd: domain || '*', prompt: 'select_account' });
  try {
    await fb.signInWithPopup(fb.auth, p);
  } catch (e) {
    if (e?.code === 'auth/popup-blocked' || e?.code === 'auth/operation-not-supported-in-this-environment') {
      await fb.signInWithRedirect(fb.auth, p);
      return;
    }
    if (e?.code === 'auth/popup-closed-by-user' || e?.code === 'auth/cancelled-popup-request') return;
    if (e?.code === 'auth/unauthorized-domain') authError = 'This website address is not on the sign-in allow list yet. (Instructor: add it under Firebase → Authentication → Settings → Authorized domains.)';
    else authError = 'Sign-in did not work: ' + (e?.message || e);
    emit();
  }
}

export async function signOut() {
  if (!fb || !user) return;
  await flush().catch(() => {});
  await fb.signOut(fb.auth);
}

async function checkInstructor() {
  try {
    await fb.getDoc(fb.doc(fb.db, 'instructors', user.email.toLowerCase()));
    instructor = true;
  } catch {
    instructor = false;
  }
  emit();
}

// ---------------------------------------------------------------- local data ownership
// On a shared computer, the next student must not see (or upload) the last one's progress.
function wipeLocal() {
  store.quietly(() => {
    for (const k of store.allKeys()) if (k !== 'settings') store.removeRaw(k);
    // keep display preferences, but the class choice belongs to the student
    store.saveSettings({ subjects: null, subjectsSeen: null });
  });
  dirtyExams.clear(); dirtyCode.clear(); dirtyUser = false;
}

const syncMetaKey = (examId) => `sync:${examId}`;
const getSyncMeta = (examId) => store.get(syncMetaKey(examId), {});
const setSyncMeta = (examId, patch) => store.quietly(() => store.set(syncMetaKey(examId), { ...getSyncMeta(examId), ...patch }));

function markDirty(key) {
  if (!user || !key) return;
  let m;
  if ((m = EXAM_KEY.exec(key))) {
    dirtyExams.add(m[2]);
    schedule(m[1] === 'attempts' || m[1] === 'asg' ? SOON_MS : LATER_MS);
  } else if ((m = CODE_KEY.exec(key))) {
    dirtyCode.add(m[1]);
    const at = getSyncMeta(m[1]).codeAt || {};
    at[m[2]] = Date.now();
    setSyncMeta(m[1], { codeAt: at });
    schedule(LATER_MS);
  } else if (key === 'settings') {
    dirtyUser = true;
    schedule(LATER_MS);
  }
  emitSync();
}

function schedule(ms) {
  const at = Date.now() + ms;
  if (timer && timerAt <= at) return;
  clearTimeout(timer);
  timerAt = at;
  timer = setTimeout(() => { timer = null; flush(); }, ms);
}

// ---------------------------------------------------------------- pull
async function afterSignIn(u) {
  const owner = store.getRaw('owner');
  if (owner && owner !== u.uid) wipeLocal();
  store.quietly(() => store.setRaw('owner', u.uid));
  const base = fb.doc(fb.db, 'users', u.uid);
  const [userSnap, examSnaps, codeSnaps] = await Promise.all([
    fb.getDoc(base),
    fb.getDocs(fb.collection(base, 'exams')),
    fb.getDocs(fb.collection(base, 'code')),
  ]);
  // settings: a new device takes the saved class choice
  const cloudSettings = userSnap.exists() ? userSnap.data().settings : null;
  if (cloudSettings) {
    const local = store.getSettings();
    if (local.subjects == null && cloudSettings.subjects) {
      store.quietly(() => store.saveSettings({ subjects: cloudSettings.subjects, subjectsSeen: cloudSettings.subjectsSeen || null }));
    }
  }
  // progress
  for (const snap of examSnaps.docs) {
    const d = snap.data();
    const examId = snap.id;
    const meta = getSyncMeta(examId);
    if (d.resetAt && d.resetAt > (meta.at || 0)) clearLocalExam(examId);
    const data = {};
    for (const [k, v] of Object.entries(d.keys || {})) if (typeof v === 'string') data[`${k}:${examId}`] = v;
    store.quietly(() => store.importAll({ app: 'quiz-platform', data }));
    setSyncMeta(examId, { at: Date.now(), resetAt: d.resetAt || 0 });
  }
  // code: newest copy wins
  for (const snap of codeSnaps.docs) {
    const d = snap.data();
    const examId = snap.id;
    const meta = getSyncMeta(examId);
    if (d.resetAt && d.resetAt > (meta.at || 0)) clearLocalExam(examId);
    const localAt = { ...(meta.codeAt || {}) };
    for (const [slug, code] of Object.entries(d.codes || {})) {
      const cloudAt = d.codeAt?.[slug] || 0;
      const have = store.getCode(examId, slug);
      if (have == null || cloudAt > (localAt[slug] || 0)) {
        store.quietly(() => store.saveCode(examId, slug, code));
        localAt[slug] = cloudAt;
      }
    }
    setSyncMeta(examId, { at: Date.now(), codeAt: localAt });
  }
  lastSynced = Date.now();
  syncError = '';
  // upload anything this device had that the account didn't (and refresh the summaries)
  for (const k of store.allKeys()) {
    let m;
    if ((m = EXAM_KEY.exec(k))) dirtyExams.add(m[2]);
    else if ((m = CODE_KEY.exec(k))) dirtyCode.add(m[1]);
  }
  dirtyUser = true;
  schedule(SOON_MS);
  emitSync();
}

function clearLocalExam(examId) {
  store.quietly(() => {
    for (const k of store.allKeys()) {
      const m = EXAM_KEY.exec(k) || CODE_KEY.exec(k);
      if (m && (m[2] === examId || m[1] === examId)) store.removeRaw(k);
    }
  });
}

// ---------------------------------------------------------------- push
const KINDS = ['attempts', 'qstats', 'saved', 'notes', 'asg'];
const MAX_DOC = 900 * 1024; // Firestore's limit is 1 MiB per document

function examPayload(examId) {
  const keys = {};
  for (const kind of KINDS) {
    const v = store.getRaw(`${kind}:${examId}`);
    if (v != null) keys[kind] = v;
  }
  // keep the document under the size limit: drop answer details from older attempts first
  if (keys.attempts && keys.attempts.length > MAX_DOC / 2) {
    let list = JSON.parse(keys.attempts);
    list = list.map((a, i) => (i < list.length - 30 ? { ...a, answers: undefined, times: undefined } : a));
    keys.attempts = JSON.stringify(list);
    while (keys.attempts.length > MAX_DOC / 2 && list.length > 10) { list = list.slice(Math.ceil(list.length / 4)); keys.attempts = JSON.stringify(list); }
  }
  return keys;
}

async function summaryFor(examId) {
  let exam = null;
  try { exam = await getExam(examId); } catch {}
  const stats = store.get(`qstats:${examId}`, {});
  const attempts = store.get(`attempts:${examId}`, []);
  const asg = store.get(`asg:${examId}`, {});
  let right = 0, wrong = 0, seen = 0, lastAnswer = 0;
  for (const s of Object.values(stats)) { right += s.right || 0; wrong += s.wrong || 0; if (s.seen) seen++; lastAnswer = Math.max(lastAnswer, s.last || 0); }
  const real = attempts.filter((a) => a.mode === 'exam');
  const out = {
    examId,
    examTitle: exam?.title || examId,
    course: exam?.course || '',
    totalQuestions: exam?.questions.length || 0,
    seen, right, wrong,
    accuracy: right + wrong ? right / (right + wrong) : null,
    attempts: attempts.length,
    realExamBest: real.length ? Math.max(...real.map((a) => a.score.pct)) : null,
    realExamLast: real.length ? real[real.length - 1].score.pct : null,
    lastQuiz: attempts.length ? attempts[attempts.length - 1].finishedAt || attempts[attempts.length - 1].startedAt || 0 : 0,
    lastAnswer,
    asg: Object.fromEntries(Object.entries(asg).map(([slug, a]) => [slug, { best: a.best || 0, total: a.total || 0, done: !!a.done, attempts: a.attempts || 0, hints: a.hints || 0, updated: a.updated || 0 }])),
    asgDone: Object.values(asg).filter((a) => a.done).length,
  };
  if (exam) {
    const r = readiness(exam, stats, attempts);
    out.readiness = r.score;
    out.readinessLabel = r.label;
    out.topics = topicMastery(exam, stats).map((t) => ({ name: t.name, count: t.count, seen: t.seen, right: t.right, wrong: t.wrong, mastery: Math.round(t.mastery * 1000) / 1000 }));
  }
  out.lastActive = Math.max(out.lastQuiz, out.lastAnswer, ...Object.values(out.asg).map((a) => a.updated));
  return out;
}

const who = () => ({ uid: user.uid, email: user.email.toLowerCase(), name: user.displayName || user.email.split('@')[0] });

export function flush() {
  if (!user || !fb) return Promise.resolve();
  if (flushing) return flushing.then(() => (dirtyExams.size || dirtyCode.size || dirtyUser ? flush() : undefined));
  if (!navigator.onLine) { schedule(LATER_MS); return Promise.resolve(); }
  clearTimeout(timer); timer = null;
  const exams = [...dirtyExams], codes = [...dirtyCode], doUser = dirtyUser;
  dirtyExams.clear(); dirtyCode.clear(); dirtyUser = false;
  const base = fb.doc(fb.db, 'users', user.uid);
  const me = who();
  flushing = (async () => {
    try {
      const jobs = [];
      if (doUser) {
        const s = store.getSettings();
        jobs.push(fb.setDoc(base, { ...me, lastSeen: Date.now(), settings: { subjects: s.subjects ?? null, subjectsSeen: s.subjectsSeen ?? null } }, { merge: true }));
      }
      for (const examId of exams) {
        const meta = getSyncMeta(examId);
        jobs.push(fb.setDoc(fb.doc(base, 'exams', examId), { ...me, examId, keys: examPayload(examId), resetAt: meta.resetAt || 0, updatedAt: Date.now() }));
        jobs.push(summaryFor(examId).then((sum) => fb.setDoc(fb.doc(base, 'summaries', examId), { ...me, ...sum, updatedAt: Date.now() })));
      }
      for (const examId of codes) {
        const meta = getSyncMeta(examId);
        const codesNow = {};
        for (const k of store.allKeys()) { const m = CODE_KEY.exec(k); if (m && m[1] === examId) codesNow[m[2]] = store.getRaw(k); }
        jobs.push(fb.setDoc(fb.doc(base, 'code', examId), { ...me, examId, codes: codesNow, codeAt: meta.codeAt || {}, resetAt: meta.resetAt || 0, updatedAt: Date.now() }));
      }
      await Promise.all(jobs);
      for (const examId of new Set([...exams, ...codes])) setSyncMeta(examId, { at: Date.now() });
      lastSynced = Date.now();
      syncError = '';
    } catch (e) {
      console.error('Sync failed', e);
      exams.forEach((x) => dirtyExams.add(x)); codes.forEach((x) => dirtyCode.add(x)); if (doUser) dirtyUser = true;
      syncError = e?.code === 'resource-exhausted'
        ? "Today's free saving limit was reached. Your progress is safe on this device and will be saved tomorrow."
        : e?.code === 'permission-denied'
        ? 'Your account is not allowed to save progress. Sign out and sign in with your school account.'
        : 'Saving to your account failed. It will try again automatically.';
      schedule(e?.code === 'resource-exhausted' ? 60 * 60 * 1000 : LATER_MS);
    } finally {
      flushing = null;
      emitSync();
    }
  })();
  return flushing;
}

async function resetExamCloud(examId) {
  const now = Date.now();
  setSyncMeta(examId, { resetAt: now, codeAt: {} });
  dirtyExams.add(examId); dirtyCode.add(examId);
  await flush();
}

async function eraseAllCloud() {
  store.quietly(() => store.setRaw('owner', user.uid));
  try {
    const manifest = await getManifest();
    for (const e of manifest.exams) { setSyncMeta(e.id, { resetAt: Date.now(), codeAt: {} }); dirtyExams.add(e.id); dirtyCode.add(e.id); }
    dirtyUser = true;
    await flush();
  } catch (e) { console.error(e); }
}

// ---------------------------------------------------------------- instructor reads
export async function classSummaries(examId) {
  await load();
  const snap = await fb.getDocs(fb.collectionGroup(fb.db, 'summaries'));
  return snap.docs.map((d) => d.data()).filter((d) => d.examId === examId);
}
export async function studentCode(uid, examId) {
  await load();
  const snap = await fb.getDoc(fb.doc(fb.db, 'users', uid, 'code', examId));
  return snap.exists() ? snap.data() : null;
}
