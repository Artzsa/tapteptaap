const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Koneksi ke Neon/Postgres
// Gunakan ssl: true karena Neon mewajibkan SSL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

pool.on('connect', () => {
  console.log('Connected to the PostgreSQL database.');
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

// Helper untuk meniru fungsi SQLite agar tidak merubah banyak kode di route
const db = {
  query: (text, params) => pool.query(text, params),
  
  // Method get (ambil 1 row)
  get: async (text, params) => {
    const res = await pool.query(text, params);
    return res.rows[0];
  },
  
  // Method all (ambil semua row)
  all: async (text, params) => {
    const res = await pool.query(text, params);
    return res.rows;
  },
  
  // Method run (untuk insert/update/delete)
  run: async (text, params) => {
    return pool.query(text, params);
  }
};

// Inisialisasi Tabel (Migration)
const initDb = async () => {
  try {
    // Users table
    await db.run(`CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
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
    await db.run(`CREATE TABLE IF NOT EXISTS links (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id),
      platform TEXT,
      url TEXT
    )`);

    // Profile views table
    await db.run(`CREATE TABLE IF NOT EXISTS profile_views (
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES users(id),
      viewed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      viewer_ip TEXT,
      viewer_user_agent TEXT
    )`);

    // Link click tracking table
    await db.run(`CREATE TABLE IF NOT EXISTS link_clicks (
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES users(id),
      platform TEXT NOT NULL,
      url TEXT NOT NULL,
      source TEXT DEFAULT 'public_profile',
      clicked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`);

    // Password reset tokens table
    await db.run(`CREATE TABLE IF NOT EXISTS password_resets (
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES users(id),
      token TEXT NOT NULL UNIQUE,
      expires_at TIMESTAMP NOT NULL,
      used INTEGER DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`);

    // Integrations table
    await db.run(`CREATE TABLE IF NOT EXISTS integrations (
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES users(id),
      platform TEXT NOT NULL,
      connected INTEGER DEFAULT 0,
      api_key TEXT,
      webhook_url TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`);

    // Seed data if empty
    const userCount = await db.get("SELECT COUNT(*) FROM users");
    if (parseInt(userCount.count) === 0) {
      const hashedPw = bcrypt.hashSync('password', 10);
      const res = await db.run(`INSERT INTO users (username, password, name, bio, location, avatar, tags) 
                    VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id`, 
                    ['johndoe', hashedPw, 'John Doe', 'Digital Nomad & Creative Technologist.', 'Jakarta, Indonesia', 'https://api.dicebear.com/7.x/avataaars/svg?seed=John', 'Tech,Design,Music']);
      
      const userId = res.rows[0].id;
      await db.run(`INSERT INTO links (user_id, platform, url) VALUES ($1, $2, $3), ($1, $4, $5), ($1, $6, $7)`,
        [userId, 'LinkedIn', 'https://linkedin.com/in/johndoe', 
         'X', 'https://x.com/johndoe', 
         'Instagram', 'https://instagram.com/johndoe']);
    }
    
    console.log('Database tables initialized successfully.');
  } catch (err) {
    console.error('Error initializing database:', err);
  }
};

// Jalankan init
initDb();

module.exports = db;
