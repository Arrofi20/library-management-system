const os = require("os");
const path = require("path");
const request = require("supertest");
const { afterEach, beforeEach, describe, expect, it } = require("vitest");
const { createApp } = require("../src/app");
const { openDatabase, resetDatabaseForTests } = require("../src/db");
const { seedDemoData } = require("../src/seed");

beforeEach(() => {
  process.env.LIBRARY_DB_PATH = path.join(os.tmpdir(), `library-smoke-${Date.now()}-${Math.random()}.sqlite`);
  resetDatabaseForTests();
});

afterEach(() => {
  resetDatabaseForTests();
  delete process.env.LIBRARY_DB_PATH;
});

describe("application skeleton", () => {
  it("reports API and SQLite health", async () => {
    const app = createApp();
    const response = await request(app).get("/api/health").expect(200);

    expect(response.body).toEqual({ ok: true, database: "available" });
  });

  it("seeds deterministic demo users and books", () => {
    createApp();
    seedDemoData();
    seedDemoData();

    const db = openDatabase();
    const users = db.prepare("SELECT role, COUNT(*) as count FROM users GROUP BY role ORDER BY role").all();
    const books = db.prepare("SELECT COUNT(*) as count FROM books").get();

    expect(users).toEqual([
      { role: "librarian", count: 1 },
      { role: "student", count: 1 }
    ]);
    expect(books.count).toBe(3);
  });
});
