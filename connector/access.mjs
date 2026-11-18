// "Request access" goes through the connector, not straight to the database, so it can be limited:
// a few requests per network and per email each day, and a cap for the whole site. The database
// rules no longer let visitors write requests at all, so a script can't go around these limits.
//   POST /request  { step: 1, name, email, school, role, course, website }  -> { id }
//   POST /request  { step: 2, id, details }                                  -> { ok }
// Network addresses and emails are never stored: only a keyed hash, inside a counter for one day.
import { checkRequest, cleanDetails } from '../app/js/requests.js';

export const PER_DAY = { network: 3, email: 2, site: 40 };
const DETAILS_WINDOW = 30 * 60000;
const CORS = { 'access-control-allow-origin': '*', 'access-control-allow-methods': 'POST, OPTIONS', 'access-control-allow-headers': 'content-type' };
const json = (body, status = 200) => new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json', 'cache-control': 'no-store', ...CORS } });
const TOO_MANY = 'Too many requests have come from here today. Please try again tomorrow.';

async function hashOf(secret, value) {
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const sig = new Uint8Array(await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(value)));
  return Array.from(sig.slice(0, 12), (b) => b.toString(16).padStart(2, '0')).join('');
}
// IPv6 users each get a whole /64 block, so count the network, not the single address.
export const networkOf = (ip) => (String(ip || '').includes(':') ? String(ip).toLowerCase().split(':').slice(0, 4).join(':') : String(ip || 'unknown'));
const newId = () => {
  const abc = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  return Array.from(crypto.getRandomValues(new Uint8Array(20)), (n) => abc[n % abc.length]).join('');
};

// db: { getWithRev, set } (connector/firestore.mjs). secret: keys the hashes (never sent anywhere).
export function createAccessHandler(db, { secret, now = () => Date.now(), perDay = PER_DAY } = {}) {
  if (!secret) throw new Error('The request limiter needs a secret.');

  // Counts one more against each counter, unless any of them is already full. Two writes landing
  // at once: the later one sees the changed version, reads again and recounts.
  async function take(keys) {
    for (let attempt = 0; attempt < 4; attempt++) {
      const cur = await Promise.all(keys.map(async ([path, max]) => ({ path, max, ...(await db.getWithRev(path)) })));
      if (cur.some((c) => (c.data?.n || 0) >= c.max)) return false;
      try {
        for (const c of cur) await db.set(c.path, { n: (c.data?.n || 0) + 1, at: now() }, c.rev ? { ifRev: c.rev } : { ifMissing: true });
        return true;
      } catch (e) { if (e.code !== 'conflict') throw e; }
    }
    return false;
  }

  async function step1(body, ip) {
    const { error, field, data } = checkRequest(body);
    if (error) return json({ error, field }, 400);
    if (body.website) return json({ id: newId() }); // only bots fill the hidden field: pretend it worked
    const day = new Date(now()).toISOString().slice(0, 10);
    const ok = await take([
      [`accessLimits/net-${day}-${await hashOf(secret, networkOf(ip))}`, perDay.network],
      [`accessLimits/email-${day}-${await hashOf(secret, data.email)}`, perDay.email],
      [`accessLimits/site-${day}`, perDay.site], // last: a clash on the others never uses up the site's allowance
    ]);
    if (!ok) return json({ error: TOO_MANY, limit: true }, 429);
    const id = newId();
    await db.set(`accessRequests/${id}`, { ...data, status: 'new', v: 1, createdAt: now() }, { ifMissing: true });
    return json({ id });
  }

  async function step2(body) {
    if (!/^[A-Za-z0-9]{20}$/.test(body.id || '')) return json({ error: 'That request was not found.' }, 404);
    const { data, rev } = await db.getWithRev(`accessRequests/${body.id}`);
    if (!data) return json({ ok: true }); // the bot path above has no saved request; nothing to add
    if (data.details) return json({ error: 'The details for this request were already sent.' }, 409);
    if (now() - data.createdAt > DETAILS_WINDOW) return json({ error: 'This request is too old to add details. Email us instead.' }, 410);
    const details = cleanDetails(body.details || {});
    if (Object.keys(details).length) await db.set(`accessRequests/${body.id}`, { ...data, details }, { ifRev: rev });
    return json({ ok: true });
  }

  return async (request) => {
    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: CORS });
    if (request.method !== 'POST') return json({ error: 'Send a POST.' }, 405);
    if (Number(request.headers.get('content-length')) > 8000) return json({ error: 'That is too long.' }, 413);
    const text = await request.text();
    if (text.length > 8000) return json({ error: 'That is too long.' }, 413);
    let body;
    try { body = JSON.parse(text); } catch { return json({ error: 'That was not understood.' }, 400); }
    if (!body || typeof body !== 'object') return json({ error: 'That was not understood.' }, 400);
    try {
      if (body.step === 1) return await step1(body, request.headers.get('cf-connecting-ip'));
      if (body.step === 2) return await step2(body);
      return json({ error: 'That was not understood.' }, 400);
    } catch (e) {
      return json({ error: e.code === 'quota' ? 'Cramming is very busy today. Please try again tomorrow.' : 'Something went wrong. Please try again.' }, 503);
    }
  };
}
