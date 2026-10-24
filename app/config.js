// Site-wide settings you can edit.
export default {
  // Shown in the top bar and the browser tab
  siteName: 'Exam Practice',
  // Optional line under the site name on the home screen, e.g. 'BIOL 101 · Fall 2026'
  tagline: '',
  // Footer text when sign-in is OFF (progress stays in each browser)
  footer: 'Your progress is saved only in this browser. Nothing is sent anywhere.',

  // ---- Student sign-in (optional) ----
  // Leave apiKey empty to run without sign-in. To turn sign-in on, follow
  // "Student sign-in" in README.md and paste the values from your Firebase project here.
  firebase: {
    apiKey: 'AIzaSyAiPB9tlNskI7CmDUPndQsRL-huqMBlm1k',
    authDomain: 'cramming-a5962.firebaseapp.com',     // e.g. 'cramming-abc12.firebaseapp.com'
    projectId: 'cramming-a5962',      // e.g. 'cramming-abc12'
    appId: '1:795803451120:web:d1171e150451535f68cc35',
  },
  // Only accounts with this email ending can sign in (also enforced by firestore.rules)
  allowedEmailDomain: 'sdsu.edu',
  // Name shown on the sign-in button, e.g. "Sign in with your SDSU account"
  schoolName: 'SDSU',
  // Footer text when sign-in is ON
  signedInFooter: 'Signed in with your school account. Your progress and code are saved to your account and shared with your instructor.',
};
