const express = require("express");
const { openDatabase } = require("../db");
const { hashPassword } = require("../auth/passwords");
const { requireRole } = require("../auth/guards");

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

function parseActive(value) {
  if (value === false || value === 0 || value === "0" || String(value).toLowerCase() === "false" || String(value).toLowerCase() === "inactive") {
    return 0;
  }
  return 1;
}

function publicMember(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    memberId: user.member_id,
    role: user.role,
    memberActive: Boolean(user.member_active)
  };
}

router.get("/", requireRole("librarian"), (req, res) => {
  const db = openDatabase();
  const members = db
    .prepare(
      `SELECT id, name, email, member_id, role, member_active FROM users WHERE role = 'student' ORDER BY name`
    )
    .all()
    .map(publicMember);

  res.json({ members });
});

router.post("/", requireRole("librarian"), (req, res) => {
  const db = openDatabase();
  const name = String(req.body.name || "").trim();
  const memberId = String(req.body.memberId || "").trim();
  const email = normalizeEmail(req.body.email);
  const password = String(req.body.password || "");
  const memberActive = parseActive(req.body.memberActive);

  if (!requiredString(name) || !validMemberId(memberId) || !requiredString(email) || !requiredString(password)) {
    return res.status(400).json({ message: "Name, member ID, email, and password are required." });
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
      `INSERT INTO users (name, member_id, email, password_hash, role, member_active)
       VALUES (?, ?, ?, ?, 'student', ?)`
    )
    .run(name, memberId, email, passwordHash, memberActive);

  const member = db.prepare("SELECT * FROM users WHERE id = ?").get(result.lastInsertRowid);
  res.status(201).json({ member: publicMember(member) });
});

router.put("/:id", requireRole("librarian"), (req, res) => {
  const db = openDatabase();
  const id = Number(req.params.id);
  const name = String(req.body.name || "").trim();
  const memberId = String(req.body.memberId || "").trim();
  const email = normalizeEmail(req.body.email);
  const password = req.body.password ? String(req.body.password) : null;
  const memberActive = req.body.memberActive !== undefined ? parseActive(req.body.memberActive) : null;

  if (!Number.isFinite(id) || id <= 0) {
    return res.status(400).json({ message: "Invalid member ID." });
  }

  const member = db.prepare("SELECT * FROM users WHERE id = ?").get(id);
  if (!member || member.role !== "student") {
    return res.status(404).json({ message: "Member not found." });
  }

  if (!requiredString(name) || !validMemberId(memberId) || !requiredString(email)) {
    return res.status(400).json({ message: "Name, member ID, and email are required." });
  }

  const existing = db
    .prepare("SELECT id FROM users WHERE (email = ? OR member_id = ?) AND id != ?")
    .get(email, memberId, id);
  if (existing) {
    return res.status(409).json({ message: "Email or member ID is already in use." });
  }

  let updateSql = "UPDATE users SET name = ?, member_id = ?, email = ?";
  const params = [name, memberId, email];

  if (memberActive !== null) {
    updateSql += ", member_active = ?";
    params.push(memberActive);
  }

  if (password) {
    const passwordHash = hashPassword(password);
    updateSql += ", password_hash = ?";
    params.push(passwordHash);
  }

  updateSql += " WHERE id = ?";
  params.push(id);

  db.prepare(updateSql).run(...params);

  const updated = db.prepare("SELECT * FROM users WHERE id = ?").get(id);
  res.json({ member: publicMember(updated) });
});

module.exports = router;
