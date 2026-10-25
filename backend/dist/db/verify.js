"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifySchema = void 0;
const db_1 = require("../config/db");
const REQUIRED_DATABASE = 'aadhiran';
const formatValue = (value) => {
    if (value === null || value === undefined)
        return 'NULL';
    return String(value);
};
const verifySchema = async () => {
    const client = await db_1.pool.connect();
    try {
        const dbResult = await client.query('SELECT DATABASE() AS db');
        const activeDatabase = dbResult.rows[0]?.db ?? null;
        if (activeDatabase !== REQUIRED_DATABASE) {
            throw new Error(`Refusing to verify schema: active database is "${activeDatabase ?? 'none'}", expected "${REQUIRED_DATABASE}".`);
        }
        console.log(`Active database verified: ${activeDatabase}`);
        const tables = await client.query(`SELECT table_name, table_type
       FROM information_schema.tables
       WHERE table_schema = DATABASE()
       ORDER BY table_name ASC`);
        console.log(`\n== Tables (${tables.rowCount}) ==`);
        for (const table of tables.rows) {
            const count = await client.query(`SELECT COUNT(*) AS count FROM \`${table.table_name}\``);
            console.log(`- ${table.table_name} [${table.table_type}] rows=${formatValue(count.rows[0]?.count)}`);
        }
        const columns = await client.query(`SELECT table_name, column_name, column_type, is_nullable, column_key, column_default, extra
       FROM information_schema.columns
       WHERE table_schema = DATABASE()
       ORDER BY table_name ASC, ordinal_position ASC`);
        console.log('\n== Columns ==');
        for (const column of columns.rows) {
            console.log(`- ${column.table_name}.${column.column_name} ${column.column_type}` +
                ` null=${column.is_nullable} key=${column.column_key || 'none'}` +
                ` default=${formatValue(column.column_default)} extra=${column.extra || 'none'}`);
        }
        const indexes = await client.query(`SELECT table_name, index_name, non_unique, column_name, seq_in_index
       FROM information_schema.statistics
       WHERE table_schema = DATABASE()
       ORDER BY table_name ASC, index_name ASC, seq_in_index ASC`);
        console.log('\n== Indexes ==');
        for (const index of indexes.rows) {
            console.log(`- ${index.table_name}.${index.index_name} unique=${Number(index.non_unique) === 0 ? 'yes' : 'no'}` +
                ` column=${index.column_name} position=${index.seq_in_index}`);
        }
        const foreignKeys = await client.query(`SELECT k.constraint_name, k.table_name, k.column_name,
              k.referenced_table_name, k.referenced_column_name,
              r.update_rule, r.delete_rule
       FROM information_schema.key_column_usage k
       LEFT JOIN information_schema.referential_constraints r
         ON r.constraint_schema = k.constraint_schema
        AND r.constraint_name = k.constraint_name
       WHERE k.table_schema = DATABASE()
         AND k.referenced_table_name IS NOT NULL
       ORDER BY k.table_name ASC, k.constraint_name ASC`);
        console.log('\n== Foreign Keys ==');
        if (foreignKeys.rowCount === 0) {
            console.log('- none reported by information_schema');
        }
        else {
            for (const fk of foreignKeys.rows) {
                console.log(`- ${fk.table_name}.${fk.column_name} -> ${fk.referenced_table_name}.${fk.referenced_column_name}` +
                    ` name=${fk.constraint_name} on_update=${formatValue(fk.update_rule)} on_delete=${formatValue(fk.delete_rule)}`);
            }
        }
        const migrations = await client.query('SELECT id, name, applied_at FROM schema_migrations ORDER BY id ASC');
        console.log(`\n== Migration History (${migrations.rowCount}) ==`);
        for (const migration of migrations.rows) {
            console.log(`- ${migration.id} | ${migration.name} | applied_at=${formatValue(migration.applied_at)}`);
        }
    }
    finally {
        client.release();
    }
};
exports.verifySchema = verifySchema;
if (require.main === module) {
    (0, exports.verifySchema)()
        .then(() => process.exit(0))
        .catch((error) => {
        console.error('Schema verification failed:', error);
        process.exit(1);
    });
}
