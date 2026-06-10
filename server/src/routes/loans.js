const express = require("express");
const { openDatabase } = require("../db");
const { requireRole } = require("../auth/guards");

const router = express.Router();

function requiredInteger(value) {
  return Number.isFinite(Number(value)) && Number(value) > 0;
}

function publicLoan(row) {
  return {
    id: row.id,
    bookId: row.book_id,
    bookTitle: row.book_title,
    studentId: row.student_id,
    studentName: row.student_name,
    borrowRequestId: row.borrow_request_id,
    status: row.status,
    borrowedAt: row.borrowed_at,
    returnedAt: row.returned_at || null
  };
}

router.get("/my", requireRole("student"), (req, res) => {
  const db = openDatabase();
  const loans = db
    .prepare(
      `SELECT loans.*, books.title AS book_title, users.name AS student_name
       FROM loans
       JOIN books ON books.id = loans.book_id
       JOIN users ON users.id = loans.student_id
       WHERE loans.student_id = ?
       ORDER BY loans.borrowed_at DESC`
    )
    .all(req.currentUser.id)
    .map(publicLoan);

  res.json({ loans });
});

router.get("/", requireRole("librarian"), (req, res) => {
  const db = openDatabase();
  const memberFilter = String(req.query.member || "").trim();
  const bookFilter = String(req.query.book || "").trim();
  const conditions = [];
  const bindings = [];

  if (memberFilter) {
    conditions.push("users.name LIKE ?");
    bindings.push(`%${memberFilter}%`);
  }

  if (bookFilter) {
    conditions.push("books.title LIKE ?");
    bindings.push(`%${bookFilter}%`);
  }

  const filterSql = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";
  const loans = db
    .prepare(
      `SELECT loans.*, books.title AS book_title, users.name AS student_name
       FROM loans
       JOIN books ON books.id = loans.book_id
       JOIN users ON users.id = loans.student_id
       ${filterSql}
       ORDER BY loans.borrowed_at DESC`
    )
    .all(...bindings)
    .map(publicLoan);

  res.json({ loans });
});

router.put("/:id/return", requireRole("librarian"), (req, res) => {
  const db = openDatabase();
  const id = Number(req.params.id);

  if (!requiredInteger(id)) {
    return res.status(400).json({ message: "Invalid loan ID." });
  }

  const loan = db.prepare("SELECT * FROM loans WHERE id = ?").get(id);
  if (!loan) {
    return res.status(404).json({ message: "Loan not found." });
  }

  if (loan.status !== "active") {
    return res.status(400).json({ message: "Only active loans can be returned." });
  }

  const transaction = db.transaction(() => {
    db.prepare("UPDATE loans SET status = 'returned', returned_at = CURRENT_TIMESTAMP WHERE id = ?").run(id);
    db.prepare("UPDATE books SET available = 1 WHERE id = ?").run(loan.book_id);
  });

  transaction();

  const returned = db
    .prepare(
      `SELECT loans.*, books.title AS book_title, users.name AS student_name
       FROM loans
       JOIN books ON books.id = loans.book_id
       JOIN users ON users.id = loans.student_id
       WHERE loans.id = ?`
    )
    .get(id);

  res.json({ loan: publicLoan(returned) });
});

module.exports = router;
