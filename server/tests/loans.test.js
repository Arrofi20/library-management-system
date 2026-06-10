const os = require("os");
const path = require("path");
const request = require("supertest");
const vitest = await import("vitest");
const { afterEach, beforeEach, describe, expect, it } = vitest;
const { createApp } = require("../src/app");
const { openDatabase, resetDatabaseForTests } = require("../src/db");
const { seedDemoData } = require("../src/seed");

beforeEach(() => {
  process.env.LIBRARY_DB_PATH = path.join(os.tmpdir(), `library-loans-${Date.now()}-${Math.random()}.sqlite`);
  resetDatabaseForTests();
});

afterEach(() => {
  resetDatabaseForTests();
  delete process.env.LIBRARY_DB_PATH;
});

describe("loans API", () => {
  it("returns a student loan timeline after a borrow request is approved", async () => {
    const app = createApp();
    seedDemoData();

    const studentAgent = request.agent(app);
    await studentAgent
      .post("/api/auth/login")
      .send({ email: "student@example.edu", password: "student123" })
      .expect(200);

    const availableBook = openDatabase().prepare("SELECT id FROM books WHERE available = 1 LIMIT 1").get();
    expect(availableBook).toBeTruthy();

    const borrowResponse = await studentAgent
      .post("/api/borrow-requests")
      .send({ bookId: availableBook.id })
      .expect(201);

    const librarianAgent = request.agent(app);
    await librarianAgent
      .post("/api/auth/login")
      .send({ email: "librarian@example.edu", password: "librarian123" })
      .expect(200);

    await librarianAgent
      .put(`/api/borrow-requests/${borrowResponse.body.request.id}/approve`)
      .expect(200);

    const myLoansResponse = await studentAgent.get("/api/loans/my").expect(200);
    expect(Array.isArray(myLoansResponse.body.loans)).toBe(true);
    expect(myLoansResponse.body.loans).toHaveLength(1);
    expect(myLoansResponse.body.loans[0]).toMatchObject({ status: "active", bookId: availableBook.id });
  });

  it("allows a librarian to return an active loan and restores book availability", async () => {
    const app = createApp();
    seedDemoData();

    const studentAgent = request.agent(app);
    await studentAgent
      .post("/api/auth/login")
      .send({ email: "student@example.edu", password: "student123" })
      .expect(200);

    const availableBook = openDatabase().prepare("SELECT id FROM books WHERE available = 1 LIMIT 1").get();
    expect(availableBook).toBeTruthy();

    const borrowResponse = await studentAgent
      .post("/api/borrow-requests")
      .send({ bookId: availableBook.id })
      .expect(201);

    const librarianAgent = request.agent(app);
    await librarianAgent
      .post("/api/auth/login")
      .send({ email: "librarian@example.edu", password: "librarian123" })
      .expect(200);

    const approveResponse = await librarianAgent
      .put(`/api/borrow-requests/${borrowResponse.body.request.id}/approve`)
      .expect(200);

    const loanId = openDatabase().prepare("SELECT id FROM loans WHERE borrow_request_id = ?").get(borrowResponse.body.request.id).id;
    const returnResponse = await librarianAgent
      .put(`/api/loans/${loanId}/return`)
      .expect(200);

    expect(returnResponse.body.loan).toMatchObject({ status: "returned", bookId: availableBook.id });
    expect(returnResponse.body.loan.returnedAt).toBeTruthy();

    const bookRow = openDatabase().prepare("SELECT available FROM books WHERE id = ?").get(availableBook.id);
    expect(bookRow.available).toBe(1);
  });

  it("filters loans by member name and book title for librarians", async () => {
    const app = createApp();
    seedDemoData();

    const studentAgent = request.agent(app);
    await studentAgent
      .post("/api/auth/login")
      .send({ email: "student@example.edu", password: "student123" })
      .expect(200);

    const availableBook = openDatabase().prepare("SELECT id, title FROM books WHERE available = 1 LIMIT 1").get();
    expect(availableBook).toBeTruthy();

    const borrowResponse = await studentAgent
      .post("/api/borrow-requests")
      .send({ bookId: availableBook.id })
      .expect(201);

    const librarianAgent = request.agent(app);
    await librarianAgent
      .post("/api/auth/login")
      .send({ email: "librarian@example.edu", password: "librarian123" })
      .expect(200);

    await librarianAgent
      .put(`/api/borrow-requests/${borrowResponse.body.request.id}/approve`)
      .expect(200);

    const filteredByMember = await librarianAgent.get("/api/loans?member=Demo%20Student").expect(200);
    expect(filteredByMember.body.loans.length).toBeGreaterThanOrEqual(1);
    expect(filteredByMember.body.loans[0].studentName).toContain("Demo Student");

    const filteredByBook = await librarianAgent.get(`/api/loans?book=${encodeURIComponent(availableBook.title)}`).expect(200);
    expect(filteredByBook.body.loans.length).toBeGreaterThanOrEqual(1);
    expect(filteredByBook.body.loans[0].bookTitle).toBe(availableBook.title);
  });
});
