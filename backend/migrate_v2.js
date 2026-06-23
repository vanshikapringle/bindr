const { Pool } = require('pg');
const pool = new Pool({ 
  user: 'postgres', 
  host: 'localhost', 
  database: 'book_exchange', 
  password: 'Vanshika@04', 
  port: 5432 
});

async function migrate() {
  try {
    // User location and details
    await pool.query('ALTER TABLE users ADD COLUMN IF NOT EXISTS first_name VARCHAR(255)');
    await pool.query('ALTER TABLE users ADD COLUMN IF NOT EXISTS last_name VARCHAR(255)');
    await pool.query('ALTER TABLE users ADD COLUMN IF NOT EXISTS city VARCHAR(255)');
    await pool.query('ALTER TABLE users ADD COLUMN IF NOT EXISTS state VARCHAR(255)');
    await pool.query('ALTER TABLE users ADD COLUMN IF NOT EXISTS latitude NUMERIC');
    await pool.query('ALTER TABLE users ADD COLUMN IF NOT EXISTS longitude NUMERIC');
    
    // Genres and stats
    await pool.query('ALTER TABLE users ADD COLUMN IF NOT EXISTS successful_exchanges INTEGER DEFAULT 0');
    // favourite_genres can be text to store JSON array or comma separated string
    await pool.query('ALTER TABLE users ADD COLUMN IF NOT EXISTS favourite_genres TEXT');
    
    // Requests table updates
    await pool.query('ALTER TABLE requests ADD COLUMN IF NOT EXISTS borrow_date TIMESTAMP');
    await pool.query('ALTER TABLE requests ADD COLUMN IF NOT EXISTS return_date TIMESTAMP');
    
    console.log('Migration v2 done!');
  } catch(e) {
    console.error('Migration error:', e);
  } finally {
    pool.end();
  }
}

migrate();
