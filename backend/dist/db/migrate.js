"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runMigrations = void 0;
const db_1 = require("../config/db");
const migrations_1 = require("./migrations");
const REQUIRED_DATABASE = 'aadhiran';
const assertActiveDatabase = async (client) => {
    const result = await client.query('SELECT DATABASE() AS db');
    const activeDatabase = result.rows[0]?.db ?? null;
    if (activeDatabase !== REQUIRED_DATABASE) {
        throw new Error(`Refusing to run migrations: active database is "${activeDatabase ?? 'none'}", expected "${REQUIRED_DATABASE}".`);
    }
    return activeDatabase;
};
const runMigrations = async () => {
    const client = await db_1.pool.connect();
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
        for (const migration of migrations_1.migrations) {
            const applied = await client.query('SELECT id FROM schema_migrations WHERE id = $1', [migration.id]);
            if (applied.rowCount > 0) {
                console.log(`↷ Skipped ${migration.id} (${migration.name}) — already applied.`);
                continue;
            }
            await migration.up(client);
            await client.query('INSERT INTO schema_migrations (id, name) VALUES ($1, $2)', [migration.id, migration.name]);
            console.log(`✓ Applied ${migration.id} (${migration.name}).`);
        }
        console.log('✓ All migrations applied successfully!');
    }
    catch (error) {
        console.error('✗ Migration error:', error);
        throw error;
    }
    finally {
        client.release();
    }
};
exports.runMigrations = runMigrations;
if (require.main === module) {
    (0, exports.runMigrations)()
        .then(() => process.exit(0))
        .catch(() => process.exit(1));
}
