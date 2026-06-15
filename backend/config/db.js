const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "book_exchange",
  password: "Vanshika@04",
  port: 5432,
});

module.exports = pool;