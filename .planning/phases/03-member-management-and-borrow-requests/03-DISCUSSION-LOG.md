# Phase 3: Member Management and Borrow Requests - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md - this log preserves the alternatives considered.

**Date:** 2026-06-10
**Phase:** 3-Member Management and Borrow Requests
**Areas discussed:** Member records, member deactivation, member management UI, student request placement, request status, request details, librarian request queue, rejection behavior, approval behavior, duplicate blocking, pending request handling, loan fields

---

## Member Records

| Option | Description | Selected |
|--------|-------------|----------|
| Reuse student user accounts | The app already stores `name`, `member_id`, `email`, and `role` in `users`, so member management can extend existing student accounts without duplicating identities. | Yes |
| Create a separate `members` table linked to student users | More flexible, but adds extra sync rules between registered students and librarian-created members. | |
| Create member records completely separate from login users | Useful for offline library members, but weaker fit for this v1 student login workflow. | |

**User's choice:** Reuse student user accounts as member records.
**Notes:** This keeps Phase 3 aligned with the Phase 1 student registration fields.

---

## Member Deactivation

| Option | Description | Selected |
|--------|-------------|----------|
| Block future borrowing only | Keep login/history intact, prevent new borrow requests, and show the member as inactive to librarians. | Yes |
| Disable student login completely | Stronger restriction, but can hide the student's own request/loan history and complicate demo flow. | |
| Soft-delete the member from librarian views | Keeps data but can make history and audit trails harder to explain. | |

**User's choice:** Block future borrowing only.
**Notes:** Deactivation must not disable login or hide history.

---

## Member Management UI

| Option | Description | Selected |
|--------|-------------|----------|
| Single Members page with table plus inline add/edit form | Matches the existing librarian Books page pattern and works well for a course demo. | Yes |
| Members table with a separate detail screen per member | More room for future loan history, but heavier navigation for Phase 3. | |
| Simple table only, no full edit form | Faster, but does not satisfy create/edit/deactivate cleanly. | |

**User's choice:** Single Members page with table plus inline add/edit form.
**Notes:** Mirror the existing Books page pattern.

---

## Student Request Placement

| Option | Description | Selected |
|--------|-------------|----------|
| Add a "Request" action directly in the catalog table for available books | Keeps the request flow attached to the book search experience students already use. | Yes |
| Add a separate book detail panel before requesting | More explicit, but adds a new interaction pattern for little benefit in this v1 catalog. | |
| Use a separate Borrow Request page where students select a book | Clear workflow separation, but duplicates catalog search/filter UI. | |

**User's choice:** Add a request action directly in the catalog table for available books.
**Notes:** Student request entry stays in the catalog.

---

## Student Request Status

| Option | Description | Selected |
|--------|-------------|----------|
| A "My requests" section/page showing pending, approved, and rejected requests | Satisfies request status without mixing it into Phase 4 loan history. | Yes |
| Only inline catalog status badges per book | Minimal, but weak for tracking multiple past requests. | |
| Dashboard summary only | Useful as a shortcut, but not enough detail by itself. | |

**User's choice:** A "My requests" view showing pending, approved, and rejected requests.
**Notes:** This covers request status while leaving loan history for Phase 4.

---

## Request Details

| Option | Description | Selected |
|--------|-------------|----------|
| Book title/author, request date, status, and rejection note if rejected | Enough for students and librarians to understand the workflow without adding due-date/history scope. | Yes |
| Full book details plus librarian name and timestamps for every action | More audit detail, but heavier than needed for the course demo. | |
| Book title and status only | Very compact, but too thin for explaining approvals/rejections. | |

**User's choice:** Book title/author, request date, status, and rejection note if rejected.
**Notes:** Keep request records useful but not overloaded.

---

## Librarian Request Queue

| Option | Description | Selected |
|--------|-------------|----------|
| Single "Borrow requests" page focused on pending requests, with approve/reject actions | Matches the role navigation and keeps approval work obvious. | Yes |
| Show requests inside member detail rows only | Good for member-centric review, but pending work is harder to scan. | |
| Show requests inside book rows only | Good for book-centric review, but less natural for approving student requests. | |

**User's choice:** Single Borrow requests page focused on pending requests, with approve/reject actions.
**Notes:** Keep librarian approval work in one obvious queue.

---

## Rejection Behavior

| Option | Description | Selected |
|--------|-------------|----------|
| Optional rejection note | Supports visible status updates without slowing the demo workflow. | Yes |
| Required rejection note | Clearer for students, but adds friction to every reject action. | |
| No rejection note | Simpler, but less useful for student status visibility. | |

**User's choice:** Optional rejection note.
**Notes:** Rejection note appears when provided.

---

## Approval Behavior

| Option | Description | Selected |
|--------|-------------|----------|
| Create an active loan, mark the book unavailable, and mark the request approved | Matches the roadmap success criteria and Phase 2 availability decision that loans should take over availability automatically. | Yes |
| Only mark the request approved; loans are created later in Phase 4 | Simpler now, but conflicts with Phase 3 success criteria requiring active-loan creation. | |
| Mark approved and unavailable, but do not create a loan record yet | Avoids loan UI, but creates awkward data for Phase 4. | |

**User's choice:** Create an active loan, mark the book unavailable, and mark the request approved.
**Notes:** Phase 3 must create active-loan data even though returns/history remain Phase 4.

---

## Duplicate Blocking

| Option | Description | Selected |
|--------|-------------|----------|
| Block if the same student already has a pending request or active loan for the same book | Matches `BOR-06` exactly and avoids blocking unrelated students from waiting on the same book unless the book is unavailable. | Yes |
| Block all new requests for a book once any student has a pending request | Stricter, but creates first-come behavior not stated in scope. | |
| Block only active loans, allow duplicate pending requests | Simpler, but allows noisy duplicate requests from the same student. | |

**User's choice:** Block same-student duplicate pending requests or active loans for the same book.
**Notes:** Duplicate prevention is scoped per student and book.

---

## Pending Requests After Approval

| Option | Description | Selected |
|--------|-------------|----------|
| Leave other students' pending requests as pending, but they cannot be approved while the book is unavailable | Keeps the scope simple and lets Phase 4 returns make the book available again. | Yes |
| Automatically reject all other pending requests for that book | More decisive, but adds batch side effects and rejection messaging. | |
| Hide other pending requests until the book returns | Avoids clutter, but makes workflow state less transparent. | |

**User's choice:** Leave other students' pending requests pending, but block approval while the book is unavailable.
**Notes:** Pending state remains visible and transparent.

---

## Loan Fields

| Option | Description | Selected |
|--------|-------------|----------|
| Student/member ID, book ID, approved request ID, loan start date, and status | Enough for Phase 3 active-loan creation and Phase 4 returns/history without adding due-date rules. | Yes |
| Include due date and overdue fields now | Useful later, but due-date and overdue rules are explicitly v2/out of Phase 3. | |
| Only student/member ID and book ID | Minimal, but weak for history and return workflows. | |

**User's choice:** Student/member ID, book ID, approved request ID, loan start date, and status.
**Notes:** Do not add due dates, overdue fields, fines, or return behavior in Phase 3.

---

## the agent's Discretion

- Choose exact component names, route file names, API module boundaries, and compact rejection note UI.
- Choose exact empty/loading/error messages consistent with existing app style.

## Deferred Ideas

None.
