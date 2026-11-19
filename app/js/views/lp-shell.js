// Shared frame for the public pages (landing, sign-in, privacy, terms, AI, accessibility): the
// stylesheet, header and footer. No database reads or writes. The request sheet is lp-request.js.

let cssReady = null;
export function ensureCss() {
  return cssReady ||= new Promise((resolve) => {
    if (document.querySelector('link[data-landing-css]')) return resolve();
    const l = Object.assign(document.createElement('link'), { rel: 'stylesheet', href: 'css/landing.css' });
    l.dataset.landingCss = '';
    l.onload = l.onerror = () => resolve();
    document.head.append(l);
  });
}

const LOGO = '<svg width="22" height="22" viewBox="0 0 28 28" aria-hidden="true"><circle cx="9" cy="9" r="5.5"/><circle class="filled" cx="19" cy="9" r="5.5"/><circle cx="9" cy="19" r="5.5"/><circle cx="19" cy="19" r="5.5"/></svg>';

// onLanding: section links scroll within the page; elsewhere they go back to it.
export function header(onLanding) {
  const to = (id) => (onLanding ? '#/' : `#/?to=${id}`);
  return `<header class="lp-head">
    <div class="wrap">
      <a class="lp-brand" href="#/" ${onLanding ? 'data-top' : ''} aria-label="Cramming home">${LOGO}<span>Cramming<sup class="tm" aria-hidden="true">™</sup></span></a>
      <nav class="lp-nav" aria-label="Main">
        <a class="link hide-sm" href="${to('professors')}" data-jump="professors">Educators</a>
        <a class="link hide-sm" href="${to('students')}" data-jump="students">Students</a>
        <a class="link hide-sm" href="${to('faq')}" data-jump="faq">Questions</a>
        <a class="link" href="#/signin">Sign in</a>
        <button type="button" class="lp-btn lp-small" data-request>Request access</button>
      </nav>
    </div>
    <div class="lp-progress" aria-hidden="true"></div>
  </header>`;
}

export function footer() {
  return `<footer class="lp-foot"><div class="wrap">
    <span>© ${new Date().getFullYear()} Cramming™ · Small reps. Top grades.™ Cramming and Small reps. Top grades. are trademarks of Cramming.</span>
    <nav aria-label="Policies"><a href="#/privacy">Privacy</a><a href="#/terms">Terms</a><a href="#/ai">How we use AI</a><a href="#/accessibility">Accessibility</a></nav>
  </div></footer>`;
}
