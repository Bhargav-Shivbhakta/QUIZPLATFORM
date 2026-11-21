// FC: the bar when Cramming is finished, for students and for staff (docs/NAVIGATION.md, docs/FC.md
// check 2). Every place, section and Me item is here from the start; `ready` says whether its first
// feature has shipped. The bar shows only ready ones (DESIGN › Navigation, rule 3: hidden until it
// works); reviewers (REVIEWERS below) see them all, and an item that isn't ready opens its plan page
// (views/st-fc.js) instead of a screen.
import * as store from './store.js';

// The main list, under Today. Search sits at the top of the bar, beside the logo.
export const PLACES = [
  { key: 'today', label: 'Today', icon: 'sun', ready: true, phase: 'Built', what: 'Your day across every class: the plan, what is coming up, the next exam, new grades and notes from your professors.' },
  { key: 'inbox', label: 'Inbox', icon: 'inbox', ready: false, phase: 'Phase 3', what: 'Announcements, messages with your professors and TAs, and replies to your requests, in one list.', switches: ['All', 'Announcements', 'Messages', 'Requests'] },
  { key: 'calendar', label: 'Calendar', icon: 'calendar', ready: false, phase: 'Phase 3', what: 'Every exam, deadline, unit opening and office hour across your classes, in your own section\'s times. Add it to your phone.', switches: ['Month', 'Week', 'List'] },
];
export const SEARCH = { key: 'search', label: 'Search', icon: 'search', ready: false, phase: 'Phase 3', what: 'Finds anything: a topic, a question, a note, a deadline. Inside a class it searches that class. ⌘ K opens it.' };

// A class's sections, in order. tab: the ?tab= of the class page. `only`: shown only at certain times.
export const SECTIONS = [
  { key: 'plan', label: 'Ready', icon: 'target', ready: true, phase: 'Built', what: 'How ready you are for the next exam, by topic, and what is left to be ready.' },
  { key: 'notes', label: 'Learn', icon: 'learn', ready: true, phase: 'Built', what: 'The units in order: key ideas, short videos, worked examples and a check question after each idea.', switches: ['Units', 'Files'] },
  { key: 'practice', label: 'Practice', icon: 'edit', ready: true, phase: 'Built', what: 'Practice sets, the questions to try again, review, flashcards, practice tests and coding.', switches: ['Sets', 'Try again', 'Review', 'Flashcards', 'Practice tests', 'Coding'] },
  { key: 'graded', label: 'Graded work', icon: 'graded', ready: true, phase: 'Built', what: 'Quizzes, exams and assignments: what is coming, what is open now, what is done.' },
  { key: 'grades', label: 'Grades', icon: 'award', ready: false, phase: 'Phase 2', what: 'Every grade with feedback on each question, regrade requests, and your grade in the class.' },
  { key: 'qa', label: 'Q&A', icon: 'chat', ready: false, phase: 'Phase 3', what: 'The class\'s questions and answers. Post anonymously to classmates; staff endorse good answers.', switches: ['All', 'Mine', 'Unanswered'] },
  { key: 'info', label: 'Class info', icon: 'info', ready: false, phase: 'Phase 3', what: 'The syllabus, your professor and TAs, office hours and how to reach them, and your section.' },
  { key: 'group', label: 'My group', icon: 'users', ready: false, phase: 'Phase 4', what: 'Your project or lab group: its members, files, discussion and group work.' },
  { key: 'live', label: 'Live', icon: 'live', ready: false, phase: 'Phase 4', only: 'Only while your professor runs a live session', what: 'Join the live class: polls, questions from the audience and team games, on your phone or laptop.' },
];

// The Me panel (your name at the foot of the bar), top to bottom. href: the screen when it's ready.
export const ME = [
  { key: 'progress', label: 'My progress', icon: 'chart', ready: true, href: '#/progress', what: 'Your term at a glance: days studied, your weekly goal, and how each class is going.' },
  { key: 'notifications', label: 'Notifications', icon: 'bell', ready: false, phase: 'Phase 3', what: 'Choose what you are told about, how (here, email, phone) and how often. At most one reminder a day.' },
  { key: 'settings', label: 'Settings', icon: 'settings', ready: true, href: '#/settings', what: 'How Cramming looks and behaves for you: theme, motion, practice options, accessibility and language.' },
  { key: 'myclasses', label: 'Your classes', icon: 'book', ready: false, phase: 'Phase 3', what: 'Your classes and sections, and how to join or leave one.' },
  { key: 'data', label: 'Your data', icon: 'download', ready: false, phase: 'Phase 3', what: 'Download a backup of your progress and code, restore it, start a set over, or erase everything.' },
  { key: 'help', label: 'Help', icon: 'help', ready: false, phase: 'Phase 4', what: 'How Cramming works, answers to common questions, and how to reach support.' },
];

// ---------- staff: professors, TAs and admins (the approved mockup, 20 November 2026) ----------
// Keys of built items match the bar's existing ones (stshell.js), which hold their real addresses.
export const STAFF_PLACES = [
  { key: 'today', label: 'Today', icon: 'sun', ready: true, phase: 'Built', what: 'What needs you across your classes: grading waiting, requests, unanswered questions, the class pulse and upcoming exams.' },
  { key: 's-inbox', label: 'Inbox', icon: 'inbox', ready: false, phase: 'Phase 2', what: 'Student messages, requests to approve (extensions, regrades) and announcements to send, in one list.', switches: ['All', 'Requests', 'Messages', 'Announcements'] },
  { key: 's-calendar', label: 'Calendar', icon: 'calendar', ready: false, phase: 'Phase 3', what: 'Every date you set across your classes. Drag to move one; add office hours and labs.', switches: ['Month', 'Week', 'List'] },
];
export const STAFF_SEARCH = { key: 's-search', label: 'Search', icon: 'search', ready: false, phase: 'Phase 3', what: 'Finds any student, question, set or exam. Inside a class it searches that class. ⌘ K opens it.' };
export const ADMIN_PLACES = [
  { key: 'a-overview', label: 'Overview', icon: 'grid', ready: true, phase: 'Built', href: '#/overview', what: 'The school at a glance: classes, people, use and health.' },
  { key: 'a-classes', label: 'Classes', icon: 'book', ready: true, phase: 'Built', href: '#/admin', what: 'Every class: create one, assign instructors, upload rosters.' },
  { key: 'a-people', label: 'People', icon: 'users', ready: false, phase: 'Phase 4', what: 'Everyone, a page at a time, with search: roles, permissions, coordinators, district admins and parents.' },
  { key: 'a-requests', label: 'Requests', icon: 'mail', ready: true, phase: 'Built', href: '#/requests', what: 'Access requests from new educators and new courses.' },
  { key: 'a-reports', label: 'Reports', icon: 'chart', ready: false, phase: 'Phase 4', what: 'Use, health, department and school reports, and AI use.' },
  { key: 'a-settings', label: 'School settings', icon: 'settings', ready: false, phase: 'Phase 4', what: 'School sign-in, the LMS and apps, rosters and grades from the school, the AI choice, data and security, branding.' },
];
// A class's sections for staff, in order. `who`: lead = the lead instructor or an admin; admin = admins only.
export const STAFF_SECTIONS = [
  { key: 'overview', label: 'Overview', icon: 'grid', ready: true, phase: 'Built', what: 'The class at a glance: who is working, announcements, and View as student.' },
  { key: 'build', label: 'Build', icon: 'sparkle', ready: true, phase: 'Built', who: 'lead', what: 'The course map, materials, units, notes and questions; Build my course.' },
  { key: 'spractice', label: 'Practice', icon: 'edit', ready: true, phase: 'Built', what: 'Practice sets and question files, and preview as a student.' },
  { key: 'sgraded', label: 'Graded work', icon: 'graded', ready: true, phase: 'Built', what: 'Exams, quizzes and assignments: setup, access codes, accommodations and the live exam view.' },
  { key: 'grading', label: 'Grading', icon: 'check', ready: false, phase: 'Phase 2', what: 'Grade question by question or student by student: rubrics, answer groups, comments and regrades.' },
  { key: 'gradebook', label: 'Gradebook', icon: 'award', ready: false, phase: 'Phase 2', what: 'Every student by every assignment: weights, letter grades, late rules and export to the school.' },
  { key: 'insights', label: 'Insights', icon: 'chart', ready: true, phase: 'Built', what: 'What to reteach, who needs help, and question statistics.' },
  { key: 'people', label: 'People', icon: 'users', ready: true, phase: 'Built', what: 'The roster, sections, TAs and extra time; then groups.' },
  { key: 's-qa', label: 'Q&A', icon: 'chat', ready: false, phase: 'Phase 3', what: 'Students\' questions to answer and good answers to endorse.', switches: ['Unanswered', 'All', 'Endorsed'] },
  { key: 'liveclass', label: 'Live class', icon: 'live', ready: false, phase: 'Phase 4', what: 'Polls, word clouds, attendance and questions from the audience, shown on the projector.' },
  { key: 'csettings', label: 'Class settings', icon: 'settings', ready: true, phase: 'Built', who: 'admin', what: 'The class\'s name, term, colour, sections and tools.' },
];
export const STAFF_ME = [
  { key: 's-notifications', label: 'Notifications', icon: 'bell', ready: false, phase: 'Phase 3', what: 'Choose what you are told about (requests, questions, grading waiting), how and how often.' },
  { key: 'settings', label: 'Settings', icon: 'settings', ready: true, href: '#/settings', what: 'How Cramming looks for you.' },
  { key: 'teachsettings', label: 'Teaching settings', icon: 'users', ready: false, phase: 'Phase 3', what: 'Your defaults for new classes, exams and grading, your office hours and how students reach you.' },
  { key: 's-help', label: 'Help', icon: 'help', ready: false, phase: 'Phase 4', what: 'How each part works, guides for setting up a course, and how to reach support.' },
];

// Returns true when the setting changed, so the bar can be drawn again.
export function readPreviewFlag(query = {}) {
  if (query.fc !== '1' && query.fc !== '0') return false;
  const was = preview();
  store.set('fcPreview', query.fc === '1');
  return preview() !== was;
}
// Only reviewers see the finished bar (Bhargav's and Anusha's accounts, and Prof. Kraft), on by default;
// ?fc=0 (or Turn off) hides it for them, ?fc=1 brings it back. Everyone else sees only what is built,
// whatever the address says.
export const REVIEWERS = ['bshivbhakta@sdsu.edu', 'bshivbhakta4143@sdsu.edu', 'pkraft@sdsu.edu', 'akarve0363@sdsu.edu', 'akarve@sdsu.edu'];
let viewer = '';
export const setViewer = (email) => { viewer = String(email || '').toLowerCase(); };
export const isReviewer = () => REVIEWERS.includes(viewer);
export const preview = () => isReviewer() && store.get('fcPreview', true) !== false; // only reviewers, ever
export const setPreview = (on) => store.set('fcPreview', !!on); // Settings › Finished bar, and Turn off
export const shown = (list) => list.filter((x) => x.ready || preview());
// staff: look in the staff lists first (Settings exists in both)
export const findItem = (key, staff = false) => (staff ? [...STAFF_PLACES, STAFF_SEARCH, ...ADMIN_PLACES, ...STAFF_SECTIONS, ...STAFF_ME] : [...PLACES, SEARCH, ...SECTIONS, ...ME]).find((x) => x.key === key) || null;
