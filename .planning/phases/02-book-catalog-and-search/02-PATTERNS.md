# Phase 2: Book Catalog and Search - Pattern Map

**Mapped:** 2026-06-10
**Files analyzed:** 14
**Analogs found:** 13 / 14

## File Classification

| New/Modified File | Role | Data Flow | Closest Analog | Match Quality |
|-------------------|------|-----------|----------------|---------------|
| `server/src/routes/books.js` | route/controller | request-response, CRUD | `server/src/routes/auth.js` | role-match |
| `server/src/books/validation.js` | utility | transform | `server/src/routes/auth.js` | partial |
| `server/src/books/queries.js` | service/utility | CRUD, transform | `server/src/db.js`, `server/src/seed.js` | role-match |
| `server/src/app.js` | config | request-response | `server/src/app.js` | exact |
| `server/src/seed.js` | utility | batch, CRUD | `server/src/seed.js` | exact |
| `server/tests/books.test.js` | test | request-response, CRUD | `server/tests/auth.test.js` | role-match |
| `client/src/api/books.js` | utility | request-response | `client/src/api/auth.js` | exact |
| `client/src/components/CatalogPage.jsx` | component | request-response | `client/src/App.jsx`, `client/src/components/Dashboard.jsx` | role-match |
| `client/src/components/BooksPage.jsx` | component | request-response, CRUD | `client/src/App.jsx`, `client/src/components/RegisterForm.jsx` | role-match |
| `client/src/components/BookToolbar.jsx` | component | event-driven, request-response | `client/src/components/RegisterForm.jsx` | role-match |
| `client/src/components/BookTable.jsx` | component | transform | `client/src/components/Dashboard.jsx` | partial |
| `client/src/components/StatusBadge.jsx` | component | transform | `client/src/components/Dashboard.jsx` | partial |
| `client/src/components/BookForm.jsx` | component | event-driven, CRUD | `client/src/components/RegisterForm.jsx`, `client/src/components/LoginForm.jsx` | role-match |
| `client/src/App.jsx`, `client/src/components/AppShell.jsx`, `client/src/styles.css` | component/config/style | event-driven, request-response | same files | exact |

## Pattern Assignments

### `server/src/routes/books.js` (route/controller, request-response + CRUD)

**Analog:** `server/src/routes/auth.js`

**Imports pattern** (lines 1-11):
```javascript
const express = require("express");
const { openDatabase, publicUser } = require("../db");
const { hashPassword, verifyPassword } = require("../auth/passwords");
const { requireAuth, requireRole } = require("../auth/guards");
```

For books, copy the CommonJS route shape and replace auth-specific imports with `requireRole("librarian")`, book query helpers, and validation helpers.

**Router and validation helper pattern** (lines 13-25):
```javascript
const router = express.Router();

function normalizeEmail(email) {
  return String(email || "").trim().toLowerCase();
}

function requiredString(value) {
  return typeof value === "string" && value.trim().length > 0;
}
```

Use small local or imported helpers for book input normalization: required title/author/category/isbn, `available` coercion, ISBN format, and write payload validation.

**Request handler + database pattern** (lines 33-63):
```javascript
router.post("/register", (req, res) => {
  const db = openDatabase();
  const name = String(req.body.name || "").trim();

  if (!requiredString(name)) {
    return res.status(400).json({
      message: "Name, member ID, email, and password are required."
    });
  }

  const existing = db
    .prepare("SELECT id FROM users WHERE email = ? OR member_id = ?")
    .get(email, memberId);

  if (existing) {
    return res.status(409).json({ message: "Email or member ID is already registered." });
  }
});
```

For books: use `GET /` for list/search/filter, `POST /`, `PUT /:id`, and `DELETE /:id`. Keep API errors as JSON `{ message }`.

**Role guard pattern** (lines 89-95):
```javascript
router.get("/student-only", requireRole("student"), (req, res) => {
  res.json({ ok: true, role: req.currentUser.role });
});

router.get("/librarian-only", requireRole("librarian"), (req, res) => {
  res.json({ ok: true, role: req.currentUser.role });
});
```

Apply `requireRole("librarian")` only to create/update/delete routes. The shared `GET /api/books` endpoint should be readable by both logged-in roles if Phase 2 keeps catalog behind the app shell.

### `server/src/books/validation.js` (utility, transform)

**Analog:** `server/src/routes/auth.js`

**Required string and format validation pattern** (lines 15-25):
```javascript
function normalizeEmail(email) {
  return String(email || "").trim().toLowerCase();
}

function validMemberId(memberId) {
  return /^[A-Za-z0-9-]{3,24}$/.test(String(memberId || "").trim());
}

function requiredString(value) {
  return typeof value === "string" && value.trim().length > 0;
}
```

Create book equivalents: trim strings, require `title`, `author`, `category`, `isbn`, accept common ISBN-10/ISBN-13 strings with hyphens, and normalize `available` to `0` or `1`.

### `server/src/books/queries.js` (service/utility, CRUD)

**Analogs:** `server/src/db.js`, `server/src/seed.js`

**Database access pattern** (`server/src/db.js` lines 13-23):
```javascript
function openDatabase() {
  if (connection) {
    return connection;
  }

  const dbPath = getDatabasePath();
  fs.mkdirSync(path.dirname(dbPath), { recursive: true });
  connection = new Database(dbPath);
  connection.pragma("foreign_keys = ON");
  return connection;
}
```

Use `openDatabase()` in query helpers rather than opening new connections directly.

**Prepared statement pattern** (`server/src/seed.js` lines 47-62):
```javascript
const insertBook = db.prepare(
  `INSERT INTO books (title, author, category, isbn, available)
   VALUES (?, ?, ?, ?, 1)`
);

for (const book of sampleBooks) {
  insertBook.run(book.title, book.author, book.category, book.isbn);
}
```

Use prepared statements for `SELECT`, `INSERT`, `UPDATE`, and `DELETE`. Return plain book objects with `available` as a value the client can render consistently.

**Schema pattern to query against** (`server/src/db.js` lines 51-59):
```javascript
CREATE TABLE IF NOT EXISTS books (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  author TEXT NOT NULL,
  category TEXT NOT NULL,
  isbn TEXT NOT NULL UNIQUE,
  available INTEGER NOT NULL DEFAULT 1 CHECK (available IN (0, 1)),
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

Search/filter should target these existing columns and preserve the unique ISBN constraint.

### `server/src/app.js` (config, request-response)

**Analog:** `server/src/app.js`

**Middleware and route mount pattern** (lines 1-6, 11-20, 31):
```javascript
const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const { initializeSchema, openDatabase } = require("./db");
const { attachCurrentUser } = require("./auth/guards");
const authRoutes = require("./routes/auth");

app.use(express.json());
app.use(cookieParser());
app.use(attachCurrentUser);

app.use("/api/auth", authRoutes);
```

Add `const booksRoutes = require("./routes/books");` and mount with `app.use("/api/books", booksRoutes);` after auth middleware is attached.

### `server/src/seed.js` (utility, batch)

**Analog:** `server/src/seed.js`

**Seed array pattern** (lines 21-40):
```javascript
const sampleBooks = [
  {
    title: "Systems Analysis and Design",
    author: "Alan Dennis",
    category: "Information Systems",
    isbn: "9781119496489"
  }
];
```

Expand this array to 8-12 realistic books with multiple categories and mixed availability states.

**Deterministic reset/seed pattern** (lines 42-67):
```javascript
function seedDemoData() {
  const db = openDatabase();
  initializeSchema(db);
  resetDemoData(db);

  for (const user of demoUsers) {
    insertUser.run(user.name, user.memberId, user.email, hashPassword(user.password), user.role);
  }

  return {
    users: demoUsers.length,
    books: sampleBooks.length
  };
}
```

Keep seeding deterministic and update the smoke test expectation from 3 books to the new count.

### `server/tests/books.test.js` (test, request-response + CRUD)

**Analog:** `server/tests/auth.test.js`

**Isolated SQLite test setup** (lines 1-18):
```javascript
const os = require("os");
const path = require("path");
const request = require("supertest");
const vitest = await import("vitest");
const { afterEach, beforeEach, describe, expect, it } = vitest;

beforeEach(() => {
  process.env.LIBRARY_DB_PATH = path.join(os.tmpdir(), `library-auth-${Date.now()}-${Math.random()}.sqlite`);
  resetDatabaseForTests();
});
```

Use a per-test `LIBRARY_DB_PATH`, call `resetDatabaseForTests()`, and seed demo data for list/write tests.

**Agent login and role check pattern** (lines 105-117):
```javascript
const app = createApp();
seedDemoData();
const studentAgent = request.agent(app);

await request(app).get("/api/auth/librarian-only").expect(401);
await studentAgent.post("/api/auth/login").send({ email: "student@example.edu", password: "student123" }).expect(200);
await studentAgent.get("/api/auth/student-only").expect(200);
await studentAgent.get("/api/auth/librarian-only").expect(403);
```

For books, use `request.agent(app)` to log in as student/librarian and verify write routes return `401` unauthenticated, `403` for student, and success for librarian.

### `client/src/api/books.js` (utility, request-response)

**Analog:** `client/src/api/auth.js`

**Fetch wrapper pattern** (lines 1-18):
```javascript
async function requestJson(path, options = {}) {
  const response = await fetch(path, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {})
    },
    ...options
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || "Request failed.");
  }

  return data;
}
```

Mirror this behavior for catalog requests so cookie sessions and `{ message }` errors behave consistently.

**Endpoint function pattern** (lines 20-44):
```javascript
export function login(credentials) {
  return requestJson("/api/auth/login", {
    method: "POST",
    body: JSON.stringify(credentials)
  });
}
```

Add `listBooks(filters)`, `createBook(book)`, `updateBook(id, book)`, and `deleteBook(id)`. Build query strings with `URLSearchParams`, omitting empty search/category/availability values.

### `client/src/components/CatalogPage.jsx` (component, request-response)

**Analogs:** `client/src/App.jsx`, `client/src/components/Dashboard.jsx`

**Async loading state pattern** (`client/src/App.jsx` lines 16-44):
```jsx
useEffect(() => {
  let active = true;

  async function loadSession() {
    try {
      const [healthStatus, session] = await Promise.allSettled([getHealth(), getCurrentUser()]);
      if (!active) {
        return;
      }
      if (session.status === "fulfilled") {
        setCurrentUser(session.value.user);
      }
    } finally {
      if (active) {
        setLoading(false);
      }
    }
  }

  loadSession();
  return () => {
    active = false;
  };
}, []);
```

Use the same active flag for book loading when filters change, with `loading`, `error`, and `books` state.

**Dashboard section pattern** (`client/src/components/Dashboard.jsx` lines 24-42):
```jsx
return (
  <section className="dashboard">
    <h2>Welcome, {user.name}</h2>
    <div className="status-grid">
      <article>
        <span>Member ID</span>
        <strong>{user.memberId}</strong>
      </article>
    </div>
  </section>
);
```

Render `Catalog` as a section inside the existing app shell. Use toolbar, result count, table, and inline empty/error states from the UI spec.

### `client/src/components/BooksPage.jsx` (component, CRUD)

**Analogs:** `client/src/App.jsx`, `client/src/components/RegisterForm.jsx`

**Submit/error pattern** (`client/src/App.jsx` lines 57-65):
```jsx
async function handleRegister(details) {
  setRegisterError("");
  try {
    const result = await registerStudent(details);
    setCurrentUser(result.user);
    setMessage("");
  } catch (error) {
    setRegisterError(error.message);
  }
}
```

Use the same structure for create, update, and delete: clear error, call API helper, refresh list, set success message, catch API message.

**Form state update pattern** (`client/src/components/RegisterForm.jsx` lines 3-15):
```jsx
const [form, setForm] = useState({
  name: "",
  memberId: "",
  email: "",
  password: ""
});
function update(field, value) {
  setForm((current) => ({ ...current, [field]: value }));
}
function submit(event) {
  event.preventDefault();
  onSubmit(form);
}
```

Use this for add/edit book form state, including `available`. Reset the form after create and populate it when editing.

### `client/src/components/BookToolbar.jsx` (component, event-driven)

**Analog:** `client/src/components/RegisterForm.jsx`

**Visible label + controlled input pattern** (lines 23-38):
```jsx
<label>
  Email
  <input
    value={form.email}
    onChange={(event) => update("email", event.target.value)}
    type="email"
    required
  />
</label>
```

Use visible labels for `Search catalog`, `Category`, and `Availability`. Keep keyboard order as search, category, availability.

### `client/src/components/BookTable.jsx` (component, transform)

**Analog:** `client/src/components/Dashboard.jsx`

**List rendering pattern** (lines 6-19):
```jsx
<div className="status-grid">
  <article>
    <span>Catalog</span>
    <strong>Seed books ready</strong>
  </article>
</div>
```

The current app has only card-like repeated output; implement the UI spec table pattern with `book.id` keys, `th` headers, and columns in the specified order. Keep table rendering pure: receive `books`, optional `mode`, and action callbacks.

### `client/src/components/StatusBadge.jsx` (component, transform)

**Analog:** `client/src/components/Dashboard.jsx`

**Small semantic label pattern** (lines 28-39):
```jsx
<article>
  <span>catalog info</span>
  <strong>Search arrives next</strong>
</article>
```

Return text badges only: `Available` for truthy/`1`, `Unavailable` for falsey/`0`. Styling belongs in `styles.css`; do not use color as the only status signal.

### `client/src/components/BookForm.jsx` (component, event-driven + CRUD)

**Analogs:** `client/src/components/RegisterForm.jsx`, `client/src/components/LoginForm.jsx`

**Panel form pattern** (`RegisterForm.jsx` lines 16-53):
```jsx
return (
  <form className="panel form" onSubmit={submit}>
    <div className="panel-heading">
      <h2>Student registration</h2>
      <span>Student only</span>
    </div>
    {error ? <p className="alert">{error}</p> : null}
    <label>
      Name
      <input value={form.name} onChange={(event) => update("name", event.target.value)} required />
    </label>
    <button className="primary" type="submit">
      Register and enter
    </button>
  </form>
);
```

Use `.panel.form`, `.panel-heading`, `.alert`, visible labels, and required fields. Add `select` support in CSS to match input styling.

**Secondary action pattern** (`LoginForm.jsx` lines 35-42):
```jsx
<div className="quick-fill" aria-label="Demo credential quick fill">
  <button type="button" onClick={() => fillDemo("student")}>
    Student demo
  </button>
</div>
```

Use this pattern for edit cancel and row action button grouping. Protect ISBN while unavailable/on-loan with `disabled` plus the required hint copy.

### `client/src/App.jsx` and `client/src/components/AppShell.jsx` (component/config, event-driven)

**Analogs:** same files

**Authenticated shell render pattern** (`client/src/App.jsx` lines 78-83):
```jsx
if (currentUser) {
  return (
    <AppShell user={currentUser} onLogout={handleLogout}>
      <Dashboard user={currentUser} />
    </AppShell>
  );
}
```

Add active view state in `App.jsx` so students can select Dashboard/Catalog and librarians can select Dashboard/Books. Render the phase pages only for the relevant role.

**Navigation pattern to extend** (`client/src/components/AppShell.jsx` lines 1-25):
```jsx
export default function AppShell({ user, onLogout, children }) {
  const studentLinks = ["Dashboard", "Catalog", "My loans"];
  const librarianLinks = ["Dashboard", "Books", "Members", "Borrow requests"];
  const links = user.role === "librarian" ? librarianLinks : studentLinks;

  return (
    <nav aria-label={`${user.role} navigation`}>
      {links.map((link) => (
        <a href="#dashboard" key={link}>
          {link}
        </a>
      ))}
    </nav>
  );
}
```

Convert nav items to clickable view selectors or anchors with handlers. Add `aria-current="page"` for the active Catalog/Books view.

### `client/src/styles.css` (style/config, transform)

**Analog:** `client/src/styles.css`

**Base color/font pattern** (lines 1-5):
```css
:root {
  color: #17202a;
  background: #f5f7fb;
  font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
}
```

Keep Phase 2 colors aligned with the UI spec: background `#f5f7fb`, panels/table surfaces `#ffffff`, accent `#176b87`, destructive `#9f1239`.

**Controls and primary action pattern** (lines 15-34):
```css
button,
input {
  font: inherit;
}

button.primary {
  background: #176b87;
  border-color: #176b87;
  color: #ffffff;
  font-weight: 700;
}
```

Extend the grouped selector to include `select`. Use primary styling only for Add/Save actions.

**Panel/form/error pattern** (lines 73-129):
```css
.panel {
  background: #ffffff;
  border: 1px solid #d7deea;
  border-radius: 8px;
  padding: 20px;
}

.form {
  display: grid;
  gap: 14px;
}

.alert {
  background: #fff1f2;
  border: 1px solid #fecdd3;
  border-radius: 6px;
  color: #9f1239;
}
```

Use these as the basis for book forms, inline API errors, blocked-delete messages, and empty states.

**Responsive shell pattern** (lines 155-224):
```css
.workspace {
  display: grid;
  grid-template-columns: 220px 1fr;
  min-height: calc(100vh - 82px);
}

@media (max-width: 720px) {
  .workspace {
    grid-template-columns: 1fr;
  }
}
```

Add table overflow handling inside main content so ISBN and availability remain visible on narrow screens.

### `client/src/__tests__/catalog-flow.test.jsx` (test, request-response + event-driven)

**Analog:** `client/src/__tests__/auth-flow.test.jsx`

**Fetch mocking pattern** (lines 8-18, 22-25):
```jsx
function jsonResponse(body, status = 200) {
  return Promise.resolve({
    ok: status >= 200 && status < 300,
    status,
    json: () => Promise.resolve(body)
  });
}

vi.spyOn(globalThis, "fetch").mockImplementation((url) => {
  if (url === "/api/health") return jsonResponse({ ok: true, database: "available" });
  return jsonResponse({ message: "Please log in to continue." }, 401);
});
```

Mock `/api/books` list/search/filter responses, create/update/delete calls, and API failure states.

**User interaction pattern** (lines 89-99):
```jsx
render(<App />);
await screen.findByText("Student registration");
const registration = screen.getByText("Student registration").closest("form");
await userEvent.type(within(registration).getByLabelText("Name"), "New Student");
await userEvent.click(screen.getByText("Register and enter"));
expect(await screen.findByText("Welcome, New Student")).toBeInTheDocument();
```

Use visible labels from the UI spec for catalog search, category filter, availability filter, and book form fields.

## Shared Patterns

### Authentication and Authorization

**Source:** `server/src/auth/guards.js`
**Apply to:** `server/src/routes/books.js`, server API tests

```javascript
function requireRole(role) {
  return function roleGuard(req, res, next) {
    if (!req.currentUser) {
      return res.status(401).json({ message: "Please log in to continue." });
    }

    if (req.currentUser.role !== role) {
      return res.status(403).json({ message: "You do not have access to this action." });
    }

    return next();
  };
}
```

### API Error Responses

**Source:** `server/src/routes/auth.js`
**Apply to:** All books route validation, uniqueness, not-found, forbidden, and delete-blocked responses

```javascript
if (existing) {
  return res.status(409).json({ message: "Email or member ID is already registered." });
}

if (!user || !verifyPassword(password, user.password_hash)) {
  return res.status(401).json({ message: "Invalid email or password." });
}
```

Return concise JSON `{ message }`; client helpers already surface `error.message`.

### Client Request Handling

**Source:** `client/src/api/auth.js`
**Apply to:** `client/src/api/books.js`

```javascript
const data = await response.json().catch(() => ({}));

if (!response.ok) {
  throw new Error(data.message || "Request failed.");
}

return data;
```

### Controlled React Forms

**Source:** `client/src/components/RegisterForm.jsx`
**Apply to:** `BookToolbar`, `BookForm`, `BooksPage`

```jsx
function update(field, value) {
  setForm((current) => ({ ...current, [field]: value }));
}
function submit(event) {
  event.preventDefault();
  onSubmit(form);
}
```

### Test Isolation

**Source:** `server/tests/smoke.test.js`
**Apply to:** `server/tests/books.test.js`

```javascript
beforeEach(() => {
  process.env.LIBRARY_DB_PATH = path.join(os.tmpdir(), `library-smoke-${Date.now()}-${Math.random()}.sqlite`);
  resetDatabaseForTests();
});

afterEach(() => {
  resetDatabaseForTests();
  delete process.env.LIBRARY_DB_PATH;
});
```

## No Analog Found

| File/Helper | Role | Data Flow | Reason |
|-------------|------|-----------|--------|
| Active-loan delete eligibility helper inside `server/src/books/queries.js` | service/utility | CRUD | No loan table or event-driven loan workflow exists yet. Implement as an isolated helper that currently returns false when no active-loans table exists, so Phase 3/4 can replace internals without changing route behavior. |

## Metadata

**Analog search scope:** `server/src`, `server/tests`, `client/src`, phase planning files, `AGENTS.md`
**Files scanned:** 17 source/test/planning files plus project instructions
**Pattern extraction date:** 2026-06-10
