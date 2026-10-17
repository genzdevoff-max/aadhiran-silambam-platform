"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkDatabaseConnection = exports.query = exports.pool = void 0;
const pg_1 = require("pg");
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config({ path: path_1.default.resolve(__dirname, '../../.env') });
exports.pool = new pg_1.Pool({
    connectionString: process.env.DATABASE_URL || 'postgresql://aadhiran:aadhiran_secure_pwd@localhost:5432/aadhiran_db',
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
});
exports.pool.on('error', (err) => {
    console.error('Unexpected error on idle PostgreSQL client:', err);
});
const query = async (text, params) => {
    const start = Date.now();
    const res = await exports.pool.query(text, params);
    const duration = Date.now() - start;
    if (process.env.NODE_ENV === 'development') {
        // optional debug logging
    }
    return res;
};
exports.query = query;
const checkDatabaseConnection = async () => {
    try {
        const res = await exports.pool.query('SELECT NOW()');
        console.log('✓ PostgreSQL connected successfully at:', res.rows[0].now);
        return true;
    }
    catch (err) {
        console.error('✗ Failed to connect to PostgreSQL:', err);
        return false;
    }
};
exports.checkDatabaseConnection = checkDatabaseConnection;
