# Design

How Cramming looks, sounds and moves. Every new screen or feature starts here. The look is **Clear**, chosen on 17 November 2026: cool white and near-black, one blue, set in Inter.

Three places hold the design, and they always agree:

| Where | What it holds | Who reads it |
|---|---|---|
| `app/css/tokens.css` | Every colour, font, size, space, corner, shadow and motion value, in light and dark | The code. Every stylesheet uses these and nothing else |
| `docs/DESIGN.md` (this file) | When and how to use each one, the parts, the words | Anyone building a screen |
| The Design System artifact ["Cramming Design System"](https://claude.ai/artifact/Kpn36zV5wgjeaf754V3cJf) | The same tokens and parts, shown live | Anyone who wants to see it |

Change a value in `tokens.css` first, then update this file and the artifact in the same change. `npm test` fails if a stylesheet writes a colour of its own or uses a token that doesn't exist.

## Principles

1. **One clear next step per screen.** One primary button. Everything else is secondary or a link.
2. **Practice feels like practice.** Timers, answer sheets and Finish buttons appear only in graded or timed work the student chose.
3. **Feedback at once.** An answer is checked and explained within 400 ms, with no page jump.
4. **Show progress that is real:** questions done today, topic readiness, days to the exam. Never invented points.
5. **Calm, not loud.** No fake urgency, guilt, confetti storms or leaderboards of grades. See the research doc "Cramming: Designing a Study App Students Return To".
6. **Everyone can use it:** keyboard, screen reader, phone, light and dark, 200% zoom.

## Colour

Use the token, never the hex. Light and dark values switch automatically.

| Token | Light | Dark | Use for |
|---|---|---|---|
| `--cr-bg` | `#FBFBFC` | `#0B0B0D` | The page |
| `--cr-surface` | `#FFFFFF` | `#17181B` | Cards, sheets, inputs |
| `--cr-soft` / `--cr-soft-2` | `#F1F2F5` / `#F4F5F8` | `#141518` / `#1E1F23` | Quiet fills: code, progress track, hover |
| `--cr-ink` | `#1C1D21` | `#F2F2F4` | Main text |
| `--cr-ink-2` | `#5B5D66` | `#A9ABB3` | Secondary text, descriptions |
| `--cr-ink-3` | `#6B6D76` | `#9A9CA4` | Hints, timestamps (still passes 4.5:1) |
| `--cr-line` / `--cr-line-2` | `#E6E7EB` / `#DADCE2` | `#2A2B30` / `#34353B` | Dividers / input and card borders |
| `--cr-accent` | `#2443C4` | `#6E8BFF` | The one action colour: primary buttons, links, focus, progress |
| `--cr-accent-ink` | `#FFFFFF` | `#0B0B0D` | Text on the accent |
| `--cr-accent-soft` | `#EEF1FC` | `#1C2340` | Selected and "New" backgrounds |
| `--cr-right` / `-soft` | `#15703A` / `#EAF6EE` | `#4ADE80` / `#132A1C` | A right answer, done |
| `--cr-wrong` / `-soft` | `#C2410C` / `#FDF0E8` | `#FB923C` / `#2E1D12` | A wrong answer (orange, never red: a mistake isn't danger) |
| `--cr-warn` / `-soft` | `#A15C07` / `#FDF4E3` | `#F5B544` / `#2D2410` | Something needs attention soon |
| `--cr-danger` | `#B4441A` | `#F28B6B` | Errors, and destructive actions such as Delete |
| `--cr-badge` | `#C7361F` | `#C7361F` | The count dot on Admin and the bell |
| `--cr-band-*` | dark in both themes | | Dark sections on the landing page and product pictures |

Rules:
- **One accent.** Blue means "you can act here". Don't use it for decoration.
- **Meaning colours mean one thing.** Green is right or done, orange is wrong, amber is attention, the danger colour is errors and Delete. Never use them for decoration, and always pair them with a word or icon so colour isn't the only signal.
- **Contrast:** text at least 4.5:1 against its background, large text and icons 3:1. Every pair in the table passes.
- **Class colours** (each class's own colour chosen by its professor) appear only as a small dot or stripe that identifies the class, never as a background for text.

## Type

Inter for everything. JetBrains Mono for code, plain-text maths and numbers that line up. KaTeX for typeset maths.

| Token | Size | Use for |
|---|---|---|
| `--cr-text-display` | 40 to 72 px | Landing page headlines only |
| `--cr-text-3xl` | 44 px | A page's main heading on large screens |
| `--cr-text-2xl` | 32 px | Page heading |
| `--cr-text-xl` | 24 px | Section heading, card title |
| `--cr-text-lg` | 20 px | Question text, lead paragraph |
| `--cr-text-md` | 17 px | Body text (the default) |
| `--cr-text-sm` | 15 px | Secondary text, buttons, table cells |
| `--cr-text-xs` | 13 px | Labels, timestamps, captions (the smallest allowed) |

Rules:
- Weights: 400 for text, 500 for labels, 600 for buttons and headings, 700 for page headings and the display size.
- Headings: tight letter spacing (`--cr-tracking-tight`), `text-wrap: balance`, line height `--cr-leading-tight`.
- Body: line height `--cr-leading` (1.5), lines no wider than about 70 characters.
- Sentence case everywhere ("Request access", not "Request Access"). No uppercase labels.
- Numbers in tables and timers use `font-variant-numeric: tabular-nums`.

## Space, corners, shadow

- **Space** comes in steps of 4px: `--cr-space-1` (4) to `--cr-space-16` (64). Use `gap` on flex and grid, not margins between siblings.
- **Corners:** `--cr-radius-sm` (8) for small chips and code, `--cr-radius` (12) for inputs and options, `--cr-radius-lg` (16) for cards, `--cr-radius-xl` (24) for sheets and dialogs, `--cr-radius-pill` for buttons and status pills.
- **Shadow** only on things that float above the page: sheets, menus, the product pictures. Cards on the page use a border, not a shadow.
- **Touch targets** at least `--cr-tap` (44px) high.

## Motion

- Ease: `--cr-ease`. Durations: `--cr-fast` (150 ms) for hover and press, `--cr-base` (250 ms) for things opening and closing, `--cr-slow` (450 ms) for sections arriving.
- Motion explains: something appears where it came from, a check pops when an answer is right, progress fills. Nothing moves just to move. No tilt, parallax or scroll-jacking.
- The page never jumps on its own. Move focus with `{ preventScroll: true }` and keep what the reader was looking at in place.
- Everything respects "reduce motion": it still works, with no movement.

## Parts

Build every screen from these. Before making a new part, check this list. A new part is added here and to the Design System artifact before it ships.

| Part | Looks like | Rules |
|---|---|---|
| Primary button | Accent fill, accent-ink text, pill, 44px tall | One per screen. A verb: "Start", "Save", "Send request" |
| Secondary button | Surface, `--cr-line-2` border, ink text | For the other actions |
| Quiet button | Underlined text, no box | Skip, Cancel, Not now |
| Danger button | Danger text and border; filled only inside its confirmation | Always asks first, and says what will be lost |
| Card | Surface, `--cr-line` border, `--cr-radius-lg`, 24 to 28px padding | Only to separate one object from others |
| Input | Surface, `--cr-line-2` border, `--cr-radius`, 16px text, label above | Error message under it, in danger colour, saying how to fix it |
| Choice chips | Pills; selected = accent-soft fill, accent border, a tick | Real checkboxes or radios underneath |
| Status pill | Small pill: New (accent-soft), done (right-soft), attention (warn-soft), neutral (soft) | A word, never colour alone |
| Answer option | `--cr-radius` box, 50px tall; right = right border and fill with "Correct"; wrong = wrong border and fill with "Not this one" | The explanation appears under the options, without moving the page |
| Progress bar | 8px track in soft, accent fill | Always with a label: "7 of 10 done" |
| Sheet / dialog | Surface, `--cr-radius-xl`, scrim behind | Title, close button, Escape closes, focus returns to the opener |
| Toast | Small, bottom, disappears after a few seconds | Says what happened in past tense: "Saved" |
| Empty state | A sentence saying what will appear and one button to start | Never zeros or a blank box |

## Words

- Plain, kind, specific. Say what happens: the button says "Send request"; the toast says "Request sent".
- Write for the person on the screen: "your class", "your students".
- Errors say what went wrong and how to fix it, without blame or apology.
- No jargon: "spaced review", not "SRS"; "sign in", not "authenticate".
- US spelling: practice, color (in text), center.
- Numbers as digits: "4 min", "12 days".

## Checklist for a new screen

1. Uses only `--cr-` tokens and the parts above (`npm test` checks the colours).
2. One primary button. Clear title. A real empty, loading and error state.
3. Works by keyboard, with visible focus and labels on every control.
4. Checked on a phone and a laptop, in light and dark mode, and axe shows nothing.
5. Nothing moves the page by itself; reduce motion is respected.
6. Every word read aloud once.
