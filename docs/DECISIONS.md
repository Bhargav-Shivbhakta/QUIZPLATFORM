# Decisions

Decisions that shape Cramming, newest first, each with the reason. A decision changes only with a new entry that says so.

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

