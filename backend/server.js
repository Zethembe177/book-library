import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import createBooksRoutes from "./routes/books.js";
import connectDb from "./db.js"; // ✅ correct for ES modules



dotenv.config();

const PORT = process.env.PORT || 3000;
const app = express();

app.use(
  cors({
    origin: ["http://localhost:5173", "https://book-library-zet.netlify.app"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(express.json());

console.log("🔄 Starting backend server...");

// --- Async startup: connect to DB before starting server ---
(async () => {
  try {
    const db = await connectDb; // await the MySQL connection from db.js
    app.locals.db = db; // make the connection available in routes

    console.log(
      `✅ MySQL connected to database "${process.env.DB_NAME}" at ${process.env.DB_HOST}:${process.env.DB_PORT}`
    );

    // Optional: check tables
    try {
      const [results] = await db.query("SHOW TABLES");
      console.log("✅ Tables in DB:", results.map((r) => Object.values(r)[0]));
    } catch (err) {
      console.warn("⚠️ SHOW TABLES query failed:", err.message);
    }

    // --- Simple test endpoints ---
    app.get("/test", (req, res) => {
      console.log("📢 /test endpoint was hit");
      res.json({ status: "Backend is working!", time: new Date() });
    });

    app.get("/test-db", async (req, res) => {
      try {
        const [results] = await db.query("SELECT 1 + 1 AS result");
        console.log("✅ Database test query succeeded:", results[0].result);
        res.json({ status: "success", result: results[0].result });
      } catch (err) {
        console.error("❌ Database test query failed:", err.message);
        res.status(500).json({ status: "error", message: err.message });
      }
    });

    // --- Books routes ---
    console.log("📦 Loading books routes...");
    app.use("/api/books", async (req, res, next) => {
      try {
        await createBooksRoutes(db)(req, res, next);
      } catch (err) {
        console.error("🚨 Endpoint error:", err);
        res.status(500).json({ error: err.message });
      }
    });

    // --- Start server ---
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("❌ Startup failed:", err);
    process.exit(1);
  }
})();
