# Walking Skeleton - Library Management System

**Phase:** 1
**Generated:** 2026-06-09

## Capability Proven End-to-End

A student can register or use seeded credentials, log in through the React UI, create a browser-session HTTP-only cookie through Express, persist identity in SQLite, and land on a role-aware dashboard.

## Architectural Decisions

| Decision | Choice | Rationale |
|---|---|---|
| Framework | React app served by Vite with a separate Express API | Matches the required React, Node.js, and Express stack while keeping course-demo setup simple. |
| Data layer | SQLite database accessed from Express through a small repository layer | Matches the required SQLite constraint and keeps persistence local for demos. |
| Auth | Email/password login with bcrypt password hashes and opaque HTTP-only cookie sessions stored server-side | Satisfies the locked session decision without exposing session tokens to browser JavaScript. |
| Deployment target | Local full-stack dev command for Phase 1 | The course project needs reliable local demonstration before external deployment. |
| Directory layout | `client/` for React, `server/` for Express and SQLite, shared root scripts for install/dev/test/seed | Keeps frontend and backend boundaries clear for later catalog, members, requests, and loans slices. |

## Stack Touched in Phase 1

- [ ] Project scaffold (framework, build, lint, test runner)
- [ ] Routing - login, registration, student dashboard, librarian dashboard
- [ ] Database - user/session/book seed data with real reads and writes
- [ ] UI - login/register/logout interactions wired to API
- [ ] Deployment - documented local full-stack run command

## Out of Scope (Deferred to Later Slices)

- Book catalog browsing, search, filtering, and librarian book CRUD beyond Phase 1 seed data.
- Member management screens and borrow request workflows.
- Active loans, returns, loan history, due dates, overdue rules, fines, notifications, and admin tooling.
- Public librarian registration, password reset, email verification, and multi-branch library support.

## Subsequent Slice Plan

Each later phase adds one vertical slice on top of this skeleton without altering its architectural decisions:

- Phase 2: Student catalog browsing/search and librarian catalog CRUD.
- Phase 3: Librarian member management and borrow request approval.
- Phase 4: Active loans, returns, histories, and course-demo workflow polish.
