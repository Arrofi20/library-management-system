# Requirements: Library Management System

**Defined:** 2026-06-09
**Core Value:** Students and librarians can complete the full borrow lifecycle: find a book, request it, approve the loan, track it, and return it.

## v1 Requirements

Requirements for initial release. Each maps to roadmap phases.

### Authentication and Roles

- [ ] **AUTH-01**: Student can register with name, student/member identifier, email, and password.
- [ ] **AUTH-02**: Student can log in and access student-only features.
- [ ] **AUTH-03**: Librarian can log in and access librarian-only features.
- [ ] **AUTH-04**: Logged-in user can log out and end the session.
- [ ] **AUTH-05**: User sees navigation and allowed actions appropriate to their role.

### Catalog

- [ ] **CAT-01**: Student can view a list of books with title, author, category, ISBN, and availability status.
- [ ] **CAT-02**: Student can search books by title, author, category, or ISBN.
- [ ] **CAT-03**: Student can filter books by availability and category.
- [ ] **CAT-04**: Librarian can create a book record.
- [ ] **CAT-05**: Librarian can edit an existing book record.
- [ ] **CAT-06**: Librarian can delete a book record that is not currently on loan.

### Members

- [ ] **MEM-01**: Librarian can create a member record for a student.
- [ ] **MEM-02**: Librarian can view member details and borrowing status.
- [ ] **MEM-03**: Librarian can edit member details.
- [ ] **MEM-04**: Librarian can deactivate a member who should no longer borrow books.

### Borrow Requests

- [ ] **BOR-01**: Student can submit a borrow request for an available book.
- [ ] **BOR-02**: Student can view the status of their borrow requests.
- [ ] **BOR-03**: Librarian can view pending borrow requests.
- [ ] **BOR-04**: Librarian can approve a pending borrow request and create an active loan.
- [ ] **BOR-05**: Librarian can reject a pending borrow request with a visible status update.
- [ ] **BOR-06**: System prevents duplicate active requests or active loans for the same student and book.

### Loans and Returns

- [ ] **LOAN-01**: Librarian can view all active loans.
- [ ] **LOAN-02**: Librarian can record a book return.
- [ ] **LOAN-03**: Returned book becomes available for borrowing again.
- [ ] **LOAN-04**: Student can view their active loans.
- [ ] **LOAN-05**: Student can view their loan history.
- [ ] **LOAN-06**: Librarian can view loan history by member and by book.

### Course Demo

- [ ] **DEMO-01**: Application uses a React frontend with screens for student and librarian workflows.
- [ ] **DEMO-02**: Application uses a Node.js Express backend API.
- [ ] **DEMO-03**: Application persists users, books, members, requests, and loans in SQLite.
- [ ] **DEMO-04**: Application includes seed or setup data sufficient for a course demonstration.

## v2 Requirements

Deferred to future release. Tracked but not in current roadmap.

### Library Operations

- **OPS-01**: Librarian can configure due dates and overdue rules.
- **OPS-02**: Librarian can track fines for overdue or lost books.
- **OPS-03**: Librarian can generate inventory and loan reports.
- **OPS-04**: Librarian can manage multiple physical copies of the same title.

### Administration

- **ADM-01**: Admin can create and manage librarian accounts.
- **ADM-02**: Admin can configure system-wide library settings.

### Notifications

- **NOTIF-01**: Student receives email or in-app notifications when a borrow request is approved or rejected.
- **NOTIF-02**: Student receives reminders before a due date.

## Out of Scope

Explicitly excluded. Documented to prevent scope creep.

| Feature | Reason |
|---------|--------|
| Admin role | Student and Librarian roles are enough for v1 course-demo workflows. |
| Instant self-service borrowing | v1 uses librarian approval to demonstrate role-based workflow. |
| Payments and fine collection | Not needed for the core borrow lifecycle. |
| External library APIs | v1 uses a local SQLite-backed catalog. |
| Barcode scanning | Useful later, but not required for a web CRUD course project. |
| Multi-branch library management | Adds location and inventory complexity outside v1 scope. |

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| AUTH-01 | Pending | Pending |
| AUTH-02 | Pending | Pending |
| AUTH-03 | Pending | Pending |
| AUTH-04 | Pending | Pending |
| AUTH-05 | Pending | Pending |
| CAT-01 | Pending | Pending |
| CAT-02 | Pending | Pending |
| CAT-03 | Pending | Pending |
| CAT-04 | Pending | Pending |
| CAT-05 | Pending | Pending |
| CAT-06 | Pending | Pending |
| MEM-01 | Pending | Pending |
| MEM-02 | Pending | Pending |
| MEM-03 | Pending | Pending |
| MEM-04 | Pending | Pending |
| BOR-01 | Pending | Pending |
| BOR-02 | Pending | Pending |
| BOR-03 | Pending | Pending |
| BOR-04 | Pending | Pending |
| BOR-05 | Pending | Pending |
| BOR-06 | Pending | Pending |
| LOAN-01 | Pending | Pending |
| LOAN-02 | Pending | Pending |
| LOAN-03 | Pending | Pending |
| LOAN-04 | Pending | Pending |
| LOAN-05 | Pending | Pending |
| LOAN-06 | Pending | Pending |
| DEMO-01 | Pending | Pending |
| DEMO-02 | Pending | Pending |
| DEMO-03 | Pending | Pending |
| DEMO-04 | Pending | Pending |

**Coverage:**
- v1 requirements: 31 total
- Mapped to phases: 0
- Unmapped: 31

---
*Requirements defined: 2026-06-09*
*Last updated: 2026-06-09 after initial definition*
