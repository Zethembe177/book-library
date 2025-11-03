import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import createBooksRoutes from "./routes/books.js";
import mysql from "mysql2/promise"; // ✅ promise-based client
dotenv.config();

const PORT = process.env.PORT || 3000;
const app = express();

// --- Middleware ---
app.use(
  cors({
    origin: ["http://localhost:5173", "https://book-library-zet.netlify.app"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(express.json());

console.log("🔄 Starting backend server...");

// --- Async DB connection ---
async function initDb() {
  try {
    const db = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: Number(process.env.DB_PORT),
      ssl: { rejectUnauthorized: false }, // optional if using Railway
      connectTimeout: 15000,
    });

    console.log(
      `✅ MySQL Connected to database "${process.env.DB_NAME}" at ${process.env.DB_HOST}:${process.env.DB_PORT}`
    );

    // Optional: test tables
    try {
      const [tables] = await db.query("SHOW TABLES");
      console.log("✅ Tables in DB:", tables.map((t) => Object.values(t)[0]));
    } catch (err) {
      console.warn("⚠️ SHOW TABLES query failed:", err.message);
    }

    return db;
  } catch (err) {
    console.error("❌ MySQL connection failed:", err.message);
    process.exit(1); // stop server if DB fails
  }
}

// --- Start server after DB connection ---
(async () => {
  const db = await initDb();
  app.locals.db = db; // make DB available in routes

  // --- Test endpoints ---
  app.get("/test", (req, res) => {
    console.log("📢 /test endpoint was hit");
    res.json({ status: "Backend is working!", time: new Date() });
  });

  app.get("/test-db", async (req, res) => {
    try {
      const [result] = await db.query("SELECT 1 + 1 AS result");
      console.log("✅ Database test query succeeded:", result[0].result);
      res.json({ status: "success", result: result[0].result });
    } catch (err) {
      console.error("❌ Database test query failed:", err.message);
      res.status(500).json({ status: "error", message: err.message });
    }
  });

  // --- Books routes ---
  console.log("📦 Loading books routes...");
  app.use("/api/books", (req, res, next) => {
    console.log(`📌 ${req.method} request to ${req.originalUrl}`);
    next();
  }, createBooksRoutes(db));

  // --- Start server ---
  app.listen(PORT, "0.0.0.0", () =>
    console.log(`🚀 Server running on port ${PORT}`)
  );
})();
