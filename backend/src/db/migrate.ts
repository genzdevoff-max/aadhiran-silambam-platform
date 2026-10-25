import { pool } from '../config/db';
import { migrations } from './migrations';

const REQUIRED_DATABASE = 'aadhiran';

const assertActiveDatabase = async (client: Awaited<ReturnType<typeof pool.connect>>): Promise<string> => {
  const result = await client.query<{ db: string | null }>('SELECT DATABASE() AS db');
  const activeDatabase = result.rows[0]?.db ?? null;

  if (activeDatabase !== REQUIRED_DATABASE) {
    throw new Error(
      `Refusing to run migrations: active database is "${activeDatabase ?? 'none'}", expected "${REQUIRED_DATABASE}".`
    );
  }

  return activeDatabase;
};

export const runMigrations = async (): Promise<void> => {
  const client = await pool.connect();
  try {
    const activeDatabase = await assertActiveDatabase(client);
    console.log(`Active database verified: ${activeDatabase}`);
    console.log('--- Starting Database Migrations for Aadhiran Silambam ---');

    await client.query(`
      CREATE TABLE IF NOT EXISTS schema_migrations (
        id VARCHAR(100) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        applied_at DATETIME DEFAULT NOW()
      )
    `);

    for (const migration of migrations) {
      const applied = await client.query<{ id: string }>(
        'SELECT id FROM schema_migrations WHERE id = $1',
        [migration.id]
      );

      if (applied.rowCount > 0) {
        console.log(`↷ Skipped ${migration.id} (${migration.name}) — already applied.`);
        continue;
      }

      await migration.up(client);
      await client.query(
        'INSERT INTO schema_migrations (id, name) VALUES ($1, $2)',
        [migration.id, migration.name]
      );
      console.log(`✓ Applied ${migration.id} (${migration.name}).`);
    }

    console.log('✓ All migrations applied successfully!');
  } catch (error) {
    console.error('✗ Migration error:', error);
    throw error;
  } finally {
    client.release();
  }
};

if (require.main === module) {
  runMigrations()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}
