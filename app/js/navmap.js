// Where each student page sits in the navigation (DESIGN › Navigation). Pure functions, tested.
//
// Top-level places (Today, Classes, Progress, Settings) have no back link: the bar or tabs reach them.
// Every other page has exactly one way up, to the page it belongs to, shown at the top left.

// The class badge in the slim bar: the course number ("CS150" → "150", "MATH 150A" → "150A"), so two
// classes of the same subject never look the same; letters only when the course has no number.
// Classes saved before the course was set well have course "CS" and name "CS 210 Data Structures": the
// number then comes from the name.
export function badgeFor(course, name) {
  const num = (s) => String(s || '').match(/\d+[A-Za-z]?/)?.[0];
  const n = num(course) || num(name);
  if (n) return n.slice(0, 4).toUpperCase();
  return (String(course || name || '').match(/[A-Za-z]+/)?.[0] || '?').slice(0, 2).toUpperCase();
}

// The class badge in the collapsed bar: the subject over the number ("CS" over "150"), because the same
// number in two subjects (MATH 150, CS 150) must never look alike. → { subject, number, code }
// code is how the class is written in one line ("CS 150"); a part is '' when the course has none.
export function codeParts(course, name) {
  const pick = (s) => String(s || '').match(/([A-Za-z]{1,5})\s*-?\s*(\d+[A-Za-z]?)/);
  const m = pick(course) || pick(name);
  if (m) { const subject = m[1].toUpperCase(), number = m[2].slice(0, 4).toUpperCase(); return { subject, number, code: `${subject} ${number}` }; }
  const subject = (String(course || name || '').match(/[A-Za-z]+/)?.[0] || '').slice(0, 4).toUpperCase();
  return { subject, number: '', code: String(course || '').trim() };
}

// A class's full name: "CS150 · Intro to Programming", but just "CS 210 Data Structures" when the name
// already starts with the course, so nothing is said twice.
export function classTitle(c) {
  const name = String(c?.name || '').trim(), course = String(c?.course || '').trim();
  if (!course) return name;
  const flat = (x) => x.replace(/\s+/g, '').toLowerCase();
  return flat(name).startsWith(flat(course)) ? name : `${course} · ${name}`;
}

// The one way up from a page. path: the hash path ("/exam/x"); params: from the router;
// classOf(examId) → the class of a practice set or null; several: the student has more than one class;
// label(cls) → how a class is named in the link.
// → { href, label } or null
export function backFor(path, params = {}, { classOf = () => null, several = true, label = (c) => c.course || c.name, codingOnly = () => false } = {}) {
  if (['/', '', '/classes', '/progress', '/settings'].includes(path)) return null;
  const e = encodeURIComponent;
  if (/^\/class\/[^/]+$/.test(path)) return several ? { href: '#/classes', label: 'Classes' } : null;
  if (/^\/(progress|results)\//.test(path)) return { href: '#/progress', label: 'Progress' };
  if (params.classId && /^\/(study|mystudy)\//.test(path)) {
    const tab = path.startsWith('/study/') ? '?tab=notes' : '';
    return { href: `#/class/${e(params.classId)}${tab}`, label: params.className || 'Class' };
  }
  if (params.id && /^\/(exam|assignments|cards|browse|start)\//.test(path)) {
    const cls = classOf(params.id);
    // a set's own pages go back to the set; the set page goes back to the class's Practice tab
    // a coding-only set is its assignments page, so that page also goes back to the class
    if (path.startsWith('/exam/') || (path.startsWith('/assignments/') && codingOnly(params.id))) return cls ? { href: `#/class/${e(cls.id)}?tab=practice`, label: label(cls) } : { href: '#/', label: 'Today' };
    return { href: `#/exam/${e(params.id)}`, label: params.setTitle || 'Practice set' };
  }
  return { href: '#/', label: 'Today' };
}
