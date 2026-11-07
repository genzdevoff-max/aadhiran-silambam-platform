import { pool } from '../backend/src/config/db.js';

async function checkDb() {
  try {
    const res = await pool.query('SELECT `key`, `value` FROM site_settings');
    console.log('Site settings keys:', res.rows.map(r => r.key));
    const heroRow = res.rows.find(r => r.key === 'hero');
    if (heroRow) {
      console.log('Hero setting:', JSON.stringify(heroRow.value, null, 2));
    }
  } catch (e) {
    console.error('Db error:', e.message);
  } finally {
    process.exit(0);
  }
}

checkDb();
