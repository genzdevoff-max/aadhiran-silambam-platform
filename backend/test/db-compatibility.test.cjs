process.env.DB_HOST = 'localhost';
process.env.DB_PORT = '4000';
process.env.DB_USER = 'test';
process.env.DB_PASSWORD = 'test';
process.env.DB_NAME = 'test';
process.env.DB_SSL = 'false';

const test = require('node:test');
const assert = require('node:assert/strict');
const { executeQuery, pool, prepareQuery } = require('../dist/config/db.js');

test.after(async () => {
  await pool.end();
});

test('converts PostgreSQL-style numbered parameters to MySQL placeholders', () => {
  const prepared = prepareQuery(
    'SELECT * FROM enquiries WHERE status = $2 AND (full_name ILIKE $1 OR email ILIKE $1) AND id = $2::int',
    ['%test%', 'new']
  );

  assert.equal(
    prepared.sql,
    'SELECT * FROM enquiries WHERE status = ? AND (LOWER(full_name) LIKE LOWER(?) OR LOWER(email) LIKE LOWER(?)) AND id = ?'
  );
  assert.deepEqual(prepared.values, ['new', '%test%', '%test%', 'new']);
});

test('rejects missing numbered SQL parameters', () => {
  assert.throws(() => prepareQuery('SELECT $2', ['only one']), /no matching value/);
});

test('emulates INSERT RETURNING with an explicit UUID and follow-up read', async () => {
  const calls = [];
  const connection = {
    query: async (sql, values) => {
      calls.push({ sql, values });
      if (calls.length === 1) return [{ affectedRows: 1 }, []];
      return [[{ id: values[0], title: 'News title' }], []];
    },
  };

  const result = await executeQuery(
    connection,
    `INSERT INTO news_articles (title, published_at)
     VALUES ($1, NOW())
     RETURNING *`,
    ['News title']
  );

  assert.equal(calls.length, 2);
  assert.match(calls[0].sql, /^INSERT INTO news_articles \(title, published_at, id\)\s+VALUES \(\?, NOW\(\), \?\)/);
  assert.equal(calls[0].values[0], 'News title');
  assert.match(calls[0].values[1], /^[0-9a-f-]{36}$/i);
  assert.match(calls[1].sql, /SELECT \* FROM news_articles WHERE id = \?/);
  assert.deepEqual(calls[1].values, [calls[0].values[1]]);
  assert.equal(result.rowCount, 1);
  assert.equal(result.rows[0].title, 'News title');
});

test('emulates UPDATE RETURNING by selecting the matched row', async () => {
  const calls = [];
  const connection = {
    query: async (sql, values) => {
      calls.push({ sql, values });
      if (calls.length === 1) return [{ affectedRows: 0 }, []];
      return [[{ id: 'record-id', status: 'updated' }], []];
    },
  };

  const result = await executeQuery(
    connection,
    'UPDATE enquiries SET status = $1 WHERE id = $2 RETURNING *',
    ['updated', 'record-id']
  );

  assert.equal(calls[0].sql, 'UPDATE enquiries SET status = ? WHERE id = ?');
  assert.deepEqual(calls[0].values, ['updated', 'record-id']);
  assert.deepEqual(calls[1], {
    sql: 'SELECT * FROM enquiries WHERE id = ?',
    values: ['record-id'],
  });
  assert.equal(result.rowCount, 1);
  assert.equal(result.rows[0].status, 'updated');
});
