const express = require("express");
const { openDatabase, publicUser } = require("../db");
const { hashPassword, verifyPassword } = require("../auth/passwords");
const {
  COOKIE_NAME,
  createSession,
  destroySession,
  setSessionCookie,
  clearSessionCookie
} = require("../auth/sessions");
const { requireAuth, requireRole } = require("../auth/guards");

const router = express.Router();

function normalizeEmail(email) {
  return String(email || "").trim().toLowerCase();
}

function validMemberId(memberId) {
  return /^[A-Za-z0-9-]{3,24}$/.test(String(memberId || "").trim());
}

function requiredString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function createSessionResponse(res, user, db) {
  const sessionId = createSession(user.id, db);
  setSessionCookie(res, sessionId);
  return res.status(200).json({ user: publicUser(user) });
}

router.post("/register", (req, res) => {
  const db = openDatabase();
  const name = String(req.body.name || "").trim();
  const memberId = String(req.body.memberId || "").trim();
  const email = normalizeEmail(req.body.email);
  const password = String(req.body.password || "");

  if (!requiredString(name) || !validMemberId(memberId) || !requiredString(email) || !requiredString(password)) {
    return res.status(400).json({
      message: "Name, member ID, email, and password are required."
    });
  }

  const existing = db
    .prepare("SELECT id FROM users WHERE email = ? OR member_id = ?")
    .get(email, memberId);

  if (existing) {
    return res.status(409).json({ message: "Email or member ID is already registered." });
  }

  const passwordHash = hashPassword(password);
  const result = db
    .prepare(
      `INSERT INTO users (name, member_id, email, password_hash, role)
       VALUES (?, ?, ?, ?, 'student')`
    )
    .run(name, memberId, email, passwordHash);
  const user = db.prepare("SELECT * FROM users WHERE id = ?").get(result.lastInsertRowid);

  return createSessionResponse(res, user, db);
});

router.post("/login", (req, res) => {
  const db = openDatabase();
  const email = normalizeEmail(req.body.email);
  const password = String(req.body.password || "");
  const user = db.prepare("SELECT * FROM users WHERE email = ?").get(email);

  if (!user || !verifyPassword(password, user.password_hash)) {
    return res.status(401).json({ message: "Invalid email or password." });
  }

  return createSessionResponse(res, user, db);
});

router.get("/me", requireAuth, (req, res) => {
  res.json({ user: req.currentUser });
});

router.post("/logout", (req, res) => {
  destroySession(req.cookies?.[COOKIE_NAME]);
  clearSessionCookie(res);
  res.json({ ok: true });
});

router.get("/student-only", requireRole("student"), (req, res) => {
  res.json({ ok: true, role: req.currentUser.role });
});

router.get("/librarian-only", requireRole("librarian"), (req, res) => {
  res.json({ ok: true, role: req.currentUser.role });
});

module.exports = router;
