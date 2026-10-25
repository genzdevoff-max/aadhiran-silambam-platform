const assert = require('node:assert/strict');
const test = require('node:test');
const { AuditLogger } = require('../dist/services/auditLogger');

test('creates a timestamped event using the audit contract', () => {
  const event = AuditLogger.log({
    actorId: 'admin-test-01',
    action: 'user.role_changed',
    resourceType: 'admin_user',
    resourceId: 'user-test-02',
    metadata: { oldRole: 'editor', newRole: 'super_admin' },
  });

  assert.equal(event.actorId, 'admin-test-01');
  assert.equal(event.action, 'user.role_changed');
  assert.equal(event.resourceType, 'admin_user');
  assert.equal(event.resourceId, 'user-test-02');
  assert.equal(Number.isNaN(Date.parse(event.timestamp)), false);
});

test('redacts secrets and personal identifiers recursively without logging them', () => {
  const event = AuditLogger.log({
    actorId: 'admin-test-03',
    action: 'auth.password_changed',
    resourceType: 'admin_user',
    metadata: {
      password: 'not-to-log',
      nested: {
        currentPassword: 'also-not-to-log',
        email: 'person@example.test',
        authorization: 'Bearer example-secret',
        description: 'Header was Bearer hidden-value',
        safeCount: 2,
      },
    },
  });

  assert.equal(event.metadata.password, '[REDACTED]');
  assert.equal(event.metadata.nested.currentPassword, '[REDACTED]');
  assert.equal(event.metadata.nested.email, '[REDACTED]');
  assert.equal(event.metadata.nested.authorization, '[REDACTED]');
  assert.equal(event.metadata.nested.description, 'Header was [REDACTED]');
  assert.equal(event.metadata.nested.safeCount, 2);
  assert.equal(JSON.stringify(event).includes('not-to-log'), false);
  assert.equal(JSON.stringify(event).includes('example-secret'), false);
});
