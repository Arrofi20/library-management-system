# Phase 4: Loans, Returns, History, and Demo Readiness - Context

**Gathered:** 2026-06-10
**Status:** Ready for planning

<domain>
## Phase Boundary

Deliver the final borrowing lifecycle completion and demo-ready loan workflows for the existing React/Express/SQLite app.

Phase 4 covers:
- Librarian active loan tracking
- Recording book returns
- Student active loan and loan history visibility
- Librarian loan history by member and by book
- Course-demo walkthrough polish for both student and librarian workflows

Phase 4 does not add due dates, overdue rules, fines, notifications, multi-copy inventory, or admin role management.
</domain>

<decisions>
## Implementation Decisions

### Student loan experience
- **D-01:** Add a dedicated student `My Loans` page. Keep the existing `My Requests` page focused on borrow-request status only.
- **D-02:** The `My Loans` page will show a combined loan timeline of active and returned loans with clear status badges.
- **D-03:** Returned loans remain visible in the student view as history entries, not hidden after the return is recorded.

### Librarian loans/navigation
- **D-04:** Add a new librarian `Loans` navigation target.
- **D-05:** Use one combined librarian `Loans` page with an active loans section at the top and loan history below, rather than splitting active loans and history into separate pages.
- **D-06:** Support loan-history lookup by member and by book through page-level filters and section headings on the combined Loans page.

### Return recording
- **D-07:** Record returns using an inline `Return` button on each active loan row in the librarian Loans page.
- **D-08:** The return action updates the loan status to `returned`, sets `returned_at`, and sets `books.available` back to `1` immediately.
- **D-09:** Returned loans remain visible in the same combined page as history entries.

### API and schema boundaries
- **D-10:** Introduce dedicated `/api/loans` endpoints for loan list and return actions, while keeping borrow-request approval behavior in `/api/borrow-requests`.
- **D-11:** Student loan queries should return loan rows with loan status, book title, borrowed_at, returned_at, and enough metadata to render the timeline.
- **D-12:** Librarian loan queries should return both active and returned loans and allow filtering by `memberId` and/or `bookId`.

### Discretion for implementers
- **D-13:** Follow existing React component patterns from `BooksPage`, `MembersPage`, `CatalogPage`, and `BookTable`.
- **D-14:** Keep wording utilitarian and consistent with current alerts, table headings, and status badges.
- **D-15:** Do not introduce due-date, overdue, fine, notification, or multi-copy behavior in this phase.
</decisions>

<canonical_refs>
## Canonical References

- `.planning/ROADMAP.md` — Phase 4 goal, success criteria, and plan split.
- `.planning/REQUIREMENTS.md` — LOAN-01 through LOAN-06 and DEMO-01.
- `.planning/PROJECT.md` — v1 scope, student/librarian role assumptions, and out-of-scope boundaries.
- `.planning/phases/03-member-management-and-borrow-requests/03-CONTEXT.md` — phase-3 decisions around borrow requests, active loan creation, duplicate blocking, and availability semantics.
- `server/src/db.js` — existing `loans` table schema and SQLite initialization patterns.
- `server/src/routes/borrowRequests.js` — current borrow-request and approval endpoints, plus active loan creation behavior.
- `client/src/App.jsx` — current page rendering and navigation structure.
- `client/src/components/AppShell.jsx` — current role-aware navigation and page button pattern.
- `client/src/components/CatalogPage.jsx` / `BookTable.jsx` — current request-entry experience and table action pattern.
- `client/src/components/MyRequestsPage.jsx` and `BorrowRequestsPage.jsx` — current student/librarian request state presentation and action model.
- `client/src/api/borrowRequests.js` — current API helper pattern and request shape.
</canonical_refs>

<code_context>
## Existing Code Insights

- The server already supports `borrow_requests` submission, pending request listing, approval, rejection, and loan creation. That means Phase 4 can build on existing active loan semantics instead of inventing a new request model.
- The `loans` table already exists in `server/src/db.js` with `student_id`, `book_id`, `borrow_request_id`, `status`, `borrowed_at`, and `returned_at`.
- `server/src/routes/borrowRequests.js` currently updates book availability to unavailable when a request is approved. Phase 4 will restore availability when a loan is returned.
- App navigation currently exposes student pages `Catalog` and `My Requests`, and librarian pages `Books`, `Members`, and `Borrow Requests`.
- There is no current student loans page or librarian loans page, so Phase 4 chooses page-level navigation additions rather than repurposing existing pages.
- Existing client-side patterns use local component state, table-based CRUD/list views, inline alert messages, and lightweight page switching rather than a router.
- The app already uses cookie-backed auth and `requestJson` helper patterns for backend API calls, so new loan endpoints should follow the same style.
</code_context>

<specifics>
## Specific Ideas

- Student `My Loans` should be discoverable from the student sidebar and should clearly distinguish active loans versus returned history through badges and returned dates.
- Librarian `Loans` page should lead with active loans and show `Return` action buttons; below the active section, a history section should let librarians review returned loans and filter by member or by book.
- Return behavior should feel immediate for a course demo: one-click return, availability restored, and the row updated to returned status.
- Loan history should include returned loans as first-class records rather than archiving them out of the page.
</specifics>

<deferred>
## Deferred Ideas

- Due-date, overdue, fine, notification, and multi-copy inventory behavior remain out of scope for Phase 4.
</deferred>

---
*Phase: 4 Loans, Returns, History, and Demo Readiness*
*Context gathered: 2026-06-10*
