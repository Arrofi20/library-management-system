# Phase 01 Discussion Log

## Areas Discussed
- Librarian access
- Student signup
- Session behavior
- Role-aware app shell
- Demo seed/setup

## Decisions Captured
### Librarian access
- Seed exactly one librarian account.
- Use a fixed demo login.
- Show demo hints on the login screen.
- Disallow public librarian registration.

### Student signup
- Require name, student/member ID, email, and password.
- Student enters member ID manually.
- Validate member ID as required, unique, and lightly format-checked.
- Auto-login after registration.

### Session behavior
- Use HTTP-only cookie sessions.
- Session lasts until browser cookie expiry.
- Protected pages redirect to login with a clear message.
- Logout clears the session and returns to login.

### Role-aware app shell
- Show role-specific navigation only.
- Student lands on a student dashboard/home.
- Librarian lands on a separate librarian dashboard.
- Both dashboards emphasize quick actions and status.

### Demo seed/setup
- Seed one student, one librarian, and a few sample books.
- Do not seed extra workflow records.
- Provide a reset/reseed command.
- Add quick-fill buttons for demo logins.

## Deferred Ideas
- None.
