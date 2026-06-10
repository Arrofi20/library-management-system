# Phase 3: Member Management and Borrow Requests - Context

**Gathered:** 2026-06-10
**Status:** Ready for planning

<domain>
## Phase Boundary

Deliver librarian member management and the borrow request approval workflow for the existing React, Express, and SQLite app. This phase covers student member records, member deactivation, student request submission/status, librarian approval/rejection, duplicate request blocking, and active-loan creation. Loan return workflows, loan history views, due-date rules, fines, notifications, and admin tooling remain outside this phase.

</domain>

<decisions>
## Implementation Decisions

### Member Records and Deactivation
- **D-01:** Reuse existing student user accounts as member records rather than creating a separate member identity model.
- **D-02:** Librarians can create and manage student/member records through the existing user/member identity fields: name, member ID, email, and role-compatible student account data.
- **D-03:** Deactivating a member blocks future borrowing only. It must not disable student login or hide the student's existing request/loan history.
- **D-04:** Build one librarian Members page with a table plus inline add/edit form, matching the existing librarian Books page pattern.

### Student Borrow Requests
- **D-05:** Students request available books directly from the catalog table.
- **D-06:** Students get a "My requests" view showing pending, approved, and rejected requests.
- **D-07:** Each request should show book title, author, request date, status, and a rejection note when present.
- **D-08:** The request flow should stay attached to catalog search rather than introducing a duplicate book-selection workflow.

### Librarian Review and Decisions
- **D-09:** Librarians use one Borrow requests page focused on pending requests, with approve and reject actions.
- **D-10:** Rejection notes are optional.
- **D-11:** Approving a request immediately creates an active loan, marks the book unavailable, and marks the request approved.
- **D-12:** A request cannot be approved while the selected book is unavailable.

### Duplicate Blocking and Loan Creation
- **D-13:** Block duplicate borrow requests when the same student already has a pending request or active loan for the same book.
- **D-14:** Other students' pending requests for the same book remain pending after one request is approved, but cannot be approved while the book is unavailable.
- **D-15:** Active loan records created in Phase 3 should include student/member ID, book ID, approved request ID, loan start date, and status.
- **D-16:** Do not add due-date, overdue, fine, or return behavior in Phase 3.

### the agent's Discretion
- Choose exact component names, route file names, and state boundaries based on the existing React and Express structure.
- Choose exact empty/loading/error message wording, keeping it consistent with existing inline app messages.
- Choose whether the request rejection note is collected inline in the table or through a compact form/modal, as long as the Borrow requests page remains simple for the course demo.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Project Scope and Requirements
- `.planning/ROADMAP.md` - Defines Phase 3 goal, success criteria, and plan split.
- `.planning/REQUIREMENTS.md` - Defines `MEM-01` through `MEM-04` and `BOR-01` through `BOR-06`.
- `.planning/PROJECT.md` - Defines v1 scope, roles, tech stack, and out-of-scope boundaries.

### Prior Decisions
- `.planning/phases/01-application-foundation-and-role-login/01-CONTEXT.md` - Locks student/librarian roles, student signup fields, HTTP-only cookie sessions, role-aware navigation, and demo seed expectations.
- `.planning/phases/02-book-catalog-and-search/02-CONTEXT.md` - Locks compact catalog tables, server-side book search/filtering, role-gated book write endpoints, availability semantics, and the expectation that loan/return workflows take over availability automatically.

### Existing Code
- `server/src/db.js` - Defines current `users`, `sessions`, and `books` schema plus SQLite initialization patterns.
- `server/src/routes/books.js` - Shows Express route style, validation, role-guard usage, book availability updates, and JSON error format.
- `server/src/auth/guards.js` - Provides `requireAuth` and `requireRole` guards for student/librarian access control.
- `client/src/App.jsx` - Owns current page state and role-gated page rendering.
- `client/src/components/AppShell.jsx` - Owns role-aware navigation pattern.
- `client/src/components/BooksPage.jsx` - Existing librarian table plus inline form CRUD pattern to mirror for Members.
- `client/src/components/CatalogPage.jsx` - Existing student catalog page where request actions should be added.
- `client/src/api/books.js` and `client/src/api/auth.js` - Existing client API helper patterns.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `server/src/auth/guards.js`: Reuse `requireRole("librarian")` for member management and librarian request decisions; use student auth for request submission/status.
- `server/src/db.js`: Extend the existing SQLite schema with member status fields and new request/loan tables while preserving `foreign_keys = ON`.
- `server/src/routes/books.js`: Follow current route validation, `better-sqlite3` prepared statement, and `{ message }` error response patterns.
- `client/src/components/BooksPage.jsx`: Reuse the same page shape for librarian Members: table/list, inline add/edit form, loading/error/success state.
- `client/src/components/CatalogPage.jsx` and `client/src/components/BookTable.jsx`: Add request actions for available books in the existing compact table experience.
- `client/src/api/auth.js`: Continue using `requestJson` for new API modules.

### Established Patterns
- Server routes live under `server/src/routes/*` and are mounted in `server/src/app.js`.
- SQLite access uses direct prepared statements through `openDatabase()`.
- API access is role-gated with cookie-backed sessions and returns JSON payloads with simple `{ message }` errors.
- React currently uses local component state and page switching through `App.jsx`, not a router.
- Frontend screens use compact forms, tables, inline alerts, and quiet utilitarian styling in `client/src/styles.css`.

### Integration Points
- Add librarian navigation targets for `Members` and `Borrow requests` in `client/src/components/AppShell.jsx`.
- Add student navigation target for `My requests` while keeping catalog as the request entry point.
- Add Phase 3 page rendering in `client/src/App.jsx`.
- Add server routes likely under `/api/members`, `/api/borrow-requests`, and `/api/loans` or an equivalent simple naming pattern.
- Update book availability on approval so Phase 2's manual availability does not conflict with Phase 3 active loans.
- Add server tests for member CRUD/deactivation, request submission/status, duplicate blocking, approval/rejection, unavailable-book approval blocking, and active-loan creation.
- Add frontend tests for catalog request action, My requests status display, Members page CRUD/deactivation, and Borrow requests approval/rejection flow.

</code_context>

<specifics>
## Specific Ideas

- Member management should feel like the existing librarian Books workflow: practical table plus nearby form, not a multi-screen admin system.
- The student request flow should be visible from the catalog so the demo path is easy: search book, click request, view request status.
- Approval should visibly bridge Phase 2 and Phase 4 by creating active-loan data now while leaving returns/history to Phase 4.

</specifics>

<deferred>
## Deferred Ideas

None - discussion stayed within phase scope.

</deferred>

---

*Phase: 3-Member Management and Borrow Requests*
*Context gathered: 2026-06-10*
