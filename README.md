# Exam Practice

A free practice-exam website for your students. No logins, no database, no server.

Students open a link and can:

- **Take the real exam:** the actual exam questions in order, with a timer, scored at the end
- **Practice by topic,** run the **full question bank,** or build a **custom exam** (topics, difficulty, length, timer)
- Use **smart review** (spaced repetition), **my mistakes**, **saved questions** and **flashcards**
- **Browse** every question with search, answers and private notes
- Flag questions, cross out choices, use the built-in calculator, pause, and resume later
- See their scores, weakest topics, most-missed questions and an exam-readiness estimate

**Privacy:** each student's progress is stored **only in their own browser**. Nothing is sent anywhere, so students can't see each other's data, and you don't see it either. Students can move progress between devices with **Settings → Export / Import**.

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

**Every folder in `exams/` that contains a `questions.md` becomes an exam on the site.** You never edit a list of exams. Adding or deleting a folder adds or removes an exam.

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
| `on-exam` | Part of "Take the real exam", in file order. If no question has it, the real exam uses every question. |
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

- **Progress lives in each browser.** Students who switch devices or clear their browser data lose it unless they use Export/Import in Settings. Private/incognito windows don't keep it after closing.
- **Question IDs matter.** If you rename `Q7` to `Q8`, students' history for that question is treated as a new question. Changing the wording or answers is fine.
- **The real exam timer** keeps counting across a page reload (time spent away from the tab is not counted). When it runs out, answers are submitted automatically.
- **No tracking, no analytics, no cookies.** The only outside request is loading the fonts from Google Fonts. To remove it, delete the two `fonts.googleapis.com` lines in `app/index.html`; the site falls back to system fonts.
