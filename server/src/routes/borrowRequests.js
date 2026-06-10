const express = require("express");
const { openDatabase } = require("../db");
const { requireAuth, requireRole } = require("../auth/guards");

const router = express.Router();

function requiredInteger(value) {
  return Number.isFinite(Number(value)) && Number(value) > 0;
}

function publicRequest(row) {
  return {
    id: row.id,
    bookId: row.book_id,
    bookTitle: row.book_title,
    studentId: row.student_id,
    studentName: row.student_name,
    status: row.status,
    requestedAt: row.requested_at,
    rejectedNote: row.rejected_note || null
  };
}

router.post("/", requireRole("student"), (req, res) => {
  const db = openDatabase();
  const bookId = Number(req.body.bookId);

  if (!requiredInteger(bookId)) {
    return res.status(400).json({ message: "A valid book ID is required." });
  }

  const member = db.prepare("SELECT member_active FROM users WHERE id = ?").get(req.currentUser.id);
  if (!member || !member.member_active) {
    return res.status(403).json({ message: "Your account cannot request books." });
  }

  const book = db.prepare("SELECT * FROM books WHERE id = ?").get(bookId);
  if (!book) {
    return res.status(404).json({ message: "Book not found." });
  }

  if (book.available === 0) {
    return res.status(409).json({ message: "This book is currently unavailable." });
  }

  const duplicatePending = db
    .prepare("SELECT id FROM borrow_requests WHERE student_id = ? AND book_id = ? AND status = 'pending'")
    .get(req.currentUser.id, bookId);
  if (duplicatePending) {
    return res.status(409).json({ message: "You already have a pending request for this book." });
  }

  const existingLoan = db
    .prepare("SELECT id FROM loans WHERE student_id = ? AND book_id = ? AND status = 'active'")
    .get(req.currentUser.id, bookId);
  if (existingLoan) {
    return res.status(409).json({ message: "You already have an active loan for this book." });
  }

  const result = db
    .prepare(
      `INSERT INTO borrow_requests (student_id, book_id, status)
       VALUES (?, ?, 'pending')`
    )
    .run(req.currentUser.id, bookId);

  const created = db
    .prepare(
      `SELECT br.id, br.book_id, br.student_id, br.status, br.requested_at, br.rejected_note,
              books.title AS book_title, users.name AS student_name
       FROM borrow_requests br
       JOIN books ON books.id = br.book_id
       JOIN users ON users.id = br.student_id
       WHERE br.id = ?`
    )
    .get(result.lastInsertRowid);

  res.status(201).json({ request: publicRequest(created) });
});

router.get("/my", requireRole("student"), (req, res) => {
  const db = openDatabase();
  const requests = db
    .prepare(
      `SELECT br.id, br.book_id, br.student_id, br.status, br.requested_at, br.rejected_note,
              books.title AS book_title, users.name AS student_name
       FROM borrow_requests br
       JOIN books ON books.id = br.book_id
       JOIN users ON users.id = br.student_id
       WHERE br.student_id = ?
       ORDER BY br.requested_at DESC`
    )
    .all(req.currentUser.id)
    .map(publicRequest);

  res.json({ requests });
});

router.get("/pending", requireRole("librarian"), (req, res) => {
  const db = openDatabase();
  const requests = db
    .prepare(
      `SELECT br.id, br.book_id, br.student_id, br.status, br.requested_at, br.rejected_note,
              books.title AS book_title, users.name AS student_name
       FROM borrow_requests br
       JOIN books ON books.id = br.book_id
       JOIN users ON users.id = br.student_id
       WHERE br.status = 'pending'
       ORDER BY br.requested_at ASC`
    )
    .all()
    .map(publicRequest);

  res.json({ requests });
});

router.put("/:id/approve", requireRole("librarian"), (req, res) => {
  const db = openDatabase();
  const id = Number(req.params.id);

  if (!requiredInteger(id)) {
    return res.status(400).json({ message: "Invalid request ID." });
  }

  const requestRow = db.prepare("SELECT * FROM borrow_requests WHERE id = ?").get(id);
  if (!requestRow) {
    return res.status(404).json({ message: "Borrow request not found." });
  }

  if (requestRow.status !== "pending") {
    return res.status(400).json({ message: "Only pending requests can be approved." });
  }

  const book = db.prepare("SELECT * FROM books WHERE id = ?").get(requestRow.book_id);
  if (!book || book.available === 0) {
    return res.status(409).json({ message: "This book is unavailable and cannot be approved." });
  }

  const transaction = db.transaction(() => {
    db.prepare("UPDATE borrow_requests SET status = 'approved' WHERE id = ?").run(id);
    db.prepare(
      `INSERT INTO loans (student_id, book_id, borrow_request_id, status)
       VALUES (?, ?, ?, 'active')`
    ).run(requestRow.student_id, requestRow.book_id, id);
    db.prepare("UPDATE books SET available = 0 WHERE id = ?").run(requestRow.book_id);
  });

  transaction();

  const approved = db
    .prepare(
      `SELECT br.id, br.book_id, br.student_id, br.status, br.requested_at, br.rejected_note,
              books.title AS book_title, users.name AS student_name
       FROM borrow_requests br
       JOIN books ON books.id = br.book_id
       JOIN users ON users.id = br.student_id
       WHERE br.id = ?`
    )
    .get(id);

  res.json({ request: publicRequest(approved) });
});

router.put("/:id/reject", requireRole("librarian"), (req, res) => {
  const db = openDatabase();
  const id = Number(req.params.id);
  const note = String(req.body.note || "").trim();

  if (!requiredInteger(id)) {
    return res.status(400).json({ message: "Invalid request ID." });
  }

  const requestRow = db.prepare("SELECT * FROM borrow_requests WHERE id = ?").get(id);
  if (!requestRow) {
    return res.status(404).json({ message: "Borrow request not found." });
  }

  if (requestRow.status !== "pending") {
    return res.status(400).json({ message: "Only pending requests can be rejected." });
  }

  db.prepare("UPDATE borrow_requests SET status = 'rejected', rejected_note = ? WHERE id = ?").run(note || null, id);

  const rejected = db
    .prepare(
      `SELECT br.id, br.book_id, br.student_id, br.status, br.requested_at, br.rejected_note,
              books.title AS book_title, users.name AS student_name
       FROM borrow_requests br
       JOIN books ON books.id = br.book_id
       JOIN users ON users.id = br.student_id
       WHERE br.id = ?`
    )
    .get(id);

  res.json({ request: publicRequest(rejected) });
});

module.exports = router;
