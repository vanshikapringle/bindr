const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database.sqlite');

db.serialize(() => {
  db.run("INSERT OR IGNORE INTO users (user_id, name, email, password) VALUES (1, 'Elena', 'elena@test.com', 'pass')");
  db.run("INSERT INTO books (title, author, category, owner_id) VALUES ('The Secret History', 'Donna Tartt', 'Fiction', 1)");
  db.run("INSERT INTO books (title, author, category, owner_id) VALUES ('Dune', 'Frank Herbert', 'Sci-Fi', 1)");
  db.run("INSERT INTO books (title, author, category, owner_id) VALUES ('Sapiens', 'Yuval Noah Harari', 'History', 1)");
});

console.log("Dummy data inserted.");
