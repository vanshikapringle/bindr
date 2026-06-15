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