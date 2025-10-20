
import express from "express";
import cors from "cors";
import mysql from "mysql2";
import dotenv from "dotenv";
import createBooksRoutes from "./routes/books.js";

dotenv.config();

const PORT = process.env.PORT || 3000;


const app = express();
app.use(cors());
app.use(express.json());

console.log("🔄 Starting backend server...");

const db = mysql.createConnection({

  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT
});

db.connect(err => {
  if (err) {
    console.error("❌ MySQL connection failed:", err.message);
  } else {
    console.log(`✅ MySQL Connected to database "${process.env.DB_NAME}" at ${process.env.DB_HOST}:${process.env.DB_PORT}`);
  }

});

app.get('/test', (req, res) => {
  console.log("📢 /test endpoint was hit");
  res.json({ status: "Backend is working!", time: new Date() });
});


// Import and use routes
console.log("📦 Loading books routes...");
app.use("/api/books", (req, res, next) => {
  console.log(`📌 ${req.method} request to ${req.originalUrl}`);
  next();
}, createBooksRoutes(db));


app.listen(PORT, "0.0.0.0", () => console.log(`🚀 Server running on port ${PORT}`));
