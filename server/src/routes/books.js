const express = require("express");
const { openDatabase } = require("../db");
const { requireRole } = require("../auth/guards");

const router = express.Router();

function requiredString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function isValidIsbn(isbn) {
  return /^[0-9-]{10,17}$/.test(String(isbn || "").trim());
}

function parseAvailability(value) {
  if (value === false || value === 0 || value === "0" || String(value).toLowerCase() === "false" || String(value).toLowerCase() === "unavailable") {
    return 0;
  }
  return 1;
}

function publicBook(book) {
  return {
    id: book.id,
    title: book.title,
    author: book.author,
    category: book.category,
    isbn: book.isbn,
    available: Boolean(book.available)
  };
}

function buildBookQuery(filters) {
  const conditions = [];
  const params = [];

  if (filters.search) {
    const text = `%${filters.search.toLowerCase()}%`;
    conditions.push(`(lower(title) LIKE ? OR lower(author) LIKE ? OR lower(category) LIKE ? OR lower(isbn) LIKE ?)`);
    params.push(text, text, text, text);
  }

  if (filters.category && filters.category !== "All categories") {
    conditions.push("category = ?");
    params.push(filters.category);
  }

  if (filters.availability === "Available") {
    conditions.push("available = 1");
  } else if (filters.availability === "Unavailable") {
    conditions.push("available = 0");
  }

  return {
    clause: conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "",
    params
  };
}

router.get("/", (req, res) => {
  const db = openDatabase();
  const filters = {
    search: String(req.query.search || "").trim(),
    category: String(req.query.category || "").trim(),
    availability: String(req.query.availability || "").trim()
  };

  const query = buildBookQuery(filters);
  const books = db
    .prepare(`SELECT id, title, author, category, isbn, available FROM books ${query.clause} ORDER BY title`)
    .all(...query.params)
    .map(publicBook);

  res.json({ books });
});

router.post("/", requireRole("librarian"), (req, res) => {
  const db = openDatabase();
  const title = String(req.body.title || "").trim();
  const author = String(req.body.author || "").trim();
  const category = String(req.body.category || "").trim();
  const isbn = String(req.body.isbn || "").trim();
  const available = parseAvailability(req.body.available);

  if (!requiredString(title) || !requiredString(author) || !requiredString(category) || !isValidIsbn(isbn)) {
    return res.status(400).json({ message: "Title, author, category, and valid ISBN are required." });
  }

  const existing = db.prepare("SELECT id FROM books WHERE isbn = ?").get(isbn);
  if (existing) {
    return res.status(409).json({ message: "ISBN is already in use." });
  }

  const result = db
    .prepare(
      `INSERT INTO books (title, author, category, isbn, available)
       VALUES (?, ?, ?, ?, ?)`
    )
    .run(title, author, category, isbn, available);

  const book = db.prepare("SELECT * FROM books WHERE id = ?").get(result.lastInsertRowid);
  res.status(201).json({ book: publicBook(book) });
});

router.put("/:id", requireRole("librarian"), (req, res) => {
  const db = openDatabase();
  const id = Number(req.params.id);
  const title = String(req.body.title || "").trim();
  const author = String(req.body.author || "").trim();
  const category = String(req.body.category || "").trim();
  const isbn = String(req.body.isbn || "").trim();
  const available = parseAvailability(req.body.available);

  if (!Number.isFinite(id) || id <= 0) {
    return res.status(400).json({ message: "Invalid book ID." });
  }

  const book = db.prepare("SELECT * FROM books WHERE id = ?").get(id);
  if (!book) {
    return res.status(404).json({ message: "Book not found." });
  }

  if (!requiredString(title) || !requiredString(author) || !requiredString(category) || !isValidIsbn(isbn)) {
    return res.status(400).json({ message: "Title, author, category, and valid ISBN are required." });
  }

  if (book.available === 0 && isbn !== book.isbn) {
    return res
      .status(400)
      .json({ message: "ISBN cannot be changed while this book is unavailable or on loan." });
  }

  const existing = db.prepare("SELECT id FROM books WHERE isbn = ? AND id != ?").get(isbn, id);
  if (existing) {
    return res.status(409).json({ message: "ISBN is already in use." });
  }

  db.prepare(
    `UPDATE books SET title = ?, author = ?, category = ?, isbn = ?, available = ? WHERE id = ?`
  ).run(title, author, category, isbn, available, id);

  const updated = db.prepare("SELECT * FROM books WHERE id = ?").get(id);
  res.json({ book: publicBook(updated) });
});

router.delete("/:id", requireRole("librarian"), (req, res) => {
  const db = openDatabase();
  const id = Number(req.params.id);

  if (!Number.isFinite(id) || id <= 0) {
    return res.status(400).json({ message: "Invalid book ID." });
  }

  const book = db.prepare("SELECT * FROM books WHERE id = ?").get(id);
  if (!book) {
    return res.status(404).json({ message: "Book not found." });
  }

  if (book.available === 0) {
    return res.status(409).json({ message: "This book cannot be deleted because it has an active loan." });
  }

  db.prepare("DELETE FROM books WHERE id = ?").run(id);
  res.json({ ok: true });
});

module.exports = router;
