const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");

const app = express();
app.use(cors());
app.use(express.json());
console.log("🔄 Starting backend server...");

// Database connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "zamabuhle",  // your MySQL password
  database: "Book_Library"
});

db.connect(err => {
  if (err) throw err;
  console.log("✅ MySQL Connected...");
});
//Import routes
const booksRoutes = require("./routes/books")(db);
app.use("/books", booksRoutes);

app.listen(5000, () => console.log("🚀 Server running on port 5000"));
