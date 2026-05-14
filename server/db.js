const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bcrypt = require('bcryptjs');

const db = new sqlite3.Database(path.join(__dirname, 'database.sqlite'), (err) => {
  if (err) {
    console.error('Error connecting to database:', err.message);
  } else {
    console.log('Connected to the SQLite database.');
  }
});

db.serialize(() => {
  // Users table
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    password TEXT,
    name TEXT,
    bio TEXT,
    location TEXT,
    avatar TEXT,
    tags TEXT,
    email TEXT,
    phone TEXT,
    theme TEXT DEFAULT 'cyan',
    bg_type TEXT DEFAULT 'animation',
    bg_value TEXT DEFAULT 'neural'
  )`);

  // Links table
  db.run(`CREATE TABLE IF NOT EXISTS links (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    platform TEXT,
    url TEXT,
    FOREIGN KEY(user_id) REFERENCES users(id)
  )`);

  // Profile views table
  db.run(`CREATE TABLE IF NOT EXISTS profile_views (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    viewed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    viewer_ip TEXT,
    viewer_user_agent TEXT,
    FOREIGN KEY(user_id) REFERENCES users(id)
  )`);

  // Link click tracking table
  db.run(`CREATE TABLE IF NOT EXISTS link_clicks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    platform TEXT NOT NULL,
    url TEXT NOT NULL,
    source TEXT DEFAULT 'public_profile',
    clicked_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id)
  )`);

  // Password reset tokens table
  db.run(`CREATE TABLE IF NOT EXISTS password_resets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    token TEXT NOT NULL UNIQUE,
    expires_at DATETIME NOT NULL,
    used INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id)
  )`);

  // Integrations table
  db.run(`CREATE TABLE IF NOT EXISTS integrations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    platform TEXT NOT NULL,
    connected INTEGER DEFAULT 0,
    api_key TEXT,
    webhook_url TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id)
  )`);

  // Backward-compatible migration for old databases.
  db.run(`ALTER TABLE link_clicks ADD COLUMN source TEXT DEFAULT 'public_profile'`, (err) => {
    if (err && !String(err.message || '').includes('duplicate column name')) {
      console.error('Failed to add source column to link_clicks:', err.message);
    }
  });

  db.run(`ALTER TABLE users ADD COLUMN theme TEXT DEFAULT 'cyan'`, (err) => {
    if (err && !String(err.message || '').includes('duplicate column name')) {
      console.error('Failed to add theme column to users:', err.message);
    }
  });

  db.run(`ALTER TABLE users ADD COLUMN bg_type TEXT DEFAULT 'animation'`, (err) => {
    if (err && !String(err.message || '').includes('duplicate column name')) {
      console.error('Failed to add bg_type column to users:', err.message);
    }
  });

  db.run(`ALTER TABLE users ADD COLUMN bg_value TEXT DEFAULT 'neural'`, (err) => {
    if (err && !String(err.message || '').includes('duplicate column name')) {
      console.error('Failed to add bg_value column to users:', err.message);
    }
  });

  // Insert seed data if empty
  db.get("SELECT COUNT(*) as count FROM users", (err, row) => {
    if (row.count === 0) {
      db.run(`INSERT INTO users (username, password, name, bio, location, avatar, tags) 
              VALUES (?, ?, ?, ?, ?, ?, ?)`, 
              ['johndoe', bcrypt.hashSync('password', 10), 'John Doe', 'Digital Nomad & Creative Technologist.', 'Jakarta, Indonesia', 'https://api.dicebear.com/7.x/avataaars/svg?seed=John', 'Tech,Design,Music'], function(err) {
                if (!err) {
                  const userId = this.lastID;
                  db.run(`INSERT INTO links (user_id, platform, url) VALUES (?, ?, ?), (?, ?, ?), (?, ?, ?)`,
                    [userId, 'LinkedIn', 'https://linkedin.com/in/johndoe', 
                     userId, 'X', 'https://x.com/johndoe', 
                     userId, 'Instagram', 'https://instagram.com/johndoe']);
                }
              });
    }
  });
});

module.exports = db;
