require('dotenv').config({ path: './db.env' });
const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");

const PORT = process.env.PORT

const app = express();
app.use(cors());
app.use(express.json());
console.log("🔄 Starting backend server...");

// Database connection
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
    console.log("✅ MySQL Connected...");
  }
});

// Test route to check if backend is alive
app.get('/test', (req, res) => {
  res.json({ status: "Backend is working!", time: new Date() });
});


//Import routes
const booksRoutes = require("./routes/books")(db);
app.use("/api/books", booksRoutes);
app.listen(PORT, "0.0.0.0", () => console.log(`🚀 Server running on port ${PORT}`));
