const crypto = require("crypto");
const { openDatabase, publicUser } = require("../db");

const COOKIE_NAME = "library_session";

function cookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/"
  };
}

function createSession(userId, db = openDatabase()) {
  const sessionId = crypto.randomBytes(32).toString("hex");
  db.prepare("INSERT INTO sessions (id, user_id) VALUES (?, ?)").run(sessionId, userId);
  return sessionId;
}

function findSessionUser(sessionId, db = openDatabase()) {
  if (!sessionId) {
    return null;
  }

  const user = db
    .prepare(
      `SELECT users.*
       FROM sessions
       JOIN users ON users.id = sessions.user_id
       WHERE sessions.id = ?`
    )
    .get(sessionId);

  return publicUser(user);
}

function destroySession(sessionId, db = openDatabase()) {
  if (!sessionId) {
    return;
  }

  db.prepare("DELETE FROM sessions WHERE id = ?").run(sessionId);
}

function setSessionCookie(res, sessionId) {
  res.cookie(COOKIE_NAME, sessionId, cookieOptions());
}

function clearSessionCookie(res) {
  res.clearCookie(COOKIE_NAME, cookieOptions());
}

module.exports = {
  COOKIE_NAME,
  cookieOptions,
  createSession,
  findSessionUser,
  destroySession,
  setSessionCookie,
  clearSessionCookie
};
