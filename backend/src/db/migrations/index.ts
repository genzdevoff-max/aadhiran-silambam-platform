import * as usersAudit from './001_users_audit';
import * as content from './002_content';
import * as media from './003_media';
import * as settingsEnquiries from './004_settings_enquiries';
import * as b2Media from './005_b2_media';
import type { MigrationClient } from './schemaUtils';

export interface Migration {
  id: string;
  name: string;
  up: (client: MigrationClient) => Promise<void>;
}

export const migrations: Migration[] = [
  b2Media, // added migration 005 for B2 columns
  usersAudit,
  content,
  media,
  settingsEnquiries,
];
