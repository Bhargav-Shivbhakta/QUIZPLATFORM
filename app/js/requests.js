// Request access: the choices on the form, the statuses admins track, and the rules that clean and
// check what a visitor sends. Pure (no page, no database) so it is fully tested; cloud.js saves the
// result and firestore.rules enforces the same limits.

export const ROLES = ['Professor or lecturer', 'Teaching assistant', 'Department chair or coordinator', 'High school teacher', 'Other'];
export const SIZES = ['Under 50', '50 to 150', '150 to 400', 'More than 400'];
export const WANTS = ['Practice questions', 'Study notes', 'Graded quizzes and exams', 'Programming assignments', 'Build my course with AI', 'The course tutor'];
export const USES = ['Canvas', 'Gradescope', 'zyBooks', 'Paper', 'Something else'];
export const HAS = ['Slides', 'Notes', 'Question banks', 'Past exams'];
export const STATUSES = [
  ['new', 'New'], ['contacted', 'Contacted'], ['setup', 'Set up'], ['nofit', 'Not a fit'],
];
export const LIMITS = { name: 100, email: 200, school: 150, course: 100, department: 150, contact: 200, heard: 200, notes: 1500, note: 1000 };

const clean = (s, max) => String(s ?? '').trim().replace(/\s+/g, ' ').slice(0, max);
const cleanBlock = (s, max) => String(s ?? '').trim().replace(/[ \t]+/g, ' ').replace(/\n{3,}/g, '\n\n').slice(0, max);
const EMAIL = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
const DATE = /^\d{4}-\d{2}-\d{2}$/;

// Step 1. Returns { error, field } for the first problem, or { data } ready to save.
export function checkRequest(v) {
  const data = {
    name: clean(v.name, LIMITS.name), email: clean(v.email, LIMITS.email).toLowerCase(),
    school: clean(v.school, LIMITS.school), role: v.role, course: clean(v.course, LIMITS.course),
  };
  const say = { name: 'your name', email: 'your school email', school: 'your school', course: 'your course' };
  for (const k of ['name', 'email', 'school']) if (!data[k]) return { error: `Please fill in ${say[k]}.`, field: k };
  if (data.email.length < 6 || !EMAIL.test(data.email)) return { error: 'Please check your email address.', field: 'email' };
  if (!ROLES.includes(data.role)) return { error: 'Please choose your role.', field: 'role' };
  if (!data.course) return { error: `Please fill in ${say.course}.`, field: 'course' };
  return { data };
}

// Step 2, all optional. Keeps only known answers, within the limits; drops empty ones.
export function cleanDetails(v) {
  const pick = (list, values) => [...new Set([].concat(values || []).filter((x) => list.includes(x)))];
  const d = {
    department: clean(v.department, LIMITS.department),
    start: DATE.test(v.start || '') ? v.start : '',
    firstExam: DATE.test(v.firstExam || '') ? v.firstExam : '',
    sections: Number.isInteger(Number(v.sections)) && Number(v.sections) > 0 ? Math.min(Number(v.sections), 50) : 0,
    students: SIZES.includes(v.students) ? v.students : '',
    wants: pick(WANTS, v.wants), uses: pick(USES, v.uses), has: pick(HAS, v.has),
    contact: clean(v.contact, LIMITS.contact), heard: clean(v.heard, LIMITS.heard), notes: cleanBlock(v.notes, LIMITS.notes),
  };
  return Object.fromEntries(Object.entries(d).filter(([, x]) => (Array.isArray(x) ? x.length : x)));
}

// Requests from before statuses existed count as new.
export const statusOf = (r) => (STATUSES.some(([k]) => k === r.status) ? r.status : 'new');
export const statusLabel = (k) => (STATUSES.find(([s]) => s === k) || STATUSES[0])[1];
export function countNew(list) { return list.filter((r) => statusOf(r) === 'new').length; }
