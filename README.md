# Exam Practice

A free practice-exam website for your students. No logins, no database, no server.

Students open a link and can:

- **Take the real exam:** the actual exam questions in order, with a timer, scored at the end (answer choices are shuffled each time)
- **Mock exam:** a fresh exam every time, drawn from the whole bank with the same length and topic mix as the real one
- **Practice by topic,** run the **full question bank,** or build a **custom exam** (topics, difficulty, length, timer)
- Use **smart review** (spaced repetition), **my mistakes**, **saved questions** and **flashcards**
- **Browse** every question with search, answers and private notes
- Flag questions, cross out choices, use the built-in calculator, pause, and resume later
- See their scores, weakest topics, most-missed questions and an exam-readiness estimate
- Do **programming assignments**: write Java in the browser, run it with their own input, and check it against your tests instantly (compile errors look exactly like `javac`'s, and wrong output is shown side by side with the expected output)

On their first visit, students **pick their classes** (for example CS150). The home page then shows only those classes; they can change this any time in **Settings → My classes**.

**Two ways to run it:**

- **Without sign-in (default):** each student's progress is stored only in their own browser. The details are below.
- **With school sign-in (optional, free):** students sign in with their school Google account (for example `@sdsu.edu` only), their progress and assignment code follow them to any device, and you get an **Instructor dashboard** with every student's progress. See [Student sign-in](#7-student-sign-in-optional).

**Privacy without sign-in:** each student's progress is stored **only in their own browser**. Nothing is sent anywhere, so students can't see each other's data, and you don't see it either. Students can move progress between devices with **Settings → Export / Import**.

---

## 1. Put it online (one time, about 10 minutes)

You need a free GitHub account.

1. Create a new repository on GitHub (it can be private if your GitHub plan allows Pages on private repos; otherwise public).
2. Upload this whole folder to it. Either:
   - drag the files into the GitHub web page (**Add file → Upload files**), or
   - from a terminal:
     ```bash
     git init && git add . && git commit -m "Exam practice site"
     git branch -M main
     git remote add origin https://github.com/YOUR-NAME/YOUR-REPO.git
     git push -u origin main
     ```
3. On GitHub, go to **Settings → Pages**. Under **Build and deployment → Source**, choose **GitHub Actions**.
4. Go to the **Actions** tab and wait for "Check and publish" to turn green (about a minute). If it already ran before step 3, click it and choose **Re-run all jobs**.
5. Your site is at `https://YOUR-NAME.github.io/YOUR-REPO/`. Share that link with students.

From then on, **every time you push a change, the site checks your questions and republishes itself.** If a question file has a mistake, nothing is published (the previous version stays up) and the **Actions** tab shows the exact file and line to fix.

Cost: $0. GitHub Pages is free and handles thousands of visitors.

---

## 2. Folder layout

```
exams/
  midterm-2/
    questions.md      ← the questions for one exam
    images/           ← pictures used in those questions
  final/
    questions.md
  _template/          ← copied when you make a new exam (folders starting with _ are ignored)
app/                  ← the website itself (you don't need to touch this)
  config.js           ← site name, tagline and footer text
scripts/              ← build, preview and checking tools
.github/workflows/    ← automatic checking and publishing
```

**Every folder in `exams/` that contains a `questions.md` becomes an exam on the site.** You can also group exams by subject, one level deeper:

```
exams/
  CS150/
    Midterm 2/questions.md
    Final/questions.md
  CS160/
    Midterm 1/questions.md
```

The subject folder name (CS150) becomes the course label. On their first visit students choose which subjects they're taking, and the home page shows only those (they can change it in Settings). Each subject also gets its own link such as `…/#/course/cs150`; opening it counts as choosing that subject, so it's the best link to share with one class. When you add a new subject later, students who already chose see a "New on the site" note and can add it. Each subject can have its own `active: true` exam. You never edit a list of exams. Adding or deleting a folder adds or removes an exam.

To change the site name shown at the top, edit `app/config.js`.

---

## 3. Adding a new exam

### Option A: you have the questions as a PDF or Word file

1. Give the file to Claude and ask it to "convert this into questions.md for the exam practice site".
   - It splits the questions into topics using the file's own section headings. If there aren't any, it groups questions by subject and names the topics.
   - Anything it isn't sure about, like a missing answer key, is marked with `<!-- CHECK: ... -->`. The checker lists those as warnings until you remove them.
2. Save the result as `exams/<exam-name>/questions.md`, for example `exams/final/questions.md`.
3. Push. Done.

If you drop a PDF, Word or Excel file into `exams/` by mistake, the build tells you it can't be read. GitHub also opens an issue reminding you to convert it.

### Option B: start from the template

```bash
npm run new-exam
```

It asks for the exam name, the time limit, and whether this is the exam students should see first. Then it creates `exams/<name>/questions.md` from the template. Replace the example questions with yours.

### Option C: by hand

Copy `exams/_template` to a new folder (without the underscore), rename it, and edit `questions.md`.

### Switching from Midterm 2 to the Final

In `exams/final/questions.md` set `active: true`. In `exams/midterm-2/questions.md` set `active: false` and `archived: true`.

Midterm 2 then moves to "Past exams", where students can still practice with it, and the Final becomes the main exam. Students' Midterm 2 progress is kept separately.

---

## 4. Question format

Each exam is one plain-text file. Edit it in any text editor, or directly on github.com (open the file, click the pencil).

```markdown
---
title: Midterm 2
course: BIOL 101 · Fall 2026     # optional
description: Covers chapters 5–8 # optional, shown on the home screen
active: true                     # the exam students see first
archived: false                  # true = listed under "Past exams"
time_limit: 75                   # minutes for "Take the real exam"
pass_mark: 70                    # target score, in percent (optional)
exam_date: 2026-11-18            # optional, shows a countdown
---

# Topic: Recursion

## Q1 · single · easy · on-exam
What is the base case in a recursive factorial?
- [ ] n == 1 returns 0
- [x] n == 0 returns 1
- [ ] There is no base case
> Hint: What is 0! defined as?
> Explanation: 0! = 1, so the recursion stops at n == 0.
```

| Part | Meaning |
|---|---|
| `# Topic: Name` | Starts a topic. Every question below it belongs to that topic until the next `#` heading. |
| `## Q1 · …` | Starts a question. `Q1` is its ID: any letters/numbers, unique within the file. **Keep IDs stable** so students' progress carries over when you edit. |
| `single` `multi` `truefalse` `numeric` `text` | Question type. Optional: if left out it's guessed from the answers. |
| `easy` `medium` `hard` | Difficulty (default `medium`). |
| `on-exam` | Part of "Take the real exam", in file order. Mock exams copy the topic mix of these questions. If no question has it, the real exam uses every question. |
| `2pts` | Worth 2 points (default 1). |
| `- [ ]` / `- [x]` | Answer choices. `[x]` marks the correct one(s). |
| `= answer` | Answer for true/false, numeric and fill-in questions. |
| `> Hint:` | Optional hint (practice modes only, never in the real exam). |
| `> Explanation:` | Shown after answering. More `>` lines continue it. |
| `<!-- CHECK: note -->` | A note to yourself. Shows as a warning until you delete it. |

### The five question types

```markdown
## Q2 · multi
Which are mutable in Python? (Select all that apply)
- [x] list
- [ ] tuple
- [x] dict

## Q3 · truefalse
A horizontal line has an undefined slope.
= false

## Q4 · numeric
What is the positive root of x² − 2x − 8 = 0?
= 4
```

Numeric answers can be written as `= 42`, `= 3.14 ± 0.01`, `= 200 ± 5%`, or a range `= 2..3`.

Students can type decimals, negatives, `1,000`, or fractions like `1/4`.

```markdown
## Q5 · text
The organelle where photosynthesis happens is the ____.
= chloroplast | chloroplasts
```

Fill-in answers aren't case sensitive. Separate accepted alternatives with `|`.

### What you can put in question text

- **Formatting:** `**bold**`, `*italic*`, `` `code` ``, lists, tables
- **Math:** `$x^2$` inline, `$$\sum_{k=1}^n k$$` on its own line
- **Code blocks** with syntax highlighting:
  ````markdown
  ```python
  print("hi")
  ```
  ````
- **Images:** put the file in the exam's `images/` folder and write `![short description](images/diagram.png)`

---

## 4b. Programming assignments

Put assignments in an `assignments` folder inside the exam folder. Each assignment is a folder whose name starts with a number (the order):

```
exams/CS150/Midterm 2/
  questions.md
  assignments/
    01-movie-ticket/
      assignment.md        ← title, settings and the instructions students read
      MovieTicket.java     ← starter code students begin with
      solution/
        MovieTicket.java   ← your reference solution (never published)
      tests/
        test1_adult_evening.in     ← input typed into the program
        test1_adult_evening.out    ← exact output expected
        ...
      checks.txt           ← optional code requirements
```

`assignment.md` starts with a few settings, then the instructions in Markdown:

```markdown
---
title: Movie Ticket Pricer
class: MovieTicket                 # the Java class name (and file name)
order: 1
difficulty: medium                 # easy | medium | hard
estimate: 30 min
topics: if / else-if chains, logical operators, printf
sample_tests: test1_adult_evening, test2_child_matinee   # tests students can see before running
---

Write a program that prices one movie ticket. ...

## Hints
- First hint (students reveal hints one at a time)
- Second hint
```

`checks.txt` (optional) lists requirements on the code itself, one per line: `require:<regex>  # label` or `forbid:<regex>  # label`. The label is what students see, for example `require:\bswitch\s*\(  # Uses a switch statement`. Comments are ignored when checking.

**How grading works:** the student's program is compiled and run in their browser against every test. Output must match the `.out` file exactly, except that spaces at the ends of lines and blank lines at the very end don't matter. Tests not listed in `sample_tests` are hidden until the student runs them. Programs that loop forever are stopped after 5 seconds.

**Your solution is checked on every publish.** If the reference solution in `solution/` doesn't pass all of its own tests and checks, the build fails and tells you which test, so a typo in a `.out` file never reaches students. The `solution/` folder is never copied to the website. Keep it in the repo (a private repo keeps it fully hidden; in a public repo anyone browsing GitHub can read it).

**What Java is supported:** the CS150-level language: `Scanner` input, `System.out.print/println/printf`, `String.format`, primitives, `String` methods, `Math`, `Integer/Double` parsing, arrays, `if`/`switch` (including `case ->`), all loops, `break`/`continue`, static methods and recursion, and runtime exceptions with Java's own messages. Not supported yet: your own classes with objects, `ArrayList`, interfaces and generics. If a starter or solution uses something unsupported, the build tells you.

---

## 5. Checking and previewing on your computer (optional)

This needs [Node.js](https://nodejs.org) 18 or newer.

```bash
npm install        # once
npm run dev        # preview at http://localhost:5173, rebuilds when you save
npm run check      # only check the question files
npm test           # run the self-tests
```

You can also check a file without installing anything. On the live site, click **"For instructors: check a question file"** at the bottom of any page and drop your `questions.md` there. It lists any problems with line numbers and lets you try the exam as a student. The file never leaves your computer.

---

## 6. Things to know

- **Progress and assignment code live in each browser.** Code is saved automatically as students type. Students who switch devices or clear their browser data lose it unless they use Export/Import in Settings. Private/incognito windows don't keep it after closing.
- **Question IDs matter.** If you rename `Q7` to `Q8`, students' history for that question is treated as a new question. Changing the wording or answers is fine.
- **The real exam timer** keeps counting across a page reload (time spent away from the tab is not counted). When it runs out, answers are submitted automatically.
- **No tracking, no analytics, no cookies.** The only outside request is loading the fonts from Google Fonts. To remove it, delete the two `fonts.googleapis.com` lines in `app/index.html`; the site falls back to system fonts.

---

## 7. Student sign-in (optional)

With sign-in on:

- Students must sign in with a school Google account. Only emails ending in `@sdsu.edu` are accepted (change `allowedEmailDomain` in `app/config.js` for another school). SDSU email is Google, so students go through the normal SDSUid login.
- Each student's answers, scores, saved questions, notes and assignment code are saved to their account and appear on any device they sign in from. Signing out removes them from that browser, so shared lab computers are safe.
- You get an **Instructor** page showing every student: last active, questions tried, accuracy, quiz readiness, best real-exam score, assignments completed, the class's weakest topics, and each student's assignment code. You can download it all as a CSV.
- Students can only ever see their own data.

It runs on Google Firebase's free plan, which needs no credit card. The free plan allows 50,000 sign-ins a month, 1 GB of data, and 20,000 saves and 50,000 reads a day. The site saves at most every 90 seconds while a student is active, and a few seconds after they finish a quiz or run assignment tests, so a class of 1,000 stays well inside that. If a daily limit were ever reached, saving pauses until the next day (progress stays safe in the browser) and you are never charged.

### Setting it up (about 15 minutes, once)

1. Go to [console.firebase.google.com](https://console.firebase.google.com), sign in with a Google account, and click **Create a project**. Name it (for example `cramming`). You can turn Google Analytics off.
2. **Turn on Google sign-in:** in the left menu choose **Build → Authentication → Get started**. On the **Sign-in method** tab, click **Google**, switch it on, choose a support email and click **Save**.
3. **Allow your website address:** still in Authentication, open the **Settings** tab → **Authorized domains** → **Add domain**. Add `www.cramming.net` and `cramming.net` (and `YOUR-NAME.github.io` if you still use that address).
4. **Create the database:** **Build → Firestore Database → Create database**. Pick the **Standard** edition, a location near your students (for example `us-west2` for California), and **Start in production mode**.
5. **Set the security rules:** open `firestore.rules` from this folder, replace `your-email@sdsu.edu` with your own email (add teaching assistants too, comma separated, all lowercase), and change `sdsu[.]edu` if your school is different. In Firestore, open the **Rules** tab, delete what's there, paste the whole file and click **Publish**. These rules are what keep each student's data private, so don't skip this step.
6. **Connect the website:** click the gear icon → **Project settings**. Under **Your apps**, click the web icon `</>`, give it a nickname, and click **Register app** (you don't need Firebase Hosting). Copy the four values `apiKey`, `authDomain`, `projectId` and `appId` into the `firebase` section of `app/config.js`.
7. Push the change to GitHub. Once the site has republished, open it, sign in with your SDSU account, and you'll see an **Instructor** link at the top.

The `apiKey` in `config.js` is meant to be public; it only identifies your Firebase project. What protects the data is the rules from step 5.

**Adding or removing an instructor:** edit the list in the rules (step 5) and click **Publish** again.

**Turning sign-in off again:** empty the `apiKey` value in `app/config.js` and push. The site goes back to saving in each browser.

**Before collecting student data,** check your department's rules. Scores linked to student names are student records (FERPA in the US). The sign-in page tells students that their instructor can see their progress and code.
