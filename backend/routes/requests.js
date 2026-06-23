const express = require("express");
const router = express.Router();
const pool = require("../config/db");
const authMiddleware = require("../middleware/authMiddleware");

// Request a Book
router.post("/:bookId", authMiddleware, async (req, res) => {
  try {
    const bookId = req.params.bookId;
    const requesterId = req.user.user_id;

    // Check if book exists
    const book = await pool.query(
      "SELECT * FROM books WHERE book_id = $1",
      [bookId]
    );

    if (book.rows.length === 0) {
      return res.status(404).json("Book not found");
    }
    if (book.rows[0].availability_status !== "available") {
      return res.status(400).json("Book is not available");
    }

    // Prevent requesting own book
    if (book.rows[0].owner_id === requesterId) {
      return res.status(400).json("You cannot request your own book");
    }

    // Prevent duplicate requests
    const existingRequest = await pool.query(
      `
      SELECT *
      FROM requests
      WHERE book_id = $1
      AND requester_id = $2
      `,
      [bookId, requesterId]
    );

    if (existingRequest.rows.length > 0) {
      return res.status(400).json("Request already sent");
    }

    const request = await pool.query(
      `
      INSERT INTO requests
      (book_id, requester_id)
      VALUES ($1, $2)
      RETURNING *
      `,
      [bookId, requesterId]
    );

    res.json(request.rows[0]);

  } catch (err) {
    console.error(err.message);
    res.status(500).json("Server Error");
  }
});

// Get My Incoming Requests
router.get("/incoming", authMiddleware, async (req, res) => {
  try {
    const ownerId = req.user.user_id;

    const requests = await pool.query(
      `
      SELECT
        requests.request_id,
        requests.status,
        books.title,
        books.author,
        books.cover_image,
        books.owner_id,
        requests.requester_id,
        requests.borrow_date,
        requests.return_date,
        users.first_name AS requester_name
      FROM requests
      JOIN books
      ON requests.book_id = books.book_id
      LEFT JOIN users
      ON requests.requester_id = users.user_id
      WHERE books.owner_id = $1
      `,
      [ownerId]
    );

    res.json(requests.rows);

  } catch (err) {
    console.error(err.message);
    res.status(500).json("Server Error");
  }
});

// Accept Request
router.put("/accept/:requestId", authMiddleware, async (req, res) => {
  try {
    const requestId = req.params.requestId;
    const currentUser = req.user.user_id;

    const requestCheck = await pool.query(
      `
      SELECT requests.*, books.owner_id
      FROM requests
      JOIN books
      ON requests.book_id = books.book_id
      WHERE requests.request_id = $1
      `,
      [requestId]
    );

    if (requestCheck.rows.length === 0) {
      return res.status(404).json("Request not found");
    }

    if (requestCheck.rows[0].owner_id !== currentUser) {
      return res.status(403).json("Only book owner can accept requests");
    }

    if (requestCheck.rows[0].status === "accepted") {
      return res.status(400).json("Request already accepted");
    }

    const request = await pool.query(
      `
      UPDATE requests
      SET status = 'accepted'
      WHERE request_id = $1
      RETURNING *
      `,
      [requestId]
    );

    // Reject all competing requests for the same book
    await pool.query(
      `
      UPDATE requests
      SET status = 'rejected'
      WHERE book_id = $1
      AND request_id != $2
      `,
      [request.rows[0].book_id, requestId]
    );

    // Make book unavailable
    await pool.query(
      "UPDATE books SET availability_status = 'unavailable' WHERE book_id = $1",
      [request.rows[0].book_id]
    );

    res.json(request.rows[0]);

  } catch (err) {
    console.error(err.message);
    res.status(500).json("Server Error");
  }
});

// Reject Request
router.put("/reject/:requestId", authMiddleware, async (req, res) => {
  try {
    const requestId = req.params.requestId;
    const currentUser = req.user.user_id;

    const requestCheck = await pool.query(
      `
      SELECT requests.*, books.owner_id
      FROM requests
      JOIN books
      ON requests.book_id = books.book_id
      WHERE requests.request_id = $1
      `,
      [requestId]
    );

    if (requestCheck.rows.length === 0) {
      return res.status(404).json("Request not found");
    }

    if (requestCheck.rows[0].owner_id !== currentUser) {
      return res.status(403).json("Only book owner can reject requests");
    }

    if (requestCheck.rows[0].status === "rejected") {
      return res.status(400).json("Request already rejected");
    }

    const request = await pool.query(
      `
      UPDATE requests
      SET status = 'rejected'
      WHERE request_id = $1
      RETURNING *
      `,
      [requestId]
    );

    res.json(request.rows[0]);

  } catch (err) {
    console.error(err.message);
    res.status(500).json("Server Error");
  }
});

// Get My Outgoing Requests
router.get("/outgoing", authMiddleware, async (req, res) => {
  try {

    const requesterId = req.user.user_id;

    const requests = await pool.query(
      `
      SELECT
        requests.request_id,
        requests.status,
        books.title,
        books.author,
        books.cover_image,
        books.owner_id,
        requests.requester_id,
        requests.borrow_date,
        requests.return_date
      FROM requests
      JOIN books
      ON requests.book_id = books.book_id
      WHERE requests.requester_id = $1
      `,
      [requesterId]
    );

    res.json(requests.rows);

  } catch (err) {
    console.error(err.message);
    res.status(500).json("Server Error");
  }
});

// Update Request Status
router.put("/status/:requestId", authMiddleware, async (req, res) => {
  try {
    const requestId = req.params.requestId;
    const { status } = req.body;
    const currentUser = req.user.user_id;

    // Allowed statuses
    const allowedStatuses = ["requested", "approved", "picked_up", "currently_reading", "returned", "exchange_completed"];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json("Invalid status");
    }

    const requestCheck = await pool.query(
      `
      SELECT requests.*, books.owner_id
      FROM requests
      JOIN books
      ON requests.book_id = books.book_id
      WHERE requests.request_id = $1
      `,
      [requestId]
    );

    if (requestCheck.rows.length === 0) {
      return res.status(404).json("Request not found");
    }

    // Ensure only owner or requester can update
    if (requestCheck.rows[0].owner_id !== currentUser && requestCheck.rows[0].requester_id !== currentUser) {
      return res.status(403).json("Not authorized");
    }

    // If setting to 'exchange_completed', perform side effects
    if (status === "exchange_completed" && requestCheck.rows[0].status !== "exchange_completed") {
      const bookId = requestCheck.rows[0].book_id;
      const ownerId = requestCheck.rows[0].owner_id;
      const requesterId = requestCheck.rows[0].requester_id;

      // Make book available again
      await pool.query(
        "UPDATE books SET availability_status = 'available' WHERE book_id = $1",
        [bookId]
      );

      // Increment successful_exchanges for owner
      await pool.query(
        "UPDATE users SET successful_exchanges = COALESCE(successful_exchanges, 0) + 1 WHERE user_id = $1",
        [ownerId]
      );

      // Add to reading history for requester
      await pool.query(
        "INSERT INTO reading_history (user_id, book_id, completed_at) VALUES ($1, $2, NOW())",
        [requesterId, bookId]
      );
    }

    const request = await pool.query(
      `
      UPDATE requests
      SET status = $1
      WHERE request_id = $2
      RETURNING *
      `,
      [status, requestId]
    );

    res.json(request.rows[0]);

  } catch (err) {
    console.error(err.message);
    res.status(500).json("Server Error");
  }
});

module.exports = router;