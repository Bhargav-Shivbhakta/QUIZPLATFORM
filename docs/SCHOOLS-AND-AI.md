# Connecting schools, and the AI choice

Proposed 20 November 2026, waiting for Bhargav's approval.

## We never use the university's database

Universities don't give outside software access to their databases, and Cramming doesn't need it. They connect through four standard doors that every large school already has. Cramming keeps its own data (in its own Firestore, under a student-data agreement) and talks to the school only through these doors.

| What the school has | The standard door | What Cramming gets | Who sets it up |
|---|---|---|---|
| School sign-in (Shibboleth/InCommon, Microsoft Entra, Google Workspace, Okta) | **SSO**: SAML 2.0 or OpenID Connect | Students sign in with their school account; no new passwords; the school decides who gets in | The school's IT adds Cramming once; we paste their details into Cramming |
| Canvas, Blackboard, D2L Brightspace, Moodle | **LTI 1.3 Advantage** | Cramming opens inside the course already signed in; the class list comes over (Names and Roles); grades go back into the LMS gradebook (Assignment and Grade Services); professors add Cramming activities from the LMS (Deep Linking) | The school's LMS admin registers Cramming once |
| The student records system (Banner, PeopleSoft, Workday Student) | **OneRoster 1.2** (file or API); for high schools **Clever** or **ClassLink** | Classes, sections and students before the term starts, kept up to date | The school's IT, once a term at most |
| Nothing of the above | **Roster file** (built today) | The professor uploads the class list | The professor |

### How one school is plugged in

Each school gets one **school connection** in the admin console: its sign-in (SSO details), its LMS registration, where its rosters come from, its AI choice, and its data region. Adding a school is filling in that page, not writing code. That is the "few strokes": the code for each door is built once and works for every school.

School sign-in (SAML or OpenID Connect) is free on Firebase for the first 50 users a month, then charged at Google Cloud Identity Platform rates. The school plan price covers it.

When the school's system is slow or down, Cramming keeps working: rosters and grades sync in the background and retry (docs/SCALE.md, "School systems").

### Where the data lives

- **Standard:** Cramming's own database in the US (multi-region), under a FERPA student-data agreement where Cramming acts as a "school official".
- **For large schools that ask:** a separate Cramming database just for them, in the region they choose. Same app, its own project.
- **Always:** the school can export all its data or have it deleted on request.

## The AI choice: three options for every school

The school chooses, and can change it any time. Professors can always turn the tutor off for their class, and AI is always off during exams.

| | **1. Cramming AI** | **2. The school's own AI** | **3. No AI** |
|---|---|---|---|
| What it is | We provide the AI; it just works | The school connects the AI account it already pays for: Azure OpenAI, Amazon Bedrock, Google Vertex AI, or Claude (Anthropic) | Every AI feature is hidden |
| Who pays for the AI | Cramming, built into the price | The school, directly to its AI company | Nobody |
| Price from Cramming | School plan + AI add-on ($3 per student per year) | School plan only | School plan only |
| Student data | Under Cramming's agreement with the AI company | Stays under the school's own AI agreement, which many universities already have | Never sent to AI |
| Best for | Small schools, departments, high schools | Large universities with an AI contract and rules about it | Schools not ready for AI |

At 20 million students the AI costs about 12 cents per student per year on Claude Haiku 5.5 (docs/SCALE-REPORT.md), so the $3 add-on covers AI grading too.

Individual professors on the free plan keep **bring your own AI** (their own key), as planned.

### How it plugs in

Every AI call goes through one **AI gateway** (a Cloudflare Worker). It reads the school connection and sends the request to that school's provider with that school's key. The key is kept on the server and never reaches the page. The gateway also enforces each school's budget and rate limits and keeps a usage log per department and course. Adding a new AI provider means adding one adapter to the gateway, and every school can then choose it.

## When each part comes (from the system map)

| Part | When |
|---|---|
| Roster file, Google sign-in, bring your own AI | Built |
| AI gateway with the three options | Before the paid AI model (Phase 3) |
| LTI 1.3, SSO, OneRoster, Clever and ClassLink | Expansion. Suggestion: move LTI earlier if the first schools use Canvas, since most will ask for it |
| A separate database in the school's region | Expansion, when a school asks |
