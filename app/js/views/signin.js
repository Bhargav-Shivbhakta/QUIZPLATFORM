// Sign in (#/signin), in the landing page's design: one panel, one way in. Students and course staff
// sign in the same way, with their school's Google account; people whose course isn't on Cramming
// yet are pointed to Request access.
import * as cloud from '../cloud.js';
import { esc } from '../ui.js';
import { ensureCss, header, footer } from './lp-shell.js';
import { mountSheet } from './lp-request.js';

const GOOGLE_G = `<svg viewBox="0 0 48 48" aria-hidden="true" width="20" height="20"><path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z"/><path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/><path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-7.9l-6.5 5C9.5 39.6 16.2 44 24 44z"/><path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z"/></svg>`;
export async function render(main) {
  await ensureCss();
  document.body.classList.add('landing-mode');
  let busy = false;
  const LABEL = 'Continue with Google';
  main.innerHTML = `<div class="lp">
    ${header(false)}
    <section class="wrap lp-signin" aria-labelledby="si-h">
      <div class="lp-signin-card">
        <h1 id="si-h">Sign in to Cramming</h1>
        <p class="lp-signin-lead">Use the Google account your school gave you. Students and course staff sign in the same way.</p>
        <div data-error></div>
        <button type="button" class="lp-btn big lp-google" data-signin>${GOOGLE_G}<span>${LABEL}</span></button>
        <p class="lp-signin-note">We never see your password. Can't get in? Use the school email your professor has on the class roster.</p>
        <hr>
        <p class="lp-signin-new">Teaching a course that isn't on Cramming yet? <button type="button" class="lp-link" data-request>Request access</button></p>
        <details class="lp-saved">
          <summary>What is saved, and who can see it</summary>
          <ul>
            <li>Your answers, scores, notes and code are saved to your account, so they follow you to any device.</li>
            <li>Your professor and TAs see your work in their class, to teach and grade. Other students see nothing of yours.</li>
            <li>Your name and email come from your school account. Read the <a href="#/privacy">privacy policy</a>.</li>
          </ul>
        </details>
      </div>
    </section>
    ${footer()}
  </div>`;
  const off = mountSheet(main.querySelector('.lp'));
  document.title = 'Sign in · Cramming';

  const paint = () => {
    const err = cloud.lastError();
    main.querySelector('[data-error]').innerHTML = err ? `<p class="lp-signin-error" role="alert">${esc(err)}</p>` : '';
    // aria-disabled, not disabled, so the button keeps keyboard focus while the sign-in window is open
    main.querySelectorAll('[data-signin]').forEach((b) => {
      b.setAttribute('aria-disabled', busy);
      b.querySelector('span').textContent = busy ? 'Opening Google…' : LABEL;
    });
  };
  paint();
  main.addEventListener('click', async (e) => {
    const b = e.target.closest('[data-signin]');
    if (!b || busy) return;
    busy = true; paint();
    await cloud.signIn();
    if (!cloud.currentUser()) { busy = false; paint(); }
  });
  const onAuth = () => { if (!cloud.currentUser()) { busy = false; paint(); } };
  window.addEventListener('qp:auth', onAuth);
  return () => { off(); window.removeEventListener('qp:auth', onAuth); document.body.classList.remove('landing-mode'); };
}
