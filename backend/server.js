const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");
require('dotenv').config({ path: './db.env' });
const PORT = process.env.PORT || 5000;

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
  port: process.env.DB_PORT || 3306
});


db.connect(err => {
  if (err) throw err;
  console.log("✅ MySQL Connected...");
});
// Test route to check if backend is alive
app.get('/test', (req, res) => {
  res.json({ status: "Backend is working!", time: new Date() });
});


//Import routes
const booksRoutes = require("./routes/books")(db);
app.use("/api/books", booksRoutes);

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
