const { COOKIE_NAME, findSessionUser } = require("./sessions");

function attachCurrentUser(req, _res, next) {
  req.currentUser = findSessionUser(req.cookies?.[COOKIE_NAME]);
  next();
}

function requireAuth(req, res, next) {
  if (!req.currentUser) {
    return res.status(401).json({ message: "Please log in to continue." });
  }

  return next();
}

function requireRole(role) {
  return function roleGuard(req, res, next) {
    if (!req.currentUser) {
      return res.status(401).json({ message: "Please log in to continue." });
    }

    if (req.currentUser.role !== role) {
      return res.status(403).json({ message: "You do not have access to this action." });
    }

    return next();
  };
}

module.exports = {
  attachCurrentUser,
  requireAuth,
  requireRole
};
