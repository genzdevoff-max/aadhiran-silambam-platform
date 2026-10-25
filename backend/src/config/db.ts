import mysql, { Pool as MysqlPool, PoolConnection, PoolOptions, ResultSetHeader } from 'mysql2/promise';
import { randomUUID } from 'crypto';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({
  path: [
    path.resolve(__dirname, '../../.env.local'),
    path.resolve(__dirname, '../../.env'),
  ],
});

export interface QueryResult<T = Record<string, any>> {
  rows: T[];
  rowCount: number;
}

export const prepareQuery = (text: string, params: unknown[] = []): { sql: string; values: unknown[] } => {
  const values: unknown[] = [];
  const sql = text
    .replace(/::int\b/gi, '')
    .replace(/\b([\w.]+)\s+ILIKE\s+(\$\d+)/gi, 'LOWER($1) LIKE LOWER($2)')
    .replace(/\$(\d+)/g, (_match, position: string) => {
      const index = Number(position) - 1;
      if (index < 0 || index >= params.length) {
        throw new Error(`SQL parameter $${position} has no matching value.`);
      }
      values.push(params[index]);
      return '?';
    });

  return { sql, values };
};

const getDatabaseOptions = (): PoolOptions => {
  const connectionString = process.env.DATABASE_URL;
  let host = process.env.DB_HOST || '127.0.0.1';
  let port = Number(process.env.DB_PORT || 4000);
  let user = process.env.DB_USER;
  let password = process.env.DB_PASSWORD;
  let database = process.env.DB_NAME;
  let sslFromUrl: string | null = null;

  if (connectionString) {
    const parsed = new URL(connectionString);
    if (parsed.protocol !== 'mysql:' && parsed.protocol !== 'mysql2:') {
      throw new Error('DATABASE_URL must use the mysql:// or mysql2:// protocol for TiDB.');
    }
    host = parsed.hostname;
    port = Number(parsed.port || 4000);
    user = decodeURIComponent(parsed.username);
    password = decodeURIComponent(parsed.password);
    database = decodeURIComponent(parsed.pathname.replace(/^\/+/, ''));
    sslFromUrl = parsed.searchParams.get('ssl');
  }

  if (!user || !database) {
    throw new Error('Database configuration is incomplete. Set DATABASE_URL or DB_USER and DB_NAME.');
  }

  const sslSetting = process.env.DB_SSL ?? sslFromUrl ?? 'true';
  const sslEnabled = sslSetting.toLowerCase() !== 'false' && sslSetting !== '0';
  return {
    host,
    port,
    user,
    password,
    database,
    waitForConnections: true,
    connectionLimit: Number(process.env.DB_POOL_MAX || 20),
    maxIdle: 10,
    idleTimeout: 30000,
    connectTimeout: 10000,
    enableKeepAlive: true,
    timezone: 'Z',
    charset: 'utf8mb4',
    ...(sslEnabled ? { ssl: { minVersion: 'TLSv1.2', rejectUnauthorized: true } } : {}),
  };
};

const mysqlPool: MysqlPool = mysql.createPool(getDatabaseOptions());

const findClosingParenthesis = (sql: string, openIndex: number): number => {
  let depth = 0;
  let quote: string | undefined;

  for (let index = openIndex; index < sql.length; index += 1) {
    const character = sql[index];
    if (quote) {
      if (character === quote && sql[index - 1] !== '\\') quote = undefined;
      continue;
    }
    if (character === '\'' || character === '"' || character === '`') {
      quote = character;
    } else if (character === '(') {
      depth += 1;
    } else if (character === ')') {
      depth -= 1;
      if (depth === 0) return index;
    }
  }
  throw new Error('Unbalanced parentheses in SQL statement.');
};

export const executeQuery = async <T = Record<string, any>>(
  connection: Pick<PoolConnection, 'query'>,
  text: string,
  params: unknown[] = []
): Promise<QueryResult<T>> => {
  const returning = /\s+RETURNING\s+([\s\S]+?)\s*;?\s*$/i.exec(text);
  const sqlText = returning ? text.slice(0, returning.index) : text;
  let values = params;
  let queryText = sqlText;
  let insertedId: string | undefined;

  if (returning && /^\s*INSERT\s+INTO\s+/i.test(sqlText)) {
    const insert = /^\s*(INSERT\s+INTO\s+[\w`]+\s*)\(/i.exec(sqlText);
    if (!insert) {
      throw new Error('Could not prepare INSERT ... RETURNING for TiDB.');
    }
    const columnStart = insert[0].lastIndexOf('(');
    const columnEnd = findClosingParenthesis(sqlText, columnStart);
    const valuesClause = /^\s*VALUES\s*\(/i.exec(sqlText.slice(columnEnd + 1));
    if (!valuesClause) {
      throw new Error('Could not prepare INSERT ... RETURNING for TiDB.');
    }
    const valuesStart = columnEnd + 1 + valuesClause[0].lastIndexOf('(');
    const valuesEnd = findClosingParenthesis(sqlText, valuesStart);
    insertedId = randomUUID();
    queryText =
      `${sqlText.slice(0, columnStart)}(${sqlText.slice(columnStart + 1, columnEnd)}, id)` +
      ` ${sqlText.slice(columnEnd + 1, valuesStart)}(${sqlText.slice(valuesStart + 1, valuesEnd)}, $${params.length + 1})` +
      sqlText.slice(valuesEnd + 1);
    values = [...params, insertedId];
  }

  const prepared = prepareQuery(queryText, values);
  const [rawResult] = await connection.query(prepared.sql, prepared.values);

  if (Array.isArray(rawResult)) {
    const rows = rawResult as T[];
    return { rows, rowCount: rows.length };
  }

  const result = rawResult as ResultSetHeader;
  if (returning && /^\s*UPDATE\s+/i.test(sqlText)) {
    const whereId = /\bWHERE\s+id\s*=\s*\$(\d+)/i.exec(sqlText);
    const table = /^\s*UPDATE\s+([\w`]+)/i.exec(sqlText)?.[1];
    if (!whereId || !table) {
      throw new Error('UPDATE ... RETURNING must filter by id for TiDB compatibility.');
    }
    const id = params[Number(whereId[1]) - 1];
    const [selected] = await connection.query(
      `SELECT ${returning[1]} FROM ${table} WHERE id = ?`,
      [id]
    );
    const rows = selected as T[];
    return { rows, rowCount: rows.length };
  }
  if (returning && insertedId) {
    const table = /^\s*INSERT\s+INTO\s+([\w`]+)/i.exec(sqlText)?.[1];
    if (!table) {
      throw new Error('Could not identify table for INSERT ... RETURNING.');
    }
    const [selected] = await connection.query(
      `SELECT ${returning[1]} FROM ${table} WHERE id = ?`,
      [insertedId]
    );
    const rows = selected as T[];
    return { rows, rowCount: rows.length };
  }
  return { rows: [], rowCount: result.affectedRows };
};

export const pool = {
  query: <T = Record<string, any>>(text: string, params?: unknown[]) =>
    executeQuery<T>(mysqlPool, text, params),
  connect: async () => {
    const connection = await mysqlPool.getConnection();
    return {
      query: <T = Record<string, any>>(text: string, params?: unknown[]) =>
        executeQuery<T>(connection, text, params),
      release: () => connection.release(),
    };
  },
  end: () => mysqlPool.end(),
};

export const query = async <T = Record<string, any>>(
  text: string,
  params?: unknown[]
): Promise<QueryResult<T>> => pool.query<T>(text, params);

export const checkDatabaseConnection = async (): Promise<boolean> => {
  try {
    const result = await query<{ now: string }>('SELECT NOW() AS now');
    console.log('✓ TiDB connected successfully at:', result.rows[0]?.now);
    return true;
  } catch (error) {
    const dbError = error as NodeJS.ErrnoException;
    console.error('✗ Failed to connect to TiDB:', dbError.code || dbError.message);
    return false;
  }
};
