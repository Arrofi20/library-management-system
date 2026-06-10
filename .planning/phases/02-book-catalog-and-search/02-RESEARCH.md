# Phase 2: Book Catalog and Search - Research

**Researched:** 2026-06-10  
**Domain:** React + Express + SQLite catalog search and CRUD  
**Confidence:** MEDIUM

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
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

### Deferred Ideas (OUT OF SCOPE)
## Deferred Ideas

None — discussion stayed within phase scope.
</user_constraints>

## Summary

Phase 2 should add a modular `/api/books` Express router mounted from `server/src/app.js`, backed by the existing `books` table and `better-sqlite3` prepared statements. [VERIFIED: codebase grep] Express official docs describe `express.Router` as a modular, mountable routing system and show mounting routers with `app.use`, which matches the current `authRoutes` pattern. [CITED: https://expressjs.com/en/guide/routing/]

The API should own search, category filtering, availability filtering, ISBN uniqueness, role-gated writes, and delete eligibility. [VERIFIED: codebase grep] React should own table/list presentation, controlled search/filter inputs, inline empty/error states, and the single librarian Books workflow. [CITED: https://react.dev/reference/react-dom/components/input] [CITED: https://react.dev/learn/rendering-lists]

**Primary recommendation:** Use the existing stack and patterns; do not introduce new dependencies for Phase 2. Repair the local dependency install before relying on tests because the current `node_modules` has a non-executable Vitest shim, a missing Rollup optional native package, and an invalid `better-sqlite3` native binary. [VERIFIED: command output]

## Project Constraints (from AGENTS.md)

- Use React, Node.js, Express, and SQLite. [VERIFIED: AGENTS.md]
- Keep v1 focused on complete CRUD and borrowing workflow for the course demo. [VERIFIED: AGENTS.md]
- Support only Student and Librarian roles. [VERIFIED: AGENTS.md]
- Persist data in SQLite. [VERIFIED: AGENTS.md]
- Follow existing patterns found in the codebase because architecture and conventions are not yet fully documented. [VERIFIED: AGENTS.md]
- Do not make direct repo edits outside a GSD workflow unless explicitly bypassed by the user. [VERIFIED: AGENTS.md]

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| CAT-01 | Student can view a list of books with title, author, category, ISBN, and availability status. | Existing `books` table already has those fields; student UI should render a compact table/list. [VERIFIED: codebase grep] |
| CAT-02 | Student can search books by title, author, category, or ISBN. | Use server-side query parameters and parameterized `LIKE` predicates across all four fields. [CITED: https://www.sqlite.org/lang_expr.html] |
| CAT-03 | Student can filter books by availability and category. | API should validate `availability` to `available/unavailable/all` or `1/0`, and category should be exact-match from known catalog values. [VERIFIED: codebase grep] [ASSUMED] |
| CAT-04 | Librarian can create a book record. | Use `requireRole("librarian")`, validate required fields, and insert through a prepared statement. [VERIFIED: codebase grep] [CITED: https://github.com/WiseLibs/better-sqlite3/blob/master/docs/api.md] |
| CAT-05 | Librarian can edit an existing book record. | Allow descriptive-field edits for all books; protect ISBN when unavailable/on-loan per locked decision D-11. [VERIFIED: CONTEXT.md] |
| CAT-06 | Librarian can delete a book record that is not currently on loan. | Implement delete eligibility as an active-loan existence check, not as `books.available`; current code has no loan table yet, so isolate the check in one helper for Phase 3/4 extension. [VERIFIED: codebase grep] |
</phase_requirements>

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|--------------|----------------|-----------|
| Book list retrieval | API / Backend | Database / Storage | The API must apply shared search/filter rules for both roles; SQLite stores the catalog. [VERIFIED: CONTEXT.md] |
| Search across title/author/category/ISBN | API / Backend | Database / Storage | Locked decision D-14 requires server-side query parameters; SQLite `LIKE` supports the needed pattern matching. [VERIFIED: CONTEXT.md] [CITED: https://www.sqlite.org/lang_expr.html] |
| Category and availability filters | API / Backend | Browser / Client | The API should validate query values; React only controls the filter inputs and renders results. [VERIFIED: CONTEXT.md] |
| Librarian create/edit/delete | API / Backend | Browser / Client | Role enforcement belongs in Express via existing guards; React provides forms and confirmation UI. [VERIFIED: codebase grep] |
| Delete blocked by active loan | API / Backend | Database / Storage | Delete eligibility is a business rule that must not be bypassable by UI changes. [VERIFIED: CONTEXT.md] |
| Catalog/Books navigation | Browser / Client | none | Current `AppShell` renders labels but always links to `#dashboard`; Phase 2 needs client view state for Catalog and Books screens. [VERIFIED: codebase grep] |
| Seed catalog expansion | Database / Storage | API / Backend | `server/src/seed.js` already owns demo users/books and should expand to 8-12 books. [VERIFIED: codebase grep] |

## Standard Stack

### Core

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Express [VERIFIED: codebase package-lock + npm registry] | Installed 4.22.2; latest 5.2.1 modified 2026-05-19 [VERIFIED: npm registry] | HTTP API routes and middleware | Existing app uses Express 4 CommonJS route modules; stay on current major for Phase 2 compatibility. [VERIFIED: codebase grep] |
| `better-sqlite3` [WARNING: flagged as suspicious by legitimacy seam due latest publish recency - verify before upgrade.] | Installed 12.10.0; latest 12.10.0 modified 2026-05-12 [VERIFIED: npm registry] | Synchronous SQLite prepared statements | Existing database layer uses this package and enables `PRAGMA foreign_keys = ON`. [VERIFIED: codebase grep] |
| React [WARNING: legitimacy seam flagged latest React line as too-new - do not upgrade during Phase 2.] | Installed 18.3.1; latest 19.2.7 modified 2026-06-08 [VERIFIED: npm registry] | Catalog and Books UI | Existing client is React 18 with local state and no router dependency. [VERIFIED: codebase grep] |
| SQLite | CLI 3.51.2; embedded runtime blocked by invalid native module in current install [VERIFIED: command output] | Catalog persistence | Required by project direction and already used by `server/src/db.js`. [VERIFIED: AGENTS.md] [VERIFIED: codebase grep] |

### Supporting

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| Vitest [WARNING: legitimacy seam flagged latest line as too-new - do not upgrade during Phase 2.] | Installed 4.1.8; latest 4.1.8 modified 2026-06-01 [VERIFIED: npm registry] | Server/client tests | Keep existing test runner; repair install before running. [VERIFIED: command output] |
| Supertest [VERIFIED: codebase package-lock + npm registry] | Installed 7.2.2; latest 7.2.2 modified 2026-01-06 [VERIFIED: npm registry] | Express API tests | Existing server tests already use `request(app)` and `request.agent(app)`. [VERIFIED: codebase grep] |
| React Testing Library [VERIFIED: codebase package-lock + npm registry] | Installed 16.3.2; latest 16.3.2 modified 2026-01-19 [VERIFIED: npm registry] | UI tests | Existing client tests query visible text, forms, and buttons. [VERIFIED: codebase grep] |
| `@testing-library/user-event` [VERIFIED: codebase package-lock + npm registry] | Installed 14.6.1; latest 14.6.1 modified 2025-12-13 [VERIFIED: npm registry] | User interaction tests | Existing tests use it for login/register flows. [VERIFIED: codebase grep] |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Existing local React state | React Router | Not needed for two role-scoped screens; would add dependency and migration work. [VERIFIED: codebase grep] |
| SQLite `LIKE` search | SQLite FTS5 | FTS is unnecessary for 8-12 demo books and would complicate seeding/tests. [VERIFIED: CONTEXT.md] [ASSUMED] |
| Manual validation helpers | Zod/Joi | No validation library exists in the project; simple field checks match Phase 1 patterns. [VERIFIED: codebase grep] |

**Installation:**

```bash
# No new packages are recommended for Phase 2.
# If verification is blocked by the current broken install, repair dependencies from the existing lockfile:
npm install
```

**Version verification:** Package versions and latest registry metadata were checked with `npm view`; package names were also checked through `gsd-tools query package-legitimacy check --ecosystem npm ...`. [VERIFIED: npm registry]

## Package Legitimacy Audit

> Phase 2 should not add new external packages. This audit covers the existing stack the phase should reuse. [VERIFIED: codebase package.json]

| Package | Registry | Age | Downloads | Source Repo | Verdict | Disposition |
|---------|----------|-----|-----------|-------------|---------|-------------|
| Express | npm | Latest published 2025-12-01 [VERIFIED: npm registry] | 107,666,746/wk [VERIFIED: npm registry] | github.com/expressjs/express [VERIFIED: npm registry] | OK | Approved; keep current Express 4 major. |
| `better-sqlite3` | npm | Latest published 2026-05-12 [VERIFIED: npm registry] | 6,869,585/wk [VERIFIED: npm registry] | github.com/WiseLibs/better-sqlite3 [VERIFIED: npm registry] | SUS: too-new | Keep existing dependency; planner should add dependency-repair checkpoint before tests if native binary remains invalid. |
| React | npm | Latest published 2026-06-01 [VERIFIED: npm registry] | 134,410,428/wk [VERIFIED: npm registry] | github.com/facebook/react [VERIFIED: npm registry] | SUS: too-new | Do not upgrade; keep React 18.3.1 from existing project. |
| React DOM | npm | Latest published 2026-06-01 [VERIFIED: npm registry] | 126,517,903/wk [VERIFIED: npm registry] | github.com/facebook/react [VERIFIED: npm registry] | SUS: too-new | Do not upgrade; keep React DOM 18.3.1 from existing project. |
| Vite | npm | Latest published 2026-06-01 [VERIFIED: npm registry] | 129,170,441/wk [VERIFIED: npm registry] | github.com/vitejs/vite [VERIFIED: npm registry] | SUS: too-new | No Phase 2 upgrade; use existing scripts only. |
| Vitest | npm | Latest published 2026-06-01 [VERIFIED: npm registry] | 64,617,933/wk [VERIFIED: npm registry] | github.com/vitest-dev/vitest [VERIFIED: npm registry] | SUS: too-new | No upgrade; repair local install before verification. |
| Supertest | npm | Latest published 2026-01-06 [VERIFIED: npm registry] | 14,371,138/wk [VERIFIED: npm registry] | github.com/ladjs/supertest [VERIFIED: npm registry] | OK | Approved. |
| `@testing-library/react` | npm | Latest published 2026-01-19 [VERIFIED: npm registry] | 42,509,901/wk [VERIFIED: npm registry] | github.com/testing-library/react-testing-library [VERIFIED: npm registry] | OK | Approved. |
| `@testing-library/user-event` | npm | Latest published 2025-01-21 [VERIFIED: npm registry] | 35,604,597/wk [VERIFIED: npm registry] | github.com/testing-library/user-event [VERIFIED: npm registry] | OK | Approved. |

**Packages removed due to [SLOP] verdict:** none. [VERIFIED: package-legitimacy seam]  
**Packages flagged as suspicious [SUS]:** `better-sqlite3`, React, React DOM, Vite, Vitest because the seam flags latest publish recency; this is an upgrade warning, not a reason to replace the existing stack. [VERIFIED: package-legitimacy seam]

## Architecture Patterns

### System Architecture Diagram

```text
Student or Librarian session cookie
  -> React AppShell view state
    -> Student Catalog screen OR Librarian Books screen
      -> catalog API helper builds /api/books query string
        -> Express /api/books router
          -> attachCurrentUser middleware
          -> GET / applies search/category/availability predicates
          -> POST/PUT/DELETE apply requireRole("librarian")
            -> validation helpers normalize book fields and ISBN
            -> better-sqlite3 prepared statements
              -> books table
              -> optional active-loan check helper for delete
                -> if active loan exists: 409 JSON error
                -> otherwise: hard delete and JSON success
```

### Recommended Project Structure

```text
server/src/
├── routes/books.js        # /api/books list/search/filter and librarian CRUD
├── books/validation.js    # field normalization and ISBN format checks
├── books/queries.js       # prepared SQL helpers and delete eligibility helper
└── seed.js                # expanded 8-12 book catalog

client/src/
├── api/books.js                 # requestJson-based catalog API helpers
├── components/CatalogPage.jsx   # student list/search/filter view
├── components/BooksPage.jsx     # librarian CRUD page
├── components/BookTable.jsx     # shared table/status badge rendering
└── App.jsx / AppShell.jsx       # minimal role-aware view state and nav selection
```

### Pattern 1: Modular Express Router

**What:** Add `server/src/routes/books.js` with `express.Router()`, mount it with `app.use("/api/books", booksRoutes)`, and apply `requireRole("librarian")` only to write routes. [CITED: https://expressjs.com/en/guide/routing/] [VERIFIED: codebase grep]  
**When to use:** All catalog endpoints in Phase 2. [VERIFIED: CONTEXT.md]  
**Example:**

```javascript
// Source: Express routing docs and existing server/src/routes/auth.js
const express = require("express");
const { requireRole } = require("../auth/guards");

const router = express.Router();

router.get("/", listBooks);
router.post("/", requireRole("librarian"), createBook);
router.put("/:id", requireRole("librarian"), updateBook);
router.delete("/:id", requireRole("librarian"), deleteBook);

module.exports = router;
```

### Pattern 2: Parameterized SQLite Queries

**What:** Build a small array of allowed `WHERE` clauses and bind values through `better-sqlite3` parameters. [CITED: https://github.com/WiseLibs/better-sqlite3/blob/master/docs/api.md]  
**When to use:** Search/filter endpoint and CRUD operations. [VERIFIED: CONTEXT.md]  
**Example:**

```javascript
// Source: better-sqlite3 API docs and SQLite LIKE docs
function escapeLike(value) {
  return String(value).replace(/[\\%_]/g, "\\$&");
}

function listBooks({ search, category, availability }) {
  const where = [];
  const params = {};

  if (search) {
    params.search = `%${escapeLike(search.trim())}%`;
    where.push(`(
      title LIKE @search ESCAPE '\\' OR
      author LIKE @search ESCAPE '\\' OR
      category LIKE @search ESCAPE '\\' OR
      isbn LIKE @search ESCAPE '\\'
    )`);
  }

  if (category) {
    params.category = category.trim();
    where.push("category = @category");
  }

  if (availability === "available" || availability === "unavailable") {
    params.available = availability === "available" ? 1 : 0;
    where.push("available = @available");
  }

  const sql = `SELECT id, title, author, category, isbn, available
               FROM books
               ${where.length ? `WHERE ${where.join(" AND ")}` : ""}
               ORDER BY title COLLATE NOCASE`;
  return openDatabase().prepare(sql).all(params);
}
```

### Pattern 3: React Controlled Filters and Stable Table Keys

**What:** Keep search/category/availability in local component state, fetch when filters change or on submit, and render rows with `book.id` keys. [CITED: https://react.dev/reference/react-dom/components/input] [CITED: https://react.dev/learn/rendering-lists]  
**When to use:** Student Catalog and librarian Books pages. [VERIFIED: CONTEXT.md]  
**Example:**

```jsx
// Source: React input and list rendering docs
function CatalogFilters({ filters, onChange }) {
  return (
    <form className="toolbar">
      <input
        aria-label="Search catalog"
        value={filters.search}
        onChange={(event) => onChange({ ...filters, search: event.target.value })}
      />
      <select
        aria-label="Availability"
        value={filters.availability}
        onChange={(event) => onChange({ ...filters, availability: event.target.value })}
      >
        <option value="">All availability</option>
        <option value="available">Available</option>
        <option value="unavailable">Unavailable</option>
      </select>
    </form>
  );
}
```

### Anti-Patterns to Avoid

- **Client-only search/filter:** This would violate D-14 and make API behavior untested. [VERIFIED: CONTEXT.md]
- **Interpolating user input into SQL strings:** This risks SQL injection and mishandles wildcard characters; bind parameters instead. [CITED: https://github.com/WiseLibs/better-sqlite3/blob/master/docs/api.md]
- **Using `books.available` as the delete guard:** D-10 requires active-loan records to block deletes, while D-09 says availability is manual in Phase 2. [VERIFIED: CONTEXT.md]
- **Adding borrow buttons to the catalog:** D-04 explicitly excludes borrow request actions from Phase 2. [VERIFIED: CONTEXT.md]
- **Introducing React Router only for two screens:** Existing app has no router and Phase 2 can use role-aware view state. [VERIFIED: codebase grep]

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| HTTP routing and role middleware | Custom request dispatcher | Express Router + existing `requireRole` | Existing app already uses Express route modules and guards. [VERIFIED: codebase grep] |
| SQL escaping | Manual string concatenation | `better-sqlite3` prepared statement bind parameters | Docs support anonymous and named binds; execution errors throw. [CITED: https://github.com/WiseLibs/better-sqlite3/blob/master/docs/api.md] |
| Search engine | Custom index or FTS layer | SQLite `LIKE` with escaped wildcards | Demo catalog size is 8-12 books per D-15. [VERIFIED: CONTEXT.md] |
| Form framework | New form/validation library | Local React state + small validation helpers | Existing app already uses plain controlled forms. [VERIFIED: codebase grep] |
| Modal system | New modal dependency | Inline form or simple native confirmation | D-07 allows inline or modal; D-08 only requires delete confirmation. [VERIFIED: CONTEXT.md] |

**Key insight:** The complex part is not catalog storage; it is preserving business-rule ownership in the API while keeping the React screens small and demo-focused. [VERIFIED: CONTEXT.md]

## Common Pitfalls

### Pitfall 1: Delete Guard Coupled to Availability

**What goes wrong:** A librarian cannot delete any unavailable book even if it has no active loan, or can delete an available book that does have a loan record. [VERIFIED: CONTEXT.md]  
**Why it happens:** Phase 2 availability is manual, while loan existence is the real delete rule. [VERIFIED: CONTEXT.md]  
**How to avoid:** Implement a `bookHasActiveLoan(db, bookId)` helper and call it before hard delete. [VERIFIED: CONTEXT.md]  
**Warning signs:** DELETE route checks only `available = 1`. [ASSUMED]

### Pitfall 2: Future Loan Schema Coupling

**What goes wrong:** Phase 2 guesses a detailed loan schema and conflicts with Phase 3/4 implementation. [VERIFIED: ROADMAP.md]  
**Why it happens:** CAT-06 mentions active loans before loan workflows exist in the codebase. [VERIFIED: codebase grep]  
**How to avoid:** Isolate the delete check behind a helper and document the expected future contract; do not build loan workflow UI in Phase 2. [VERIFIED: CONTEXT.md]  
**Warning signs:** Phase 2 adds loan approval, return dates, or student loan history screens. [VERIFIED: ROADMAP.md]

### Pitfall 3: Unescaped LIKE Wildcards

**What goes wrong:** Searching for `%`, `_`, or backslash behaves like wildcard search rather than literal text. [CITED: https://www.sqlite.org/lang_expr.html]  
**Why it happens:** SQLite `LIKE` treats `%` and `_` specially. [CITED: https://www.sqlite.org/lang_expr.html]  
**How to avoid:** Escape `%`, `_`, and `\`, then use `ESCAPE '\'` with a bound parameter. [CITED: https://www.sqlite.org/lang_expr.html]  
**Warning signs:** Tests omit searches for ISBNs with hyphens or terms containing wildcard characters. [ASSUMED]

### Pitfall 4: Navigation Labels Without Reachable Views

**What goes wrong:** Catalog and Books links appear but still show Dashboard. [VERIFIED: codebase grep]  
**Why it happens:** `AppShell` currently maps all nav links to `href="#dashboard"`. [VERIFIED: codebase grep]  
**How to avoid:** Add minimal selected-view state in `App.jsx` and pass active link metadata to `AppShell`. [VERIFIED: codebase grep]  
**Warning signs:** Tests assert nav labels exist but never click Catalog or Books. [VERIFIED: codebase grep]

### Pitfall 5: Dependency Install Assumptions

**What goes wrong:** Planner assumes tests can run, but current local install fails before tests execute. [VERIFIED: command output]  
**Why it happens:** `node_modules/.bin/vitest` is not executable, Rollup's native optional package is missing, and `better-sqlite3` has an invalid native ELF header. [VERIFIED: command output]  
**How to avoid:** Add a Wave 0 dependency repair/checkpoint before implementation verification. [VERIFIED: command output]  
**Warning signs:** `npm run test:server` exits 126 or Vitest startup reports missing `@rollup/rollup-linux-x64-gnu`. [VERIFIED: command output]

## Code Examples

Verified patterns from official sources:

### Create Book Validation

```javascript
// Source: existing auth validation style and Phase 2 decisions
function requiredString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function validIsbn(value) {
  return /^(?:97[89]-?)?[0-9-]{10,17}[0-9Xx]$/.test(String(value || "").trim());
}

function normalizeBookPayload(body) {
  return {
    title: String(body.title || "").trim(),
    author: String(body.author || "").trim(),
    category: String(body.category || "").trim(),
    isbn: String(body.isbn || "").trim(),
    available: body.available === false || body.available === 0 ? 0 : 1
  };
}
```

### Role-Gated Delete

```javascript
// Source: Express routing docs, existing guards, and SQLite FK docs
router.delete("/:id", requireRole("librarian"), (req, res) => {
  const db = openDatabase();
  const book = db.prepare("SELECT id FROM books WHERE id = ?").get(req.params.id);

  if (!book) {
    return res.status(404).json({ message: "Book not found." });
  }

  if (bookHasActiveLoan(db, book.id)) {
    return res.status(409).json({ message: "Books currently on loan cannot be deleted." });
  }

  db.prepare("DELETE FROM books WHERE id = ?").run(book.id);
  return res.json({ ok: true });
});
```

### API Helper

```javascript
// Source: existing client/src/api/auth.js request pattern
export function listBooks(filters = {}) {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(filters)) {
    if (value) params.set(key, value);
  }
  const suffix = params.toString() ? `?${params.toString()}` : "";
  return requestJson(`/api/books${suffix}`, { method: "GET" });
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Express 4 as latest major | Express 5 is latest at 5.2.1 | npm latest modified 2026-05-19 [VERIFIED: npm registry] | Do not upgrade during Phase 2; current code uses Express 4 and common middleware patterns. [VERIFIED: codebase grep] |
| React 18 as latest stable line | React 19 is latest at 19.2.7 | npm latest modified 2026-06-08 [VERIFIED: npm registry] | Keep React 18.3.1 because Phase 2 does not need migration work. [VERIFIED: codebase package-lock] |
| Ad hoc client-side filtering | API-backed server-side filtering | Locked by D-14 on 2026-06-10 [VERIFIED: CONTEXT.md] | Tests should cover `/api/books?search=&category=&availability=` directly. [VERIFIED: CONTEXT.md] |

**Deprecated/outdated:**
- Treating displayed availability as authoritative for loan rules is outdated for this project because D-12 says later loan/return workflows should take over availability automatically. [VERIFIED: CONTEXT.md]

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | Category filter should exact-match known catalog values rather than perform partial matching. | Phase Requirements | UI/API tests may need different expectations if the user wants fuzzy category filtering. |
| A2 | SQLite FTS5 is unnecessary for an 8-12 book demo catalog. | Standard Stack | Search performance work may be needed later if catalog scale changes. |
| A3 | Delete guard tests should include wildcard search cases and delete-route availability edge cases. | Common Pitfalls | Verification may miss subtle regressions if not added. |

## Open Questions

1. **Exact future loan table shape**
   - What we know: Phase 2 must block deletes when active loan records exist, and current code has no loan table. [VERIFIED: CONTEXT.md] [VERIFIED: codebase grep]
   - What's unclear: Whether Phase 2 should introduce a minimal loan table now or only an isolated helper for later Phase 3/4 schema integration. [VERIFIED: ROADMAP.md]
   - Recommendation: Do not build loan workflow now; implement delete eligibility through one helper that can be updated when Phase 3 introduces active-loan creation. [VERIFIED: CONTEXT.md]

2. **Inline form versus modal**
   - What we know: D-07 allows either. [VERIFIED: CONTEXT.md]
   - What's unclear: Which pattern best fits final layout after implementation. [VERIFIED: CONTEXT.md]
   - Recommendation: Use an inline add/edit form above or beside the librarian table because existing CSS already supports panels/forms and this avoids modal focus management. [VERIFIED: codebase grep] [ASSUMED]

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|-------------|-----------|---------|----------|
| Node.js | npm scripts, Express, Vite, Vitest | Yes | v22.22.2 [VERIFIED: command output] | none |
| npm | dependency repair and workspace scripts | Yes | 10.9.7 [VERIFIED: command output] | none |
| sqlite3 CLI | manual SQLite inspection | Yes | 3.51.2 [VERIFIED: command output] | Use `better-sqlite3` once native install is repaired. |
| ctx7 | Context7 documentation fallback | No | unavailable [VERIFIED: command output] | Official web docs were fetched directly. |
| Vitest binary | automated tests | Present but not executable | `node_modules/.bin/vitest` mode `-rw-r--r--` [VERIFIED: command output] | Run dependency repair before verification. |
| Rollup native optional package | Vite/Vitest startup | Missing | `@rollup/rollup-linux-x64-gnu` absent from `node_modules` [VERIFIED: command output] | Run `npm install` from lockfile. |
| `better-sqlite3` native binary | server runtime/tests | Present but invalid | invalid ELF header [VERIFIED: command output] | Run `npm install` or rebuild native dependency. |

**Missing dependencies with no fallback:**
- Working `better-sqlite3` native module blocks server runtime and API tests until dependency repair. [VERIFIED: command output]

**Missing dependencies with fallback:**
- ctx7 is unavailable; official docs were fetched directly through web search/open. [VERIFIED: command output]
- Vitest shim permissions can be repaired, but Rollup and `better-sqlite3` native issues still require dependency repair. [VERIFIED: command output]

## Sources

### Primary (HIGH confidence)
- Codebase inspection: `server/src/db.js`, `server/src/app.js`, `server/src/routes/auth.js`, `server/src/auth/guards.js`, `server/src/seed.js`, `client/src/App.jsx`, `client/src/components/AppShell.jsx`, `client/src/api/auth.js`, `server/tests/*.test.js`, `client/src/__tests__/*.test.jsx`. [VERIFIED: codebase grep]
- Phase context: `.planning/phases/02-book-catalog-and-search/02-CONTEXT.md`. [VERIFIED: CONTEXT.md]
- Project requirements and roadmap: `.planning/REQUIREMENTS.md`, `.planning/ROADMAP.md`. [VERIFIED: planning docs]
- npm registry metadata via `npm view` and GSD legitimacy seam. [VERIFIED: npm registry]

### Secondary (MEDIUM confidence)
- Express routing and middleware docs: https://expressjs.com/en/guide/routing/ and https://expressjs.com/en/guide/using-middleware/. [CITED: official docs]
- better-sqlite3 API docs: https://github.com/WiseLibs/better-sqlite3/blob/master/docs/api.md. [CITED: official repo docs]
- React input and list rendering docs: https://react.dev/reference/react-dom/components/input and https://react.dev/learn/rendering-lists. [CITED: official docs]
- SQLite foreign key and expression docs: https://www.sqlite.org/foreignkeys.html and https://www.sqlite.org/lang_expr.html. [CITED: official docs]
- Vitest guide: https://vitest.dev/guide/. [CITED: official docs]
- Supertest README: https://github.com/ladjs/supertest. [CITED: official repo docs]
- React Testing Library docs: https://testing-library.com/docs/react-testing-library/intro/. [CITED: official docs]

### Tertiary (LOW confidence)
- Assumptions A1-A3 in the Assumptions Log. [ASSUMED]
- Research-store provider confidence for webfetch was classified LOW by the GSD seam even though the fetched pages were official documentation. [VERIFIED: gsd-tools classify-confidence]

## Metadata

**Confidence breakdown:**
- Standard stack: MEDIUM - package metadata and existing code were verified, but several latest package lines are flagged SUS by the legitimacy seam and local dependency install is broken. [VERIFIED: npm registry] [VERIFIED: command output]
- Architecture: HIGH - phase decisions and existing route/database/frontend patterns are clear. [VERIFIED: CONTEXT.md] [VERIFIED: codebase grep]
- Pitfalls: MEDIUM - delete eligibility and navigation pitfalls are verified in current code/context; future loan schema details remain open. [VERIFIED: codebase grep] [ASSUMED]

**Research date:** 2026-06-10  
**Valid until:** 2026-06-17 for package/version claims; 2026-07-10 for codebase architecture claims if Phase 2 planning starts from this commit. [ASSUMED]
