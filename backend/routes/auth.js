const express = require("express");
const router = express.Router();
const pool = require("../config/db");
const bcrypt = require("bcrypt");

// REGISTER
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // check if user already exists
    const existingUser = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json("User already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await pool.query(
      "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *",
      [name, email, hashedPassword]
    );

    res.json(newUser.rows[0]);

  } catch (err) {
    console.error(err.message);
    res.status(500).json("Server error"); // ✅ VERY IMPORTANT
  }
});


const jwt = require("jsonwebtoken");

// LOGIN
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // check user
    const user = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    if (user.rows.length === 0) {
      return res.status(400).json("User not found");
    }

    // check password
    const validPassword = await bcrypt.compare(
      password,
      user.rows[0].password
    );

    if (!validPassword) {
      return res.status(400).json("Invalid password");
    }

    // create token
    const token = jwt.sign(
      { 
        user_id: user.rows[0].user_id, 
        onboarding_completed: user.rows[0].onboarding_completed 
      },
      process.env.JWT_SECRET || "defaultsecret",
      { expiresIn: "1h" }
    );

    res.json({ token });

  } catch (err) {
    console.error(err.message);
    res.status(500).json("Server error");
  }
});

// COMPLETE ONBOARDING
router.post("/complete-onboarding", async (req, res) => {
  try {
    const { token, firstName, lastName, city, state, favouriteGenres, latitude, longitude, books } = req.body;
    
    if (!token) return res.status(401).json("No token provided");
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "defaultsecret");
    const userId = decoded.user_id;

    // Update User Profile
    await pool.query(
      `UPDATE users SET 
        first_name = $1, 
        last_name = $2, 
        city = $3, 
        state = $4, 
        latitude = $5, 
        longitude = $6, 
        favourite_genres = $7, 
        onboarding_completed = true 
      WHERE user_id = $8`,
      [firstName, lastName, city, state, latitude, longitude, favouriteGenres, userId]
    );

    // Insert Books
    for (let book of books) {
      if (book.title) {
        await pool.query(
          "INSERT INTO books (title, author, category, cover_image, owner_id, availability_status) VALUES ($1, $2, $3, $4, $5, 'available')",
          [book.title, book.author, book.category || 'General', book.coverImage || '', userId]
        );
      }
    }

    // Generate fresh token
    const newToken = jwt.sign(
      { user_id: userId, onboarding_completed: true },
      process.env.JWT_SECRET || "defaultsecret",
      { expiresIn: "1h" }
    );

    res.json({ token: newToken, message: "Onboarding complete" });
  } catch (err) {
    console.error(err.message);
    res.status(500).json("Server error during onboarding");
  }
});

// GET PROFILE
router.get("/me", require("../middleware/authMiddleware"), async (req, res) => {
  try {
    const user = await pool.query(
      "SELECT user_id, name, email, location, rating, bio, profile_picture, favourite_genre, onboarding_completed, first_name, last_name, city, state, favourite_genres, successful_exchanges FROM users WHERE user_id = $1",
      [req.user.user_id]
    );
    res.json(user.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json("Server error");
  }
});

// UPDATE PROFILE
router.put("/me", require("../middleware/authMiddleware"), async (req, res) => {
  try {
    const { name, location, bio, favourite_genre, favourite_genres, city, state, first_name, last_name } = req.body;
    const user = await pool.query(
      "UPDATE users SET name = COALESCE($1, name), location = COALESCE($2, location), bio = COALESCE($3, bio), favourite_genre = COALESCE($4, favourite_genre), favourite_genres = COALESCE($5, favourite_genres), city = COALESCE($6, city), state = COALESCE($7, state), first_name = COALESCE($8, first_name), last_name = COALESCE($9, last_name) WHERE user_id = $10 RETURNING *",
      [name, location, bio, favourite_genre, favourite_genres, city, state, first_name, last_name, req.user.user_id]
    );
    res.json(user.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json("Server error");
  }
});

module.exports = router;