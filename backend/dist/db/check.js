"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = require("../config/db");
const main = async () => {
    try {
        const connected = await (0, db_1.checkDatabaseConnection)();
        if (!connected)
            process.exitCode = 1;
    }
    finally {
        await db_1.pool.end();
    }
};
main().catch((error) => {
    console.error('TiDB connection check failed:', error);
    process.exitCode = 1;
});
