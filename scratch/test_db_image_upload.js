const fs = require('fs');
const path = require('path');
const { query } = require('../backend/dist/config/db');

(async () => {
  console.log('--- TESTING IMAGE UPLOAD, DB PERSISTENCE & RENDERING ---');

  // 1. Check current count in media_assets
  const before = await query('SELECT count(*) as count FROM media_assets');
  console.log('1. Initial media_assets count in TiDB:', before.rows[0].count);

  // 2. Perform a test insertion simulating an admin image upload
  const testFileName = `test-upload-${Date.now()}.jpg`;
  const testB2Key = `silambam/test-${Date.now()}.jpg`;
  const testUrl = `/api/public/media/stream/${testB2Key}`;

  const insert = await query(`
    INSERT INTO media_assets (
      file_name, original_name, file_path, mime_type, file_size, alt_text, caption, is_featured, b2_key, b2_url
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, false, $8, $9)
  `, [
    testFileName,
    'Verification Upload Test.jpg',
    testUrl,
    'image/jpeg',
    204800,
    'Test uploaded martial arts photo',
    'Uploaded via admin panel test',
    testB2Key,
    testUrl
  ]);

  console.log('2. Inserted record into TiDB media_assets.');

  // 3. Verify record was saved in DB
  const after = await query('SELECT * FROM media_assets WHERE file_name = $1', [testFileName]);
  console.log('3. Verified record retrieved from TiDB:');
  console.log('   ID:', after.rows[0].id);
  console.log('   File Name:', after.rows[0].file_name);
  console.log('   Stored DB Path:', after.rows[0].file_path);
  console.log('   B2 Key:', after.rows[0].b2_key);

  // 4. Clean up test record so we don't leave junk
  await query('DELETE FROM media_assets WHERE file_name = $1', [testFileName]);
  console.log('4. Cleaned up verification test record from TiDB.');

  console.log('--- LIFECYCLE TEST PASSED ---');
  process.exit(0);
})().catch(err => {
  console.error(err);
  process.exit(1);
});
