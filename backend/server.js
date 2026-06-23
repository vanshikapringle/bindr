require("dotenv").config();
const authMiddleware = require("./middleware/authMiddleware");

console.log("SERVER FILE UPDATED");

const express = require("express");
const cors = require("cors");

const app = express();

// middleware
app.use(cors());
app.use(express.json());

const authRoutes = require("./routes/auth");
const dashboardRoutes = require("./routes/dashboard");
const bookRoutes = require("./routes/books");
const requestRoutes = require("./routes/requests");

app.use("/auth", authRoutes);
app.use("/dashboard", dashboardRoutes);
app.use("/books", bookRoutes);
app.use("/requests", requestRoutes);

// test route
app.get("/", (req, res) => {
  res.send("API is running");
});

app.get("/public-dashboard-data", authMiddleware, async (req, res) => {
  try {
    const pool = require("./config/db");
    const books = await pool.query(
      "SELECT * FROM books WHERE owner_id != $1 AND availability_status = 'available' ORDER BY book_id DESC",
      [req.user.user_id]
    );
    const requests = await pool.query(`
      SELECT 
        r.request_id, 
        r.status, 
        b.title as requested_book, 
        r.request_date as date, 
        u.name as user 
      FROM requests r
      JOIN books b ON r.book_id = b.book_id
      JOIN users u ON r.requester_id = u.user_id
      ORDER BY r.request_date DESC
    `);
    res.json({ books: books.rows, requests: requests.rows });
  } catch (err) {
    res.status(500).json("Server error");
  }
});

app.put("/public-accept/:id", async (req, res) => {
  try {
    const pool = require("./config/db");
    await pool.query("UPDATE requests SET status = 'accepted' WHERE request_id = $1", [req.params.id]);
    res.json({ success: true });
  } catch (err) { res.status(500).json("Error"); }
});

app.put("/public-reject/:id", async (req, res) => {
  try {
    const pool = require("./config/db");
    await pool.query("UPDATE requests SET status = 'rejected' WHERE request_id = $1", [req.params.id]);
    res.json({ success: true });
  } catch (err) { res.status(500).json("Error"); }
});

// Favorites & Library Endpoints (Authenticated)
app.get("/wishlist", authMiddleware, async (req, res) => {
  try {
    const pool = require("./config/db");
    const result = await pool.query(
      "SELECT b.* FROM wishlist w JOIN books b ON w.book_id = b.book_id WHERE w.user_id = $1 ORDER BY w.added_at DESC", 
      [req.user.user_id]
    );
    res.json(result.rows);
  } catch (err) { res.status(500).json("Server Error"); }
});

app.post("/wishlist", authMiddleware, async (req, res) => {
  try {
    const pool = require("./config/db");
    const { book_id } = req.body;
    await pool.query("INSERT INTO wishlist (user_id, book_id) VALUES ($1, $2)", [req.user.user_id, book_id]);
    res.json({ success: true });
  } catch (err) { res.status(500).json("Server Error"); }
});

app.delete("/wishlist/:bookId", authMiddleware, async (req, res) => {
  try {
    const pool = require("./config/db");
    const bookId = req.params.bookId;
    await pool.query("DELETE FROM wishlist WHERE user_id = $1 AND book_id = $2", [req.user.user_id, bookId]);
    res.json({ success: true });
  } catch (err) { res.status(500).json("Server Error"); }
});

app.get("/saved-books", authMiddleware, async (req, res) => {
  try {
    const pool = require("./config/db");
    const result = await pool.query(
      "SELECT b.* FROM saved_books s JOIN books b ON s.book_id = b.book_id WHERE s.user_id = $1 ORDER BY s.saved_at DESC", 
      [req.user.user_id]
    );
    res.json(result.rows);
  } catch (err) { res.status(500).json("Server Error"); }
});

app.post("/saved-books", authMiddleware, async (req, res) => {
  try {
    const pool = require("./config/db");
    const { book_id } = req.body;
    await pool.query("INSERT INTO saved_books (user_id, book_id) VALUES ($1, $2)", [req.user.user_id, book_id]);
    res.json({ success: true });
  } catch (err) { res.status(500).json("Server Error"); }
});

app.get("/reading-history", authMiddleware, async (req, res) => {
  try {
    const pool = require("./config/db");
    const result = await pool.query(
      "SELECT b.* FROM reading_history h JOIN books b ON h.book_id = b.book_id WHERE h.user_id = $1 ORDER BY h.completed_at DESC", 
      [req.user.user_id]
    );
    res.json(result.rows);
  } catch (err) { res.status(500).json("Server Error"); }
});

app.post("/reading-history", authMiddleware, async (req, res) => {
  try {
    const pool = require("./config/db");
    const { book_id } = req.body;
    await pool.query("INSERT INTO reading_history (user_id, book_id) VALUES ($1, $2)", [req.user.user_id, book_id]);
    res.json({ success: true });
  } catch (err) { res.status(500).json("Server Error"); }
});

// start server
app.listen(5000, () => {
  console.log("Server running on port 5000");
});

app.get("/dashboard", authMiddleware, (req, res) => {
  res.json({
    message: "Welcome to dashboard",
    user: req.user
  });
});