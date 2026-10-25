import { MigrationClient, ensureIndex, ensureTable } from './schemaUtils';

export const id = '003_media';
export const name = 'Albums, media assets and media references';

export const up = async (client: MigrationClient): Promise<void> => {
  await ensureTable(client, `
    CREATE TABLE IF NOT EXISTS albums (
      id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
      title VARCHAR(255) NOT NULL,
      slug VARCHAR(255) UNIQUE NOT NULL,
      description TEXT,
      category VARCHAR(100) DEFAULT 'general',
      sort_order INT DEFAULT 0,
      is_published BOOLEAN DEFAULT true,
      created_at DATETIME DEFAULT NOW()
    )
  `);

  await ensureTable(client, `
    CREATE TABLE IF NOT EXISTS media_assets (
      id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
      file_name VARCHAR(255) NOT NULL,
      original_name VARCHAR(255) NOT NULL,
      file_path VARCHAR(500) NOT NULL,
      mime_type VARCHAR(100) NOT NULL,
      file_size BIGINT NOT NULL,
      width INT,
      height INT,
      alt_text VARCHAR(255) DEFAULT '',
      caption TEXT,
      album_id CHAR(36),
      is_featured BOOLEAN DEFAULT false,
      created_at DATETIME DEFAULT NOW(),
      CONSTRAINT fk_media_album FOREIGN KEY (album_id) REFERENCES albums(id) ON DELETE SET NULL
    )
  `);

  await ensureTable(client, `
    CREATE TABLE IF NOT EXISTS media_references (
      id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
      media_id CHAR(36) NOT NULL,
      entity_type VARCHAR(100) NOT NULL,
      entity_id CHAR(36) NOT NULL,
      field_name VARCHAR(100) NOT NULL,
      created_at DATETIME DEFAULT NOW(),
      CONSTRAINT fk_media_reference_asset FOREIGN KEY (media_id) REFERENCES media_assets(id) ON DELETE CASCADE
    )
  `);

  await ensureIndex(client, 'media_references', 'idx_media_ref_entity', 'entity_type, entity_id');
};
