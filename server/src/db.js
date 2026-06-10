const Database = require("better-sqlite3");
const fs = require("fs");
const path = require("path");

const DEFAULT_DB_PATH = path.join(__dirname, "..", "data", "library.sqlite");

let connection;

function getDatabasePath() {
  return process.env.LIBRARY_DB_PATH || DEFAULT_DB_PATH;
}

function openDatabase() {
  if (connection) {
    return connection;
  }

  const dbPath = getDatabasePath();
  fs.mkdirSync(path.dirname(dbPath), { recursive: true });
  connection = new Database(dbPath);
  connection.pragma("foreign_keys = ON");
  return connection;
}

function resetDatabaseForTests() {
  if (connection) {
    connection.close();
    connection = undefined;
  }
}

function initializeSchema(db = openDatabase()) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      member_id TEXT NOT NULL UNIQUE,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL CHECK (role IN ('student', 'librarian')),
      member_active INTEGER NOT NULL DEFAULT 1 CHECK (member_active IN (0, 1)),
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS sessions (
      id TEXT PRIMARY KEY,
      user_id INTEGER NOT NULL,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS books (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      author TEXT NOT NULL,
      category TEXT NOT NULL,
      isbn TEXT NOT NULL UNIQUE,
      available INTEGER NOT NULL DEFAULT 1 CHECK (available IN (0, 1)),
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS borrow_requests (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      student_id INTEGER NOT NULL,
      book_id INTEGER NOT NULL,
      status TEXT NOT NULL CHECK (status IN ('pending', 'approved', 'rejected')),
      rejected_note TEXT,
      requested_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS loans (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      student_id INTEGER NOT NULL,
      book_id INTEGER NOT NULL,
      borrow_request_id INTEGER NOT NULL,
      status TEXT NOT NULL CHECK (status IN ('active', 'returned')),
      borrowed_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      returned_at TEXT,
      FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE,
      FOREIGN KEY (borrow_request_id) REFERENCES borrow_requests(id) ON DELETE CASCADE
    );
  `);

  const hasMemberActive = db
    .prepare("PRAGMA table_info(users)")
    .all()
    .some((column) => column.name === "member_active");

  if (!hasMemberActive) {
    db.exec(`ALTER TABLE users ADD COLUMN member_active INTEGER NOT NULL DEFAULT 1 CHECK (member_active IN (0, 1));`);
  }
}

function resetDemoData(db = openDatabase()) {
  db.exec(`
    DELETE FROM sessions;
    DELETE FROM loans;
    DELETE FROM borrow_requests;
    DELETE FROM books;
    DELETE FROM users;
    DELETE FROM sqlite_sequence WHERE name IN ('users', 'books', 'borrow_requests', 'loans', 'sessions');
  `);
}

function publicUser(user) {
  if (!user) {
    return null;
  }

  return {
    id: user.id,
    name: user.name,
    memberId: user.member_id,
    email: user.email,
    role: user.role
  };
}

module.exports = {
  getDatabasePath,
  openDatabase,
  resetDatabaseForTests,
  initializeSchema,
  resetDemoData,
  publicUser
};
