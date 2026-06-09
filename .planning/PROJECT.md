# Library Management System

## What This Is

A university Information Systems Development course project for managing a library's book catalog, student borrowing, and librarian loan workflows. Students can register, log in, search the catalog, request to borrow books, and view their loan history. Librarians can manage books and members, approve borrow requests, track active loans, and record returns.

## Core Value

Students and librarians can complete the full borrow lifecycle: find a book, request it, approve the loan, track it, and return it.

## Requirements

### Validated

(None yet - ship to validate)

### Active

- [ ] Student can register and log in.
- [ ] Librarian can log in and access staff workflows.
- [ ] Student can search and filter the book catalog.
- [ ] Librarian can create, read, update, and delete book catalog records.
- [ ] Librarian can register and manage library members.
- [ ] Student can submit a borrow request for an available book.
- [ ] Librarian can approve or reject borrow requests.
- [ ] Librarian can track active loans and record book returns.
- [ ] Student and librarian can view loan history.

### Out of Scope

- Admin role - v1 only needs student and librarian roles for a clear course-demo workflow.
- Instant self-service borrowing - v1 uses librarian approval so the loan workflow demonstrates role-based business logic.
- Payments, fines, and accounting - not necessary for the core borrowing lifecycle.
- External library integrations - v1 uses a local SQLite-backed catalog.

## Context

- This is a course project, so the system should prioritize demonstrable end-to-end workflows over enterprise-scale complexity.
- The frontend will use React.
- The backend will use Node.js with Express.
- The database will use SQLite.
- The application should make CRUD behavior visible and testable through clear screens, forms, and database-backed records.
- The main user roles are Student and Librarian.
- Borrowing uses a request-and-approval model: students request books, librarians approve or reject requests, approved requests become active loans, and returned books are recorded.

## Constraints

- **Tech stack**: React, Node.js, Express, and SQLite - required by the project direction.
- **Scope**: v1 focuses on a complete CRUD and borrowing workflow - this keeps the course demo coherent.
- **Roles**: Student and Librarian only - avoids admin complexity before the core workflow is complete.
- **Data storage**: SQLite - suitable for local development and course submission.

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Use React for the frontend | User specified React for the UI layer | - Pending |
| Use Node.js, Express, and SQLite | User specified this backend stack | - Pending |
| Support Student and Librarian roles | Covers the core user and staff workflows without extra admin scope | - Pending |
| Use request-then-approve borrowing | Demonstrates role-based workflow and librarian control over loans | - Pending |
| Optimize for complete CRUD workflow | Best fit for a university Information Systems Development course demo | - Pending |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `$gsd-transition`):
1. Requirements invalidated? -> Move to Out of Scope with reason
2. Requirements validated? -> Move to Validated with phase reference
3. New requirements emerged? -> Add to Active
4. Decisions to log? -> Add to Key Decisions
5. "What This Is" still accurate? -> Update if drifted

**After each milestone** (via `$gsd-complete-milestone`):
1. Full review of all sections
2. Core Value check - still the right priority?
3. Audit Out of Scope - reasons still valid?
4. Update Context with current state

---
*Last updated: 2026-06-09 after initialization*
