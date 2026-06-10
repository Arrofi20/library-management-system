const os = require("os");
const path = require("path");
const request = require("supertest");
const vitest = await import("vitest");
const { afterEach, beforeEach, describe, expect, it } = vitest;
const { createApp } = require("../src/app");
const { openDatabase, resetDatabaseForTests } = require("../src/db");
const { seedDemoData } = require("../src/seed");

beforeEach(() => {
  process.env.LIBRARY_DB_PATH = path.join(os.tmpdir(), `library-books-${Date.now()}-${Math.random()}.sqlite`);
  resetDatabaseForTests();
});

afterEach(() => {
  resetDatabaseForTests();
  delete process.env.LIBRARY_DB_PATH;
});

describe("book catalog API", () => {
  it("returns books and supports search / category / availability filters", async () => {
    const app = createApp();
    seedDemoData();

    const response = await request(app)
      .get("/api/books?search=clean&availability=Available")
      .expect(200);

    expect(response.body.books).toHaveLength(1);
    expect(response.body.books[0]).toMatchObject({ title: "Clean Code", available: true });

    const categoryResponse = await request(app)
      .get("/api/books?category=Databases")
      .expect(200);

    expect(categoryResponse.body.books.every((book) => book.category === "Databases")).toBe(true);

    const unavailableResponse = await request(app)
      .get("/api/books?availability=Unavailable")
      .expect(200);

    expect(unavailableResponse.body.books.every((book) => book.available === false)).toBe(true);
  });

  it("allows librarians to create, update, and delete available books", async () => {
    const app = createApp();
    seedDemoData();

    const agent = request.agent(app);
    await agent
      .post("/api/auth/login")
      .send({ email: "librarian@example.edu", password: "librarian123" })
      .expect(200);

    const createResponse = await agent
      .post("/api/books")
      .send({
        title: "New Library Book",
        author: "Test Author",
        category: "Information Systems",
        isbn: "9781234567897",
        available: 1
      })
      .expect(201);

    expect(createResponse.body.book).toMatchObject({ title: "New Library Book", available: true });

    const bookId = createResponse.body.book.id;
    const updateResponse = await agent
      .put(`/api/books/${bookId}`)
      .send({
        title: "New Library Book Revised",
        author: "Test Author",
        category: "Information Systems",
        isbn: "9781234567897",
        available: 1
      })
      .expect(200);

    expect(updateResponse.body.book.title).toBe("New Library Book Revised");

    await agent.delete(`/api/books/${bookId}`).expect(200);
  });

  it("blocks students from creating books and blocks delete when unavailable", async () => {
    const app = createApp();
    seedDemoData();

    const studentAgent = request.agent(app);
    await studentAgent
      .post("/api/auth/login")
      .send({ email: "student@example.edu", password: "student123" })
      .expect(200);

    await studentAgent
      .post("/api/books")
      .send({
        title: "Student Book",
        author: "No Author",
        category: "UX",
        isbn: "9789123456784",
        available: 1
      })
      .expect(403);

    const librarianAgent = request.agent(app);
    await librarianAgent
      .post("/api/auth/login")
      .send({ email: "librarian@example.edu", password: "librarian123" })
      .expect(200);

    const created = await librarianAgent
      .post("/api/books")
      .send({
        title: "Unavailable Reference",
        author: "Test Author",
        category: "Management",
        isbn: "9781234567890",
        available: 0
      })
      .expect(201);

    await librarianAgent.delete(`/api/books/${created.body.book.id}`).expect(409);
  });
});
