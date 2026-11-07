const mysql = require('mysql2/promise');
require('dotenv').config({ path: 'backend/.env' });

(async () => {
  const conn = await mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    ssl: { rejectUnauthorized: true }
  });
  const [rows] = await conn.query('SELECT `key`, `value` FROM site_settings');
  console.log(JSON.stringify(rows, null, 2));
  await conn.end();
})();
