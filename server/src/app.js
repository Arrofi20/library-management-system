const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const { initializeSchema, openDatabase } = require("./db");
const { attachCurrentUser } = require("./auth/guards");
const authRoutes = require("./routes/auth");
const booksRoutes = require("./routes/books");

function createApp() {
  initializeSchema();

  const app = express();
  app.use(
    cors({
      origin: process.env.CLIENT_ORIGIN || "http://localhost:5173",
      credentials: true
    })
  );
  app.use(express.json());
  app.use(cookieParser());
  app.use(attachCurrentUser);

  app.get("/api/health", (_req, res) => {
    const db = openDatabase();
    const result = db.prepare("SELECT 1 AS available").get();
    res.json({
      ok: true,
      database: result?.available === 1 ? "available" : "unavailable"
    });
  });

  app.use("/api/auth", authRoutes);
  app.use("/api/books", booksRoutes);

  return app;
}

module.exports = {
  createApp
};
