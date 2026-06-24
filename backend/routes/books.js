const express = require("express");
const router = express.Router();
const pool = require("../config/db");
const authMiddleware = require("../middleware/authMiddleware");

// Add Book
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { title, author, isbn, category, cover_image, availability_status } = req.body;

    const owner_id = req.user.user_id;

    const newBook = await pool.query(
      `INSERT INTO books
      (title, author, isbn, category, owner_id, cover_image, availability_status)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *`,
      [title, author, isbn, category, owner_id, cover_image || '', availability_status || 'available']
    );

    res.json(newBook.rows[0]);

  } catch (err) {
    console.error(err.message);
    res.status(500).json("Server Error");
  }
});

// Get My Books
router.get("/my-books", authMiddleware, async (req, res) => {
  try {
    const owner_id = req.user.user_id;

    const books = await pool.query(
      "SELECT * FROM books WHERE owner_id = $1 ORDER BY book_id DESC",
      [owner_id]
    );

    res.json(books.rows);

  } catch (err) {
    console.error(err.message);
    res.status(500).json("Server Error");
  }
});

// Get All Books
router.get("/", async (req, res) => {
  try {
    const books = await pool.query(
      "SELECT * FROM books ORDER BY book_id DESC"
    );

    res.json(books.rows);

  } catch (err) {
    console.error(err.message);
    res.status(500).json("Server Error");
  }
});
// Delete Book
router.delete("/:id", authMiddleware, async (req, res) => {
  try {

    const bookId = req.params.id;
    const currentUser = req.user.user_id;

    const book = await pool.query(
      "SELECT * FROM books WHERE book_id = $1",
      [bookId]
    );

    if (book.rows.length === 0) {
      return res.status(404).json("Book not found");
    }

    if (book.rows[0].owner_id !== currentUser) {
      return res.status(403).json("You can only delete your own books");
    }

   // Delete all requests for this book
await pool.query(
  "DELETE FROM requests WHERE book_id = $1",
  [bookId]
);

// Delete the book
await pool.query(
  "DELETE FROM books WHERE book_id = $1",
  [bookId]
);

    res.json("Book deleted successfully");

  } catch (err) {
    console.error(err.message);
    res.status(500).json("Server Error");
  }
});

// Update Book
router.put("/:id", authMiddleware, async (req, res) => {
  try {

    const bookId = req.params.id;
    const currentUser = req.user.user_id;

    const { title, author, isbn, category, cover_image, availability_status } = req.body;

    const book = await pool.query(
      "SELECT * FROM books WHERE book_id = $1",
      [bookId]
    );

    if (book.rows.length === 0) {
      return res.status(404).json("Book not found");
    }

    if (book.rows[0].owner_id !== currentUser) {
      return res.status(403).json("You can only update your own books");
    }

    const updatedBook = await pool.query(
      `
      UPDATE books
      SET title = COALESCE($1, title),
          author = COALESCE($2, author),
          isbn = COALESCE($3, isbn),
          category = COALESCE($4, category),
          cover_image = COALESCE($5, cover_image),
          availability_status = COALESCE($6, availability_status)
      WHERE book_id = $7
      RETURNING *
      `,
      [title, author, isbn, category, cover_image, availability_status, bookId]
    );

    res.json(updatedBook.rows[0]);

  } catch (err) {
    console.error(err.message);
    res.status(500).json("Server Error");
  }
});

// Search Books
router.get("/search", async (req, res) => {
  try {

    const { title } = req.query;

    const books = await pool.query(
      `
      SELECT *
      FROM books
      WHERE LOWER(title) LIKE LOWER($1)
      `,
      [`%${title}%`]
    );

    res.json(books.rows);

  } catch (err) {
    console.error(err.message);
    res.status(500).json("Server Error");
  }
});

module.exports = router;