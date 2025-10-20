require('dotenv').config(); // works locally and on Railway
const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");

const PORT = process.env.PORT || 3000;
const app = express();
app.use(cors());
app.use(express.json());
console.log("🔄 Starting backend server...");

const db = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'mydatabase',
  port: process.env.DB_PORT || 3306
});

db.connect(err => {
  if (err) console.error("❌ MySQL connection failed:", err.message);
  else console.log("✅ MySQL Connected...");
});

app.get('/test', (req, res) => {
  res.json({ status: "Backend is working!", time: new Date() });
});

const booksRoutes = require("./routes/books")(db);
app.use("/api/books", booksRoutes);

app.listen(PORT, "0.0.0.0", () => console.log(`🚀 Server running on port ${PORT}`));
outes
const booksRoutes = require("./routes/books")(db);
app.use("/api/books", booksRoutes);
app.listen(PORT, "0.0.0.0", () => console.log(`🚀 Server running on port ${PORT}`));
