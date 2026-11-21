// FC: the student bar when Cramming is finished (docs/NAVIGATION.md, docs/FC.md check 2). Every place,
// section and Me item is here from the start; `ready` says whether its first feature has shipped.
// The bar shows only ready ones (DESIGN › Navigation, rule 3: hidden until it works). The FC preview
// (open any page with ?fc=1, turn off with ?fc=0) shows them all, so the finished bar can be seen and
// checked now; an item that isn't ready opens its plan page (views/st-fc.js) instead of a screen.
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

// The FC preview: on for this browser after ?fc=1, off after ?fc=0.
// Returns true when the setting changed, so the bar can be drawn again.
export function readPreviewFlag(query = {}) {
  if (query.fc !== '1' && query.fc !== '0') return false;
  const on = query.fc === '1', was = !!store.get('fcPreview', false);
  store.set('fcPreview', on);
  return on !== was;
}
export const preview = () => !!store.get('fcPreview', false);
export const shown = (list) => list.filter((x) => x.ready || preview());
export const findItem = (key) => [...PLACES, SEARCH, ...SECTIONS, ...ME].find((x) => x.key === key) || null;
