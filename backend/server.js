const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");
require('dotenv').config({ path: './db.env' });

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
//Import routes
const booksRoutes = require("./routes/books")(db);
app.use("/books", booksRoutes);

app.listen(5000, () => console.log("🚀 Server running on port 5000"));
