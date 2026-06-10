# Phase 2: Book Catalog and Search - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-06-10
**Phase:** 2-Book Catalog and Search
**Areas discussed:** Student Catalog, Librarian CRUD, Availability and Delete Rules, Catalog API and Seed Data

---

## Student Catalog

| Decision | Options Considered | Selected |
|----------|--------------------|----------|
| Catalog display | Compact table/list; book cards; hybrid | Compact table/list |
| Search behavior | Single search box; separate fields; search plus advanced fields | Single search box |
| Filters | Category and availability; availability only; category/availability/author | Category and availability |
| Availability display | Status badge only; status plus disabled request button; hide unavailable by default | Status badge only |

**User's choice:** Recommended option for each question.
**Notes:** Borrow request controls are deferred to Phase 3.

---

## Librarian CRUD

| Decision | Options Considered | Selected |
|----------|--------------------|----------|
| Managed fields | Required core fields; core plus publisher/year; core with availability read-only | Required core fields |
| ISBN validation | Required/unique/light format; required/unique only; strict checksum | Required, unique, light format check |
| CRUD layout | Single Books page; separate list/add/edit pages; dashboard cards | Single Books page |
| Delete flow | Confirm hard-delete; soft-delete/archive; no delete UI yet | Confirm hard-delete |

**User's choice:** Recommended option for each question.
**Notes:** Core fields are title, author, category, ISBN, and availability.

---

## Availability and Delete Rules

| Decision | Options Considered | Selected |
|----------|--------------------|----------|
| Phase 2 availability meaning | Manual catalog status; always available until loans exist; derived only from future loans | Manual catalog status |
| Delete eligibility | Block with active loans; block when unavailable; allow now and add blocking later | Block with active loans |
| Editing unavailable/on-loan books | Edit descriptive fields, protect ISBN/delete; block all edits; allow all edits except delete | Edit descriptive fields, protect ISBN/delete |
| Future sync | Loan workflow takes over; keep manual override forever; remove availability field later | Loan workflow takes over |

**User's choice:** Recommended option for each question.
**Notes:** Phase 2 should prepare the loan-aware delete rule even before loan workflows exist.

---

## Catalog API and Seed Data

| Decision | Options Considered | Selected |
|----------|--------------------|----------|
| Role access | Shared list endpoint with role-gated writes; separate list endpoints; librarian-only API | Shared list endpoint with role-gated writes |
| Search/filter execution | Server-side query parameters; client-side filtering; both | Server-side query parameters |
| Seed data volume | 8-12 books; existing 3 books only; 30+ books | 8-12 books |
| Empty/error states | Simple inline states; toast notifications; redirect to dashboard | Simple inline states |

**User's choice:** Recommended option for each question.
**Notes:** Search/filter API behavior should be directly testable.

## the agent's Discretion

- Exact component boundaries, file names, and add/edit interaction style.
- Exact copy and styling for empty/error states.

## Deferred Ideas

None.
