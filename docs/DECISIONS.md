# Decisions

Decisions that shape Cramming, newest first, each with the reason. A decision changes only with a new entry that says so.

## 20 November 2026

- **FC (Final Cramming) comes first.** FC is Cramming with every feature on the system map. Nothing is built until it passes the FC check in `FC.md`: every FC feature that touches it, every scenario, each marked covered or fixed, slots kept for later phases, then Bhargav's yes. Only then are the launch parts built.

- **The Dot comes out of the app, everywhere.** Bhargav decided the study buddy and its animations distract more than they help. Today, Settings (Study buddy, the Flame) and every hop or pose go. This replaces the earlier "keep the Dot, add arms and legs" plan; its intro and poses are dropped from the system map.
- **Today at launch holds:** today's plan with one Start, the next exam and readiness, this week's study days, the professor's note, and coming-up deadlines (hidden when empty). The layout is chosen from three mockups of Today in the finished app.

## 17 November 2026

- **No trademark filing yet.** The $700 filing waits until a school is paying. Until then: ™ on the marks (legal without filing), consistent use, and an evidence folder of first-use dates.
- **Cramming belongs to its founder.** It was built on the founder's own laptop, with the founder's own Claude subscription and free services, outside any SDSU job and with no SDSU funding. SDSU professors use it but didn't develop it. So no SDSU ownership confirmation is needed. Keep this record, with dates, as evidence for trademark filings and contracts.
- **Request access, not self-serve sign-up,** for the pilot. We set up each first course by hand, which lets us choose pilot professors and learn from each one. Self-serve comes once setup is smooth.
- **The landing page sells to professors.** A class needs its professor to say yes. Students find "Sign in" in the header.
- **Policies are drafts until a lawyer reviews them.** Privacy, Terms, How we use AI and Accessibility are written in plain language and marked as drafts. Review them before public launch, and before any school signs anything.

- **Few features, each the finest.** Launch with five features that meet the bar in `STANDARDS.md`, not many that don't.
- **Product before integrations.** Schools adopt what teachers already rely on. LTI with Canvas, single sign-on and paid AI wait until a school is paying.
- **AI suggests, a person decides.** AI grading stays planned, not built, until a university connects its own approved AI. No student work goes to a personal AI account.
- **Order of work:** the landing page first, from what's live today. Then students, professors, admins, and what runs behind it. Each is polished to the bar before new features are added.
- **Subjects:** CS, Maths and Stats first, for high schools and colleges.
- **The logo never changes.** The look: classic and quiet, in the style of Apple's product pages.
- **Budget is zero for now.** Everything runs on free plans: GitHub Pages, Firebase Spark and Cloudflare Workers.
- **Roles come from records, not email patterns.** A school's staff list decides who is a professor or TA. An email pattern is only a hint.

## 17 November 2026: the founder releases

From now on Claude doesn't commit or push. It hands over zip files of the changed files and the founder uploads them; Claude pushes only when asked. Why: the founder wants to see and control every change that goes live.

## 17 November 2026: one look, "Clear"

The whole product uses one look: cool white and near-black, one blue (`#2443C4`, `#6E8BFF` in dark), set in Inter, with JetBrains Mono for code. Chosen by the founder from three options (Clear, Paper, Focus) on the "Cramming Look Options" canvas. Why: it's the landing page's look, which already reads as a real product, and one look everywhere makes Cramming feel like one product. Every value lives in `app/css/tokens.css`; the rules are in `docs/DESIGN.md`; the "Cramming Design System" artifact shows them. The signed-in app moves onto it when the design kit is built.

## 18 November 2026: policy pages after phase 1

The Privacy, Terms, How we use AI and Accessibility pages stay as drafts until phase 1 (every existing feature finished on the new look) is done. Then they are rewritten to match what the finished product really collects and does, the accessibility audit is run, and a lawyer reviews them before launch. Why: written now, they would describe features that are still changing.

## 18 November 2026: student navigation, motion and the study buddy

Decided by the founder from the clickable "Student Navigation Mockup":

- **One Today for all classes**, with class filters. A student with one class sees no filters, and Classes opens straight into that class. Everyone lands on Today. Why: students plan by time, not by class; one landing screen to design and test.
- **Today is the countdown** (direction A): the nearest exam in huge type, readiness as a ring, one Start button.
- **Each class has four tabs: Study plan, Practice, Notes, Graded work.** The Study plan shows the units on the way to the exam, with today's stop and the exam as a flag (direction B), and its line traces down to today's stop when the tab opens. "Study plan" replaces "Path" because it's what students in the US say.
- **Navigation:** Today, the classes, Progress. Bottom tabs on phones; a left bar on laptops and tablets (slim on tablets) with each class by name. Messages and Settings sit with the account. No choice of layout. Why: one layout per device, done well.
- **Motion: Full by default, Soft as a choice** in Settings; nothing in exams. Big moments are rationed (DESIGN › Motion).
- **The study buddy: the Dot** by default, with the Flame and "off" as choices in Settings. It hops out of the logo onto Today each morning. Its rules and moments are in DESIGN › The study buddy, so new features use it the same way. A trademark search on the names comes before public use.
- **Where every current student feature lives** is on the system map whiteboard ("Student navigation map") and in the mockup's "Where every feature lives" list.
- **Readiness shows the number and the word together** ("62% · Getting there"), decided by the founder. The word list says so.
- **Going live in stages:** step 1 puts the new frame (navigation, Today, class tabs, Progress, the Dot, Messages, Settings) in front of every student, with today's screens opening inside it and exams untouched. Then each feature is made flawless in turn, starting with Today's set.
- **Who gets the new frame first:** students only (on a roster, teaching no class, not an admin). Staff screens move later, journey by journey.

## 18 November 2026: one navigation for the whole app

Asked by the founder ("the initials open settings; I just want Sign out… notifications should be somewhere visible… make navigation standardised").

- **Four places: Today, Classes, Progress, Settings.** Settings joins the bar under Progress (and the fourth phone tab) instead of hiding behind the initials. Why: a place you visit to change things is a page, not a menu.
- **The initials open a small account menu**: name, email, Sign out. Nothing else goes in it.
- **The bell is top right on every page**, on every device. Why: the corner people look at for news on every site they use.
- **Class badges show the course number** ("150", "210") in the slim bar, so a student in two CS classes can tell them apart.
- **Every page has one way up**: a back link top left that names where it goes, decided in one tested place (`navmap.js`). The old breadcrumbs are hidden for students.
- **A double tap on the logo refreshes** class content and saves waiting progress, at most once a minute, and never reloads the page. Why: students will tap it to "make sure"; the limit keeps Firebase reads and writes where they are.
- **A new Settings page**: grouped cards (account, Studying, Appearance, Your data), switches and segmented controls, saved at once. Adds **Weekly goal** (2 to 5 days), which Today's "This week" uses.
- The rules are in DESIGN › Navigation and RULES D-29 to D-34, so professor and admin screens follow the same ones when their journeys come.


## 18 November 2026: the tagline, and "educator"

- **Tagline: "Small reps. Top grades.™"** It replaces "Cram the right way." The founder didn't want the word "cram" in the tagline. "Reps" (repetitions) fits the product: a few questions a day, and questions coming back before you forget them. A web search found no one using it; a trademark search on it and on "Cramming" comes before spending on the brand.
- **"Educator" is the general word for anyone who teaches a class.** Raised by the founder's mentor: high-school teachers, lecturers and instructors feel left out by "professor", and professors feel lowered by "instructor". Students see each educator by the name and title they choose; staff screens say "you". Screens change as they move to the new look.
- **The Dot shows arms and legs when it does something** (planned as named poses with the Today's set deep dive), and gets an introduction for new students.


## 19 November 2026: AI across the whole platform, in stages

The goal is AI built fully into Cramming, for students and educators. It comes in stages, so the privacy promise on the landing page ("Student work is never sent to an AI") stays true at every step, and the budget stays at zero until schools pay.

1. **Now: bring your own AI.** Educators build courses with their own Claude or ChatGPT; students connect their own AI to the course tutor. Free, and no student work goes to an AI.
2. **Next (free): Cloudflare Workers AI, course material only.** We already run Cloudflare Workers; its free plan gives 10,000 neurons a day (open models such as Llama, Mistral and Gemma). First feature: "Explain it another way" on a practice question, sending only the question and its worked answer, never who the student is or what they answered. Every answer is saved and shared, so each question costs once; a daily cap shows "Back tomorrow" instead of a bill; labelled as AI-written; each educator turns it on or off per course.
3. **Once schools pay: AI in the platform for everyone.** Students: hints on their own answers, the tutor inside Cramming, a personal study coach. Educators: drafting questions, AI-suggested grading of written answers and code, class insights. Run through the school's own AI (ChatGPT Edu, Gemini, Copilot) or a paid API under a data agreement. Before any student work goes to an AI: the landing page, Privacy and How we use AI are rewritten, the school agrees, and educators keep every decision that counts (RULES P-6).

Not used for student data: free AI tiers whose providers may use what is sent to improve their products (the free Gemini API, for one).


## 19 November 2026: declutter the student's mind (the north star)

- **The goal of every screen is to declutter the student's mind** and help them focus on what is actually needed. Simple and elegant, in the spirit of Apple's products, but our own: we copy no one, Apple included. Zero clutter: if the student doesn't need it right now, it isn't on the screen.
- **The step 1 student frame is rejected** (left bar on laptops, four tabs on phones): it looks like any other app. Navigation is redesigned laptop first, then phone, against this goal. A "shelf of class spines and a top capsule" mockup was also rejected. `navmap.js` (where each page sits, where Back goes) stays; only the frame around it changes.
- Recorded in DESIGN › Principles as the north star.

## 19 November 2026: Today is never empty, and the Dot studies with students

- **Student feedback: Today felt empty.** Decluttered is not empty: a page that says "nothing here" feels dead. Rule: Today always has something worth doing (the best optional step when nothing is due) and something worth knowing (the student's own week, classes and progress). No boxes that say "nothing yet".
- **Today, Classes, no dashboard.** Today is home (what to do now, across classes); each class page holds its material. The separate Progress page folds into these two.
- **Students love the Dot and want it to study with them.** The Dot is present more often across the platform, doing its small things (poses, reactions, studying beside you), always calm: never sad, never guilt. Planned in depth as its own piece of work, after the Today layout.

## 19 November 2026: better than every tool a course uses today

- **The goal:** Cramming does every job that Canvas, Gradescope, Quizlet and the other course tools do (courseware, polls, discussion, coding, proctoring, requests), and does each one better, in one place. Not a plug-in beside Canvas: the course's home.
- **Navigation is planned for all of it now,** today's features and future ones, before screens are redesigned. The research (who does what, and what Cramming has) is in the chat of 19 November 2026; the information architecture follows from it.
- **Still true:** declutter the student's mind; Today is never empty; the Dot studies with students.

## 19 November 2026: the frame is built for Phase 4 now, filled over time

- **One left bar for everyone**, designed for every feature through Phase 4: search, Live now (only while an exam or poll runs), Today, Inbox, Calendar, then the classes. The open class lists its sections under its name; the others stay one line. Your name at the bottom opens Me.
- **Students' class sections:** Ready, Learn, Practice, Graded work, Grades (Phase 1); Q&A and Class info (Phase 3); My group (Phase 4). Past classes (Phase 3).
- **Educators' class sections:** Overview, Build, Practice, Graded work, Insights, People, Class settings (Phase 1); Grading (Phase 2); Gradebook and Q&A (Phase 3); Live class (Phase 4). Past terms (Phase 3). Admin console for school admins.
- **An item stays hidden until its phase ships,** so students only see what works and the frame never has to be redesigned. Mockups: the design canvas "Cramming Navigation Explorations", page "The frame at Phase 4".
