// The "Request access" sheet on the public pages, in two steps. Step 1 (who you are) is one write and
// is enough on its own. Step 2 (your course, all optional) adds the details in one more write.
import config from '../../config.js';
import * as cloud from '../cloud.js';
import { esc } from '../ui.js';
import { ROLES, SIZES, WANTS, USES, HAS, LIMITS, checkRequest, cleanDetails } from '../requests.js';

const CONTACT = config.contactEmail || '';
const X = '<svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true"><path d="M2 2l10 10M12 2L2 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>';
const opts = (list, blank) => (blank ? `<option value="">${blank}</option>` : '') + list.map((s) => `<option>${esc(s)}</option>`).join('');
const picks = (name, legend, list) => `<fieldset class="full lp-pick"><legend>${legend}</legend><div>${list.map((s) => `<label><input type="checkbox" name="${name}" value="${esc(s)}"><span>${esc(s)}</span></label>`).join('')}</div></fieldset>`;

const STEP1 = `
  <p class="lp-step">Step 1 of 2</p>
  <p>For professors, lecturers and teachers. We're setting up a small number of courses by hand this term. Tell us who you are, and we'll build the first course with you.</p>
  <p class="lp-sheet-student">Are you a student? <a href="#/signin">Sign in with your school account</a> instead.</p>
  <form class="lp-form" data-step="1" novalidate>
    <label>Your name<input name="name" required maxlength="${LIMITS.name}" autocomplete="name"></label>
    <label>School email<input name="email" type="email" required maxlength="${LIMITS.email}" autocomplete="email"></label>
    <label>School<input name="school" required maxlength="${LIMITS.school}" autocomplete="organization"></label>
    <label>Your role<select name="role" required>${opts(ROLES, 'Choose one')}</select></label>
    <label class="full">The course you'd start with<input name="course" required maxlength="${LIMITS.course}" placeholder="For example, Calculus I or MATH 150"></label>
    <label class="trap" aria-hidden="true">Leave this empty<input name="website" tabindex="-1" autocomplete="off"></label>
    <p class="full consent">We use these details only to contact you about Cramming. See our <a href="#/privacy">privacy policy</a>.</p>
    <p class="full error" data-error role="alert" hidden></p>
    <button type="submit" class="lp-btn big full">Send request</button>
  </form>`;

const step2 = (first, course) => `
  <div class="lp-done" role="status"><strong>Thank you, ${esc(first)}. Your request is in.</strong><span>We'll email you within two school days.</span></div>
  <p class="lp-step">Step 2 of 2, optional</p>
  <p>Two more minutes help us arrive ready to set up ${esc(course)}. Answer any you like.</p>
  <form class="lp-form" data-step="2" novalidate>
    <label class="full">Department<input name="department" maxlength="${LIMITS.department}" placeholder="For example, Mathematics"></label>
    <label>Students in the course<select name="students">${opts(SIZES, 'Choose one')}</select></label>
    <label>Sections<input name="sections" type="number" min="1" max="50" inputmode="numeric"></label>
    <label>Term starts<input name="start" type="date"></label>
    <label>First exam<input name="firstExam" type="date"></label>
    ${picks('wants', 'What would you use first?', WANTS)}
    ${picks('uses', 'What do you use today?', USES)}
    ${picks('has', 'What material do you already have?', HAS)}
    <label class="full">Best way to reach you, if not email<input name="contact" maxlength="${LIMITS.contact}" placeholder="A phone number, or a good time to call"></label>
    <label class="full">How did you hear about Cramming?<input name="heard" maxlength="${LIMITS.heard}"></label>
    <label class="full">Anything else we should know<textarea name="notes" rows="3" maxlength="${LIMITS.notes}"></textarea></label>
    <p class="full error" data-error role="alert" hidden></p>
    <div class="full lp-row2"><button type="submit" class="lp-btn big">Send details</button><button type="button" class="lp-btn-quiet" data-skip>Skip for now</button></div>
  </form>`;

const SHEET = `<dialog class="lp-sheet" aria-labelledby="ra-h">
  <div class="in">
    <div class="top"><h2 id="ra-h" tabindex="-1">Request access</h2><button type="button" class="x" data-close aria-label="Close">${X}</button></div>
    <div data-body></div>
  </div>
</dialog>`;

// Wires [data-request] buttons inside root to the sheet. Returns a cleanup function.
export function mountSheet(root) {
  root.insertAdjacentHTML('beforeend', SHEET);
  const dlg = root.querySelector('.lp-sheet');
  const body = dlg.querySelector('[data-body]');
  const title = dlg.querySelector('h2');
  let opener = null;
  let sent = null; // { id, first, course } once step 1 is saved
  let finished = false;

  const close = () => {
    if (!dlg.open || dlg.classList.contains('closing')) return;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) { dlg.close(); return; }
    dlg.classList.add('closing');
    setTimeout(() => { dlg.classList.remove('closing'); dlg.close(); }, 260);
  };
  const show = (html) => { body.innerHTML = html; dlg.scrollTop = 0; };
  const finish = (saidMore) => {
    finished = true;
    show(`<div class="lp-done" role="status" tabindex="-1"><strong>${saidMore ? 'Thank you. That helps a lot.' : `You're all set, ${esc(sent.first)}.`}</strong><span>We'll email you within two school days to set up ${esc(sent.course)}.</span></div>
      <button type="button" class="lp-btn big" data-close>Done</button>`);
    body.querySelector('.lp-done').focus();
  };
  const fail = (form, msg, field) => {
    const err = form.querySelector('[data-error]');
    err.textContent = msg; err.hidden = false;
    if (field) form.querySelector(`[name="${field}"]`)?.focus();
  };
  const busy = (form, on, label) => { const b = form.querySelector('[type="submit"]'); b.disabled = on; b.textContent = label; };

  dlg.addEventListener('close', () => opener?.focus());
  dlg.addEventListener('cancel', (e) => { e.preventDefault(); close(); });
  dlg.addEventListener('click', (e) => {
    if (e.target === dlg || e.target.closest('[data-close]')) close();
    if (e.target.closest('[data-skip]')) finish(false);
  });
  const onOpen = (e) => {
    const b = e.target.closest('[data-request]');
    if (!b) return;
    e.preventDefault();
    opener = b;
    if (!sent) show(STEP1); // a half-finished step 2 stays as it was; a finished request can start a new one
    else if (finished) { sent = null; finished = false; show(STEP1); }
    dlg.showModal();
    (body.querySelector('input:not([tabindex="-1"])') || title).focus();
  };
  root.addEventListener('click', onOpen);

  body.addEventListener('submit', async (e) => {
    e.preventDefault();
    const form = e.target;
    form.querySelector('[data-error]').hidden = true;
    if (form.dataset.step === '1') {
      const raw = Object.fromEntries(new FormData(form));
      const { error, field, data } = checkRequest(raw);
      if (error) return fail(form, error, field);
      busy(form, true, 'Sending…');
      try {
        // the hidden field is filled only by bots; the connector ignores those quietly
        const { id } = await cloud.sendAccessRequest({ step: 1, ...data, website: raw.website || '' });
        sent = { id, first: data.name.split(' ')[0], course: data.course };
        show(step2(sent.first, sent.course));
        body.querySelector('.lp-done').setAttribute('tabindex', '-1');
        body.querySelector('.lp-done').focus();
      } catch (ex) {
        console.error(ex);
        busy(form, false, 'Send request');
        if (ex.code === 'limit') fail(form, `Too many requests have come from your network today. Please try again tomorrow${CONTACT ? `, or email us at ${CONTACT}` : ''}.`);
        else if (ex.code === 'invalid') fail(form, ex.message, ex.field);
        else fail(form, "Your request didn't send. Check your connection and try again.");
      }
      return;
    }
    const fd = new FormData(form);
    const details = cleanDetails({ ...Object.fromEntries(fd), wants: fd.getAll('wants'), uses: fd.getAll('uses'), has: fd.getAll('has') });
    if (!Object.keys(details).length) return finish(false);
    busy(form, true, 'Sending…');
    try {
      await cloud.sendAccessRequest({ step: 2, id: sent.id, details });
      finish(true);
    } catch (ex) {
      console.error(ex);
      busy(form, false, 'Send details');
      fail(form, "Your details didn't send. Your request is saved, so you can try again or skip this step.");
    }
  });
  return () => { root.removeEventListener('click', onOpen); if (dlg.open) dlg.close(); };
}
