# QAForge — V1 Scope Matrix

Authoritative reference for what must be built now versus what belongs to later phases.

---

## Authentication and access

| Item | V1 | V2+ | Notes |
|---|---|---|---|
| Email/password registration | ✓ | | Self-service |
| Email/password login | ✓ | | |
| Secure session (HTTP-only cookie) | ✓ | | |
| Logout | ✓ | | |
| Google OAuth | ✗ | — | Explicitly out of scope |
| SSO / external identity | ✗ | — | Explicitly out of scope |
| MFA | ✗ | — | Out of scope |
| Email verification | ✗ | — | Out of scope |
| Password reset | ✗ | — | Out of scope |
| Invitation-based registration | ✗ | — | Out of scope |

## Authorization

| Item | V1 | V2+ | Notes |
|---|---|---|---|
| Viewer role | ✓ | | |
| Editor role | ✓ | | |
| Approver role | ✓ | | |
| Admin role | ✓ | | |
| Backend role enforcement | ✓ | | |
| Admin user management UI | ✓ (basic) | | Role assignment by admin |
| Complex RBAC / entity-level permissions | ✗ | ✓ | |

## Feature knowledge

| Item | V1 | V2+ | Notes |
|---|---|---|---|
| Feature name | ✓ | | Required |
| Core Feature (mandatory dropdown) | ✓ | | Required |
| Description | ✓ | | Optional, free text |
| Owner (auto from auth user) | ✓ | | Auto-populated |
| Tags | ✓ | | |
| Jira ticket field | ✓ | | Optional, free text |
| Jira API integration | ✗ | ✓ | |
| Test Data (free text) | ✓ | | |
| Test Steps (free text) | ✓ | | |
| Mocking Steps (free text) | ✓ | | |
| APIs as cURL + description | ✓ | | |
| File attachments (API collection files) | ✓ | | Postman/cURL JSON; stored in GridFS |
| API execution | ✗ | — | Never executes cURL |
| MongoDB collections (names, free text) | ✓ | | |
| MongoDB collections as managed dropdown | ✗ | — | Out of scope entirely |
| Redis keys / patterns | ✓ | | Key/pattern only |
| Redis value / TTL / state | ✗ | — | Out of scope |
| Experiments (name + options + required) | ✓ | | |
| Experiment dependency graph | ✗ | ✓ | |
| Conflict detection | ✗ | ✓ | |
| Test Scenarios | ✗ | ✓ | |
| Asset relationships | ✗ | ✓ | |
| Dependency graph | ✗ | ✓ | |

## Feature lifecycle

| Item | V1 | V2+ | Notes |
|---|---|---|---|
| Create | ✓ | | |
| Edit | ✓ | | |
| Soft delete | ✓ | | |
| Last Verified / Mark as Verified | ✓ | | |
| Feature history (QAForge edits) | ✓ | | |
| Environment execution history | ✗ | ✓ | QA Utility |

## Quick Add

| Item | V1 | V2+ | Notes |
|---|---|---|---|
| Quick Add (Core Feature + name + notes) | ✓ | | Minimal friction |

## Import

| Item | V1 | V2+ | Notes |
|---|---|---|---|
| Feature CSV/Excel import | ✓ | | Current column format |
| Import preview / confirm | ✓ | | |
| Duplicate detection | ✓ | | |
| Import audit event | ✓ | | |
| Test Case import | ✗ | ✓ | Schema not yet fixed |

## Search

| Item | V1 | V2+ | Notes |
|---|---|---|---|
| Search across all feature fields | ✓ | | Backend MongoDB regex, debounced |
| Tag filter (from backend distinct query) | ✓ | | |
| Pending filter | ✓ | | |
| Owner filter UI | ✗ | ✓ | Backend param exists (?owner=), no UI yet |
| Vector / semantic search | ✗ | ✓ | |

## AI

| Item | V1 | V2+ | Notes |
|---|---|---|---|
| Read-only AI chat (full-page /agent route) | ✓ | | |
| Retrieval from QAForge knowledge | ✓ | | Full-context approach |
| Source references in answers | ✓ | | Feature pills link to detail pages |
| AI feedback submission (flag incorrect responses) | ✓ | | |
| AI feedback review UI (admin/approver) | ✓ | | Pending badge, review/dismiss, audit log |
| AI writes to QAForge | ✗ | ✓ | |
| AI executes APIs | ✗ | — | Never |
| AI modifies Redis | ✗ | — | Never |
| AI modifies experiments | ✗ | — | Never |
| Crisp / Detailed response modes | ✗ | ✓ | |
| RAG / vector retrieval | ✗ | ✓ | Only if full-context approach becomes insufficient |
| Email notifications for feedback review | ✗ | ✓ | No mail system in V1 |

## Audit and history

| Item | V1 | V2+ | Notes |
|---|---|---|---|
| Audit log (create/update/delete/import/verify) | ✓ | | |
| Before/after diff in audit | ✓ | | |
| Role change audit | ✓ | | |
| Environment execution audit | ✗ | ✓ | QA Utility |

## Deployment and infrastructure

| Item | V1 | V2+ | Notes |
|---|---|---|---|
| Docker containerization | ✓ | | |
| AWS/Kubernetes staging readiness | ✓ | | |
| MongoDB authenticated access (staging) | ✓ | | Kubernetes Secrets |
| Secure session cookie (staging) | ✓ | | secure=True on HTTPS |
| CORS restricted to frontend origin | ✓ | | |
| No secrets in Git or images | ✓ | | |
| Health check endpoint | ✓ | | |
| Structured logging (no credentials) | ✓ | | |
| Error responses without stack traces | ✓ | | |
| Non-root containers | ✓ (where practical) | | |
| Public internet exposure | ✗ | — | Internal only |
| Public SaaS hardening | ✗ | — | Not required |

## QA Utility integration

| Item | V1 | V2+ | Notes |
|---|---|---|---|
| QA Utility connection (per-user token + global fallback) | ✓ | | Auto-refresh on expiry |
| Redis read / set / delete | ✓ | | Via QA Utility API |
| Experiment get state | ✓ | | |
| Experiment set weights | ✓ | | Weights must sum to 100 |
| Experiment reset to previous | ✓ | | |
| Experiment enable / disable toggle | ✓ | | |
| Withdrawal mock (set) | ✓ | | Phone, provider, status, amount |
| VPA mock (set / delete) | ✓ | | KYC VPA setup |
| SIP details / setup / pause / cancel | ✓ | | |
| Automated test-state preparation (orchestration) | ✗ | ✓ | Multi-step cross-utility orchestration |
| Environment state verification | ✗ | ✓ | Verify state matches expected |
