import pool from '../backend/dist/config/db.js';

async function updateHeroBg() {
  const res = await pool.query('SELECT `value` FROM site_settings WHERE `key` = $1', ['hero']);
  let hero = {};
  if (res.rows && res.rows[0]) {
    hero = typeof res.rows[0].value === 'string' ? JSON.parse(res.rows[0].value) : res.rows[0].value;
  }
  hero.bgImage = '/api/public/media/stream/silambam/30f575ff-d7dd-45ca-b024-2d3ec970d369.jpg';
  await pool.query('UPDATE site_settings SET `value` = $1 WHERE `key` = $2', [JSON.stringify(hero), 'hero']);
  console.log('Hero background updated in TiDB successfully:', hero.bgImage);
  process.exit(0);
}

updateHeroBg().catch(err => {
  console.error(err);
  process.exit(1);
});
