// What the student's Today and class pages show, worked out from plain data.
// Pure functions (no page, no database) so the rules can be tested. Used by views/st-*.js.
const DAY = 86400000;

// Midnight (local) of the day that `ms` falls on.
export function startOfDay(ms) { const d = new Date(ms); d.setHours(0, 0, 0, 0); return d.getTime(); }

// Calendar days from `now` to `at`: 0 = today, 1 = tomorrow. Negative when it has passed.
export function daysUntil(at, now = Date.now()) { return Math.round((startOfDay(at) - startOfDay(now)) / DAY); }

// Readiness always shows its number with a word (DESIGN › Word list): Solid, Getting there, Not started.
export function readinessWord(score, seen = true) {
  if (!seen) return 'Not started';
  return score >= 75 ? 'Solid' : 'Getting there';
}

// One graded item or exam date per class, merged: [{ classId, title, at, kind }] → the nearest still to
// come (or open now), or null. An exam date on a practice set is dropped when graded work of the same
// class falls on the same day, so one exam never shows twice.
export function nextExam(items, now = Date.now()) {
  const graded = items.filter((x) => x.kind !== 'date');
  const list = items.filter((x) => x.kind !== 'date' || !graded.some((g) => g.classId === x.classId && daysUntil(g.at, x.at) === 0));
  return list.filter((x) => (x.until ? x.until > now : daysUntil(x.at, now) >= 0)).sort((a, b) => a.at - b.at)[0] || null;
}

// Upcoming items in date order, without the duplicates nextExam drops: for "Coming up".
export function comingUp(items, now = Date.now(), limit = 4) {
  const graded = items.filter((x) => x.kind !== 'date');
  return items.filter((x) => x.kind !== 'date' || !graded.some((g) => g.classId === x.classId && daysUntil(g.at, x.at) === 0))
    .filter((x) => (x.until ? x.until > now : daysUntil(x.at, now) >= 0)).sort((a, b) => a.at - b.at).slice(0, limit);
}

// This week, Monday to Sunday: [{ key, letter, done, today, future }]. activity: { 'YYYY-MM-DD': { answered } }.
export function weekDays(activity, now = Date.now(), keyOf) {
  const today = startOfDay(now), dow = (new Date(today).getDay() + 6) % 7; // Monday = 0
  return ['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((letter, i) => {
    const at = today + (i - dow) * DAY, key = keyOf(at);
    return { key, letter, done: (activity?.[key]?.answered || 0) > 0, today: i === dow, future: i > dow };
  });
}

// Today's tasks across classes → what the Start button and the chips say.
// byClass: [{ classId, tasks: [{ key, minutes, href, done }] }] in the order classes should be worked on.
export function todaySummary(byClass) {
  const open = byClass.flatMap((c) => c.tasks.filter((t) => !t.done).map((t) => ({ ...t, classId: c.classId })));
  const count = (k) => open.filter((t) => t.key === k).length;
  return {
    minutes: open.reduce((n, t) => n + t.minutes, 0),
    first: open[0] || null,
    left: open.length,
    done: byClass.some((c) => c.tasks.length) && !open.length,
    kinds: { mistakes: count('mistakes'), review: count('due'), fresh: count('read') + count('practice') + count('new') },
  };
}

// The study buddy's morning hop happens once a day.
export const hopDue = (lastHopDay, todayKey) => lastHopDay !== todayKey;
