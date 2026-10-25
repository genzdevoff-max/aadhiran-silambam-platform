"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ensureTable = exports.ensureIndex = void 0;
const ensureIndex = async (client, tableName, indexName, columns) => {
    const existing = await client.query(`SELECT index_name FROM information_schema.statistics
     WHERE table_schema = DATABASE()
       AND table_name = '${tableName}'
       AND index_name = '${indexName}'
     LIMIT 1`);
    if (existing.rowCount === 0) {
        await client.query(`CREATE INDEX ${indexName} ON ${tableName}(${columns})`);
    }
};
exports.ensureIndex = ensureIndex;
const ensureTable = async (client, statement) => {
    await client.query(statement);
};
exports.ensureTable = ensureTable;
