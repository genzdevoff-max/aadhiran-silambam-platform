"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.down = exports.up = exports.name = exports.id = void 0;
exports.id = '005_b2_media';
exports.name = 'Add Backblaze B2 columns to media_assets';
const up = async (client) => {
    await client.query(`
    ALTER TABLE media_assets
      ADD COLUMN b2_key VARCHAR(255) NULL,
      ADD COLUMN b2_url VARCHAR(500) NULL;
  `);
};
exports.up = up;
const down = async (client) => {
    await client.query(`
    ALTER TABLE media_assets
      DROP COLUMN IF EXISTS b2_key,
      DROP COLUMN IF EXISTS b2_url;
  `);
};
exports.down = down;
