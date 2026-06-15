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

module.exports = router;

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
      { user_id: user.rows[0].user_id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ token });

  } catch (err) {
    console.error(err.message);
    res.status(500).json("Server error");
  }
});