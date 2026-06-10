# Phase 3: Member Management and Borrow Requests - Research

**Researched:** 2026-06-10
**Domain:** React + Express + SQLite member/borrow request workflow
**Confidence:** MEDIUM

## Key findings

- Phase 3 must reuse the existing student/librarian role model and add borrowing workflow behavior without introducing returns, due dates, or loan history.
- Member records should be built on top of existing student accounts to avoid a second identity graph and keep the UI simple.
- Borrow requests should be submitted from the catalog page and visible on a dedicated student "My requests" page.
- Librarian decision-making belongs on a single Borrow Requests page with approve/reject actions and optional rejection notes.
- Approving a request should create an active loan record now, update book availability, and preserve Phase 4's ability to add returns and history later.

## Implementation decisions

- Use the existing `users` table for member information and add a `member_active`/`can_borrow` flag rather than introducing a separate member table.
- Add `borrow_requests` and `loans` tables in `server/src/db.js` with foreign keys to `users` and `books`.
- Keep student request submission attached to the catalog rather than a separate selection workflow.
- Use one request status endpoint for students and one librarian-only pending-requests endpoint for review.
- Block duplicate pending requests and active loans for the same student/book pair at the API boundary.
- Keep rejection notes optional and show them in the student request status list.

## Canonical references

- `.planning/ROADMAP.md` — phase goal, success criteria, and plan split.
- `.planning/REQUIREMENTS.md` — MEM-01 through BOR-06 acceptance criteria.
- `.planning/phases/03-member-management-and-borrow-requests/03-CONTEXT.md` — locked decisions and out-of-scope boundaries.
- `server/src/auth/guards.js` — role guards for librarian-only actions.
- `client/src/components/AppShell.jsx` and `client/src/App.jsx` — current navigation and role-aware page handling.
- `client/src/components/BooksPage.jsx` and `client/src/components/CatalogPage.jsx` — existing page patterns to mirror for Members, My Requests, and Borrow Requests.

## Code context

- The server already has `users`, `sessions`, and `books` schema; Phase 3 can extend the schema in `server/src/db.js`.
- Existing route style uses `express.Router()` modules mounted in `server/src/app.js`.
- Client-side React uses local page state rather than a router, so new pages should be rendered behind `AppShell` and role-aware navigation.
- API helper patterns in `client/src/api/auth.js` should be reused for new `client/src/api/members.js` and `client/src/api/borrowRequests.js` helpers.

## Risk areas

- Member deactivation must not disable logins or hide history; it only blocks future borrowing.
- Approving a request while a book becomes unavailable must fail cleanly and preserve the pending request state.
- Duplicate request blocking must check both pending requests and active loans.

## Practical recommendation

- Implement Phase 3 in three waves: members, student request flow, librarian approval/loan creation.
- Keep API validation and business rules server-side so future Phase 4 loan/return changes can reuse the same tables and semantics.
