import { MigrationClient, ensureIndex, ensureTable } from './schemaUtils';

export const id = '004_settings_enquiries';
export const name = 'Site settings and enquiries';

export const up = async (client: MigrationClient): Promise<void> => {
  await ensureTable(client, `
    CREATE TABLE IF NOT EXISTS site_settings (
      \`key\` VARCHAR(100) PRIMARY KEY,
      \`value\` JSON NOT NULL,
      updated_at DATETIME DEFAULT NOW()
    )
  `);

  await ensureTable(client, `
    CREATE TABLE IF NOT EXISTS enquiries (
      id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
      enquiry_type VARCHAR(50) NOT NULL,
      full_name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL,
      phone VARCHAR(100) NOT NULL,
      age_group VARCHAR(100),
      experience_level VARCHAR(100),
      preferred_location VARCHAR(255),
      message TEXT NOT NULL,
      status VARCHAR(50) DEFAULT 'new',
      admin_notes TEXT,
      ip_address VARCHAR(100),
      created_at DATETIME DEFAULT NOW(),
      updated_at DATETIME DEFAULT NOW()
    )
  `);

  await ensureIndex(client, 'enquiries', 'idx_enquiries_status', 'status');
  await ensureIndex(client, 'enquiries', 'idx_enquiries_type', 'enquiry_type');
};
