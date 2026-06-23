const { Pool } = require('pg');
const pool = new Pool({ user: 'postgres', host: 'localhost', database: 'book_exchange', password: 'Vanshika@04', port: 5432 });
async function migrate() {
  try {
    await pool.query('ALTER TABLE users ADD COLUMN IF NOT EXISTS location VARCHAR(255)');
    await pool.query('ALTER TABLE users ADD COLUMN IF NOT EXISTS bio TEXT');
    await pool.query('ALTER TABLE users ADD COLUMN IF NOT EXISTS favourite_genre VARCHAR(100)');
    await pool.query('ALTER TABLE users ADD COLUMN IF NOT EXISTS rating NUMERIC DEFAULT 5.0');
    await pool.query('ALTER TABLE users ADD COLUMN IF NOT EXISTS profile_picture VARCHAR(255)');
    console.log('done');
  } catch(e) {
    console.error(e);
  } finally {
    pool.end();
  }
}
migrate();
