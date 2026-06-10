# Phase 2: Book Catalog and Search - Context

**Gathered:** 2026-06-10
**Status:** Ready for planning

<domain>
## Phase Boundary

Deliver student-facing catalog browsing/search/filtering and librarian-facing book CRUD for the existing React, Express, and SQLite app. This phase covers book catalog records and availability display/rules only; borrow requests, approvals, active loans, returns, and loan history remain later phases.

</domain>

<decisions>
## Implementation Decisions

### Student Catalog
- **D-01:** Use a compact table/list for the student catalog so title, author, category, ISBN, and availability are easy to scan.
- **D-02:** Use one search box that searches across title, author, category, and ISBN.
- **D-03:** Expose category and availability filters in Phase 2.
- **D-04:** Show availability as a clear status badge only. Do not add borrow request buttons in this phase.

### Librarian Catalog CRUD
- **D-05:** Librarians manage required core book fields only: title, author, category, ISBN, and availability.
- **D-06:** ISBN is required, unique, and lightly format-checked. Accept common ISBN-10/ISBN-13 strings with hyphens; do not require checksum validation.
- **D-07:** Build a single librarian Books page with a table plus inline add/edit form or modal.
- **D-08:** Eligible deletes should require confirmation and then hard-delete the book record.

### Availability and Delete Rules
- **D-09:** In Phase 2, `available` is a manual catalog status controlled by librarians.
- **D-10:** Deletion must be blocked when active loan records exist, and allowed otherwise.
- **D-11:** When a book is unavailable/on loan, allow editing descriptive fields but protect ISBN and delete actions.
- **D-12:** Future loan/return workflows should take over availability automatically. Manual Phase 2 availability should not become a permanent override that can conflict with active loans.

### Catalog API and Seed Data
- **D-13:** Use the same book list endpoint for students and librarians, with role-gated write endpoints for create/edit/delete.
- **D-14:** Run search and filters server-side through query parameters such as `/api/books?search=&category=&availability=`.
- **D-15:** Seed a modest realistic catalog of about 8-12 books so search, category filtering, and availability states are demonstrable.
- **D-16:** Use simple inline empty/error states inside the catalog/books page for no matches and API failures.

### the agent's Discretion
- Choose exact component boundaries, route file names, and whether the librarian add/edit UI is inline or modal based on the existing React structure.
- Choose the exact wording and styling of no-results and error messages, keeping them clear and consistent with the current app shell.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Project Scope and Requirements
- `.planning/ROADMAP.md` — Defines Phase 2 goal, success criteria, and plan split.
- `.planning/REQUIREMENTS.md` — Defines `CAT-01` through `CAT-06`, especially search/filter and delete eligibility.
- `.planning/PROJECT.md` — Defines v1 scope, roles, tech stack, and out-of-scope boundaries.

### Prior Decisions
- `.planning/phases/01-application-foundation-and-role-login/01-CONTEXT.md` — Locks role-aware app shell, seeded demo accounts/books, HTTP-only cookie sessions, and demo-first priorities.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `server/src/db.js`: Already initializes a `books` table with `title`, `author`, `category`, `isbn`, `available`, and `created_at`.
- `server/src/seed.js`: Already seeds three sample books; expand this to 8-12 realistic records including multiple categories and availability states.
- `server/src/auth/guards.js`: Existing auth/role guards should protect librarian-only create/edit/delete routes.
- `client/src/api/auth.js`: Existing `requestJson` pattern can be mirrored or extracted for catalog API calls.
- `client/src/components/AppShell.jsx`: Navigation already includes student `Catalog` and librarian `Books` links.
- `client/src/styles.css`: Existing table/list/form styling should extend the current quiet, utilitarian app-shell design.

### Established Patterns
- Express routes live under `server/src/routes/*` and are mounted in `server/src/app.js`.
- SQLite access uses `better-sqlite3` prepared statements via `openDatabase()`.
- API errors return JSON `{ message }`, and the client displays simple inline messages.
- React currently uses local component state and direct fetch helpers; keep Phase 2 consistent unless planning finds a strong reason to introduce routing or a shared API client.
- The app currently has role-aware navigation labels but no real route switching yet; Phase 2 may need to make nav targets functional enough for Catalog and Books screens.

### Integration Points
- Mount catalog routes in `server/src/app.js`, likely under `/api/books`.
- Add server tests for list/search/filter and librarian-only write/delete behavior.
- Add student Catalog UI under the existing app shell.
- Add librarian Books CRUD UI under the existing app shell.
- Preserve Phase 3/4 compatibility by designing delete checks around active loan existence, even if the loans table is introduced later.

</code_context>

<specifics>
## Specific Ideas

- Student catalog should feel like a practical library lookup table, not a visual bookstore grid.
- Librarian workflow should be efficient CRUD on one page for course-demo clarity.
- Search/filter should be API-backed so behavior is testable and realistic despite SQLite/local demo scale.

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>

---

*Phase: 2-Book Catalog and Search*
*Context gathered: 2026-06-10*
