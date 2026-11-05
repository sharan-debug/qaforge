# TestHub — Organisation Demo Deck
> Source document for the PPT presentation. Each section = one slide (or one slide group).
> Updated automatically as features are built. See **Change log** at the bottom for what is new.

---

## Slide 1 — The Problem

**What QA engineers deal with today**

- Test data, mock configs, Redis keys, API calls, and feature flags live in scattered Excel sheets, Confluence pages, Slack threads, and people's heads.
- Every test session starts with "who knows the setup for this feature?"
- Knowledge walks out the door when a team member leaves or moves team.
- Onboarding a new QA takes weeks because there is no single place to look.
- While doing cross collaboration its an added effort to understand the end to end flow along with mocking, important experiments, redis keys.

> **Show on screen:** An example Excel test-data sheet — highlight how hard it is to find one specific Redis key or experiment flag.

---

## Slide 1b — Landing Page (first impression)

**What the audience sees before they even log in**

- Visiting the TestHub URL shows a branded landing page — no login wall as first impression.
- Sections: hero headline → the problem → full feature grid → AI assistant spotlight → sign-in CTA.
- Authenticated users are taken straight to the dashboard; the landing page is only for new visitors.
- Same visual language as the app: indigo gradient, Chivo headings, IBM Plex Sans body.
- **Automatic dark mode** — the landing page follows the viewer's system/browser preference instantly. No extra setting needed; the same light/dark toggle that works inside the app also applies to the landing page.

> **Show on screen:** Open the TestHub URL while logged out. Scroll through the landing page — hero, problem cards, feature grid, mock AI chat, and the CTA. Toggle your OS dark mode on/off to show the page switching themes automatically. Then click "Sign in to TestHub".

---

## Slide 2 — The Solution: TestHub

**One place for all QA knowledge**

- TestHub is an internal knowledge hub purpose-built for QA teams.
- Any engineer can store and find: test data, mock steps, automation APIs, Redis keys, MongoDB collections, and experiment/feature flags — all linked to a named feature.
- Built on the team's existing stack: React + Python + MongoDB, containerised with Docker, deployed internally on AWS / Kubernetes.
- Access through the company network or VPN — no public exposure.

> **Show on screen:** Log in → watch the branded welcome splash appear with the user's name, role badge, and a random tip → splash fades and the home page appears with four large navigation cards (Browse Features, Quick Add, Import Sheet, Ask the AI). Click each card to show the navigation.

---

## Slide 3 — How It Works: Feature Knowledge Cards

**Structured, searchable knowledge per feature**

Each TestHub Feature card stores:

- Feature name + Core Feature grouping
- Description and owner
- Test data and test steps (free text)
- Mocking steps
- Automation APIs — stored as ready-to-run cURL commands
- MongoDB collection names used by this feature
- Redis key patterns (e.g. `r:jar:cancellation:{user_id}`)
- Experiments / feature flags with required option (e.g. `TEST`, `VARIANT_A`)
- Optional Jira ticket reference
- Last verified date — so the team knows if the knowledge is stale

> **Show on screen:** Open a feature card and walk through each section tab.

---

## Slide 4 — Quick Add: Low Friction by Design

**Adding knowledge takes less time than updating a spreadsheet**

- Quick Add flow: select a Core Feature → enter Feature Name → paste notes → save.
- No mandatory fields beyond name. Add detail over time.
- Bulk import from your existing Excel/CSV sheets — column mapping built in.
- Import preview shows what will be created before anything is saved.

> **Show on screen:** Click "Quick Add", fill three fields, hit save. Then show the Import page and upload a sample CSV.

---

## Slide 5 — Search: Find Anything Instantly

**Search across every field — not just the feature name**

- Full-text search covers: feature name, description, tags, test data, mocking steps, Redis keys, experiments, MongoDB collections, cURL APIs.
- Filter by Core Feature, owner, or tag.
- Results show which fields matched.

> **Show on screen:** Type a Redis key pattern into the search bar and show the matching feature appearing immediately.

---

## Slide 6 — AI Chat: Ask Instead of Search

**Ask questions in plain English — get answers with sources**

- Built-in AI assistant knows the entire TestHub knowledge base.
- Ask: "What Redis keys does the cancellation flow use?" or "How do I mock the eligibility API?"
- AI responds with the exact stored data and cites which feature it came from.
- AI is read-only — it cannot modify TestHub, Redis, or any system.
- All AI calls go through the Python backend; the model API key never reaches the browser.

> **Show on screen:** Open the AI chat panel. Type a question about a known feature. Show the response with the source citation.

---

## Slide 7 — Roles and Access Control

**The right people can do the right things**

| Role | Can do |
|---|---|
| Viewer | Read all features, search, use AI chat |
| Editor | Create and edit features, import |
| Approver | Review and approve features submitted for review |
| Admin | Manage users and roles |

- Roles are enforced server-side — the frontend cannot bypass them.
- New accounts default to Editor. Admin promotes users via the admin panel.
- Every create, edit, delete, and import is recorded in an audit log.

> **Show on screen:** Log in as a Viewer — show that Edit and Delete buttons are hidden. Log in as an Editor — show they appear.

---

## Slide 8 — Security: Production-Ready from Day One

**Built to internal security standards**

- Passwords hashed with bcrypt — plaintext passwords never stored.
- Sessions stored server-side in MongoDB with automatic expiry (7 days). Expired sessions are deleted automatically via a database TTL index.
- HTTP-only, same-site cookie — not accessible from JavaScript.
- Cookie set to `secure=true` in staging (HTTPS only).
- **Rate limiting** on login (10 attempts/minute per IP) and registration (5/minute) — brute-force protection.
- CORS restricted to expected frontend origins only.
- nginx serves security headers: `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`, `X-XSS-Protection`. Server version is hidden.
- Stack traces never returned in API error responses.
- 10 MB request body limit — protects against oversized payloads.

> **Show on screen:** Try logging in 11 times with a wrong password — show the 429 Too Many Requests response after 10.

---

## Slide 9 — Deployment and Infrastructure

**Runs wherever your team already runs containers**

- Three containers: React/nginx frontend · Python/FastAPI backend · MongoDB
- Orchestrated with Docker Compose locally; targets Kubernetes on AWS for staging.
- Resource limits built in:

| Container | Memory limit | CPU limit |
|---|---|---|
| Frontend (nginx) | 128 MB | 0.2 cores |
| Backend (FastAPI) | 512 MB | 0.5 cores |
| MongoDB | 1 GB | 0.5 cores |

- Health and readiness endpoints for Kubernetes probes (`/api/health`, `/api/ready`).
- Non-root container user for the backend.
- Secrets (MongoDB credentials, AI API key) via environment variables / Kubernetes Secrets — never hardcoded in images or Git.

> **Show on screen:** `docker-compose up` from scratch — show all three containers starting, then open the app.

---

## Slide 10 — Audit Trail

**Every change is tracked**

- Every create, update, delete, and import writes an audit event.
- Event records: who, what, when, which feature, which fields changed.
- Gives the team confidence that knowledge changes are traceable and reversible.

> **Show on screen:** Edit a feature, then open the Activity feed on the dashboard to show the audit entry.

---

## Slide 11 — What's Coming: V2

**Planned next — based on team feedback after V1**

- Test Scenarios linked to features
- Jira ticket auto-population via Jira API
- Relationships and dependency mapping between features
- AI-assisted feature enrichment (suggest missing Redis keys, experiments)
- Flexible test-case import formats
- QA Utility integration — execute mocks, verify Redis state, toggle Unleash flags

> **Show on screen:** V1 scope matrix — show the clear V1 / V2 boundary.

---

## Slide 12 — Demo Summary

**What you just saw**

- Find any QA knowledge in seconds, not hours.
- Add or update knowledge in the same effort as editing a spreadsheet.
- AI answers questions using your team's own stored data.
- Secure, role-controlled, fully audited.
- Runs on your existing internal infrastructure today.

**Next step:** Pilot with one QA squad — migrate one feature domain from Excel into TestHub and measure time-to-find over two sprints.

---

## Change log

> Updated by Claude after each significant change. Presenter: check this section before each demo to see what is new.

| Date | Change | Slide affected |
|---|---|---|
| 2026-11-05 | Initial deck created from V1 feature set | All slides |
| 2026-11-05 | Rate limiting on login/register (slowapi, 10/min and 5/min) | Slide 8 |
| 2026-11-05 | nginx security headers added (X-Frame-Options, CSP headers, Referrer-Policy, etc.) | Slide 8 |
| 2026-11-05 | CORS tightened to explicit methods and headers | Slide 8 |
| 2026-11-05 | Session TTL index — expired sessions auto-deleted from MongoDB | Slide 8 |
| 2026-11-05 | Docker Compose resource limits added for all three containers | Slide 9 |
| 2026-11-05 | Post-login splash screen — branded welcome with user name, role badge, tip, and animated progress bar | Slide 2 |
| 2026-11-05 | Home page navigation cards — Browse Features, Quick Add, Import Sheet, Ask the AI | Slide 2 |
| 2026-11-05 | Landing page at root URL — hero, problem, feature grid, AI spotlight, CTA; unauthenticated-only | Slide 1b |
| 2026-11-05 | Landing page dark mode — all sections now follow system/browser preference automatically | Slide 1b |
| 2026-11-05 | Login page dark mode — background, card, inputs, labels, and illustrations all adapt to system theme | Slide 2 |
