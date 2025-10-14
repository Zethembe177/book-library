import mysql from "mysql2";

// Connect to Railway MySQL
const db = mysql.createConnection({
  host: "mysql.railway.internal",
  user: "root",
  password: "UQSsMKftZRvkVzcxlukFBjWYLirYxEqE",
  database: "railway",
  port: 3306
});

db.connect(err => {
  if (err) throw err;
  console.log("✅ Connected to Railway MySQL");

  // Create 'books' table
  const createBooksTable = `
    CREATE TABLE IF NOT EXISTS books (
      id INT AUTO_INCREMENT PRIMARY KEY,
      title VARCHAR(255),
      author VARCHAR(255),
      category VARCHAR(100),
      is_available TINYINT(1),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  db.query(createBooksTable, (err, result) => {
    if (err) throw err;
    console.log("✅ 'books' table created");

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
      if (err) throw err;
      console.log("✅ 'borrowed_books' table created");
      db.end();
    });
  });
});
