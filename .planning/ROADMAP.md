# Roadmap: Library Management System

## Overview

Build the Library Management System as a sequence of vertical MVP slices for a university course demo. Start with the React/Express/SQLite foundation and role-based login, add catalog search and librarian catalog CRUD, add member management with borrow request approval, then complete active loan tracking, returns, history, and demo readiness.

## Phases

**Phase Numbering:**

- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [ ] **Phase 1: Application Foundation and Role Login** - Create the React, Express, and SQLite foundation with student and librarian authentication.
- [ ] **Phase 2: Book Catalog and Search** - Deliver student catalog browsing/search and librarian book CRUD.
- [ ] **Phase 3: Member Management and Borrow Requests** - Add member management and the request/approval workflow.
- [ ] **Phase 4: Loans, Returns, History, and Demo Readiness** - Complete active loan tracking, returns, histories, and course-demo polish.

## Phase Details

### Phase 1: Application Foundation and Role Login

**Goal**: Students and librarians can use a database-backed app shell with role-aware login and navigation.
**Mode:** mvp
**Depends on**: Nothing (first phase)
**Requirements**: [AUTH-01, AUTH-02, AUTH-03, AUTH-04, AUTH-05, DEMO-02, DEMO-03, DEMO-04]
**Success Criteria** (what must be TRUE):

  1. Student can register, log in, log out, and see student navigation.
  2. Librarian can log in, log out, and see librarian navigation.
  3. Express API persists users and sessions against SQLite-backed data.
  4. Seed or setup data exists so the app can be demonstrated immediately.

**Plans**: 3 plans
Plans:
**Wave 1**

- [ ] 01-01: Scaffold React frontend, Express backend, shared dev scripts, and SQLite setup.

**Wave 2** *(blocked on Wave 1 completion)*

- [ ] 01-02: Implement user database schema, seed data, authentication API, and session handling.

**Wave 3** *(blocked on Wave 2 completion)*

- [ ] 01-03: Build login, registration, logout, and role-aware navigation screens.

### Phase 2: Book Catalog and Search

**Goal**: Students can find available books, and librarians can manage catalog records.
**Mode:** mvp
**Depends on**: Phase 1
**Requirements**: [CAT-01, CAT-02, CAT-03, CAT-04, CAT-05, CAT-06]
**Success Criteria** (what must be TRUE):

  1. Student can view books with title, author, category, ISBN, and availability.
  2. Student can search and filter books from the React UI.
  3. Librarian can add, edit, and delete eligible book records.
  4. System prevents deleting books that are currently on loan.

**Plans**: 2 plans

Plans:

- [ ] 02-01: Implement catalog schema, API routes, validation, and availability rules.
- [ ] 02-02: Build student catalog search/filter UI and librarian catalog CRUD UI.

### Phase 3: Member Management and Borrow Requests

**Goal**: Librarians can manage members, and students can request books for librarian approval.
**Mode:** mvp
**Depends on**: Phase 2
**Requirements**: [MEM-01, MEM-02, MEM-03, MEM-04, BOR-01, BOR-02, BOR-03, BOR-04, BOR-05, BOR-06]
**Success Criteria** (what must be TRUE):

  1. Librarian can create, view, edit, and deactivate student member records.
  2. Student can request an available book and see request status.
  3. Librarian can view pending requests and approve or reject each one.
  4. Approved requests create active loans and duplicate active requests are blocked.

**Plans**: 3 plans

Plans:

- [ ] 03-01: Implement member schema, API routes, and librarian member management UI.
- [ ] 03-02: Implement borrow request schema, student request flow, and request-status UI.
- [ ] 03-03: Implement librarian approval/rejection flow and active-loan creation.

### Phase 4: Loans, Returns, History, and Demo Readiness

**Goal**: The full borrowing lifecycle is complete and ready for course demonstration.
**Mode:** mvp
**Depends on**: Phase 3
**Requirements**: [LOAN-01, LOAN-02, LOAN-03, LOAN-04, LOAN-05, LOAN-06, DEMO-01]
**Success Criteria** (what must be TRUE):

  1. Librarian can view active loans and record returns.
  2. Returned books become available for new borrow requests.
  3. Student can view active loans and loan history.
  4. Librarian can view loan history by member and by book.
  5. React screens cover the complete student and librarian demo workflows.

**Plans**: 2 plans

Plans:

- [ ] 04-01: Implement loan return logic, active loan views, and availability updates.
- [ ] 04-02: Implement student/librarian history views and course-demo workflow polish.

## Progress

**Execution Order:**
Phases execute in numeric order: 1 -> 2 -> 3 -> 4

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Application Foundation and Role Login | 0/3 | Not started | - |
| 2. Book Catalog and Search | 0/2 | Not started | - |
| 3. Member Management and Borrow Requests | 0/3 | Not started | - |
| 4. Loans, Returns, History, and Demo Readiness | 0/2 | Not started | - |
