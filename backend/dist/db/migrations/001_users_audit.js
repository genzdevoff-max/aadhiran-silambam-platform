"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = exports.name = exports.id = void 0;
const schemaUtils_1 = require("./schemaUtils");
exports.id = '001_users_audit';
exports.name = 'Users and audit logging';
const up = async (client) => {
    await (0, schemaUtils_1.ensureTable)(client, `
    CREATE TABLE IF NOT EXISTS users (
      id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
      email VARCHAR(255) UNIQUE NOT NULL,
      password_hash VARCHAR(255) NOT NULL,
      full_name VARCHAR(255) NOT NULL,
      role VARCHAR(50) DEFAULT 'editor',
      is_active BOOLEAN DEFAULT true,
      last_login DATETIME,
      created_at DATETIME DEFAULT NOW(),
      updated_at DATETIME DEFAULT NOW()
    )
  `);
    await (0, schemaUtils_1.ensureTable)(client, `
    CREATE TABLE IF NOT EXISTS audit_logs (
      id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
      user_id CHAR(36),
      action VARCHAR(100) NOT NULL,
      entity_type VARCHAR(100) NOT NULL,
      entity_id CHAR(36),
      details JSON,
      ip_address VARCHAR(100),
      created_at DATETIME DEFAULT NOW(),
      CONSTRAINT fk_audit_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
    )
  `);
};
exports.up = up;
