// db-setup.js  (or whatever the file is called)
import mysql from "mysql2/promise";   // <-- promise version
import dotenv from "dotenv";

dotenv.config(); // Works locally and Railway

(async () => {
  let connection;
  try {
    // ---- 1. Create the connection (promise-based) ----
    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: process.env.DB_PORT || 3306,
      ssl: { rejectUnauthorized: false }   // Railway requires SSL
    });

    console.log("Connected to MySQL");

    // ---- 2. Create `books` table ----
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

    await connection.execute(createBooksTable);
    console.log("'books' table created or already exists");

    // ---- 3. Create `borrowed_books` table ----
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

    await connection.execute(createBorrowedBooksTable);
    console.log("'borrowed_books' table created or already exists");

  } catch (err) {
    console.error("MySQL error:", err.message);
  } finally {
    if (connection) await connection.end();
  }
})();