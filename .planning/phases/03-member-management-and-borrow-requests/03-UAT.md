---
phase: 03-member-management-and-borrow-requests
verified: partial
completed_at: 2026-06-10
---

# Phase 3 UAT

## Validation summary
- Baseline workspace tests pass: `npm test` completed successfully.
- Existing client and server smoke tests pass, but new Phase 3 member and borrow request flows are not covered by dedicated automated tests yet.
- One actionable UI bug was identified in the librarian member management flow.

## Tests executed

1. `npm test`
   - Verified the full workspace test suite.
   - Result: `2` client test files passed, `3` server test files passed.

2. Code inspection of the Phase 3 implementation
   - Confirmed new router mount points in `server/src/app.js`:
     - `/api/members`
     - `/api/borrow-requests`
   - Confirmed `client/src/App.jsx` and `client/src/components/AppShell.jsx` expose new navigation targets for the student catalog/request flow and the librarian members/borrow requests flow.
   - Confirmed `CatalogPage.jsx` now supports borrow requests via `client/src/api/borrowRequests.js`.

## Verified behavior
- `server/src/routes/members.js` provides librarian-only list/create/update member routes.
- `server/src/routes/borrowRequests.js` provides student request submission, student request history, librarian pending request review, approve, and reject actions.
- `client/src/components/CatalogPage.jsx` and `client/src/components/BookTable.jsx` are wired to allow students to request available books.
- `client/src/components/MembersPage.jsx` and `client/src/components/MemberForm.jsx` are present and wired to manage member records in the librarian UI.

## Issue found
- `client/src/components/MemberForm.jsx` handles a missing password on new member creation incorrectly.
  - The submit handler calls `onSave({ error: "Password is required for new members." })` instead of setting a local validation state or returning early.
  - That means the error is surfaced as payload data rather than as a proper validation failure.

## Diagnosis
- `MemberForm` needs to manage form-level validation internally and avoid invoking the save callback with an error object.
- If the user submits without a password, the current flow can send invalid payload to the API rather than preventing submission cleanly.

## Recommended fix
- Update `MemberForm.jsx` to keep `error` as a local state property or to simply return early with a validation message.
- Ensure `onSave` is only called with a valid member payload.
- Add a dedicated client test for the new member creation flow and one server test for the members API.

## Next steps
1. Fix `client/src/components/MemberForm.jsx` validation flow.
2. Add dedicated tests:
   - `server/tests/members.test.js`
   - `client/src/__tests__/members-page.test.jsx`
   - `client/src/__tests__/borrow-requests.test.jsx`
3. Re-run `npm test` and then perform a manual librarian flow check:
   - login as librarian
   - open Members page
   - add a member
   - edit a member
   - deactivate/reactivate a member
   - ensure deactivated member login remains valid while borrow request submission is blocked.
