// routes/books.js
import express from "express";

export default function createBooksRoutes(db) {
  const router = express.Router();

  // 1️⃣ Get all books
  router.get("/", async (req, res) => {
    console.log("GET request to /api/books");
    try {
      const [results] = await db.execute("SELECT * FROM books");
      res.json(results);
    } catch (err) {
      console.error("Error fetching books:", err.message);
      return res.status(500).json({ error: err.message });
    }
  });

  // 2️⃣ Add a new book
  router.post("/", async (req, res) => {
    console.log("POST request to /api/books");
    const { title, author, category } = req.body;
    try {
      const [results] = await db.execute(
        "INSERT INTO books (title, author, category) VALUES (?, ?, ?)",
        [title, author, category]
      );
      res.json({ message: "Book added", bookId: results.insertId });
    } catch (err) {
      console.error("Error adding book:", err.message);
      return res.status(500).json({ error: err.message });
    }
  });

  // 3️⃣ Borrow a book
  router.post("/borrow/:id", async (req, res) => {
    console.log(`POST request to /api/books/borrow/${req.params.id}`);
    const bookId = req.params.id;
    const { borrower_name, borrowed_date } = req.body;

    try {
      await db.execute(
        "INSERT INTO borrowed_books (book_id, borrower_name, borrowed_date) VALUES (?, ?, ?)",
        [bookId, borrower_name, borrowed_date]
      );

      await db.execute(
        "UPDATE books SET is_available = false WHERE id = ?",
        [bookId]
      );

      res.json({ message: "Book borrowed" });
    } catch (err) {
      console.error("Error borrowing book:", err.message);
      return res.status(500).json({ error: err.message });
    }
  });

  // 4️⃣ Return a book
  router.post("/return/:id", async (req, res) => {
    console.log(`POST request to /api/books/return/${req.params.id}`);
    const bookId = req.params.id;
    const { returned_date } = req.body;

    try {
      await db.execute(
        "UPDATE borrowed_books SET returned_date = ? WHERE book_id = ? AND returned_date IS NULL",
        [returned_date, bookId]
      );

      await db.execute(
        "UPDATE books SET is_available = true WHERE id = ?",
        [bookId]
      );

      res.json({ message: "Book returned" });
    } catch (err) {
      console.error("Error returning book:", err.message);
      return res.status(500).json({ error: err.message });
    }
  });
  // GET /api/books/search?title=someTitle
router.get("/search", async (req, res) => {
  const { title } = req.query; // get the title query parameter

  if (!title || !title.trim()) {
    return res.status(400).json({ error: "Title query is required" });
  }

  try {
    const [results] = await db.execute(
      "SELECT id, title, author FROM books WHERE title LIKE ?",
      [`%${title}%`] // partial match
    );

    res.json(results);
  } catch (err) {
    console.error("Error searching books:", err.message);
    return res.status(500).json({ error: err.message });
  }
});


  return router;
}