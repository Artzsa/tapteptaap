const { Pool } = require('pg');
require('dotenv').config({ path: './.env' });
const pool = new Pool({ 
  connectionString: process.env.DATABASE_URL, 
  ssl: { rejectUnauthorized: false } 
});
pool.query("SELECT * FROM links WHERE user_id = 4")
  .then(r => console.log(JSON.stringify(r.rows, null, 2)))
  .catch(e => console.error(e))
  .finally(() => pool.end());
