const express = require("express");

module.exports = (db) => {
  const router = express.Router();

  // 1️⃣ Get all books
  router.get("/", (req, res) => {
    db.query("SELECT * FROM books", (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(results);
    });
  });

  // 2️⃣ Add a new book
  router.post("/", (req, res) => {
    const { title, author, category } = req.body;
    db.query(
      "INSERT INTO books (title, author, category) VALUES (?, ?, ?)",
      [title, author, category],
      (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Book added", bookId: results.insertId });
      }
    );
  });

  // 3️⃣ Borrow a book
  router.post("/borrow/:id", (req, res) => {
    const bookId = req.params.id;
    const { borrower_name, borrowed_date } = req.body;

    db.query(
      "INSERT INTO borrowed_books (book_id, borrower_name, borrowed_date) VALUES (?, ?, ?)",
      [bookId, borrower_name, borrowed_date],
      (err, results) => {
        if (err) return res.status(500).json({ error: err.message });

        db.query(
          "UPDATE books SET is_available = false WHERE id = ?",
          [bookId],
          (err2) => {
            if (err2) return res.status(500).json({ error: err2.message });
            res.json({ message: "Book borrowed" });
          }
        );
      }
    );
  });

  // 4️⃣ Return a book
  router.post("/return/:id", (req, res) => {
    const bookId = req.params.id;
    const { returned_date } = req.body;

    db.query(
      "UPDATE borrowed_books SET returned_date = ? WHERE book_id = ? AND returned_date IS NULL",
      [returned_date, bookId],
      (err) => {
        if (err) return res.status(500).json({ error: err.message });

        db.query(
          "UPDATE books SET is_available = true WHERE id = ?",
          [bookId],
          (err2) => {
            if (err2) return res.status(500).json({ error: err2.message });
            res.json({ message: "Book returned" });
          }
        );
      }
    );
  });

  return router;
};
