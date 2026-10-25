import { MigrationClient, ensureTable } from './schemaUtils';

export const id = '001_users_audit';
export const name = 'Users and audit logging';

export const up = async (client: MigrationClient): Promise<void> => {
  await ensureTable(client, `
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

  await ensureTable(client, `
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
