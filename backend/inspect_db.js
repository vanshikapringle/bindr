const { Pool } = require('pg');
const pool = require('./config/db');

async function checkSchema() {
  try {
    const booksRes = await pool.query('SELECT * FROM books');
    console.log("Books:", booksRes.rows);

    const requestsRes = await pool.query('SELECT * FROM requests');
    console.log("Requests:", requestsRes.rows);

    const usersRes = await pool.query('SELECT * FROM users');
    console.log("Users:", usersRes.rows);

  } catch (err) {
    console.error("DB Error:", err.message);
  } finally {
    pool.end();
  }
}
checkSchema();
