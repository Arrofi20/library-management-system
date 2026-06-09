# Library Management System

University course demo app for managing library catalog, members, borrow requests, loans, and returns.

## Local Setup

```bash
npm install
npm run seed
npm run dev
```

The React client runs on Vite and proxies API calls to the Express server. The Express API stores data in a local SQLite database under `server/data/`.

## Demo Accounts

Use the login quick-fill buttons or these seeded credentials:

| Role | Email | Password |
|---|---|---|
| Student | `student@example.edu` | `student123` |
| Librarian | `librarian@example.edu` | `librarian123` |

## Scripts

- `npm run dev` - start React and Express development servers.
- `npm run seed` - reset and reseed SQLite demo data.
- `npm test` - run server and client tests.
