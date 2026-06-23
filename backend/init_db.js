const dbPromise = require("./config/db");

async function init() {
  const db = await dbPromise;

  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      user_id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS books (
      book_id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      author TEXT NOT NULL,
      isbn TEXT,
      category TEXT,
      owner_id INTEGER,
      available BOOLEAN DEFAULT 1,
      FOREIGN KEY(owner_id) REFERENCES users(user_id)
    );

    CREATE TABLE IF NOT EXISTS requests (
      request_id INTEGER PRIMARY KEY AUTOINCREMENT,
      book_id INTEGER,
      requester_id INTEGER,
      status TEXT DEFAULT 'pending',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(book_id) REFERENCES books(book_id),
      FOREIGN KEY(requester_id) REFERENCES users(user_id)
    );
  `);

  console.log("Database initialized successfully!");
}

init().catch(console.error);
