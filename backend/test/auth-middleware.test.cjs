const assert = require('node:assert/strict');
const http = require('node:http');
const test = require('node:test');
const express = require('express');
const jwt = require('jsonwebtoken');
const { requireAuth, requireSuperAdmin } = require('../dist/middleware/auth');

const originalJwtSecret = process.env.JWT_SECRET;
process.env.JWT_SECRET = 'isolated-test-secret-that-is-not-used-outside-tests';

const createServer = () => {
  const app = express();
  app.get('/protected', requireAuth, (_req, res) => res.json({ success: true }));
  app.get('/editor', (req, _res, next) => {
    req.user = { id: 'editor-1', email: 'editor@example.test', role: 'editor', fullName: 'Test Editor' };
    next();
  }, requireSuperAdmin, (_req, res) => res.json({ success: true }));
  app.get('/super-admin', (req, _res, next) => {
    req.user = { id: 'admin-1', email: 'admin@example.test', role: 'super_admin', fullName: 'Test Admin' };
    next();
  }, requireSuperAdmin, (_req, res) => res.json({ success: true }));

  const server = http.createServer(app);
  return new Promise((resolve) => {
    server.listen(0, '127.0.0.1', () => {
      resolve({ server, baseUrl: `http://127.0.0.1:${server.address().port}` });
    });
  });
};

test('rejects missing, invalid, and expired bearer sessions without database access', async (t) => {
  const { server, baseUrl } = await createServer();
  t.after(() => new Promise((resolve) => server.close(resolve)));

  const expiredToken = jwt.sign(
    { id: 'test-user', email: 'user@example.test', role: 'editor' },
    process.env.JWT_SECRET,
    { expiresIn: -1 }
  );
  const cases = [
    { name: 'missing', headers: {} },
    { name: 'invalid', headers: { Authorization: 'Bearer not-a-valid-token' } },
    { name: 'expired', headers: { Authorization: `Bearer ${expiredToken}` } },
  ];

  for (const { name, headers } of cases) {
    const response = await fetch(`${baseUrl}/protected`, { headers });
    assert.equal(response.status, 401, `${name} session should be rejected`);
    const body = await response.json();
    assert.equal(body.success, false);
    assert.doesNotMatch(body.message, /not-a-valid-token|test-user/);
  }
});

test('allows super-admin routes only for the super_admin role', async (t) => {
  const { server, baseUrl } = await createServer();
  t.after(() => new Promise((resolve) => server.close(resolve)));

  const editorResponse = await fetch(`${baseUrl}/editor`);
  assert.equal(editorResponse.status, 403);
  assert.equal((await editorResponse.json()).success, false);

  const adminResponse = await fetch(`${baseUrl}/super-admin`);
  assert.equal(adminResponse.status, 200);
  assert.deepEqual(await adminResponse.json(), { success: true });
});

test.after(() => {
  if (originalJwtSecret === undefined) delete process.env.JWT_SECRET;
  else process.env.JWT_SECRET = originalJwtSecret;
});
