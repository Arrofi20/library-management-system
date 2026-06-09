# Phase 01 CONTEXT

## Phase
- Phase: 1
- Name: Application Foundation and Role Login
- Date: 2026-06-09

## Domain
Students and librarians can use a database-backed app shell with role-aware login, logout, and navigation.

## Canonical Refs
- [.planning/ROADMAP.md](.planning/ROADMAP.md)
- [.planning/REQUIREMENTS.md](.planning/REQUIREMENTS.md)
- [.planning/PROJECT.md](.planning/PROJECT.md)

## Code Context
- No application code exists yet beyond repository documentation and planning files.
- No reusable frontend/backend components, hooks, routes, or data-access patterns are present in the repo yet.

## Decisions
### Librarian access
- Create exactly one seeded librarian account for v1.
- Use a simple fixed demo login for that librarian account.
- Show demo login hints on the login screen.
- Do not allow public librarian registration in v1.

### Student signup
- Require name, student/member ID, email, and password.
- Let the student enter the member ID manually.
- Validate the member ID as required, unique, and lightly format-checked.
- Automatically log the student in after successful registration.

### Session behavior
- Use HTTP-only cookie sessions between React and Express.
- Let the session last until the browser session cookie expires.
- Redirect unauthenticated users to login with a clear message when they hit a protected page.
- On logout, clear the session and redirect to login.

### Role-aware app shell
- Show role-specific navigation only.
- Route students to a student dashboard/home after login.
- Route librarians to a separate librarian dashboard after login.
- Make each dashboard emphasize quick actions and status summaries.

### Demo seed/setup
- Seed one student, one librarian, and a few sample books.
- Do not seed additional workflow records in Phase 1.
- Provide a reset/reseed command so demos can be restored reliably.
- Add quick-fill buttons for student and librarian credentials on the login screen.

## Deferred Ideas
- None captured.

## Notes for Downstream
- Phase 1 should support the course demo without requiring admin tooling.
- Student identity must be visible early because later phases depend on member records and loan history.
- Keep the first release focused on the login and shell experience; do not prebuild later workflow UI into Phase 1.
