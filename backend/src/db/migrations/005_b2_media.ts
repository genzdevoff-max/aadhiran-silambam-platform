import { MigrationClient, ensureTable } from './schemaUtils';

export const id = '005_b2_media';
export const name = 'Add Backblaze B2 columns to media_assets';

export const up = async (client: MigrationClient): Promise<void> => {
  await client.query(`
    ALTER TABLE media_assets
      ADD COLUMN b2_key VARCHAR(255) NULL,
      ADD COLUMN b2_url VARCHAR(500) NULL;
  `);
};

export const down = async (client: MigrationClient): Promise<void> => {
  await client.query(`
    ALTER TABLE media_assets
      DROP COLUMN IF EXISTS b2_key,
      DROP COLUMN IF EXISTS b2_url;
  `);
};
