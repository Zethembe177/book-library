import mysql from "mysql2";
import dotenv from "dotenv";

// Load env variables from db.env
dotenv.config({ path: "./db.env" });

// Create a MySQL connection using env variables
const db = mysql.createConnection({
  host: process.env.DB_HOST,       // Railway internal hostname
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT        // Railway internal port
});

// Connect safely
db.connect(err => {
  if (err) {
    console.error("❌ MySQL connection failed:", err.message);
    process.exit(1); // Stop the script, don’t crash a server
  }
  console.log("✅ Connected to Railway MySQL");

  // Create 'books' table
  const createBooksTable = `
    CREATE TABLE IF NOT EXISTS books (
      id INT AUTO_INCREMENT PRIMARY KEY,
      title VARCHAR(255),
      author VARCHAR(255),
      category VARCHAR(100),
      is_available TINYINT(1) DEFAULT 1,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  db.query(createBooksTable, (err, result) => {
    if (err) {
      console.error("❌ Failed to create 'books' table:", err.message);
      db.end();
      return;
    }
    console.log("✅ 'books' table created or already exists");

    // Create 'borrowed_books' table
    const createBorrowedBooksTable = `
      CREATE TABLE IF NOT EXISTS borrowed_books (
        id INT AUTO_INCREMENT PRIMARY KEY,
        book_id INT,
        borrower_name VARCHAR(255),
        borrowed_date DATE,
        returned_date DATE,
        FOREIGN KEY (book_id) REFERENCES books(id)
      );
    `;

    db.query(createBorrowedBooksTable, (err, result) => {
      if (err) {
        console.error("❌ Failed to create 'borrowed_books' table:", err.message);
      } else {
        console.log("✅ 'borrowed_books' table created or already exists");
      }
      db.end(); // Close connection after finishing
    });
  });
});
