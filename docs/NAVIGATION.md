# Navigation: a home for every feature

Proposed 20 November 2026, waiting for Bhargav's approval (then the FC check, mockups and the build). The frame itself is decided (DESIGN.md, Navigation): logo and search fixed at the top, the middle that drills into a class, your name at the bottom opening Me. This page gives every feature through Phase 4 its home, for every role, so the frame is built once with every place and section in it, each hidden until its first feature ships.

**How to read a home:** place › section › switch. "Classes › a class › Practice › Flashcards" means: the class in the bar, its Practice section, the Flashcards switch at the top of the page. Two levels in the bar, never more; anything deeper is a switch.

## The bar for each role

### Students

| Place | Sections and switches | Appears |
|---|---|---|
| Today | One page: the briefing, today's plan, Coming up, the next exam, recent grades and feedback, from your professor, this week | Built |
| Inbox | One list: announcements, messages with staff, replies to requests | Announcements now; messages Phase 3 |
| Calendar | Every date across classes; Add to my phone | Phase 3 |
| Classes › a class | **Ready** (class home: readiness and the countdown) · **Learn** (units) · **Practice** (Sets · Try again · Review · Flashcards · Practice tests · Coding) · **Graded work** · **Grades** · **Q&A** · **Class info** · **My group** · **Live** (only while a session is on) | Ready, Learn, Practice, Graded work now; Grades Phase 2; Q&A, Class info Phase 3; My group, Live Phase 4 |
| Search | Top of the bar; inside a class it searches that class | Phase 3 |
| Me (your name) | **Progress** · **Notifications** · **Settings** (Look · Practice · Study buddy · Accessibility · Language) · **Your classes** · **Your data** (backup, restore, start over, erase) · Help · Sign out | Built; Notifications Phase 3; Language Phase 4 |

Inside every question (anywhere it appears): the answer types, report a problem, ask my professor, the tutor (never in graded work).

### Educators

| Place | Sections and switches | Appears |
|---|---|---|
| Today | What needs you across classes: grading waiting, requests, unanswered questions, the class pulse, upcoming exams | Phase 1 |
| Inbox | Student messages, requests to approve (extensions, regrades), announcements to send | Announcements now; requests Phase 2 |
| Calendar | Every date they set; drag to move; own events (office hours, labs) | Phase 3 |
| Teaching › a class | **Overview** · **Build** (Course map · Materials · Units · Questions) · **Practice** · **Graded work** (Exams · Quizzes · Assignments · Coding · Live) · **Grading** · **Gradebook** · **Insights** · **People** (Roster · Sections · TAs · Accommodations · Groups) · **Q&A** · **Live class** · **Class settings** | Overview, Build, Practice, Graded work, Insights, People, Class settings now; Grading, Gradebook Phase 2; Q&A Phase 3; Live class Phase 4 |
| View as student | A button at the top of every class page | Built |
| Me | As students, plus Teaching settings | Built |

**TAs** get the educator bar showing only their sections and what their permissions allow (set in People). Someone who teaches one class and takes another uses separate work and school accounts (FC check 1, case 18).

### Admins and schools

| Place | What lives there | Appears |
|---|---|---|
| Overview | The school at a glance: classes, people, use, health | Built (platform overview) |
| Classes | Every class, a page at a time, with search; create and assign | Built; pages and search with scale fix F4 |
| People | Everyone, a page at a time, with search; roles and permissions | Phase 4 |
| Requests | Access requests from new educators and new courses | Built |
| Reports | Use, health, department and school reports, AI use | Phase 4 |
| School settings | Sign-in (SSO) · LMS and apps · Rosters and grades · AI · Data and security · Branding | Phase 4 and expansion |
| Departments | Coordinators, high school teachers, standards | Phase 4 |
| District | Schools in a district | Phase 4 |

**Parents (Phase 4):** a bar of their own: Today for each child (Coming up, Recent grades, the professor's notes), Grades, Messages. Never the plan or attempts.

**Coordinators and district admins (Phase 4):** the admin console limited to their department or schools.

### Visitors

The public site: the landing page, Try a question, FAQ, Request access, Sign in, Policies.

## The rules (from DESIGN.md, Navigation)

1. Two levels in the bar, never more: a place, then a section. Deeper is a switch.
2. Hidden until it works: no "coming soon", no empty tabs.
3. Focused work (practice, exams, flashcards, the code editor, grading, the projector) is full screen with a slim bar.
4. One way up: `backFor()` decides it, with a test for every route.
5. Every role uses the same frame; only the places and sections differ.


## Every feature and its home

All 469 features on the system map (11 listed twice are merged), by role. A place or section appears only when its first feature ships.

### Visitors (public site) (16)

| Home | Feature | Status |
|---|---|---|
| Public site | Case studies and educator stories | Not yet |
| Public site | Free during early access | Built |
| Public site | Label a diagram and pick a point on a graph (shown, not built: I-15) | Partly built |
| Public site | Landing page: 12 screens, one swipe each | Built |
| Public site | Pages: For professors, For schools, Subjects, How it works, Help | Planned |
| Public site | Policy pages rewritten after phase 1, then a lawyer review | Planned |
| Public site | Pricing (phase 4) | Planned |
| Public site | Try a question in each subject | Built |
| Public site | ™ on the name and tagline; trademark filing later | Partly built |
| Public site › FAQ | Questions educators ask (FAQ) | Built |
| Public site › Policies | Accessibility audit | Planned |
| Public site › Policies | Privacy, Terms, How we use AI, Accessibility pages | Partly built |
| Public site › Policies | Published accessibility statement (VPAT) | Not yet |
| Public site › Request access | Access requests from new educators | Built |
| Public site › Request access | Request access (form) | Built |
| Public site › Sign in | Sign in with the school account | Partly built |

### Students (208)

| Home | Feature | Status |
|---|---|---|
| Calendar | Calendar of every due date across classes | Partly built |
| Calendar | Calendar with Add to my phone | Planned |
| Calendar | Office hours booking | Not yet |
| Calendar | Sync to Google, Apple or Outlook calendar | Not yet |
| Classes › a class › Graded work | AI quizzes you and re-explains | Planned |
| Classes › a class › Graded work | AI that won't give answers during graded work | Built |
| Classes › a class › Graded work | Code can only be typed in graded work | Built |
| Classes › a class › Graded work | Device checks before the start (second screen, VM, AI helpers) | Built |
| Classes › a class › Graded work | Draft saved as you go | Built |
| Classes › a class › Graded work | Exit code after finishing | Built |
| Classes › a class › Graded work | Extension requests from the student | Planned |
| Classes › a class › Graded work | Graded work at a glance and how it works | Built |
| Classes › a class › Graded work | Hand in a file (PDF, Word, slides) | Planned |
| Classes › a class › Graded work | Hints and worked examples inside exercises | Built |
| Classes › a class › Graded work | Learn: video, worked example and check per idea | Planned |
| Classes › a class › Graded work | On the extra-time list: no access or exit code | Built |
| Classes › a class › Graded work | Photo of handwritten work from a phone, with page matching | Planned |
| Classes › a class › Graded work | Submit a link or a Google or Microsoft file | Not yet |
| Classes › a class › Graded work | Submit code (editor, upload or GitHub) | Partly built |
| Classes › a class › Graded work | Team quiz games | Not yet |
| Classes › a class › Graded work | Two sittings: rolled over to their own day | Built |
| Classes › a class › Graded work | Type a text answer in the browser | Partly built |
| Classes › a class › Graded work | Worked examples with fading steps | Planned |
| Classes › a class › Grades | Regrade requests with reasons, answered by the grader | Planned |
| Classes › a class › Grades | Student grades page with feedback per question | Partly built |
| Classes › a class › Grades | What-if grades for students | Not yet |
| Classes › a class › Grades | Written answer, graded by hand | Built |
| Classes › a class › Learn | A guided queue of what to do next (missions) | Built |
| Classes › a class › Learn | Audio or video answer | Not yet |
| Classes › a class › Learn | Bookmarks and my own notes | Planned |
| Classes › a class › Learn | Captions on video | Not yet |
| Classes › a class › Learn | Class codes to join (by design) | Not yet |
| Classes › a class › Learn | Easier reading (Lexend, wider spacing) | Built |
| Classes › a class › Learn | In-video questions | Not yet |
| Classes › a class › Learn | Lessons as short videos, articles and exercises in a set path | Partly built |
| Classes › a class › Learn | Live video class | Not yet |
| Classes › a class › Learn | Mastery levels per skill (attempted, familiar, proficient, mastered) | Partly built |
| Classes › a class › Learn | Narrated lessons: about 2 minutes per topic, captions, text version | Partly built |
| Classes › a class › Learn | Notes for each unit | Built |
| Classes › a class › Learn | Notes made from a lecture recording | Not yet |
| Classes › a class › Learn | Read, listen or watch: notes read aloud | Planned |
| Classes › a class › Learn | Record audio or video | Not yet |
| Classes › a class › Learn | Role-play and dialogue activities with AI | Not yet |
| Classes › a class › Learn | Social reading: comments on the reading itself | Not yet |
| Classes › a class › Learn | Unit tests and course challenges that skip what you already know | Not yet |
| Classes › a class › Live (while a session is on) | Questions from the audience, upvoted | Not yet |
| Classes › a class › My group | Group workspaces (files, discussion) | Not yet |
| Classes › a class › My group | Join a course by code (by design) | Not yet |
| Classes › a class › My group | Self sign-up groups | Not yet |
| Classes › a class › Practice | "I only have 10 minutes": the single most useful task | Planned |
| Classes › a class › Practice | A study buddy character | Built |
| Classes › a class › Practice | Adaptive practice that targets weak topics | Partly built |
| Classes › a class › Practice | Browse every question in a set | Built |
| Classes › a class › Practice | Calculator | Built |
| Classes › a class › Practice | Catch-up plan after a missed week | Planned |
| Classes › a class › Practice | Difficulty levels | Planned |
| Classes › a class › Practice | End of a set: what you fixed, what comes back tomorrow, "5 more" | Planned |
| Classes › a class › Practice | Full worked solution after every answer | Built |
| Classes › a class › Practice | Hints before answering | Planned |
| Classes › a class › Practice | Learn mode: mixed question types until mastered | Not yet |
| Classes › a class › Practice | Learn: open the source slides | Planned |
| Classes › a class › Practice | Matching games and timed rounds | Not yet |
| Classes › a class › Practice | Mixed review: earlier units mixed with this one | Planned |
| Classes › a class › Practice | No settings before the first question | Planned |
| Classes › a class › Practice | No timer or answer sheet unless it is a timed test | Planned |
| Classes › a class › Practice | Points, leaderboards, leagues (by design) | Not yet |
| Classes › a class › Practice | Practice sets with instant right or wrong | Built |
| Classes › a class › Practice | Questions you got wrong kept to redo | Built |
| Classes › a class › Practice | Report a problem with a question | Built |
| Classes › a class › Practice | Results after a practice set | Built |
| Classes › a class › Practice | Retries never lower a score | Planned |
| Classes › a class › Practice | Shared public study sets from other students (by design) | Not yet |
| Classes › a class › Practice | Spaced review: questions come back before you forget | Built |
| Classes › a class › Practice | Study habits self-check that shapes the plan | Planned |
| Classes › a class › Practice | Study together (focus session with a companion) | Planned |
| Classes › a class › Practice › Coding | AI code feedback | Planned |
| Classes › a class › Practice › Coding | Code editor in the browser (highlighting, autocomplete) | Built |
| Classes › a class › Practice › Coding | Debugger | Not yet |
| Classes › a class › Practice › Coding | Interactive textbook with code exercises | Partly built |
| Classes › a class › Practice › Coding | Java | Built |
| Classes › a class › Practice › Coding | JavaScript, SQL, C and C++ | Planned |
| Classes › a class › Practice › Coding | Notebooks (Jupyter) | Not yet |
| Classes › a class › Practice › Coding | Python | Planned |
| Classes › a class › Practice › Coding | Run code and see output | Built |
| Classes › a class › Practice › Coding | Terminal and full Linux workspace | Not yet |
| Classes › a class › Practice › Flashcards | Flashcards (text, images, audio, maths) | Partly built |
| Classes › a class › Practice › Flashcards | Flashcards and quiz from one bank, switch in one tap | Planned |
| Classes › a class › Practice › Flashcards | Flashcards made automatically from notes | Partly built |
| Classes › a class › Practice › Flashcards | Glossary of key terms (also as flashcards) | Planned |
| Classes › a class › Practice › Flashcards | Notes, flashcards and tests from uploaded files | Built |
| Classes › a class › Practice › Practice tests | Practice test: timed, like the real exam | Built |
| Classes › a class › Practice › Practice tests | The day before an exam becomes a timed run-through | Planned |
| Classes › a class › Practice › Try again | Each missed question links to its notes and practice, and joins the mistake notebook | Planned |
| Classes › a class › Practice › Try again | Try again until right, same or new numbers | Partly built |
| Classes › a class › Q&A | "Me too" on a classmate's question | Planned |
| Classes › a class › Q&A | "What was least clear?" after each unit (anonymous) | Planned |
| Classes › a class › Q&A | @mentions, replies, reactions | Not yet |
| Classes › a class › Q&A | Ask my professor from any question (the item is attached) | Planned |
| Classes › a class › Q&A | Bring to student hours: a page of what I keep missing | Planned |
| Classes › a class › Q&A | Class Q&A board (questions and answers) | Not yet |
| Classes › a class › Q&A | Code and maths in posts | Not yet |
| Classes › a class › Q&A | Comment on a question in practice ("I don't get step 2") | Not yet |
| Classes › a class › Q&A | Post anonymously to classmates (staff can see who) | Not yet |
| Classes › a class › Q&A | Private question to staff only | Not yet |
| Classes › a class › Q&A | Similar questions suggested before posting | Not yet |
| Classes › a class › Q&A | Threaded discussions | Not yet |
| Classes › a class › Ready | Countdown to the next exam | Built |
| Classes › a class › Ready | Readiness per topic in plain words | Built |
| Classes › a class › Ready | Ready by topic for the next exam | Planned |
| Classes › a class › Ready | Ready: study plan with the tracing line | Built |
| Everywhere (phone and offline) | Add to home screen (installable web app) | Not yet |
| Everywhere (phone and offline) | Offline study, syncing later | Not yet |
| Everywhere (phone and offline) | Scan paper homework with the phone camera | Planned |
| Everywhere (phone and offline) | Student app (iOS, Android) | Not yet |
| Everywhere (phone and offline) | Study offline | Not yet |
| Everywhere (phone and offline) | Widgets (next exam, today's minutes) | Not yet |
| Everywhere (phone and offline) | Works fully on a phone browser | Built |
| Inbox | Auto-translate messages and posts | Not yet |
| Inbox | Daily or weekly digest email | Not yet |
| Inbox | Inbox (announcements, replies, messages) | Planned |
| Inbox | Inbox: messages between students and staff | Not yet |
| Inbox | Submission receipt (email or page) | Not yet |
| Inbox | Your name and school email at the top | Built |
| Inside Learn and Practice (the tutor) | AI hints on your own wrong answer | Planned |
| Inside Learn and Practice (the tutor) | AI study buddy with personality | Planned |
| Inside Learn and Practice (the tutor) | AI study planner | Partly built |
| Inside Learn and Practice (the tutor) | AI tutor in the course, off during tests | Built |
| Inside Learn and Practice (the tutor) | AI tutor that answers only from the course | Built |
| Inside Learn and Practice (the tutor) | Ask the tutor about this question (from the explanation) | Planned |
| Inside Learn and Practice (the tutor) | Explain it another way (free AI, course only) | Planned |
| Inside Learn and Practice (the tutor) | The Dot: introduction for new students | Planned |
| Inside Learn and Practice (the tutor) | The Dot: poses (wave, thumbs up, read, sleep) | Planned |
| Inside Learn and Practice (the tutor) | Tutor names the slide it drew on | Planned |
| Inside every question | Annotate a PDF as the answer | Not yet |
| Inside every question | Categorise (drag items into groups) | Not yet |
| Inside every question | Chemistry structures and equations | Not yet |
| Inside every question | Code question with tests | Built |
| Inside every question | File or photo upload answer | Planned |
| Inside every question | Hot spot (click on a picture) | Not yet |
| Inside every question | Label a diagram (drag labels) | Not yet |
| Inside every question | Matching | Not yet |
| Inside every question | Multi-part questions with partial credit | Not yet |
| Inside every question | Multiple choice | Built |
| Inside every question | Number answer with tolerance and units | Partly built |
| Inside every question | Ordering (put steps in order) | Not yet |
| Inside every question | Pick a point or draw on a graph | Not yet |
| Inside every question | Select all that apply | Built |
| Inside every question | Short answer (fill in the blank) | Built |
| Inside every question | True or false | Built |
| Inside every question | Typed equations and formulas, checked for equivalence | Planned |
| Me | Saved to your account: status and Save now | Built |
| Me | Sign out | Built |
| Me › Notifications | At most one reminder a day, easy to turn off | Planned |
| Me › Notifications | Choose what to be told about and how often | Not yet |
| Me › Notifications | Email notifications | Not yet |
| Me › Notifications | Notification bell in the app | Built |
| Me › Notifications | Push notifications | Not yet |
| Me › Notifications | Reminders I choose: what, when, and how (site, email, phone) | Planned |
| Me › Notifications | Reminders before a deadline | Not yet |
| Me › Progress | Badges and certificates on completion | Not yet |
| Me › Progress | Celebrations, sparingly (unit mastered, exam passed) | Planned |
| Me › Progress | Certificates and skill paths | Not yet |
| Me › Progress | Class goals and gems, streaks (by design) | Not yet |
| Me › Progress | History of past sessions and tests | Partly built |
| Me › Progress | My progress (from the Me panel) | Built |
| Me › Progress | Streak with a freeze for exam weeks or sick days | Planned |
| Me › Progress | Streaks (by design) | Not yet |
| Me › Progress | Weekly goal and days studied | Built |
| Me › Progress | Weekly goal: 2 to 5 days | Built |
| Me › Settings | Alternative formats of files (audio, Braille, ePub) | Not yet |
| Me › Settings | Coding exam screen: fold, hide problem, drag, resize, text size | Built |
| Me › Settings | Courses in many languages, AI dubbing | Not yet |
| Me › Settings | Help beyond studying: counselling, disability, basic needs links | Planned |
| Me › Settings | Interface in other languages | Not yet |
| Me › Settings | Keyboard and screen reader support | Built |
| Me › Settings | Spanish | Planned |
| Me › Settings | Text size: small, medium, large | Built |
| Me › Settings | Text to speech for questions | Not yet |
| Me › Settings | Zoom to 200% without breaking | Built |
| Me › Settings › Look | High contrast | Built |
| Me › Settings › Look | Motion: full or soft (device reduce motion respected) | Built |
| Me › Settings › Look | Theme: device, light or dark | Built |
| Me › Settings › Practice | Ask before submitting | Built |
| Me › Settings › Practice | Choose 3, 4 or 5 study days a week | Partly built |
| Me › Settings › Practice | Show answers after each question or at the end | Built |
| Me › Settings › Practice | Shuffle answer choices | Built |
| Me › Settings › Study buddy | Study buddy: the Dot, the Flame or off | Built |
| Me › Your classes | Your classes, with section | Built |
| Me › Your data | Download a backup of my progress and code | Built |
| Me › Your data | Erase everything | Built |
| Me › Your data | Restore a backup | Built |
| Me › Your data | Start a practice set over | Built |
| Search (top of the bar) | Search | Planned |
| The frame | Big monitors: scale up, pages fill the width | Built |
| The frame | Collapse to a rail, subject over number badges | Built |
| The frame | Left bar that drills into a class | Built |
| The frame | List and detail layout for class sections | Planned |
| The frame | Me panel over a blurred page | Built |
| The frame | New students see a welcome, not zeros | Planned |
| The frame | Phone navigation redesign | Planned |
| The frame | Sign in and pick your classes | Built |
| Today | Daily study plan with minutes | Built |
| Today | Plan built back from the exam date | Partly built |
| Today | Professor's note at the top of Today | Planned |
| Today | To-do list of what is due | Built |
| Today | Today's content redesign (students: feels empty) | Planned |
| Today | Today: one plan across all classes | Built |
| Today | Week plan | Built |

### Educators and TAs (192)

| Home | Feature | Status |
|---|---|---|
| Calendar | Change all due dates for a new term at once | Not yet |
| Calendar | Drag to change a due date | Not yet |
| Calendar | Educator's own events (office hours, labs) | Not yet |
| Teaching › a class › Build | "Check this for me" and "Suggest improvements" on any item | Planned |
| Teaching › a class › Build | AI builds the course (map, notes, practice, quizzes) from the educator's materials | Built |
| Teaching › a class › Build | AI coach for course design | Partly built |
| Teaching › a class › Build | AI course builder from an idea or existing materials | Built |
| Teaching › a class › Build | AI-scored peer review and open answers (essays, code) | Planned |
| Teaching › a class › Build | Build it with me: one item at a time, accept, edit or ask for a change | Planned |
| Teaching › a class › Build | Course home page the educator chooses | Not yet |
| Teaching › a class › Build | Course map of units and topics | Built |
| Teaching › a class › Build | Early warning for students falling behind | Planned |
| Teaching › a class › Build | Educator reviews and publishes; students see nothing until then | Built |
| Teaching › a class › Build | Every answer key checked twice before publishing | Built |
| Teaching › a class › Build | File library with folders, versions and usage rights | Not yet |
| Teaching › a class › Build | Modules or units holding pages, files, quizzes and discussions in order | Partly built |
| Teaching › a class › Build | Move every date one week later | Planned |
| Teaching › a class › Build | Notes for the AI in your own words when building | Partly built |
| Teaching › a class › Build | Prerequisites: a module opens only after the last is done | Not yet |
| Teaching › a class › Build | Reading with shared notes in the margin | Not yet |
| Teaching › a class › Build | Release by condition (score, completion, group) | Not yet |
| Teaching › a class › Build | Release on a date, hide until a date | Built |
| Teaching › a class › Build | Rich pages (text, images, video, embeds, equations) | Partly built |
| Teaching › a class › Build | Share a course with a colleague | Planned |
| Teaching › a class › Build | Student view (see the course as a student) | Built |
| Teaching › a class › Build | Syllabus page | Not yet |
| Teaching › a class › Build | Version history | Planned |
| Teaching › a class › Build (AI tools) | AI accessibility fixes for course content | Not yet |
| Teaching › a class › Build (AI tools) | AI builds the full course for the educator | Built |
| Teaching › a class › Build (AI tools) | AI discussion summaries and answers | Not yet |
| Teaching › a class › Build (AI tools) | AI translation | Not yet |
| Teaching › a class › Build (AI tools) | Educator controls: AI on or off per course | Built |
| Teaching › a class › Build › Questions | AI writes questions from materials | Built |
| Teaching › a class › Build › Questions | AI writes quiz questions | Built |
| Teaching › a class › Build › Questions | Exam questions never appear in practice (checked while building) | Built |
| Teaching › a class › Build › Questions | Import a course (Common Cartridge) | Not yet |
| Teaching › a class › Build › Questions | Import from Word, spreadsheet, other LMSs | Partly built |
| Teaching › a class › Build › Questions | Learning outcomes and standards tagged to questions | Partly built |
| Teaching › a class › Build › Questions | On-site editors for notes, questions and assignments | Planned |
| Teaching › a class › Build › Questions | One question at a time, no going back | Not yet |
| Teaching › a class › Build › Questions | Pick which questions go on the paper | Built |
| Teaching › a class › Build › Questions | Question banks and pools, drawn at random | Partly built |
| Teaching › a class › Build › Questions | Questions where strong students did worse (wrong key or unclear) | Planned |
| Teaching › a class › Build › Questions | Randomised numbers per student (formula questions) | Planned |
| Teaching › a class › Build › Questions | Shuffle questions and answer order | Built |
| Teaching › a class › Build › Questions | Tags by topic, difficulty, outcome | Partly built |
| Teaching › a class › Build › Questions | Top "least clear" answers and most "me too" questions | Planned |
| Teaching › a class › Build › Questions | Video hosting, captions, in-video questions | Not yet |
| Teaching › a class › Build › Questions | Write questions in a plain text file | Built |
| Teaching › a class › Class settings | Class settings for instructors (admins only today) | Planned |
| Teaching › a class › Class settings | Copy a course into a new term | Not yet |
| Teaching › a class › Gradebook | Categories with weights (homework 20%, exams 50%) | Not yet |
| Teaching › a class › Gradebook | Drop lowest scores | Not yet |
| Teaching › a class › Gradebook | Excused and missing marks | Not yet |
| Teaching › a class › Gradebook | Export as a spreadsheet | Built |
| Teaching › a class › Gradebook | Export grades to the LMS | Built |
| Teaching › a class › Gradebook | Extra credit | Not yet |
| Teaching › a class › Gradebook | Grade history (who changed what, when) | Not yet |
| Teaching › a class › Gradebook | Grade posting policy (now or when released) | Built |
| Teaching › a class › Gradebook | Gradebook: students by assignments | Partly built |
| Teaching › a class › Gradebook | Learning outcome mastery report | Not yet |
| Teaching › a class › Gradebook | Letter grade scheme (A, B, C) | Not yet |
| Teaching › a class › Gradebook | Mastery or standards-based grading | Not yet |
| Teaching › a class › Gradebook | Override a final grade | Not yet |
| Teaching › a class › Gradebook | Participation credit | Planned |
| Teaching › a class › Gradebook | Quiz import and export | Planned |
| Teaching › a class › Gradebook | Teacher reports: time, mastery, completion | Built |
| Teaching › a class › Graded work | AI-tools notice before the exam | Built |
| Teaching › a class › Graded work | AI-writing detection and writing process replay | Not yet |
| Teaching › a class › Graded work | Access code shown in the room | Built |
| Teaching › a class › Graded work | Anonymous submissions | Not yet |
| Teaching › a class › Graded work | Bubble sheets | Not yet |
| Teaching › a class › Graded work | Code similarity check | Planned |
| Teaching › a class › Graded work | Different dates per section or per student | Partly built |
| Teaching › a class › Graded work | Discussion post as a graded assignment | Not yet |
| Teaching › a class › Graded work | Due date, available from, available until | Built |
| Teaching › a class › Graded work | Educator grants an extension to one student | Planned |
| Teaching › a class › Graded work | Exam versions (A and B) | Planned |
| Teaching › a class › Graded work | Group assignments (one submission for the group) | Not yet |
| Teaching › a class › Graded work | IP address limits | Not yet |
| Teaching › a class › Graded work | Late penalty rules (per day, cap) | Not yet |
| Teaching › a class › Graded work | Leave-the-window warnings and log | Built |
| Teaching › a class › Graded work | Let a student back in, add time, end an attempt | Built |
| Teaching › a class › Graded work | Live human proctor online | Not yet |
| Teaching › a class › Graded work | Lockdown browser | Built |
| Teaching › a class › Graded work | Missing work marked automatically | Not yet |
| Teaching › a class › Graded work | Multiple attempts, which one counts | Partly built |
| Teaching › a class › Graded work | No exit code flagged in Live, Results and CSV | Built |
| Teaching › a class › Graded work | One attempt or several | Built |
| Teaching › a class › Graded work | Opens and closes at set times | Built |
| Teaching › a class › Graded work | Paper exams: print, scan, match to students | Not yet |
| Teaching › a class › Graded work | Plagiarism check on writing | Not yet |
| Teaching › a class › Graded work | Possible VM flagged: check this device | Built |
| Teaching › a class › Graded work | Require Safe Exam Browser by default, with a setup guide | Planned |
| Teaching › a class › Graded work | Rollover status: took Friday, rolled over | Built |
| Teaching › a class › Graded work | Show results after: score, answers, or nothing | Partly built |
| Teaching › a class › Graded work | Time limit, timed by the server | Built |
| Teaching › a class › Graded work | Two sittings: keep out who took the other one | Built |
| Teaching › a class › Graded work | Ungraded surveys, anonymous | Not yet |
| Teaching › a class › Graded work | Watermark on exam pages | Built |
| Teaching › a class › Graded work | Webcam and screen recording, AI flags | Not yet |
| Teaching › a class › Graded work › Coding | Code playback (watch how it was written) | Planned |
| Teaching › a class › Graded work › Coding | Coding-only practice sets | Built |
| Teaching › a class › Graded work › Coding | Paste limits in graded work | Built |
| Teaching › a class › Graded work › Coding | Sample tests shown, hidden tests for grading | Built |
| Teaching › a class › Graded work › Coding | Starter code and multiple files | Built |
| Teaching › a class › Graded work › Coding | Submit from GitHub | Not yet |
| Teaching › a class › Graded work › Live | Integrity flags in Live: helpers, inserts, second screen | Built |
| Teaching › a class › Graded work › Live | Live view of who is working | Built |
| Teaching › a class › Grading | AI suggests a grade and feedback | Planned |
| Teaching › a class › Grading | AI writes rubrics | Not yet |
| Teaching › a class › Grading | Annotate the student's PDF (pen, highlight, text) | Not yet |
| Teaching › a class › Grading | Anonymous grading (names hidden) | Planned |
| Teaching › a class › Grading | Audio or video feedback | Not yet |
| Teaching › a class › Grading | Automatic grading of choice, number and short answers | Built |
| Teaching › a class › Grading | Automatic grading of code against hidden tests | Built |
| Teaching › a class › Grading | Comment bank: reusable comments | Planned |
| Teaching › a class › Grading | Grade by hand, one answer at a time | Built |
| Teaching › a class › Grading | Grade question by question across all students | Not yet |
| Teaching › a class › Grading | Grade student by student (SpeedGrader) | Partly built |
| Teaching › a class › Grading | Grade without the student's name, by ID | Not yet |
| Teaching › a class › Grading | Graded quizzes, assignments and peer review with rubrics | Partly built |
| Teaching › a class › Grading | Grades held back until released | Built |
| Teaching › a class › Grading | Grading progress per TA | Planned |
| Teaching › a class › Grading | Identical answers grouped and marked once | Planned |
| Teaching › a class › Grading | Keyboard shortcuts while grading | Not yet |
| Teaching › a class › Grading | Moderated grading (a second grader, final say) | Not yet |
| Teaching › a class › Grading | Partial credit per part | Not yet |
| Teaching › a class › Grading | Peer review (assign reviewers, rubric) | Not yet |
| Teaching › a class › Grading | Regrade a question after the exam (fix a key) | Partly built |
| Teaching › a class › Grading | Rubric that updates every graded paper when changed | Planned |
| Teaching › a class › Grading | Rubrics with levels and points | Planned |
| Teaching › a class › Grading | Split grading among TAs by question | Planned |
| Teaching › a class › Insights | At-risk alerts (predicted to fail) | Not yet |
| Teaching › a class › Insights | Compare sections | Partly built |
| Teaching › a class › Insights | Hardest questions and most-chosen wrong answers | Built |
| Teaching › a class › Insights | How the class uses the tutor | Planned |
| Teaching › a class › Insights | Page views and participation per student | Not yet |
| Teaching › a class › Insights | Question statistics (how hard, which wrong answer) | Built |
| Teaching › a class › Insights | Quiz statistics and item analysis | Partly built |
| Teaching › a class › Insights | Score distribution, average, median | Built |
| Teaching › a class › Insights | Similar questions to reteach with | Built |
| Teaching › a class › Insights | Time spent per student and per question | Partly built |
| Teaching › a class › Insights | Weekly class summary, and the weekly note to the class | Planned |
| Teaching › a class › Insights | What to reteach, by topic | Built |
| Teaching › a class › Insights | Who has not started, not signed in | Built |
| Teaching › a class › Live class | Access code on the projector to start | Built |
| Teaching › a class › Live class | Attendance as part of the grade | Not yet |
| Teaching › a class › Live class | Attendance by code or location | Not yet |
| Teaching › a class › Live class | Exit code: turn on, projector, new code | Built |
| Teaching › a class › Live class | Interactive content (H5P, slides with questions) | Not yet |
| Teaching › a class › Live class | Live polls with results on the projector | Not yet |
| Teaching › a class › Live class | Polls counted toward participation | Not yet |
| Teaching › a class › Live class | Seating charts | Not yet |
| Teaching › a class › Live class | Slides with questions built in | Not yet |
| Teaching › a class › Live class | Word clouds and open text answers | Not yet |
| Teaching › a class › People | AI groups answers for grading | Planned |
| Teaching › a class › People | AI groups similar answers to grade them at once | Planned |
| Teaching › a class › People | Accommodations per student (extra time) | Built |
| Teaching › a class › People | Add, edit, remove a student | Built |
| Teaching › a class › People | Co-teachers and TA permissions | Planned |
| Teaching › a class › People | Disability services set accommodations once | Planned |
| Teaching › a class › People | Exam proctor role: who is in, who left, notes (no answers) | Planned |
| Teaching › a class › People | Extra time and extra attempts for accommodations | Built |
| Teaching › a class › People | Lead educator versus co-teacher rights | Built |
| Teaching › a class › People | Photo roster | Not yet |
| Teaching › a class › People | Roster with students, sections, TAs | Built |
| Teaching › a class › People | Several educators on one class | Built |
| Teaching › a class › People | Student groups (projects, labs) | Not yet |
| Teaching › a class › People | TAs limited to their sections | Built |
| Teaching › a class › People | Upload a roster file | Built |
| Teaching › a class › Q&A | AI answers from course materials, checked by staff | Not yet |
| Teaching › a class › Q&A | AI summaries of a discussion | Not yet |
| Teaching › a class › Q&A | Educator endorses a good answer | Not yet |
| Teaching › a class › Q&A | Graded discussions | Not yet |
| Teaching › a class › Q&A | Mark as resolved, pin, categories | Not yet |
| Teaching › a class › View as student (top of every page) | Preview a question as a student | Built |
| Teaching › a class › View as student (top of every page) | Preview shows the same device block as students | Built |
| Teaching › a class › View as student (top of every page) | Try as a student: one item or the whole class | Planned |
| Everywhere (phone and offline) | Educator app for grading on the go | Not yet |
| Inbox | Announcements to a class or section | Built |
| Inbox | Classes without practice sets still open Students, Graded work, Announcements | Built |
| Inbox | Group messages | Not yet |
| Inbox | Message students who (missed, scored below, not started) | Not yet |
| Inbox | Pronunciation of names and pronouns | Not yet |
| Inbox | Schedule an announcement for later | Not yet |
| Me › Settings | Accessibility checker for the educator's content | Not yet |
| Me › Settings | Extra attempts per student | Partly built |
| Me › Settings | Extra time per student, carried to every exam | Built |
| Search (top of the bar) | Course search | Not yet |
| The frame | New left bar for staff (trial, off by default) | Partly built |
| Today | Professor's Today: what needs you across classes | Planned |

### Admins, coordinators, districts and parents (53)

| Home | Feature | Status |
|---|---|---|
| Admin › Classes | Admin console: classes, people, settings | Built |
| Admin › Classes | All classes in the bar, full access to each | Built |
| Admin › Classes | Blueprint: one master course syncing to many sections | Not yet |
| Admin › Classes | Content from publishers (Pearson, McGraw Hill, Wiley) | Not yet |
| Admin › Classes | Course templates | Not yet |
| Admin › Classes | Create classes and assign instructors | Built |
| Admin › Classes | Term rollover | Planned |
| Admin › Departments (Phase 4) | High school teachers | Planned |
| Admin › Departments (Phase 4) | School and department layer, coordinators | Planned |
| Admin › Departments (Phase 4) | Standards mapping | Planned |
| Admin › District (Phase 4) | District admin | Planned |
| Admin › Overview | First-time setup | Built |
| Admin › People | Custom roles and permissions | Not yet |
| Admin › Reports | Advisor view for early warning (agreed privacy rules) | Planned |
| Admin › Reports | Course evaluations | Not yet |
| Admin › Reports | Department chair view: results across sections, no names | Planned |
| Admin › Reports | Health: days active, sets finished, return after 7 days | Planned |
| Admin › Reports | Run experiments (A/B teaching) | Not yet |
| Admin › Reports | School-wide reports for admins | Partly built |
| Admin › Reports | Usage reports | Planned |
| Admin › Requests | Platform overview, access requests, classes in the bar | Built |
| Admin › Requests | Request access for a new course | Built |
| Admin › School settings | Any language on a server (Go, Rust, C#, R) | Planned |
| Admin › School settings › AI | AI budget per school, use by department and course | Planned |
| Admin › School settings › AI | Claude directory listing | Planned |
| Admin › School settings › AI | Runs on the educator's or student's own AI account | Built |
| Admin › School settings › AI | University AI and storage | Planned |
| Admin › School settings › Branding | Branding per school | Not yet |
| Admin › School settings › Data and security | Audit logs (who did what) | Partly built |
| Admin › School settings › Data and security | Backups and disaster recovery | Planned |
| Admin › School settings › Data and security | Data export and deletion on request | Partly built |
| Admin › School settings › Data and security | Data retention rules | Planned |
| Admin › School settings › Data and security | Error monitoring | Planned |
| Admin › School settings › Data and security | FERPA and GDPR compliance, data agreements | Not yet |
| Admin › School settings › Data and security | Free-limit guards so costs never surprise | Partly built |
| Admin › School settings › Data and security | Hosting in a chosen region | Not yet |
| Admin › School settings › Data and security | Security review and certifications (SOC 2, HECVAT) | Not yet |
| Admin › School settings › Data and security | Security review before launch | Planned |
| Admin › School settings › Data and security | Server backups and error monitoring | Planned |
| Admin › School settings › Data and security | Under-13 privacy | Planned |
| Admin › School settings › Data and security | Uptime guarantee and status page | Not yet |
| Admin › School settings › LMS | Import from another LMS (Common Cartridge, SCORM) | Not yet |
| Admin › School settings › LMS | Institution accounts with sub-accounts (faculties, departments) | Not yet |
| Admin › School settings › LMS | LTI: plug other tools in | Not yet |
| Admin › School settings › LMS | LTI: run inside another platform | Planned |
| Admin › School settings › LMS and apps | Google Drive and Microsoft 365 | Not yet |
| Admin › School settings › LMS and apps | Public API | Not yet |
| Admin › School settings › Rosters and grades | Roster and grade sync with the school's records (SIS) | Not yet |
| Admin › School settings › Rosters and grades | Roster synced from the school (SIS) | Not yet |
| Admin › School settings › Sign-in | School sign-in (SSO: SAML, Shibboleth, Microsoft) | Partly built |
| Help (Me › Help, and the public help centre) | Help centre | Planned |
| Parents (Phase 4): Today, Grades, Messages | Parent app | Not yet |
| Parents (Phase 4): Today, Grades, Messages | Parent or observer access | Not yet |
