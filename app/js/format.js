// One way to show dates, times and numbers, on every screen (rules: docs/DESIGN.md, "Dates, times
// and numbers"). Pure: no page, no database. Dates show in the viewer's own language and time zone.
// A date-only value ('2026-11-17') is read as noon that day, so it never slips a day across zones.
// The year shows only when it isn't this year.

const toDate = (x) => (typeof x === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(x) ? new Date(x + 'T12:00:00') : new Date(x));
const valid = (d) => !Number.isNaN(d.getTime());
const withYear = (d, opts, now) => (d.getFullYear() === now.getFullYear() ? opts : { ...opts, year: 'numeric' });
const show = (x, opts, now = new Date()) => {
  if (x === null || x === undefined || x === '') return '';
  const d = toDate(x);
  return valid(d) ? d.toLocaleString(undefined, withYear(d, opts, now)) : '';
};

/** "Nov 17" */
export const day = (x, now) => show(x, { month: 'short', day: 'numeric' }, now);
/** "Tue, Nov 17" */
export const weekday = (x, now) => show(x, { weekday: 'short', month: 'short', day: 'numeric' }, now);
/** "Tuesday, Nov 17" */
export const longDay = (x, now) => show(x, { weekday: 'long', month: 'short', day: 'numeric' }, now);
/** "Tue, Nov 17, 5:02 PM" */
export const dateTime = (x, now) => show(x, { weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }, now);

/** "5:02 PM" */
export function time(x) {
  if (x === null || x === undefined || x === '') return '';
  const d = toDate(x);
  return valid(d) ? d.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' }) : '';
}
/** "5:02:07 PM", for live clocks */
export function clock(x) {
  if (x === null || x === undefined || x === '') return '';
  const d = toDate(x);
  return valid(d) ? d.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit', second: '2-digit' }) : '';
}

/** "2026-11-17" in the viewer's time zone: for keys and file names, never for reading */
export function dayKey(x = Date.now()) {
  const d = toDate(x);
  const p = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

/** "1,234"; "–" when there is no number */
export const number = (n) => (n === null || n === undefined || Number.isNaN(Number(n)) ? '–' : Number(n).toLocaleString());
